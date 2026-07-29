export interface CheckoutPayload {
  customer_name?: string;
  customer_phone?: string;
  items: {
    product_uuid: string;
    quantity: number;
  }[];
}

export interface CheckoutResponse {
  whatsapp_url: string;
  reference_code: string;
}
