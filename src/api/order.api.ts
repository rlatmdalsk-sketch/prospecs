import type {
    CancleOrderResponse,
    ConfirmOrderRequest,
    CreateOrderRequest,
    Order,
} from "../types/order.ts";
import { httpClient } from "./axios.ts";
import { data } from "react-router";

export const createOrder = async (data: CreateOrderRequest) => {
    const response = await httpClient.post<Order>("/orders", data);
    return response.data;
}

export const confirmOrder = async (data: ConfirmOrderRequest) => {
    const response = await httpClient.post<Order>("/orders/confirm", data);
    return response.data;
}

export const getOrders = async () => {
    const response = await httpClient.get<Order[]>("/orders");
    return response.data;
}

export const getOrderDetail = async(orderId: number) => {
    const response = await httpClient.get<Order>(`/orders/${orderId}`);
    return response.data;
}

export const cancleOrder = async(orderId: number, reason: string) => {
    const response = await httpClient.post<CancleOrderResponse>(`/orders/${orderId}/cancle`, {
        reason,
    });
    return response.data;
}
