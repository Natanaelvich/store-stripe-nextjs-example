import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product';
import Image from 'next/image';

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  };
}

export default function Product({ product }: ProductProps) {
  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button>Comprar agora</button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: '1' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  ProductProps,
  { id: string }
> = async ({ params }) => {
  const productId = params.id;

  return {
    props: {
      product: {
        id: productId,
        name: 'Product 1',
        imageUrl: 'https://pbs.twimg.com/media/FW17vYJX0AApSN8?format=jpg',
        price: '$10.99',
        description: 'This is the description for product 1.',
        defaultPriceId: '1',
      },
    },
    revalidate: 60 * 60 * 1, // 1 hours
  };
};
