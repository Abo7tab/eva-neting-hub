import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { TemplateEditor } from '@/features/whatsapp-template/components/template-editor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'قالب الواتساب - لوحة التحكم',
};

export default function WhatsAppTemplatePage() {
  return (
    <div className="space-y-6">
      <ListPageHeader
        title="قالب رسالة الواتساب"
        description="تخصيص الرسالة التي تُرسل للعملاء عند إتمام الطلب"
      />
      <TemplateEditor />
    </div>
  );
}
