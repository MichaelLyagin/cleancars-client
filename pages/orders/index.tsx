import Head from 'next/head'
import Header from '@/components/modules/Header/Header'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import CartPage from '@/components/templates/CartPage/Cart'
import { useStore } from 'effector-react'
import { $shoppingCart } from '@/context/cart'
import Footer from '@/components/modules/Footer/Footer'
import FavoritesPage from '@/components/templates/FavoritesPage/FavoritesPage'
import MakeOrderPage from '@/components/templates/MakeOrderPage/MakeOrderPage'
import OrdersPage from '@/components/templates/OrdersPage/OrdersPage'

function Orders() {
  return (
    <>
      <Head>
        <title>Заказы</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Header />
      <OrdersPage />
      <Footer />
    </>
  )
}

export default Orders