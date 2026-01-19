export interface Category {
    id: number;
    name: string;
    path: string;
    parentId: number;
    createdAt: string;
    updatedAt: string;
    BreadcrumbsItem: BreadcrumbsItem[];
}

export interface BreadcrumbsItem {
    id: number;
    name: string;
    path: string;
}

//1차 카테고리
export interface CategoryTree extends Category {
    children: Category[];
}

export const CategoryTree = {
    id: 0,
    name: "Running",
    path: "/category/1",
    parentId: 0,
    createdAt: "",
    updatedAt: "",
    children: [
        {
            id: 1,
            name: "shoes",
            path: "/category/6",
        }
    ]
}