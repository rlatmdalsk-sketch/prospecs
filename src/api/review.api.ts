import type { CreateReviewParams, MyReview, Review, UpdateReviewParams } from "../types/review.ts";
import { httpClient } from "./axios.ts";

export const getProductReviews = async (productId: number) => {
    const response = await httpClient.get<Review[]>(`/products/${productId}/reviews`);
    return response.data;
};

export const createReview = async (data: CreateReviewParams) => {
    const response = await httpClient.post("/reviews", data);
    return response.data;
};

export const getMyReviews = async () => {
    const response = await httpClient.get<MyReview[]>("/reviews/me");
    return response.data;
};

export const updateReview = async (reviewId: number, data: UpdateReviewParams) => {
    const response = await httpClient.put(`/reviews/${reviewId}`, data);
    return response.data;
};

// [New] 리뷰 삭제 (필요하실 것 같아서 함께 추가합니다)
export const deleteReview = async (reviewId: number) => {
    const response = await httpClient.delete(`/reviews/${reviewId}`);
    return response.data;
};