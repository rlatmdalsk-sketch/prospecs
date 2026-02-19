export interface CartItem {
    id: number;
    quantity: number;
    productSize: {
        id: number;
        size: string;
        stock: number;
        productColor: {
            colorName: string;
            images: { url: string }[];
            product: {
                id: number;
                name: string;
                price: number;
            };
        };
    };
}

export interface CartResponse {
    id: number;
    items: CartItem[];
}
