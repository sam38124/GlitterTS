export declare function sendMessage(key: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
}, message: {
    notification: {
        title: string;
        body: string;
    };
    type: "topic" | "token";
    for: string;
}, appName: string): void;
