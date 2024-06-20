import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useStore } from 'effector-react'
import { ICartItemCounterProps } from '@/types/cart'
import { updateCartItemFx } from '@/app/api/cart'
import { updateCartItemCount } from '@/context/cart'
import styles from '@/styles/cartPopup/index.module.scss'
import spinnerStyles from '@/styles/spinner/index.module.scss'

const CartItemCounter = ({
  username,  
  product_id,
  totalCount, //Число продуктов на складе
  initialCount,
  onClick,
}: ICartItemCounterProps) => {


  const [spinner, setPinner] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [disableIncrease, setDisableIncrease] = useState(false)
  const [disableDecrease, setDisableDecrease] = useState(false)

  useEffect(() => {
    if (count === 1) {
      setDisableDecrease(true)
    }

    if (count === totalCount) {
      setDisableIncrease(true)
    }
  }, [count, totalCount])

  useEffect(() => {
    console.log('count', count, 'totalCount', totalCount)
    if(count > totalCount)
      updateCount()
  }, [])

  const increase = async () => {
    try {
      setPinner(true)
      setDisableDecrease(false)
      setCount(count + 1)
      onClick()

      const data = await updateCartItemFx({
        url: `/cart/count/update`,
        username: username,
        product_id: product_id,
        count: count + 1,
      })

      updateCartItemCount({ username: username, product_id: product_id, count: data.count })
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setPinner(false)
    }
  }

  const updateCount = async () => {
    try {
      const data = await updateCartItemFx({
        url: `/cart/count/update`,
        username: username,
        product_id: product_id,
        count: totalCount,
      })
      updateCartItemCount({ username: username, product_id: product_id, count: totalCount })
      setCount(totalCount)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const decrease = async () => {
    try {
      setPinner(true)
      setDisableIncrease(false)
      setCount(count - 1)
      onClick()

      const data = await updateCartItemFx({
        url: `/cart/count/update`,
        username: username,
        product_id: product_id,
        count: count - 1,
      })

      updateCartItemCount({ username: username, product_id: product_id, count: data.count })
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setPinner(false)
    }
  }

  return (
    <div>
      <button disabled={disableDecrease} onClick={decrease}>
        <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 1.998H1C0.734784 1.998 0.48043 1.89264 0.292893 1.70511C0.105357 1.51757 0 1.26322 0 0.998001C0 0.732785 0.105357 0.478431 0.292893 0.290895C0.48043 0.103358 0.734784 -0.0019989 1 -0.0019989H13C13.2652 -0.0019989 13.5196 0.103358 13.7071 0.290895C13.8946 0.478431 14 0.732785 14 0.998001C14 1.26322 13.8946 1.51757 13.7071 1.70511C13.5196 1.89264 13.2652 1.998 13 1.998Z" fill="black"/>
        </svg>
      </button>
      <span>
        {spinner ? (
          <span
            style={{ top: 4, left: 33, width: 20, height: 20}}
          />
        ) : (
          count
        )}
      </span>
      <button disabled={disableIncrease} onClick={increase}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 7.998H8V12.998C8 13.2632 7.89464 13.5176 7.70711 13.7051C7.51957 13.8926 7.26522 13.998 7 13.998C6.73478 13.998 6.48043 13.8926 6.29289 13.7051C6.10536 13.5176 6 13.2632 6 12.998V7.998H1C0.734784 7.998 0.48043 7.89264 0.292893 7.70511C0.105357 7.51757 0 7.26322 0 6.998C0 6.73278 0.105357 6.47843 0.292893 6.29089C0.48043 6.10336 0.734784 5.998 1 5.998H6V0.998001C6 0.732785 6.10536 0.47843 6.29289 0.290894C6.48043 0.103358 6.73478 -0.0019989 7 -0.0019989C7.26522 -0.0019989 7.51957 0.103358 7.70711 0.290894C7.89464 0.47843 8 0.732785 8 0.998001V5.998H13C13.2652 5.998 13.5196 6.10336 13.7071 6.29089C13.8946 6.47843 14 6.73278 14 6.998C14 7.26322 13.8946 7.51757 13.7071 7.70511C13.5196 7.89264 13.2652 7.998 13 7.998Z" fill="black"/>
        </svg>
      </button>
    </div>
  )
}

export default CartItemCounter