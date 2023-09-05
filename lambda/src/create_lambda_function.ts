import {lambda} from "ts-glitter/src/lambda/interface";
import {sample} from "./lambda/sample";

lambda.setup({
    auth: {
        //Your glitter account.
        account: 'your_account',
        //Your glitter pwd.
        pwd: 'your_pwd'
    },
    //Glitter platform domain.
    domain: 'http://127.0.0.1:4000',
    //Your glitter app name.
    app_name: 'fortest',
    router: [
        /** Add restful api with get method.
         * http://127.0.0.1:4000
         ***/
        {
            route:'test',
            name:"測試",
            type:'get',
            execute:sample
        }
    ],
})
