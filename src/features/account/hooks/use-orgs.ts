import { useQuery } from "@tanstack/react-query";
import { getOrg } from "@/src/features/lawer-proile/orgs/api/orgs";

export function useMyOrgs() {
  return useQuery({
    queryKey: ["get-orgs"],
    queryFn: getOrg,
  });
}
