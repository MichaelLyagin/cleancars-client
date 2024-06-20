import Head from 'next/head'
import Header from '@/components/modules/Header/Header'
import MainPage from '@/components/templates/MainPage/Main'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import Footer from '@/components/modules/Footer/Footer'
import CatalogPage from '@/components/templates/CatalogPage/CatalogPage'
import { IQueryParams } from '@/types/catalog'
import { $product, setProduct } from '@/context/product'
import { useStore } from 'effector-react'
import { getProductFx } from '@/app/api/products'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import ProductPage from '@/components/templates/ProductPage/ProductPage'

//При загрузке страницы принимаем квери параметры
function Product({query}: {query: IQueryParams}) {
    const product = useStore($product)

    useEffect(() => {
        loadBoilerPart()
      }, [])
    
    const loadBoilerPart = async () => {
    try {
        const data = await getProductFx(`/products/find/${query.productId}`)

        setProduct(data)
    } catch (error) {
        toast.error((error as Error).message)
    }
    }

  return (
    <>
      <Head>
        <title>{product.name}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Header />
      <ProductPage />
      <Footer />
    </>
  )
}

//Функция next js получаем квери параметры будучи на сервере
export async function getServerSideProps(context: {query: IQueryParams}) {
  return {
    props: {query: {...context.query}}
  }
}

export default Product