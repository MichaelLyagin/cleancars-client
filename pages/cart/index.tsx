import Head from 'next/head'
import Header from '@/components/modules/Header/Header'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import CartPage from '@/components/templates/CartPage/Cart'
import { useStore } from 'effector-react'
import { $shoppingCart } from '@/context/cart'
import Footer from '@/components/modules/Footer/Footer'

function Cart() {
  const { shouldLoadContent } = useRedirectByUserCheck()

  return (
    <>
      <Head>
        <title>Корзина</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Header />
      <CartPage />
      <Footer />
    </>
  )
}

export default Cart