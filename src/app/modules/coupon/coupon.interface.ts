export type ICoupon = {
  id?: string;
  code: string;
  discount: number;
  validFrom: Date;
  validUntil: Date;
  shopId?: string;
  createdAt: Date;
  updatedAt: Date;
};
