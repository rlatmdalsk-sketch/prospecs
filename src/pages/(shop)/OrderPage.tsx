import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";

import { createOrder } from "../../api/order.api";
import useModalStore from "../../store/useModalStore";
import useAuthStore from "../../store/useAuthStore";
import useOrderStore from "../../store/useOrderStore";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import type { CreateOrderRequest } from "../../types/order";
import Select from "../../components/common/Select.tsx";

interface OrderFormData {
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address1: string;
    address2: string;
    deliveryRequestType: string;
    deliveryRequestDirect: string;
}

const OrderPage = () => {
    const navigate = useNavigate();

    // Store
    const { orderItems, getTotalPrice } = useOrderStore();
    const { openModal } = useModalStore();
    const { user } = useAuthStore();

    // 가격 계산
    const productsPrice = getTotalPrice();
    const shippingCost = productsPrice >= 50000 ? 0 : 3000;
    const finalAmount = productsPrice + shippingCost;

    // React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<OrderFormData>({
        mode: "onChange",
        defaultValues: {
            recipientName: "",
            recipientPhone: "",
            zipCode: "",
            address1: "",
            address2: "",
            deliveryRequestType: "",
            deliveryRequestDirect: "",
        },
    });

    const deliveryRequestType = watch("deliveryRequestType");

    // 초기값 설정
    useEffect(() => {
        if (user) {
            reset({
                recipientName: user.name,
                recipientPhone: user.phone,
                zipCode: "",
                address1: "",
                address2: "",
            });
        }
    }, [user, reset]);

    // 주소 검색 핸들러
    const handleSearchAddress = () => {
        openModal("POSTCODE", {
            onComplete: (data: { zipCode: string; address1: string }) => {
                setValue("zipCode", data.zipCode, { shouldValidate: true });
                setValue("address1", data.address1, { shouldValidate: true });
                document.getElementById("address2")?.focus();
            },
        });
    };

    // [수정] 폼 제출 -> 백엔드 주문 생성 -> 결제 모달 오픈
    const onSubmit: SubmitHandler<OrderFormData> = async data => {
        const finalDeliveryRequest =
            data.deliveryRequestType === "DIRECT"
                ? data.deliveryRequestDirect
                : data.deliveryRequestType;

        try {
            // 1. 백엔드 주문 생성 (여기서 DB 재고 차감 및 PENDING 주문 생성)
            const orderInput: CreateOrderRequest = {
                items: orderItems.map(item => ({
                    productSizeId: item.productSize.id,
                    quantity: item.quantity,
                })),
                recipientName: data.recipientName,
                recipientPhone: data.recipientPhone,
                zipCode: data.zipCode,
                address1: data.address1,
                address2: data.address2,
                deliveryRequest: finalDeliveryRequest,
                paymentMethod: "TOSS_PAYMENTS",
            };

            const createdOrder = await createOrder(orderInput);

            // 2. 결제 모달 열기 (필요한 정보를 props로 전달)
            openModal("PAYMENT", {
                orderNumber: createdOrder.orderNumber, // UUID
                orderName:
                    orderItems.length > 1
                        ? `${orderItems[0].productSize.productColor.product.name} 외 ${orderItems.length - 1}건`
                        : orderItems[0].productSize.productColor.product.name,
                customerName: data.recipientName,
                customerEmail: user?.email || "",
                amount: finalAmount,
            });
        } catch (error) {
            console.error(error);
            alert("주문 생성 중 오류가 발생했습니다.");
        }
    };

    if (orderItems.length === 0) {
        return (
            <div className="py-40 text-center">
                <p className="mb-4 text-gray-500">주문할 상품 정보가 없습니다.</p>
                <Button onClick={() => navigate("/")}>홈으로 이동</Button>
            </div>
        );
    }

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
            <h1 className="text-2xl font-bold mb-8">ORDER / PAYMENT</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* --- 왼쪽: 입력 폼 --- */}
                <div className="flex-1 space-y-10">
                    <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        {/* 1. 배송지 정보 */}
                        <section>
                            <h2 className="text-lg font-bold border-b border-black pb-3 mb-5">
                                배송지 정보
                            </h2>
                            <div className="space-y-4">
                                {/* 이름 & 전화번호 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="받는 사람"
                                        registration={register("recipientName", {
                                            required: "이름은 필수입니다",
                                        })}
                                        error={errors.recipientName}
                                    />
                                    <Input
                                        label="휴대폰 번호"
                                        placeholder="010-0000-0000"
                                        registration={register("recipientPhone", {
                                            required: "전화번호는 필수입니다",
                                            pattern: {
                                                value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                                                message: "올바른 형식이 아닙니다",
                                            },
                                        })}
                                        error={errors.recipientPhone}
                                    />
                                </div>

                                {/* 주소 */}
                                <div>
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <Input
                                                label="주소"
                                                placeholder="우편번호"
                                                registration={register("zipCode", {
                                                    required: "주소를 검색해주세요",
                                                })}
                                                error={errors.zipCode}
                                                readOnly
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={handleSearchAddress}
                                            variant="primary"
                                            size="md"
                                            className="w-32 mb-[1px]">
                                            주소 검색
                                        </Button>
                                    </div>
                                    <div className="space-y-2 mt-2">
                                        <Input
                                            placeholder="기본 주소"
                                            registration={register("address1", { required: true })}
                                            readOnly
                                        />
                                        <Input
                                            id="address2"
                                            placeholder="상세 주소"
                                            registration={register("address2", {
                                                required: "상세 주소를 입력해주세요",
                                            })}
                                            error={errors.address2}
                                        />
                                    </div>
                                </div>

                                {/* 배송 메모 */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">
                                        배송 메모
                                    </label>
                                    <Select
                                        registration={register("deliveryRequestType")}
                                        options={[
                                            { label: "배송 시 요청사항을 선택해주세요", value: "" },
                                            {
                                                label: "부재 시 문 앞에 놔주세요",
                                                value: "부재 시 문 앞에 놔주세요",
                                            },
                                            {
                                                label: "경비실에 맡겨주세요",
                                                value: "경비실에 맡겨주세요",
                                            },
                                            { value: "DIRECT", label: "직접 입력" },
                                        ]}
                                    />
                                    {deliveryRequestType === "DIRECT" && (
                                        <div className="mt-2">
                                            <Input
                                                placeholder="직접 입력"
                                                registration={register("deliveryRequestDirect", {
                                                    required: "내용을 입력해주세요",
                                                })}
                                                error={errors.deliveryRequestDirect}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </form>

                    {/* 2. 주문 상품 확인 */}
                    <section>
                        <h2 className="text-lg font-bold border-b border-black pb-3 mb-5">
                            주문 상품
                        </h2>
                        <div className="space-y-4">
                            {orderItems.map(item => {
                                const product = item.productSize.productColor.product;
                                const size = item.productSize.size;
                                const image = item.productSize.productColor.images[0]?.url;

                                return (
                                    <div
                                        key={item.productSize.id}
                                        className="flex gap-4 border-b border-gray-100 pb-4">
                                        <div className="w-20 h-24 bg-gray-100 shrink-0">
                                            {image && (
                                                <img
                                                    src={image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">
                                                {product.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {item.productSize.productColor.colorName} / {size} /{" "}
                                                {item.quantity}개
                                            </p>
                                            <p className="font-medium text-sm mt-2">
                                                {(product.price * item.quantity).toLocaleString()}원
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* [삭제됨] 위젯 렌더링 영역이 PaymentModal로 이동함 */}
                </div>

                {/* --- 오른쪽: 결제 바 --- */}
                <div className="w-full lg:w-90 h-fit sticky top-24">
                    <div className="bg-gray-50 p-6 border border-gray-100">
                        <h3 className="font-bold text-lg mb-4 border-b border-black pb-2">
                            결제 금액
                        </h3>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">총 상품금액</span>
                                <span className="font-bold">
                                    {productsPrice.toLocaleString()}원
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">배송비</span>
                                <span className="font-bold">
                                    {shippingCost === 0
                                        ? "무료"
                                        : `+${shippingCost.toLocaleString()}원`}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-300 pt-4 mb-6">
                            <span className="font-bold text-gray-900">최종 결제 금액</span>
                            <span className="text-2xl font-extrabold text-orange-600">
                                {finalAmount.toLocaleString()}원
                            </span>
                        </div>

                        {/* 결제 버튼 클릭 -> onSubmit -> createOrder -> openModal('PAYMENT') */}
                        <Button type="submit" fullWidth size="lg" form="order-form">
                            결제하기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
