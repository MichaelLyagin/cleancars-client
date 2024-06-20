import Head from "next/head";
import { Inter } from "next/font/google";
import AuthPage from "@/components/templates/AuthPage/AuthPage";
import useRedirectByUserCheck from "@/hooks/useRedirectByUserCheck";
import { useRouter } from "next/router";
import Header from "@/components/modules/Header/Header";
import Footer from "@/components/modules/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

function Auth() {
  const { shouldLoadContent } = useRedirectByUserCheck()
  const router = useRouter()

  if(shouldLoadContent){//Если пользователь авторизован то редиректим на главную страницу
    router.push('/main')
    return <></>
  }

  const redirectToMain = () =>{
    router.push('/main')
    return
  }

  return (
    <>
      <Head>
        <title>Cleancars</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      {!shouldLoadContent && <AuthPage/>}
      <Footer />
    </>
  );
}

export default Auth
