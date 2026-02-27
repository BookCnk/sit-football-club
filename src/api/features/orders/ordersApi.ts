import { apiClient } from '@/api/shared/client';
import { endpoints } from '@/api/shared/endpoints';
import type { OrderStatus, OrdersListParams, OrdersListResponse, ShopOrder } from './ordersTypes';

function toQueryString(params: OrdersListParams) {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set('page', String(params.page));
  }

  if (params.pageSize) {
    searchParams.set('pageSize', String(params.pageSize));
  }

  if (params.status && params.status !== 'all') {
    searchParams.set('status', params.status);
  }

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const ordersApi = {
  list: (params: OrdersListParams) =>
    apiClient<OrdersListResponse>(`${endpoints.orders}${toQueryString(params)}`, {
      method: 'GET',
      cache: 'no-store',
    }),

  update: (id: number | string, status: OrderStatus) =>
    apiClient<ShopOrder>(endpoints.orderById(id), {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  remove: (id: number | string) =>
    apiClient<{ message: string }>(endpoints.orderById(id), {
      method: 'DELETE',
    }),
};
