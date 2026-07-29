'use client';

import { useStorefrontContext } from '../providers/storefront-provider';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const { settings } = useStorefrontContext();

  const logoUrl = settings['site_logo_url'];
  const siteName = settings['site_name'] || 'إيفا بيوتي';
  const about = settings['content_footer_about_ar'] || 'اكتشفي عالمك من الجمال مع إيفا بيوتي. نحن نقدم لكِ أفضل وأجود منتجات العناية والتجميل بأسعار لا تقبل المنافسة وبضمان الجودة والأصالة.';
  const copyright = settings['copyright_text_ar'] || `© ${new Date().getFullYear()} إيفا بيوتي. جميع الحقوق محفوظة.`;

  return (
    <footer 
      className="pt-20 pb-8 mt-24 bg-primary text-primary-foreground relative z-10"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* About Column */}
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
            <Link href="/" className="inline-block bg-white/10 p-3 rounded-2xl w-fit backdrop-blur-sm">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-12 w-auto object-contain brightness-0 invert" />
              ) : (
                <span className="text-2xl font-black">{siteName}</span>
              )}
            </Link>
            <p className="opacity-80 leading-relaxed text-sm">
              {about}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-black text-xl">روابط سريعة</h4>
            <ul className="space-y-4">
              {['الرئيسية', 'كل المنتجات', 'الأقسام', 'الماركات العالمية'].map((link, i) => (
                <li key={i}>
                  <Link href={i === 0 ? '/' : i === 1 ? '/products' : i === 2 ? '/categories' : '/brands'} className="opacity-80 hover:opacity-100 transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50 group-hover:bg-primary-foreground transition-colors" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <h4 className="font-black text-xl">تواصل معنا</h4>
            <ul className="space-y-4">
              {settings['contact_phone'] && (
                <li className="flex items-start gap-3 opacity-80">
                  <Phone size={20} className="shrink-0 mt-0.5" />
                  <span className="font-bold" dir="ltr">{settings['contact_phone']}</span>
                </li>
              )}
              {settings['contact_email'] && (
                <li className="flex items-start gap-3 opacity-80">
                  <Mail size={20} className="shrink-0 mt-0.5" />
                  <span className="font-medium">{settings['contact_email']}</span>
                </li>
              )}
              {settings['contact_address'] && (
                <li className="flex items-start gap-3 opacity-80">
                  <MapPin size={20} className="shrink-0 mt-0.5" />
                  <span className="font-medium">{settings['contact_address']}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-6">
            <h4 className="font-black text-xl">تابعنا</h4>
            <div className="flex flex-wrap items-center gap-4">
              {settings['social_facebook'] && (
                <motion.a 
                  whileHover={{ scale: 1.1, y: -4 }}
                  href={settings['social_facebook']} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </motion.a>
              )}
              {settings['social_instagram'] && (
                <motion.a 
                  whileHover={{ scale: 1.1, y: -4 }}
                  href={settings['social_instagram']} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </motion.a>
              )}
              {settings['social_twitter'] && (
                <motion.a 
                  whileHover={{ scale: 1.1, y: -4 }}
                  href={settings['social_twitter']} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </motion.a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col items-center justify-center text-center gap-6">
          <p className="opacity-60 font-medium">{copyright}</p>
          
          {/* SEO Hidden Keywords Section */}
          <div className="text-[10px] opacity-40 max-w-4xl mx-auto leading-relaxed text-justify">
            <p>
              إيفا بيوتي (Eva Beauty) هي وجهتك الأولى والموثوقة في مصر والشرق الأوسط لبيع <strong>مستحضرات تجميل</strong> أصلية ومضمونة 100%. 
              نحن متخصصون في توفير كافة احتياجاتك من <strong>المكياج</strong>، <strong>العناية بالبشرة</strong>، <strong>العناية بالشعر</strong>، و<strong>البرفانات الأصلية</strong> من أشهر الماركات العالمية والمحلية.
              عشان إحنا الأصل في "إيفا بيوتي"، بنقدم لعملائنا الكرام أقوى <strong>خصومات مستحضرات التجميل</strong> التي تصل إلى <strong>25% أو 30% أو 10%</strong> وأكثر، وده طبعاً بيتحدد على حسب المنتج وعلى حسب الكمية اللي بتشتريها!
              سواء كنتي بتجهزي نفسك لمناسبة، أو بتدوري على روتين العناية اليومي، أو حتى لو كنتي صاحبة صالون تجميل أو بيوتي سنتر وعايزة تشتري <strong>مستحضرات تجميل بالجملة</strong>، إيفا بيوتي هي الاختيار الأوفر والأضمن ليكي.
              اشتري دلوقتي واستفيدي بأسعار لا تقبل المنافسة، عروض حصرية، وتوصيل سريع لكل المحافظات.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
