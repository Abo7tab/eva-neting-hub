"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useBrand } from '@/features/brands/hooks/use-brands';
import { BrandForm } from '@/features/brands/components/brand-form';
import { Button } from '@/shared/components/ui/button';

interface EditBrandPageProps {
  params: Promise<{ uuid: string }>;
}

export default function EditBrandPage({ params }: EditBrandPageProps) {
  const { uuid } = use(params);
  const router = useRouter();
  const { data: brand, isLoading, isError } = useBrand(uuid);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (isError || !brand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-xl font-semibold text-slate-800">لم يتم العثور على البراند</h2>
        <Button variant="outline" onClick={() => router.push('/admin/brands')}>
          العودة للقائمة
        </Button>
      </div>
    );
  }

  return <BrandForm brand={brand} />;
}
