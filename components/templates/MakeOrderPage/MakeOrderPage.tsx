import { getCartItemsFx, removeAllFromCartFx, removeFromCartFx } from "@/app/api/cart";
import { getProductFx, updateProductCountFx, updateProductFx } from "@/app/api/products";
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
import styles from '../../../styles/makeOrder/index.module.scss'
import Link from "next/link";
import { $favorites } from "@/context/favorites";
import LikeSvgAdded from "@/components/elements/LikeSvgAdded/LikeSvgAdded";
import LikeSvg from "@/components/elements/LikeSvg/LikeSvg";
import { checkPaymentFx, makePaymentFx } from "@/app/api/payment";
import { createOrderFx, updateOrderStatusFx } from "@/app/api/order";
import { ICreateOrder } from "@/types/order";
import { createOrderItemFx } from "@/app/api/order-item";

const MakeOrderPage = () => {
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
    const [address, setAddress ] = useState('');
    const [paymentMethod, setPaymentMethod ] = useState('online');
    const [agree, setAgree ] = useState(false);


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
        const paymentId = sessionStorage.getItem('paymentId') //При каждой перезагрузке получаем paymentId из хранилища сеансов 

        if (paymentId) {
            checkPayment(paymentId)
        }
      }, [user])


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

    //Обнули корзину
    const resetCart = async () => {
        //console.log('user', user)
        sessionStorage.removeItem('paymentId')
        await removeAllFromCartFx(`/cart/delete-all/${user.userId}`)
        setShoppingCart([])
    }

    const addOrderItem = async (order_id: number, item: ICartItem) => {
        try {
            const orderData = await createOrderItemFx({
                url: '/order-item/create',
                order_id: order_id,
                product_id: item.product_id,
                quantity: item.count,
                price: item.count*Number(products.find((prod: IProduct) => prod.id === item.product_id)?.price)
              })

            const productData = await getProductFx(`/products/find/${item.product_id}`)

            //Обновляем количество товара
            const productCountData = await updateProductCountFx({
            url: '/products/update',
            id: item.product_id, 
            in_stock: productData.in_stock - item.count,
            })
              console.log('orderData', orderData, 'productData', productData, 'productCountData', productCountData)
        } catch (error) {
            console.log(error)
        }
    }
    
    const updateOrderStatus = async (order_id: number) => {
        try {
            const data = await updateOrderStatusFx(`/orders/status/${order_id}`)
              console.log('update order status', data)
        } catch (error) {
            console.log(error)
        }
    } 

    const onSubmit = async () => {
        try {
            let newdate = new Date()
            const data = await createOrderFx({
                url: '/orders/create',
                client_id: Number(user.userId),
                order_date: Date.now().toString(),
                address: address,
                //status: status,
                status: '0',
                payment_method: paymentMethod === 'online' ? true : false,
                departure_date: newdate.toLocaleDateString(),
                arrival_date: newdate.toLocaleDateString(),
          })
          console.log('order data', data)

          shoppingCart.map((cartItem) => { //перебираем корзину и создаем для каждого товара элемент заказа
            addOrderItem(data.id, cartItem)
          })

          sessionStorage.setItem('orderId', data.id)

          if(paymentMethod === 'online'){
            makePay()
          }

          resetCart()
          
          if(paymentMethod === 'offline'){
            router.push('/orders')
          }
        } catch (error) {
          console.log(error)
        } 
      }

    const makePay = async () => {
    try {
        const data = await makePaymentFx({
        url: '/payment',
        amount: totalPrice,
        description: `Заказ   
            ${
            //userCity.city.length
            //? `Город: ${userCity.city}, улица: ${userCity.street}`
            //: 
            ''
            }`,
        })

        sessionStorage.setItem('paymentId', data.id)
        router.push(data.confirmation.confirmation_url) //Адрес перехода к платежной системе который возвращается из data 
    } catch (error) {
        toast.error((error as Error).message)
    }
    }

    const checkPayment = async (paymentId: string) => {
    try {
        const data = await checkPaymentFx({
        url: '/payment/info',
        paymentId: paymentId
        })
        
        //console.log('checkPayment data', data)
        if (data.status === 'succeeded') {
            const orderId = sessionStorage.getItem('orderId')
            if(orderId)
                updateOrderStatus(Number(orderId))
            resetCart()
            router.push('/orders')
        return
        }

        sessionStorage.removeItem('paymentId')
    } catch (error) {
        console.log((error as Error).message)
        //resetCart()
    }
    }

    return(
        <div className={styles.make_order}>
            {shoppingCart.length ? <div className={`container ${styles.make_order__container}`}>
            <h1>Оформление заказа</h1>
                <div className={styles.make_order__row_1}>
                    <div className={styles.make_order__row_1__adress} >
                        <label>Адрес получения</label>
                        <br />
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Введите адрес получения" />
                    </div>
                    <div className={styles.make_order__row_1__payment} >
                        <div>Способ оплаты</div>
                        <div className={styles.make_order__row_1__payment__select}> 
                            <select id="paymentMethod" name="paymentMethod" onChange={e => setPaymentMethod(e.target.value)}>
                                <option value="online">Картой на сайте</option>
                                <option value="offline">При получении</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className={styles.make_order__sum}>Общая сумма заказа: <b>{formatPrice(totalPrice)} ₽</b></div>
                <div className={styles.make_order__agree} >
                    <input type="checkbox" onChange={() => setAgree(agree => !agree)} />
                    <div>Согласен с Условиями обработки персональных данных, а также с Условиями продажи</div>
                </div>
                <div  className={styles.make_order__make_order}>
                    <button 
                        onClick={onSubmit}
                        disabled={!(address !== '' && agree)} 
                        className={styles.make_order__btn}>
                            Оформить заказ
                        </button>
                </div>
                <h2>Состав заказа</h2>
                <div className={styles.make_order__main_block}>
                {shoppingCart.map((item) => {
                    let prod = products.find((prod: IProduct) => prod.id === item.product_id)
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
                </div>
            </div> 
            : 
            <div className={`container ${styles.make_order__none}`}>Корзина пуста</div>}

            </div>
      
    )
}

export default MakeOrderPage;