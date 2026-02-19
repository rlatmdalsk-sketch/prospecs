import { create } from "zustand";

export type ModalType = "CATEGORY_FORM" | "CONFIRM" | "POSTCODE" | "PAYMENT" | "REVIEW_FORM" | null;

interface ModalStore {
    modalType: ModalType;
    isOpen: boolean;
    modalProps: any;

    openModal: (type: ModalType, props?: any) => void;
    closeModal: () => void;
}

const useModalStore = create<ModalStore>(set => ({
    modalType: null,
    isOpen: false,
    modalProps: {},
    openModal: (type, props = {}) => set({ modalType: type, isOpen: true, modalProps: props }),
    closeModal: () => set({ modalType: null, isOpen: false, modalProps: {} }),
}));

export default useModalStore;
