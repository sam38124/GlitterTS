import Tool from "../../modules/tool.js";
import express from "express";
import {IToken} from "../models/Auth.js";
import db from '../../modules/database';
import {saasConfig} from "../../config.js";
export class Monitor{
    public static async insertHistory(obj:{
        req:express.Request,
        token?:IToken,
        req_type:'api'|'file'
    }){
        try {
            const req=obj.req
            if(['::ffff:172.17.0.1','ffff:127.0.0.1'].includes((req.headers['x-real-ip'] || req.ip) as string) ){
                return
            }
            let mac_address = req.cookies.mac_address;
            if(!mac_address){
                mac_address=Tool.randomString(10)
                req.res?.cookie('mac_address',mac_address)
            }
            await db.query(`insert into \`${saasConfig.SAAS_NAME}\`.t_monitor set ?`,[
                {
                    ip:req.headers['x-real-ip'] || req.ip ,
                    app_name:req.get('g-app') || 'unknown',
                    user_id: obj.token ? obj.token.userID : 'guest',
                    mac_address:req.get('mac_address') || mac_address,
                    base_url:req.baseUrl,
                    req_type:obj.req_type
                }
            ])
        }catch (e) {

        }
  }


}