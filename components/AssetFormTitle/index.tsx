import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  NameContainer,
  Name,
  General,
  Title,
  Author,
  CollectionIconContainer,
} from './AssetFormTitle.styled';
import AssetFormSellPopupMenu from '../AssetFormSellPopupMenu';
import { capitalize } from '../../utils';

type Props = {
  templateName: string;
  collectionName: string;
  collectionAuthor: string;
};

const AssetFormTitle = ({
  templateName,
  collectionName,
  collectionAuthor,
}: Props): JSX.Element => {
  const router = useRouter();
  const isMyTemplate = router.pathname.includes('my-templates');
  return (
    <>
      <CollectionIconContainer>
        <Image
          priority
          layout="fixed"
          width={24}
          height={24}
          src="/icon-monsters.png"
          alt="Crypto Monsters icon"
        />
        <Title>Crypto {capitalize(collectionName)}</Title>
      </CollectionIconContainer>
      <NameContainer>
        <Name>{templateName}</Name>
        {isMyTemplate && <AssetFormSellPopupMenu />}
      </NameContainer>
      <General>
        Created by <Author>{capitalize(collectionAuthor)}</Author>
      </General>
    </>
  );
};

export default AssetFormTitle;
