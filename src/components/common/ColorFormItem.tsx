import {
    type Control,
    type FieldErrors,
    useFieldArray,
    type UseFormRegister,
} from "react-hook-form";
import Button from "./Button.tsx";
import Input from "./Input.tsx";
import ImageUploader from "./ImageUploader.tsx";
import type { CreateProductForm } from "../../pages/(admin)/products/AdminProductNew.tsx";

interface Props {
    control: Control<CreateProductForm>;
    register: UseFormRegister<CreateProductForm>;
    index: number; // 현재 색상의 인덱스
    remove: (index: number) => void;
    errors: FieldErrors<CreateProductForm>;
}

const ColorFormItem = ({ control, register, index, remove, errors }: Props) => {
    // 1. 사이즈 관리 (Nested Field Array)
    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
        control,
        name: `colors.${index}.sizes`,
    });

    // 2. 이미지 관리 (Nested Field Array)
    const { fields: imageFields, append: appendImage, remove: removeImage, update: updateImage } = useFieldArray({
        control,
        name: `colors.${index}.images`,
    });

    return (
        <div className="border border-gray-200 p-6 rounded-lg bg-gray-50 relative">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">색상 옵션 #{index + 1}</h4>
                <Button variant="danger" size="sm" onClick={() => remove(index)} type="button">
                    색상 삭제
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                    placeholder="상품 코드 (예: PW0UW25F303)"
                    registration={register(`colors.${index}.productCode`, { required: "필수" })}
                    error={errors.colors?.[index]?.productCode}
                />
                <div className="flex gap-2">
                    <Input
                        placeholder="색상명 (예: WHITE)"
                        registration={register(`colors.${index}.colorName`, { required: "필수" })}
                        error={errors.colors?.[index]?.colorName}
                    />
                    <Input
                        type="color"
                        className="w-14 h-[54px] p-1 cursor-pointer"
                        registration={register(`colors.${index}.hexCode`)}
                    />
                </div>

                {/* [New] 색상 상세 설명 추가 */}
                <div className="md:col-span-2">
                    <Input
                        label="색상 상세 설명 (선택)"
                        placeholder="예: 화이트 / 메쉬 소재"
                        registration={register(`colors.${index}.colorInfo`)}
                    />
                </div>
            </div>

            {/* 이미지 업로드 영역 */}
            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 mb-2 block">상품 이미지 (최소 1개)</label>
                <div className="flex flex-wrap gap-2">
                    {imageFields.map((field, imgIndex) => (
                        <ImageUploader
                            key={field.id}
                            value={field.url}
                            onChange={(url) => updateImage(imgIndex, { url })}
                            onRemove={() => removeImage(imgIndex)}
                        />
                    ))}
                    <ImageUploader onChange={(url) => appendImage({ url })} />
                </div>
            </div>

            {/* 사이즈 재고 관리 영역 */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-500 block">사이즈 및 재고</label>
                    <button
                        type="button"
                        onClick={() => appendSize({ size: "", stock: 0 })}
                        className="text-xs font-bold underline hover:text-black"
                    >
                        + 사이즈 행 추가
                    </button>
                </div>

                <div className="space-y-2">
                    {sizeFields.map((field, sizeIndex) => (
                        <div key={field.id} className="flex gap-2 items-start">
                            <div className="w-1/3">
                                <Input
                                    placeholder="사이즈 (예: 240)"
                                    registration={register(`colors.${index}.sizes.${sizeIndex}.size`, { required: true })}
                                    className="p-3 h-10 text-sm" // Input 높이 조절
                                />
                            </div>
                            <div className="w-1/3">
                                <Input
                                    type="number"
                                    placeholder="재고"
                                    registration={register(`colors.${index}.sizes.${sizeIndex}.stock`, { required: true, valueAsNumber: true })}
                                    className="p-3 h-10 text-sm"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeSize(sizeIndex)}
                                className="text-red-500 text-xl px-2 h-10 flex items-center"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    {sizeFields.length === 0 && <p className="text-sm text-gray-400">등록된 사이즈가 없습니다.</p>}
                </div>
            </div>
        </div>
    );
};

export default ColorFormItem;