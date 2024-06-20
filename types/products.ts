export interface IProduct {
    id: number
    name: string
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
  }

  export interface IUpdateCreateProd{
    inputType: string
    product?: IProduct
  }

  export interface ICreateProduct {
    url: string
    name: string
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
  }

  export interface IUpdateProduct {
    url: string
    id: number
    name: string
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
  }

  export interface IUpdateProductCount {
    url: string
    id: number
    in_stock: number
  }
  
  export interface IProducts {
    count: number
    rows: IProduct[]
  }

  export interface IGetProductsFx {
    url: string
    limit: number
    offset: number
  }

  export interface ICategory {
    category_id: number
    category_name: string
  }

  export interface ICategoryImg {
    category_id: number
    category_name: string
    img: string
  }