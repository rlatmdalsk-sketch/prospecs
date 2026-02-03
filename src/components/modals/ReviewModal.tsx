import Modal from "../common/Modal.tsx";
import useModalStore from "../../stores/useModalStore.ts";
import { type ChangeEvent, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FaStar } from "react-icons/fa";
import Button from "../common/Button.tsx";
import { FaX } from "react-icons/fa6";
import { uploadImage } from "../../api/upload.api.ts";
import { createReview } from "../../api/review.api.ts";

function ReviewModal() {
    const { isOpen, closeModal, modalProps } = useModalStore();
    const { productId, productName, productImage, onSuccess } = modalProps;

    // 이미지, 별점, 리뷰내용

    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            if (files.length > 5) {
                alert("이미지는 최대 5장까지 등록 가능합니다.");
                return;
            }

            // 사용자가 선택한 파일은 newFiles에 저장
            setNewFiles(files);

            // 미리보기를 하기 위해 미리보기 URL을 따로 저장해서 화면에 보여줘야 함
            const newPreviewArr = files.map(file => URL.createObjectURL(file));
            setNewFilePreviews(newPreviewArr);
        }
    };

    const removeImage = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewFilePreviews(prev => prev.filter((_, i) => i !== index));
    };

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
            // 1. 이미지를 업로드 > 이미지가 1개가 아님
            // let finalImageUrls: string[] = [];
            // for (let i = 0; i < newFiles.length; i++) {
            //     const result = await uploadImage(newFiles[i], "reviews");
            //     finalImageUrls.push(result);
            // }
            // uploadImage 라고 하는 함수는, 지금 당장 값을 알 수 있는게 아니라 백엔드랑 통신을 한 이후에 결과를 알 수 있는
            // 비동기 함수. 그러기 때문에 계속 사용할 때 async - await 을 사용했던 것
            const uploadPromises = newFiles.map(file => uploadImage(file, "reviews"));   // Array 형태로 반환됨

            // 비동기 함수들의 결과를 담는 array를 만들었지만, 그 안에서 await을 쓰지 않았음
            // 그렇기 때문에 uploadPromises 변수의 타입이 Promise<string>[] -> 비동기 함수 결과값의 array인데, 그 비동기 함수 결과는 string이다.

            // Promise.all() 메서드를 통해 비동기 실행
            // 원래대로 순차적으로 await을 통해 비동기 함수를 실행하면 직렬방식. -> 1개 실행하고 데이터를 기다리고. 1개 실행하고 데이터를 기다리고.
            // Promise.all() 메서드를 통해 비동기 실행하면 병렬방식
            const finalImageUrls = await Promise.all(uploadPromises);

            // 2. 그 받아온 url들을 가지고 백엔드에게 리뷰 등록 요청
            await createReview({
                productId,
                rating,
                content,
                imageUrls: finalImageUrls,
            })

            // 3. 성공했다는 알람 띄움
            alert("리뷰가 등록되었습니다.");

            // 4. 모달을 닫음
            closeModal();
            if (onSuccess) onSuccess();
        } catch (e) {
            console.log(e);
            alert("리뷰 등록에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={"리뷰 작성"}>
            <div className={twMerge(["py-6", "space-y-5"])}>
                {/* 상품 정보 요약 */}
                <div
                    className={twMerge(
                        ["flex", "items-center", "gap-3"],
                        ["bg-gray-50", "rounded-sm"],
                    )}>
                    <div
                        className={twMerge(
                            ["w-12", "h-12", "bg-gray-200", "rounded-sm"],
                            ["overflow-hidden"],
                        )}>
                        {productImage && (
                            <img
                                src={productImage}
                                alt={productName}
                                className={twMerge(["w-full", "h-full", "object-cover"])}
                            />
                        )}
                    </div>
                    <div className={twMerge(["text-sm", "font-medium"])}>{productName}</div>
                </div>

                {/* 별점 선택 */}
                <div className={twMerge(["flex", "justify-center", "gap-2"])}>
                    {[1, 2, 3, 4, 5].map(score => (
                        <button key={score} onClick={() => setRating(score)}>
                            <FaStar
                                className={twMerge([
                                    "text-3xl",
                                    "transition-all",
                                    "hover:scale-110",
                                    score <= rating ? "text-orange-500" : "text-gray-200",
                                ])}
                            />
                        </button>
                    ))}
                </div>

                {/* 리뷰 내용 입력 */}
                <textarea
                    className={twMerge(
                        ["w-full", "h-32", "p-3", "border-gray-300", "rounded-sm", "resize-none"],
                        ["border", "focus:outline-none", "focus:border-black", "text-sm"],
                    )}
                    placeholder={"상품에 대한 솔직한 리뷰를 남겨주세요. (최소 5자 이상)"}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />

                {/* 사진 첨부 */}
                <div>
                    {/* 사진 첨부 버튼 */}
                    <div className={twMerge(["flex", "items-center", "gap-2", "mb-2"])}>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={twMerge(
                                ["px-3", "py-1.5", "border", "border-gray-300", "rounded-sm"],
                                ["text-xs", "font-bold", "hover:bg-gray-50"],
                            )}>
                            사진 첨부
                        </button>
                        <input
                            type={"file"}
                            className={"hidden"}
                            accept={"image/*"}
                            multiple
                            id={"reviewImage"}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                    {/* 사진 미리보기 */}
                    {newFilePreviews.length > 0 && (
                        <div className={twMerge(["flex", "gap-2", "overflow-x-auto", "py-2"])}>
                            {newFilePreviews.map((url, index) => (
                                <div
                                    key={index}
                                    className={twMerge(
                                        ["w-16", "h-16", "border", "border-gray-100", "rounded-sm"],
                                        "relative",
                                    )}>
                                    <img
                                        src={url}
                                        alt={`preview-${index}`}
                                        className={twMerge(["w-full", "h-full", "object-cover"])}
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className={twMerge(
                                            ["absolute", "-top-1.5", "-right-1.5"],
                                            [
                                                "w-5",
                                                "h-5",
                                                "bg-black",
                                                "text-white",
                                                "rounded-full",
                                            ],
                                            ["text-xs", "flex", "justify-center", "items-center"],
                                        )}>
                                        <FaX size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 버튼 */}
                <div className={twMerge(["p-4", "border-gray-100", "flex", "gap-2"])}>
                    <Button fullWidth={true} onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "처리 중..." : "등록하기"}
                    </Button>
                    <Button fullWidth={true} variant={"secondary"} onClick={closeModal}>
                        취소
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ReviewModal;
