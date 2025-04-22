"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmail = void 0;
async function sendmail(sender, recipient, subject, body, callback) {
    const AWS = require('aws-sdk');
    AWS.config.update({ region: 'us-west-2' });
    const ses = new AWS.SES();
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
exports.sendmail = sendmail;
//# sourceMappingURL=ses.js.map