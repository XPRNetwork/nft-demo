import { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from '../NavBar';
import { Title } from './PageLayout.styled';
import { MaxWidth } from '../../styles/MaxWidth.styled';

type Props = {
  title: string;
  pageTitle: string;
  children: ReactNode;
};

const PageLayout = ({ title, pageTitle, children }: Props): JSX.Element => {
  return (
    <main>
      <Head>
        <title>{`${title} - NFT Demo`}</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <Title>{pageTitle}</Title>
      <MaxWidth>{children}</MaxWidth>
    </main>
  );
};

export default PageLayout;
