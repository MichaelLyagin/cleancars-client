export interface ICreateReviewFx {
    url: string;
    product_id: number;
    client_id: number;
    date: string;
    rating: number;
    comment: string;
}

export interface ICreateReview {
    product_id: number;
    client_id: number;
    date: string;
    rating: number;
    comment: string;
}

export interface IReview {
    id: number;
    product_id: number;
    client_id: number;
    date: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
}