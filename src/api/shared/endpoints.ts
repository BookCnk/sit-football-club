export const endpoints = {
  shopItems: "/api/shop-items",
  shopItemById: (id: string | number) => `/api/shop-items/${id}`,
  orders: "/api/orders",
  orderById: (id: string | number) => `/api/orders/${id}`,
  authLogin: "/api/auth/login",
};
