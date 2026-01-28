import { useNavigate, useSearchParams } from "react-router";
import useCartStore from "../../stores/useCartStore.ts";
import useOrderStore from "../../stores/useOrderStore.ts";
import { useEffect, useState } from "react";
import type { Order } from "../../types/order.ts";
import { twMerge } from "tailwind-merge";
import { confirmOrder } from "../../api/order.api.ts";
import Button from "../../components/common/Button.tsx";
import { AxiosError } from "axios";

function OrderSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearOrder } = useOrderStore();
    const { fetchCart } = useCartStore();

    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<Order | null>(null);

    useEffect(() => {
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = Number(searchParams.get("amount"));

        if (!paymentKey || !orderId || !amount) {
            navigate("/order/fail?message=잘못된 접근 입니다.");
            return;
        }

        const processPayment = async () => {
            try {
                const result = await confirmOrder({
                    paymentKey,
                    orderId,
                    amount
                });
                setOrderData(result);
                clearOrder();
                await fetchCart();
                setIsLoading(false);
            } catch (e) {
                console.log("결제 검증 실패", e);
                let message = "알 수 없는 오류가 발생했습니다.";
                if (e instanceof AxiosError ) message = e.response?.data.message;


                navigate(`/order/fail?message=${encodeURIComponent(message)}`);
            } finally {
                setIsLoading(false);
            }
        };
        processPayment().then(() => {});
        }, []);

    if (isLoading) {
        return (
            <div className={twMerge("h-[80dvh]", "flex", "flex-col", "items-center", "justify-center")}>
                <p className={twMerge("text-xl", "font-medium")}>
                    결제 승인 처리 중입니다
                </p>
                <p className={twMerge("text-gray-500", "mt-3")}>잠시만 기다려주세요</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="mb-8 flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">주문이 완료되었습니다!</h1>
            <p className="text-gray-600 mb-10">
                주문하신 상품의 결제가 성공적으로 완료되었습니다.
                <br />
                주문 상세 내역은 마이페이지에서 확인하실 수 있습니다.
            </p>

            {/* 주문 요약 정보 박스 */}
            {orderData && (
                <div className="bg-gray-50 p-6 rounded-lg text-left mb-10 border border-gray-100">
                    <h3 className="font-bold border-b border-gray-200 pb-3 mb-4">주문 정보</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">주문 번호</span>
                            <span className="font-medium">{orderData.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">받는 분</span>
                            <span className="font-medium">{orderData.recipientName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">결제 금액</span>
                            <span className="font-bold text-orange-600">
                                {orderData.totalAmount?.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/")}>
                    쇼핑 계속하기
                </Button>
                <Button
                    onClick={() => navigate("/mypage/orders")} // 마이페이지 주문내역으로 이동
                >
                    주문 상세보기
                </Button>
            </div>
        </div>
    );
}

export default OrderSuccessPage;