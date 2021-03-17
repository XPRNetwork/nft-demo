import { ReactNode } from 'react';
import Head from 'next/head';
import { Main, Container } from './PageLayout.styled';
import { useModalContext, MODAL_TYPES } from '../Provider';
import { DepositModal, WithdrawModal } from '../Modal';

type Props = {
  title: string;
  children: ReactNode;
};

const PageLayout = ({ title, children }: Props): JSX.Element => {
  const { modalType } = useModalContext();

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPES.DEPOSIT:
        return <DepositModal />;
      case MODAL_TYPES.WITHDRAW:
        return <WithdrawModal />;
      default:
        return null;
    }
  };

  return (
    <Main>
      <Head>
        <title>{`${title} - NFT Demo`}</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Container>{children}</Container>
      {renderModal()}
    </Main>
  );
};

export default PageLayout;
