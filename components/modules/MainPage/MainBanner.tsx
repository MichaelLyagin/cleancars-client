import Link from 'next/link'
import styles from '../../../styles/main/index.module.scss'
import { setCategory } from '@/context/products'
import { ICategory } from '@/types/products'
import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'

const MainBanner = () => {
    const mode = useStore($mode)

    const setSelectedCategory = (cat: ICategory) => {
        setCategory(cat)
    }
    
    return (
        <div className={styles.banner}>
            <div className={`container ${styles.banner__container}`}>
                <div className={styles.banner__img}>
                    {mode === 'dark' ? 
                    <img src='/img/Group 25.svg' />
                    :
                    <img src='/img/b1c9f091e5b285bf027edce5a27cd491c6548ac3 1.svg' />}
                </div>
                <div className={styles.banner__tires}>
                    <Link
                        href='/catalog'
                        passHref
                        legacyBehavior
                    >
                        <a onClick={() => setSelectedCategory({category_id: 14, category_name: 'Уход за резиной'})}>
                            <div className={styles.banner__tires__circle}>
                            <div className={styles.banner__tires__circle__text}>Уход за шинами</div>
                            </div>
                        </a>
                    </Link>
                </div>
                <div className={styles.banner__interior}>
                    <Link
                        href='/catalog'
                        passHref
                        legacyBehavior
                    >
                        <a onClick={() => setSelectedCategory({category_id: 20, category_name: 'Интерьер'})}>
                            <div className={styles.banner__interior__circle}>
                                <div className={styles.banner__interior__circle__text}>Уход за интерьером</div>
                            </div>
                        </a>
                    </Link>
                </div>
                <div className={styles.banner__exterior}>
                    <Link
                        href='/catalog'
                        passHref
                        legacyBehavior
                    >
                        <a onClick={() => setSelectedCategory({category_id: 10, category_name: 'Экстерьер'})}>
                            <div className={styles.banner__exterior__circle}>
                                <div className={styles.banner__exterior__circle__text}>Уход за экстерьером</div>
                            </div>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MainBanner