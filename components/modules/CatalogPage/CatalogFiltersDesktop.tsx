import { $products, $productsBrandsId, setProductsBrandsId, updateProductsBrandsId } from "@/context/products"
import { useStore } from "effector-react"
import styles from '../../../styles/catalog/index.module.scss'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import { useEffect } from "react"
import { IFilterCheckboxItem, ICatalogBaseTypes, ICatalogFilterDesktopProps } from "@/types/catalog"
import BrandAccordion from "./BrandAccordion"
import Accordion from "@/components/elements/Accordion/Accordion"
import PriceRange from "./PriceRange"
import VolumeRange from "./VolumeRange"

const CatalogFiltersDesktop = ({
    priceRange,
    setPriceRange,
    setPriceRangeChanged,
    volumeRange,
    setVolumeRange,
    setVolumeRangeChanged,
    resetFilterBtnDisabled,
    spinner,
    resetFilters,
    applyFilters,
}: ICatalogFilterDesktopProps ) => {
    const productBrandsId = useStore($productsBrandsId) //Объекты брендов
    
    return (
        <div className={styles.catalog__filtersBlock_desktop}>
            <div className={styles.catalog__filtersBlock_desktop__brands}>
                <BrandAccordion
                    brandList={productBrandsId}
                    title='Производитель'
                    updateBrand={updateProductsBrandsId}
                    setBrand={setProductsBrandsId}
                />
            </div>
            <div className={styles.catalog__filtersBlock_desktop__price}>
                <Accordion
                    title='Цена, ₽'
                    titleClass={styles.catalog__filtersBlock_desktop__price__btn}
                    arrowOpenClass={styles.open}>
                    <div className={styles.catalog__filtersBlock_desktop__price__inner}>
                        <PriceRange 
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            setPriceRangeChanged={setPriceRangeChanged}
                        />
                    </div>
                </Accordion>
            </div>
            <div className={styles.catalog__filtersBlock_desktop__price}>
                <Accordion
                    title='Объем, л'
                    titleClass={styles.catalog__filtersBlock_desktop__price__btn}
                    arrowOpenClass={styles.open}>
                    <div className={styles.catalog__filtersBlock_desktop__price__inner}>
                        <VolumeRange 
                            volumeRange={volumeRange}
                            setVolumeRange={setVolumeRange}
                            setVolumeRangeChanged={setVolumeRangeChanged}
                        />
                    </div>
                </Accordion>
            </div>
            <div className={styles.catalog__filtersBlock_desktop__actions}>
                <button
                className={styles.catalog__filtersBlock_desktop__actions__show}
                disabled={spinner || resetFilterBtnDisabled}
                onClick={applyFilters}
                >
                {spinner ? (
                    <span
                    className={spinnerStyles.spinner}
                    style={{ top: 6, left: '47%' }}
                    />
                ) : (
                    'Применить'
                )}
                </button>
                <button
                className={styles.catalog__filtersBlock_desktop__actions__reset}
                disabled={resetFilterBtnDisabled}
                onClick={resetFilters}
                >
                Сбросить
                </button>
            </div>
            
        </div>
    )
}

export default CatalogFiltersDesktop