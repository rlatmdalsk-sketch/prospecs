// 주문 상태 Enum
export type OrderStatus =
    | "PENDING"
    | "PAID"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELED"
    | "RETURN_REQUESTED"
    | "RETURN_COMPLETED";

export interface OrderItemInput {
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
    gatePassword?: string; // 선택
    deliveryRequest?: string; // 선택
    paymentMethod: string;
}

export interface OrderProductImage {
    url: string;
}

export interface OrderProductInfo {
    id: number;
    name: string;
    price: number;
    style: string;
}

export interface OrderProductColor {
    colorName: string;
    hexCode: string;
    product: OrderProductInfo;
    images: OrderProductImage[];
}

export interface OrderProductSize {
    id: number;
    size: string;
    productColor: OrderProductColor;
}

export interface OrderItemDetail {
    id: number;
    quantity: number;
    price: number;
    productSize: OrderProductSize;
}

export interface OrderPayment {
    status: string;
    method: string;
    amount: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;

    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address1: string;
    address2: string;
    gatePassword?: string;
    deliveryRequest?: string;

    payment?: OrderPayment;

    createdAt: string;
    items: OrderItemDetail[];
}

export interface ConfirmOrderRequest {
    paymentKey: string;
    orderId: string;
    amount: number;
}

export interface CancelOrderResponse {
    message: string;
    orderId: number;
    status: string; // "CANCELED"
}