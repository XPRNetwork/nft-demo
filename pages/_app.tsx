import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { AppProps } from 'next/app';
import '../styles/reset.css';
import '../styles/globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { AuthProvider, ModalProvider } from '../components/Provider';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axe = require('@axe-core/react');
      axe(React, ReactDOM, 1000);
    }
  }, []);

  return (
    <ModalProvider>
      <AuthProvider>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </ModalProvider>
  );
}

export default MyApp;
