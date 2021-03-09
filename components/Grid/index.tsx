import { AssetCard, TemplateCard } from '../GridCard';
import { Asset } from '../../services/assets';
import { Template } from '../../services/templates';
import { Container } from './Grid.styled';

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
  const isAsset = type === GRID_TYPE.ASSET;
  const idKey = isAsset ? 'asset_id' : 'template_id';
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
