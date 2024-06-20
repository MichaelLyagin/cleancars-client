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
import styles from '../../../styles/orders/index.module.scss'
import Link from "next/link";
import { $favorites } from "@/context/favorites";
import LikeSvgAdded from "@/components/elements/LikeSvgAdded/LikeSvgAdded";
import LikeSvg from "@/components/elements/LikeSvg/LikeSvg";
import { checkPaymentFx, makePaymentFx } from "@/app/api/payment";
import { getOrdersFx, } from "@/app/api/order";
import { IOrder, IOrderItems } from "@/types/order";
import { getOrderItemsFx } from "@/app/api/order-item";

const OrdersPage = () => {
    const user = useStore($user)
    const [products, setProducts] = useState<IProduct[]>([])
    const [productsSorted, setProductsSorted] = useState<IProduct[]>([])
    const [ordersArray, setOrdersArray] = useState<IOrder[]>([]);
    const [orderItemsArrayState, setOrderItemsArrayState] = useState<IOrderItems[]>([]);
    const [orderItemsArrayFinal, setOrderItemsArrayFinal] = useState<IOrderItems[]>([]);
    //let orderItemsArray: IOrderItems[] = []

    const loadOrderItems = async (order: IOrder) => {
        try {
                const orderItems = await getOrderItemsFx(`/order-item/${order.id}`)
                //console.log('orderItems', orderItems)
                //setOrderItemsArray([...orderItemsArray, orderItems])
                //console.log('orderItemsArrayState.find((item) => item.id === orderItems.id)', orderItemsArrayState.find((item) => item.id === orderItems.id))
                //if(orderItemsArrayState.find((item) => item.id === orderItems.id))
                    orderItems.map((item: IOrderItems) => {
                        //console.log('orderItemsArrayState', orderItemsArrayState)
                        setOrderItemsArrayState(current => [...current, item])
                    })
            } catch (error) {
                toast.error((error as Error).message)
            }
        }

    const loadOrders = async () => {
        try {
            if(user.userId) {
            const orders = await getOrdersFx(`/orders/${user.userId}`)
            let orderarr: IOrder[] = orders
                setOrdersArray(orderarr.reverse())
                if(orders){
                    orders.map((item: IOrder)=>{
                        loadOrderItems(item)
                    })
                }
            }
            } catch (error) {
                toast.error((error as Error).message)
            }
        }

    const loadProduct = async (item: IOrderItems) => {
        try {
            const data = await getProductFx(`/products/find/${item.product_id}`)
            setProducts(current => [...current, data])
        } catch (error) {
            toast.error((error as Error).message)
        } 
    }

    useEffect(() => {
        loadOrders()
    }, [user])

    
    useEffect(() => {
        let newArray: IOrderItems[] = orderItemsArrayState.filter((obj1, i, arr) => { 
                //console.log('obj1', obj1.id, 'i', i, 'arr', arr)
                return (arr.findIndex(obj2 => (obj2.id === obj1.id)) === i)
            }
        )
        newArray.map((item) => {
            loadProduct(item)
        })
        setOrderItemsArrayFinal(newArray)
    }, [orderItemsArrayState])

    useEffect(() => {
        let newArray = products.filter((obj1, i, arr) => { 
                //console.log('obj1', obj1.id, 'i', i, 'arr', arr)
                return (arr.findIndex(obj2 => (obj2.id === obj1.id)) === i)
            }
        )
        setProductsSorted(newArray)
    }, [products])

    return(
        <div className={styles.orders}>
            {ordersArray.length ? <div className={`container ${styles.orders__container}`}>
                <h1>Заказы</h1>
                <div className={styles.orders__main_block}>
                    {ordersArray.map((order) => {
                        let sum: number = 0
                        orderItemsArrayFinal.map((orderItem) => {
                            if(orderItem.order_id === order.id){
                                sum = sum + orderItem.price*orderItem.quantity;
                            }
                        })

                        return(
                        <div className={styles.orders__order}>
                                <div className={styles.orders__order__row_1}>
                                    <div className={styles.orders__order__row_1__name}><b>Заказ № {order.id} от {order.departure_date}</b></div>
                                    <div className={styles.orders__order__row_1__left_block}>
                                        <div className={styles.orders__order__row_1__sum}>На сумму: <b>{sum} ₽</b></div>
                                        <div className={styles.orders__order__row_1__status}>{order.status === '1' ? 'Оплачен' : 'Оплата при получении'}</div>
                                    </div>
                                </div>
                                <div className={styles.orders__order__row_2}>
                                    <div><b>Состав заказа: </b></div>
                                {orderItemsArrayFinal.map((orderItem) => {
                                    if(orderItem.order_id === order.id){
                                        let prod = productsSorted.find((i) => i.id === orderItem.product_id)
                                        //console.log('prod', prod)
                                        return (
                                            <div className={styles.orders__order__row_2__prod}>
                                                <div className={styles.orders__order__row_2__prod__name}>
                                                            <Link
                                                                href={`/catalog/${prod?.id}`}
                                                                passHref
                                                                legacyBehavior
                                                            >
                                                                <a>
                                                                        {prod?.name}
                                                                </a>
                                                            </Link> 
                                                <span> x {orderItem.quantity} шт.</span></div>
                                                <div className={styles.orders__order__row_2__prod__price}>{orderItem.price * orderItem.quantity} ₽</div>
                                            </div>
                                        )
                                    }
                                })}
                                </div>
                        </div>
                        )
                    })}
                </div>
            </div> 
            : 
            <div className={`container ${styles.orders__none}`}>Список заказов пуст</div>}

            </div>
      
    )
}

export default OrdersPage;