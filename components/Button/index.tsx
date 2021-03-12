import { StyledButton } from './Button.styled';

type Props = {
  children: string;
  onClick: () => void;
  filled?: boolean;
  rounded?: boolean;
};

const Button = ({ children, onClick, filled, rounded }: Props): JSX.Element => (
  <StyledButton filled={filled} rounded={rounded} onClick={onClick}>
    {children}
  </StyledButton>
);

export default Button;
