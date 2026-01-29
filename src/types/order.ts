import type { Product, ProductImage } from "./product.ts";

interface OrderItemInput {
    productSizeId: number;
    quantity: number;
}


export interface CreateOrderRequest {
    items: OrderItemInput[];
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address1: string;
    address2: string;
    getPassword?: string;
    deliveryRequest?: String;
    paymentMethod: string;
}

export interface ConfirmOrderRequest {
    paymentKet: string;
    orderId: string;
    amount: number;
}

export type OrderStatus =
    | "PENDING"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED"
    | "RETURN_REQUESTED"
    | "RETURN_COMPLETED";


interface OrderItem {
    id: number;
    price: number;
    quantity: number;
    productSize: OrderProductSize;
}

export interface OrderProductSize {
    id: number;
    size: string;
    productColor: OrderProductColor;
}

export interface OrderProductColor {
    id: number;
    colorName: string;
    product: Product;
    images: ProductImage[];
}

export interface OrderPayment {
    amount: number;
    method: string;
    status: string;
}

export interface Order {
    id: number;
    orderNumber: string;
    recipientName: string;
    recipientPhone: string;
    status: OrderStatus;
    totalAmount: number;
    createdAt: string;
    zipCode: string;
    address1: string;
    address2: string;
    getPassword?: string;
    deliveryRequest?: string;

    items:OrderItem[];
    payment?: OrderPayment;
}

export interface CancleOrderResponse {
    message: string;
    orderId: string;
    status: string;
}