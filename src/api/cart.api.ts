import type { CartResponse } from "../types/cart.ts";
import { httpClient } from "./axios.ts";

export const getCart = async () => {
    const response = await httpClient.get<CartResponse>("/cart");
    return response.data;
};


export const addToCart = async (productSizeId: number, quantity: number) => {
    return await httpClient.post("/cart", {
        productSizeId,
        quantity: quantity,
    });
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
    return httpClient.put(`/cart/${cartItemId}`, {quantity});
}

export const removeCartItem = async (cartItemId: number) => {
    return httpClient.delete(`/cart/${cartItemId}`);
}