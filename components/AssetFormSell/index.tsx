import { useEffect, Dispatch, SetStateAction } from 'react';
import Button from '../Button';
import {
  DropdownMenu,
  General,
  Amount,
  Row,
} from '../AssetFormBuy/AssetFormBuy.styled';
import { Asset } from '../../services/assets';

type Props = {
  dropdownAssets: Asset[];
  lowestPrice: string;
  maxSupply: string;
  buttonText: string;
  assetId: string;
  handleButtonClick: () => void;
  setCurrentAsset: Dispatch<SetStateAction<Asset>>;
};

export const AssetFormSell = ({
  dropdownAssets,
  lowestPrice,
  maxSupply,
  buttonText,
  assetId,
  handleButtonClick,
  setCurrentAsset,
}: Props): JSX.Element => {
  useEffect(() => {
    handleDropdownSelect(dropdownAssets[0].asset_id);
  }, []);

  const handleDropdownSelect = (id: string) => {
    const dropdownAsset = dropdownAssets.find((asset) => {
      return asset.asset_id === id;
    });
    setCurrentAsset(dropdownAsset);
  };

  return (
    <section>
      <Row>
        <General>Lowest Market Price</General>
        <General>Edition Size</General>
      </Row>
      <Row>
        <Amount>{lowestPrice || 'None'}</Amount>
        <Amount>{maxSupply}</Amount>
      </Row>
      <General>Serial number</General>
      <DropdownMenu
        name="Available Assets For Sale"
        value={assetId}
        onChange={(e) => handleDropdownSelect(e.target.value)}>
        <option key="blank" value="" disabled>
          - - Select a serial number - -
        </option>
        {dropdownAssets.length > 0 &&
          dropdownAssets.map(({ asset_id, template_mint, salePrice }) => (
            <option key={template_mint} value={asset_id}>
              #{template_mint} - {salePrice || 'Not for sale'}
            </option>
          ))}
      </DropdownMenu>
      <Button
        fullWidth
        filled={!buttonText.toLowerCase().includes('cancel')}
        rounded
        onClick={handleButtonClick}>
        {buttonText}
      </Button>
    </section>
  );
};

export default AssetFormSell;
