import Head from 'next/head';
import Link from 'next/link';

import { useKeenSlider } from 'keen-slider/react';

import { HomeContainer, Product } from '../styles/pages/home';

import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home() {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  const products: HomeProps['products'] = [
    {
      id: '1',
      name: 'Product 1',
      imageUrl: 'https://pbs.twimg.com/media/FW17vYJX0AApSN8?format=jpg',
      price: '$10.99',
    },
    {
      id: '2',
      name: 'Product 2',
      imageUrl: 'https://pbs.twimg.com/media/FW17vYJX0AApSN8?format=jpg',
      price: '$19.99',
    },
    {
      id: '3',
      name: 'Product 3',
      imageUrl: 'https://pbs.twimg.com/media/FW17vYJX0AApSN8?format=jpg',
      price: '$5.99',
    },
    {
      id: '4',
      name: 'Product 4',
      imageUrl: 'https://pbs.twimg.com/media/FW17vYJX0AApSN8?format=jpg',
      price: '$14.99',
    },
    {
      id: '5',
      name: 'Product 5',
      imageUrl: 'https://pbs.twimg.com/media/FW17vYJX0AApSN8?format=jpg',
      price: '$24.99',
    },
  ];

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map(product => {
          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              prefetch={false}
            >
              <Product className="keen-slider__slide">
                <Image src={product.imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </footer>
              </Product>
            </Link>
          );
        })}
      </HomeContainer>
    </>
  );
}
