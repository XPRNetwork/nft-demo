import { StyledButton } from './Button.styled';

type Props = {
  children: string;
  onClick: () => void;
};

const Button = ({ children, onClick }: Props): JSX.Element => (
  <StyledButton onClick={onClick}>{children}</StyledButton>
);

export default Button;
