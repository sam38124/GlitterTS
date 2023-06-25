function sendmail() {
    const AWS = require('aws-sdk');

// 設定 AWS 區域
    AWS.config.update({region: 'us-west-2'}); // 根據您的區域調整 region

// 建立 SES 服務的連線
    const ses = new AWS.SES();

    function sendEmail(sender: any, recipient: any, subject: any, body: any) {
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

        ses.sendEmail(params, (err: any, data: any) => {
            if (err) {
                console.log('Error sending email:', err);
            } else {
                console.log('Email sent! Message ID:', data.MessageId);
            }
        });
    }

    // 使用 SMTP 發送郵件
    sendEmail(
        'service@ncdesign.info',
        'sam38124@gmail.com',
        'Test Email',
        `<h1>Please verify your email address</h1><p>Click the following link to verify your email address: <a href="https://your-website.com/verify-email?email=' + encodeURIComponent(email) + '">Verify</a></p>`
    );

}

sendmail()