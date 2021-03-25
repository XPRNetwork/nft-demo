import { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import { breakpointValues } from '../../styles/Breakpoints';
import {
  Container,
  Row,
  Column,
  ImageContainer,
  Title,
  ContentRow,
  ArrowContainer,
  ToggleContainer,
  Divider,
} from './DetailsLayout.styled';
import SalesHistoryTable from '../SalesHistoryTable';
import AssetFormTitle from '../AssetFormTitle';
import { Sale } from '../../services/sales';

type Props = {
  children: ReactNode;
  image: string;
  templateName: string;
  collectionName: string;
  collectionAuthor: string;
  sales: Sale[];
  error?: string;
};

const AssetImage = ({ image }: { image: string }): JSX.Element => (
  <ImageContainer>
    <Image
      priority
      layout="responsive"
      width={456}
      height={470}
      src={`https://ipfs.io/ipfs/${image}`}
    />
  </ImageContainer>
);

const DetailsLayout = ({
  children,
  image,
  templateName,
  collectionName,
  collectionAuthor,
  sales,
  error,
}: Props): JSX.Element => {
  const [salesTableActive, setSalesTableActive] = useState(true);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <Container>
      {width > breakpointValues.mobile ? (
        <Row>
          <AssetImage image={image} />
          <Column>
            <AssetFormTitle
              templateName={templateName}
              collectionName={collectionName}
              collectionAuthor={collectionAuthor}
            />
            <Divider />
            {children}
          </Column>
        </Row>
      ) : (
        <Column>
          <AssetFormTitle
            templateName={templateName}
            collectionName={collectionName}
            collectionAuthor={collectionAuthor}
          />
          <AssetImage image={image} />
          {children}
        </Column>
      )}
      <ContentRow>
        <Title>Recent Sales History</Title>
        <ArrowContainer
          isActive={salesTableActive}
          onClick={() => setSalesTableActive(!salesTableActive)}>
          <Image
            priority
            layout="fixed"
            width={24}
            height={24}
            src="/arrow.svg"
            alt="Dropdown Arrow"
          />
        </ArrowContainer>
      </ContentRow>
      <ToggleContainer active={salesTableActive}>
        <SalesHistoryTable tableData={sales} error={error} />
      </ToggleContainer>
    </Container>
  );
};

export default DetailsLayout;
