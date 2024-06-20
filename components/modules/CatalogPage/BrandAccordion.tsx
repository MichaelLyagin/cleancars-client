import { $products, $productsBrandsId, setProductsBrandsId } from "@/context/products"
import { useStore } from "effector-react"
import styles from '../../../styles/catalog/index.module.scss'
import { useEffect } from "react"
import { IBrandAccordionProps } from "@/types/catalog"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import Accordion from "@/components/elements/Accordion/Accordion"
import FilterCheckboxItem from "./FilterCheckBoxItem"

const BrandAccordion = ({
    brandList,
    title,
    setBrand,
    updateBrand
}: IBrandAccordionProps) => {
    const isMobile = useMediaQuery(820) //переключение на мобильную версию при разрешении 820
    
    const chooseAllBrands = () => { //Выбрать все
        setBrand(
            brandList.map((item) => ({...item, checked: true}))
        )
    }
    
    return (
        <Accordion
            title={title}
            titleClass={styles.catalog__filtersBlock_desktop__brands__btn}
            arrowOpenClass={styles.open}
            //isMobileForFilters={isMobile}
            //hideArrowClass={isMobile ? styles.hide_arrow : ''}
        >
            <div className={styles.catalog__filtersBlock_desktop__brands__inner}>
                <button
                    className={styles.catalog__filtersBlock_desktop__brands__select_all}
                    onClick={chooseAllBrands}
                >
                    Выбрать все
                </button>
                <ul className={styles.catalog__filtersBlock_desktop__brands__list}>
                {Array.isArray(brandList)
                    ? brandList.map((item) => (
                    <FilterCheckboxItem
                        title={item.title}
                        id={item.id}
                        key={item.id}
                        checked={item.checked}
                        event={updateBrand}
                    />
                )) : null}
                </ul>
                <div style={{ height: 24 }} />
            </div>
        </Accordion>
    )
}

export default BrandAccordion