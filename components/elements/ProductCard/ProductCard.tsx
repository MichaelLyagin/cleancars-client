import { $user } from '@/context/user'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import { IProduct } from '@/types/products'
import { formatPrice } from '@/utils/common'
import { useStore } from 'effector-react'
import { toggleCartItem } from '@/utils/cart'
import Link from 'next/link'
import { $shoppingCart } from '@/context/cart'
import { IProductCardProps } from '@/types/elements'
import { useEffect, useState } from 'react'
import imgage from '../../../public/img/10278_shampun-dlya-ruchnoy-moyki-s- 1.svg'
import styles from '../../../styles/productCard/index.module.scss'
import { $favorites } from '@/context/favorites'
import { toggleFavoritesItem } from '@/utils/favorites'
import LikeSvgAdded from '../LikeSvgAdded/LikeSvgAdded'
import LikeSvg from '../LikeSvg/LikeSvg'
import { IReview } from '@/types/review'
import { getReviewsFx } from '@/app/api/review'
import { $mode } from '@/context/mode'
import LikeSvgDark from '../LikeSvgDark/LikeSvgDark'

const ProductCard = (prop: IProductCardProps) => {
    const user = useStore($user)
    const shoppingCart = useStore($shoppingCart)
    const favorites = useStore($favorites)
    const { shouldLoadContent } = useRedirectByUserCheck()
    let contentCartLoaded = false;
    let contentFavoritesLoaded = false;
    const [commentArray, setCommentArray] = useState<IReview[]>([])
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

    const checkInCart = (item: IProduct) =>{
        const cartItem = shoppingCart.find((cartItem) => cartItem.product_id === item.id);
        if(cartItem){
            contentCartLoaded=true 
            return true;
        }
        else{
            contentCartLoaded=true 
            return false;
        } 
      }

    const toggleToCart = (item: IProduct) => {
        return toggleCartItem(user.username, item.id, 1, checkInCart(item))
      }

    const checkInFavorites = (item: IProduct) =>{
        const cartItem = favorites.find((cartItem) => cartItem.product_id === item.id);
        if(cartItem){
            contentFavoritesLoaded=true 
            return true;
        }
        else{
            contentFavoritesLoaded=true 
            return false;
        } 
    }

    const toggleToFavorites = (item: IProduct) => {
        return toggleFavoritesItem(user.username, item.id, checkInFavorites(item))
    }

    const getAverageRating = () => {
        return (commentArray.reduce((acc, c) => acc + c.rating, 0)/commentArray.length).toFixed(1)
    }

    const getReviews = async () => {
        try {
          const data = await getReviewsFx(`/review/${Number(prop.item.id)}`)
          setCommentArray(data);
        } catch (error) {
          console.log(error)
        } 
    }

    useEffect(() => {
        getReviews()
    }, [])
    /*prop.item.img='/img/10278_shampun-dlya-ruchnoy-moyki-s- 1.svg'
    if(prop.item.id === 1)
        prop.item.img='/img/10278_shampun-dlya-ruchnoy-moyki-s- 1.svg'
    if(prop.item.id === 3)
        prop.item.img='/img/6796_5663.webp' 
    if(prop.item.id === 4)
        prop.item.img='/img/6852_1038.webp'
    if(prop.item.id === 5)
        prop.item.img='/img/8585_5600.webp'
    if(prop.item.id === 6)
        prop.item.img='/img/8027_495.webp'
    if(prop.item.id === 7)
        prop.item.img='/img/10310_shampun-dvukhfaznyy-dlya-moy.webp'
    if(prop.item.id === 8)
        prop.item.img='/img/10269_shampun-dlya-ruchnoy-moyki-av.webp'
    if(prop.item.id === 9)
        prop.item.img='/img/10334_shampun-dlya-beskontaktnoy-.webp'           
    if(prop.item.id === 10)
        prop.item.img='/img/10312_shampun-dlya-beskontaktnoy-.webp'           
    if(prop.item.id === 11)
        prop.item.img='/img/7138_5700.webp'
    if(prop.item.id === 15)
        prop.item.img='/img/10279_shampun-dlya-beskontaktnoy-.webp'  */                        
    
    return (
        <div className={`${styles.card} ${darkModeClass}`} key={prop.item.id}>
        <div>
            <div className={styles.card__img}>
                <img src={prop.item.img} alt={prop.item.name} />
                {user.username && shouldLoadContent ? 
                    <div className={checkInFavorites(prop.item) ? styles.card__favorites : styles.card__favorites} onClick={() => toggleToFavorites(prop.item)}>
                        {checkInFavorites(prop.item) ? 
                            <a>
                                <LikeSvgAdded/>
                            </a> :
                            <a>
                                {mode === 'dark' ? <LikeSvgDark/> : <LikeSvg/>}
                            </a>}
                    </div>
                    : 
                    <div className={styles.card__favorites}>
                        <Link
                            href='/'
                            passHref
                            legacyBehavior
                        >
                            <a>
                                <LikeSvg/>
                            </a>
                        </Link>
                    </div>
                }
            </div>
            <div>
            <Link
                href={`/catalog/${prop.item.id}`}
                passHref
                legacyBehavior
            >
                <a>
                    <h3 className={`${styles.card__title} ${darkModeClass}`}>
                        {prop.item.name}
                    </h3>
                </a>
            </Link> 
            <div className={styles.card__rating}>
                {getAverageRating() !== 'NaN' ? 
                <div className={styles.card__rating__block}>
                    {mode === 'dark' ? 
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 14.237L12.6224 16.8458C13.3773 17.324 14.3011 16.6172 14.1025 15.7233L13.0098 10.8174L16.6554 7.51216C17.3209 6.90932 16.9633 5.76599 16.0891 5.69324L11.2913 5.26709L9.41388 0.631427C9.07614 -0.210476 7.92386 -0.210476 7.58612 0.631427L5.7087 5.25669L0.910854 5.68284C0.0367115 5.7556 -0.320892 6.89892 0.344648 7.50177L3.99022 10.807L2.89754 15.7129C2.69887 16.6068 3.62268 17.3136 4.37762 16.8355L8.5 14.237Z" fill="white"/>
                    </svg>
                    :
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 14.237L12.6224 16.8458C13.3773 17.324 14.3011 16.6172 14.1025 15.7233L13.0098 10.8174L16.6554 7.51216C17.3209 6.90932 16.9633 5.76599 16.0891 5.69324L11.2913 5.26709L9.41388 0.631427C9.07614 -0.210476 7.92386 -0.210476 7.58612 0.631427L5.7087 5.25669L0.910854 5.68284C0.0367115 5.7556 -0.320892 6.89892 0.344648 7.50177L3.99022 10.807L2.89754 15.7129C2.69887 16.6068 3.62268 17.3136 4.37762 16.8355L8.5 14.237Z" fill="black"/>
                    </svg>}
                    <div className={darkModeClass}>
                        {getAverageRating()}
                    </div>
                </div> : 
                <div className={styles.card__rating__block}></div>}

            </div>
            <div className={`${styles.card__price} ${darkModeClass}`}>
                {formatPrice(prop.item.price)} ₽
            </div>
            <div>
            {user.username && shouldLoadContent ? 
                <button className={`${checkInCart(prop.item) ? styles.card__button_added : styles.card__button} ${darkModeClass}`} onClick={() => toggleToCart(prop.item)}>
                    {checkInCart(prop.item) ? 'В корзине' : 'В корзину'}
                </button>
                : 
                <Link
                    href='/'
                    passHref
                    legacyBehavior
                >
                    <a>
                        <button className={styles.card__button}>
                            Добавить в корзину
                        </button>
                    </a>
                </Link>
                }
            </div>
            </div>
        </div>
      </div>
    )
}

export default ProductCard