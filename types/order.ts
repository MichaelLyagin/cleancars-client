export interface ICreateOrderFx {
    url: string;
    client_id: number;
    order_date: string;
    address: string;
    status: string;
    payment_method: boolean;
    departure_date: string;
    arrival_date: string;
}

export interface ICreateOrder {
    url: string;
    client_id: number;
    order_date: string;
    address: string;
    status: string;
    payment_method: boolean;
    departure_date: string;
    arrival_date: string;
}

export interface IOrder{
    id: number;
    client_id: number;
    order_date: string;
    address: string;
    status: string;
    payment_method: boolean;
    departure_date: string;
    arrival_date: string;
}

export interface IOrderItems{
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
}
