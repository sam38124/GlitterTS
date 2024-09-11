import express from 'express';
export declare class UtPermission {
    static isManager(req: express.Request): Promise<unknown>;
    static isAppUser(req: express.Request): Promise<unknown>;
}
