"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ssh = void 0;
const ssh2_1 = require("ssh2");
const process = __importStar(require("process"));
const fs_1 = __importDefault(require("fs"));
class Ssh {
    static async exec(array) {
        const conn = new ssh2_1.Client();
        const sshConfig = {
            host: process.env.sshIP,
            port: 22,
            username: 'ubuntu',
            privateKey: fs_1.default.readFileSync(process.env.ssh),
        };
        return new Promise(async (resolve, reject) => {
            conn.on('ready', async () => {
                console.log('SSH 连接已建立');
                let response = [];
                for (const c of array) {
                    console.log(c);
                    await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            conn.exec(c, (err, stream) => {
                                if (err) {
                                    console.log(err);
                                    resolve(true);
                                }
                                else {
                                    stream.on('close', (code, signal) => {
                                        console.log(`命令Close: ${code}`);
                                        resolve(true);
                                    }).on('data', (data) => {
                                        response.push(data);
                                        console.log(`命令输出: ${data}`);
                                        resolve(true);
                                    });
                                }
                                ;
                            });
                        }, 100);
                    });
                }
                conn.end();
                resolve(response);
            }).connect(sshConfig);
            conn.on('error', (err) => {
                console.error('SSH 连接错误:', err);
                conn.end();
                resolve(false);
            });
        });
    }
    static async readFile(remote) {
        const conn = new ssh2_1.Client();
        const sshConfig = {
            host: process.env.sshIP,
            port: 22,
            username: 'ubuntu',
            privateKey: fs_1.default.readFileSync(process.env.ssh),
        };
        console.log(`privateKey--`, sshConfig);
        return new Promise(async (resolve, reject) => {
            conn.on('ready', async () => {
                console.log('SSH 连接已建立');
                const fileName = `${new Date().getTime()}`;
                conn.sftp((err, sftp) => {
                    if (err) {
                        resolve(false);
                    }
                    else {
                        sftp.fastGet(remote, `${fileName}`, (err) => {
                            if (err) {
                                console.log(err);
                                resolve(false);
                            }
                            resolve(fs_1.default.readFileSync(fileName, 'utf-8'));
                            fs_1.default.rmSync(fileName);
                            conn.end();
                        });
                    }
                    ;
                });
            }).connect(sshConfig);
            conn.on('error', (err) => {
                console.error('SSH 连接错误:', err);
                conn.end();
                resolve(false);
            });
        });
    }
}
exports.Ssh = Ssh;
//# sourceMappingURL=ssh.js.map