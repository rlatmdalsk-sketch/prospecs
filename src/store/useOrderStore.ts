import { create } from "zustand";
import type { CartItem } from "../types/cart.ts";

interface OrderStore {
    orderItems: CartItem[]; // [변경] 타입을 CartItem으로 통일
    setOrderItems: (items: CartItem[]) => void;
    clearOrder: () => void;
    getTotalPrice: () => number;
}

const useOrderStore = create<OrderStore>((set, get) => ({
    orderItems: [],

    setOrderItems: items => set({ orderItems: items }),
    clearOrder: () => set({ orderItems: [] }),

    // [변경] CartItem의 깊은 구조(nested structure)에 맞춰 가격 계산
    getTotalPrice: () => {
        return get().orderItems.reduce((acc, item) => {
            const price = item.productSize.productColor.product.price;
            return acc + price * item.quantity;
        }, 0);
    },
}));

export default useOrderStore;
