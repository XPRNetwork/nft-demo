import { KeyboardEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
  isLoading?: boolean;
  assetsForSale?: string;
  totalAssets?: string;
  isUsersTemplates?: boolean;
};

interface TemplateCardProps extends Template {
  isLoading: boolean;
  isUsersTemplates?: boolean;
}

const Card = ({
  text,
  secondaryText,
  priceText,
  image,
  redirectPath,
  isLoading,
  assetsForSale,
  totalAssets,
  isUsersTemplates,
}: Props): JSX.Element => {
  const router = useRouter();

  const showPrice = () => {
    if (!priceText) return <EmptyPrice />;
    return <Price>{priceText}</Price>;
  };

  const openDetailPage = () => router.push(redirectPath);

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      openDetailPage();
    }
  };

  return (
    <Container tabIndex={0} onClick={openDetailPage} onKeyDown={handleEnterKey}>
      <ImageContainer>
        <Image
          priority
          layout="responsive"
          width={213}
          height={220}
          alt={text}
          src={`https://ipfs.io/ipfs/${image}`}
        />
        {isUsersTemplates ? (
          <Tag>
            {assetsForSale}/{totalAssets} FOR SALE
          </Tag>
        ) : null}
      </ImageContainer>
      <Text>{text}</Text>
      <SecondaryText>{secondaryText}</SecondaryText>
      {isLoading ? <ShimmerBlock /> : showPrice()}
    </Container>
  );
};

export const TemplateCard = ({
  name,
  max_supply,
  template_id,
  immutable_data: { image },
  lowestPrice,
  isLoading,
  assetsForSale,
  totalAssets,
  isUsersTemplates,
}: TemplateCardProps): JSX.Element => {
  const redirectPath = isUsersTemplates
    ? `/my-templates/${template_id}`
    : `/${template_id}`;
  return (
    <Card
      isLoading={isLoading}
      text={name}
      secondaryText={`Edition Size: ${formatNumber(max_supply)}`}
      priceText={lowestPrice}
      image={image as string}
      redirectPath={redirectPath}
      assetsForSale={assetsForSale}
      totalAssets={totalAssets}
      isUsersTemplates={isUsersTemplates}
    />
  );
};
