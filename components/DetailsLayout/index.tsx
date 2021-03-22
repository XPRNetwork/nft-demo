import { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import { breakpointValues } from '../../styles/Breakpoints';
import {
  Container,
  Row,
  Column,
  ImageContainer,
  Title,
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
  image: string;
  sales?: Sale[];
  error?: string;
  serial_number?: string;
  template_id?: string;
  max_supply: string;
};

const DetailsLayout = ({
  children,
  name,
  seriesNumber,
  image,
  sales,
  error,
  serial_number,
  template_id,
  max_supply,
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
              {serial_number
                ? `Serial number #${serial_number}/`
                : `Template number #${template_id}/`}
              {max_supply}
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
