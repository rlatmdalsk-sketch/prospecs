import { useEffect, useState } from "react";
import { getProductReviews } from "../../api/review.api";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import type { Review } from "../../types/review.ts"; // react-icons 설치 필요 (혹은 텍스트 ★로 대체 가능)

interface ProductReviewsProps {
    productId: number;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getProductReviews(productId);
                setReviews(data);
            } catch (error) {
                console.error("리뷰 로드 실패", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    // 평균 평점 계산
    const averageRating =
        reviews.length > 0
            ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
            : "0.0";

    if (loading) return <div className="py-10 text-center text-gray-400">리뷰 불러오는 중...</div>;

    return (
        <div className="mt-20 border-t border-gray-200 pt-16">
            <h3 className="text-xl font-bold mb-6 text-gray-900">
                상품후기 <span className="text-orange-600 ml-1">{reviews.length}</span>
            </h3>

            {/* 1. 리뷰 요약 박스 (평점) */}
            <div className="bg-gray-50 border border-gray-100 p-8 flex flex-col items-center justify-center rounded-sm mb-10">
                <div className="text-4xl font-extrabold text-gray-900 mb-2">{averageRating}</div>
                <div className="flex gap-1 text-orange-500 text-lg mb-2">
                    {/* 평균 별점 렌더링 (단순화를 위해 5개 꽉 채우거나 비우거나 처리) */}
                    {renderStars(Number(averageRating))}
                </div>
                <div className="text-sm text-gray-500">
                    총 <span className="font-bold text-gray-900">{reviews.length}</span>개의
                    상품평이 있습니다.
                </div>
            </div>

            {/* 2. 리뷰 리스트 */}
            {reviews.length === 0 ? (
                <div className="py-16 text-center text-gray-400 border-b border-gray-200">
                    작성된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {reviews.map(review => (
                        <ReviewItem key={review.id} review={review} />
                    ))}
                </ul>
            )}
        </div>
    );
};

// 개별 리뷰 아이템 컴포넌트
function ReviewItem({ review }: { review: Review }) {
    // 이름 마스킹 (홍길동 -> 홍*동)
    const maskName = (name: string) => {
        if (name.length <= 1) return name;
        return name[0] + "*".repeat(name.length - 1);
    };

    // 날짜 포맷팅 (YYYY-MM-DD)
    const formatDate = (isoString: string) => {
        return new Date(isoString).toISOString().split("T")[0];
    };

    return (
        <li className="py-8 flex flex-col md:flex-row gap-6">
            {/* 좌측: 작성자 정보 및 별점 */}
            <div className="w-full md:w-48 flex-shrink-0 flex md:flex-col items-center md:items-start gap-2 md:gap-1">
                <div className="flex text-orange-500 text-sm">{renderStars(review.rating)}</div>
                <div className="flex gap-2 md:flex-col text-sm text-gray-500 mt-1 md:mt-2">
                    <span className="font-medium text-gray-900">{maskName(review.user.name)}</span>
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                </div>
            </div>

            {/* 우측: 내용 및 이미지 */}
            <div className="flex-1 space-y-4">
                {/* 텍스트 내용 */}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                    {review.content}
                </p>

                {/* 이미지 리스트 */}
                {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-2">
                        {review.images.map(img => (
                            <div
                                key={img.id}
                                className="w-24 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0 border border-gray-200 cursor-pointer hover:opacity-90"
                                onClick={() => window.open(img.url, "_blank")} // 클릭 시 원본 보기 (간단 구현)
                            >
                                <img
                                    src={img.url}
                                    alt="Review"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </li>
    );
}

// 별점 렌더링 헬퍼 함수
const renderStars = (rating: number) => {
    // rating: 1 ~ 5
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(<FaStar key={i} />);
        } else if (rating >= i - 0.5) {
            stars.push(<FaStarHalfAlt key={i} />); // 반 개 별 (필요시 사용)
        } else {
            stars.push(<FaRegStar key={i} className="text-gray-300" />);
        }
    }
    return stars;
};

export default ProductReviews;
