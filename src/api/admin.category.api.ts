import type { Category } from "../types/category.ts";
import { httpClient } from "./axios.ts";

export const getAdminCategories = async () => {
    // 관리자 API 경로: /admin/categories (http.ts의 baseURL이 /api라고 가정 시 /admin/categories)
    // 만약 baseURL이 /api 라면, 경로는 /admin/categories 가 됩니다.
    const response = await httpClient.get<Category[]>("/admin/categories");
    return response.data;
};

// 카테고리 생성
export const createAdminCategory = async (name: string, path: string, parentId?: number) => {
    const response = await httpClient.post<{ message: string; category: Category }>(
        "/admin/categories",
        { name, path, parentId }, // path 추가
    );
    return response.data;
};

export const updateAdminCategory = async (id: number, name: string, path: string) => {
    const response = await httpClient.put<{ message: string; category: Category }>(
        `/admin/categories/${id}`,
        { name, path }
    );
    return response.data;
};

export const deleteAdminCategory = async (id: number) => {
    const response = await httpClient.delete<{ message: string }>(
        `/admin/categories/${id}`
    );
    return response.data;
};