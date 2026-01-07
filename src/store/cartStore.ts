import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';
import { calculateShipping } from '@/lib/shipping';

interface CartStore {
  items: CartItem[];
  selectedCarrier: string | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setCarrier: (carrierId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getShippingCost: () => number;
  getTotalWithShipping: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedCarrier: null,

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: crypto.randomUUID(),
                productId: product.id,
                product,
                quantity: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity, updatedAt: new Date() }
              : item
          ),
        }));
      },

      setCarrier: (carrierId) => {
        set({ selectedCarrier: carrierId });
      },

      clearCart: () => {
        set({ items: [], selectedCarrier: null });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getShippingCost: () => {
        const subtotal = get().getTotalPrice();
        const carrierId = get().selectedCarrier;
        return calculateShipping(subtotal, carrierId || undefined);
      },

      getTotalWithShipping: () => {
        return get().getTotalPrice() + get().getShippingCost();
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
