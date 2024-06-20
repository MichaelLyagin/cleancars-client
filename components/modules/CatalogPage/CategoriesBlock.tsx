import { $category, setCategory } from '@/context/products';
import styles from '../../../styles/catalog/index.module.scss'
import { useStore } from 'effector-react';
import { ICategory, ICategoryImg } from '@/types/products';

const CategoriesBlock = () => {
    const selectedCategory = useStore($category); 
    const categories:ICategoryImg[] = [{
        category_id: 10,
        category_name: 'Экстерьер',
        img: ''
    },
    {
        category_id: 11,
        category_name: 'Мойка и сушка',
        img: '/img/category_11.png'
    },
    {
        category_id: 12,
        category_name: 'Полировка',
        img: '/img/category_12.webp'
    },
    {
        category_id: 13,
        category_name: 'Защитные покрытия',
        img: '/img/category_13.webp'
    },
    {
        category_id: 14,
        category_name: 'Уход за резиной',
        img: '/img/category_14.webp'
    },
    {
        category_id: 20,
        category_name: 'Интерьер',
        img: ''
    },
    {
        category_id: 21,
        category_name: 'Уход за кожей',
        img: '/img/category_21.webp'
    },
    {
        category_id: 22,
        category_name: 'Уход за тканью',
        img: '/img/category_22.webp'
    },
    {
        category_id: 23,
        category_name: 'Химчистка',
        img: '/img/category_23.png'
    },
    {
        category_id: 24,
        category_name: 'Ароматизаторы',
        img: '/img/category_24.png'
    }]  

    const categoryList1 = [11, 12, 13, 14]
    const categoryList2 = [21, 22, 33, 44]

    const setSelectedCategory = (cat: ICategory) => {
        setCategory(cat)
    }


    return(
        <div className={styles.categories_block}>
            <div className={styles.categories_block__list}>
                {categories.map((item) => (
                    item.category_id !== 10 && item.category_id !== 20 ? ( 
                    (Math.floor(selectedCategory.category_id/10) === 1 && Math.floor(item.category_id/10) === 1) || 
                    (Math.floor(selectedCategory.category_id/10) === 2 && Math.floor(item.category_id/10) === 2) ?  
                    <div className={
                        item.category_id === selectedCategory.category_id ? 
                        `${styles.categories_block__list__item} ${styles.selected}` : `${styles.categories_block__list__item}`} key={item.category_id} onClick={() => setSelectedCategory(item)}>
                        <img className={styles.categories_block__list__item__img} src={item.img} />
                        <div>{item.category_name}</div>
                    </div> :  null) : null 
                ))}
            </div>
        </div>
    )
}

export default CategoriesBlock