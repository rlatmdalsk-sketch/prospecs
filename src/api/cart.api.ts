import { httpClient } from "./axios.ts";
import type { CartResponse } from "../types/cart.ts";

export const getCart = async () => {
    const response = await httpClient.get<CartResponse>("/cart");
    return response.data;
};

export const addToCart = async (productSizeId: number, quantity: number) => {
    // 이 API는 돌아오는 응답 값이 중요하지 않기 때문에 성공하면 리턴될 것이고 실패한다면 에러 처리가 될 것이기 때문에
    // 그냥 바로 리턴함
    return httpClient.post("/cart", {
        productSizeId,
        quantity,
    });
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
    return httpClient.put(`/cart/${cartItemId}`, { quantity });
};

export const removeCartItem = async (cartItemId: number) => {
    return httpClient.delete(`/cart/${cartItemId}`);
};
