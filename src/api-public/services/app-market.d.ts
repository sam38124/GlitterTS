import { IToken } from '../models/Auth.js';
interface AppData {
    id: number;
    app_id: string;
    name: string;
    image: string;
    link: string;
    rate: number;
    rate_count: number;
    description: string;
    tag: string[];
    price: number;
    download_count: number;
    update_time: string;
    create_time: string;
    expiration_time: string;
}
export declare class MarketService {
    app: string;
    token: IToken | undefined;
    constructor(app: string, token?: IToken);
    getAppList(): Promise<AppData[]>;
    getInstallAppList(): Promise<AppData[]>;
    getPublishtdAppList(): Promise<AppData[]>;
}
export {};
