import {lambda} from "ts-glitter/src/lambda/interface";

lambda.createViewComponent({
    //Glitter platform domain.
    domain: 'http://127.0.0.1:4000',
    //Your glitter app name.
    app_name: 'fortest',
    auth: {
        //Your glitter account.
        account: 'rdtest',
        //Your glitter pwd.
        pwd: '12345'
    },
    router: [
        {
            //Prefix with url.
            prefix: `prefix`,
            //Replace to your glitter component path.
            path: `sample/src`,
            //Add the view plugin what you need to add.
            interface: [
                {
                    name: "Lambda測試模塊",
                    path: "plugin/interface.js"
                }
            ]
        }
    ],
    //loop to build and publish your code.
    loop:true
})