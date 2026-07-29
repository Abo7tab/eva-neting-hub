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
    default: "Eva Beauty Hub",
    template: "%s | Eva Beauty Hub",
  },
  description: "اكتشفي عالمك من الجمال مع إيفا بيوتي هب",
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
