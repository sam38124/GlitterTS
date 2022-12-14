interface Data {
    readHEX: string
    readBytes: [number]
    readUTF: string
}

interface Device {
    name: string
    address: string
    readHEX: string
    readBytes: number[]
    readUTF: string
}

export class BLEHelper {
    public setBleCallback: (cb: { needGPS?: () => void; onConnectFalse?: () => void; onConnectSuccess?: () => void; onConnecting?: () => void; onDisconnect?: () => void; requestPermission?: (permission: any) => void; rx?: (data: Data) => void; tx?: (data: Data) => void; scanBack?: (device: [Device]) => void }) => void;
    public glitter: any

    constructor(glitter: any) {
        this.glitter = glitter;
        let map: {
            needGPS?: () => void, onConnectFalse?: () => void, onConnectSuccess?: () => void, onConnecting?: () => void, onDisconnect?: () => void, requestPermission?: (permission: any) => void, rx?: (data: Data) => void, tx?: (data: Data) => void, scanBack?: (device: [Device]) => void
        } = {}
        this.setBleCallback = (cb:{
            needGPS?: () => void, onConnectFalse?: () => void, onConnectSuccess?: () => void, onConnecting?: () => void, onDisconnect?: () => void, requestPermission?: (permission: any) => void, rx?: (data: Data) => void, tx?: (data: Data) => void, scanBack?: (device: [Device]) => void
        }) => {
            glitter.runJsInterFace("Glitter_BLE_SetCallBack", {}, function (response: any) {
                switch (response.function) {
                    case "needGPS":
                        cb.needGPS?.()
                        break
                    case "onConnectFalse":
                        cb.onConnectFalse?.()
                        break
                    case "onConnectSuccess":
                        cb.onConnectSuccess?.()
                        break
                    case "onConnecting":
                        cb.onConnecting?.()
                        break
                    case "onDisconnect":
                        cb.onDisconnect?.()
                        break
                    case "requestPermission":
                        cb.requestPermission?.(response.data)
                        break
                    /**
                     * readHEX,readBytes,readUTF
                     * */
                    case "rx":
                        cb.rx?.(response.data as Data)
                        break
                    case "tx":
                        cb.tx?.(response.data as Data)
                        break
                    /**
                     * device:[{name,address,readHEX,readBytes,readUTF}]
                     * ????????????????????????????????????????????????address??????????????????
                     * */
                    case "scanBack":
                        cb.scanBack?.(response.device)
                        break
                }
            })
        }
    }

    //?????????????????????????????????????????????
    public requestPermission(callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_NeedPermission", {}, function (response: any) {
            callback(response.result)
        })
    }

    //????????????????????????
    public bleIsOpen(callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_IsOpen", {}, function (response: any) {
            callback(response.result)
        })
    }

    //??????????????????
    public startScan(callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_StartScan", {}, function (response: any) {
            callback(response.result)
        })
    }

    //??????????????????
    public stopScan(callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_StopScan", {}, function (response: any) {
            callback(response.result)
        })
    }

    //??????????????????????????????
    public isDiscovering(callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_StopScan", {}, function (response: any) {
            callback(response.result)
        })
    }

    //????????????
    public connect(device: { address: string, timeOut: number }, callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_Connect", device, function (response: any) {
            callback(response.result)
        })
    }

    //????????????
    public disconnect(callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_DisConnect", {},
            function (response: any) {
                callback(response.result)
            })
    }

    //???????????????????????????
    public isConnect(callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_IsConnect", {}, function (response: any) {
            callback(response.result)
        })
    }

    //????????????????????????
    public setNotify(rxChannel: string, callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_SetNotify", {
            rxChannel: rxChannel
        }, function (response: any) {
            callback(response.result)
        })
    }

    //??????HexString
    public writeHex(data: {
        data: string,
        rxChannel: string,
        txChannel: string
    }, callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_WriteHex", data, function (response: any) {
            callback(response.result)
        })
    }

    //??????UTF8
    public writeUTF(data: {
        data: string,
        rxChannel: string,
        txChannel: string
    }, callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_WriteUtf", data, function (response: any) {
            callback(response.result)
        })
    }

    //??????ByteArray
    public writeByteArray(data: {
        data: [number],
        rxChannel: string,
        txChannel: string
    }, callback: (result: boolean) => void) {
        this.glitter.runJsInterFace("Glitter_BLE_WriteBytes", data, function (response: any) {
            callback(response.result)
        })
    }
}

function callbackMessage(message: string) {
    console.log(`BLECallback:${message}`)
}