import { useMediaQuery } from "@/hooks/useMediaQuery"
import CatalogFiltersDesktop from "./CatalogFiltersDesktop"
import { ICatalogBaseTypes, ICatalogFiltersProps, IFilterCheckboxItem } from "@/types/catalog"
import { useStore } from "effector-react"
import { $category, $products, $productsBrandsId, setBrandFromQuery, setCategory, setProductsBrandsId } from "@/context/products"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { checkQueryParams, updateParamsAndFilters, updateParamsAndFiltersFromQuery } from "@/utils/catalog"
import { useRouter } from "next/router"
import { ICategory, IProduct, IProducts } from "@/types/products"
import { getProductsFx } from "@/app/api/products"
import { getQueryParamOnFirstRender } from "@/utils/common"

const CatalogFilters = ({
    priceRange,
    setPriceRange,
    setPriceRangeChanged,
    volumeRange,
    setVolumeRange,
    setVolumeRangeChanged,
    resetFilterBtnDisabled,
    resetFilters,
    priceRangeChanged,
    volumeRangeChanged,
    currentPage,
    setIsFilterInQuery,
}: ICatalogFiltersProps) => {
    const isMobile = useMediaQuery(820) //переключение на мобильную версию при разрешении 820
    const productBrandsId = useStore($productsBrandsId) //Объекты брендов
    const products = useStore($products);
    let currentBrandsIds:string[] = [] //только id брендов
    let currentBrands:IFilterCheckboxItem[] = [] //наиманование id и checked
    const [spinner, setSpinner] = useState(false)//Спинер показывающийся при запросах на сервер
    const router = useRouter();
    const category = useStore($category); 


    useEffect(()=>{ //Наполняем стор из объектов брендов для фильтра производителя 
        applyFiltersFromQuery() //доработать. Эта функиця сохраняет фильтры при обновлении страницы
        //Производители почему-то не сохраняются при перегазгрузке. Цена и объем сохраняются
        loadProducts()
    }, [])

    //По хорошему сюда нужно добавить зависимость от категории
    //И выводить в фильтр только бренды выбранной категори
    const setNew = (data: IProducts) => { //Наполняем стор из объектов брендов для фильтра производителя 
        if(data){
            if(data.rows){
                data.rows.map((item)=>{
                    if(!currentBrandsIds.includes(item.brand) && currentBrandsIds.length < data.rows.length)
                        //currentBrandsIds.push(item.brand)
                        currentBrandsIds.push(item.brand)
                })
                currentBrandsIds.map((item) => {
                    if(currentBrands.length < currentBrandsIds.length)
                        currentBrands.push({
                            title: 'Производитель ' + item, //Сюда нужно дописать данные о брендах с бэка
                            checked: false,
                            id: item,
                        })
                })
                setProductsBrandsId(currentBrands)
            }
        }
    }

    const loadProducts = async () => {
        try {
            const data:IProducts = await getProductsFx('/products') //получаем все бренды
            setNew(data)
        } catch (error){
            toast.error((error as Error).message)
        } finally {
            setSpinner(false)
        }
    }

    const applyFiltersFromQuery = async () => {
        try {
          const {
            isValidBrandQuery,
            isValidPriceQuery,
            isValidVolumeQuery,
            priceFromQueryValue,
            priceToQueryValue,
            volumeFromQueryValue,
            volumeToQueryValue,
            brandQueryValue,
            //categoryFromQueryValue
          } = checkQueryParams(router)
    
          const brandQuery = `&brand=${getQueryParamOnFirstRender(
            'brand',
            router
          )}`

          //let selectedCat = categories.find((item: ICategory) => item.category_id === Number(categoryFromQueryValue))
          const categoryQuery = `&category=${category.category_id}`

          const priceQuery = `&priceFrom=${priceFromQueryValue}&priceTo=${priceToQueryValue}`
          const volumeQuery = `&volumeFrom=${volumeFromQueryValue}&volumeTo=${volumeToQueryValue}`
    
          if (isValidBrandQuery && isValidPriceQuery && isValidVolumeQuery) {
            updateParamsAndFiltersFromQuery(() => {
              updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
              updateVolumeFromQuery(+volumeFromQueryValue, +volumeToQueryValue)
              setBrandFromQuery(brandQueryValue)
              //if(selectedCat) 
              //  setCategory(selectedCat)
            }, `${currentPage}${brandQuery}${priceQuery}${volumeQuery}${categoryQuery}`)
            return
          }
    
          if (isValidPriceQuery) {
            updateParamsAndFiltersFromQuery(() => {
              updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
              //if(selectedCat) 
              //  setCategory(selectedCat)
            }, `${currentPage}${priceQuery}${categoryQuery}`)
          }

          if (isValidVolumeQuery) {
            updateParamsAndFiltersFromQuery(() => {
              updateVolumeFromQuery(+volumeFromQueryValue, +volumeToQueryValue)
              //if(selectedCat) 
              //  setCategory(selectedCat)
            }, `${currentPage}${volumeQuery}${categoryQuery}`)
          }
    
          if (isValidBrandQuery) {
            updateParamsAndFiltersFromQuery(() => {
              setIsFilterInQuery(true)
              setBrandFromQuery(brandQueryValue)
              //if(selectedCat) 
              //  setCategory(selectedCat)
            }, `${currentPage}${brandQuery}${categoryQuery}`)
            return
          }
    
    
          if (isValidBrandQuery && isValidPriceQuery) {
            updateParamsAndFiltersFromQuery(() => {
              updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
              setBrandFromQuery(brandQueryValue)
              //if(selectedCat) 
              //  setCategory(selectedCat)
            }, `${currentPage}${brandQuery}${priceQuery}${categoryQuery}`)
          }
    
          if (isValidBrandQuery && isValidVolumeQuery) {
            updateParamsAndFiltersFromQuery(() => {
              updateVolumeFromQuery(+volumeFromQueryValue, +volumeToQueryValue)
              setBrandFromQuery(brandQueryValue)
              //if(selectedCat) 
              //  setCategory(selectedCat)
            }, `${currentPage}${brandQuery}${volumeQuery}${categoryQuery}`)
          }

          if (isValidPriceQuery && isValidVolumeQuery) {
            updateParamsAndFiltersFromQuery(() => {
              updateVolumeFromQuery(+volumeFromQueryValue, +volumeToQueryValue)
              updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
              //if(selectedCat) 
              //  setCategory(selectedCat)
            }, `${currentPage}${priceQuery}${volumeQuery}${categoryQuery}`)
          }
        } catch (error) {
          const err = error as Error
    
          if (err.message === 'URI malformed') {
            toast.warning('Неправильный url для фильтров')
            return
          }
    
          toast.error(err.message)
        }
      }


      const updatePriceFromQuery = (priceFrom: number, priceTo: number) => {
        setIsFilterInQuery(true)
        setPriceRange([+priceFrom, +priceTo])
        setPriceRangeChanged(true)
      }

      const updateVolumeFromQuery = (volumeFrom: number, volumeTo: number) => {
        setIsFilterInQuery(true)
        setVolumeRange([+volumeFrom/1000, +volumeTo/1000])
        setVolumeRangeChanged(true)
      }

    const applyFilters = async () => { //Функция применения фильтров
        setIsFilterInQuery(true)//При нажатии на кнопку показать применяется какой-то из фильтров
        try {
            setSpinner(true)
            //Объявляем квери параметры для запроса на сервер. Данные из фильтров.
            const priceFrom = Math.ceil(priceRange[0])
            const priceTo = Math.ceil(priceRange[1])
            const priceQuery = priceRangeChanged
            ? `&priceFrom=${priceFrom}&priceTo=${priceTo}`
            : ''

            const categoryQuery = `&category=${category.category_id}`

            const volumeFrom = volumeRange[0]*1000
            const volumeTo = volumeRange[1]*1000
            const volumeQuery = volumeRangeChanged
            ? `&volumeFrom=${volumeFrom}&volumeTo=${volumeTo}`
            : ''

            const checkedBrandsId = productBrandsId //Массив с id выбранных брендов 
            .filter((item) => item.checked)
            .map((item) => item.id)

            //Устанавливаем массив в квери параметры
            const encodedBrandQuery = encodeURIComponent(JSON.stringify(checkedBrandsId))//этот массив можно установить как квери парамтер
            const brandQuery = `&brand=${encodedBrandQuery}`
            const initialPage = currentPage > 0 ? 0 : currentPage //после применения фильтров всегда 1 страница

            //Если применены все фильтры
            if (checkedBrandsId.length && priceRangeChanged && volumeRangeChanged) {
                updateParamsAndFilters(
                  {
                    brand: encodedBrandQuery,
                    priceFrom,
                    priceTo,
                    volumeFrom,
                    volumeTo,
                    offset: initialPage + 1,
                  },
                  `${initialPage}${priceQuery}${volumeQuery}${brandQuery}${categoryQuery}`,//указываем квери параметры
                  router
                )
                return
            }

            if (priceRangeChanged) {
                updateParamsAndFilters(
                  {
                    priceFrom,
                    priceTo,
                    offset: initialPage + 1,
                  },
                  `${initialPage}${priceQuery}${categoryQuery}`,
                  router
                )
            }

            if (volumeRangeChanged) {
            updateParamsAndFilters(
                {
                volumeFrom,
                volumeTo,
                offset: initialPage + 1,
                },
                `${initialPage}${volumeQuery}${categoryQuery}`,
                router
                )
            }

            if (checkedBrandsId.length) {
                updateParamsAndFilters(
                  {
                    brand: encodedBrandQuery,
                    offset: initialPage + 1,
                  },
                  `${initialPage}${brandQuery}${categoryQuery}`,
                  router
                )
            }

            if (checkedBrandsId.length && priceRangeChanged) {
                updateParamsAndFilters(
                  {
                    brand: encodedBrandQuery,
                    priceFrom,
                    priceTo,
                    offset: initialPage + 1,
                  },
                  `${initialPage}${brandQuery}${priceQuery}${categoryQuery}`,
                  router
                )
            }

            if (checkedBrandsId.length && volumeRangeChanged) {
            updateParamsAndFilters(
                {
                brand: encodedBrandQuery,
                volumeFrom,
                volumeTo,
                offset: initialPage + 1,

                },
                `${initialPage}${brandQuery}${volumeQuery}${categoryQuery}`,
                router
            )
            }

            if (priceRangeChanged && volumeRangeChanged) {
                updateParamsAndFilters(
                    {
                    priceFrom,
                    priceTo,
                    volumeFrom,
                    volumeTo,
                    offset: initialPage + 1,
                    },
                    `${initialPage}${priceQuery}${volumeQuery}${categoryQuery}`,
                    router
                )
            }

        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setSpinner(false)
        }
    }

    return (
        <div>
            <CatalogFiltersDesktop 
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                setPriceRangeChanged={setPriceRangeChanged}
                volumeRange={volumeRange}
                setVolumeRange={setVolumeRange}
                setVolumeRangeChanged={setVolumeRangeChanged}
                resetFilterBtnDisabled={resetFilterBtnDisabled}
                spinner={spinner}
                resetFilters={resetFilters}
                applyFilters={applyFilters}
            />
        </div>
    )
}

export default CatalogFilters