import Head from 'next/head'
import Header from '@/components/modules/Header/Header'
import MainPage from '@/components/templates/MainPage/Main'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import Footer from '@/components/modules/Footer/Footer'

function About() {
  const { shouldLoadContent } = useRedirectByUserCheck()

  return (
    <>
      <Head>
        <title>Cleancars — интернет-магазин детейлинга</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" sizes="32x32" href="/img/logo.svg" />
      </Head>
      <Header />
      <div>
        О компании
      </div>
      <Footer />
    </>
  )
}

export default About