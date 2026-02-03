import type { CartItem } from "../types/cart.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../api/cart.api.ts";

interface CartState {
    items: CartItem[];
    loading: boolean;

    // 카트에 들어있는 상품의 정보를 받아오는 함수(기능)
    fetchCart: () => Promise<void>;

    // 카트에 상품을 넣는 기능
    addItem: (productSizeId: number, quantity: number) => Promise<void>;

    // 카트 내 상품의 수량을 변경하는 기능
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;

    // 카트 내 상품을 삭제하는 기능
    removeItem: (itemId: number) => Promise<void>;

    // 총 갯수 계산
    getTotalCount: () => number;

    // 총 금액 계산
    getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
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
                    console.log("장바구니 로드 실패", e);
                } finally {
                    set({ loading: false });
                }
            },

            addItem: async (productSizeId, quantity) => {
                try {
                    await addToCart(productSizeId, quantity);
                    // 화면 갱신을 위해
                    // const state = get();
                    // await state.fetchCart();
                    await get().fetchCart();
                } catch (e) {
                    console.log("장바구니 담기 실패", e);
                    // throw 키워드 : 에러를 상위 레벨로 전파하여 처리하도록 함
                    // return 키워드는 성공에 대한 값을 반환해주는 키워드
                    throw e;
                }
            },
            updateQuantity: async (itemId, quantity) => {
                if (quantity < 1) return;

                // 화면의 값을 먼저 바꿔주고 백엔드와의 통신을 진행할 것임
                // 이렇게 진행 안하고 그냥 백엔드와의 통신 후 화면을 갱신해줘도 되지만.
                const prevItems = get().items;
                set({
                    items: prevItems.map(item =>
                        item.id === itemId ? { ...item, quantity } : item,
                    ),
                });

                try {
                    await updateCartItem(itemId, quantity);
                } catch (e) {
                    set({ items: prevItems });
                    console.log("장바구니 수량 변경 실패", e);
                }
            },
            removeItem: async itemId => {
                const prevItems = get().items;
                set({ items: prevItems.filter(item => item.id !== itemId) });

                try {
                    await removeCartItem(itemId);
                } catch (e) {
                    set({ items: prevItems });
                    console.log("장바구니 항목 삭제 실패", e);
                }
            },
            getTotalCount: () => {
                // 가장 기초적인 방식
                // const state = get();
                // const items = state.items;
                // let totalCount = 0;
                // for (let i = 0; i < items.length; i++) {
                //     totalCount += items[i].quantity;
                // }

                // Array 에서 사용할 수 있는 메소드 중 reduce : Array의 값을 순회하면서 하나의 결과값을 뱉어낼 때 사용
                // [ ].reduce(실행하는 함수)
                // [ ].reduce((누적값, 현재값) => 누적값 + 현재값, 초기값)
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
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
