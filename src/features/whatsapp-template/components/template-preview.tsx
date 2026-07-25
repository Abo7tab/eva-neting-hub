'use client';

interface TemplatePreviewProps {
  template: string;
  includeImages: boolean;
}

export function TemplatePreview({ template, includeImages }: TemplatePreviewProps) {
  const sampleData = {
    reference_code: "GB-202607-00001",
    subtotal: "500 ج.م",
    total_price: "500 ج.م",
    total_items: "2",
  };

  const sampleItems = [
    { name: 'كريم مرطب', qty: 1, total: '250 ج.م', img: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
    { name: 'غسول وجه', qty: 1, total: '250 ج.م', img: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' },
  ];

  let itemsText = '';
  sampleItems.forEach((item, idx) => {
    itemsText += `${idx + 1}. ${item.name} × ${item.qty} = ${item.total}\n`;
    if (includeImages) {
      itemsText += `   ${item.img}\n`;
    }
  });

  const renderedTemplate = template
    .replace(/{reference_code}/g, sampleData.reference_code)
    .replace(/{subtotal}/g, sampleData.subtotal)
    .replace(/{total_price}/g, sampleData.total_price)
    .replace(/{total_items}/g, sampleData.total_items)
    .replace(/{items}/g, itemsText.trimEnd());

  return (
    <div className="bg-[#efeae2] p-4 sm:p-6 rounded-lg min-h-[400px] flex flex-col font-sans" dir="rtl">
      <div className="bg-[#d9fdd3] text-[#111b21] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[95%] whitespace-pre-wrap break-words leading-relaxed text-[15px]">
        {renderedTemplate || <span className="opacity-50 italic">لا يوجد محتوى لعرضه</span>}
      </div>
    </div>
  );
}
