"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambda = exports.createViewComponent = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const fs_2 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function setup(config) {
    let data = JSON.stringify(config.auth);
    axios_1.default.request({
        method: 'post',
        url: config.domain + '/api/v1/user/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then((response) => {
        const token = response.data.userData.token;
        axios_1.default.request({
            method: 'get',
            url: `${config.domain}/api/v1/private?appName=${config.app_name}&key=sql_api_config_post`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
            let postData = config.router.map((dd) => {
                return {
                    "sql": `{
 execute: ${dd.execute.toString()}
}`,
                    "type": dd.type,
                    "route": dd.route,
                    "title": dd.name,
                    "expand": false
                };
            });
            axios_1.default.request({
                method: 'post',
                url: `${config.domain}/api/v1/private`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "appName": config.app_name,
                    "key": "sql_api_config_post",
                    "value": {
                        "expand": true,
                        "firebase": config.firebase,
                        "apiList": postData
                    }
                })
            })
                .then((response) => {
                console.log("部署成功");
            })
                .catch((error) => {
                console.log(error);
            });
        })
            .catch((error) => {
            console.log(error);
        });
    })
        .catch((error) => {
        console.log(error);
    });
}
function create_function(fun) {
    return fun;
}
function createViewComponent(config) {
    const cloneConfig = JSON.parse(JSON.stringify(config));
    return new Promise((resolve, reject) => {
        (new Promise(async (resolve, reject) => {
            var _a;
            let waitPush = [];
            let lastRead = {};
            try {
                lastRead = JSON.parse(fs_2.default.readFileSync('glitter.buildInfo', 'utf8'));
            }
            catch (e) {
            }
            function readPath(path, parent, prefix) {
                fs_2.default.readdirSync(path).map((file) => {
                    if (fs_2.default.lstatSync(`${path}/${file}`).isDirectory()) {
                        readPath(`${path}/${file}`, parent, prefix);
                    }
                    else if (path_1.default.extname(`${path}/${file}`) !== ".ts" && path_1.default.extname(`${path}/${file}`) !== ".ts~") {
                        const stats = fs_2.default.statSync(`${path}/${file}`);
                        const pathRoute = path_1.default.relative(path_1.default.resolve(parent), path_1.default.resolve(`${path}/${file}`));
                        if (!lastRead[pathRoute] || lastRead[pathRoute] < (stats.mtime.getTime())) {
                            console.log(`修改了:${path}/${file}`);
                            lastRead[pathRoute] = stats.mtime.getTime();
                            waitPush.push({
                                path: `${path}/${file}`,
                                prefix: prefix,
                                name: pathRoute
                            });
                        }
                    }
                });
            }
            config.router.map((dd) => {
                readPath(dd.path, dd.path, dd.prefix);
            });
            if (waitPush.length === 0) {
                resolve(true);
                return;
            }
            const token = await new Promise((resolve, reject) => {
                axios_1.default.request({
                    method: 'post',
                    url: config.domain + '/api/v1/user/login',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(config.auth)
                })
                    .then((response) => {
                    resolve(response.data.userData.token);
                }).catch((error) => {
                    resolve(false);
                });
            });
            if (!token) {
                console.log(`部署失敗．`);
                resolve(false);
                return;
            }
            function upload(path, fileName) {
                return new Promise(async (resolve, reject) => {
                    const fileData = await fs_1.default.readFileSync(path);
                    axios_1.default.request({
                        method: 'post',
                        url: `${config.domain}/api/v1/fileManager/uploadTemplate`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "fileName": fileName,
                            "app": config.app_name,
                        })
                    }).then((response) => {
                        const data1 = response.data;
                        axios_1.default.request({
                            method: 'put',
                            url: data1.url,
                            headers: {
                                'Content-Type': data1.type
                            },
                            data: fileData
                        })
                            .then((response) => {
                            console.log(`上傳成功:${data1.fullUrl}`);
                            resolve(data1.fullUrl);
                        }).catch((error) => {
                            console.log(`上傳失敗:${fileName}`);
                            reject(false);
                        });
                    }).catch((e) => {
                        console.log(e);
                        console.log(`上傳失敗:${fileName}`);
                        reject(false);
                    });
                });
            }
            for (const b of chunkArray(waitPush, 200)) {
                const result = await new Promise((resolve, reject) => {
                    let count = 0;
                    for (let c = 0; c < b.length; c++) {
                        let falRetry = 3;
                        function exe() {
                            if (fs_1.default.statSync(b[c].path).size === 0) {
                                count++;
                                if (count === b.length) {
                                    resolve(true);
                                }
                            }
                            else {
                                upload(b[c].path, b[c].prefix + "/" + b[c].name).then((data) => {
                                    count++;
                                    if (count === b.length) {
                                        resolve(true);
                                    }
                                }).catch((reason) => {
                                    falRetry--;
                                    if (falRetry == 0) {
                                        resolve(false);
                                    }
                                    else {
                                        setTimeout(() => {
                                            exe();
                                        }, 100);
                                    }
                                });
                            }
                        }
                        exe();
                    }
                });
                if (!result) {
                    console.log(`上傳檔案失敗`);
                    resolve(false);
                    return;
                }
            }
            const data = await new Promise((resolve, reject) => {
                axios_1.default.request({
                    method: 'get',
                    url: `${config.domain}/api/v1/app/plugin?appName=${config.app_name}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    resolve(response.data.data);
                }).catch((e) => {
                    console.log(e);
                    console.log(`取得失敗`);
                    reject(false);
                });
            });
            const appPrefix = await new Promise((resolve, reject) => {
                axios_1.default.request({
                    method: 'get',
                    url: `${config.domain}/api/v1/fileManager/templatePrefix?app=${config.app_name}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    resolve(response.data.domain);
                }).catch((e) => {
                    console.log(e);
                    console.log(`取得失敗`);
                    reject(false);
                });
            });
            data.lambdaView = ((_a = data.lambdaView) !== null && _a !== void 0 ? _a : []).filter((dd) => {
                return !config.router.find((d2) => {
                    return dd.prefix === d2.prefix;
                });
            });
            config.router.map((d2) => {
                data.lambdaView = data.lambdaView.concat(d2.interface.map((dd) => {
                    dd.path = appPrefix + "/" + d2.prefix + "/" + dd.path;
                    dd.prefix = d2.prefix;
                    return dd;
                }));
            });
            await new Promise((resolve, reject) => {
                axios_1.default.request({
                    method: 'put',
                    url: `${config.domain}/api/v1/app/plugin`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        appName: config.app_name,
                        config: data
                    })
                }).then((response) => {
                    resolve(response.data.data);
                }).catch((e) => {
                    console.log(e);
                    console.log(`上傳配置檔失敗`);
                    reject(false);
                });
            });
            console.log(`部署成功`);
            fs_2.default.writeFileSync(`glitter.buildInfo`, JSON.stringify(lastRead));
            resolve(true);
        })).then(() => {
            if (config.loop) {
                setTimeout(() => {
                    createViewComponent(cloneConfig);
                }, 500);
            }
        });
    });
}
exports.createViewComponent = createViewComponent;
function chunkArray(array, groupSize) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}
exports.lambda = {
    setup: setup,
    create_function: create_function,
    createViewComponent: createViewComponent
};
//# sourceMappingURL=interface.js.map