import Image from 'next/image';
import { useRouter } from 'next/router';
import { Asset } from '../../services/assets';
import { Template } from '../../services/templates';
import {
  Container,
  ImageContainer,
  Text,
  SecondaryText,
  Price,
  Tag,
  EmptyPrice,
  ShimmerBlock,
} from './GridCard.styled';
import { formatNumber } from '../../utils';

type Props = {
  text: string;
  secondaryText: string;
  priceText: string;
  image: string;
  redirectPath: string;
  isForSale?: boolean;
  isLoading?: boolean;
};

interface TemplateCardProps extends Template {
  isLoading: boolean;
}

const Card = ({
  text,
  secondaryText,
  priceText,
  image,
  redirectPath,
  isForSale,
  isLoading,
}: Props): JSX.Element => {
  const router = useRouter();
  const price = priceText ? <Price>{priceText}</Price> : <EmptyPrice />;
  return (
    <Container onClick={() => router.push(redirectPath)}>
      <ImageContainer>
        <Image
          priority
          layout="responsive"
          width={213}
          height={220}
          alt={text}
          src={`https://ipfs.io/ipfs/${image}`}
        />
        {isForSale ? <Tag>FOR SALE</Tag> : null}
      </ImageContainer>
      <Text>{text}</Text>
      <SecondaryText>{secondaryText}</SecondaryText>
      {isLoading ? <ShimmerBlock /> : price}
    </Container>
  );
};

export const AssetCard = ({
  name,
  asset_id,
  data: { image },
  isForSale,
  salePrice,
}: Asset): JSX.Element => {
  return (
    <Card
      image={image as string}
      text={name}
      secondaryText={`Serial #${asset_id}`}
      priceText={salePrice as string}
      isForSale={isForSale as boolean}
      redirectPath={`/assets/${asset_id}`}
    />
  );
};

export const TemplateCard = ({
  name,
  max_supply,
  template_id,
  immutable_data: { image },
  lowestPrice,
  isLoading,
}: TemplateCardProps): JSX.Element => {
  return (
    <Card
      isLoading={isLoading}
      text={name}
      secondaryText={`Edition Size / ${formatNumber(max_supply)}`}
      priceText={lowestPrice}
      image={image as string}
      redirectPath={`/${template_id}`}
    />
  );
};
