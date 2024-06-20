import FooterLogoSvg from '@/components/elements/FooterLogoSvg/FooterLogoSvg'
import styles from '../../../styles/footer/index.module.scss'
import VKSvg from '@/components/elements/VKSvg/VKSvg'
import TGSvg from '@/components/elements/TGSvg/TGSvg'
import OKSvg from '@/components/elements/OKSvg/OKSvg'
import Link from 'next/link'
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import FooterLogoSvgDark from '@/components/elements/FooterLogoSvgDark/FooterLogoSvgDark'

const Footer = () => {
    const mode = useStore($mode)

    return(
        <footer className={styles.footer}>
            <div className={`container ${styles.footer__container}`}>
                <div className={styles.footer__logo}>
                <Link href="/main" legacyBehavior passHref>
                    <a>
                        {mode === 'dark' ? <FooterLogoSvgDark/> : <FooterLogoSvg/>}
                    </a>
                </Link>
                </div>
                <div className={styles.footer__media}>
                    <a href="https://vk.com">
                        <VKSvg/>
                    </a>
                    <a href="https://web.telegram.org">
                        <TGSvg/>
                    </a>
                    <a href="https://ok.ru/">
                        <OKSvg/>
                    </a>
                </div>
                <div className={styles.footer__contact}>
                    <span className={styles.footer__contact__name}>Контакты:</span><br/>
                    <span>+7 800 555 35 35</span><br/>
                    <span>claen_cars@mail.ru</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer