import type { OrderStatus } from "../../types/order.ts";

const OrderStatusBadge = ({ status, className }: { status: OrderStatus; className?: string }) => {
    let label: string;
    let colorClass: string;

    switch (status) {
        case "PENDING":
            label = "입금대기";
            colorClass = "text-gray-500 bg-gray-100";
            break;
        case "PAID":
            label = "결제완료";
            colorClass = "text-blue-600 bg-blue-50";
            break;
        case "SHIPPED":
            label = "배송중";
            colorClass = "text-purple-600 bg-purple-50";
            break;
        case "DELIVERED":
            label = "배송완료";
            colorClass = "text-green-600 bg-green-50";
            break;
        case "CANCELED":
            label = "취소완료";
            colorClass = "text-gray-400 bg-gray-100 line-through";
            break;
        case "RETURN_REQUESTED":
            label = "반품요청";
            colorClass = "text-orange-600 bg-orange-50";
            break;
        case "RETURN_COMPLETED":
            label = "반품완료";
            colorClass = "text-red-600 bg-red-50";
            break;
        default:
            label = status;
            colorClass = "text-gray-600 bg-gray-100";
    }

    return (
        <span className={`px-2 py-0.5 text-xs font-bold rounded-sm ${colorClass} ${className}`}>{label}</span>
    );
};

export default OrderStatusBadge;
