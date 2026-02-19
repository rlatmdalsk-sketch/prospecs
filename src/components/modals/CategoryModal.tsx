import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useModalStore from "../../store/useModalStore";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { createAdminCategory, updateAdminCategory } from "../../api/admin.category.api.ts"; // updateCategory import 필요
import { AxiosError } from "axios";

interface CategoryForm {
    name: string;
    path: string;
}

const CategoryModal = () => {
    const { isOpen, closeModal, modalProps } = useModalStore();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CategoryForm>();

    // modalProps에서 필요한 데이터 추출
    // isEdit: 수정 모드 여부, category: 수정할 카테고리 객체, parentId/parentName: 등록 시 부모 정보
    // onSuccess: 성공 후 리스트 새로고침 함수
    const { isEdit, category, parentId, parentName, onSuccess } = modalProps;

    // 모달이 열릴 때 데이터 세팅
    useEffect(() => {
        if (isOpen) {
            if (isEdit && category) {
                // 수정 모드: 기존 데이터 채우기
                setValue("name", category.name);
                setValue("path", category.path);
            } else {
                // 등록 모드: 초기화
                reset({ name: "", path: "" });
            }
        }
    }, [isOpen, isEdit, category, setValue, reset]);

    const onSubmit = async (data: CategoryForm) => {
        try {
            if (isEdit) {
                // [수정]
                await updateAdminCategory(category.id, data.name, data.path);
                alert("수정되었습니다.");
            } else {
                // [등록]
                await createAdminCategory(data.name, data.path, parentId || undefined);
                alert("등록되었습니다.");
            }

            // 성공 후 처리
            if (onSuccess) onSuccess();
            closeModal();
        } catch (error) {
            if (error instanceof AxiosError) {
                alert(error.response?.data?.message || "작업 실패");
            } else {
                alert("오류가 발생했습니다.");
            }
        }
    };

    // 타이틀 결정
    const getTitle = () => {
        if (isEdit) return "카테고리 수정";
        if (parentId) return `'${parentName}' 하위 카테고리 추가`;
        return "1차 카테고리 추가";
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={getTitle()}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">
                        표시 이름 (화면용)
                    </label>
                    <Input
                        type="text"
                        placeholder="예: 신발"
                        error={errors.name}
                        registration={register("name", { required: "이름을 입력해주세요." })}
                        autoFocus
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">
                        URL 경로 (주소용)
                    </label>
                    <Input
                        type="text"
                        placeholder="예: shoes"
                        error={errors.path}
                        registration={register("path", {
                            required: "경로를 입력해주세요.",
                            pattern: {
                                value: /^[a-z0-9-]+$/,
                                message: "영문 소문자, 숫자, 하이픈(-)만 가능합니다.",
                            },
                        })}
                    />
                </div>

                <div className="flex gap-2 justify-end mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={closeModal}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        isLoading={isSubmitting}
                    >
                        {isEdit ? "수정" : "등록"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CategoryModal;