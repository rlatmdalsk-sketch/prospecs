import { useNavigate } from "react-router";
import useCartStore from "../../stores/useCartStore.ts";
import useAuthStore from "../../stores/useAuthStore.ts";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import useOrderStore from "../../stores/useOrderStore.ts";

function CartPage() {
    const navigate = useNavigate();
    const { items, loading, fetchCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
    const { setOrderItems } = useOrderStore();
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        fetchCart().then(() => {});
    }, []);

    if (loading && items.length === 0)
        return <div className={twMerge(["py-40", "text-center"])}>Loading...</div>;

    if (items.length === 0) {
        return (
            <div className={twMerge(["py-40", "text-center"])}>
                장바구니에 담긴 상품이 없습니다.
            </div>
        );
    }

    // 금액 계산
    const shippingCost = getTotalPrice() >= 50000 ? 0 : 3000;
    const totalPrice = getTotalPrice() + shippingCost;

    const handleOrder = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.")
            navigate("/login");
            return;
        }

        if (items.length === 0) {
            alert("주문할 상품이 없습니다.");
            return;
        }

        setOrderItems(items);
        navigate("/order");
    }

    return (
        <div className={twMerge(["max-w-7xl", "mx-auto", "px-4", "py-40"])}>
            <h1 className={twMerge(["text-2xl", "font-bold", "mb-8"])}>SHOPPING CART</h1>

            <div className={twMerge(["flex", "gap-10"])}>
                {/* 왼쪽 상품 목록 */}
                <div className={twMerge(["flex-1"])}>
                    <div
                        className={twMerge(
                            ["flex", "pb-3", "text-sm", "font-bold", "text-center"],
                            ["border-b", "border-black"],
                        )}>
                        <div className={twMerge(["w-full", "text-left", "pl-2"])}>상품정보</div>
                        <div className={twMerge("w-24")}>수량</div>
                        <div className={twMerge("w-32")}>가격</div>
                        <div className={twMerge("w-12")}></div>
                    </div>

                    {items.map(item => {
                        const product = item.productSize.productColor.product;
                        const color = item.productSize.productColor;
                        const image = color.images[0]?.url;

                        return (
                            <div
                                key={item.id}
                                className={twMerge(
                                    ["flex", "items-center", "py-6"],
                                    ["border-b", "border-gray-200"],
                                )}>
                                <div className={twMerge(["w-full", "flex", "gap-4"])}>
                                    <div className={twMerge(["w-24", "h-28", "bg-gray-100"])}>
                                        {image && (
                                            <img
                                                src={image}
                                                alt={product.name}
                                                className={twMerge([
                                                    "w-full",
                                                    "h-full",
                                                    "object-cover",
                                                ])}
                                            />
                                        )}
                                    </div>
                                    <div
                                        className={twMerge([
                                            "flex",
                                            "flex-col",
                                            "justify-center",
                                            "gap-1",
                                        ])}>
                                        <p className={twMerge(["font-bold", "text-gray-900"])}>
                                            {product.name}
                                        </p>
                                        <p className={twMerge(["text-sm", "text-gray-500"])}>
                                            {color.colorName} / {item.productSize.size}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={twMerge([
                                        "w-auto",
                                        "flex",
                                        "justify-between",
                                        "items-center",
                                    ])}>
                                    <div
                                        className={twMerge(
                                            ["w-24", "h-9", "flex", "items-center"],
                                            ["border", "border-gray-300"],
                                        )}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className={twMerge(
                                                ["w-8", "h-full"],
                                                ["flex", "justify-center", "items-center"],
                                                ["hover:bg-gray-50"],
                                            )}>
                                            <FiMinus size={12} />
                                        </button>
                                        <span
                                            className={twMerge([
                                                "flex-1",
                                                "text-center",
                                                "text-sm",
                                                "font-bold",
                                            ])}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className={twMerge(
                                                ["w-8", "h-full"],
                                                ["flex", "justify-center", "items-center"],
                                                ["hover:bg-gray-50"],
                                            )}>
                                            <FiPlus size={12} />
                                        </button>
                                    </div>
                                    <div className={twMerge(["w-32", "text-center", "font-bold"])}>
                                        {(product.price * item.quantity).toLocaleString()}원
                                    </div>
                                    <div className={twMerge(["w-12", "text-right"])}>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className={twMerge(["text-gray-400", "p-2"])}>
                                            <FiX size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
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
                                {totalPrice.toLocaleString()}원
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
}

export default CartPage;
