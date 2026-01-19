import { httpClient } from "./axios.ts";
import qs from "qs";
import { data } from "react-router";

export interface GetProductsParams {
    page?: number;
    limit?: number;
    categoryId?: number;
    styles?: string[];
    genders?: string[];
    sizes?: string[];
}

//qs사용

export const getProducts = async() => {
    const response = await httpClient.get("/products", {
        params: data,
        paramsSerializer: qs.stringify(params, {arrayFormat: "repeat"}),
    });
    return response.data;
}