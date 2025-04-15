export type TypeFakeUser = {
    userID: number;
    account: string;
    pwd: string;
    userData: {
        name: string;
        email: string;
        phone: string;
        address: string;
        birth: string;
    };
    created_time: string;
    online_time: string;
};
export declare class FakeUser {
    generateUser(num?: number): TypeFakeUser[];
}
