import { useState, createContext, useContext, ReactNode } from 'react';
import { useScrollLock } from '../../hooks';

export const MODAL_TYPES = {
  HIDDEN: 'HIDDEN',
  WITHDRAW: 'WITHDRAW',
};

type Props = {
  children: ReactNode;
};

type ModalContextValue = {
  modalType: string;
  openModal: (type: string) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue>({
  modalType: MODAL_TYPES.HIDDEN,
  openModal: undefined,
  closeModal: undefined,
});

export const useModalContext = (): ModalContextValue => {
  const context = useContext(ModalContext);
  return context;
};

export const ModalProvider = ({ children }: Props): JSX.Element => {
  const [modalType, setModalType] = useState<string>(MODAL_TYPES.HIDDEN);
  const openModal = (type: string) => setModalType(type);
  const closeModal = () => setModalType(MODAL_TYPES.HIDDEN);
  useScrollLock(modalType !== MODAL_TYPES.HIDDEN);

  const value: ModalContextValue = {
    modalType,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
