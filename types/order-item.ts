export interface ICreateOrderItemFx {
    url: string;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
}

export interface ICreateOrderItem {
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
}

export interface ICheckOrderItemFx {
    url: string;
    order_id: number;
    product_id: number;
}