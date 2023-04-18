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
import warningIcon from '../../assets/warning.svg';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';

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
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false);

  async function handleBuyButton() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      console.log('sim', err);
      setIsCreatingCheckoutSession(false);

      alert('Falha ao redirecionar ao checkout!');
    }
  }

  if (!product) {
    return (
      <ContainerNotFound>
        <Image
          src={warningIcon}
          width={300}
          height={300}
          alt="product not found"
        />

        <TitleNotFound>Produto não encontrado</TitleNotFound>
        <DescriptionNotFound>
          Desculpe, o produto que você estava procurando não foi encontrado.
          Verifique se o nome do produto está correto ou tente pesquisar
          novamente mais tarde. Se você precisar de ajuda, entre em contato
          conosco para obter assistência.
        </DescriptionNotFound>
        <Link href="/">Voltar para a página inicial</Link>
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

          <button
            disabled={isCreatingCheckoutSession}
            onClick={handleBuyButton}
          >
            Comprar agora
          </button>
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
