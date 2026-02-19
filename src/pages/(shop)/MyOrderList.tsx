import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getOrders } from "../../api/order.api";
import type { Order } from "../../types/order";
import OrderStatusBadge from "../../components/order/OrderStatusBadge.tsx";

const MyOrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                console.error("주문 목록 로드 실패", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders().then(() => {});
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500">주문 내역을 불러오는 중...</div>;
    }

    return (
        <div className="w-full mx-auto px-4">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">주문 내역</h1>

            {orders.length === 0 ? (
                <div className="py-20 text-center border-t border-b border-gray-200">
                    <p className="text-gray-500 mb-4">주문한 내역이 없습니다.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-black underline hover:text-gray-600 font-medium">
                        쇼핑하러 가기
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} navigate={navigate} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrderList;

// ------------------------------------------------------------------
// Sub Components
// ------------------------------------------------------------------

interface OrderCardProps {
    order: Order;
    navigate: ReturnType<typeof useNavigate>;
}

const OrderCard = ({ order, navigate }: OrderCardProps) => {
    // 날짜 포맷팅 (YYYY.MM.DD)
    const orderDate = new Date(order.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return (
        <div className="border border-gray-200 rounded-sm overflow-hidden bg-white">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                    <span className="font-bold text-lg text-gray-900">{orderDate}</span>
                    <span className="text-xs text-gray-400">({order.orderNumber})</span>
                </div>
                <button
                    onClick={() => navigate(`/my/orders/${order.id}`)} // 상세 페이지로 이동
                    className="text-sm text-gray-600 hover:text-black hover:underline">
                    주문상세 {">"}
                </button>
            </div>

            <div className="divide-y divide-gray-100">
                {order.items.map(item => {
                    const productInfo = item.productSize.productColor.product;
                    const colorName = item.productSize.productColor.colorName;
                    const size = item.productSize.size;
                    const images = item.productSize.productColor.images;
                    const thumbUrl = images && images.length > 0 ? images[0].url : "";

                    return (
                        <div key={item.id} className="p-5 flex gap-4">
                            {/* 썸네일 */}
                            <div className="w-20 h-24 bg-gray-100 shrink-0">
                                {thumbUrl ? (
                                    <img
                                        src={thumbUrl}
                                        alt={productInfo.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                        No Img
                                    </div>
                                )}
                            </div>

                            {/* 상품 정보 */}
                            <div className="flex-1 flex flex-col justify-center">
                                {/* 상태 뱃지 (아이템별 상태가 아니라 주문 전체 상태 사용) */}
                                <div className="mb-1">
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                                    {productInfo.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    [옵션] {colorName} / {size}
                                </p>
                                <div className="mt-2 text-sm">
                                    <span className="font-bold">
                                        {item.price.toLocaleString()}원
                                    </span>
                                    <span className="mx-1 text-gray-300">|</span>
                                    <span>{item.quantity}개</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 총 결제 금액 */}
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end items-center gap-2">
                <span className="text-sm text-gray-600">총 결제금액</span>
                <span className="text-lg font-bold text-orange-600">
                    {order.totalAmount.toLocaleString()}원
                </span>
            </div>
        </div>
    );
};