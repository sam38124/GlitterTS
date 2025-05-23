import { IToken } from '../models/Auth.js';
import { LanguageLocation } from '../Language.js';
import express from 'express';
export declare class App {
    token?: IToken;
    static getAdConfig(app: string, key: string): Promise<any>;
    checkVersion(libraryName: string): Promise<any>;
    createApp(cf: {
        appName: string;
        copyApp: string;
        copyWith: string[];
        brand: string;
        name?: string;
        theme?: string;
        sub_domain: string;
    }): Promise<boolean>;
    updateThemeConfig(body: {
        theme: string;
        config: any;
    }): Promise<boolean>;
    changeTheme(config: {
        app_name: string;
        theme: string;
    }): Promise<boolean>;
    getAPP(query: {
        app_name?: string;
        theme?: string;
    }): Promise<any>;
    getTemplate(query: {
        app_name?: string;
        template_from: 'all' | 'me';
    }): Promise<any>;
    getAppConfig(config: {
        appName: string;
    }): Promise<any>;
    getOfficialPlugin(): Promise<any>;
    static checkBrandAndMemberType(app: string): Promise<{
        memberType: any;
        brand: any;
        userData: any;
        domain: any;
        plan: any;
        user_id: any;
    }>;
    static preloadPageData(appName: string, refer_page: string, language: LanguageLocation, req: express.Request): Promise<any>;
    setAppConfig(config: {
        appName: string;
        data: any;
    }): Promise<boolean>;
    postTemplate(config: {
        appName: string;
        data: any;
    }): Promise<boolean>;
    putSubDomain(cf: {
        app_name: string;
        name: string;
    }): Promise<boolean>;
    addDNSRecord(domain: string): Promise<unknown>;
    setSubDomain(config: {
        original_domain: string;
        appName: string;
        domain: string;
    }): Promise<any>;
    setDomain(config: {
        original_domain: string;
        appName: string;
        domain: string;
    }): Promise<any>;
    deleteAPP(config: {
        appName: string;
    }): Promise<void>;
    constructor(token?: IToken);
    static getSupportLanguage(appName: string): Promise<any>;
    static getDefLanguage(appName: string): Promise<any>;
}
