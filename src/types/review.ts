export interface Review {
    id: number;
    rating: number;  // 별점
    content: string; // 작성내용
    createdAt: string;
    user: {
        name: string;
    };
    images: ReviewImage[];
}

export interface ReviewImage {
    id: number;
    url: string;
}

export interface CreateReviewParams {
    productId: number;
    rating: number;
    content: string;
    imageUrls?: string[];
}

export interface MyReview {
    id: number;
    rating: number;
    content: string | null;
    createdAt: string;
    product: {
        id: number,
        name: string,
        thumbnail: string | null;
    };
    images: ReviewImage[];
}