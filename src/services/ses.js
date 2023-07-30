"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmail = void 0;
function sendmail(sender, recipient, subject, body) {
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
                console.log('Error sending email:', err);
            }
            else {
                console.log('Email sent! Message ID:', data.MessageId);
            }
        });
    }
    sendEmail(sender, recipient, subject, body);
}
exports.sendmail = sendmail;
//# sourceMappingURL=ses.js.map