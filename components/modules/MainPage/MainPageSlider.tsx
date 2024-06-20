/* eslint-disable @next/next/no-img-element */
import Slider from 'react-slick'
import { useStore } from 'effector-react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Link from 'next/link'
import { useEffect } from 'react'
import { IMainPageSlider } from '@/types/main'
import { formatPrice } from '@/utils/common'
import { $shoppingCart, setShoppingCart } from '@/context/cart'
import { IProduct } from '@/types/products'
import { toggleCartItem } from '@/utils/cart'
import { $user } from '@/context/user'
import { getCartItemsFx } from '@/app/api/cart'
import { toast } from 'react-toastify'
import useRedirectByUserCheck from '@/hooks/useRedirectByUserCheck'
import SliderArrow from '@/components/elements/SliderArrow/SliderArrow'
import SliderNextArrow from '@/components/elements/SliderNextArrow/SliderNextArrow'
import SliderPrevArrow from '@/components/elements/SliderPrevArrow/SliderPrevArrow'
import ProductCard from '@/components/elements/ProductCard/ProductCard'
import { $favorites, setFavorites } from '@/context/favorites'
import { toggleFavoritesItem } from '@/utils/favorites'
import { getFavoritesItemsFx } from '@/app/api/favorites'
import { $mode } from '@/context/mode'
import styles from '@/styles/main/index.module.scss'

const MainPagedSlider = ({
  items, //Продукты
  spinner, //Спинер при загрузке
  goToPartPage,
}: IMainPageSlider) => {
    const user = useStore($user)
    const shoppingCart = useStore($shoppingCart)
    const favorites = useStore($favorites)
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''

  const settings = {
    dots: false,
    infinite: true,
    variableWidth: true,
    autoplay: false,
    speed: 500,
    arrows: true,
    slidesToScroll: 1,
    nextArrow: <SliderNextArrow modeClass={darkModeClass}/>,
    prevArrow: <SliderPrevArrow modeClass={darkModeClass}/>
  }

  const width = {
    width: 344,
  }

  const checkInCart = (item: IProduct) =>{
    const cartItem = shoppingCart.find((cartItem) => cartItem.product_id === item.id);
    if(cartItem)
        return true;
    else 
        return false; 
  }

  const toggleToCart = (item: IProduct) => {
    return toggleCartItem(user.username, item.id, 1, checkInCart(item))
  }

  const checkInFavorites = (item: IProduct) =>{
    const cartItem = favorites.find((cartItem) => cartItem.product_id === item.id);
    if(cartItem){
        return true;
    }
    else{
        return false;
    } 
}

const toggleToFavorites = (item: IProduct) => {
    return toggleFavoritesItem(user.username, item.id, checkInFavorites(item))
}
  
  const loadCartItems = async () => {
    try {
        const cartItems = await getCartItemsFx(`/cart/${user.userId}`)

        setShoppingCart(cartItems)
    } catch (error) {
        console.log((error as Error).message)
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
    }, [user])

  return (
    <Slider {...settings}>
      {spinner ? (
        <div>Загрузка...</div>
      ) : items.length ? (
        items.map((item) => (
          <ProductCard item={item}/>
        ))
      ) : (
        <span>Список товаров пуст</span>
      )}
    </Slider>
  )
}

export default MainPagedSlider