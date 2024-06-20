import Head from 'next/head'
import Header from '@/components/modules/Header/Header'
import MainPage from '@/components/templates/MainPage/Main'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import Footer from '@/components/modules/Footer/Footer'
import CatalogPage from '@/components/templates/CatalogPage/CatalogPage'
import { IQueryParams } from '@/types/catalog'

//При загрузке страницы принимаем квери параметры
function Catalog({query}: {query: IQueryParams}) {
  const { shouldLoadContent } = useRedirectByUserCheck()

  return (
    <>
      <Head>
        <title>Каталог</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Header />
      <CatalogPage query={query}/>
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

export default Catalog