'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from './ordersApi';
import type { OrderStatus, OrdersListParams } from './ordersTypes';

export const ordersKeys = {
  all: ['orders'] as const,
  list: (params: OrdersListParams) => ['orders', params] as const,
};

export function useOrders(params: OrdersListParams) {
  return useQuery({
    queryKey: ordersKeys.list(params),
    queryFn: () => ordersApi.list(params),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: OrderStatus }) =>
      ordersApi.update(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => ordersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}
