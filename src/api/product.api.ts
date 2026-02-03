import { httpClient } from "./axios.ts";
import qs from "qs";
import type { Product, ProductListResponse } from "../types/product.ts";

export interface GetProductsParams {
    page?: number;
    limit?: number;
    categoryId?: number;
    styles?: string[]; // React 내부
    genders?: string[];
    sizes?: string[];
}

// GET 방식은 바디는 없고, 내용을 주소줄에 쿼리 스트링 형식으로 담아서 보내줘야 되는데
// page나 limit나 categoryId는 number라 보내는데 무리가 없음
// 근데, styles랑 genders랑 sizes가 Array 형태라 문제가 생김  (Object도 마찬가지)

// axios는 array나 object를 쿼리 스트링으로 변환시킬 수 있도록 paramsSerializer 항목을 마련해놓음
// 다만, Serializer(직렬화)는 axios가 해주지 않음
// 직렬화를 위해 qs + @types/qs 라이브러리를 설치

export const getProducts = async (data: GetProductsParams) => {
    const response = await httpClient.get<ProductListResponse>("/products", {
        params: data,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
    });
    return response.data;
};

export const getProduct = async (id: number) => {
    const response = await httpClient.get<Product>(`/products/${id}`);
    return response.data;
}