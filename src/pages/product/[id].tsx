import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
  ContainerNotFound,
  DescriptionNotFound,
  TitleNotFound,
} from '../../styles/pages/product';
import Image from 'next/image';
import { stripe } from '../../lib/stripe';
import Stripe from 'stripe';
import productNotFoundImage from '../../assets/product-not-found.svg';

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
  if (!product) {
    return (
      <ContainerNotFound>
        <Image
          src={productNotFoundImage}
          width={300}
          height={300}
          alt="product not found"
        />

        <TitleNotFound>Produto não encontrado</TitleNotFound>
        {/* // TODO: add a link to home page */}
        <DescriptionNotFound>
          Desculpe, o produto que você estava procurando não foi encontrado.
          Verifique se o nome do produto está correto ou tente pesquisar
          novamente mais tarde. Se você precisar de ajuda, entre em contato
          conosco para obter assistência
        </DescriptionNotFound>
      </ContainerNotFound>
    );
  }

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
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  ProductProps,
  { id: string }
> = async ({ params }) => {
  try {
    const productId = params.id;

    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price'],
    });

    const price = product.default_price as Stripe.Price;

    return {
      props: {
        product: {
          id: product.id,
          name: product.name,
          imageUrl: product.images[0],
          price: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(price.unit_amount / 100),
          description: product.description,
          defaultPriceId: price.id,
        },
      },
      revalidate: 60 * 60 * 1, // 1 hours
    };
  } catch (error) {
    return {
      props: {
        product: null,
      },
    };
  }
};
