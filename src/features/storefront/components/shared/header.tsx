'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useStorefrontContext } from '../providers/storefront-provider';
import { useCartStore } from '../../store/use-cart-store';
import { CartDrawer } from './cart-drawer';
import { usePublicCategories } from '../../hooks/use-storefront';
import { useReducedMotion } from 'framer-motion';

export const Header = () => {
  const { settings, activeTheme, setActiveTheme } = useStorefrontContext();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  
  const cartIconRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const { data: categories } = usePublicCategories();
  const parentCategories = (categories || []).filter((c) => !c.parent_uuid);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Initialize activeTab from localStorage on client side
    const savedTab = localStorage.getItem('eva-active-category');
    if (savedTab) {
      setActiveTab(savedTab);
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync active tab with current URL
  useEffect(() => {
    if (!pathname) return;
    const match = pathname.match(/\/category\/([^\/]+)/);
    if (match) {
      const slug = decodeURIComponent(match[1]);
      if (activeTab !== slug) {
        setActiveTab(slug);
        localStorage.setItem('eva-active-category', slug);
      }
    }
  }, [pathname, activeTab]);

  // Cart bounce effect
  useEffect(() => {
    if (totalItems > 0 && cartIconRef.current && !shouldReduceMotion) {
      cartIconRef.current.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.3)' },
        { transform: 'scale(1)' }
      ], {
        duration: 300,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      });
    }
  }, [totalItems, shouldReduceMotion]);

  // Dynamic Favicon
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    const appleIcon = document.querySelector("link[rel='apple-touch-icon']");
    
    let iconPath = '/logos/logomain.svg';
    if (activeTheme === 'women') iconPath = '/logos/logowoman.svg';
    if (activeTheme === 'men') iconPath = '/logos/logoman.svg';

    if (favicon) favicon.setAttribute("href", iconPath);
    if (appleIcon) appleIcon.setAttribute("href", iconPath);
  }, [activeTheme]);

  const siteName = settings['site_name'] || 'إيفا بيوتي هاب';
  const logoUrl = settings['site_logo_url'];

  const handleTabClick = (slug: string) => {
    setActiveTab(slug);
    localStorage.setItem('eva-active-category', slug);
    
    // Find the category by slug and detect its gender
    const category = categories?.find(c => c.slug === slug);
    if (category) {
      // Walk up to root parent
      let root = category;
      while (root.parent_uuid && categories) {
        const parent = categories.find(c => c.uuid === root.parent_uuid);
        if (!parent) break;
        root = parent;
      }
      const rootName = root.name?.trim();
      if (rootName === 'حريمي' || rootName === 'حريمى') {
        setActiveTheme('women');
      } else if (rootName === 'رجالي' || rootName === 'رجالى') {
        setActiveTheme('men');
      } else {
        setActiveTheme('default');
      }
    } else {
      setActiveTheme('default');
    }
    
    router.push(`/category/${slug}`);
  };

  const primaryColor = 'var(--primary)';

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md shadow-md py-2' : 'py-4'
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
          borderBottom: isScrolled ? `2px solid var(--primary)` : 'none',
        }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between relative">
          
          {/* RIGHT SIDE: Logo + Site Name */}
          <div className="flex-none flex justify-start">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <img 
                src={
                  activeTheme === 'women' ? '/logos/logowoman.svg' : 
                  activeTheme === 'men' ? '/logos/logoman.svg' : 
                  '/logos/logomain.svg'
                } 
                alt="Eva Beauty Hub" 
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain" 
              />
              <span className="flex flex-col items-start justify-center" style={{ color: 'var(--primary)' }}>
                <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter leading-none mb-1">
                  Eva <span className="font-light">Beauty Hub</span>
                </span>
                <span className="text-[10px] sm:text-xs font-bold opacity-90 tracking-normal leading-none pr-1">
                  إيفا بيوتي هاب
                </span>
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="font-bold text-slate-700 hover:text-primary transition-colors">الرئيسية</Link>
            <Link href="/products" className="font-bold text-slate-700 hover:text-primary transition-colors">المنتجات</Link>
            
          </nav>

          {/* LEFT SIDE: Gender Tabs + Icons */}
          <div className="flex-none flex items-center justify-end gap-3 sm:gap-4">
            
            {/* Gender Pill Tabs (Desktop) */}
            {parentCategories.length > 0 && (
              <div className="hidden lg:flex items-center gap-1 bg-slate-100 rounded-full p-1 border border-slate-200">
                {parentCategories.slice(0, 3).map((cat) => (
                  <button
                    key={cat.uuid}
                    onClick={() => handleTabClick(cat.slug)}
                    className="relative px-5 py-1.5 rounded-full text-sm font-bold transition-colors z-10"
                    style={{ color: activeTab === cat.slug ? 'var(--primary-foreground)' : 'var(--primary)' }}
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

            {/* Cart Icon */}
            <button
              ref={cartIconRef}
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-700 hover:text-primary transition-colors transform origin-center"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <motion.div
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  className="absolute -top-1 -right-1 w-5 h-5 text-primary-foreground text-xs font-black rounded-full flex items-center justify-center shadow-md"
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
          <div className="lg:hidden container mx-auto px-4 mt-2 mb-4">
            <div className="flex items-center w-full gap-3 sm:gap-4">
              {parentCategories.slice(0, 3).map((cat) => (
                <button
                  key={cat.uuid}
                  onClick={() => handleTabClick(cat.slug)}
                  className="flex-1 text-center py-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all shadow-sm active:scale-95"
                  style={{
                    backgroundColor: activeTab === cat.slug ? primaryColor : 'transparent',
                    borderColor: primaryColor,
                    color: activeTab === cat.slug ? 'var(--primary-foreground)' : primaryColor,
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
