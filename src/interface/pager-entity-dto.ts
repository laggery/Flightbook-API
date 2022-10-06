export class PagerEntityDto<T> {
    public itemCount: number;
    public totalItems: number;
    public itemsPerPage: number;
    public totalPages: number;
    public currentPage: number;
    public entity: T;
}