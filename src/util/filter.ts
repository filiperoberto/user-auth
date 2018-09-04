import { Order } from './order';

export class Filter {

    public limit: number;
    public offset: number;

    public orderBy : Order[];

    constructor() {
        this.limit = 20;
        this.offset = 0;
        this.orderBy = [{ orderBy : 'id', direction : 'desc' }];
    }

}