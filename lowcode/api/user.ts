import {config} from "../config.js";
import {BaseApi} from "./base.js";

export class ApiUser{
    constructor() {  }

    public static login(userData:{
        "account": string,
        "pwd": string
    }){

        return BaseApi.create({
            "url": config.url+"/api/v1/user/login",
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(userData)
        })
    }
}