import { IToken } from '../models/Auth.js';
export declare class LineMessage {
    app: string;
    token: IToken | undefined;
    constructor(app: string, token?: IToken);
    generateAuth(): void;
}
