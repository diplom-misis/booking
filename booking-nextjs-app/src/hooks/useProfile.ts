import { ProfileSchema } from "@/schemas/profile";
import { queryClient } from "@/utils/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";

export const PROFILE_QUERY_KEY = ["profile"];

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/profile", { method: "GET" });

      const result = await res.json();

      if (!res.ok)
        throw new Error(
          result.error || "Не удалось запросить данные пользователя",
        );

      return result;
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: ProfileSchema) => {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok)
        throw new Error(
          result.error || "Не удалось обновить данные пользователя",
        );

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};
