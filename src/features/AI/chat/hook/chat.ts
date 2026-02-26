import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ChatRequestSchema } from "../schemas/chat-schema";
import {
  chatWithAI,
  deleteConversation,
  getConversationHistory,
  streamChat, // თუ შენთან streamEvent ჰქვია, ეს სახელი შეცვალე
  type ChatStreamEvent,
  type StoredConversation,
} from "../api/chat";

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
    mutationFn: ({ data, onEvent }: StreamMutationInput) =>
      streamChat(data, onEvent), // თუ შენთან streamEvent-ია, აქაც შეცვალე
    onError: () => {
      toast.error("სტრიმინგი შეწყდა, სცადეთ თავიდან");
    },
  });
}

export function useGetConversationHistory(conversationId?: string) {
  return useQuery<StoredConversation>({
    queryKey: ["chat-history", conversationId],
    enabled: Boolean(conversationId),
    queryFn: async () => {
      if (!conversationId) {
        throw new Error("conversationId is required");
      }
      return getConversationHistory(conversationId);
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: async (_data, conversationId) => {
      queryClient.removeQueries({ queryKey: ["chat-history", conversationId] });
      // სურვილის მიხედვით cache list-იც გაასუფთავე:
      // queryClient.invalidateQueries({ queryKey: ["chat-conversations"] });
      toast.success("საუბარი წაიშალა");
    },
    onError: () => {
      toast.error("საუბრის წაშლა ვერ მოხერხდა");
    },
  });
}