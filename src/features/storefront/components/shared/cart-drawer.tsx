'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '../../store/use-cart-store';
import { useState } from 'react';
import { useCheckout, useTrendingProducts } from '../../hooks/use-storefront';
import { ProductCard } from './product-card';
import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();
  const checkoutMutation = useCheckout();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const { data: suggestedProducts } = useTrendingProducts();

  const subtotal = getSubtotal();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    checkoutMutation.mutate({
      customer_name: customerName,
      customer_phone: customerPhone,
      items: items.map(item => ({
        product_uuid: item.product_uuid,
        quantity: item.quantity
      }))
    }, {
      onSuccess: (data) => {
        clearCart();
        onClose();
        // Redirect to WhatsApp
        window.open(data.whatsapp_url, '_blank');
      },
      onError: () => {
        toast.error('حدث خطأ أثناء إتمام الطلب');
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <ShoppingBag size={16} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">سلة المشتريات</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingBag size={64} className="opacity-20" />
                  <p>السلة فارغة حالياً</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.product_uuid}
                    className="flex gap-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs line-clamp-2 leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-primary font-black text-sm mt-0.5">
                          {item.price} ج.م
                        </p>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white rounded-md border border-slate-200 px-1.5 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.product_uuid, Math.max(1, item.quantity - 1))}
                            className="text-slate-500 hover:text-primary transition-colors p-1"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-xs w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_uuid, item.quantity + 1)}
                            className="text-slate-500 hover:text-primary transition-colors p-1"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.product_uuid)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1.5"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              {/* Suggested Products Section */}
              {suggestedProducts && suggestedProducts.length > 0 && (
                <div className="pt-4 border-t border-slate-100 mt-2">
                  <h3 className="font-bold text-slate-800 text-sm mb-3">قد يعجبك أيضاً</h3>
                  <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                    {suggestedProducts.map(product => (
                      <div key={product.uuid} className="w-[140px] shrink-0 snap-center">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="الاسم (اختياري)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف (اختياري)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                  />
                </div>
                
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-500 font-bold text-sm">المجموع:</span>
                  <span className="text-xl font-black text-slate-800">
                    {subtotal.toFixed(2)} ج.م
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending}
                  className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 text-sm rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-lg shadow-[#25D366]/20"
                >
                  {checkoutMutation.isPending ? (
                    <span className="animate-pulse">جاري التحويل...</span>
                  ) : (
                    <>
                      <span>إتمام الطلب عبر واتساب</span>
                      <ArrowLeft size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
