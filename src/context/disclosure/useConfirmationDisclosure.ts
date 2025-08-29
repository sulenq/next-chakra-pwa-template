import { create } from "zustand";

interface Props {
  confirmationOpen: boolean;
  confirmationData: any;
  confirmationOnOpen: () => void;
  confirmationOnClose: () => void;
  setConfirmationDisclosure: (newState: boolean) => void;
  setConfirmationData: (newState: any) => void;
}

const useConfirmationDisclosure = create<Props>((set) => ({
  confirmationOpen: false,
  confirmationData: null,
  confirmationOnOpen: () => set({ confirmationOpen: true }),
  confirmationOnClose: () => set({ confirmationOpen: false }),
  setConfirmationDisclosure: (newState) => set({ confirmationOpen: newState }),
  setConfirmationData: (newState) => set({ confirmationData: newState }),
}));

export default useConfirmationDisclosure;
