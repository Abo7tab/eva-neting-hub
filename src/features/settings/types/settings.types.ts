export type SettingValueType = 'text' | 'textarea' | 'image' | 'color' | 'number' | 'boolean';

export interface SiteSetting {
  setting_key: string;
  setting_value: string | null;
  setting_group: string;
  value_type: SettingValueType;
}

export interface UpdateSettingPayload {
  setting_key: string;
  setting_value: string | null;
}

export interface BatchUpdateSettingsPayload {
  settings: UpdateSettingPayload[];
}
