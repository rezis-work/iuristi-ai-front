import { useQuery } from "@tanstack/react-query";
import { GetMe } from "../api/auth";



export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await GetMe();
        return response;
      } catch (error) {
        console.log("failed to fetch me", error);
        return null;
      }
    },
  });
}

