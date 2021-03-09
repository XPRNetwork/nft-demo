import { ReactNode } from 'react';
import Head from 'next/head';
import { Container } from './PageLayout.styled';

type Props = {
  title: string;
  children: ReactNode;
};

const PageLayout = ({ title, children }: Props): JSX.Element => {
  return (
    <main>
      <Head>
        <title>{`${title} - NFT Demo`}</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Container>{children}</Container>
    </main>
  );
};

export default PageLayout;
