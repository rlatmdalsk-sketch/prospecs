import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { AxiosError } from "axios";
import {
    getAdminProductDetail,
    updateAdminProduct,
    type CreateProductRequest,
} from "../../../api/admin.product.api";
import type { CategoryTree } from "../../../types/category";
import { getAdminCategories } from "../../../api/admin.category.api";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import ColorFormItem from "../../../components/common/ColorFormItem";
import Editor from "../../../components/common/Editor";
import { FILTER_GENDERS, FILTER_STYLES } from "../../../constants/filter.const"; // [New] 상수 import

// 폼 타입 (style, gender 추가)
interface EditProductForm extends Omit<CreateProductRequest, "colors"> {
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

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoryTree[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Hook Form
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EditProductForm>({
        defaultValues: {
            isNew: false,
            isBest: false,
            colors: [],
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

    // 초기 데이터 로드
    useEffect(() => {
        const init = async () => {
            if (!id) return;
            try {
                setIsLoading(true);

                const [categoryData, productData] = await Promise.all([
                    getAdminCategories(),
                    getAdminProductDetail(Number(id)),
                ]);

                const subCategories = categoryData.filter(
                    c => c.parentId !== null,
                ) as unknown as CategoryTree[];
                setCategories(subCategories);

                // 폼 데이터 매핑
                const formData: EditProductForm = {
                    name: productData.name,
                    description: productData.description,
                    summary: productData.summary || "",
                    price: productData.price,
                    categoryId: productData.categoryId,

                    // [New] 필터링 데이터 초기값 설정
                    style: productData.style || FILTER_STYLES[0].value, // 값이 없으면 기본값
                    gender: productData.gender || FILTER_GENDERS[2].value,

                    // 메타 정보
                    material: productData.material || "",
                    sizeInfo: productData.sizeInfo || "",
                    manufacturer: productData.manufacturer || "",
                    originCountry: productData.originCountry || "",
                    careInstructions: productData.careInstructions || "",
                    manufactureDate: productData.manufactureDate || "",
                    qualityAssurance: productData.qualityAssurance || "",
                    asPhone: productData.asPhone || "",

                    isNew: productData.isNew,
                    isBest: productData.isBest,

                    // 중첩 데이터 변환
                    colors: productData.colors.map(c => ({
                        productCode: c.productCode,
                        colorName: c.colorName,
                        hexCode: c.hexCode || "",
                        colorInfo: c.colorInfo || "",
                        images: c.images.map(img => ({ url: img.url })),
                        sizes: c.sizes.map(s => ({ size: s.size, stock: s.stock })),
                    })),
                };

                reset(formData);
            } catch (e) {
                console.error(e);
                alert("상품 정보를 불러오지 못했습니다.");
                navigate("/admin/products");
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [id, navigate, reset]);

    const onSubmit = async (data: EditProductForm) => {
        if (!id) return;
        try {
            // [Check] style, gender는 data 안에 이미 포함되어 있음
            const payload: CreateProductRequest = {
                ...data,
                colors: data.colors.map(c => ({
                    ...c,
                    images: c.images.map(img => img.url),
                })),
            };

            await updateAdminProduct(Number(id), payload);
            alert("상품이 수정되었습니다.");
            navigate("/admin/products");
        } catch (error) {
            if (error instanceof AxiosError) {
                alert(error.response?.data?.message || "수정 실패");
            } else {
                alert("오류가 발생했습니다.");
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center">데이터를 불러오는 중...</div>;

    return (
        <div className="pb-20 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">상품 수정</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* 1. 기본 정보 */}
                <section className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-6">
                    <h3 className="font-bold text-lg border-b pb-2">기본 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="상품명"
                            placeholder="상품명"
                            registration={register("name", { required: "필수" })}
                            error={errors.name}
                        />

                        {/* 카테고리 선택 */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">
                                카테고리
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
                            placeholder="가격"
                            registration={register("price", {
                                required: "필수",
                                valueAsNumber: true,
                            })}
                            error={errors.price}
                        />

                        <div className="flex gap-6 items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("isNew")}
                                    className="w-5 h-5 accent-black"
                                />
                                <span className="text-sm font-bold">NEW</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("isBest")}
                                    className="w-5 h-5 accent-black"
                                />
                                <span className="text-sm font-bold">BEST</span>
                            </label>
                        </div>
                    </div>

                    <Input
                        label="요약 설명 (선택)"
                        placeholder="요약 설명"
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
                </section>

                {/* 2. 상세 정보 (고시 정보) */}
                <section className="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-6">
                    <h3 className="font-bold text-lg border-b pb-2">상품 고시 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="소재" registration={register("material")} />
                        <Input label="사이즈 정보" registration={register("sizeInfo")} />
                        <Input label="제조사" registration={register("manufacturer")} />
                        <Input label="제조국" registration={register("originCountry")} />
                        <Input label="제조년월" registration={register("manufactureDate")} />
                        <Input
                            label="세탁/취급 주의사항"
                            registration={register("careInstructions")}
                            fullWidth
                            className="md:col-span-2"
                        />
                        <Input label="품질보증기준" registration={register("qualityAssurance")} />
                        <Input label="A/S 책임자/전화번호" registration={register("asPhone")} />
                    </div>
                </section>

                {/* 3. 옵션 정보 - 기존 유지 */}
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

                <div className="flex justify-end gap-3 pt-10 border-t">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/admin/products")}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        className="w-40">
                        수정 완료
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductEdit;
