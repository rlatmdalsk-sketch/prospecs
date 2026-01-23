import type { ConfirmOrderRequest, CreateOrderRequest } from "../types/order.ts";
import { httpClient } from "./axios.ts";

export const createOrder = async (data: CreateOrderRequest)=> {
    const response = await httpClient.post("/orders", data);
    return response.data;
}

export const confirmOrder = async (data: ConfirmOrderRequest)=> {
    const response = await httpClient.post("/orders/confirm", data);
    return response.data;
}