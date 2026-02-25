export type ShopItem = {
  id: number;
  name: string;
  subtitle?: string | null;
  price: number;
  badge?: string | null;

  // คุณใช้ JSONB ใน DB → ฝั่ง FE จะเป็น any/unknown ได้
  images: unknown; // เช่น string[] หรือ {url:string}[]
  sizes?: unknown; // เช่น string[] หรือ {label:string}[]

  description: string;
  payment?: string | null;
  shipping?: string | null;
  createdAt: string; // ISO string
};

export type CreateShopItemInput = {
  name: string;
  subtitle?: string | null;
  price: number | string;
  badge?: string | null;
  images: unknown;
  sizes?: unknown;
  description: string;
  payment?: string | null;
  shipping?: string | null;
};

export type UpdateShopItemInput = Partial<CreateShopItemInput>;
