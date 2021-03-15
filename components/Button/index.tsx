import { StyledButton } from './Button.styled';

type Props = {
  children: string;
  onClick: () => void;
  filled?: boolean;
  rounded?: boolean;
  fullWidth?: boolean;
};

const Button = ({
  children,
  onClick,
  filled,
  rounded,
  fullWidth,
}: Props): JSX.Element => (
  <StyledButton
    filled={filled}
    rounded={rounded}
    fullWidth={fullWidth}
    onClick={onClick}>
    {children}
  </StyledButton>
);

export default Button;
