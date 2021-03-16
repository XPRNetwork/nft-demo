import { ReactNode, useState } from 'react';
import Image from 'next/image';
import {
  Container,
  Row,
  Column,
  ImageContainer,
  Title,
  Description,
  Name,
  Series,
  ContentRow,
  ArrowContainer,
  ToggleContainer,
} from './DetailsLayout.styled';
import { Sale } from '../../services/sales';
import SalesHistoryTable from '../SalesHistoryTable';

type Props = {
  children: ReactNode;
  name: string;
  seriesNumber: string;
  details: string;
  image: string;
  sales?: Sale[];
  error?: string;
};

const DetailsLayout = ({
  children,
  name,
  seriesNumber,
  details,
  image,
  sales,
  error,
}: Props): JSX.Element => {
  const [detailsActive, setDetailsActive] = useState(true);
  const [salesTableActive, setSalesTableActive] = useState(true);

  return (
    <Container>
      <Row>
        <ImageContainer>
          <Image
            priority
            layout="responsive"
            width={456}
            height={470}
            src={`https://ipfs.io/ipfs/${image}`}
            alt={`Image of ${name}`}
          />
        </ImageContainer>
        <Column>
          <Name>{name}</Name>
          <Series>Series #{seriesNumber}</Series>
          {children}
        </Column>
      </Row>
      <ContentRow>
        <Title>Collectible Details</Title>
        <ArrowContainer
          isActive={detailsActive}
          onClick={() => setDetailsActive(!detailsActive)}>
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
      {detailsActive ? <Description>{details}</Description> : ''}
      {sales ? (
        <>
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
        </>
      ) : (
        ''
      )}
    </Container>
  );
};

export default DetailsLayout;
