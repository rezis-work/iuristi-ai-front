import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAvatar,
  getProfile,
  updateProfile,
  type Profile,
  type UpdateProfileData,
} from "../api/profile-api";

/** Shared queryFn - disableRedirect so unauthenticated users get null, not redirect */
async function fetchProfile(): Promise<Profile | null> {
  try {
    return await getProfile({ disableRedirect: true });
  } catch {
    return null;
  }
}

export function useGetMe() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: fetchProfile,
    staleTime: 2 * 60 * 1000, // 2 min - reduce refetches on navigation
    gcTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}