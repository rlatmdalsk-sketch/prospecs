import { httpClient } from "./axios";
import type {
    CancelOrderResponse,
    ConfirmOrderRequest,
    CreateOrderRequest,
    Order,
} from "../types/order";

export const createOrder = async (data: CreateOrderRequest) => {
    const response = await httpClient.post<Order>("/orders", data);
    return response.data;
};

export const getOrders = async () => {
    const response = await httpClient.get<Order[]>("/orders");
    return response.data;
};

export const getOrderDetail = async (orderId: number) => {
    const response = await httpClient.get<Order>(`/orders/${orderId}`);
    return response.data;
};

export const cancelOrder = async (orderId: number, reason: string) => {
    const response = await httpClient.post<CancelOrderResponse>(`/orders/${orderId}/cancel`, {
        reason,
    });
    return response.data;
};

export const confirmOrder = async (data: ConfirmOrderRequest) => {
    const response = await httpClient.post<Order>("/orders/confirm", data);
    return response.data;
};
