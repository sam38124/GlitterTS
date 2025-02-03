import db from './modules/database';
import {Ssh} from "./modules/ssh.js";
import {NginxConfFile} from "nginx-conf";
import process from "process";
import fs from "fs";
import AWS from "aws-sdk";
import config from "./config.js";
export class DomainCheck{
    public  static async initial(){
        try {
            const app_list=await db.query(`SELECT \`domain\`,appName FROM glitter.app_config where domain like '%shopnex.tw%' order by id desc;`,[])
            let data =  fs.readFileSync(`/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/test.conf`).toString();
            for (const b of app_list.reverse()){
            //     if(b.domain.includes('shopnex.tw')){
            //         const route53 = new AWS.Route53();
            //         route53.changeResourceRecordSets({
            //             ChangeBatch: {
            //                 Changes: [
            //                     {
            //                         Action: 'UPSERT', // 或 'UPSERT' 如果記錄已存在
            //                         ResourceRecordSet: {
            //                             Name: b.domain, // 您的域名
            //                             Type: 'A',
            //                             TTL: 1, // 時間以秒為單位，TTL 的數值
            //                             ResourceRecords: [
            //                                 {
            //                                     Value: config.sshIP!, // 目標 IP 地址
            //                                 },
            //                             ],
            //                         },
            //                     },
            //                 ],
            //                 Comment: 'Adding A record for example.com',
            //             },
            //             HostedZoneId: config.AWS_HostedZoneId!, // 您的托管區域 ID
            //         }, function (err, data) {
            //             console.log(`err-->`,err)
            //             console.log(data)
            //         })
            //         await new Promise((resolve, reject)=>{
            //             setTimeout(()=>{resolve(true)},100)
            //         })
            //     }

                let result: string = await new Promise((resolve, reject) => {
                    NginxConfFile.createFromSource(data as string, (err, conf) => {
                        const server: any = [];
                        for (const a of conf!.nginx.server as any) {

                            if (!a.server_name.toString().includes(`server_name ${b.domain};`) ) {
                                server.push(a);
                            }else{
                                console.log(`gfilter`)
                            }
                        }
                        conf!.nginx.server = server;
                        resolve(conf!.toString());
                    });
                });
                result += `\n\nserver {
    server_name ${b.domain};
    location / {
       proxy_pass http://127.0.0.1:3080/${b.appName}/;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
    listen 443 ssl;
    ssl_certificate ${process.env.ssl_certificate};
    ssl_certificate_key ${process.env.ssl_certificate_key};
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
                data=result
            }
            fs.writeFileSync('/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/nginx.config', data);
            console.log(`finish===>`)
        }catch (e){
            console.log(e)
        }

    }
}