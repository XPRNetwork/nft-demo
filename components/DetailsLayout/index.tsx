import { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import { breakpointValues } from '../../styles/Breakpoints';
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
  Serial,
  Divider,
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
  serial_number: string;
  max_supply: string;
};

const DetailsLayout = ({
  children,
  name,
  seriesNumber,
  details,
  image,
  sales,
  error,
  serial_number,
  max_supply,
}: Props): JSX.Element => {
  const [detailsActive, setDetailsActive] = useState(true);
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
          <ImageContainer>
            <Image
              priority
              layout="responsive"
              width={456}
              height={470}
              src={`https://ipfs.io/ipfs/${image}`}
            />
          </ImageContainer>
          <Column>
            <Name>{name}</Name>
            <Series>Series #{seriesNumber}</Series>
            <Serial>
              Serial number #{serial_number}/{max_supply}
            </Serial>
            <Divider />
            {children}
          </Column>
        </Row>
      ) : (
        <Column>
          <Name>{name}</Name>
          <Series>Series #{seriesNumber}</Series>
          <Serial>
            Serial number #{serial_number}/{max_supply}
          </Serial>
          <ImageContainer>
            <Image
              priority
              layout="responsive"
              width={456}
              height={470}
              src={`https://ipfs.io/ipfs/${image}`}
            />
          </ImageContainer>
          {children}
        </Column>
      )}
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
