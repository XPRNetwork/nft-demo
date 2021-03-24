import { StyledButton } from './Button.styled';

type Props = {
  children: string;
  onClick: () => void;
  filled?: boolean;
  rounded?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
};

const Button = ({
  children,
  onClick,
  filled,
  rounded,
  fullWidth,
  disabled,
}: Props): JSX.Element => (
  <StyledButton
    filled={filled}
    rounded={rounded}
    fullWidth={fullWidth}
    disabled={disabled}
    onClick={onClick}>
    {children}
  </StyledButton>
);

export default Button;
