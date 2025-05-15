import { IToken } from '../models/Auth.js';
export interface LanguageData {
    title: string;
    seo: {
        domain: string;
        title: string;
        content: string;
        keywords: string;
    };
}
export declare class Shopee {
    app: string;
    token: IToken | undefined;
    private type;
    static get path(): "https://partner.test-stable.shopeemobile.com" | "https://partner.shopeemobile.com";
    get partner_id(): string | undefined;
    get partner_key(): string | undefined;
    constructor(app: string, token?: IToken, type?: string);
    generateUrl(partner_id: string, api_path: string, timestamp: number): string;
    generateShopUrl(partner_id: string, api_path: string, timestamp: number, access_token: string, shop_id: number): string;
    private cryptoSign;
    generateAuth(redirectUrl: string): string;
    getToken(code: string, shop_id: string): Promise<void>;
    static getItemProgress: string[];
    getItemList(start: string, end: string, index?: number): Promise<{
        type: string;
        message: any;
        data?: undefined;
        error?: undefined;
    } | {
        type: string;
        data: any;
        message: string;
        error?: undefined;
    } | {
        data: any;
        message: string;
        type?: undefined;
        error?: undefined;
    } | {
        type: string;
        error: any;
        message: any;
        data?: undefined;
    } | undefined>;
    getProductDetail(id: number, option?: {
        skip_image_load: boolean;
    }): Promise<false | {
        template: string;
        visible: string;
        preview_image: any[];
        relative_product: any[];
        active_schedule: {
            endDate: undefined;
            startTime: string;
            endTime: undefined;
            startDate: string;
        };
        content_array: any[];
        channel: string[];
        collection: any[];
        variants: any[];
        title: string;
        ai_description: string;
        content: string;
        specs: any[];
        language_data: {
            "en-US": {
                content_array: any[];
                title: string;
                seo: {
                    keywords: string;
                    domain: string;
                    title: string;
                    content: string;
                };
                content: string;
            };
            "zh-TW": {
                title: any;
                seo: any;
            };
            "zh-CN": {
                content_array: any[];
                title: string;
                seo: {
                    keywords: string;
                    domain: string;
                    title: string;
                    content: string;
                };
                content: string;
            };
        };
        hideIndex: string;
        seo: {
            keywords: string;
            domain: string;
            title: string;
            content: string;
        };
        productType: {
            product: boolean;
            addProduct: boolean;
            giveaway: boolean;
        };
        content_json: any[];
        status: string;
    } | undefined>;
    asyncStockToShopee(obj: {
        product: any;
        access_token?: string;
        shop_id?: string;
        callback: (response?: any) => void;
    }): Promise<void>;
    asyncStockFromShopnex(): Promise<any>;
    fetchShopeeAccessToken(): Promise<any>;
    getOrderList(start: string, end: string, index?: number): Promise<{
        type: string;
        message: any;
        data?: undefined;
        error?: undefined;
    } | {
        type: string;
        data: any;
        message: string;
        error?: undefined;
    } | {
        data: any;
        message: string;
        type?: undefined;
        error?: undefined;
    } | {
        type: string;
        error: any;
        message: any;
        data?: undefined;
    } | undefined>;
    getInitial(obj: any): {
        type: string;
        title: string;
        ai_description: string;
        language_data: {
            'en-US': {
                title: string;
                seo: {
                    domain: string;
                    title: string;
                    content: string;
                    keywords: string;
                };
                content: string;
                content_array: never[];
            };
            'zh-CN': {
                title: string;
                seo: {
                    domain: string;
                    title: string;
                    content: string;
                    keywords: string;
                };
                content: string;
                content_array: never[];
            };
            'zh-TW': {
                title: any;
                seo: any;
            };
        };
        productType: {
            product: boolean;
            addProduct: boolean;
            giveaway: boolean;
        };
        content: string;
        visible: string;
        status: string;
        collection: never[];
        hideIndex: string;
        preview_image: never[];
        specs: never[];
        variants: never[];
        seo: {
            title: string;
            content: string;
            keywords: string;
            domain: string;
        };
        relative_product: never[];
        template: string;
        content_array: never[];
        content_json: never[];
        active_schedule: {
            startDate: string;
            startTime: string;
            endDate: undefined;
            endTime: undefined;
        };
        channel: string[];
    };
    private getDateTime;
    uploadFile(file_name: string, fileData: Buffer): Promise<string>;
    downloadImage(imageUrl: string): Promise<Buffer>;
}
