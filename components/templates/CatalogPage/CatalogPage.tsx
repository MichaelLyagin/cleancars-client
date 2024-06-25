import CategoriesBlock from '@/components/modules/CatalogPage/CategoriesBlock'
import styles from '../../../styles/catalog/index.module.scss'
import skeletonStyles from '../../../styles/skeleton/index.module.scss'
import FilterSelector from '@/components/modules/CatalogPage/FilterSelector'
import ProductCard from '@/components/elements/ProductCard/ProductCard'
import { getProductsFx } from '@/app/api/products'
import { $category, $filteredProducts, $products, $productsBrandsId, setCategory, setProducts, setProductsBrandsId } from '@/context/products'
import { toast } from 'react-toastify'
import { useStore } from 'effector-react'
import { ICategory, IProduct, IProducts } from '@/types/products'
import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { IQueryParams, ITextArray } from '@/types/catalog'
import { useRouter } from 'next/router'
import CatalogFilters from '@/components/modules/CatalogPage/CatalogFilters'
import { checkQueryParams } from '@/utils/catalog'
import { $user } from '@/context/user'
import InputsProductInfo from '@/components/elements/InputsProductInfo/InputsProductInfo'

const CatalogPage = ({query}: {query: IQueryParams}) => {
    const products = useStore($products);
    const filteredProducts = useStore($filteredProducts); //Отфильтрованные продукты
    const [spinner, setSpinner] = useState(false);
    const router = useRouter();
    const [isFilterInQuery, setIsFilterInQuery] = useState(false)//Есть ли в адресной строке квери параметры фильтров
    const productBrandsId = useStore($productsBrandsId) //Объекты брендов
    const pagesCount = Math.ceil(products.count / 6); //Количество страниц пагинации
    const isValidOffset = query.offset && !isNaN(+query.offset) && +query.offset > 0 //Проверка на валидность номера страницы
    const [currentPage, setCurrentPage] = useState(isValidOffset ? +query.offset - 1 : 0); //Текущая страница пагинации (нумерация на бэке с нуля, оффсет с одного)
    const [priceRange, setPriceRange] = useState([10, 5000]); //Значения диапазона цены в PriceRange
    const [priceRangeChanged, setPriceRangeChanged] = useState(false); 
    const [volumeRange, setVolumeRange] = useState([0.1, 5.0]); //Значения диапазона объема в VolumeRange
    const [volumeRangeChanged, setVolumeRangeChanged] = useState(false);
    const category = useStore($category); 
    const user = useStore($user)
    const [visionModal, setVisionModal] = useState(false);
    const textArray: ITextArray[] = [
      {
        id: 10, 
        text:'В детейлинг экстерьера входит мойка, полировка, нанесение защитных покрытий, очистка колёс и шин, а также обработка стёкол и фар. Эти действия помогают не только улучшить внешний вид, но и сохранить стоимость автомобиля.'
      },
      {
        id: 20, 
        text:'Детейлинг интерьера автомобиля — это комплексная очистка и защита внутренних элементов, направленная на улучшение внешнего вида и комфорта, а также поддержание рыночной стоимости авто.'
      },
    ];
    let text: string | undefined = ''


    const isAnyBrandChecked = Array.isArray(productBrandsId) ? productBrandsId.some(
      (item) => item.checked
    ) : null;

    //Булевская переменная отвечающая за активацию кнопки сбросить
    const resetFilterBtnDisabled = !(
      priceRangeChanged ||
      isAnyBrandChecked ||
      volumeRangeChanged
    )

    useEffect(() => {
        loadProducts()
    }, [filteredProducts, isFilterInQuery, category])


    //Функция сброса пагинации в случае каких-либо ошибок
    const resetPagination = (data: IProducts) => {
        setCurrentPage(0) //Устанавливаем первую страницу пагинации
        setProducts(data)  //подгружаем данные для 1 страницы
      }

    const loadProducts = async () => {
        try {
            setSpinner(true)
            const data = await getProductsFx(`/products?limit=6&offset=0&category=${category.category_id}`) //записываем квери параметры
            //offset страница
            //limit количество элементов на странице

            if (!isValidOffset) { //Если офсет не валидный то меняем его на 1
                router.replace({
                  query: {
                    offset: 1,
                  },
                })
        
            resetPagination(data)
            return
            }

            if (isValidOffset) {
                if (+query.offset > Math.ceil(data.count / 6)) { //проверка если офсет больше чем кол-во страниц
                  router.push(
                    {
                      query: {
                        ...query,
                        offset: 1, //устанавливаем в офсет 1
                      },
                    },
                    undefined,
                    { shallow: true } //замена квери параметров поверхностно
                  )
        
                  setCurrentPage(0)
                  //console.log('1 isFilterInQuery', isFilterInQuery)
                  setProducts(isFilterInQuery ? filteredProducts : data)//Если установлены фильтры, то передавай отфильтрованные данные
                    return
                }
                const offset = +query.offset - 1
                const result = await getProductsFx(
                    `/products?limit=6&offset=${offset}&category=${category.category_id}`
                ) //данные с сервера

                setCurrentPage(offset) //устанавливаем номер страницу
                //console.log('2 isFilterInQuery', isFilterInQuery)
                setProducts(isFilterInQuery ? filteredProducts : result)
                return
            }
            //console.log('3 isFilterInQuery', isFilterInQuery)
            setProducts(isFilterInQuery ? filteredProducts : data)
        } catch (error){
            toast.error((error as Error).message)
        } finally {
            //setSpinner(false)
            setTimeout(() => setSpinner(false), 1000)
        }
    }

    //Асинхроннай функция подгрузки данных при смене страниц пагинации
    //selected - номер 
    const handlePageChange = async ({ selected }: { selected: number }) => {
        try {
          setSpinner(true)
          const data = await getProductsFx(`/products?limit=6&offset=0&category=${category.category_id}}`)//получаем 1 страницу
    
          if (selected > pagesCount) { //Если selected больше чем кол-во страниц
            resetPagination(isFilterInQuery ? filteredProducts : data)
            return
          }
          
          //Если офсет больше кол-ва страниц
          if (isValidOffset && +query.offset > Math.ceil(data.count / 6)) {
            resetPagination(isFilterInQuery ? filteredProducts : data)
            return
          }
  
          const { isValidBrandQuery, isValidPriceQuery, isValidVolumeQuery } =
            checkQueryParams(router)
    
          const result = await getProductsFx(
            `/products?limit=6&offset=${selected}&category=${category.category_id}${
              isFilterInQuery && isValidBrandQuery
                ? `&brand=${router.query.brand}`
                : ''
            }${
              isFilterInQuery && isValidPriceQuery
                ? `&priceFrom=${router.query.priceFrom}&priceTo=${router.query.priceTo}`
                : ''
            }${
              isFilterInQuery && isValidVolumeQuery
                ? `&volumeFrom=${router.query.volumeFrom}&volumeTo=${router.query.volumeTo}`
                : ''
            }`
          )
          
          //Обновляем квери параметры
          router.push(
            {
              query: {
                ...router.query,
                offset: selected + 1,
                
              },
            },
            undefined,
            { shallow: true }
          )
    
          setCurrentPage(selected)
          setProducts(result)
        } catch (error) {
          toast.error((error as Error).message)
        } finally {
          setTimeout(() => setSpinner(false), 1000)
        }
    }

    const resetFilters = async () => {
      try {
        const data = await getProductsFx(`/products?limit=6&offset=0&category=${category.category_id}`)
        //console.log('category', category, 'data', data)
        const params = router.query
  
        delete params.brand
        delete params.priceFrom
        delete params.priceTo
        delete params.volumeFrom
        delete params.volumeTo
        params.first = 'cheap'
  
        router.push({ query: { ...params } }, undefined, { shallow: true })

        setProductsBrandsId(
          productBrandsId.map((item) => ({ ...item, checked: false }))
        )

        setProducts(data)
        setPriceRange([10, 5000])
        setPriceRangeChanged(false)
        setVolumeRange([0.1, 5.0])
        setVolumeRangeChanged(false)
        setIsFilterInQuery(false)
        //setProductsBrandsId([])
      } catch (error) {
        toast.error((error as Error).message)
      }
    }

    const setSelectedCategory = (cat: ICategory) => {
      setCategory(cat)
    }

    const getCategoryName = () => { //Хлебные крошки
      let textf = textArray.find(item => item.id === category.category_id)
      if(textf)
        text = textf?.text
      if(category.category_id === 10 || category.category_id === 20) {
        return <div><a onClick={()=>setSelectedCategory(category)}>{category.category_name}</a></div>
      } else {
        if(Math.floor(category.category_id/10) === 1){
          return <div><a onClick={()=>setSelectedCategory({category_id: 10, category_name: 'Экстерьер'})}>Экстерьер
          </a> — <a onClick={()=>setSelectedCategory(category)}>{category.category_name}</a></div>
        } else {
          return <div><a onClick={()=>setSelectedCategory({category_id: 20, category_name: 'Интерьер'})}>Интерьер</a> — <a>{category.category_name}</a></div>
        }
      }
    }

    return (
        <div className={styles.catalog}>
            <div className={`container ${styles.catalog__container}`}>
                <div className={styles.catalog__search}>
                  <input type="text" placeholder="Поиск" />
                  <div className={styles.catalog__search__button}>
                    <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.5 32.1417L22.1667 23.275C21.3333 23.9083 20.375 24.4097 19.2917 24.7792C18.2083 25.1486 17.0556 25.3333 15.8333 25.3333C12.8056 25.3333 10.2433 24.3369 8.14667 22.344C6.05 20.3511 5.00111 17.917 5 15.0417C5 12.1653 6.04889 9.73117 8.14667 7.73933C10.2444 5.7475 12.8067 4.75106 15.8333 4.75C18.8611 4.75 21.4233 5.74644 23.52 7.73933C25.6167 9.73222 26.6656 12.1663 26.6667 15.0417C26.6667 16.2028 26.4722 17.2979 26.0833 18.3271C25.6944 19.3562 25.1667 20.2667 24.5 21.0583L33.875 29.9646C34.1806 30.2549 34.3333 30.6111 34.3333 31.0333C34.3333 31.4556 34.1667 31.825 33.8333 32.1417C33.5278 32.4319 33.1389 32.5771 32.6667 32.5771C32.1944 32.5771 31.8056 32.4319 31.5 32.1417ZM15.8333 22.1667C17.9167 22.1667 19.6878 21.4737 21.1467 20.0877C22.6056 18.7018 23.3344 17.0198 23.3333 15.0417C23.3333 13.0625 22.6039 11.3799 21.145 9.994C19.6861 8.60806 17.9156 7.91561 15.8333 7.91667C13.75 7.91667 11.9789 8.60964 10.52 9.99558C9.06111 11.3815 8.33222 13.0636 8.33333 15.0417C8.33333 17.0208 9.06278 18.7034 10.5217 20.0893C11.9806 21.4753 13.7511 22.1677 15.8333 22.1667Z" fill="white"/>
                    </svg>
                  </div>
                </div>
                <h2 className={styles.catalog__title}>Каталог</h2>
                <div className={styles.catalog__category_name}>{getCategoryName()}</div>
                <br/>
                <div className={styles.catalog__info}>
                  <div className={styles.catalog__info__circle}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C10.9993 5.71733 10.9033 5.48 10.712 5.288C10.5207 5.096 10.2833 5 10 5C9.71667 5 9.47933 5.096 9.288 5.288C9.09667 5.48 9.00067 5.71733 9 6C8.99933 6.28267 9.09533 6.52033 9.288 6.713C9.48067 6.90567 9.718 7.00133 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88334 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667932 11.3827 1.26582e-06 10C-0.000665401 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88267 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 10 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88267 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 10C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="#3CA444"/>
                    </svg>
                    <div className={styles.catalog__info__circle__text}>{text}</div>
                  </div>
                </div>
                {user.role ? 
                <div  className={styles.catalog__admin}>
                    <div onClick={() => setVisionModal(true)}>
                        Добавить товар
                    </div>
                </div> : null}
                {visionModal ? 
                    <div className={styles.catalog__modal}>
                        <div className={styles.catalog__modal__window}>
                            <div className={styles.catalog__modal__window__close_div}>
                                <svg onClick={() => setVisionModal(false)} className={styles.catalog__modal__close} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 7.998H8V12.998C8 13.2632 7.89464 13.5176 7.70711 13.7051C7.51957 13.8926 7.26522 13.998 7 13.998C6.73478 13.998 6.48043 13.8926 6.29289 13.7051C6.10536 13.5176 6 13.2632 6 12.998V7.998H1C0.734784 7.998 0.48043 7.89264 0.292893 7.70511C0.105357 7.51757 0 7.26322 0 6.998C0 6.73278 0.105357 6.47843 0.292893 6.29089C0.48043 6.10336 0.734784 5.998 1 5.998H6V0.998001C6 0.732785 6.10536 0.47843 6.29289 0.290894C6.48043 0.103358 6.73478 -0.0019989 7 -0.0019989C7.26522 -0.0019989 7.51957 0.103358 7.70711 0.290894C7.89464 0.47843 8 0.732785 8 0.998001V5.998H13C13.2652 5.998 13.5196 6.10336 13.7071 6.29089C13.8946 6.47843 14 6.73278 14 6.998C14 7.26322 13.8946 7.51757 13.7071 7.70511C13.5196 7.89264 13.2652 7.998 13 7.998Z" fill="black"/>
                                </svg>
                            </div>
                            <div className={styles.product__modal__window__inputs}>
                                <InputsProductInfo inputType={'create'}/>
                            </div>
                        </div>
                    </div> 
                : null}
                <div className={styles.catalog__sections}>
                    <div className={styles.catalog__filters}>
                      <CatalogFilters 
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        setPriceRangeChanged={setPriceRangeChanged}
                        volumeRange={volumeRange}
                        setVolumeRange={setVolumeRange}
                        setVolumeRangeChanged={setVolumeRangeChanged}
                        resetFilterBtnDisabled={resetFilterBtnDisabled}
                        resetFilters={resetFilters}
                        priceRangeChanged={priceRangeChanged}
                        volumeRangeChanged={priceRangeChanged}
                        currentPage={currentPage}
                        setIsFilterInQuery={setIsFilterInQuery}
                      />
                    </div>
                    <div className={styles.catalog__main_block}>
                        <CategoriesBlock />
                        <div className={styles.catalog__main_block__products}>
                            <FilterSelector setSpinner={setSpinner}/>
                            {spinner ? (
                                <div className={skeletonStyles.skeleton}>
                                    {Array.from(new Array(6)).map((_, i) => (
                                    <div
                                        key={i}
                                        className={skeletonStyles.skeleton__item}
                                    >
                                        <div className={skeletonStyles.skeleton__item__light} />
                                    </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.catalog__list}>
                                    {products.rows?.length ? products.rows.map((item: IProduct) => <ProductCard item={item}/>) : (
                                        <span>Список товаров пуст</span>
                                    )}
                                </div>
                            ) }
                        </div>
                        <ReactPaginate 
                                containerClassName={styles.catalog__main_block__pagination}
                                pageClassName={styles.catalog__main_block__pagination__item}
                                pageLinkClassName={styles.catalog__main_block__pagination__item__link}
                                previousClassName={styles.catalog__main_block__pagination__prev}//кнопки следующие и предыдущие
                                nextClassName={styles.catalog__main_block__pagination__next}
                                breakClassName={styles.catalog__main_block__pagination__dots}
                                breakLinkClassName={styles.catalog__main_block__pagination__dots__link}
                                breakLabel="..."
                                pageCount={pagesCount}
                                forcePage={currentPage} //Текущая страница
                                previousLabel={
                                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.29245 1.71244L2.41245 5.59244L6.29245 9.47244C6.38503 9.56503 6.45847 9.67494 6.50858 9.7959C6.55868 9.91686 6.58447 10.0465 6.58447 10.1774C6.58447 10.3084 6.55868 10.438 6.50858 10.559C6.45847 10.68 6.38503 10.7899 6.29245 10.8824C6.19987 10.975 6.08996 11.0485 5.969 11.0986C5.84803 11.1487 5.71838 11.1745 5.58745 11.1745C5.45652 11.1745 5.32687 11.1487 5.20591 11.0986C5.08494 11.0485 4.97503 10.975 4.88245 10.8824L0.292452 6.29244C0.199749 6.19993 0.126201 6.09004 0.0760193 5.96907C0.0258379 5.84809 7.62939e-06 5.71841 7.62939e-06 5.58744C7.62939e-06 5.45648 0.0258379 5.32679 0.0760193 5.20582C0.126201 5.08485 0.199749 4.97496 0.292452 4.88244L4.88245 0.292444C4.97497 0.19974 5.08485 0.126193 5.20583 0.0760112C5.3268 0.0258297 5.45648 0 5.58745 0C5.71842 0 5.8481 0.0258297 5.96908 0.0760112C6.09005 0.126193 6.19994 0.19974 6.29245 0.292444C6.67245 0.682444 6.68245 1.32244 6.29245 1.71244Z" fill="#808080"/>
                                    </svg>
                                }
                                nextLabel={
                                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.292021 9.46199L4.17202 5.58199L0.292021 1.70199C0.199439 1.60941 0.125999 1.4995 0.0758944 1.37854C0.0257894 1.25757 9.75512e-10 1.12793 0 0.996996C-9.75505e-10 0.866065 0.0257894 0.736416 0.0758944 0.615452C0.125999 0.494488 0.199439 0.384576 0.292021 0.291994C0.384603 0.199412 0.494513 0.125974 0.615478 0.0758686C0.736442 0.0257635 0.86609 -2.47955e-05 0.997021 -2.47955e-05C1.12795 -2.47955e-05 1.2576 0.0257635 1.37856 0.0758686C1.49953 0.125974 1.60944 0.199412 1.70202 0.291994L6.29202 4.88199C6.38472 4.97451 6.45827 5.0844 6.50845 5.20537C6.55863 5.32634 6.58447 5.45603 6.58447 5.58699C6.58447 5.71796 6.55863 5.84765 6.50845 5.96862C6.45827 6.08959 6.38472 6.19948 6.29202 6.29199L1.70202 10.882C1.60951 10.9747 1.49962 11.0482 1.37864 11.0984C1.25767 11.1486 1.12799 11.1744 0.997021 11.1744C0.866052 11.1744 0.73637 11.1486 0.615396 11.0984C0.494423 11.0482 0.384534 10.9747 0.292021 10.882C-0.0879792 10.492 -0.0979792 9.85199 0.292021 9.46199Z" fill="#808080"/>
                                    </svg>
                                  }
                                onPageChange={handlePageChange}
                            />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CatalogPage