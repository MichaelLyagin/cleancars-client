import LocationSvg from "../LocationSvg/LocationSvg"
import styles from "../../../styles/cityButton/index.module.scss"

const CityButton = () => {
    return (
        <button className={styles.city}>
            <span className={styles.city__span}>
                <LocationSvg/>
            </span>
            <span className={styles.city__text}>Томск</span>
        </button>
    )
}

export default CityButton