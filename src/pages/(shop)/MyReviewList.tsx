import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { MyReview } from "../../types/review.ts";
import { deleteReviews, getMyReviews } from "../../api/review.api.ts";
import { FaPen, FaRegStar, FaStar, FaTrash } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import useModalStore from "../../stores/useModalStore.ts";

function MyReviewList() {
    const navigate = useNavigate();
    const { openModal } = useModalStore();

    const [reviews, setReviews] = useState<MyReview[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const result = await getMyReviews();
            setReviews(result);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews().then(() => {});
    }, []);

    const handleEdit = (review: MyReview) => {
        openModal("REVIEW_FORM", {
            mode: "EDIT",
            reviewId: review.id,
            initialRating: review.rating,
            initialContent: review.content,
            initialImage: review.images.map((image) => image.url),
            productId: review.product.id,
            productName: review.product.name,
            productImage: review.product.thumbnail,
            onSuccess: () => {
                fetchReviews().then(() => {}); // 리뷰 목록을 다시 불러와서 화면을 갱신해라
            },
        });
    };

    const handleDelete = async (reviewId: number) => {
        if (!window.confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
            return;
        }

        try {
            await deleteReviews(reviewId);
            alert("리뷰가 삭제되었습니다.");
            fetchReviews().then(() => {});
        } catch (e) {
            console.log(e);
            alert("리뷰 삭제 중 오류가 발생했습니다.");
        }
    };

    if (loading)
        return <div className="py-20 text-center text-gray-500">리뷰를 불러오는 중...</div>;

    return (
        <div className="w-full mx-auto px-4">
            <h1 className="text-2xl font-bold mb-8 text-gray-900 border-b-2 border-black pb-4">
                나의 상품 후기
            </h1>

            {reviews.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 border border-gray-100 rounded-sm">
                    <p className="text-gray-500 mb-4">작성한 리뷰가 없습니다.</p>
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="text-sm text-black underline hover:text-gray-600 font-medium">
                        구매 내역에서 리뷰 작성하기
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div
                            key={review.id}
                            className="border border-gray-200 rounded-sm bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* 상단: 상품 정보 (클릭 시 상세 이동) */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-100">
                                <div
                                    className="w-12 h-12 bg-white border border-gray-200 rounded-sm overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/products${review.product.id}`)}>
                                    {review.product.thumbnail ? (
                                        <img
                                            src={review.product.thumbnail}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3
                                        className="text-sm font-bold text-gray-900 cursor-pointer hover:underline truncate"
                                        onClick={() => navigate(`/product/${review.product.id}`)}>
                                        {review.product.name}
                                    </h3>
                                    <div className="text-xs text-gray-500 mt-1">
                                        작성일: {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                {/* 수정/삭제 버튼 */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(review)}
                                        className="text-gray-400 hover:text-blue-600 p-2 transition-colors"
                                        title="수정">
                                        <FaPen size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="text-gray-400 hover:text-red-600 p-2 transition-colors"
                                        title="삭제">
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* 본문: 별점 + 내용 + 이미지 */}
                            <div className="p-5">
                                <div className="flex text-orange-500 text-sm mb-3">
                                    <RenderStar rating={review.rating} />
                                    <span className="ml-2 text-gray-400 text-xs font-medium self-center">
                                        {review.rating}점
                                    </span>
                                </div>

                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                                    {review.content}
                                </p>

                                {/* 첨부 이미지 */}
                                {review.images.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {review.images.map(img => (
                                            <div
                                                key={img.id}
                                                className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-sm flex-shrink-0 overflow-hidden cursor-pointer"
                                                onClick={() => window.open(img.url, "_blank")}>
                                                <img
                                                    src={img.url}
                                                    alt="review"
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyReviewList;

interface RenderStarProps {
    rating: number;
}

export function RenderStar({ rating }: RenderStarProps) {
    // rating 3 : 별별별
    // const star = [];
    // for (let i = 0; i < rating; i++) {
    //     star.push(<FaStar key={i} />)
    // }
    // return star;

    // rating 3 : 노노노회회
    const star = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            star.push(<FaStar key={i} className={"text-yellow-500"} />);
        } else {
            star.push(<FaRegStar key={i} className={twMerge(["text-gray-300"])} />);
        }
    }
    return star;
}