import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { confirmOrder } from "../../api/order.api";
import useOrderStore from "../../store/useOrderStore";
import useCartStore from "../../store/useCartStore"; // 장바구니 갱신용
import Button from "../../components/common/Button";
import { AxiosError } from "axios";

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearOrder } = useOrderStore(); // 주문 스토어 비우기
    const { fetchCart } = useCartStore(); // 장바구니 갱신 (주문된거 사라졌는지 확인용)

    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<any>(null); // 성공한 주문 정보

    useEffect(() => {
        // 1. URL 쿼리 파라미터 파싱
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = Number(searchParams.get("amount"));

        // 파라미터가 없으면 실패 페이지나 홈으로 보냄
        if (!paymentKey || !orderId || !amount) {
            navigate("/order/fail?message=잘못된 접근입니다.");
            return;
        }

        // 2. 백엔드 승인 요청 함수
        const processPayment = async () => {
            try {
                const result = await confirmOrder({
                    paymentKey,
                    orderId,
                    amount,
                });

                // 3. 성공 처리
                setOrderData(result);

                // 스토어 정리
                clearOrder(); // 임시 주문 목록 비우기
                fetchCart().then(() => {}); // 장바구니 최신화 (구매한건 삭제되었으므로)
            } catch (error) {
                console.error(error);
                let message: string;
                if (error instanceof AxiosError) {
                    message = error.response?.data?.message || "결제 승인에 실패했습니다.";
                } else {
                    message = "알 수 없는 오류가 발생했습니다.";
                }
                navigate(`/order/fail?message=${encodeURIComponent(message)}`);
            } finally {
                setIsLoading(false);
            }
        };

        processPayment().then(() => {});
    }, [searchParams, navigate, clearOrder, fetchCart]);

    // 로딩 중 화면
    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4"></div>
                <p className="text-xl font-medium">결제 승인 처리 중입니다...</p>
                <p className="text-gray-500 mt-2">잠시만 기다려주세요.</p>
            </div>
        );
    }

    // 완료 화면
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
};

export default OrderSuccessPage;
