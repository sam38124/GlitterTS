interface Data {
    readHEX: string;
    readBytes: [number];
    readUTF: string;
}
interface Device {
    name: string;
    address: string;
    readHEX: string;
    readBytes: number[];
    readUTF: string;
    rssi: string;
}
export declare class BLEHelper {
    setBleCallback: (cb: {
        needGPS?: () => void;
        onConnectFalse?: () => void;
        onConnectSuccess?: () => void;
        onConnecting?: () => void;
        onDisconnect?: () => void;
        requestPermission?: (permission: any) => void;
        rx?: (data: Data) => void;
        tx?: (data: Data) => void;
        scanBack?: (device: [Device]) => void;
    }) => void;
    glitter: any;
    constructor(glitter: any);
    requestPermission(callback: (result: boolean) => void): void;
    bleIsOpen(callback: (result: boolean) => void): void;
    startScan(callback: (result: boolean) => void): void;
    stopScan(callback: (result: boolean) => void): void;
    isDiscovering(callback: (result: boolean) => void): void;
    connect(device: {
        address: string;
        timeOut: number;
    }, callback: (result: boolean) => void): void;
    disconnect(callback: (result: boolean) => void): void;
    isConnect(callback: (result: boolean) => void): void;
    setNotify(rxChannel: string, callback: (result: boolean) => void): void;
    writeHex(data: {
        data: string;
        rxChannel: string;
        txChannel: string;
    }, callback: (result: boolean) => void): void;
    writeUTF(data: {
        data: string;
        rxChannel: string;
        txChannel: string;
    }, callback: (result: boolean) => void): void;
    writeByteArray(data: {
        data: [number];
        rxChannel: string;
        txChannel: string;
    }, callback: (result: boolean) => void): void;
}
export {};
