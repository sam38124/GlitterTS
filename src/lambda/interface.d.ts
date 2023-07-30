interface DB {
    query: (sql: string, par: any[]) => Promise<string[]>;
}
interface USER {
    user: {
        userID: string;
        userData: string;
    };
}
declare function setup(config: {
    auth: {
        account: string;
        pwd: string;
    };
    domain: string;
    app_name: string;
    router: {
        name: string;
        route: string;
        execute: (db: DB, user: USER) => Promise<any>;
    }[];
}): void;
declare function create_function(fun: (db: DB, user: USER) => Promise<any>): (db: DB, user: USER) => Promise<any>;
export declare const lambda: {
    setup: typeof setup;
    create_function: typeof create_function;
};
export {};
