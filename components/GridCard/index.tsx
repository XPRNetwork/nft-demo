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
} from './GridCard.styled';
import { formatNumber } from '../../utils';

type Props = {
  text: string;
  secondaryText: string;
  priceText: string;
  image: string;
  isForSale?: boolean;
  redirectPath: string;
};

const Card = ({
  text,
  secondaryText,
  priceText,
  isForSale,
  image,
  redirectPath,
}: Props): JSX.Element => {
  const router = useRouter();
  return (
    <Container onClick={() => router.push(redirectPath)}>
      <ImageContainer>
        <Image
          priority
          layout="responsive"
          width={213}
          height={220}
          src={`https://ipfs.io/ipfs/${image}`}
        />
        {isForSale ? <Tag>FOR SALE</Tag> : null}
      </ImageContainer>
      <Text>{text}</Text>
      <SecondaryText>{secondaryText}</SecondaryText>
      {priceText ? <Price>{priceText}</Price> : null}
    </Container>
  );
};

export const AssetCard = (asset: Asset): JSX.Element => {
  const {
    name,
    asset_id,
    data: { img },
    isForSale,
    salePrice,
  } = asset;
  return (
    <Card
      image={img as string}
      text={name}
      secondaryText={`Serial #${asset_id}`}
      priceText={salePrice as string}
      isForSale={isForSale as boolean}
      redirectPath={`/collection/${asset_id}`}
    />
  );
};

export const TemplateCard = (template: Template): JSX.Element => {
  const {
    name,
    max_supply,
    template_id,
    immutable_data: { image },
    lowestPrice,
  } = template;
  return (
    <Card
      text={name}
      secondaryText={`Edition Size / ${formatNumber(max_supply)}`}
      priceText={lowestPrice}
      image={image as string}
      redirectPath={`/${template_id}`}
    />
  );
};
