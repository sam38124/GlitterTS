"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainCheck = void 0;
const database_1 = __importDefault(require("./modules/database"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_js_1 = __importDefault(require("./config.js"));
class DomainCheck {
    static async initial() {
        try {
            const app_list = await database_1.default.query(`SELECT \`domain\`,appName FROM glitter.app_config where domain like '%shopnex.cc%' order by id desc;`, []);
            for (const b of app_list.reverse()) {
                if (b.domain.includes('shopnex.cc')) {
                    const route53 = new aws_sdk_1.default.Route53();
                    route53.changeResourceRecordSets({
                        ChangeBatch: {
                            Changes: [
                                {
                                    Action: 'UPSERT',
                                    ResourceRecordSet: {
                                        Name: b.domain,
                                        Type: 'A',
                                        TTL: 1,
                                        ResourceRecords: [
                                            {
                                                Value: config_js_1.default.sshIP,
                                            },
                                        ],
                                    },
                                },
                            ],
                            Comment: 'Adding A record for example.com',
                        },
                        HostedZoneId: config_js_1.default.AWS_HostedZoneId,
                    }, function (err, data) {
                        console.log(`err-->`, err);
                        console.log(data);
                    });
                    await new Promise((resolve, reject) => {
                        setTimeout(() => { resolve(true); }, 100);
                    });
                }
            }
        }
        catch (e) { }
    }
}
exports.DomainCheck = DomainCheck;
//# sourceMappingURL=domain-check.js.map