export interface WhatsAppNumber {
  uuid: string;
  phone_number: string;
  display_name: string | null;
  is_active: boolean;
  order_count: number;
  last_assigned_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateWhatsAppNumberPayload {
  phone_number: string;
  display_name?: string | null;
  is_active?: boolean;
}

export interface UpdateWhatsAppNumberPayload {
  phone_number?: string;
  display_name?: string | null;
  is_active?: boolean;
}
