import type { Product } from "../types/product";
import qs from "qs";
import { httpClient } from "./axios"; // 공용 axios 인스턴스 (토큰 없어도 되는 설정 필요)

export interface GetProductParams {
    page?: number;
    limit?: number;
    categoryId?: number;
    styles?: string[];
    genders?: string[];
    sizes?: string[];
}

// [사용자용] 상품 목록 조회 (경로가 /(shop)/products 임에 주의)
export const getProducts = async (params: GetProductParams) => {
    const response = await httpClient.get("/products", {
        params,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data; // { meta: ..., data: [] }
};

// [사용자용] 상품 상세 조회
export const getProductDetail = async (id: number) => {
    const response = await httpClient.get<Product>(`/products/${id}`);
    return response.data;
};