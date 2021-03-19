import { Container, Text } from './LoadingPage.styled';
import Spinner from '../Spinner';

const LoadingPage = (): JSX.Element => {
  return (
    <Container>
      <Spinner />
      <Text>Loading...</Text>
    </Container>
  );
};

export default LoadingPage;
