export default class UserUtil {
    static insertNewUser(trans: any, id: string, email: string, pwd: string, firstName: string, lastName: string, gender: number, birth?: string): Promise<void>;
    static updateUser({ trans, id, email, pwd, firstName, lastName, gender, phone, birth, }: {
        trans: any;
        id: number;
        email: string;
        phone: string;
        pwd?: string;
        firstName: string;
        lastName: string;
        gender?: number;
        birth?: string;
    }): Promise<void>;
    static generateToken(userObj: IUser): Promise<string>;
    static expireToken(token: string): Promise<void>;
}
export interface IUser {
    user_id: number;
    account: string;
    userData: any;
}
