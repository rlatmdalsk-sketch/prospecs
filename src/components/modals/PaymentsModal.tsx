import useModalStore from "../../stores/useModalStore.ts";
import useAuthStore from "../../stores/useAuthStore.ts";
import Modal from "../common/modal.tsx";
import { twMerge } from "tailwind-merge";
import Button from "../common/Button.tsx";
import { loadPaymentWidget, type PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { useEffect, useRef, useState } from "react";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "C8a0a_aACl_RNwefxYWiK";


function PaymentModal() {
    const { isOpen, closeModal, modalProps } = useModalStore();
    const { user } = useAuthStore();

    const paymentWidgetRef= useRef<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null);

    const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

    useEffect(() => {
         if (!isOpen || !user) return;

         const fetchPaymentWidget = async () => {
             try {
                 const widget = await loadPaymentWidget(clientKey, customerKey);
                 paymentWidgetRef.current = widget;

                 const methodsWidget = widget.renderPaymentMethods(
                     "#payment-widget",
                     { value: amount},
                     { variantKey: "DEFAULT"},
                 );
                 paymentMethodsWidgetRef.current = methodsWidget;

                 widget.renderAgreement("#agreement",{variantKey: "AGREEMENT"});
                 /* 토스 페이먼츠 모듈 코드 끝 */
                 setIsWidgetLoaded(true);
             } catch (e) {
                 console.log("결제 위젯 로드 실패",e)
             }
         }

         fetchPaymentWidget().then(() => {})
    }, []);

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
            })
        } catch (e) {
            console.log("결제 창 접근 실패", e)
        }
    }

    const { orderNumber, orderName, customerName, customerEmail, amount } = modalProps;
    return <Modal isOpen={isOpen} onClose={closeModal} title={"결제하기"} width={"max-w-xl"}>
        <div className={twMerge("flex","flex-col","gap-4")}>
            {/*결제 위젯*/}
            <div id={"payment-widget"} className={"w-full"} />
            <div id={"agreement"} className={twMerge("w-full")} />


            {/*결제 버튼*/}
            <div className={twMerge("mt-4","px-4","pb-4")}>
                <Button fullWidth={true} size={"lg"}
                    onClick={handlePaymentRequest}
                        disabled={!isWidgetLoaded}
                >
                        {amount?.toLocaleString()}원

                </Button>
            </div>
        </div>
    </Modal>;
}

export default PaymentModal;