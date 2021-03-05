import type { AppProps } from 'next/app';
import '../styles/reset.css';
import '../styles/globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { AuthProvider } from '../components/Provider';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AuthProvider>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;
