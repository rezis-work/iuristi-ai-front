import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatRequestSchema } from "../schemas/chat-schema";
import {
  chatWithAI,
  deleteConversation,
  getConversationHistory,
  streamEvent,
  type ChatStreamEvent,
} from "../api/chat";
import { toast } from "sonner";

export function useAiChat() {
  return useMutation({
    mutationKey: ["chat"],
    mutationFn: (data: ChatRequestSchema) => chatWithAI(data),
    onSuccess: () => {
      toast.success("საუბარი შედგა!");
    },
    onError: () => {
      toast.error("ცადეთ თავიდან");
    },
  });
}

type StreamMutationInput = {
  data: ChatRequestSchema;
  onEvent: (event: ChatStreamEvent) => void;
};

export function useAiChatStream() {
  return useMutation({
    mutationKey: ["chat-stream"],
    mutationFn: ({ data, onEvent }: StreamMutationInput) => streamEvent(data, onEvent),
    onError: () => {
      toast.error("სტრიმინგი შეწყდა, სცადეთ თავიდან");
    },
  });
}

export function useGetConversationHistory(conversationId?: string) {
  return useQuery({
    queryKey: ["chat-history", conversationId],
    enabled: !!conversationId,
    queryFn: () => getConversationHistory(conversationId as string),
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.removeQueries({ queryKey: ["chat-history", conversationId] });
      toast.success("საუბარი წაიშალა");
    },
    onError: () => {
      toast.error("საუბრის წაშლა ვერ მოხერხდა");
    },
  });
}