import type { ConfirmOrderRequest, CreateOrderRequest, Order } from "../types/order.ts";
import { httpClient } from "./axios.ts";

export const createOrder = async (data: CreateOrderRequest) => {
    const response = await httpClient.post<Order>("/orders", data);
    return response.data;
}

export const confirmOrder = async (data: ConfirmOrderRequest) => {
    const response = await httpClient.post<Order>("/orders/confirm", data);
    return response.data;
}