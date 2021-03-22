import { Container } from './LoadingPage.styled';
import Spinner from '../Spinner';

const LoadingPage = (): JSX.Element => {
  return (
    <Container>
      <Spinner />
    </Container>
  );
};

export default LoadingPage;
