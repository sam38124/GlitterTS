import { TypeFakeUser } from './fake-user.js';
export declare class FakeOrder {
    users: TypeFakeUser[];
    constructor(users: TypeFakeUser[]);
    generateOrder(num?: number): any[][];
}
