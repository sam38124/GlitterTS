import db from '../../modules/database.js';
import {User} from "./user.js";
import axios from "axios";
import {Cart} from "./shopping.js";
import tool from "../../services/tool.js";
import express from "express";
import {IToken} from "../models/Auth.js";
import exception from "../../modules/exception.js";

export class FbApi {
    public app_name: string
    public token?: IToken

    constructor(app_name: string,token?:IToken) {
        this.app_name = app_name
        this.token=token
    }

    public async config() {

        const cf = await new User(this.app_name).getConfigV2({
            key: 'login_fb_setting',
            user_id: 'manager'
        })
        return {
            link: `https://graph.facebook.com/v22.0/${cf.pixel}/events`.trim(),
            api_token: cf.api_token
        }
    }

    //結帳
    public async checkOut(data: Cart) {
        const cf = await this.config();
        if (cf.link && cf.api_token) {
            return await new Promise<boolean>(async (resolve, reject) => {
                try {
                    axios
                        .post(cf.link, JSON.stringify({
                            data: [{
                                "event_name": "Purchase",
                                "event_time": (new Date().getTime() / 1000).toFixed(0),
                                "action_source": "website",
                                "user_data": {
                                    "em": [
                                        tool.hashSHA256(data.customer_info.email)
                                    ],
                                    "ph": [
                                        tool.hashSHA256(data.customer_info.phone)
                                    ],
                                    "client_ip_address": data.client_ip_address,
                                    "fbc": data.fbc,
                                    "fbp": data.fbp
                                },
                                "custom_data": {
                                    "currency": "TWD",
                                    "value": data.total
                                }
                            }],
                            access_token: cf.api_token
                        }), {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then((response: any) => {
                            console.log('FB APIC已成功發送:', response.data);
                            resolve(response.data);
                        })
                        .catch((error: any) => {
                            console.error('發送FB APIC發生錯誤:', error.response ? error.response.data : error.message);
                            resolve(false)
                        });
                } catch (e) {
                    console.error(e)
                    resolve(false)
                }

            })
        }
    }

    //
    public async post(data: any,req:express.Request) {
    try {
        const cf = await this.config();
        console.log(`cf.link=>`,this.app_name)
        console.log(`cf.link=>`,cf.link)
        console.log(`cf.api_token=>`,cf.api_token)
        if (cf.link && cf.api_token) {
            data.user_data={
                "client_ip_address": (req.query.ip || req.headers['x-real-ip'] || req.ip) as string,
                "fbc": req.cookies._fbc,
                "fbp": req.cookies._fbp
            }
            if(this.token){
                const dd=(await new User(this.app_name).getUserData(this.token.userID as any, 'userID'))
                if(dd && dd.userData){
                    const email=dd.userData.email;
                    const phone=dd.userData.phone;
                    email && (data.user_data.email=[tool.hashSHA256(email)])
                    phone && (data.user_data.ph=[tool.hashSHA256(phone)])
                }
            }
            data.event_time=(new Date().getTime() / 1000).toFixed(0);
            // data.action_source='website'
            // data.test_event_code='TEST82445'
            // console.log(data)
            return await new Promise<boolean>(async (resolve, reject) => {
                try {
                    axios
                        .post(cf.link, JSON.stringify({
                            data: [data],
                            access_token: cf.api_token,
                        }), {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then((response: any) => {
                            console.log('FB APIC已成功發送:', response.data);
                            resolve(response.data);
                        })
                        .catch((error: any) => {
                            console.error('發送FB APIC發生錯誤:', error.response ? error.response.data : error.message);
                            resolve(false)
                        });
                } catch (e) {
                    console.error(e)
                    resolve(false)
                }

            })
        }
    }catch (e:any) {
        console.error(e)
        throw exception.BadRequestError(e.code ?? 'BAD_REQUEST', e, null);
    }
    }
}