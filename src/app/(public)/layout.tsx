export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from "next";
import { StorefrontProvider } from "@/features/storefront/components/providers/storefront-provider";
import { storefrontApi } from "@/features/storefront/api/storefront.api";
import { Header } from "@/features/storefront/components/shared/header";
import { Footer } from "@/features/storefront/components/shared/footer";
import { AnimatedBackground } from "@/features/storefront/components/shared/animated-background";
import { PageTransition } from "@/features/storefront/components/shared/page-transition";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await storefrontApi.getSettings();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.setting_key] = curr.setting_value;
      return acc;
    }, {} as Record<string, string | null>);

    return {
      title: {
        default: settingsMap['site_name'] || "Eva Beauty Hub",
        template: `%s | ${settingsMap['site_name'] || "Eva Beauty Hub"}`,
      },
      description: settingsMap['seo_meta_description'] || "منصتك الأولى لمنتجات التجميل",
      keywords: settingsMap['seo_meta_keywords'] || "تجميل, مكياج, عطور, عناية",
      openGraph: {
        title: settingsMap['seo_meta_title'] || settingsMap['site_name'] || "Eva Beauty Hub",
        description: settingsMap['seo_meta_description'] || "منصتك الأولى لمنتجات التجميل",
        url: 'https://evabeauty.com',
        siteName: settingsMap['site_name'] || "Eva Beauty Hub",
        images: [
          {
            url: settingsMap['site_logo_url'] || '/logos/main.svg',
            width: 800,
            height: 600,
          },
        ],
        locale: 'ar_EG',
        type: 'website',
      },
      verification: {
        google: 'IhX2U9bzob2dTAvxoqXQtyq6tqe9uD2o649TpL4oOKs',
      },
    };
  } catch (error) {
    return {
      title: "Eva Beauty Hub",
      description: "منصتك الأولى لمنتجات التجميل",
      verification: {
        google: 'IhX2U9bzob2dTAvxoqXQtyq6tqe9uD2o649TpL4oOKs',
      },
    };
  }
}

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StorefrontProvider>
      {/* Global animated background — fixed behind all pages */}
      <AnimatedBackground />
      <div className="flex flex-col min-h-screen relative z-10">
        <Header />
        <main className="flex-1 pt-20">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
      </div>
    </StorefrontProvider>
  );
}
