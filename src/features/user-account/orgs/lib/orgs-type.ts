"use client";

import { parseAsString, useQueryState } from "nuqs";

export function useOrgType() {
  const [type, setType] = useQueryState("type", parseAsString);

  return { type, setType };
}
