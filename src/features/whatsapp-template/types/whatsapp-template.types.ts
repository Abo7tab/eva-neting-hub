export interface WhatsAppSettings {
  whatsapp_order_template: string;
  whatsapp_include_images: boolean;
}

export interface UpdateWhatsAppSettingPayload {
  settings: {
    setting_key: string;
    setting_value: string;
  }[];
}
