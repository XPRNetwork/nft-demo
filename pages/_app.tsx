import type { AppProps } from 'next/app';
import '../styles/reset.css';
import '../styles/globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
