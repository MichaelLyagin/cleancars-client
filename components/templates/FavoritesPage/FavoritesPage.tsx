import { getFavoritesItemsFx } from "@/app/api/favorites";
import { getCartItemsFx } from "@/app/api/cart";
import { getProductFx } from "@/app/api/products";
import { $favorites, setFavorites } from "@/context/favorites";
import { $user } from "@/context/user";
import useRedirectByUserCheck from "@/hooks/useRedirectByUserCheck";
import { IFavoritesItem } from "@/types/favorites";
import { IProduct, IProducts } from "@/types/products";
import { toggleFavoritesItem } from "@/utils/favorites";
import { toggleCartItem } from "@/utils/cart";
import { formatPrice } from "@/utils/common";
import { useStore } from "effector-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from '../../../styles/cart/index.module.scss'
import Link from "next/link";
import { $shoppingCart, setShoppingCart } from "@/context/cart";
import LikeSvg from "@/components/elements/LikeSvg/LikeSvg";
import LikeSvgAdded from "@/components/elements/LikeSvgAdded/LikeSvgAdded";

const FavoritesPage = () => {
    const [registrationStatus, setRegistrationStatus] = useState(false);
    const { shouldLoadContent } = useRedirectByUserCheck()
    const user = useStore($user)
    const router = useRouter();
    const favorites = useStore($favorites)
    const shoppingCart = useStore($shoppingCart)
    const [products, setProducts] = useState<IProduct[]>([])
    const [error, setError] = useState(false)
    const [mounted, setMounted] = useState(false) //Оптимизация, чтобы рендер не сработал до отрисовки контента в браузере
    const [changedCount, setchangedCount] = useState(false)


    let contentLoaded = false;

    const checkInCart = (item: IProduct | undefined) =>{
        if(item){
            const cartItem = shoppingCart.find((cartItem) => cartItem.product_id === item.id);
            if(cartItem){
                contentLoaded=true 
                return true;
            }
            else{
                contentLoaded=true 
                return false;
            } 
        }
        return false
    }

    const toggleToCart = (item: IProduct | undefined) => {
        if(item)
            return toggleCartItem(user.username, item.id, 1, checkInCart(item))
    }

    const checkInFavorites = (item: IProduct | undefined) =>{
        if(item){
            const cartItem = favorites.find((cartItem) => cartItem.product_id === item.id);
            if(cartItem){
                contentLoaded=true 
                return true;
            }
            else{
                contentLoaded=true 
                return false;
            } 
        }
        return false
    }

    const toggleToFavorites = (item: IProduct | undefined) => {
        if(item)
            return toggleFavoritesItem(user.username, item.id, checkInFavorites(item))
    }

    useEffect(() => {
        setMounted(true)
      }, [])


    const loadCartItems = async () => {
        try {
            if(user.userId) {
            const cartItems = await getCartItemsFx(`/cart/${user.userId}`)
    
            setShoppingCart(cartItems)
            }
            } catch (error) {
                toast.error((error as Error).message)
            }
    }

    const loadFavoritesItems = async () => {
        try {
            if(user.userId) {
            const favoritesItems = await getFavoritesItemsFx(`/favorites/${user.userId}`)
    
            setFavorites(favoritesItems)
            }
            } catch (error) {
                toast.error((error as Error).message)
            }
    }

    useEffect(() => {
        loadCartItems()
        loadFavoritesItems()
    }, [mounted, changedCount])

    useEffect(() => {
        favorites.map((item) => {
            loadProduct(item)
        })
    }, [favorites, mounted, changedCount])

    /*
    useEffect(() => {
        if(products.length > 0)
        favorites.map((item) => {
            setTotalPrice((prevPrice) => prevPrice + item.count*Number(products.find((prod: IProduct) => prod.id === item.product_id)?.price))
            return
        })
    }, [products.length, mounted, favorites, changedCount])*/

    if(mounted === true){ //Перенаправление если пользователь неавторизован
        if(!shouldLoadContent && !user.username){
            router.push('/')
            return
        } 
    }


    const loadProduct = async (item: IFavoritesItem) => {
        try {
          const data = await getProductFx(`/products/find/${item.product_id}`)
    
          if (!data) {
            setError(true)
            return
          }
    
          setProducts((prev) => {
            if (prev.find((prod: IProduct) => prod.id === data.id)){
                return [...prev] 

            }else{
                return [...prev, data] 
            }
          })
        } catch (error) {
          //toast.error((error as Error).message)
        }
      }

    return(
        <div className={styles.cart}>
            {favorites.length ? <div className={`container ${styles.cart__container}`}>
            <h1>Избранное</h1>
                <div className={styles.cart__main_block}>
                {favorites.map((item) => {
                    let prod = products.find((prod: IProduct) => prod.id === item.product_id)
                    if(prod)
                    return(
                        <div className={styles.card}> 
                            <div className={styles.card__img}>
                                <img src={'/img/10278_shampun-dlya-ruchnoy-moyki-s- 1.svg'} alt={prod.name} />
                                {user.username && shouldLoadContent ? 
                                <div className={styles.card__favorites} onClick={() => toggleToFavorites(prod)}>
                                    {checkInFavorites(prod) ? 
                                        <a>
                                            <LikeSvgAdded/>
                                        </a> :
                                        <a>
                                            <LikeSvg/>
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
                                href={`/catalog/${prod.id}`}
                                passHref
                                legacyBehavior
                            >
                                <a>
                                    <h3 className={styles.card__title}>
                                        {prod.name}
                                    </h3>
                                </a>
                            </Link> 
                            <div className={styles.card__middle_line} >
                                <div className={styles.card__price}>
                                    {formatPrice((prod.price))} ₽
                                </div>
                            </div>
                            <div>
                            {user.username && shouldLoadContent ? 
                                <button className={checkInCart(prod) ? styles.card__button_added : styles.card__button} onClick={() => toggleToCart(prod)}>
                                    {checkInCart(prod) ? 'Убрать из корзины' : 'В корзину'}
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
        )})}

            {/*
            {favorites.length ? <div>
                {favorites.map((item) => 
                <div key={item.id} style={{margin: '15px',  backgroundColor: '#F5F5F5'}}>
                    <img src={products.find((prod: IProduct) => prod.id === item.product_id)?.img} />
                    <div>{products.find((prod: IProduct) => prod.id === item.product_id)?.name}</div>
                    <div>{formatPrice((Number(products.find((prod: IProduct) => prod.id === item.product_id)?.price))*item.count)} ₽</div>
                    <CartItemCounter totalCount={Number(products.find((prod: IProduct) => prod.id === item.product_id)?.in_stock)} 
                                     username={user.username} 
                                     product_id={item.product_id} 
                                     initialCount={item.count} 
                                     onClick={() => click()}/>
                    <div>Количество - {item.count}</div>
                    <div onClick={() => deleteCartItem(item)} style={{cursor: 'pointer'}}>Удалить из корзины</div>
                </div>)}
                */}
                </div>
            </div> 
            : 
            <div className={`container ${styles.cart__none}`}>Нет товаров в избранном</div>}

            </div>
      
    )
}

export default FavoritesPage;