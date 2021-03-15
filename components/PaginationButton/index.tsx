import { Button } from './PaginationButton.styled';
import { ReactComponent as Arrow } from '../../public/arrow.svg';
import { ReactComponent as Loading } from '../../public/loading.svg';

type Props = {
  onClick: () => Promise<void>;
  disabled: boolean;
  isLoading: boolean;
  isHidden?: boolean;
};

const PaginationButton = ({
  onClick,
  disabled,
  isLoading,
  isHidden,
}: Props): JSX.Element => (
  <Button
    aria-label="Next page"
    onClick={onClick}
    disabled={disabled || isLoading}
    isHidden={isHidden || (disabled && !isLoading)}>
    {isLoading ? <Loading /> : <Arrow />}
  </Button>
);

export default PaginationButton;
