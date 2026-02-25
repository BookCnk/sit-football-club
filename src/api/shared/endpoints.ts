export const endpoints = {
  shopItems: "/api/shop-items",
  shopItemById: (id: string | number) => `/api/shop-items/${id}`,
  authLogin: "/api/auth/login",
};
