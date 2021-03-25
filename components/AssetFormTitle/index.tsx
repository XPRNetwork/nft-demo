import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  TitleContainer,
  Name,
  General,
  CollectionName,
  CollectionCreator,
  CollectionIconContainer,
} from './AssetFormTitle.styled';
import AssetFormSellPopupMenu from '../AssetFormSellPopupMenu';

type Props = {
  name: string;
};

const AssetFormTitle = ({ name }: Props): JSX.Element => {
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
        <CollectionName>Crypto Monsters</CollectionName>
      </CollectionIconContainer>
      <TitleContainer>
        <Name>{name}</Name>
        {isMyTemplate && <AssetFormSellPopupMenu />}
      </TitleContainer>
      <General>
        Created by <CollectionCreator>Fred Krueger</CollectionCreator>
      </General>
    </>
  );
};

export default AssetFormTitle;
