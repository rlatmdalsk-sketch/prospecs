import type { Category } from "./category.ts";

export interface MetaResponse {
    total: number;
    page: number;
    lastPage: number;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    summary: string;
    isNew:  boolean;
    isBest:  boolean;
    createdAt: string;
    updatedAt: string;

    gender:string;
    style:string;

    material?: string;
    sizeInfo?: string;
    manufacturer: string;
    originCountry: string;
    careInstructions: string;
    manufactureDate?: string;
    qualityAssurance?: string;
    asPhone?: string;

    categoryID: number;
    category: Category;

    colors: ProductColor[];
}

export interface ProductColor {
    id: number;
    productCode: string;
    hexCode: string;
    colorInfo: string;
    images: productImage[];
    sizes: ProductSize[];
}

export interface ProductImage {
    id: number;
    url: string;;
}

export interface ProductColors {
    id: number;
    size: string;
    stock: number;
}

export interface ProductListResponse {
    meta: MetaResponse,
    data: Product[],

}