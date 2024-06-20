import { $product } from '@/context/product'
import styles from '../../../styles/productPage/index.module.scss'
import { useStore } from 'effector-react'
import LikeSvg from '@/components/elements/LikeSvg/LikeSvg'
import AvailabilitySvg from '@/components/elements/AvailabilitySvg/AvailabilitySvg'
import { $user } from '@/context/user'
import { $shoppingCart, setShoppingCart } from '@/context/cart'
import CartItemCounter from '@/components/elements/CartItemCounter/CartItemCounter'
import { getCartItemsFx } from '@/app/api/cart'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { IProduct } from '@/types/products'
import { toggleCartItem } from '@/utils/cart'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import { $favorites } from '@/context/favorites'
import { toggleFavoritesItem } from '@/utils/favorites'
import LikeSvgAdded from '@/components/elements/LikeSvgAdded/LikeSvgAdded'
import { createReviewFx, deleteReviewFx, getReviewsFx } from '@/app/api/review'
import { IReview } from '@/types/review'
import { deleteProductFx } from '@/app/api/products'
import { useRouter } from 'next/router'
import InputsProductInfo from '@/components/elements/InputsProductInfo/InputsProductInfo'
import { getOrdersFx } from '@/app/api/order'
import { IOrder } from '@/types/order'
import { checkOrderItemFx } from '@/app/api/order-item'
import { IUser, IUserFind } from '@/types/auth'
import { findUserByIdFx } from '@/app/api/auth'

const ProductPage = () => {
    const product = useStore($product)
    const user = useStore($user)
    const shoppingCart = useStore($shoppingCart)
    const favorites = useStore($favorites)
    const prodInCart = shoppingCart.find((item) => item.product_id === product.id )
    const [changedCount, setchangedCount] = useState(false)
    const [mounted, setMounted] = useState(false) //Оптимизация, чтобы рендер не сработал до отрисовки контента в браузере
    let contentLoaded = false;
    const { shouldLoadContent } = useRedirectByUserCheck()
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating ] = useState(0);
    const [commentArray, setCommentArray] = useState<IReview[]>([])
    const router = useRouter();
    const [visionModal, setVisionModal] = useState(false);
    const [ordersArray, setOrdersArray] = useState<IOrder[]>([]);
    const [clientsArray, setClientsArray] = useState<IUserFind[]>([]);
    const [checkProd, setCheckProd] = useState(false);
    let ratingArray: number[] = [1, 2, 3, 4, 5];

    useEffect(() => {
        setMounted(true)
      }, [])

    useEffect(() => {
        getReviews()
    }, [product])

    const loadOrders = async () => {
        try {
            if(user.userId) {
            const orders = await getOrdersFx(`/orders/${user.userId}`)
                setOrdersArray(orders)
                }
            } catch (error) {
                toast.error((error as Error).message)
            }
        }

    useEffect(() => {
        ordersArray.map((item) => {
            checkProduct(item.id)
        })
    }, [ordersArray])

    //console.log('checkProd', checkProd, 'ordersArray', ordersArray)

    const checkProduct = async (order_id: number) => {
        try {
            const data = await checkOrderItemFx({
            url: '/order-item/check',
            order_id: order_id,
            product_id: product.id 
            })
            if(data.length){
                setCheckProd(true)
            }
            //console.log('data', data)
        } catch (error) {
            console.log(error)
        } 
    }

    useEffect(() => {
        loadOrders()
    }, [user])

    const click = () => { //Клик на счетчик
        setchangedCount((changedCount) => {
            if(changedCount === true) 
                return false
            else 
               return !changedCount
        })
        loadCartItems()
    }

    const loadCartItems = async () => {
        if(user && shouldLoadContent){
            try {
                (user.userId)
                const cartItems = await getCartItemsFx(`/cart/${user.userId}`)
        
                    setShoppingCart(cartItems)
                } catch (error) {
                    toast.error((error as Error).message)
                }
        }
    }

    useEffect(() => {
        loadCartItems()
    }, [mounted, changedCount])

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

    const getAverageRating = () => {
        return (commentArray.reduce((acc, c) => acc + c.rating, 0)/commentArray.length).toFixed(1)
    }

    const onSubmit = async () => {
        try {
          const data = await createReviewFx({
            url: '/review/create',
            product_id: Number(product.id),
            client_id: Number(user.userId),
            date: Date.now().toLocaleString(),
            rating: newRating,
            comment: newComment
          })
          getReviews()
        } catch (error) {
          console.log(error)
        } 
    }

    const getReviews = async () => {
        try {
          const data = await getReviewsFx(`/review/${Number(product.id)}`)
          setCommentArray(data);
        } catch (error) {
          console.log(error)
        } 
    }

    const deleteReview = async (id: number) => {
        try {
          const data = await deleteReviewFx(`/review/delete/${id}`)
        } catch (error) {
          console.log(error)
        } 
        getReviews()
    }

    const deleteProduct = async () => {
        try {
          const data = await deleteProductFx(`/products/delete/${product.id}`)
          router.push('/')
        } catch (error) {
          console.log(error)
        } 
    }


    useEffect(()=>{
        commentArray.map((item: IReview)=>{
            findUserById(item.client_id)
        })

    },[commentArray])

    const findUserById = async (id: number) => {
        try {
          const data = await findUserByIdFx(`/users/findbyid/${id}`)
          setClientsArray(current => [...current, data])
        } catch (error) {
          console.log(error)
        } 
    }

    return (
        <div className={styles.product}>
            <div className={`container ${styles.product__container}`}>
                <div className={styles.product__articul} >
                    <div>
                        Артикул {product.vendor_code}
                    </div>  
                    <div className={styles.catalog__info}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C10.9993 5.71733 10.9033 5.48 10.712 5.288C10.5207 5.096 10.2833 5 10 5C9.71667 5 9.47933 5.096 9.288 5.288C9.09667 5.48 9.00067 5.71733 9 6C8.99933 6.28267 9.09533 6.52033 9.288 6.713C9.48067 6.90567 9.718 7.00133 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88334 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667932 11.3827 1.26582e-06 10C-0.000665401 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88267 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 10 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88267 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 10C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#3CA444"/>
                        </svg>
                    </div>
                </div>
                {user.role ? 
                <div className={styles.product__admin}>
                    <div onClick={() => setVisionModal(true)}>
                        Редактировать продукт
                    </div>
                </div> : null}
                {user.role ? 
                    <div className={styles.product__admin}>
                        <div onClick={deleteProduct}>
                            Удалить продукт
                        </div>
                    </div> : null}
                <div className={styles.product__main_part}>
                <div className={styles.product__image} >
                    <img src={product.img} />
                    {user.username && shouldLoadContent ? 
                    <div className={styles.card__favorites} onClick={() => toggleToFavorites(product)}>
                        {checkInFavorites(product) ? 
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
                <div className={styles.product__info}>
                    <div className={styles.product__info__name}>
                        <b>{product.name}</b>
                    </div>
                    <div className={styles.product__info__bottom}>
                        <div className={styles.product__info__bottom__characteristics}>
                            <div className={styles.product__info__bottom__characteristics__row_1}>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 14.237L12.6224 16.8458C13.3773 17.324 14.3011 16.6172 14.1025 15.7233L13.0098 10.8174L16.6554 7.51216C17.3209 6.90932 16.9633 5.76599 16.0891 5.69324L11.2913 5.26709L9.41388 0.631427C9.07614 -0.210476 7.92386 -0.210476 7.58612 0.631427L5.7087 5.25669L0.910854 5.68284C0.0367115 5.7556 -0.320892 6.89892 0.344648 7.50177L3.99022 10.807L2.89754 15.7129C2.69887 16.6068 3.62268 17.3136 4.37762 16.8355L8.5 14.237Z" fill="black"/>
                                </svg>
                                {getAverageRating() !== 'NaN' ? getAverageRating() : 'Нет отзывов'}
                            </div>
                            <div  className={styles.product__info__bottom__characteristics__row_2}>
                                <div className={styles.product__info__bottom__characteristics__row_2__name}>
                                    <div>Объем:</div>
                                    <div>Производитель:</div>
                                </div>
                                <div className={styles.product__info__bottom__characteristics__row_2__value}>
                                    <div>{product.volume/1000} л</div>
                                    <div>{product.brand}</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.product__info__bottom__card}>
                            <div className={styles.product__info__bottom__card__price}>
                                {product.price} ₽/шт.
                            </div>
                            <div className={styles.product__info__bottom__card__middle_line}>
                                <div className={styles.product__info__bottom__card__middle_line__availability}>
                                    {product.in_stock > 0 ? 
                                        <div>
                                            <AvailabilitySvg />
                                            В наличии
                                        </div> 
                                        : 
                                        <div>Нет в наличии</div>
                                    }
                                </div>
                                <div className={styles.product__info__bottom__card__middle_line__count}>
                                    {prodInCart && user ? 
                                        <CartItemCounter totalCount={product.in_stock} 
                                            username={user.username} 
                                            product_id={product.id} 
                                            initialCount={prodInCart.count} 
                                            onClick={() => click()}/>
                                    : null}
                                </div>
                            </div>
                            <div>
                            {user.username && shouldLoadContent ? 
                                <button className={checkInCart(product) ? styles.product__info__bottom__card__button_added : styles.product__info__bottom__card__button} onClick={() => toggleToCart(product)}>
                                    {checkInCart(product) ? 'В корзине' : 'В корзину'}
                                </button>
                                : 
                                <Link
                                    href='/'
                                    passHref
                                    legacyBehavior
                                >
                                    <a>
                                        <button className={styles.product__info__bottom__card__button}>
                                            Добавить в корзину
                                        </button>
                                    </a>
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                {visionModal ? 
                    <div className={styles.product__modal}>
                        <div className={styles.product__modal__window}>
                            <div className={styles.product__modal__window__close_div}>
                                <svg onClick={() => setVisionModal(false)} className={styles.product__modal__close} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 7.998H8V12.998C8 13.2632 7.89464 13.5176 7.70711 13.7051C7.51957 13.8926 7.26522 13.998 7 13.998C6.73478 13.998 6.48043 13.8926 6.29289 13.7051C6.10536 13.5176 6 13.2632 6 12.998V7.998H1C0.734784 7.998 0.48043 7.89264 0.292893 7.70511C0.105357 7.51757 0 7.26322 0 6.998C0 6.73278 0.105357 6.47843 0.292893 6.29089C0.48043 6.10336 0.734784 5.998 1 5.998H6V0.998001C6 0.732785 6.10536 0.47843 6.29289 0.290894C6.48043 0.103358 6.73478 -0.0019989 7 -0.0019989C7.26522 -0.0019989 7.51957 0.103358 7.70711 0.290894C7.89464 0.47843 8 0.732785 8 0.998001V5.998H13C13.2652 5.998 13.5196 6.10336 13.7071 6.29089C13.8946 6.47843 14 6.73278 14 6.998C14 7.26322 13.8946 7.51757 13.7071 7.70511C13.5196 7.89264 13.2652 7.998 13 7.998Z" fill="black"/>
                                </svg>
                            </div>
                            <div className={styles.product__modal__window__inputs}>
                                <InputsProductInfo inputType={'update'} product={product} />
                            </div>
                        </div>
                    </div> 
                : null}
                <div className={styles.product__description}>
                    <h2>
                        Описание
                    </h2>
                    <div className={styles.product__description__text}>
                        {product.despription}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed aliquam risus. Donec et erat elit. Ut a metus id sapien malesuada gravida sit amet vel mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum accumsan nisi sed vestibulum rhoncus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse luctus faucibus turpis eu aliquam. Donec vitae luctus risus. Aliquam quis commodo neque, gravida tincidunt velit. Nam bibendum interdum nibh ut maximus. Etiam eget turpis lorem. Suspendisse finibus tortor ut pulvinar gravida. Maecenas turpis quam, hendrerit eget auctor nec, volutpat in velit. Sed vel neque vulputate, scelerisque dui id, finibus tortor.
                        Vivamus eleifend neque neque, vitae iaculis nisi convallis vel. Suspendisse in metus odio. Aenean vel purus vel nibh maximus finibus. Nulla id ipsum urna. Etiam tincidunt tempus dui, ac suscipit libero pretium a. Etiam porttitor dolor sit amet pulvinar semper. Aenean sed risus ac risus sodales pretium.
                        Cras in nulla ut eros congue hendrerit. Nulla at tincidunt mauris, non imperdiet libero. Proin id libero iaculis, rhoncus dolor sed, aliquet odio. Duis dictum elementum facilisis. Nam fringilla erat vehicula, blandit mauris quis, cursus tortor. Duis eu euismod diam, non cursus quam. Morbi laoreet elit congue nisl suscipit, quis elementum velit efficitur. Praesent dolor ligula, iaculis ut blandit sit amet, tincidunt eget est. Sed semper a felis in tempus. Maecenas sed enim enim. Cras a suscipit arcu, a commodo dolor. Nullam a pellentesque massa. Donec interdum ligula convallis felis ornare, ut viverra enim congue. Cras at justo iaculis erat vulputate pharetra a ut elit. Duis vel nibh auctor, luctus nisl non, tristique ex. Nulla condimentum ullamcorper quam eu congue.
                    </div>
                </div>
                <div className={styles.product__reviews}>
                    <h2>Отзывы {commentArray.length}</h2>
                    {checkProd || user.role ? <div className={styles.product__reviews__block}>
                        <div className={styles.product__reviews__input_block}>
                            <div>Оставьте отзыв</div>
                            <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Как вам этот товар?" />
                        </div>
                        <div className={styles.product__reviews__make_rating}>
                            <div className={styles.product__reviews__make_rating__text}>Оцените товар
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 14.237L12.6224 16.8458C13.3773 17.324 14.3011 16.6172 14.1025 15.7233L13.0098 10.8174L16.6554 7.51216C17.3209 6.90932 16.9633 5.76599 16.0891 5.69324L11.2913 5.26709L9.41388 0.631427C9.07614 -0.210476 7.92386 -0.210476 7.58612 0.631427L5.7087 5.25669L0.910854 5.68284C0.0367115 5.7556 -0.320892 6.89892 0.344648 7.50177L3.99022 10.807L2.89754 15.7129C2.69887 16.6068 3.62268 17.3136 4.37762 16.8355L8.5 14.237Z" fill="black"/>
                                </svg>
                            </div>
                            <div className={styles.product__reviews__make_rating__select}>
                                <select id="rating" name="rating" onChange={e => setNewRating(Number(e.target.value))}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                        </div>
                        <div  className={styles.product__reviews__make_review}>
                            <button 
                                onClick={onSubmit}
                                disabled={!(newComment !== '' && newRating)} 
                                className={styles.product__reviews__make_review__btn}>
                                    Отправить
                            </button>
                        </div>
                    </div> : null}
                    <div className={styles.product__reviews__main_block}>
                        {commentArray.map((item: IReview) => {
                            let date = Date.parse(item.createdAt)
                            let date2 = new Date(date);
                            let currentUser = clientsArray.find((i) => i.id === item.client_id)

                            return(
                                <div className={styles.product__reviews__review}>
                                    <div className={styles.product__reviews__review__row_1}>
                                        <svg width="41" height="39" viewBox="0 0 41 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20.5171 24.9586C19.5585 24.957 18.6038 25.0768 17.678 25.3151L17.6773 25.3153C16.7615 25.5537 15.9246 25.8729 15.1278 26.3134L15.1278 26.3133L15.1228 26.3163C14.3732 26.7536 13.6232 27.3077 12.9959 27.9062C12.3235 28.5087 11.7782 29.1904 11.3183 29.9487C10.8452 30.7256 10.4792 31.558 10.2296 32.4252L10.2296 32.4251L10.228 32.431L10.2226 32.4517C10.1434 32.7542 10.0601 33.0723 10.0178 33.3954L9.99765 33.549L10.1263 33.6354C13.0656 35.6094 16.6265 36.7954 20.5178 36.7954H20.5181C24.2517 36.7898 27.8939 35.687 30.9501 33.6354L31.0825 33.5465L31.0577 33.389C30.9323 32.5932 30.7231 31.8336 30.4296 31.113L30.4297 31.113L30.4269 31.1066C29.8829 29.8705 29.1287 28.7901 28.1651 27.8699L28.1651 27.8699L28.1614 27.8665C26.1055 25.9818 23.3626 24.9396 20.5171 24.9586ZM20.5171 24.9586C20.5175 24.9586 20.5179 24.9586 20.5182 24.9586L20.5178 25.2086M20.5171 24.9586C20.5168 24.9586 20.5164 24.9586 20.5161 24.9586L20.5178 25.2086M20.5178 25.2086C19.5799 25.2069 18.6459 25.3241 17.7403 25.5572L27.9924 28.0508C25.9839 26.2096 23.302 25.1898 20.5178 25.2086ZM26.9935 18.6114C27.3786 17.7965 27.5481 16.9405 27.5481 16.0119C27.5481 15.1252 27.3788 14.2299 26.9932 13.4118L26.9931 13.4115C26.6136 12.6089 26.1062 11.8811 25.4693 11.273L25.4689 11.2726C24.8323 10.6673 24.0713 10.1838 23.2305 9.82256C22.3782 9.45632 21.4861 9.29525 20.5178 9.29525C19.591 9.29525 18.658 9.45605 17.805 9.82256C16.9646 10.1837 16.2033 10.6647 15.5662 11.273C14.9295 11.881 14.4219 12.6063 14.0423 13.4118C13.657 14.2294 13.4877 15.1242 13.4875 16.0105C13.4774 16.9043 13.6657 17.7897 14.0395 18.6083C14.3781 19.4138 14.884 20.1418 15.5255 20.7535L15.5269 20.7547C16.1756 21.364 16.9344 21.8552 17.766 22.2046L17.766 22.2046L17.7715 22.2068C19.5181 22.8921 21.4766 22.8921 23.2232 22.2068L23.2232 22.2069L23.2287 22.2046C24.0603 21.8552 24.8191 21.364 25.4678 20.7547L25.4678 20.7547L25.4706 20.7521C26.1095 20.1331 26.6257 19.4078 26.9935 18.6114ZM26.9935 18.6114C26.9934 18.6117 26.9932 18.612 26.9931 18.6124L26.7671 18.5055M26.9935 18.6114C26.9937 18.611 26.9939 18.6107 26.994 18.6103L26.7671 18.5055M26.7671 18.5055C26.4123 19.274 25.914 19.9744 25.2966 20.5725M26.7671 18.5055C27.1347 17.7279 27.2981 16.9089 27.2981 16.0119C27.2981 15.1564 27.1347 14.2984 26.7671 13.5184C26.3995 12.7408 25.9093 12.0388 25.2966 11.4538C24.684 10.8713 23.9488 10.4032 23.1319 10.0522C22.3149 9.70125 21.4572 9.54525 20.5178 9.54525C19.6192 9.54525 18.7206 9.70125 17.9037 10.0522C17.0868 10.4032 16.3516 10.8688 15.7389 11.4538C15.1262 12.0388 14.6361 12.7384 14.2685 13.5184C13.9009 14.2984 13.7375 15.1564 13.7375 16.0119L25.2966 20.5725M25.2966 20.5725C24.67 21.1611 23.9365 21.636 23.1319 21.9741C21.444 22.6364 19.5507 22.6364 17.8628 21.9741L25.2966 20.5725ZM7.49111 34.138L7.4902 34.1371L7.48242 34.1308C3.12445 30.591 0.345215 25.3219 0.345215 19.4805C0.345215 8.87532 9.37132 0.25 20.5178 0.25C31.6642 0.25 40.6903 8.87532 40.6903 19.4805C40.6903 25.3221 37.9109 30.59 33.6319 34.1722L33.5424 34.2471V34.2554C33.3674 34.3849 33.1827 34.5149 32.9953 34.6465L32.9685 34.6652C32.7874 34.7924 32.604 34.9211 32.4292 35.0495C32.3219 35.1133 32.226 35.1842 32.1412 35.2469L32.1325 35.2533C32.0394 35.3222 31.9586 35.3813 31.871 35.4315L31.8708 35.4312L31.8594 35.4386C28.5255 37.5969 24.5888 38.7509 20.5587 38.75H20.5586C16.5318 38.7509 12.5983 37.5988 9.26613 35.4439C9.21849 35.4073 9.16937 35.3676 9.11871 35.3266C8.98448 35.218 8.83939 35.1006 8.68223 35.0094C8.30122 34.7545 7.95564 34.4992 7.60714 34.2405C7.60519 34.2376 7.60317 34.2347 7.60109 34.2319C7.5684 34.1873 7.52977 34.1623 7.51521 34.153C7.50133 34.1441 7.49424 34.1398 7.49111 34.138ZM32.9706 31.4456V32.0268L33.3935 31.6219C36.7583 28.4006 38.6525 24.0356 38.6579 19.4808V19.4805C38.6579 9.94219 30.4883 2.16556 20.5178 2.16556C10.5473 2.16556 2.37761 9.94219 2.37761 19.4805C2.37761 24.2299 4.41142 28.5001 7.68208 31.6601L8.10578 32.0695V31.4803C8.10578 31.4439 8.10795 31.4207 8.1181 31.4013L8.12806 31.3823L8.13463 31.3618C8.51937 30.1652 9.09915 29.0335 9.85296 28.0082C10.6148 27.0132 11.5369 26.0971 12.5784 25.3321L12.5791 25.3316C13.3821 24.7376 14.2565 24.2366 15.1838 23.8394L15.6303 23.6482L15.2152 23.396C14.7802 23.1317 14.3863 22.8329 14.0327 22.4953C13.4262 21.9162 12.8741 21.3112 12.4831 20.6393L12.4833 20.6392L12.4774 20.63C12.0423 19.9524 11.7247 19.2333 11.4854 18.4338L11.4855 18.4338L11.4844 18.4304C11.2474 17.6784 11.1283 16.8848 11.1283 16.0509L11.1283 16.0484C11.116 14.8546 11.3589 13.6706 11.8422 12.5688C12.3105 11.5101 12.9848 10.545 13.8299 9.72464L13.8306 9.72392C14.6774 8.89524 15.6912 8.23759 16.8117 7.79092L16.8119 7.79085C17.9711 7.32782 19.2174 7.09494 20.4746 7.10668V7.10672L20.4794 7.10668C21.7363 7.09418 22.9824 7.3262 24.1417 7.78831C25.2539 8.23654 26.2666 8.88133 27.1266 9.68821C27.9873 10.5032 28.675 11.4682 29.1527 12.5303C29.6359 13.632 29.8786 14.8158 29.8664 16.0094H29.8663L29.8664 16.0155C29.8896 17.6269 29.4366 19.2126 28.5582 20.5909C28.1201 21.269 27.5984 21.8949 27.004 22.4551L27.004 22.4551L27.0008 22.4583C26.6547 22.7964 26.2715 23.0984 25.8578 23.3591L25.4507 23.6155L25.8945 23.8012C26.8193 24.1883 27.6936 24.6764 28.5001 25.2557L28.5001 25.2557C29.5547 26.013 30.4734 26.9282 31.2206 27.9653L31.221 27.9659C31.9622 28.9881 32.5389 30.11 32.9322 31.2941C32.9383 31.3527 32.9541 31.3977 32.9627 31.4222L32.9641 31.4262C32.9678 31.4368 32.9697 31.4427 32.9706 31.4456Z" fill="black" stroke="black" stroke-width="0.5"/>
                                        </svg>
                                        <div className={styles.product__reviews__review__row_1__info}>
                                            <div className={styles.product__reviews__review__row_1__info__name}>
                                                <div className={styles.product__reviews__review__row_1__username}>{currentUser?.username}</div>
                                                <div className={styles.product__reviews__review__row_1__date}>{date2.toLocaleDateString()}</div>
                                            </div>
                                            <div className={styles.product__reviews__review__row_1__rating}>
                                                {ratingArray.map((rait) => {
                                                    if(rait <= Number(item.rating)){
                                                        return (
                                                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M16.2531 7.07544L12.9394 9.80568L13.949 13.8887C14.0047 14.1104 13.9903 14.3428 13.9077 14.5567C13.8251 14.7706 13.678 14.9563 13.485 15.0903C13.2919 15.2244 13.0616 15.3009 12.823 15.31C12.5845 15.3191 12.3485 15.2606 12.1448 15.1417L8.42603 12.9564L4.70505 15.1417C4.50138 15.2599 4.26565 15.3179 4.02752 15.3084C3.7894 15.2989 3.55954 15.2224 3.36688 15.0884C3.17422 14.9545 3.02739 14.7691 2.94486 14.5556C2.86233 14.3421 2.8478 14.1101 2.9031 13.8887L3.91637 9.80568L0.602618 7.07544C0.422422 6.92674 0.2921 6.73064 0.22793 6.51164C0.163759 6.29264 0.168582 6.06044 0.241798 5.84404C0.315013 5.62764 0.453376 5.43663 0.639606 5.29487C0.825836 5.1531 1.05168 5.06687 1.28893 5.04693L5.63363 4.71224L7.30966 0.839429C7.40038 0.628363 7.55478 0.447822 7.75324 0.32076C7.9517 0.193698 8.18524 0.125854 8.42418 0.125854C8.66313 0.125854 8.89667 0.193698 9.09513 0.32076C9.29359 0.447822 9.44799 0.628363 9.53871 0.839429L11.214 4.71224L15.5587 5.04693C15.7964 5.06613 16.0229 5.15188 16.2098 5.29345C16.3967 5.43502 16.5357 5.6261 16.6094 5.84276C16.6831 6.05943 16.6882 6.29203 16.624 6.51143C16.5598 6.73083 16.4293 6.92728 16.2487 7.07615L16.2531 7.07544Z" fill="#3CA444"/>
                                                            </svg>
                                                        )
                                                    } else {
                                                        return (
                                                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M16.2531 7.07544L12.9394 9.80568L13.949 13.8887C14.0047 14.1104 13.9903 14.3428 13.9077 14.5567C13.8251 14.7706 13.678 14.9563 13.485 15.0903C13.2919 15.2244 13.0616 15.3009 12.823 15.31C12.5845 15.3191 12.3485 15.2606 12.1448 15.1417L8.42603 12.9564L4.70505 15.1417C4.50138 15.2599 4.26565 15.3179 4.02752 15.3084C3.7894 15.2989 3.55954 15.2224 3.36688 15.0884C3.17422 14.9545 3.02739 14.7691 2.94486 14.5556C2.86233 14.3421 2.8478 14.1101 2.9031 13.8887L3.91637 9.80568L0.602618 7.07544C0.422422 6.92674 0.2921 6.73064 0.22793 6.51164C0.163759 6.29264 0.168582 6.06044 0.241798 5.84404C0.315013 5.62764 0.453376 5.43663 0.639606 5.29487C0.825836 5.1531 1.05168 5.06687 1.28893 5.04693L5.63363 4.71224L7.30966 0.839429C7.40038 0.628363 7.55478 0.447822 7.75324 0.32076C7.9517 0.193698 8.18524 0.125854 8.42418 0.125854C8.66313 0.125854 8.89667 0.193698 9.09513 0.32076C9.29359 0.447822 9.44799 0.628363 9.53871 0.839429L11.214 4.71224L15.5587 5.04693C15.7964 5.06613 16.0229 5.15188 16.2098 5.29345C16.3967 5.43502 16.5357 5.6261 16.6094 5.84276C16.6831 6.05943 16.6882 6.29203 16.624 6.51143C16.5598 6.73083 16.4293 6.92728 16.2487 7.07615L16.2531 7.07544Z" fill="#808080" fill-opacity="0.3"/>
                                                            </svg>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.product__reviews__review__text}>
                                        {item.comment}
                                    </div>
                                    <div className={styles.product__reviews__review__delete}>
                                        {user.role ? <div onClick={() => deleteReview(item.id)}>Удалить</div> : null}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )    
}

export default ProductPage