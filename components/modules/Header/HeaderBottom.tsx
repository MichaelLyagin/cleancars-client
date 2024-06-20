/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/header/index.module.scss'
import { $user } from '@/context/user'
import { logoutFx } from '@/app/api/auth'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import ProfileDropDown from './ProfileDropDown'
import logo from '../../../public/img/logo.svg'
import LogoSvg from '@/components/elements/LogoSvg/LogoSvg'
import ModeToggler from '@/components/elements/ModeToggler/ModeToggler'
import { $mode } from '@/context/mode'
import LogoSvgDark from '@/components/elements/LogoSvgDark/LogoSvgDark'

const HeaderBottom = () => {
  const router = useRouter()
  const user = useStore($user)
  const { shouldLoadContent } = useRedirectByUserCheck()
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  useEffect(() => {
    if (router.pathname === '/order') {
      return
    }
  }, [router.pathname])

  useEffect(() => {

  },[shouldLoadContent])


  return (
    <div className={`${styles.header__bottom} ${darkModeClass}`}>
      <div className={`container ${styles.header__bottom__container}`}>
          <Link href="/main" legacyBehavior passHref>
            <a className={styles.header__logo__link}>
              {mode === 'dark' ?
              <LogoSvgDark/>
              : 
              <LogoSvg/>}
            </a>
          </Link>
        {shouldLoadContent && router.pathname !== '/' ?
        <div className={styles.header__menu}>
          <div className={`${styles.header__menu__item} ${darkModeClass}`}>
              <Link href="/catalog" legacyBehavior passHref>
              <a>
                  Каталог
              </a>
            </Link>
          </div>
          <div className={`${styles.header__menu__item} ${darkModeClass}`}>
              <Link href="/favorites" legacyBehavior passHref>
              <a>
                  Избранное
              </a>
            </Link>
          </div>
          <div className={`${styles.header__menu__item} ${darkModeClass}`}>
              <Link href="/cart" legacyBehavior passHref>
              <a>
                  Корзина
              </a>
            </Link>
          </div>
          <div className={`${styles.header__menu__item} ${darkModeClass}`}>
            <ProfileDropDown/>
          </div>
          <div className={`${styles.header__menu__open_button} ${darkModeClass}`}>
            <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 12C30 12.3536 29.8683 12.6928 29.6339 12.9428C29.3995 13.1929 29.0815 13.3333 28.75 13.3333H1.25C0.918479 13.3333 0.600537 13.1929 0.366117 12.9428C0.131696 12.6928 0 12.3536 0 12C0 11.6464 0.131696 11.3072 0.366117 11.0572C0.600537 10.8071 0.918479 10.6667 1.25 10.6667H28.75C29.0815 10.6667 29.3995 10.8071 29.6339 11.0572C29.8683 11.3072 30 11.6464 30 12ZM1.25 2.66667H28.75C29.0815 2.66667 29.3995 2.52619 29.6339 2.27614C29.8683 2.02609 30 1.68696 30 1.33333C30 0.979711 29.8683 0.640573 29.6339 0.390525C29.3995 0.140476 29.0815 0 28.75 0H1.25C0.918479 0 0.600537 0.140476 0.366117 0.390525C0.131696 0.640573 0 0.979711 0 1.33333C0 1.68696 0.131696 2.02609 0.366117 2.27614C0.600537 2.52619 0.918479 2.66667 1.25 2.66667ZM28.75 21.3333H1.25C0.918479 21.3333 0.600537 21.4738 0.366117 21.7239C0.131696 21.9739 0 22.313 0 22.6667C0 23.0203 0.131696 23.3594 0.366117 23.6095C0.600537 23.8595 0.918479 24 1.25 24H28.75C29.0815 24 29.3995 23.8595 29.6339 23.6095C29.8683 23.3594 30 23.0203 30 22.6667C30 22.313 29.8683 21.9739 29.6339 21.7239C29.3995 21.4738 29.0815 21.3333 28.75 21.3333Z" fill="black"/>
            </svg>
          </div>
        </div>
        : router.pathname !== '/' ?
        <div className={styles.header__menu}>
          <div  className={`${styles.header__menu__item} ${darkModeClass}`}>
              <Link href="/catalog" legacyBehavior passHref>
              <a>
                  Каталог
              </a>
            </Link>
          </div>
          <div className={`${styles.header__menu__item} ${darkModeClass}`}>
              <Link href="/" legacyBehavior passHref>
              <a>
                  Избранное
              </a>
            </Link>
          </div>
          <div className={`${styles.header__menu__item} ${darkModeClass}`}>
              <Link href="/" legacyBehavior passHref>
              <a>
                  Корзина
              </a>
            </Link>
          </div>
          <div className={`${styles.header__menu__item} ${darkModeClass}`}>
            <ProfileDropDown/>
          </div>
          <div className={`${styles.header__menu__open_button} ${darkModeClass}`}>
            <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 12C30 12.3536 29.8683 12.6928 29.6339 12.9428C29.3995 13.1929 29.0815 13.3333 28.75 13.3333H1.25C0.918479 13.3333 0.600537 13.1929 0.366117 12.9428C0.131696 12.6928 0 12.3536 0 12C0 11.6464 0.131696 11.3072 0.366117 11.0572C0.600537 10.8071 0.918479 10.6667 1.25 10.6667H28.75C29.0815 10.6667 29.3995 10.8071 29.6339 11.0572C29.8683 11.3072 30 11.6464 30 12ZM1.25 2.66667H28.75C29.0815 2.66667 29.3995 2.52619 29.6339 2.27614C29.8683 2.02609 30 1.68696 30 1.33333C30 0.979711 29.8683 0.640573 29.6339 0.390525C29.3995 0.140476 29.0815 0 28.75 0H1.25C0.918479 0 0.600537 0.140476 0.366117 0.390525C0.131696 0.640573 0 0.979711 0 1.33333C0 1.68696 0.131696 2.02609 0.366117 2.27614C0.600537 2.52619 0.918479 2.66667 1.25 2.66667ZM28.75 21.3333H1.25C0.918479 21.3333 0.600537 21.4738 0.366117 21.7239C0.131696 21.9739 0 22.313 0 22.6667C0 23.0203 0.131696 23.3594 0.366117 23.6095C0.600537 23.8595 0.918479 24 1.25 24H28.75C29.0815 24 29.3995 23.8595 29.6339 23.6095C29.8683 23.3594 30 23.0203 30 22.6667C30 22.313 29.8683 21.9739 29.6339 21.7239C29.3995 21.4738 29.0815 21.3333 28.75 21.3333Z" fill="black"/>
            </svg>
          </div>
        </div> : null}
      </div>
    </div>
  )
}

export default HeaderBottom