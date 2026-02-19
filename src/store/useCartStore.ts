import type { CartItem } from "../types/cart.ts";
import { create } from "zustand";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../api/cart.api.ts";

interface CartState {
    items: CartItem[];
    loading: boolean;

    // Actions
    fetchCart: () => Promise<void>;
    addItem: (productSizeId: number, quantity: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;

    // Computed (편의 기능)
    getTotalCount: () => number;
    getTotalPrice: () => number;
}

const useCartStore = create<CartState>((set, get) => ({
    items: [],
    loading: false,

    fetchCart: async () => {
        set({ loading: true });
        try {
            const cart = await getCart();
            set({ items: cart.items });
        } catch (error) {
            console.error("장바구니 로드 실패", error);
        } finally {
            set({ loading: false });
        }
    },

    addItem: async (productSizeId, quantity) => {
        try {
            await addToCart(productSizeId, quantity);
            await get().fetchCart(); // DB와 동기화
        } catch (error) {
            console.error("담기 실패", error);
            throw error; // UI에서 알림 띄우기 위해 throw
        }
    },

    updateQuantity: async (itemId, quantity) => {
        if (quantity < 1) return;
        // 1. 낙관적 업데이트 (UI 먼저 반영해서 빠르게 보이게)
        const prevItems = get().items;
        set({
            items: prevItems.map(item => (item.id === itemId ? { ...item, quantity } : item)),
        });

        // 2. 서버 요청
        try {
            await updateCartItem(itemId, quantity);
        } catch (error) {
            // 실패 시 롤백
            set({ items: prevItems });
            console.error("수량 변경 실패", error);
        }
    },

    removeItem: async itemId => {
        const prevItems = get().items;
        set({ items: prevItems.filter(item => item.id !== itemId) }); // 낙관적 삭제

        try {
            await removeCartItem(itemId);
        } catch (error) {
            set({ items: prevItems }); // 롤백
            console.error("삭제 실패", error);
        }
    },

    getTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
    },

    getTotalPrice: () => {
        return get().items.reduce((acc, item) => {
            return acc + item.productSize.productColor.product.price * item.quantity;
        }, 0);
    },
}));

export default useCartStore;
