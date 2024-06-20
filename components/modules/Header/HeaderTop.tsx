import Link from 'next/link'
import { useStore } from 'effector-react'
import styles from '@/styles/header/index.module.scss'
import CityButton from '@/components/elements/CityButton/CityButton'
import ModeToggler from '@/components/elements/ModeToggler/ModeToggler'

const HeaderTop = () => {
  //const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  return (
    <div className={styles.header__top}>
      <div className={`container ${styles.header__top__container}`}>
        <CityButton/>
        <nav className={styles.header__nav}>
          <ul className={styles.header__nav__list}>
            <li className={styles.header__nav__list__item}>
              <Link href="/about" passHref legacyBehavior>
                <a className={styles.header__nav__list__item__link}>
                  О компании
                </a>
              </Link>
            </li>
            <li className={styles.header__nav__list__item}>
              <Link href="/contacts" passHref legacyBehavior>
                <a className={styles.header__nav__list__item__link}>
                  Контакты
                </a>
              </Link>
            </li>
            <li className={styles.header__nav__list__item}>
              <Link href="/shipping-payment" passHref legacyBehavior>
                <a className={styles.header__nav__list__item__link}>
                  Доставка и оплата
                </a>
              </Link>
            </li>
            <li className={styles.header__nav__list__item}>
              <Link href="/catalog" passHref legacyBehavior>
                <a className={styles.header__nav__list__item__link}>
                  Обратная связь
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.header__number}>
          <span  className={styles.header__number__span}>+7 800 555 35 35</span>
        </div>
        <div className={styles.header__mode_toggler}>
          <ModeToggler/>
        </div>
      </div>
    </div>
  )
}

export default HeaderTop