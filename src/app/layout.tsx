import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryProvider } from "@/shared/components/providers/query-provider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Eva Beauty Hub",
    template: "%s | Eva Beauty Hub",
  },
  description: "اكتشفي عالمك من الجمال مع إيفا بيوتي هب",
  icons: {
    icon: [
      { url: '/logos/main.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logos/main.svg',
    apple: '/logos/main.svg',
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
      className={`${cairo.variable} h-full antialiased`}
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
                style: { fontFamily: 'var(--font-cairo)' },
              }}
            />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
