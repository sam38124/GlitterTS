import { Cart } from "./shopping.js";
export declare class OrderEvent {
    static insertOrder(obj: {
        cartData: Cart | any;
        status: number;
        app: string;
    }): Promise<void>;
}
