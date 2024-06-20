import "@/styles/globals.css";
import { withHydrate } from "effector-next";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import NextNProgress from 'nextjs-progressbar'
import 'react-toastify/dist/ReactToastify.css'

const enhance = withHydrate()

/*
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
*/

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false) //Оптимизация, чтобы рендер не сработал до отрисовки контента в браузере

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    mounted && (
      <>
        <NextNProgress/>
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-right"
          hideProgressBar={false}
          closeOnClick
          rtl={false}
          limit={1}
          theme="light"
        />
      </>
    )
  )
}

export default enhance(App as React.FC<AppProps>)
