import { SiteSetting } from '../types/settings.types';
import { SETTING_LABELS } from '../lib/setting-labels';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { ImageSettingField } from './image-setting-field';

interface SettingFieldProps {
  setting: SiteSetting;
  value: string | null;
  onChange: (key: string, val: string | null) => void;
}

export function SettingField({ setting, value, onChange }: SettingFieldProps) {
  const label = SETTING_LABELS[setting.setting_key] || setting.setting_key;

  if (setting.value_type === 'image') {
    return <ImageSettingField settingKey={setting.setting_key} value={value} onChange={onChange} />;
  }

  if (setting.value_type === 'boolean') {
    return (
      <div className="flex items-center justify-between space-x-2 space-x-reverse rounded-lg border p-4 shadow-sm">
        <div className="space-y-0.5">
          <Label>{label}</Label>
          <div className="text-[0.8rem] text-muted-foreground">{setting.setting_key}</div>
        </div>
        <Switch
          checked={value === 'true' || value === '1'}
          onCheckedChange={(checked) => onChange(setting.setting_key, checked ? 'true' : 'false')}
        />
      </div>
    );
  }

  if (setting.value_type === 'textarea') {
    return (
      <div className="space-y-2">
        <Label htmlFor={setting.setting_key}>{label}</Label>
        <Textarea
          id={setting.setting_key}
          value={value || ''}
          onChange={(e) => onChange(setting.setting_key, e.target.value)}
          className="min-h-[100px] text-right"
          dir="auto"
        />
        <div className="text-xs text-muted-foreground">{setting.setting_key}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={setting.setting_key}>{label}</Label>
      <Input
        id={setting.setting_key}
        type={setting.value_type === 'number' ? 'number' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(setting.setting_key, e.target.value)}
        className="text-right"
        dir="auto"
      />
      <div className="text-xs text-muted-foreground">{setting.setting_key}</div>
    </div>
  );
}
