"use strict";
function sendmail() {
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
    sendEmail('service@ncdesign.info', 'sam38124@gmail.com', 'Test Email', `<h1>Please verify your email address</h1><p>Click the following link to verify your email address: <a href="https://your-website.com/verify-email?email=' + encodeURIComponent(email) + '">Verify</a></p>`);
}
sendmail();
