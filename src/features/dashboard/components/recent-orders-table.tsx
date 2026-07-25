"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import type { RecentOrder } from '../types/dashboard.types';

interface RecentOrdersTableProps {
  orders: RecentOrder[] | undefined;
  isLoading: boolean;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'قيد الانتظار', variant: 'secondary' },
  redirected: { label: 'مُحوَّل', variant: 'default' },
  failed: { label: 'فشل', variant: 'destructive' },
};

export function RecentOrdersTable({ orders, isLoading }: RecentOrdersTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">آخر الطلبات</CardTitle>
            <CardDescription>أحدث 5 طلبات مسجلة</CardDescription>
          </div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              عرض الكل
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-rose-400" />
              </div>
              <p className="text-slate-900 font-medium mb-1">لا توجد طلبات بعد</p>
              <p className="text-sm text-slate-500">
                سيظهر هنا آخر الطلبات عند وصولها
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[500px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">القطع</TableHead>
                    <TableHead className="text-right">الإجمالي</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const status = statusLabels[order.status] || statusLabels.pending;
                    return (
                      <TableRow key={order.uuid} className="cursor-pointer hover:bg-slate-50 transition-colors">
                        <TableCell className="font-mono text-xs">{order.reference_code}</TableCell>
                        <TableCell>{order.customer_name || 'غير محدد'}</TableCell>
                        <TableCell>{order.total_items}</TableCell>
                        <TableCell className="font-semibold">
                          {Number(order.total_price).toLocaleString('ar-EG')} ج
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
