"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shopItemsApi } from "./shopItemsApi";
import type {
  CreateShopItemInput,
  UpdateShopItemInput,
} from "./shopItemsTypes";

export const shopItemsKeys = {
  all: ["shop-items"] as const,
  detail: (id: number | string) => ["shop-items", id] as const,
};

export function useShopItems() {
  return useQuery({
    queryKey: shopItemsKeys.all,
    queryFn: shopItemsApi.list,
  });
}

export function useShopItem(id: number | string) {
  return useQuery({
    queryKey: shopItemsKeys.detail(id),
    queryFn: () => shopItemsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateShopItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShopItemInput) => shopItemsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopItemsKeys.all }),
  });
}

export function useUpdateShopItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number | string;
      payload: UpdateShopItemInput;
    }) => shopItemsApi.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: shopItemsKeys.all });
      qc.invalidateQueries({ queryKey: shopItemsKeys.detail(vars.id) });
    },
  });
}

export function useDeleteShopItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => shopItemsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: shopItemsKeys.all }),
  });
}
