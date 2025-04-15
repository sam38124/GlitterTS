"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEC2INFO = exports.terminateInstances = exports.createEC2Instance = void 0;
var aws_sdk_1 = require("aws-sdk");
var process_1 = require("process");
// 配置AWS SDK
aws_sdk_1.default.config.update({
    region: 'ap-east-1', // 替換為您的AWS區域，例如'us-east-1
});
// 建立EC2實例
function createEC2Instance() {
    return __awaiter(this, void 0, void 0, function () {
        var ec2, params, data, instanceId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // 配置AWS SDK
                    aws_sdk_1.default.config.update({
                        region: 'ap-east-1', // 替換為您的AWS區域，例如'us-east-1
                    });
                    ec2 = new aws_sdk_1.default.EC2();
                    params = {
                        ImageId: process_1.default.env.AUTO_SCALING_IMAGE, // 替換為您的AMI ID
                        InstanceType: 't3.micro', // 替換為您的實例類型
                        MinCount: 1,
                        MaxCount: 1,
                        KeyName: process_1.default.env.AWS_KEY, // 替换为你的 Key Pair 名称
                        SecurityGroupIds: [process_1.default.env.SECURITY_ID], // 替换为你的安全组 ID
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ec2.runInstances(params).promise()];
                case 2:
                    data = _a.sent();
                    instanceId = data.Instances[0].InstanceId;
                    console.log('EC2 instance created with ID:', instanceId);
                    return [2 /*return*/, instanceId];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error creating EC2 instance:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.createEC2Instance = createEC2Instance;
// 終止EC2實例
function terminateInstances(instanceId) {
    return __awaiter(this, void 0, void 0, function () {
        var ec2, params, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ec2 = new aws_sdk_1.default.EC2();
                    params = {
                        InstanceIds: [instanceId],
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ec2.terminateInstances(params).promise()];
                case 2:
                    data = _a.sent();
                    console.log('EC2 instance terminated:', data);
                    return [2 /*return*/, true];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error terminating EC2 instance:', error_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.terminateInstances = terminateInstances;
//取得EC2實例的IP
function getEC2INFO(instanceId) {
    var ec2 = new aws_sdk_1.default.EC2();
    var params = {
        InstanceIds: [instanceId],
    };
    return new Promise(function (resolve, reject) {
        // 调用 describeInstances 方法获取实例信息
        ec2.describeInstances(params, function (err, data) {
            if (err) {
                console.error('Error describing EC2 instances:', err);
                resolve(false);
            }
            else {
                // 提取 IP 地址
                resolve({
                    ipAddress: data.Reservations[0].Instances[0].PublicIpAddress,
                    type: data.Reservations[0].Instances[0].InstanceType,
                });
            }
        });
    });
}
exports.getEC2INFO = getEC2INFO;
