import { StyledButton } from './Button.styled';

type Props = {
  children: string;
  onClick: () => void;
  filled?: boolean;
  rounded?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  color?: string;
  hoverColor?: string;
};

const Button = ({
  children,
  onClick,
  filled,
  rounded,
  fullWidth,
  disabled,
  color,
  hoverColor,
}: Props): JSX.Element => (
  <StyledButton
    filled={filled}
    rounded={rounded}
    fullWidth={fullWidth}
    disabled={disabled}
    color={color}
    hoverColor={hoverColor}
    onClick={onClick}>
    {children}
  </StyledButton>
);

Button.defaultProps = {
  color: '#8a9ef5',
  hoverColor: '#4d5dc1',
};

export default Button;
