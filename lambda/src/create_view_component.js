"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("ts-glitter/src/lambda/interface");
const lam = interface_1.lambda.createViewComponent({
    domain: 'http://127.0.0.1:4000',
    app_name: 'fortest',
    auth: {
        account: 'rdtest',
        pwd: '12345'
    },
    prefix: `prefix`,
    path: `sample/src`,
    interface: [
        {
            name: "Lambda測試模塊",
            path: "plugin/interface.js"
        }
    ]
});
//# sourceMappingURL=create_view_component.js.map