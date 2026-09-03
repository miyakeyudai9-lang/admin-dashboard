"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/auth.service";

export function useProfile() {
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");

  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: hasToken,
    retry: false,
  });
}
