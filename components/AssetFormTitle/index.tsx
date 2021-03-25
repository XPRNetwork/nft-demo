import Image from 'next/image';
import {
  TitleContainer,
  Name,
  General,
  CollectionName,
  CollectionCreator,
  CollectionIconContainer,
} from './AssetFormTitle.styled';

type Props = {
  name: string;
};

const AssetFormTitle = ({ name }: Props): JSX.Element => {
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
      </TitleContainer>
      <General>
        Created by <CollectionCreator>Fred Krueger</CollectionCreator>
      </General>
    </>
  );
};

export default AssetFormTitle;
