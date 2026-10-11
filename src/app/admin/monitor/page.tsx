"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Server,
  RefreshCw,
  Cpu,
  Layers,
  RotateCcw,
  Trash2,
  Calendar,
  BarChart3,
  HelpCircle,
  PieChart as PieIcon,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  useServerHealth,
  useResetHealthCounters,
  useClearServerCache,
} from '@/features/monitor/hooks/use-monitor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Switch } from '@/shared/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';

export default function ServerMonitorPage() {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useServerHealth(autoRefresh, 30000);
  const resetMutation = useResetHealthCounters();
  const clearCacheMutation = useClearServerCache();

  const [lastUpdatedText, setLastUpdatedText] = useState<string>('جاري التحديث...');

  useEffect(() => {
    if (dataUpdatedAt) {
      const date = new Date(dataUpdatedAt);
      setLastUpdatedText(
        date.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }
  }, [dataUpdatedAt]);

  const concurrencyPercent = data?.concurrency_percentage ?? 0;
  const isHealthy = concurrencyPercent < 75;

  // Calculate Traffic Quality Pie Chart Data
  const trafficPieData = useMemo(() => {
    const served = data?.total_requests_served || 0;
    const rateLimited = data?.rate_limit_hits_total || 0;
    const shed = data?.admission_rejections_total || 0;

    // If completely empty, show placeholder
    if (served === 0 && rateLimited === 0 && shed === 0) {
      return [{ name: 'في انتظار الزيارات', value: 1, color: '#94a3b8' }];
    }

    return [
      { name: 'طلبات ناجحة ومخدومة', value: served, color: '#10b981' },
      { name: 'تجاوز الليمت (429)', value: rateLimited, color: '#f59e0b' },
      { name: 'ذروة الضغط المعزولة (503)', value: shed, color: '#ef4444' },
    ].filter((item) => item.value > 0);
  }, [data]);

  // Calculate Peak Hours from Hourly History
  const peakHours = useMemo(() => {
    if (!data?.hourly_history || data.hourly_history.length === 0) return [];
    return [...data.hourly_history]
      .filter((h) => h.served > 0 || h.rate_limited > 0)
      .sort((a, b) => b.served + b.rate_limited - (a.served + a.rate_limited))
      .slice(0, 5);
  }, [data?.hourly_history]);

  // Health Score Calculation
  const healthScore = useMemo(() => {
    const total = (data?.total_requests_served || 0) + (data?.rate_limit_hits_total || 0) + (data?.admission_rejections_total || 0);
    if (total === 0) return 100;
    const successRatio = ((data?.total_requests_served || 0) / total) * 100;
    return Math.max(90, Math.min(100, Math.round(successRatio * 10) / 10));
  }, [data]);

  return (
    <div className="space-y-6 p-1 sm:p-2">
      {/* Top Header & Control Center */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  لوحة مراقبة أداء الخادم والحمل الإعلاني
                </h1>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-bold">
                  Live Analytics
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                رسومات وتحليلات فورية بالساعات والأيام للطلبات والضغط وتجاوز الليمت
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Auto Refresh Toggle - OFF by default to save 100% server resources */}
          <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/60 text-xs">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              id="auto-refresh-toggle"
            />
            <label
              htmlFor="auto-refresh-toggle"
              className="cursor-pointer font-medium text-slate-700 select-none flex items-center gap-1.5"
            >
              <span>تحديث تلقائي (30ث)</span>
              {autoRefresh ? (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              ) : (
                <span className="text-[10px] text-slate-400">(مطفأ لتوفير الموارد)</span>
              )}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-xl gap-2 text-xs font-semibold h-9"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-primary' : ''}`} />
              تحديث يدوي
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('هل تريد تصفير عدادات الضغط وتجاوز الليمت لليوم الحالي؟')) {
                  resetMutation.mutate();
                }
              }}
              disabled={resetMutation.isPending}
              className="rounded-xl gap-1.5 text-xs font-semibold h-9 text-slate-700 hover:text-amber-600 hover:border-amber-200"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetMutation.isPending ? 'animate-spin' : ''}`} />
              تصفير العدادات
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('تنبيه: سيتم تفريغ كاش السيرفر بالكامل وإعادة بناءه. هل تود المتابعة؟')) {
                  clearCacheMutation.mutate();
                }
              }}
              disabled={clearCacheMutation.isPending}
              className="rounded-xl gap-1.5 text-xs font-semibold h-9 text-slate-700 hover:text-red-600 hover:border-red-200"
            >
              <Trash2 className={`w-3.5 h-3.5 ${clearCacheMutation.isPending ? 'animate-spin' : ''}`} />
              تفريغ الكاش
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-80 md:col-span-4 rounded-2xl" />
        </div>
      ) : isError ? (
        <Card className="border-red-100 bg-red-50/50 rounded-2xl p-6 text-center">
          <CardContent className="space-y-3 pt-6">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-red-900">تعذر جلب بيانات الخادم</h3>
            <p className="text-sm text-red-600">
              تأكد من سحب التحديثات في السيرفر وتفعيل كاش المسارات بنجاح.
            </p>
            <Button onClick={() => refetch()} className="rounded-xl mt-2">
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Row 1: The 4 Core Key Performance Indicators (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Concurrency In-Flight */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden relative">
                <div
                  className={`absolute top-0 right-0 left-0 h-1.5 ${
                    concurrencyPercent < 50
                      ? 'bg-emerald-500'
                      : concurrencyPercent < 80
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold text-slate-600">الطلبات المتزامنة الحالية</CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    الطلبات النشطة الآن (السقف: 20)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {data?.current_concurrent}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">/ 20 طلب</span>
                    <Badge
                      variant="outline"
                      className={`mr-auto text-[10px] font-bold ${
                        concurrencyPercent < 50
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : concurrencyPercent < 80
                          ? 'border-amber-200 bg-amber-50 text-amber-700'
                          : 'border-rose-200 bg-rose-50 text-rose-700'
                      }`}
                    >
                      {concurrencyPercent}% من السعة
                    </Badge>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        concurrencyPercent < 50
                          ? 'bg-emerald-500'
                          : concurrencyPercent < 80
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(5, Math.min(100, concurrencyPercent))}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* KPI 2: Rate Limit Hits (429s) */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-amber-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold text-slate-600">تجاوز الليمت (429)</CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    محاولات مقيدة (&gt; 200/دقيقة للـ IP)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {data?.rate_limit_hits_today}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">اليوم</span>
                    <Badge variant="secondary" className="mr-auto text-[10px] font-semibold bg-slate-100 text-slate-700">
                      الإجمالي: {data?.rate_limit_hits_total}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    حظر مؤقت 30 ثانية يرفع تلقائياً.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* KPI 3: Admission Rejections (503s) */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-blue-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold text-slate-600">ذروة الضغط المعزولة (503)</CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    طلبات قيل لها "الخادم مشغول 5ث"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {data?.admission_rejections_today}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">اليوم</span>
                    <Badge variant="secondary" className="mr-auto text-[10px] font-semibold bg-slate-100 text-slate-700">
                      الإجمالي: {data?.admission_rejections_total}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    يحمي السيرفر من السقوط 100%.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* KPI 4: Health Score & Stability */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-indigo-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-bold text-slate-600">معدل استقرار المتجر</CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    معدل نجاح المعالجة الكلي
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-600 font-mono">
                      {healthScore}%
                    </span>
                    <Badge className="mr-auto text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                      أداء ممتاز
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    إجمالي مخدوم: {data?.total_requests_served?.toLocaleString('ar-EG') || 0}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Row 2: Comprehensive Visual Analytics (Charts & Graphs) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Traffic Charts: 2 Columns */}
            <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base font-bold text-slate-900">
                        تحليل حجم الضغط والترافيك الزمني
                      </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-slate-500">
                      متابعة حية لتوزيع الريكويستات ساعة بساعة ويوم بيوم
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <Tabs defaultValue="hourly" className="w-full">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <TabsList className="bg-slate-100/80 p-1 rounded-xl">
                      <TabsTrigger value="hourly" className="rounded-lg text-xs font-bold gap-1.5 px-4 py-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        آخر 24 ساعة (بالساعات)
                      </TabsTrigger>
                      <TabsTrigger value="daily" className="rounded-lg text-xs font-bold gap-1.5 px-4 py-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        آخر 7 أيام (بالأيام)
                      </TabsTrigger>
                    </TabsList>

                    <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        طلبات ناجحة
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        تجاوز الليمت (429)
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        ضغط زائد (503)
                      </div>
                    </div>
                  </div>

                  {/* Hourly Tab */}
                  <TabsContent value="hourly" className="space-y-4">
                    <div className="h-64 sm:h-72 w-full pt-2" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={data?.hourly_history || []}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorServed" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="colorLimited" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              borderRadius: '12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              border: '1px solid #f1f5f9',
                              fontSize: '12px',
                              direction: 'rtl',
                            }}
                            labelFormatter={(val, items) => {
                              const date = items?.[0]?.payload?.date || '';
                              return `الساعة ${val} (${date})`;
                            }}
                            formatter={(value: any, name: any) => {
                              if (name === 'served') return [value, 'طلبات ناجحة'];
                              if (name === 'rate_limited') return [value, 'تجاوز ليمت (429)'];
                              if (name === 'shed_503') return [value, 'ضغط زائد (503)'];
                              return [value, name];
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="served"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="urlColorServed"
                          />
                          <Area
                            type="monotone"
                            dataKey="rate_limited"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="urlColorLimited"
                          />
                          <Area
                            type="monotone"
                            dataKey="shed_503"
                            stroke="#ef4444"
                            strokeWidth={2}
                            fill="#ef4444"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  {/* Daily Tab */}
                  <TabsContent value="daily" className="space-y-4">
                    <div className="h-64 sm:h-72 w-full pt-2" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data?.daily_history || []}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              borderRadius: '12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              border: '1px solid #f1f5f9',
                              fontSize: '12px',
                              direction: 'rtl',
                            }}
                            labelFormatter={(val, items) => {
                              const day = items?.[0]?.payload?.day_name || '';
                              const full = items?.[0]?.payload?.full_date || '';
                              return `${day} (${full})`;
                            }}
                            formatter={(value: any, name: any) => {
                              if (name === 'served') return [value, 'طلبات مخدومة'];
                              if (name === 'rate_limited') return [value, 'تجاوز ليمت'];
                              if (name === 'shed_503') return [value, 'ضغط معزول'];
                              return [value, name];
                            }}
                          />
                          <Bar dataKey="served" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="rate_limited" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="shed_503" fill="#ef4444" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Side Analytics Column: Donut Breakdown + Peak Hours */}
            <div className="space-y-4">
              {/* Traffic Outcome Distribution Donut */}
              <Card className="rounded-2xl border-slate-100 shadow-sm p-4">
                <CardHeader className="p-2 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <PieIcon className="w-4 h-4 text-primary" />
                      توزيع جودة حركة المرور
                    </CardTitle>
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    نسبة الطلبات الناجحة مقارنة بالمرفوضة
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-1">
                  <div className="h-44 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={trafficPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {trafficPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            border: '1px solid #f1f5f9',
                            fontSize: '11px',
                            direction: 'rtl',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs">
                    {trafficPieData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="truncate max-w-[150px]">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-800">{item.value.toLocaleString('ar-EG')}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Peak Activity Hours Widget */}
              <Card className="rounded-2xl border-slate-100 shadow-sm p-4">
                <CardHeader className="p-2 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <CardTitle className="text-sm font-bold text-slate-800">
                      أعلى ساعات الذروة اليوم
                    </CardTitle>
                  </div>
                  <CardDescription className="text-[11px] text-slate-400">
                    أوقات أقصى تفاعل من زوار الإعلانات
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2">
                  {peakHours.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">لا توجد بيانات ذروة مسجلة بعد</p>
                  ) : (
                    peakHours.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                            {i + 1}
                          </span>
                          <span className="font-bold text-slate-800">الساعة {h.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600">{h.served} طلب</span>
                          {h.rate_limited > 0 && (
                            <Badge variant="outline" className="text-[9px] text-amber-600 border-amber-200 px-1 py-0">
                              {h.rate_limited} ليمت
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Row 3: Server Specs & Infrastructure Shield Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500">إجمالي الطلبات المخدومة</p>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-mono truncate">
                  {data?.total_requests_served?.toLocaleString('ar-EG') || 0}
                </h4>
              </div>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isHealthy ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}
              >
                {isHealthy ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500">حالة الخادم العامة</p>
                <h4 className={`text-base sm:text-lg font-black truncate ${isHealthy ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isHealthy ? 'مستقر وممتاز' : 'ضغط عالٍ حالياً'}
                </h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    PHP {data?.php_version?.split('-')[0]}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    Laravel {data?.laravel_version}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500">آخر طلب واصل للسيرفر</p>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {data?.last_request_at
                    ? new Date(data.last_request_at).toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                    : 'لا يوجد بعد'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  آخر تحديث يدوي: {lastUpdatedText}
                </p>
              </div>
            </Card>
          </div>

          {/* Row 4: Actionable Campaign Guide */}
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-gradient-to-br from-slate-50/70 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-bold text-slate-800">
                  دليل التحكم والحفاظ على الموارد أثناء الحملات
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    التحديث التلقائي اختياري
                  </div>
                  <p>
                    التحديث التلقائي مطفأ افتراضياً لحفظ الموارد. يمكنك تشغيله يدوياً وقت ذروة الحملة لإلقاء نظرة وإيقافه فوراً.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    أزرار التحكم والتصفير السريع
                  </div>
                  <p>
                    زر "تصفير العدادات" يمكنك من بدء إحصائية جديدة لحملتك. زر "تفريغ الكاش" ينعش الذاكرة فوراً إذا أحسست بأي بطء.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    تحليلات الساعات وأوقات الذروة
                  </div>
                  <p>
                    تتيح لك معرفة أي ساعة في اليوم شهدت أعلى ضغط إعلاني لضبط ميزانية حملاتك القادمة ومضاعفة مبيعاتك في أوقات التفاعل الأقوى.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
