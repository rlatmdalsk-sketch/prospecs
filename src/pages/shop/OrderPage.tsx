import { useNavigate } from "react-router";
import useOrderStore from "../../stores/useOrderStore.ts";
import useAuthStore from "../../stores/useAuthStore.ts";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Button from "../../components/common/Button.tsx";
import Input from "../../components/common/input.tsx";
import Select from "../../components/common/select.tsx";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";

interface OrderFromData {
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address1: string;
    address2: string;
    deliveryRequestType: string;
    deliveryRequestDirect: string;
    gatePassword: string;
}

function OrderPage() {
    const navigate = useNavigate();
    const { orderItems, getTotalPrice } = useOrderStore();
    const { user } = useAuthStore();

    const productsPrice = getTotalPrice();
    const shippingCost = productsPrice >= 50000 ? 0 : 3000;
    const finalPrice = productsPrice + shippingCost;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<OrderFromData>();

    const deliveryRequestType = watch("deliveryRequestType");

    useEffect(() => {
        if (user) {
            reset({
                recipientName: user.name,
                recipientPhone: user.phone,
            });
        }
    }, [user, reset]);

    if (orderItems.length === 0) {
        return (
            <div className={twMerge("py-40", "text-center")}>
                <p className={twMerge("mb-4", "text-gray-500")}>주문할 상품 정보가 없습니다.</p>
                <Button onClick={() => navigate("/")}>홈으로 이동</Button>
            </div>
        );
    }

    return (
        <div className={twMerge("max-w-7xl", "mx-auto", "px-8", "py-40")}>
            <h1 className={twMerge("text-2xl", "font-bold", "mb-8")}>ORDER / PAYMENT</h1>
            <div className={twMerge("flex", "gap-10")}>
                <div className={twMerge("flex-1", "space-y-10")}>
                    <form id="order-form" className={twMerge("space-y-10")}>
                        <h2 className={twMerge("pb-3", "mb-5", "text-lg", "font-bold", "border-b", "border-black")}>
                            배송지 정보
                        </h2>

                        <div className={twMerge("space-y-4")}>
                            {/* 이름, 연락처 */}
                            <div className={twMerge("flex", "gap-4")}>
                                <div className="flex-1">
                                    <Input
                                        label={"받는 사람"}
                                        fullWidth
                                        registration={register("recipientName", { required: "이름은 필수입니다." })}
                                        error={errors.recipientName}
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label={"휴대폰 번호"}
                                        placeholder={"010-0000-0000"}
                                        fullWidth
                                        registration={register("recipientPhone", {
                                            required: "전화번호는 필수입니다.",
                                            pattern: {
                                                value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                                                message: "올바른 형식이 아닙니다",
                                            },
                                        })}
                                        error={errors.recipientPhone}
                                    />
                                </div>
                            </div>

                            {/* 주소 섹션 */}
                            <div className={twMerge("space-y-2")}>
                                <div className={twMerge("flex", "gap-2", "items-end")}>
                                    <div className="flex-1">
                                        <Input
                                            label={"주소"}
                                            placeholder={"우편번호"}
                                            registration={register("zipCode", { required: "주소를 입력해주세요" })}
                                            error={errors.zipCode}
                                            readOnly
                                        />
                                    </div>
                                    <Button type="button" variant="primary" className="mb-[2px]">
                                        주소 검색
                                    </Button>
                                </div>
                                <Input
                                    placeholder={"기본 주소"}
                                    fullWidth
                                    registration={register("address1", { required: true })}
                                    readOnly
                                />
                                <Input
                                    placeholder={"상세 주소"}
                                    fullWidth
                                    registration={register("address2")}
                                />
                            </div>

                            {/* 배송 메모 */}
                            <div className={twMerge("space-y-2")}>
                                <label className={twMerge("block", "text-xs", "font-bold", "text-gray-500")}>배송메모</label>
                                <Select
                                    registration={register("deliveryRequestType")}
                                    options={[
                                        { label: "배송시 요청사항을 선택해주세요", value: "" },
                                        { label: "부재시 문 앞에 놔주세요", value: "부재시 문 앞에 놔주세요" },
                                        { label: "부재시 경비실에 맡겨주세요", value: "부재시 경비실에 맡겨주세요" },
                                        { label: "직접 입력", value: "DIRECT" },
                                    ]}
                                />
                                {deliveryRequestType === "DIRECT" && (
                                    <div className="mt-2">
                                        <Input
                                            placeholder={"메모를 직접 입력해주세요"}
                                            registration={register("deliveryRequestDirect", {
                                                required: "내용을 입력해주세요."
                                            })}
                                        />
                                    </div>
                                )}
                            </div>
                            <Input
                                label={"공동현관 비밀번호"}
                                registration={register("gatePassword")}
                            />
                        </div>
                    </form><section>
                    <h2 className={twMerge("text-lg", "font-bold", "border-b", "border-black", "pb-3", "mb-5")}>
                        주문상품
                    </h2>
                    <div className="divide-y divide-gray-200">
                        {orderItems.map((item) => {
                            // 오타 수정: prodcut -> product
                            const product = item.productSize.productColor.product;
                            const color = item.productSize.productColor;
                            const image = color.images[0]?.url;

                            return (
                                <div key={item.id} className="flex items-center gap-4 py-6">
                                    {/* 상품 이미지 */}
                                    <div className="w-24 h-28 bg-gray-100 flex-shrink-0 overflow-hidden">
                                        {image && (
                                            <img
                                                src={image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    {/* 상품 정보 */}
                                    <div className="flex-1 flex flex-col justify-center">
                                        <p className="font-bold text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {color.colorName} / {item.productSize.size} / {item.quantity}개
                                        </p>
                                    </div>

                                    {/* 가격 */}
                                    <div className="w-32 text-right">
                                        <p className="font-bold">
                                            {(product.price * item.quantity).toLocaleString()}원
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
                </div>
                {/* 우측 결제 요약 영역 (미구현) */}
                <div className="w-80"></div>
            </div>
        </div>
    );
}

export default OrderPage;