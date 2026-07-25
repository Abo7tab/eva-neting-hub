"use client";

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface CategoriesChartProps {
  products: any[] | undefined;
  categories: any[] | undefined;
  isLoading: boolean;
}

const COLORS = [
  '#f43f5e', // rose
  '#fb923c', // orange  
  '#fbbf24', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#06b6d4', // cyan
  '#8b5cf6', // violet
];

export function CategoriesChart({ products, categories, isLoading }: CategoriesChartProps) {
  const chartData = generateCategoryData(products || [], categories || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">المنتجات حسب الأقسام</CardTitle>
          <CardDescription>توزيع المنتجات على الأقسام</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart 
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
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
                  formatter={(value: any) => [`${value} منتج`, 'العدد']}
                  cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function generateCategoryData(products: any[], categories: any[]) {
  const counts: Record<string, number> = {};
  
  categories.forEach(cat => {
    counts[cat.name] = 0;
  });
  
  products.forEach(product => {
    const catName = product.category?.name;
    if (catName && catName in counts) {
      counts[catName]++;
    }
  });
  
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .filter(item => item.count > 0)
    .slice(0, 6);
}
