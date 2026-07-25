'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { PlaceholderChips } from './placeholder-chips';
import { TemplatePreview } from './template-preview';
import { useWhatsAppSettings, useUpdateWhatsAppTemplate, useUpdateIncludeImages } from '../hooks/use-whatsapp-template';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Info } from 'lucide-react';

export function TemplateEditor() {
  const { data: settings, isLoading } = useWhatsAppSettings();
  const updateTemplateMutation = useUpdateWhatsAppTemplate();
  const updateIncludeImagesMutation = useUpdateIncludeImages();

  const [template, setTemplate] = useState('');
  const [includeImages, setIncludeImages] = useState(true);
  const [error, setError] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (settings) {
      setTemplate(settings.whatsapp_order_template);
      setIncludeImages(settings.whatsapp_include_images);
    }
  }, [settings]);

  const handleInsertPlaceholder = (placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = template;

    const newText = currentText.substring(0, start) + placeholder + currentText.substring(end);
    setTemplate(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
    }, 0);
  };

  const handleSave = () => {
    if (!template.trim()) {
      setError('لا يمكن أن يكون القالب فارغاً');
      return;
    }
    if (!template.includes('{')) {
      setError('يجب استخدام متغير واحد على الأقل في القالب');
      return;
    }
    setError('');
    updateTemplateMutation.mutate(template);
  };

  const handleToggleImages = (checked: boolean) => {
    setIncludeImages(checked);
    updateIncludeImagesMutation.mutate(checked);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[500px] bg-muted animate-pulse rounded-lg" />
        <div className="h-[500px] bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* محرّر القالب */}
        <Card>
          <CardHeader>
            <CardTitle>محرر القالب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PlaceholderChips onInsert={handleInsertPlaceholder} disabled={updateTemplateMutation.isPending} />
            
            <div className="space-y-2">
              <textarea
                ref={textareaRef}
                value={template}
                onChange={(e) => {
                  setTemplate(e.target.value);
                  if (error) setError('');
                }}
                disabled={updateTemplateMutation.isPending}
                className="w-full min-h-96 p-4 border rounded-md font-mono text-[15px] leading-relaxed whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background resize-y"
                dir="rtl"
                placeholder="اكتب قالب الرسالة هنا..."
              />
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="include_images">تضمين صور المنتجات في الرسالة</Label>
              </div>
              <Switch
                id="include_images"
                checked={includeImages}
                onCheckedChange={handleToggleImages}
                disabled={updateIncludeImagesMutation.isPending}
              />
            </div>

            <div className="pt-2">
              <Button 
                onClick={handleSave} 
                disabled={updateTemplateMutation.isPending}
                className="w-full lg:w-auto"
              >
                {updateTemplateMutation.isPending ? 'جاري الحفظ...' : 'حفظ القالب'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* معاينة الرسالة */}
        <Card>
          <CardHeader>
            <CardTitle>معاينة الرسالة</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplatePreview template={template} includeImages={includeImages} />
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-muted/50 border-primary/20">
        <CardHeader className="pb-3 flex flex-row items-center gap-2 space-y-0">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle className="text-base text-primary">ملاحظة حول الصور</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-foreground">
            روابط الواتساب لا تدعم إرسال الصور مباشرة. الصور تظهر كروابط قابلة للضغط، والعميل يستطيع فتحها في المتصفح.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
