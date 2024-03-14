import {Client} from 'ssh2';
import * as process from "process";
import fs from 'fs';


export class Ssh {
    public static async exec(array: string[],ip?:string) {
        const conn = new Client();
        const sshConfig = {
            host: ip || process.env.sshIP,
            port: 22, // 默认 SSH 端口号
            username: 'ubuntu',
            privateKey: fs.readFileSync(process.env.ssh as string), // 用您的私钥路径替换
        };
        return new Promise(async (resolve, reject) => {
            conn.on('ready', async () => {
                console.log('SSH 连接已建立');
                let response:any=[]
                for (const c of array) {
                    console.log(c)
                    await new Promise((resolve, reject) => {
                        setTimeout(()=>{
                            conn.exec(c, (err: any, stream: any) => {
                                if (err){
                                    console.log(err)
                                    resolve(true)
                                }else{
                                    stream.on('close', (code: any, signal: any) => {
                                        console.log(`命令Close: ${code}`);
                                        resolve(true)
                                    }).on('data', (data: any) => {
                                        response.push(data)
                                        console.log(`命令输出: ${data}`);
                                        // resolve(true)
                                    });
                                };
                            })
                        },100)
                    })
                }
                conn.end();
                resolve(response)
            }).connect(sshConfig);

            conn.on('error', (err: any) => {
                console.error('SSH 连接错误:', err);
                conn.end();
                resolve(false)
            });
        })
    }

    public static async readFile(remote:string,ip?:string){
        const conn = new Client();
        const sshConfig = {
            host: ip||process.env.sshIP,
            port: 22, // 默认 SSH 端口号
            username: 'ubuntu',
            privateKey: fs.readFileSync(process.env.ssh as string), // 用您的私钥路径替换
        };
        console.log(`privateKey--`, sshConfig)
        return new Promise(async (resolve, reject) => {
            conn.on('ready', async () => {
                console.log('SSH 连接已建立');
                const fileName=`${new Date().getTime()}`
                conn.sftp((err, sftp) => {
                    if (err){
                        resolve(false)
                    } else {
                        sftp.fastGet(remote, `${fileName}`, (err) => {
                            if (err){
                                console.log(err)
                                resolve(false)
                            }
                            resolve(fs.readFileSync(fileName,'utf-8'))
                            fs.rmSync(fileName)
                            conn.end(); // 关闭SSH连接
                        });
                    };
                });
            }).connect(sshConfig);

            conn.on('error', (err: any) => {
                console.error('SSH 连接错误:', err);
                conn.end();
                resolve(false)
            });
        })

    }

    public static  async uploadFile(file:string,fileName:string,type:'data'|'file'){
        return new Promise((resolve, reject)=>{
            const AWS = require('aws-sdk');
            const fs = require('fs');
            const s3 = new AWS.S3();
            const bucketName = 'liondesign-prd'; // 替换为你的S3存储桶名称

            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body:(type==='data')  ? file:fs.createReadStream(file)
            };

            s3.upload(params, (err:any, data:any) => {
                if (err) {
                    console.error('Error uploading file:', err);
                } else {
                    resolve(data.Location)
                    console.log('File uploaded successfully. S3 URL:', data.Location);
                }
            });
        })

    }
}

