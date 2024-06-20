import { createProductFx, updateProductFx } from "@/app/api/products";
import { IProduct, IUpdateCreateProd } from "@/types/products";
import { useState } from "react";
import styles from '../../../styles/productPage/index.module.scss'

const InputsProductInfo = ({inputType, product}: IUpdateCreateProd) => {
    /*
    despription: string
    img: string
    category_id: number
    price: number
    brand: string
    volume: number
    in_stock: number
    vendor_code: string
    popularity: number
    bestseller: boolean
    */

    const [name, setName] = useState(product ? product.name : '');
    const [despription, setDespription] = useState(product ? product.despription : '')
    const [img, setImg] = useState(product ? product.img : '')
    const [categoryId, setCategoryId] = useState(product ? product.category_id : null)
    const [price, setPrice] = useState(product ? product.price : null)
    const [brand, setBrand] = useState(product ? product.brand : '')
    const [volume, setVolume] = useState(product ? product.volume : null)
    const [inStock, setInStock] = useState(product ? product.in_stock : null)
    const [vendorCode, setVendorCode] = useState(product ? product.vendor_code : '')
    //const [pop, setInStock] = useState(product ? product.in_stock : null)


    const updateProduct = async () => {
        try {
          const data = await updateProductFx({
            url: '/products/update',
            id: product ? product.id : 0, 
            name: name, 
            despription: despription, 
            img: img, 
            category_id: categoryId ? categoryId : 0, 
            price: price ? price : 0, 
            brand: brand, 
            volume: volume ? volume : 0, 
            in_stock: inStock ? inStock : 0, 
            vendor_code: vendorCode, 
            popularity: product ? product.popularity : 0, 
            bestseller: product ? product.bestseller : false,
          })
          console.log('order data', data)

        } catch (error) {
          console.log(error)
        } 
    }

    const createProduct = async () => {
        try {
          const data = await createProductFx({
            url: '/products/create',
            name: name, 
            despription: despription, 
            img: img, 
            category_id: categoryId ? categoryId : 0, 
            price: price ? price : 0, 
            brand: brand, 
            volume: volume ? volume : 0, 
            in_stock: inStock ? inStock : 0, 
            vendor_code: vendorCode, 
            popularity: product ? product.popularity : 0, 
            bestseller: product ? product.bestseller : false,
          })
          console.log('order data', data)

        } catch (error) {
          console.log(error)
        } 
    }

    return (
        <div className={styles.admin}>
            <h2>{inputType === 'update' ? 'Обновление товара' : 'Создание товара'}</h2>
            <div className={styles.admin__field}>
                <div className={styles.admin__field__name}>Название</div>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Название" />
            </div>
            <div className={styles.admin__field}>
                <div>Описание</div>
                <textarea value={despription} onChange={e => setDespription(e.target.value)} placeholder="Описание" />
            </div>
            <div className={styles.admin__field}>
                <div>Адрес изображения</div>
                <input type="text" value={img} onChange={e => setImg(e.target.value)} placeholder="Изображение" />
            </div>
            <div className={styles.admin__field__catblock}>
                <div>Категория</div>
                <div className={styles.admin__field__catblock__select}>
                    <select id="category" name="category" onChange={e => setCategoryId(Number(e.target.value))}>
                        <option selected={product?.category_id === 11 ? true : false} value="11">11</option>
                        <option selected={product?.category_id === 12 ? true : false} value="12">12</option>
                        <option selected={product?.category_id === 13 ? true : false} value="13">13</option>
                        <option selected={product?.category_id === 14 ? true : false} value="14">14</option>
                        <option selected={product?.category_id === 21 ? true : false} value="21">21</option>
                        <option selected={product?.category_id === 22 ? true : false} value="22">22</option>
                        <option selected={product?.category_id === 23 ? true : false} value="23">23</option>
                        <option selected={product?.category_id === 24 ? true : false} value="24">24</option>
                    </select>
                </div>
            </div>
            <div className={styles.admin__field}>
                <div>Цена, ₽</div>
                <input type="number" value={price ? price : 0} onChange={e => setPrice(Number(e.target.value))} placeholder="Цена" />
            </div>
            <div className={styles.admin__field}>
                <div>Производитель</div>
                <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Производитель" />
            </div>
            <div className={styles.admin__field}>
                <div>Объем, мл</div>
                <input type="number" value={volume ? volume : 0} onChange={e => setVolume(Number(e.target.value))} placeholder="Объем" />
            </div>
            <div className={styles.admin__field}>
                <div>Количество на складе</div>
                <input type="number" value={inStock ? inStock : 0} onChange={e => setInStock(Number(e.target.value))} placeholder="Количество на складе" />
            </div>
            <div className={styles.admin__field}>
                <div>Артикул</div>
                <input type="text" value={vendorCode} onChange={e => setVendorCode(e.target.value)} placeholder="Артикул" />
            </div>
            <div >
                <button 
                    onClick={inputType === 'update' ? updateProduct : createProduct}
                    className={styles.admin__btn}>
                    {/*disabled={!(address !== '' && agree)}*/} 
                        {inputType === 'update' ? 'Обновить' : 'Создать'}
                </button>
            </div>
        </div>
    )
}

export default InputsProductInfo