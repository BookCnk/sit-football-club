import { apiClient } from "@/api/shared/client";
import { endpoints } from "@/api/shared/endpoints";
import type {
  CreateShopItemInput,
  ShopItem,
  UpdateShopItemInput,
} from "./shopItemsTypes";

export const shopItemsApi = {
  list: () =>
    apiClient<ShopItem[]>(endpoints.shopItems, {
      method: "GET",
      cache: "no-store",
    }),

  getById: (id: number | string) =>
    apiClient<ShopItem>(endpoints.shopItemById(id), {
      method: "GET",
      cache: "no-store",
    }),

  create: (payload: CreateShopItemInput) =>
    apiClient<ShopItem>(endpoints.shopItems, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: number | string, payload: UpdateShopItemInput) =>
    apiClient<ShopItem>(endpoints.shopItemById(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: number | string) =>
    apiClient<{ message: string }>(endpoints.shopItemById(id), {
      method: "DELETE",
    }),
};
