import { IToken } from '../models/Auth.js';
export interface PageData {
    name: string;
    id: string;
    access_token: string;
    picture?: string;
}
export interface PagesResponse {
    data: PageData[];
}
export declare class FacebookService {
    app: string;
    token: IToken;
    constructor(app: string, token: IToken);
    getOauth(obj: {
        code: string;
    }): Promise<void>;
    getAuthPage(): Promise<{
        name: string;
        id: string;
        access_token: string;
        picture: string;
        live_video: any;
    }[]>;
    launchFacebookLive(liveData: any): Promise<void>;
    getLiveComments(scheduled_id: string, liveID: string, accessToken: string, after?: string): Promise<PagesResponse>;
}
export declare function getFacebookPages(accessToken: string): Promise<PageData[]>;
export declare function getFacebookPagePicture(id: string): Promise<string>;
export declare function getFacebookPageLiveVideo(id: string, accessToken: string): Promise<any>;
