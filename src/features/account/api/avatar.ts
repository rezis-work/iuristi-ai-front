import { api } from "@/src/lib/api";

export type PresignResponse = {
  uploadUrl: string; // pre-signed PUT URL
  key: string; // S3 object key
  url: string; // public CDN URL
};

export async function presignAvatar(
  fileName: string,
  contentType: string,
): Promise<PresignResponse> {
  try {
    const response = await api<PresignResponse>("/me/avatar/presign", {
      method: "POST",
      body: JSON.stringify({ fileName, contentType }),
      auth: true,
    });
    return response;
  } catch (error) {
    console.log("Failed to get presign url", error);
    throw error;
  }
}
