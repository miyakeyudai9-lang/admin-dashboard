import { useMutation } from "@tanstack/react-query";
import { LoginPayload } from "./type";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
export const useLoginHook = () => {
  const router = useRouter();

  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    mutate,
    mutateAsync,
    data,
    error,
    isPending,
    isError,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await api.post("/login", payload);
      return response.data;
    },

    onSuccess: (data) => {
      if (data?.access_token) {
        localStorage.setItem("access_token", data.access_token);
      }

      setAuth(data.user, data.access_token);

      router.push("/admin/dashboard");
    },

    onError: () => {},
  });

  return {
    login: mutate,
    loginAsync: mutateAsync,
    data,
    loading: isPending,
    error,
    isError,
    isSuccess,
    reset,
  };
};

//  const user = useAuthStore(  // to use the user role
//     (state) => state.user,
//   );
