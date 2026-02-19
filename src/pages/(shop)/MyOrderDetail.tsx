import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { cancelOrder, getOrderDetail } from "../../api/order.api";
import type { Order } from "../../types/order";
import OrderStatusBadge from "../../components/order/OrderStatusBadge";
import Button from "../../components/common/Button";
import useModalStore from "../../store/useModalStore.tsx"; // 기존에 만드신 버튼 컴포넌트 활용

const MyOrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { openModal } = useModalStore(); // 스토어 훅 사용

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    // 데이터 불러오기
    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                const data = await getOrderDetail(Number(id));
                setOrder(data);
            } catch (error) {
                console.error("주문 상세 로드 실패", error);
                alert("주문 정보를 불러올 수 없습니다.");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail().then(() => {});
    }, [id, navigate]);

    // 주문 취소 핸들러
    const handleCancelOrder = async () => {
        if (!order) return;

        if (order.status !== "PENDING" && order.status !== "PAID") {
            alert("이미 배송이 시작되어 취소할 수 없습니다.");
            return;
        }

        const reason = window.prompt("취소 사유를 입력해주세요. (예: 단순 변심)");
        if (reason === null) return; // 취소 버튼 누름
        if (!reason.trim()) {
            alert("취소 사유를 입력해야 합니다.");
            return;
        }

        // 3. API 호출
        if (window.confirm("정말 주문을 취소하시겠습니까?\n(결제된 금액은 환불됩니다.)")) {
            try {
                await cancelOrder(order.id, reason);
                alert("주문이 취소되었습니다.");
                // 데이터 새로고침
                const updatedData = await getOrderDetail(order.id);
                setOrder(updatedData);
            } catch (error) {
                console.error(error);
                alert("주문 취소에 실패했습니다. 고객센터로 문의해주세요.");
            }
        }
    };

    if (loading) return <div className="py-20 text-center">Loading...</div>;
    if (!order) return null;

    const orderDate = new Date(order.createdAt).toLocaleString("ko-KR");

    const isCancelable = order.status === "PENDING" || order.status === "PAID";

    return (
        <div className="w-full mx-auto px-4 text-gray-900">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-900">
                <h1 className="text-2xl font-bold">주문 상세 내역</h1>
                <button
                    onClick={() => navigate("/my/orders")}
                    className="text-sm underline hover:text-gray-600">
                    목록으로 돌아가기
                </button>
            </div>

            {/* 1. 주문 기본 정보 */}
            <section className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-6 rounded-sm border border-gray-200 gap-4">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">
                            주문번호 {order.orderNumber}
                        </div>
                        <div className="text-lg font-bold">{orderDate}</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <OrderStatusBadge status={order.status} className="text-sm px-3 py-1" />
                        {isCancelable && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelOrder}
                                className="bg-white border-gray-300 text-gray-600 hover:bg-gray-100">
                                주문취소
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-lg font-bold mb-4 border-l-4 border-black pl-3">
                    주문 상품 정보
                </h2>
                <div className="border-t border-gray-900">
                    {order.items.map(item => {
                        const productInfo = item.productSize.productColor.product;
                        const colorName = item.productSize.productColor.colorName;
                        const size = item.productSize.size;
                        const images = item.productSize.productColor.images;
                        const thumbUrl = images && images.length > 0 ? images[0].url : "";

                        return (
                            <div key={item.id} className="flex gap-4 py-5 border-b border-gray-200">
                                <div className="w-24 h-28 bg-gray-100 flex-shrink-0">
                                    {thumbUrl && (
                                        <img
                                            src={thumbUrl}
                                            alt="product"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="text-sm text-gray-500 mb-1">
                                        {productInfo.price.toLocaleString()}원
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 mb-1">
                                        {productInfo.name}
                                    </h3>
                                    <div className="text-sm text-gray-600">
                                        옵션: {colorName} / {size} | 수량: {item.quantity}개
                                    </div>
                                    <div className="mt-2 font-bold text-gray-900">
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </div>
                                </div>
                                {order.status === "DELIVERED" && (
                                    <div className="flex items-center">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => {
                                                return openModal("REVIEW_FORM", {
                                                    productId:
                                                        item.productSize.productColor.product.id, // ID 필수
                                                    productName:
                                                        item.productSize.productColor.product.name, // UI 표시용
                                                    productImage:
                                                        item.productSize.productColor.images?.[0]
                                                            ?.url, // UI 표시용
                                                    onSuccess: () => {
                                                        navigate("/my/reviews");
                                                    },
                                                });
                                            }}>
                                            리뷰작성
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-lg font-bold mb-4 border-l-4 border-black pl-3">
                        배송지 정보
                    </h2>
                    <div className="border-t border-gray-900 pt-4 text-sm space-y-3">
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-700 flex-shrink-0">
                                받는사람
                            </span>
                            <span className="text-gray-900">{order.recipientName}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-700 flex-shrink-0">
                                연락처
                            </span>
                            <span className="text-gray-900">{order.recipientPhone || "-"}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-700 flex-shrink-0">주소</span>
                            <div className="text-gray-900">
                                <div>({order.zipCode})</div>
                                <div>
                                    {order.address1} {order.address2}
                                </div>
                            </div>
                        </div>
                        {/* 운송장 정보 (배송중/완료일 때만 표시) */}
                        {(order.status === "SHIPPED" || order.status === "DELIVERED") && (
                            <div className="flex mt-4 pt-4 border-t border-gray-100">
                                <span className="w-24 font-bold text-blue-600 flex-shrink-0">
                                    운송장번호
                                </span>
                                <span className="text-gray-900 font-medium">
                                    CJ대한통운 1234-5678-9012
                                </span>
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold mb-4 border-l-4 border-black pl-3">
                        결제 정보
                    </h2>
                    <div className="border-t border-gray-900 pt-4 text-sm space-y-3">
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-700">결제수단</span>
                            <span className="text-gray-900">
                                {order.payment?.method || "무통장입금"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-700">상품금액</span>
                            <span className="text-gray-900">
                                {order.totalAmount.toLocaleString()}원
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-700">배송비</span>
                            <span className="text-gray-900">0원 (무료배송)</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-3 mt-1">
                            <span className="font-bold text-lg text-gray-900">총 결제금액</span>
                            <span className="font-extrabold text-xl text-orange-600">
                                {order.totalAmount.toLocaleString()}원
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyOrderDetail;
