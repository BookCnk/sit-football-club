export type OrderStatus = 'pending' | 'verified' | 'completed' | 'cancelled';

export type ShopOrder = {
  id: number;
  shopItemId: number;
  contactPhone: string;
  contactEmail: string;
  selectedSize?: string | null;
  screenName?: string | null;
  screenNumber?: string | null;
  slipImageUrl: string;
  slipFilePath: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shopItem: {
    id: number;
    name: string;
    subtitle?: string | null;
    price: number;
  };
};

export type OrdersListResponse = {
  data: ShopOrder[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type OrdersListParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
};
