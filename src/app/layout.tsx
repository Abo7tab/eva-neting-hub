import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryProvider } from "@/shared/components/providers/query-provider";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "إيفا بيوتي هاب | Eva Beauty Hub - مستحضرات تجميل وعناية بالبشرة",
    template: "%s | إيفا بيوتي هاب",
  },
  description: "اكتشفي عالمك من الجمال مع إيفا بيوتي هاب (Eva Beauty Hub). الوجهة الأولى لبيع مستحضرات التجميل، العناية بالبشرة، وعلاج تساقط الشعر. أفضل الهدايا لزوجتك، خطيبتك، أو أختك بأسعار الجملة وخصومات تصل لـ 30%.",
  keywords: [
    "إيفا بيوتي هاب", 
    "Eva Beauty Hub", 
    "مستحضرات تجميل", 
    "عناية بالبشرة", 
    "عناية بالشعر",
    "علاج تساقط الشعر",
    "حماية من الجفاف",
    "مكياج", 
    "خصومات مستحضرات التجميل", 
    "هدية لمراتك",
    "هدية لخطيبتك",
    "هدية لاختك",
    "هدية لجدتك",
    "أفضل هدية للبنات",
    "برفانات أصلية", 
    "منتجات أصلية 100%",
    "تخفيضات تصل لـ 30%",
    "أسعار الجملة للمكياج",
    "بيع مستحضرات تجميل بالجملة",
    "مستحضرات تجميل اونلاين مصر"
  ],
  icons: {
    icon: [
      { url: '/logos/logomain.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logos/logomain.svg',
    apple: '/logos/logomain.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/logos/main.svg" />
        <link rel="apple-touch-icon" href="/logos/main.svg" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <TooltipProvider>
            {children}
            <Toaster 
              richColors 
              position="top-center"
              dir="rtl"
              toastOptions={{
                style: { fontFamily: 'var(--font-tajawal)' },
              }}
            />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
