"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLEHelper = void 0;
class BLEHelper {
    constructor(glitter) {
        this.glitter = glitter;
        let map = {};
        this.setBleCallback = (cb) => {
            glitter.runJsInterFace("Glitter_BLE_SetCallBack", {}, function (response) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                switch (response.function) {
                    case "needGPS":
                        (_a = cb.needGPS) === null || _a === void 0 ? void 0 : _a.call(cb);
                        break;
                    case "onConnectFalse":
                        (_b = cb.onConnectFalse) === null || _b === void 0 ? void 0 : _b.call(cb);
                        break;
                    case "onConnectSuccess":
                        (_c = cb.onConnectSuccess) === null || _c === void 0 ? void 0 : _c.call(cb);
                        break;
                    case "onConnecting":
                        (_d = cb.onConnecting) === null || _d === void 0 ? void 0 : _d.call(cb);
                        break;
                    case "onDisconnect":
                        (_e = cb.onDisconnect) === null || _e === void 0 ? void 0 : _e.call(cb);
                        break;
                    case "requestPermission":
                        (_f = cb.requestPermission) === null || _f === void 0 ? void 0 : _f.call(cb, response.data);
                        break;
                    case "rx":
                        (_g = cb.rx) === null || _g === void 0 ? void 0 : _g.call(cb, response.data);
                        break;
                    case "tx":
                        (_h = cb.tx) === null || _h === void 0 ? void 0 : _h.call(cb, response.data);
                        break;
                    case "scanBack":
                        (_j = cb.scanBack) === null || _j === void 0 ? void 0 : _j.call(cb, response.device);
                        break;
                }
            });
        };
    }
    requestPermission(callback) {
        this.glitter.runJsInterFace("Glitter_BLE_NeedPermission", {}, function (response) {
            callback(response.result);
        });
    }
    bleIsOpen(callback) {
        this.glitter.runJsInterFace("Glitter_BLE_IsOpen", {}, function (response) {
            callback(response.result);
        });
    }
    startScan(callback) {
        this.glitter.runJsInterFace("Glitter_BLE_StartScan", {}, function (response) {
            callback(response.result);
        });
    }
    stopScan(callback) {
        this.glitter.runJsInterFace("Glitter_BLE_StopScan", {}, function (response) {
            callback(response.result);
        });
    }
    isDiscovering(callback) {
        this.glitter.runJsInterFace("Glitter_BLE_StopScan", {}, function (response) {
            callback(response.result);
        });
    }
    connect(device, callback) {
        this.glitter.runJsInterFace("Glitter_BLE_Connect", device, function (response) {
            callback(response.result);
        });
    }
    disconnect(callback) {
        this.glitter.runJsInterFace("Glitter_BLE_DisConnect", {}, function (response) {
            callback(response.result);
        });
    }
    isConnect(callback) {
        this.glitter.runJsInterFace("Glitter_BLE_IsConnect", {}, function (response) {
            callback(response.result);
        });
    }
    setNotify(rxChannel, callback) {
        this.glitter.runJsInterFace("Glitter_BLE_SetNotify", {
            rxChannel: rxChannel
        }, function (response) {
            callback(response.result);
        });
    }
    writeHex(data, callback) {
        this.glitter.runJsInterFace("Glitter_BLE_WriteHex", data, function (response) {
            callback(response.result);
        });
    }
    writeUTF(data, callback) {
        this.glitter.runJsInterFace("Glitter_BLE_WriteUtf", data, function (response) {
            callback(response.result);
        });
    }
    writeByteArray(data, callback) {
        this.glitter.runJsInterFace("Glitter_BLE_WriteBytes", data, function (response) {
            callback(response.result);
        });
    }
}
exports.BLEHelper = BLEHelper;
function callbackMessage(message) {
    console.log(`BLECallback:${message}`);
}
//# sourceMappingURL=interface.js.map