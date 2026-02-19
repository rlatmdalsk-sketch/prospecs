import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import useCartStore from "../../store/useCartStore.ts";
import useOrderStore from "../../store/useOrderStore.ts";
import useAuthStore from "../../store/useAuthStore.ts";

const CartPage = () => {
    const navigate = useNavigate();
    const { items, loading, fetchCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
    const { setOrderItems } = useOrderStore();
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        fetchCart().then(() => {});
    }, [fetchCart]);

    if (loading && items.length === 0) return <div className="py-20 text-center">Loading...</div>;

    if (items.length === 0) {
        return (
            <div className="max-w-4xl min-h-[80dvh] mx-auto py-20 px-4 flex flex-col justify-center items-center border-gray-100 mt-10">
                <p className="text-xl text-gray-500 mb-6">장바구니에 담긴 상품이 없습니다.</p>
                <Link
                    to="/"
                    className="inline-block px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition">
                    쇼핑 계속하기
                </Link>
            </div>
        );
    }

    const shippingCost = getTotalPrice() >= 50000 ? 0 : 3000;
    const totalAmount = getTotalPrice() + shippingCost;

    const handleOrder = () => {
        // 1. 로그인 체크 (혹시 모르니 안전장치)
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/auth/login");
            return;
        }

        // 2. 장바구니 비었는지 확인
        if (items.length === 0) {
            alert("주문할 상품이 없습니다.");
            return;
        }

        // 3. 주문 페이지로 이동
        // state를 넘기지 않으면 OrderPage는 자동으로 useCartStore를 바라봅니다.
        setOrderItems(items);
        navigate("/order");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            <h1 className="text-2xl font-bold mb-8 text-center md:text-left">SHOPPING CART</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* 왼쪽: 상품 리스트 */}
                <div className="flex-1">
                    {/* 헤더 (PC 전용) */}
                    <div className="hidden md:flex border-b border-black pb-3 text-sm font-bold text-center">
                        <div className="w-full text-left pl-2">상품정보</div>
                        <div className="w-24">수량</div>
                        <div className="w-32">가격</div>
                        <div className="w-12"></div>
                    </div>

                    {/* 아이템 반복 */}
                    <div className="divide-y divide-gray-200 border-b border-gray-200">
                        {items.map(item => {
                            const product = item.productSize.productColor.product;
                            const color = item.productSize.productColor;
                            const image = color.images[0]?.url;

                            return (
                                <div
                                    key={item.id}
                                    className="py-6 flex flex-col md:flex-row items-center gap-4 md:gap-0">
                                    {/* 상품 정보 */}
                                    <div className="w-full flex gap-4 text-left">
                                        <div className="w-24 h-28 bg-gray-100">
                                            {image && (
                                                <img
                                                    src={image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center gap-1">
                                            <p className="font-bold text-gray-900">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {color.colorName} / {item.productSize.size}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 모바일 레이아웃 대응 */}
                                    <div className="w-full md:w-auto flex justify-between items-center md:contents">
                                        {/* 수량 조절 */}
                                        <div className="w-24 flex items-center border border-gray-300 h-9">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50">
                                                <FiMinus size={12} />
                                            </button>
                                            <span className="flex-1 text-center text-sm font-bold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50">
                                                <FiPlus size={12} />
                                            </button>
                                        </div>

                                        {/* 가격 */}
                                        <div className="w-32 text-right md:text-center font-bold">
                                            {(product.price * item.quantity).toLocaleString()}원
                                        </div>

                                        {/* 삭제 버튼 */}
                                        <div className="w-12 text-right">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-black p-2">
                                                <FiX size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 오른쪽: 결제 요약 (Sticky) */}
                <div className="w-full lg:w-90 h-fit sticky top-24">
                    <div className="bg-gray-50 p-6">
                        <h3 className="font-bold text-lg mb-4 border-b border-black pb-2">
                            ORDER SUMMARY
                        </h3>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">총 상품금액</span>
                                <span className="font-bold">
                                    {getTotalPrice().toLocaleString()}원
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">배송비 (5만원 이상 무료)</span>
                                <span className="font-bold">
                                    {shippingCost === 0
                                        ? "무료"
                                        : `${shippingCost.toLocaleString()}원`}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-gray-300 pt-4 mb-6">
                            <span className="font-bold text-gray-900">결제 예정 금액</span>
                            <span className="text-2xl font-extrabold text-orange-600">
                                {totalAmount.toLocaleString()}원
                            </span>
                        </div>

                        <button
                            className="w-full py-4 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-colors"
                            onClick={handleOrder}>
                            주문하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
