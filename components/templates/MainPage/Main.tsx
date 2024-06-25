import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getBestsellersFx } from '@/app/api/products'
import styles from '@/styles/main/index.module.scss'
import { useStore } from 'effector-react'
import MainPageSlider from '@/components/modules/MainPage/MainPageSlider'
//import { $shoppingCart } from '@/context/shopping-cart'
import { AnimatePresence, motion } from 'framer-motion'
//import CartAlert from '@/components/modules/DashboardPage/CartAlert'
import { IProducts } from '@/types/products'
import { getCartItemsFx } from '@/app/api/cart'
import { $user } from '@/context/user'
import { setShoppingCart } from '@/context/cart'
import MainBanner from '@/components/modules/MainPage/MainBanner'
import { $mode } from '@/context/mode'
import Link from 'next/link'
import SearchInput from '@/components/elements/SearchInput/SearchInput'

const MainPage = () => {
  const [bestsellers, setBestsellers] = useState<IProducts>(
    {} as IProducts
  )
  const [newItems, setNewItems] = useState<IProducts>(
    {} as IProducts
  )
  const [spinner, setSpinner] = useState(false)
  const user = useStore($user);
  //const shoppingCart = useStore($shoppingCart)
  //const [showAlert, setShowAlert] = useState(!!shoppingCart.length)
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  useEffect(() => {
    loadProducts()
  }, [])

  /*
  useEffect(() => {
    if (shoppingCart.length) {
      setShowAlert(true)
      return
    }

    setShowAlert(false)
  }, [shoppingCart.length])
  */

  const loadProducts = async () => {
    try {
      setSpinner(true)
      const bestsellers = await getBestsellersFx('/products/bestsellers') //Получаем бестселлеры
      const newItemData = await getBestsellersFx('/products/new') //Получаем новинки

      setBestsellers(bestsellers)
      setNewItems(newItemData)
    } catch (error) {
      console.log((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  //const closeAlert = () => setShowAlert(false)
  //Количество дней в текущем месяце
  console.log('месяц', Number(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate()))

  //Количество дней в текущем году
  console.log('год', Number((Date.UTC(new Date().getFullYear()+1, 0, 0)-Date.UTC(new Date().getFullYear(), 0, 0))/86400000))

  return (
    <section className={styles.main}>
      <div className={`container ${styles.main__container}`}>
        {/*<div className={styles.main__search}>
          <input className={`${darkModeClass}`} type="text" placeholder="Поиск" />
          <div className={styles.main__search__button}>
            <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M31.5 32.1417L22.1667 23.275C21.3333 23.9083 20.375 24.4097 19.2917 24.7792C18.2083 25.1486 17.0556 25.3333 15.8333 25.3333C12.8056 25.3333 10.2433 24.3369 8.14667 22.344C6.05 20.3511 5.00111 17.917 5 15.0417C5 12.1653 6.04889 9.73117 8.14667 7.73933C10.2444 5.7475 12.8067 4.75106 15.8333 4.75C18.8611 4.75 21.4233 5.74644 23.52 7.73933C25.6167 9.73222 26.6656 12.1663 26.6667 15.0417C26.6667 16.2028 26.4722 17.2979 26.0833 18.3271C25.6944 19.3562 25.1667 20.2667 24.5 21.0583L33.875 29.9646C34.1806 30.2549 34.3333 30.6111 34.3333 31.0333C34.3333 31.4556 34.1667 31.825 33.8333 32.1417C33.5278 32.4319 33.1389 32.5771 32.6667 32.5771C32.1944 32.5771 31.8056 32.4319 31.5 32.1417ZM15.8333 22.1667C17.9167 22.1667 19.6878 21.4737 21.1467 20.0877C22.6056 18.7018 23.3344 17.0198 23.3333 15.0417C23.3333 13.0625 22.6039 11.3799 21.145 9.994C19.6861 8.60806 17.9156 7.91561 15.8333 7.91667C13.75 7.91667 11.9789 8.60964 10.52 9.99558C9.06111 11.3815 8.33222 13.0636 8.33333 15.0417C8.33333 17.0208 9.06278 18.7034 10.5217 20.0893C11.9806 21.4753 13.7511 22.1677 15.8333 22.1667Z" fill="white"/>
            </svg>
          </div>
        </div>*/}
        <SearchInput />
        <MainBanner/>
        <div className={styles.main__sliderWithName}>
          <div className={`${styles.main__title} ${darkModeClass}`}>Хиты продаж</div>
          <MainPageSlider items={bestsellers.rows || []} spinner={spinner} />
        </div>
        <div className={styles.main__sliderWithName}>
          <div className={`${styles.main__title}  ${darkModeClass}`}>Новинки</div>
          <MainPageSlider items={newItems.rows || []} spinner={spinner} />
        </div>
        <div className={`${styles.main__faq} ${darkModeClass}`}>
          <div className={`${styles.main__title}  ${darkModeClass}`}>Часто задаваемые вопросы</div>
          <div className={styles.main__faq__row}>
            <div className={styles.main__faq__block}>
              <div className={styles.main__faq__qestion}>
                <h3>Что такое детейлинг автомобиля?</h3>
              </div>
              <div className={styles.main__faq__answer}>
                Детейлинг – это процесс тщательной очистки, восстановления и завершающей обработки автомобиля, чтобы он выглядел максимально чистым и блестящим
              </div>
            </div>
            <div className={styles.main__faq__block}>
              <div className={styles.main__faq__qestion}>
              <h3>Как часто нужно делать детейлинг?</h3>
              </div>
              <div className={styles.main__faq__answer}>
                Рекомендуется проводить детейлинг не реже двух раз в год, чтобы защитить краску и интерьер от износа
              </div>
            </div>
          </div>
          <div className={styles.main__faq__row}>
            <div className={styles.main__faq__block}>
              <div className={styles.main__faq__qestion}>
              <h3>В чем разница между мойкой и детейлингом?</h3>
              </div>
              <div className={styles.main__faq__answer}>
                Мойка – это базовая очистка, а детейлинг – это более глубокая и детальная работа, которая включает в себя полировку, восстановление и защиту
              </div>
            </div>
            <div className={styles.main__faq__block}>
              <div className={styles.main__faq__qestion}>
              <h3>Что используется в детейлинге?</h3>
              </div>
              <div className={styles.main__faq__answer}>
                Специализированные шампуни, полироли, воски, средства для защиты пластика и кожи, которые можно найти в нашем 
                <Link
                  href={`/catalog`}
                  passHref
                  legacyBehavior>
                  <a>
                      каталоге
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainPage