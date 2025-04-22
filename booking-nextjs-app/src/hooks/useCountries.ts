import { useQuery } from "@tanstack/react-query";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch("/api/countries", { method: "GET" });

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.error || "Не удалось запросить страны");

      return result;
    },
  });
};
