import 'antd/dist/antd.css';
import Head from 'next/head';
// import makeServer from '../mock/index';
import '../styles/globals.css';
import { MessageProvider } from '../components/provider';

// if (process.env.NODE_ENV === 'development') {
//   makeServer({ environment: 'development' });
// }

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Online Education</title>
        <meta key="description" name="description" content="Online Education System" />
      </Head>
      
      <MessageProvider>
        <Component {...pageProps} />
      </MessageProvider>
    </>
  );
}

export default MyApp;
