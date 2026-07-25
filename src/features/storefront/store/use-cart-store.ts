import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  product_uuid: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_uuid: string) => void;
  updateQuantity: (product_uuid: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.product_uuid === item.product_uuid);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_uuid === item.product_uuid
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },
      removeItem: (product_uuid) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_uuid !== product_uuid),
        }));
      },
      updateQuantity: (product_uuid, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.product_uuid === product_uuid ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'eva-beauty-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
