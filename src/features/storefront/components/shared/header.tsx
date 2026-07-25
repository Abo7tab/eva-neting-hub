'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { useStorefrontContext } from '../providers/storefront-provider';
import { useCartStore } from '../../store/use-cart-store';
import { CartDrawer } from './cart-drawer';
import { usePublicCategories } from '../../hooks/use-storefront';

export const Header = () => {
  const { settings, activeTheme, setActiveTheme } = useStorefrontContext();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const router = useRouter();

  const { data: categories } = usePublicCategories();
  const parentCategories = (categories || []).filter((c) => !c.parent_uuid);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('eva-active-category');
    if (saved) setActiveTab(saved);
  }, []);

  const siteName = settings['site_name'] || 'إيفا نيتنج هاب';
  const logoUrl = settings['site_logo_url'];

  const handleTabClick = (slug: string) => {
    setActiveTab(slug);
    localStorage.setItem('eva-active-category', slug);
    const themeMap: Record<string, string> = {
      women: 'women', حريمي: 'women',
      men: 'men', رجالي: 'men',
    };
    setActiveTheme(themeMap[slug] || 'default');
    router.push(`/category/${slug}`);
  };

  const primaryColor = 'var(--eva-primary, #F97316)';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* RIGHT SIDE: Logo + Site Name */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-16 lg:h-20 w-auto object-contain" />
            ) : (
              <img 
                src={
                  activeTheme === 'women' ? '/logos/women.svg' : 
                  activeTheme === 'men' ? '/logos/men.svg' : 
                  '/logos/main.svg'
                } 
                alt={siteName} 
                className="h-16 lg:h-20 w-auto object-contain" 
              />
            )}
          </Link>

          {/* CENTER: Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="font-bold text-slate-700 hover:text-[var(--eva-primary,#F97316)] transition-colors">الرئيسية</Link>
            <Link href="/products" className="font-bold text-slate-700 hover:text-[var(--eva-primary,#F97316)] transition-colors">المنتجات</Link>
            <div className="relative group cursor-pointer flex items-center gap-1 font-bold text-slate-700 hover:text-[var(--eva-primary,#F97316)] transition-colors">
              <Link href="/categories">الأقسام</Link>
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </div>
            <Link href="/brands" className="font-bold text-slate-700 hover:text-[var(--eva-primary,#F97316)] transition-colors">الماركات</Link>
          </nav>

          {/* LEFT SIDE: Gender Tabs + Icons */}
          <div className="flex items-center gap-3">
            
            {/* Gender Pill Tabs (Desktop) */}
            {parentCategories.length > 0 && (
              <div className="hidden lg:flex items-center gap-1 bg-slate-100 rounded-full p-1 border border-slate-200">
                {parentCategories.slice(0, 3).map((cat) => (
                  <button
                    key={cat.uuid}
                    onClick={() => handleTabClick(cat.slug)}
                    className="relative px-5 py-1.5 rounded-full text-sm font-bold transition-colors z-10"
                    style={{ color: activeTab === cat.slug ? '#fff' : 'var(--eva-primary,#F97316)' }}
                  >
                    {activeTab === cat.slug && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ backgroundColor: primaryColor }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Search Icon */}
            <button className="p-2 text-slate-700 hover:text-[var(--eva-primary,#F97316)] transition-colors">
              <Search size={22} />
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-[var(--eva-primary,#F97316)] transition-colors"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <motion.div
                  key={totalItems}
                  initial={{ scale: 0.5, y: -5 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  {totalItems}
                </motion.div>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Gender Tabs (Shows below header on mobile if exists) */}
        {parentCategories.length > 0 && (
          <div className="lg:hidden container mx-auto px-4 mt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {parentCategories.slice(0, 3).map((cat) => (
                <button
                  key={cat.uuid}
                  onClick={() => handleTabClick(cat.slug)}
                  className="relative px-5 py-1.5 rounded-full text-sm font-bold shrink-0 border-2"
                  style={{
                    backgroundColor: activeTab === cat.slug ? primaryColor : 'transparent',
                    borderColor: primaryColor,
                    color: activeTab === cat.slug ? '#fff' : primaryColor,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-4 font-bold text-slate-700">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>الرئيسية</Link>
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>المنتجات</Link>
                <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)}>الأقسام</Link>
                <Link href="/brands" onClick={() => setIsMobileMenuOpen(false)}>الماركات</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
