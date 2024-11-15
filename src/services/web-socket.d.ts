export declare class WebSocket {
    static chatMemory: {
        [key: string]: {
            id: any;
            user_id: string;
            callback: (data: any) => void;
        }[];
    };
    static messageChangeMem: {
        [userID: string]: {
            id: any;
            callback: (data: any) => void;
        }[];
    };
    static noticeChangeMem: {
        [userID: string]: {
            id: any;
            callback: (data: any) => void;
        }[];
    };
    static posDeviceList: {
        [app_name: string]: {
            device_id: string;
            callback: (json: any) => void;
            connect_device: string;
        }[];
    };
    static getDeviceList: {
        [app_name: string]: {
            device_id: string;
            callback: (json: any) => void;
            connect_device: string;
        }[];
    };
    static start(): void;
    static userMessage(): void;
}
export declare class PosCallback {
    static updateDevice(app_name: string): void;
    static connect(connect_id: string, device_id: string, app_name: string): void;
    static disconnect_device(connect_id: string, device_id: string, app_name: string): void;
    static disconnect_paired(local: string, who: string, app_name: string): void;
    static sendToPos(device_id: string, app_name: string, data: any): void;
    static sendToPosReal(device_id: string, app_name: string, data: any): void;
}
