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
  Arrow,
} from './DetailsLayout.styled';

type Props = {
  children: ReactNode;
  name: string;
  seriesNumber: string;
  details: string;
  image: string;
};

const DetailsLayout = ({
  children,
  name,
  seriesNumber,
  details,
  image,
}: Props): JSX.Element => {
  const [active, setActive] = useState(true);

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
        <Arrow
          priority
          layout="fixed"
          width={24}
          height={24}
          src="/arrow.svg"
          active={active}
          onClick={() => setActive(!active)}
        />
      </ContentRow>
      {active ? <Description>{details}</Description> : ''}
    </Container>
  );
};

export default DetailsLayout;
