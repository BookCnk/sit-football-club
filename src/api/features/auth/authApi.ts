import { apiClient } from "@/api/shared/client";
import { endpoints } from "@/api/shared/endpoints";
import type { LoginInput, LoginResponse } from "./authTypes";

export const authApi = {
  login: (payload: LoginInput) =>
    apiClient<LoginResponse>(endpoints.authLogin, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
