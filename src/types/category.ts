export interface Category {
    id: number;
    name: string;
    path: string;
    parentId: number;
    createdAt: string;
    updatedAt: string;
    breadcrumbs: BreadcrumbsItem[];
}

export interface BreadcrumbsItem {
    id: number;
    name: string;
    path: string;
}

//               "1차 카테고리"
export interface CategoryTree extends Category {
    children: Category[];
}