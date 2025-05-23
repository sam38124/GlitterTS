"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmail = sendmail;
exports.verifyDomain = verifyDomain;
exports.verifyStatus = verifyStatus;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const client_ses_1 = require("@aws-sdk/client-ses");
async function sendmail(sender, recipient, subject, body, callback) {
    aws_sdk_1.default.config.update({ region: 'us-west-2' });
    const domain = 'brand.com';
    const ses = new aws_sdk_1.default.SES();
    function sendEmail(sender, recipient, subject, body) {
        const params = {
            Source: sender,
            Destination: {
                ToAddresses: [recipient],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Html: {
                        Data: body,
                    },
                },
            },
        };
        ses.sendEmail(params, (err, data) => {
            if (err) {
                callback && callback(false);
                console.log('Error sending email:', err);
            }
            else {
                callback && callback(true);
                console.log(`Email sent! Email:${recipient} Message ID:`, data.MessageId);
            }
        });
    }
    sendEmail(sender, recipient, subject, body);
}
async function verifyDomain(domain) {
    const client = new client_ses_1.SESClient({ region: 'us-west-2' });
    const verifyDomain = await client.send(new client_ses_1.VerifyDomainIdentityCommand({
        Domain: domain,
    }));
    console.log('SPF 記錄:', verifyDomain.VerificationToken);
    const dkim = await client.send(new client_ses_1.VerifyDomainDkimCommand({
        Domain: domain,
    }));
    console.log('DKIM 記錄:', dkim.DkimTokens);
}
async function verifyStatus(domain) {
    const client = new client_ses_1.SESClient({ region: 'us-west-2' });
    const verifyStatus = await client.send(new client_ses_1.GetIdentityVerificationAttributesCommand({
        Identities: [domain]
    }));
    return verifyStatus;
}
//# sourceMappingURL=ses.js.map