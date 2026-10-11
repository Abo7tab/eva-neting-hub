"use client";

import { useEffect, useState } from 'react';
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
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useServerHealth } from '@/features/monitor/hooks/use-monitor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function ServerMonitorPage() {
  const { data, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useServerHealth();
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

  return (
    <div className="space-y-6 p-1 sm:p-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                مراقبة أداء الخادم والحمل الإعلاني
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                متابعة حية للطلبات المتزامنة ومعدلات تجاوز الليمت والضغط
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs text-slate-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>تحديث تلقائي (كل 10 ثوانٍ)</span>
            <span className="text-slate-400">|</span>
            <span className="font-mono text-slate-700">{lastUpdatedText}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl gap-2 text-xs font-semibold h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-primary' : ''}`} />
            تحديث فوري
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : isError ? (
        <Card className="border-red-100 bg-red-50/50 rounded-2xl p-6 text-center">
          <CardContent className="space-y-3 pt-6">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-red-900">تعذر جلب بيانات الخادم</h3>
            <p className="text-sm text-red-600">
              تأكد من تطبيق التحديثات على السيرفر وتشغيل الباك إند بنجاح.
            </p>
            <Button onClick={() => refetch()} className="rounded-xl mt-2">
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Row 1: The 3 Core Safety Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1: In-Flight Concurrency Meter */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                    <CardTitle className="text-sm font-bold text-slate-700">
                      الطلبات المتزامنة الآن
                    </CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                  </div>
                  <CardDescription className="text-xs text-slate-400">
                    الطلبات النشطة في نفس اللحظة (السقف: 20)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                      {data?.current_concurrent}
                    </span>
                    <span className="text-sm text-slate-400 font-bold">
                      / {data?.max_concurrent_limit} طلب نشط
                    </span>
                    <Badge
                      variant="outline"
                      className={`mr-auto text-xs font-bold ${
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
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
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
                  <p className="text-[11px] text-slate-500">
                    نظام Admission Control يضمن عدم تجاوز السقف لحماية المعالج.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Metric 2: Rate Limit Hits (429s) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-amber-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-700">
                      تجاوز معدل الطلبات (Rate Limit)
                    </CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  </div>
                  <CardDescription className="text-xs text-slate-400">
                    محاولات تم تقييدها بـ 429 لحماية السيرفر
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                      {data?.rate_limit_hits_today}
                    </span>
                    <span className="text-sm text-slate-400 font-bold">اليوم</span>
                    <Badge variant="secondary" className="mr-auto text-xs font-semibold bg-slate-100 text-slate-700">
                      الإجمالي: {data?.rate_limit_hits_total}
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">سقف التصفح:</span>
                      <span className="font-bold text-slate-800">200 طلب / دقيقة للـ IP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">مدة الحظر:</span>
                      <span className="font-bold text-emerald-600">30 ثانية تلقائياً</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Metric 3: Admission Rejections (503s) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-blue-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-700">
                      ذروة الضغط المعزولة (Load Shedding)
                    </CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <CardDescription className="text-xs text-slate-400">
                    طلبات قيل لها "الخادم مشغول، جرب بعد 5 ثوانٍ"
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                      {data?.admission_rejections_today}
                    </span>
                    <span className="text-sm text-slate-400 font-bold">اليوم</span>
                    <Badge variant="secondary" className="mr-auto text-xs font-semibold bg-slate-100 text-slate-700">
                      الإجمالي: {data?.admission_rejections_total}
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">حالة السيرفر:</span>
                      <span className="font-bold text-emerald-600">محمي من السقوط بنسبة 100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">إعادة المحاولة:</span>
                      <span className="font-bold text-slate-800">تلقائية من المتصفح</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Row 2: Secondary Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 4: Total Requests Served */}
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

            {/* Card 5: Overall Server Status */}
            <Card className="rounded-2xl border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isHealthy ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}
              >
                {isHealthy ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500">حالة السيرفر العامة</p>
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

            {/* Card 6: Last Request Time */}
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
                  {data?.last_request_at
                    ? new Date(data.last_request_at).toLocaleDateString('ar-EG')
                    : 'في انتظار الزيارات'}
                </p>
              </div>
            </Card>
          </div>

          {/* Guide / Explanation for Campaign Owner */}
          <Card className="rounded-2xl border-slate-100 shadow-sm bg-gradient-to-br from-slate-50/70 to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-bold text-slate-800">
                  دليل قراءة المؤشرات أثناء الحملة الإعلانية
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    الطلبات المتزامنة (Concurrency)
                  </div>
                  <p>
                    طالما الرقم أقل من 15، السيرفر يعمل بأقصى سرعة واستجابة سريعة جداً. إذا وصل 20 يتدخل نظام الحماية تلقائياً لرفض الفائض فوراً دون سقوط السيرفر.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    تجاوز الليمت (429 Rate Limit)
                  </div>
                  <p>
                    هؤلاء زوار أرسلوا أكثر من 200 طلب/دقيقة من نفس الـ IP. تم حظرهم مؤقتاً لمدة 30 ثانية لحماية المتجر من البوتات واستنزاف الذاكرة.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    ذروة الضغط (503 Load Shedding)
                  </div>
                  <p>
                    تحدث فقط إذا دخل أكثر من 20 زائر في نفس الجزء من الثانية. الفرونت إند مبرمج ليعيد المحاولة تلقائياً بعد ثانية ونصف دون إزعاج الزائر.
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
