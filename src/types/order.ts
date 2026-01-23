interface OrderItemInput {
    productSizeId: number;
    quantity: number;
}

export interface CreateOrderRequest {
    items: OrderItemInput[];
    recipientName: string;
    recipientPhone: string
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