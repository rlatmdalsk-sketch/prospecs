import type { Category } from "./category";

export interface ProductImage {
    id: number;
    url: string;
}

export interface ProductSize {
    id: number;
    size: string;
    stock: number;
}

export interface ProductColor {
    id: number;
    productCode: string;
    colorName: string;
    hexCode?: string;
    colorInfo?: string; // [New] 색상 상세 설명
    images: ProductImage[];
    sizes: ProductSize[];
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    summary?: string;
    isNew: boolean;
    isBest: boolean;
    createdAt: string;

    style: string; // 예: RACING, JACKET
    gender: string; // 예: MALE, FEMALE, COMMON

    // [New] 상품 고시 정보 (메타 데이터)
    material?: string; // 소재
    sizeInfo?: string;
    manufacturer?: string; // 제조사
    originCountry?: string; // 제조국
    careInstructions?: string; // 세탁/취급 주의사항
    manufactureDate?: string; // 제조년월
    qualityAssurance?: string; // 품질보증기준
    asPhone?: string; // A/S 책임자 및 전화번호

    // 관계형 데이터
    categoryId: number;
    category: Category;
    colors: ProductColor[];
}

// 목록 조회 응답 타입
export interface ProductListResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}