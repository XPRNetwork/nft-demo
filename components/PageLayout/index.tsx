import { ReactNode } from 'react';
import Head from 'next/head';
import { Main, Container } from './PageLayout.styled';

type Props = {
  title: string;
  children: ReactNode;
};

const PageLayout = ({ title, children }: Props): JSX.Element => {
  return (
    <Main>
      <Head>
        <title>{`${title} - NFT Demo`}</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Container>{children}</Container>
    </Main>
  );
};

export default PageLayout;
