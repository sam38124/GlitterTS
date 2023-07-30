"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambda = void 0;
const axios_1 = __importDefault(require("axios"));
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
exports.lambda = {
    setup: setup,
    create_function: create_function,
};
//# sourceMappingURL=interface.js.map