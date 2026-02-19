export interface Category {
    id: number;
    name: string;
    path: string;
    parentId: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface BreadcrumbItem {
    id: number;
    name: string;
    path: string;
}

// 3. [New] 상세 조회 응답 타입 (기본 타입 + breadcrumbs)
export interface CategoryDetail extends Category {
    breadcrumbs: BreadcrumbItem[];
}