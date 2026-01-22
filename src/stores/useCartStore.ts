import type { CartItem } from "../types/cart.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../api/cart.api.ts";

interface CartState {
    items: CartItem[];
    loading: boolean;

    //카드에 들어있는 상품의 정보를 받아오는 함수
    fetchCart: () => Promise<void>;

    //카드에 상품을 넣는 기능
    addItem: (productSizeId: number, quantity: number) => Promise<void>;

    //카트내 상품의 수량변경
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;

    //카트내 상품 삭제
    removeItem: (itemId: number) => Promise<void>;

    //총 갯수 계산
    getTotalCount: () => number;

    //총 금액 계산
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,

            fetchCart: async () => {
                set({ loading: true });

                try {
                    const result = await getCart();
                    set({ items: result.items });
                } catch (e) {
                    console.log("장바구니 로드 실패", "e");
                } finally {
                    set({ loading: false });
                }
            },

            addItem: async (productSizeId: number, quantity: number) => {
                try {
                    await addToCart(productSizeId, quantity);
                    //화면갱신
                    //const state = get();
                    //await state.fetchCart();
                    await get().fetchCart();
                } catch (e) {
                    console.log("장바구니 담기 실패");
                    //throw: 에러를 상위 레벨로 전파 하여 처리
                    throw e;
                }
            },
            updateQuantity: async (itemId: number, quantity: number) => {
                if (quantity < 1) return;

                const prevItem = get().items;
                set({
                    items: prevItem.map(item =>
                        item.id === itemId ? { ...item, quantity } : item,
                    ),
                });

                try {
                    await updateCartItem(itemId, quantity);
                } catch (e) {
                    set({ items: prevItem });
                    console.log("장바구니 수량 변경 상태", e);
                }
            },
            removeItem: async (itemId: number) => {
                const prevItems = get().items;
                set({ items: prevItems.filter(item => item.id !== itemId) });

                try {
                    await removeCartItem(itemId);
                } catch (e) {
                    set({ items: prevItems });
                    console.log("장바구니 항목 삭제 상태", e);
                }
            },
            getTotalCount: () => {
                const state = get();
                const items = state.items;
                let totalCount = 0;
                for (let i = 0; i < items.length; i++) {
                    totalCount += items[i].quantity;
                }

                return get().items.reduce((acc, cur) => acc + cur.quantity, 0);
            },
            getTotalPrice: () => {
                return get().items.reduce(
                    (acc, item) =>
                        acc + item.productSize.productColor.product.price * item.quantity,
                    0,
                );
            },
        }),
        {
            name: "cart-storage",
        },
    ),
);

export default useCartStore;
