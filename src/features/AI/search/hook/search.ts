import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getArticleById,
  getCollectionStats,
  search,
  type SearchRequest,
  type SearchResponse,
} from "../api/search";
import { toast } from "sonner";


export function useSearch() {
  return useMutation<SearchResponse[], Error, SearchRequest>({
    mutationKey: ["search"],
    mutationFn: async (data: SearchRequest) => {
      try {
        const response = await search(data);
        return response;
      } catch (error) {
        console.error("Search error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("ძიება წარმატებულად დასრულდა");
    },
    onError: () => {
      toast.error("ძიება ვერ დასრულდა, სცადეთ თავიდან");
    },
  });
}



export function useGetArticleById(id: string) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const response = await getArticleById(id);
      return response;
    },
    enabled: Boolean(id),
  });
}



export function useGetCollectionStats() {
  return useQuery({
    queryKey: ["collection-stats"],
    queryFn: async () => {
      const response = await getCollectionStats();
      return response;
    },
  });
}