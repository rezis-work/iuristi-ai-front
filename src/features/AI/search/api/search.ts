import { api } from "@/src/lib/api";



export type CollectionStats = {
  pointsCount: number;
  indexedVectorsCount: number;
  status: string;
};

export type SearchResponse = {
  id: string;
  score: number;
  articleNumber: string;
  lawTitle: string;
  chapter?: string;
  text: string;
  sourceUrl: string;
};

export type SearchRequest = {
  query: string;
  lawCode?: string;
  chapter?: string;
  topK?: number;
  scoreThreshold?: number;
};

export async function search(data: SearchRequest) {
  try {
    const response = await api<SearchResponse[]>("/agent/search", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}



export async function getArticleById(id: string) {
  try {
    const response = await api<SearchResponse>(`/agent/search/articles/${id}`);
    return response;
  } catch (error) {
    console.error("Get article by id error:", error);
    throw error;
  }
}


export async function getCollectionStats() {
  try {
    const response = await api<CollectionStats>("/agent/search/collections/stats");
    return response;
  } catch (error) {
    console.error("Get collection stats error:", error);
    throw error;
  }
}