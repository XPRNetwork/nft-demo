import { useRouter } from 'next/router';
import Button from '../Button';
import { AssetCard, TemplateCard } from '../GridCard';
import { Asset } from '../../services/assets';
import { Template } from '../../services/templates';
import { Container, EmptyContainer, QuestionIcon, Text } from './Grid.styled';

type Item = Asset | Template;

export enum GRID_TYPE {
  ASSET = 'ASSET',
  TEMPLATE = 'TEMPLATE',
}

type Props = {
  items: Item[];
  type: GRID_TYPE;
};

const Grid = ({ items, type }: Props): JSX.Element => {
  const router = useRouter();
  const isAsset = type === GRID_TYPE.ASSET;
  const idKey = isAsset ? 'asset_id' : 'template_id';
  const emptyMessage = isAsset
    ? "Looks like you don't own any monsters yet."
    : 'No templates were found for this collection type.';

  if (!items.length) {
    return (
      <EmptyContainer>
        <QuestionIcon role="img" />
        <Text>{emptyMessage}</Text>
        <Button onClick={() => router.push('/')}>Explore Monsters</Button>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      {items.map((item) =>
        isAsset ? (
          <AssetCard key={item[idKey]} {...(item as Asset)} />
        ) : (
          <TemplateCard key={item[idKey]} {...(item as Template)} />
        )
      )}
    </Container>
  );
};

export default Grid;
