import { IToken } from "../models/Auth.js";
export declare class GlobalEvent {
    appName: string;
    token: IToken;
    constructor(appName: string, token: IToken);
    addEvent(data: {
        tag: string;
        name: string;
        json: any;
    }): Promise<{
        result: boolean;
    }>;
    putEvent(data: {
        tag: string;
        name: string;
        json: any;
    }): Promise<{
        result: boolean;
    }>;
    deleteEvent(data: {
        tag: string;
    }): Promise<{
        result: boolean;
    }>;
    getEvent(query: {
        tag?: string;
    }): Promise<{
        result: any;
    }>;
}
