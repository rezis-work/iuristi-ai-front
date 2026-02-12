/**
 * AWS S3 upload utilities
 */

import { getToken } from "../api";

export interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
  publicUrl: string;
}

/**
 * Get a presigned PUT URL for uploading a file to S3
 */
export async function getPresignedPutUrl(
  mimeType: string,
  kind: string = "avatar",
): Promise<PresignedUrlResponse> {
  const token = getToken();

  if (!token) {
    console.error("[S3] No token found in localStorage");
    throw new Error("Authentication required. Please log in.");
  }

  console.log(
    "[S3] Token found, requesting presigned URL. MIME type:",
    mimeType,
  );

  const response = await fetch("/api/upload/presigned-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mimeType,
      kind,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[S3] Failed to get presigned URL:", error);
    throw new Error(error.message || "Failed to get presigned URL");
  }

  const data = await response.json();
  console.log("[S3] Successfully got presigned URL");
  return data;
}

/**
 * Upload file to S3 using presigned URL
 */
export async function uploadFileToS3(
  file: File,
  presignedUrl: string,
): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to S3");
  }
}
