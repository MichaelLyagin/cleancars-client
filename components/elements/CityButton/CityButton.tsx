import LocationSvg from "../LocationSvg/LocationSvg"
import styles from "../../../styles/cityButton/index.module.scss"
import { $userCity, setUserCity } from '@/context/user'
import { useStore } from "effector-react"
import { getGeolocationFx } from '../../../app/api/geolocation'
import { toast } from "react-toastify"
import { useEffect } from "react"

const CityButton = () => {
    const { city } = useStore($userCity)

    const getCity = () => {
        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
        const success = async (pos: GeolocationPosition) => {
          try {
            const { latitude, longitude } = pos.coords
            //Долгота и ширина
            const { data } = await getGeolocationFx({ latitude, longitude })
    
            setUserCity({
              city: data.features[0].properties.city,
              street: data.features[0].properties.address_line1,
            })
          } catch (error) {
            toast.error((error as Error).message)
          }
        }
    
        const error = (error: GeolocationPositionError) =>
          toast.error(`${error.code} ${error.message}`)
    
        navigator.geolocation.getCurrentPosition(success, error, options)
      }

    useEffect(()=>{
        getCity()
    },[])

    return (
        <button className={styles.city} onClick={getCity}>
            <span className={styles.city__span}>
                <LocationSvg/>
            </span>
            <span className={styles.city__text}>{city.length ? (city) : ('Город')}</span>
        </button>
    )
}

export default CityButton