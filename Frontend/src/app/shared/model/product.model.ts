export interface PaginationProductModel{
    count: number,
    next: string,
    previous: string,
    results: ProductModel[]
}

export interface ProductModel{
    id: number,
    name: string,
    description: string;
    model: string;
    price: number;
    stock_items: number;
    base_view: string;
    BID: {
        id: number;
        name: string;
        categoryID: number;
    };
    CategoryID: {
        id: number
        name: string;
        image: string;
        catParent: number
    };
    average_rating: number;
    disLike: number;
    item_puchases: number;
    like: number;
}