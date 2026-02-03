import { create } from "zustand";

export type ModalType = "POSTCODE" | "PAYMENT" | "REVIEW_FORM" | null;

interface ModalState {
    isOpen: boolean;
    modalType: ModalType;
    modalProps: any;

    // 내가 모달을 열 때 어떠한 형태의 모달을 열 것인지를 type으로서 받고
    // 그 모달에서 필요한 기능들을 props로 받아줄건데 어떠한 내용일지는 알 수 없기 때문에 any 타입을 지정함
    openModal: (type: ModalType, props?: any) => void;
    closeModal: () => void;
}

const useModalStore = create<ModalState>(set => ({
    modalType: null,
    isOpen: false,
    modalProps: {},
    openModal: (type, props) => set({ modalType: type, isOpen: true, modalProps: props }),
    closeModal: () => set({ modalType: null, isOpen: false, modalProps: {} }),
}));

export default useModalStore;
