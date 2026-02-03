import type { CartItem } from "../types/cart.ts";
import { create } from "zustand";

interface OrderState {
    orderItems: CartItem[];
    setOrderItems: (items: CartItem[]) => void;
    clearOrder: () => void;
    getTotalPrice: () => number;
}

const useOrderStore = create<OrderState>((set, get) => ({
    orderItems: [],
    setOrderItems: items => set({ orderItems: items }),
    clearOrder: () => set({ orderItems: [] }),
    getTotalPrice: () => {
        return get().orderItems.reduce((acc, item) => {
            const price = item.productSize.productColor.product.price;
            return acc + price * item.quantity;
        }, 0);
    },
}));

export default useOrderStore;
