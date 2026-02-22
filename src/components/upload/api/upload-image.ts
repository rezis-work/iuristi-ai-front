import { api } from "@/src/lib/api";

export type UploadKind = "avatar" | "org_logo";

type CreateUploadUrlResponse = {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  expiresIn: number;
  maxBytes: number;
};

type FinalizeUploadResponse = {
  valid: boolean;
  size?: number;
  contentType?: string;
  error?: string;
};

/**
 * File upload flow:
 * 1. POST /files/upload-url - get presigned URL
 * 2. PUT file directly to uploadUrl (S3)
 * 3. POST /files/finalize - validate the upload
 * @returns { fileUrl, key } - public URL and S3 key for PATCH /me/profile
 */
export async function uploadImage(
  file: File,
  kind: UploadKind,
  orgId?: string
): Promise<{ fileUrl: string; key: string }> {
  const mimeType = file.type;
  const allowedMimes = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedMimes.includes(mimeType)) {
    throw new Error(`Allowed formats: PNG, JPEG, WebP. Got: ${mimeType}`);
  }

  if (kind === "org_logo" && !orgId) {
    throw new Error("orgId is required when uploading org_logo");
  }

  // 1. Get presigned URL
  const payload: { kind: UploadKind; mimeType: string; orgId?: string } = {
    kind,
    mimeType,
  };
  if (orgId) payload.orgId = orgId;

  const { uploadUrl, fileUrl, key, maxBytes } = await api<CreateUploadUrlResponse>(
    "/files/upload-url",
    {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    }
  );

  if (file.size > maxBytes) {
    throw new Error(`File size exceeds limit (${Math.round(maxBytes / 1024)} KB)`);
  }

  // 2. Upload file to S3 (presigned URL - no Authorization header needed)
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": mimeType,
    },
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    throw new Error(`Upload failed: ${putRes.status} ${text || putRes.statusText}`);
  }

  // 3. Finalize/validate upload
  const finalize = await api<FinalizeUploadResponse>("/files/finalize", {
    method: "POST",
    body: JSON.stringify({ key }),
    auth: true,
  });

  if (!finalize.valid) {
    throw new Error(finalize.error || "Upload validation failed");
  }

  // Backend შეიძლება დააბრუნოს presigned URL (X-Amz- params) - ეს არის PUT-ისთვის,
  // img src-ში არ იმუშავებს. ვიყენებთ მხოლოდ base URL-ს (მუდმივი S3 object URL).
  const permanentUrl = fileUrl.includes("X-Amz-") ? fileUrl.split("?")[0] : fileUrl;
  return { fileUrl: permanentUrl, key };
}