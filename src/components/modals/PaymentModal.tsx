import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, type PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import useModalStore from "../../store/useModalStore";
import useAuthStore from "../../store/useAuthStore";
import Modal from "../common/Modal";
import Button from "../common/Button";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const PaymentModal = () => {
    const { isOpen, closeModal, modalProps } = useModalStore();
    const { user } = useAuthStore();

    // OrderPage에서 넘겨받은 데이터
    const { orderNumber, orderName, customerName, customerEmail, amount } = modalProps;

    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<ReturnType<
        PaymentWidgetInstance["renderPaymentMethods"]
    > | null>(null);

    const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

    // 1. 위젯 로드 (모달이 열릴 때)
    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchPaymentWidget = async () => {
            try {
                const widget = await loadPaymentWidget(clientKey, "BOMpP8vjCXY1MFu3lA1LI");
                paymentWidgetRef.current = widget;

                const methodsWidget = widget.renderPaymentMethods(
                    "#payment-widget",
                    { value: amount },
                    { variantKey: "DEFAULT" },
                );
                paymentMethodsWidgetRef.current = methodsWidget;

                widget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });
                setIsWidgetLoaded(true);
            } catch (error) {
                console.error("결제 위젯 로드 실패", error);
            }
        };

        fetchPaymentWidget();
    }, [isOpen, user, amount]);

    // 2. 금액 업데이트 (혹시 모달 열린 상태에서 금액이 바뀔 일은 드물지만 안전장치)
    useEffect(() => {
        const widget = paymentMethodsWidgetRef.current;
        if (widget) widget.updateAmount(amount);
    }, [amount]);

    // 3. 결제 요청 핸들러 (최종 결제 버튼)
    const handlePaymentRequest = async () => {
        const widget = paymentWidgetRef.current;
        if (!widget) return;

        try {
            await widget.requestPayment({
                orderId: orderNumber,
                orderName: orderName,
                customerName: customerName,
                customerEmail: customerEmail,
                successUrl: `${window.location.origin}/order/success`,
                failUrl: `${window.location.origin}/order/fail`,
            });
        } catch (error) {
            console.error(error);
            // 결제창 닫기 등 에러 처리
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title="결제하기"
            width="max-w-xl" // 위젯이 넓으므로 약간 넓게
        >
            <div className="flex flex-col gap-4">
                {/* 결제 위젯 영역 */}
                <div id="payment-widget" className="w-full" />
                <div id="agreement" className="w-full" />

                {/* 최종 결제 버튼 */}
                <div className="mt-4 px-4 pb-4">
                    <Button
                        fullWidth
                        size="lg"
                        onClick={handlePaymentRequest}
                        disabled={!isWidgetLoaded} // 위젯 로드 전엔 비활성화
                    >
                        {amount?.toLocaleString()}원 결제하기
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PaymentModal;
