import type { Product, ProductListResponse } from "../types/product";
import qs from "qs";
import { httpClient } from "./axios.ts";

// [Type] 상품 생성/수정 시 서버로 보낼 데이터 타입
// (프론트 form state와 달리 images가 string[] 형태임)
export interface CreateProductRequest {
    name: string;
    description: string;
    summary?: string;
    price: number;
    categoryId: number;

    // [New] 필수 필드 추가
    style: string;
    gender: string;

    material?: string;
    sizeInfo?: string;
    manufacturer?: string;
    originCountry?: string;
    careInstructions?: string;
    manufactureDate?: string;
    qualityAssurance?: string;
    asPhone?: string;

    isNew?: boolean;
    isBest?: boolean;

    colors: {
        productCode: string;
        colorName: string;
        hexCode?: string;
        colorInfo?: string;
        images: string[];
        sizes: {
            size: string;
            stock: number;
        }[];
    }[];
}

export interface GetAdminProductParams {
    page?: number;
    limit?: number;
    categoryId?: number;
    styles?: string[]; // ['RACING', 'JACKET']
    genders?: string[]; // ['MALE']
    sizes?: string[]; // ['260', '100']
}

// 상품 목록 조회
export const getAdminProducts = async (params: GetAdminProductParams) => {
    const response = await httpClient.get<ProductListResponse>("/admin/products", {
        params,
        // 배열 파라미터 직렬화 (qs 라이브러리 사용)
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
};

// 2. 상품 상세 조회 (수정 페이지용)
export const getAdminProductDetail = async (id: number) => {
    const response = await httpClient.get<Product>(`/admin/products/${id}`);
    return response.data;
};

// 3. [New] 상품 등록
export const createAdminProduct = async (data: CreateProductRequest) => {
    const response = await httpClient.post<{ message: string; product: Product }>(
        "/admin/products",
        data,
    );
    return response.data;
};

// 4. 상품 수정
export const updateAdminProduct = async (id: number, data: CreateProductRequest) => {
    const response = await httpClient.put<{ message: string; product: Product }>(
        `/admin/products/${id}`,
        data,
    );
    return response.data;
};

// 상품 삭제
export const deleteAdminProduct = async (id: number) => {
    const response = await httpClient.delete<{ message: string }>(`/admin/products/${id}`);
    return response.data;
};
