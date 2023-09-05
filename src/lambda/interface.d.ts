export interface DB {
    query: (sql: string, par: any[]) => Promise<string[]>;
}
export interface USER {
    userID: number;
    userData: any;
    account: string;
    created_time: Date;
    status: number;
}
declare function setup(config: {
    firebase?: {
        projectId: string;
        clientEmail: string;
        privateKey: string;
    };
    auth: {
        account: string;
        pwd: string;
    };
    domain: string;
    app_name: string;
    router: {
        name: string;
        route: string;
        type: 'post' | 'delete' | 'get' | 'put';
        execute: (db: DB, request: {
            user?: USER;
            data: any;
            app: string;
            firebase: {
                sendMessage: (message: {
                    notification: {
                        title: string;
                        body: string;
                    };
                    type: "topic" | "token";
                    for: string;
                }) => void;
            };
        }) => Promise<any>;
    }[];
}): void;
declare function create_function(fun: (db: DB, request: {
    user?: USER;
    data: any;
    app: string;
    query: any;
    firebase: {
        sendMessage: (message: {
            notification: {
                title: string;
                body: string;
            };
            type: "topic" | "token";
            for: string;
        }) => void;
    };
}) => Promise<any>): (db: DB, request: {
    user?: USER | undefined;
    data: any;
    app: string;
    query: any;
    firebase: {
        sendMessage: (message: {
            notification: {
                title: string;
                body: string;
            };
            type: "topic" | "token";
            for: string;
        }) => void;
    };
}) => Promise<any>;
export declare function createViewComponent(config: {
    domain: string;
    app_name: string;
    auth: {
        account: string;
        pwd: string;
    };
    router: {
        prefix: string;
        path: string;
        interface: {
            name: string;
            path: string;
            key: string;
        }[];
    }[];
    loop: boolean;
}): Promise<unknown>;
export declare const lambda: {
    setup: typeof setup;
    create_function: typeof create_function;
    createViewComponent: typeof createViewComponent;
};
export {};
