import type { CreateReviewParams, MyReview, Review, UpdateReviewParams } from "../types/review.ts";
import { httpClient } from "./axios.ts";

export const createReview = async (data: CreateReviewParams) => {
    const response = await httpClient.post("/reviews", data);
    return response.data;
};

export const getMyReviews = async () => {
    const response = await httpClient.get<MyReview[]>("/reviews/me");
    return response.data;
};

export const getProductReviews = async (productId: number) => {
    const response = await httpClient.get<Review[]>(`products/${productId}/reviews`);
    return response.data;
}

export const updateReviews = async (reviewId: number, data: UpdateReviewParams) => {
    const response = await httpClient.put(`/reviews/${reviewId}`, data);
    return response.data;
}

export const deleteReviews = async (reviewId: number) => {
    const response = await httpClient.delete(`/reviews/${reviewId}`);
    return response.data;
};