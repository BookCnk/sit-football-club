"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "./authApi";
import type { LoginInput } from "./authTypes";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginInput) => authApi.login(payload),
  });
}
