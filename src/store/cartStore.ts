// src/stores/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  type: string;
};

export type PaymentMethod = "cash" | "card" | "transfer" | "wallet" | null;
export type DiscountType = "percent" | "fixed" | null;
export type AdjustmentMode = "add" | "subtract";

interface CartState {
  items: CartItem[];
  taxRate: number; // 16 = 16%
  discountType: DiscountType;
  discountValue: number; // amount or percent depending on discountType

  // New: adjustment sign and concept
  adjustmentMode: AdjustmentMode; // add => incremento, subtract => descuento
  adjustmentConcept: string;

  walletAmount: number;
  paymentMethod: PaymentMethod;
  folio: string | null;

  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string | number) => void;
  updateQty: (id: string | number, qty: number) => void;
  editPrice: (id: string | number, price: number) => void;
  clear: () => void;

  subtotal: () => number;
  taxAmount: () => number;
  discountAmount: () => number; // returns positive number (always magnitude)
  adjustmentSignedAmount: () => number; // positive for add, positive for subtract (use sign in grandTotal)
  grandTotal: () => number;

  setTaxRate: (rate: number) => void;
  setDiscount: (type: DiscountType, value: number) => void;
  setAdjustment: (mode: AdjustmentMode, concept: string) => void;
  setWalletAmount: (amount: number) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  generateFolio: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      taxRate: 0,
      discountType: null,
      discountValue: 0,
      adjustmentMode: "subtract",
      adjustmentConcept: "",
      walletAmount: 0,
      paymentMethod: null,
      folio: null,

      addItem: (item, qty = 1) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: qty }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, qty) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        }),

      editPrice: (id, price) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, price } : i)),
        }),

      clear: () =>
        set({
          items: [],
          walletAmount: 0,
          paymentMethod: null,
          folio: null,
          discountType: null,
          discountValue: 0,
          adjustmentMode: "subtract",
          adjustmentConcept: "",
        }),

      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),

      taxAmount: () => (get().subtotal() * get().taxRate) / 100,

      discountAmount: () => {
        const { discountType, discountValue } = get();
        const base = get().subtotal();
        if (!discountType || discountValue <= 0) return 0;
        if (discountType === "percent") return (base * discountValue) / 100;
        return discountValue;
      },

      // magnitude of adjustment (same calculation method as discountAmount)
      adjustmentSignedAmount: () => {
        // same calculation method, reuse discountValue/discountType but interpret via adjustmentMode
        const { discountType, discountValue } = get();
        const base = get().subtotal();
        if (!discountType || discountValue === 0) return 0;
        if (discountType === "percent") return (base * discountValue) / 100;
        return discountValue;
      },

      grandTotal: () => {
        const base = get().subtotal();
        const tax = get().taxAmount();
        const adjustment = get().adjustmentSignedAmount();
        const discount = get().discountAmount(); // for compatibility if needed (we treat adjustment as primary)
        // We will treat "adjustment" (with sign) as the thing affecting total.
        // If adjustmentMode === 'add' => add adjustment; if 'subtract' => subtract adjustment.
        const adj = get().adjustmentMode === "add" ? adjustment : -adjustment;
        const totalBeforeWallet = Math.max(base + tax + adj, 0);
        // wallet reduces final amount
        const walletUsed = Math.min(get().walletAmount, totalBeforeWallet);
        return Math.max(totalBeforeWallet - walletUsed, 0);
      },

      setTaxRate: (rate) => set({ taxRate: rate }),
      setDiscount: (type, value) => set({ discountType: type, discountValue: value }),
      setAdjustment: (mode, concept) => set({ adjustmentMode: mode, adjustmentConcept: concept }),
      setWalletAmount: (amount) => set({ walletAmount: Math.max(0, amount) }),
      setPaymentMethod: (m) => set({ paymentMethod: m }),
      generateFolio: () => {
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        set({ folio: `FOL-${Date.now()}-${random}` });
      },
    }),
    { name: "cart-store" }
  )
);
