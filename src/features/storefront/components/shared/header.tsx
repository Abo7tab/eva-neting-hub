'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, Sparkles, ChevronDown } from 'lucide-react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  
  const cartIconRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

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

  const siteName = settings['site_name'] || 'إيفا نيتنج هاب';
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
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 sm:h-12 lg:h-20 w-auto object-contain" />
              ) : (
                <img 
                  src={
                    activeTheme === 'women' ? '/logos/women.svg' : 
                    activeTheme === 'men' ? '/logos/men.svg' : 
                    '/logos/main.svg'
                  } 
                  alt={siteName} 
                  className="h-10 sm:h-12 lg:h-20 w-auto object-contain" 
                />
              )}
            </Link>
          </div>

          {/* CENTER: Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="font-bold text-slate-700 hover:text-primary transition-colors">الرئيسية</Link>
            <Link href="/products" className="font-bold text-slate-700 hover:text-primary transition-colors">المنتجات</Link>
            
            <div 
              className="relative group cursor-pointer flex flex-col justify-center h-full"
              onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
              onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
            >
              <div className="flex items-center gap-1 font-bold text-slate-700 hover:text-primary transition-colors py-4">
                <Link href="/categories">الأقسام</Link>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </div>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {isCategoriesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[100%] right-0 w-64 bg-white shadow-xl rounded-2xl border border-slate-100 overflow-hidden z-50 pt-2 pb-2"
                  >
                    {parentCategories.map(cat => (
                      <Link 
                        key={cat.uuid}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 hover:bg-slate-50 hover:text-primary font-bold text-sm transition-colors text-slate-700"
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
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

            {/* Search Bar + Icon (Mobile & Desktop) */}
            <div className="flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: typeof window !== 'undefined' && window.innerWidth < 1024 ? "100%" : "200px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mr-2 absolute lg:relative right-12 lg:right-auto left-4 lg:left-auto top-1/2 -translate-y-1/2 lg:translate-y-0 z-50 lg:z-auto bg-white lg:bg-transparent py-2 lg:py-0 shadow-lg lg:shadow-none rounded-full"
                  >
                    <input 
                      type="text" 
                      placeholder="ابحث عن منتج..."
                      className="w-full bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner lg:shadow-none"
                      autoFocus
                      onBlur={() => setIsSearchOpen(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-slate-700 hover:text-primary transition-colors z-50 lg:z-auto relative"
              >
                <Search size={22} />
              </button>
            </div>

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
                <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)}>الأقسام</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
