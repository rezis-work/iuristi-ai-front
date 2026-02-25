// Shared organization utilities (mirrors backend UUID validation)

export const ORG_ID_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function assertValidOrgId(orgId: string): void {
  if (!ORG_ID_UUID_REGEX.test(orgId)) {
    throw new Error("ორგანიზაციის ID-ის ფორმატი არასწორია (უნდა იყოს UUID)");
  }
}

/**
 * Helper function to create API options with org context
 * Automatically adds x-org-id header when orgId is provided
 */
export function withOrgContext(
  orgId: string | null | undefined,
  options: RequestInit & { auth?: boolean; disableRedirect?: boolean } = {}
): RequestInit & { auth?: boolean; disableRedirect?: boolean } {
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  // Add x-org-id header if orgId is provided
  if (orgId) {
    assertValidOrgId(orgId);
    (headers as Record<string, string>)["x-org-id"] = encodeURIComponent(orgId);
  }

  return {
    ...options,
    headers,
  };
}


