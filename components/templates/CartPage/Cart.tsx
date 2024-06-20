import { getCartItemsFx } from "@/app/api/cart";
import { getProductFx } from "@/app/api/products";
import CartItemCounter from "@/components/elements/CartItemCounter/CartItemCounter";
import { $shoppingCart, setShoppingCart } from "@/context/cart";
import { $user } from "@/context/user";
import useRedirectByUserCheck from "@/hooks/useRedirectByUserCheck";
import { ICartItem } from "@/types/cart";
import { IProduct, IProducts } from "@/types/products";
import { removeItemFromCart, toggleCartItem } from "@/utils/cart";
import { removeItemFromFavorites, toggleFavoritesItem } from "@/utils/favorites";
import { formatPrice } from "@/utils/common";
import { useStore } from "effector-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from '../../../styles/cart/index.module.scss'
import Link from "next/link";
import { $favorites } from "@/context/favorites";
import LikeSvgAdded from "@/components/elements/LikeSvgAdded/LikeSvgAdded";
import LikeSvg from "@/components/elements/LikeSvg/LikeSvg";

const CartPage = () => {
    const [registrationStatus, setRegistrationStatus] = useState(false);
    const { shouldLoadContent } = useRedirectByUserCheck()
    const user = useStore($user)
    const router = useRouter();
    const shoppingCart = useStore($shoppingCart)
    const favorites = useStore($favorites)
    const [totalPrice, setTotalPrice] = useState(0)
    const [products, setProducts] = useState<IProduct[]>([])
    const [error, setError] = useState(false)
    const [mounted, setMounted] = useState(false) //Оптимизация, чтобы рендер не сработал до отрисовки контента в браузере
    const [changedCount, setchangedCount] = useState(false)


    let contentLoaded = false;

    const checkInCart = (item: IProduct) =>{
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

    const toggleToCart = (item: IProduct) => {
        return toggleCartItem(user.username, item.id, 1, checkInCart(item))
    }

    const checkInFavorites = (item: IProduct) =>{
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

    const toggleToFavorites = (item: IProduct) => {
        return toggleFavoritesItem(user.username, item.id, checkInFavorites(item))
    }

    useEffect(() => {
        setMounted(true)
      }, [])


    const click = () => { //Клик на счетчик
        setchangedCount((changedCount) => {
            if(changedCount === true) 
                return false
            else 
               return !changedCount
        })

        loadCartItems()
        shoppingCart.map((item) => {
            loadProduct(item)
        })
        if(products.length > 0)
        setTotalPrice(0)
        shoppingCart.map((item) => {
            setTotalPrice((prevPrice) => prevPrice + item.count*Number(products.find((prod: IProduct) => prod.id === item.product_id)?.price))
            return
        })
    }

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

    useEffect(() => {
        loadCartItems()
    }, [mounted, changedCount])

    useEffect(() => {
        shoppingCart.map((item) => {
            loadProduct(item)
        })
    }, [shoppingCart, mounted, changedCount])

    useEffect(() => {
        if(products.length > 0)
        setTotalPrice(0)
        shoppingCart.map((item) => {
            setTotalPrice((prevPrice) => prevPrice + item.count*Number(products.find((prod: IProduct) => prod.id === item.product_id)?.price))
            return
        })
    }, [products.length, mounted, shoppingCart, changedCount])

    if(mounted === true){ //Перенаправление если пользователь неавторизован
        if(!shouldLoadContent && !user.username){
            router.push('/')
            return
        } 
    }


    const loadProduct = async (item: ICartItem) => {
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
            {shoppingCart.length ? <div className={`container ${styles.cart__container}`}>
            <h1>Корзина</h1>
                <div className={styles.cart__main_block}>
                {shoppingCart.map((item) => {
                    let prod = products.find((prod: IProduct) => prod.id === item.product_id)
                    if(prod)
                        console.log('prod.img', prod.img)
                    if(prod)
                    return(
                        <div className={styles.card}> 
            <div className={styles.card__img}>
                <img src={prod.img} alt={prod.name} />
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
                    {formatPrice((prod.price)*item.count)} ₽
                </div>
                <div className={styles.card__count}>
                <CartItemCounter totalCount={Number(prod.in_stock)} 
                                        username={user.username} 
                                        product_id={item.product_id} 
                                        initialCount={item.count} 
                                        onClick={() => click()}/>
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
            {shoppingCart.length ? <div>
                {shoppingCart.map((item) => 
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
                <div className={styles.cart__sum}>Общая сумма заказа: <b>{formatPrice(totalPrice)} ₽</b></div>
                <div  className={styles.cart__make_order}>
                    <Link
                        href='/makeorder'
                        passHref
                        legacyBehavior
                    >
                        <a>
                            <button  className={styles.cart__make_order__btn}>Перейти к оформлению</button>
                        </a>
                    </Link>
                </div>
            </div> 
            : 
            <div className={`container ${styles.cart__none}`}>Корзина пуста</div>}

            </div>
      
    )
}

export default CartPage;