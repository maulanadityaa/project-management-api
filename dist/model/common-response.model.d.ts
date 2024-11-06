export declare class CommonResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
    errors?: string;
    paging?: Paging;
}
export declare class Paging {
    size: number;
    totalPage: number;
    currentPage: number;
    totalRows: number;
}
