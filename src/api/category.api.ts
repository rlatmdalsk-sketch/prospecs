import {httpClient} from "./axios.ts";
import type { Category, CategoryTree } from "../types/category.ts";

export const getCategories = async () => {
    const response = await httpClient.get<CategoryTree[]>("/categories");
    return response.data;
}

export const getCategoryById = async (id: number) => {
    const response = await httpClient.get<Category>(`/categories/${id}`);
    return response.data;
}