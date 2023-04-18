import { AppProps } from 'next/app';
import Image from 'next/image';
import { globalStyles } from '../styles/global';
import { Container, Header } from '../styles/pages/app';
import logoImg from '../assets/logo.svg';
import Link from 'next/link';

globalStyles();

function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Link href="/">
          <Image src={logoImg} alt="" />
        </Link>
      </Header>

      <Component {...pageProps} />
    </Container>
  );
}

export default App;
