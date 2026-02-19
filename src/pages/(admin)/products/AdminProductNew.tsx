import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import type { CategoryTree } from "../../../types/category.ts";
import { getAdminCategories } from "../../../api/admin.category.api.ts";
import Input from "../../../components/common/Input.tsx";
import Button from "../../../components/common/Button.tsx";
import ColorFormItem from "../../../components/common/ColorFormItem.tsx";
import { createAdminProduct, type CreateProductRequest } from "../../../api/admin.product.api.ts";
import Editor from "../../../components/common/Editor";
import { FILTER_GENDERS, FILTER_STYLES } from "../../../constants/filter.const"; // 분리한 컴포넌트

// 폼 데이터 타입 정의 (중첩 구조)
export interface CreateProductForm extends Omit<CreateProductRequest, "colors"> {
    // [New] style, gender는 CreateProductRequest에 이미 포함되어 있지만 명시적으로 확인
    style: string;
    gender: string;

    colors: {
        productCode: string;
        colorName: string;
        hexCode?: string;
        colorInfo?: string;
        images: { url: string }[];
        sizes: { size: string; stock: number }[];
    }[];
}

const AdminProductNew = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoryTree[]>([]);

    // Hook Form 초기화
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateProductForm>({
        defaultValues: {
            isNew: true,
            isBest: false,
            // [New] 기본값 설정 (필수 필드이므로 초기값 필요)
            style: FILTER_STYLES[0].value,
            gender: FILTER_GENDERS[2].value, // COMMON(성인공통)을 기본으로
            colors: [{ images: [], sizes: [{ size: "", stock: 0 }] }],
        },
    });

    const {
        fields: colorFields,
        append: appendColor,
        remove: removeColor,
    } = useFieldArray({
        control,
        name: "colors",
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getAdminCategories();
                const subCategories = data.filter(
                    c => c.parentId !== null,
                ) as unknown as CategoryTree[];
                setCategories(subCategories);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                alert("카테고리 로드 실패");
            }
        };
        loadCategories();
    }, []);

    const onSubmit = async (data: CreateProductForm) => {
        try {
            const payload = {
                ...data,
                // [Check] style, gender는 이미 data 안에 포함되어 있음
                colors: data.colors.map(c => ({
                    ...c,
                    images: c.images.map(img => img.url),
                })),
            };

            await createAdminProduct(payload);
            alert("상품이 등록되었습니다.");
            navigate("/admin/products");
        } catch (error) {
            if (error instanceof AxiosError) {
                alert(error.response?.data?.message || "등록 실패");
            } else {
                alert("오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="pb-20 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">신규 상품 등록</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* 1. 기본 정보 섹션 */}
                <section className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-6">
                    <h3 className="font-bold text-lg border-b pb-2">기본 정보</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="상품명"
                            placeholder="상품 이름을 입력하세요"
                            registration={register("name", { required: "상품명은 필수입니다." })}
                            error={errors.name}
                        />

                        {/* 카테고리 선택 */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">
                                카테고리 <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full border border-gray-300 p-4 text-sm focus:outline-none focus:border-black bg-white appearance-none"
                                {...register("categoryId", {
                                    required: true,
                                    valueAsNumber: true,
                                })}>
                                <option value="">카테고리 선택</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name} ({cat.path})
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="text-red-500 text-xs mt-1">
                                    카테고리를 선택해주세요.
                                </p>
                            )}
                        </div>

                        {/* [New] 종류 (Style) 선택 */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">
                                종류 (필터용) <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full border border-gray-300 p-4 text-sm focus:outline-none focus:border-black bg-white appearance-none"
                                {...register("style", { required: true })}>
                                {FILTER_STYLES.map(style => (
                                    <option key={style.value} value={style.value}>
                                        {style.label}
                                    </option>
                                ))}
                            </select>
                            {errors.style && (
                                <p className="text-red-500 text-xs mt-1">종류를 선택해주세요.</p>
                            )}
                        </div>

                        {/* [New] 성별 (Gender) 선택 */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">
                                성별 (필터용) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4 mt-2">
                                {FILTER_GENDERS.map(gender => (
                                    <label
                                        key={gender.value}
                                        className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value={gender.value}
                                            {...register("gender", { required: true })}
                                            className="w-4 h-4 accent-black"
                                        />
                                        <span className="text-sm">{gender.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.gender && (
                                <p className="text-red-500 text-xs mt-1">성별을 선택해주세요.</p>
                            )}
                        </div>

                        <Input
                            type="number"
                            label="판매가"
                            placeholder="가격 입력"
                            registration={register("price", {
                                required: "가격은 필수입니다.",
                                valueAsNumber: true,
                            })}
                            error={errors.price}
                        />

                        {/* 체크박스 그룹 */}
                        <div className="flex gap-6 items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("isNew")}
                                    className="w-5 h-5 accent-black"
                                />
                                <span className="text-sm font-bold">NEW 상품</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("isBest")}
                                    className="w-5 h-5 accent-black"
                                />
                                <span className="text-sm font-bold">BEST 상품</span>
                            </label>
                        </div>
                    </div>

                    {/* 설명 섹션 */}
                    <div className="space-y-4">
                        <Input
                            label="요약 설명 (선택)"
                            placeholder="상품 카드에 노출될 짧은 설명"
                            registration={register("summary")}
                        />

                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">
                                상세 설명
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "상세 설명은 필수입니다." }}
                                render={({ field: { onChange, value } }) => (
                                    <Editor
                                        value={value || ""}
                                        onChange={onChange}
                                        placeholder="상품 상세 내용을 입력하세요."
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* 2. 상품 상세 스펙 (Meta Info) - 기존과 동일 */}
                <section className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-6">
                    <h3 className="font-bold text-lg border-b pb-2">상품 고시 정보</h3>
                    {/* ... (기존 Input 필드들 유지) ... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="소재"
                            placeholder="예: 폴리에스터 100%"
                            registration={register("material")}
                        />
                        <Input
                            label="사이즈 정보"
                            placeholder="예: 정사이즈"
                            registration={register("sizeInfo")}
                        />
                        <Input
                            label="제조사"
                            placeholder="예: (주)LS네트웍스"
                            registration={register("manufacturer")}
                        />
                        <Input
                            label="제조국"
                            placeholder="예: 베트남"
                            registration={register("originCountry")}
                        />
                        <Input
                            label="제조년월"
                            placeholder="예: 2024.01"
                            registration={register("manufactureDate")}
                        />
                        <Input
                            label="세탁/취급 주의사항"
                            placeholder="예: 손세탁 권장"
                            registration={register("careInstructions")}
                            fullWidth
                            className="md:col-span-2"
                        />
                        <Input
                            label="품질보증기준"
                            placeholder="관련 법 및 소비자 분쟁해결 기준에 따름"
                            registration={register("qualityAssurance")}
                        />
                        <Input
                            label="A/S 책임자/전화번호"
                            placeholder="예: 080-000-0000"
                            registration={register("asPhone")}
                        />
                    </div>
                </section>

                {/* 3. 옵션 정보 - 기존과 동일 */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">상품 옵션 (색상/사이즈)</h3>
                        <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                                appendColor({ images: [], sizes: [{ size: "", stock: 0 }] } as any)
                            }>
                            + 색상 추가
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {colorFields.map((field, index) => (
                            <ColorFormItem
                                key={field.id}
                                index={index}
                                control={control}
                                register={register}
                                remove={removeColor}
                                errors={errors}
                            />
                        ))}
                    </div>
                </section>

                {/* 하단 버튼 */}
                <div className="flex justify-end gap-3 pt-10 border-t">
                    <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        className="w-40">
                        상품 등록 완료
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductNew;