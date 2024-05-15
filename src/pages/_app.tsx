import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from '../contexts/ContextProvider';
import { AppBar } from '../components/AppBar';
import { ContentContainer } from '../components/ContentContainer';
import { Footer } from '../components/Footer';
import { useRouter } from 'next/router';

import Notifications from '../components/Notification'
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const currentUrl = router.asPath;

  return (
    <>
      <Head>
        <title>SolPad</title>
      </Head>

      <ContextProvider>
        <div className="flex flex-col h-screen">
          <Notifications />
          <AppBar />
          <ContentContainer>
            <Component {...pageProps} />
          </ContentContainer>
          {
            !currentUrl.startsWith("/collections/") &&
            <Footer />
          }
        </div>
      </ContextProvider>
      <ToastContainer />
    </>
  );
};

export default App;
