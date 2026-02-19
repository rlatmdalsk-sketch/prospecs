import useModalStore from "../../store/useModalStore.tsx";
import { type ChangeEvent, useRef, useState } from "react";
import { createReview, updateReview } from "../../api/review.api.ts";
import { FaStar } from "react-icons/fa";
import { uploadImage } from "../../api/upload.api.ts";

function ReviewModal() {
    const { closeModal, modalProps } = useModalStore();

    const {
        productId,
        productName,
        productImage,
        mode,
        reviewId,
        initialRating,
        initialContent,
        initialImages,
        onSuccess,
    } = modalProps || {};

    const isEditMode = mode === "EDIT";

    const [rating, setRating] = useState<number>(initialRating || 5);
    const [content, setContent] = useState<string>(initialContent || "");

    const [existingImages, setExistingImages] = useState<string[]>(initialImages || []);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);

    const allPreviews = [...existingImages, ...newFilePreviews];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (existingImages.length + newFiles.length > 5) {
                alert("이미지는 최대 5장까지 등록 가능합니다.");
                return;
            }

            const newFileArr = [...newFiles, ...files];
            setNewFiles(newFileArr);

            // 미리보기 URL 생성
            const newPreviewArr = files.map(file => URL.createObjectURL(file));
            setNewFilePreviews([...newFilePreviews, ...newPreviewArr]);
        }
    };

    const removeImage = (index: number) => {
        if (index < existingImages.length) {
            // 1. 기존 이미지 삭제인 경우
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            // 2. 신규 파일 삭제인 경우 (인덱스 보정 필요)
            const newFileIndex = index - existingImages.length;
            setNewFiles(prev => prev.filter((_, i) => i !== newFileIndex));
            setNewFilePreviews(prev => prev.filter((_, i) => i !== newFileIndex));
        }
    };

    // 제출 핸들러
    const handleSubmit = async () => {
        if (!content.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }
        if (content.length < 5) {
            alert("리뷰 내용은 최소 5자 이상이어야 합니다.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. 신규 파일들만 업로드 수행
            const uploadPromises = newFiles.map(file => uploadImage(file, "reviews"));
            const newUploadedUrls = await Promise.all(uploadPromises);

            // 2. 최종 이미지 리스트 = 유지된 기존 이미지 + 새로 업로드된 이미지
            const finalImageUrls = [...existingImages, ...newUploadedUrls];

            if (isEditMode && reviewId) {
                // 수정 (PUT)
                await updateReview(reviewId, {
                    rating,
                    content,
                    imageUrls: finalImageUrls, // 전체 리스트 교체 방식
                });
                alert("리뷰가 수정되었습니다.");
            } else {
                // 생성 (POST)
                await createReview({
                    productId,
                    rating,
                    content,
                    imageUrls: finalImageUrls,
                });
                alert("리뷰가 등록되었습니다.");
            }

            closeModal();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert(`리뷰 ${isEditMode ? "수정" : "등록"}에 실패했습니다.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden relative">
                {/* 헤더 */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold">{isEditMode ? "리뷰 수정" : "리뷰 작성"}</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-black text-2xl">
                        &times;
                    </button>
                </div>

                {/* 바디 */}
                <div className="p-6 space-y-5">
                    {/* 상품 정보 요약 */}
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-sm">
                        <div className="w-12 h-12 bg-gray-200 rounded-sm overflow-hidden flex-shrink-0">
                            {productImage && (
                                <img
                                    src={productImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="text-sm font-medium line-clamp-2">{productName}</div>
                    </div>

                    {/* 별점 선택 */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-gray-500 font-bold">
                            상품은 만족하셨나요?
                        </span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(score => (
                                <button
                                    key={score}
                                    onClick={() => setRating(score)}
                                    className="text-3xl transition-transform hover:scale-110">
                                    <FaStar
                                        className={
                                            score <= rating ? "text-orange-500" : "text-gray-200"
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm font-bold text-orange-600">{rating}점</span>
                    </div>

                    {/* 내용 입력 */}
                    <div>
                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded-sm resize-none focus:outline-none focus:border-black text-sm"
                            placeholder="상품에 대한 솔직한 리뷰를 남겨주세요. (최소 5자 이상)"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </div>

                    {/* 사진 첨부 */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-bold hover:bg-gray-50 flex items-center gap-1">
                                📷 사진 첨부 ({allPreviews.length}/5)
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* 미리보기 리스트 */}
                        {allPreviews.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto py-2">
                                {allPreviews.map((url, idx) => (
                                    <div
                                        key={idx}
                                        className="relative w-16 h-16 flex-shrink-0 border border-gray-100 rounded-sm">
                                        <img
                                            src={url}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center">
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 푸터 (버튼) */}
                <div className="p-4 border-t border-gray-100 flex gap-2">
                    <button
                        onClick={closeModal}
                        className="flex-1 py-3 text-sm font-bold border border-gray-300 rounded-sm hover:bg-gray-50">
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 py-3 text-sm font-bold bg-black text-white rounded-sm hover:bg-gray-800 disabled:bg-gray-400">
                        {isSubmitting ? "처리 중..." : isEditMode ? "수정하기" : "등록하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal;
