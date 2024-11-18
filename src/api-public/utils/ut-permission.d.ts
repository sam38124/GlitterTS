/// <reference types="cookie-parser" />
import express from 'express';
export declare class UtPermission {
    static isManager(req: express.Request): Promise<unknown>;
    static isManagerTokenCheck(app_name: string, user_id: string): Promise<unknown>;
    static isAppUser(req: express.Request): Promise<unknown>;
}
