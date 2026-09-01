import { api } from "@/lib/axios";

export const getProfile = async () => {
  const response = await api.get("/me");
  return response.data;
};
