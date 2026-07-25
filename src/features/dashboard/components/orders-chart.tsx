"use client";

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { RecentOrder } from '../types/dashboard.types';

interface OrdersChartProps {
  orders: RecentOrder[] | undefined;
  isLoading: boolean;
}

export function OrdersChart({ orders, isLoading }: OrdersChartProps) {
  // Generate last 7 days data
  const chartData = generateLast7DaysData(orders || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الطلبات آخر 7 أيام</CardTitle>
          <CardDescription>عدد الطلبات اليومية</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart 
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  reversed
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  orientation="right"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    direction: 'rtl',
                    padding: '8px 12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: '#f43f5e', fontWeight: 500 }}
                  formatter={(value: any) => [`${value} طلب`, 'العدد']}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#f43f5e" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorOrders)"
                  dot={{ fill: '#f43f5e', r: 4 }}
                  activeDot={{ r: 6, fill: '#f43f5e' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function generateLast7DaysData(orders: RecentOrder[]) {
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const result = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = days[date.getDay()];
    
    // Count orders for this day
    const count = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.toDateString() === date.toDateString();
    }).length;
    
    result.push({
      date: dayName,
      count,
    });
  }
  
  return result;
}
