"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainCheck = void 0;
const database_1 = __importDefault(require("./modules/database"));
const nginx_conf_1 = require("nginx-conf");
const process_1 = __importDefault(require("process"));
const fs_1 = __importDefault(require("fs"));
class DomainCheck {
    static async initial() {
        try {
            const app_list = await database_1.default.query(`SELECT \`domain\`,appName FROM glitter.app_config where domain like '%shopnex.tw%' order by id desc;`, []);
            let data = fs_1.default.readFileSync(`/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/test.conf`).toString();
            for (const b of app_list.reverse()) {
                let result = await new Promise((resolve, reject) => {
                    nginx_conf_1.NginxConfFile.createFromSource(data, (err, conf) => {
                        const server = [];
                        for (const a of conf.nginx.server) {
                            if (!a.server_name.toString().includes(`server_name ${b.domain};`)) {
                                server.push(a);
                            }
                            else {
                                console.log(`gfilter`);
                            }
                        }
                        conf.nginx.server = server;
                        resolve(conf.toString());
                    });
                });
                result += `\n\nserver {
    server_name ${b.domain};
       location /api-public/v1/ {
                                      proxy_pass http://127.0.0.1:3080;
                                      proxy_set_header X-Real-IP $remote_addr;
                                      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                                      proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
                              }
         location /api/v1/ {
                  proxy_pass http://127.0.0.1:3080;
                  proxy_set_header X-Real-IP $remote_addr;
                  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
          }

            location /websocket {
                  proxy_pass http://127.0.0.1:9003;
                  proxy_http_version 1.1;
                  proxy_set_header Upgrade $http_upgrade;
                  proxy_set_header Connection "Upgrade";
              }
    location / {
       proxy_pass http://127.0.0.1:3080/${b.appName}/;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
    listen 443 ssl;
    ssl_certificate ${process_1.default.env.ssl_certificate};
    ssl_certificate_key ${process_1.default.env.ssl_certificate_key};
}
server {
    if ($host = ${b.domain}) {
        return 301 https://$host$request_uri;
    }
    server_name ${b.domain};
    listen 80;
    return 404;
}
`;
                data = result;
            }
            fs_1.default.writeFileSync('/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/nginx.config', data);
            console.log(`finish===>`);
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.DomainCheck = DomainCheck;
//# sourceMappingURL=domain-check.js.map