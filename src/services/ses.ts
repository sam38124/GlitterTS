import AWS from 'aws-sdk';
import {
  SESClient,
  VerifyDomainIdentityCommand,
  VerifyDomainDkimCommand,
  GetIdentityVerificationAttributesCommand,
} from '@aws-sdk/client-ses';

export async function sendmail(
  sender: any,
  recipient: any,
  subject: any,
  body: any,
  callback?: (result: boolean) => void
) {
  // 設定 AWS 區域
  AWS.config.update({ region: 'us-west-2' }); // 根據您的區域調整 region
  const domain = 'brand.com';
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
        callback && callback(false);
        console.log('Error sending email:', err);
      } else {
        callback && callback(true);
        console.log(`Email sent! Email:${recipient} Message ID:`, data.MessageId);
      }
    });
  }

  // 使用 SMTP 發送郵件
  sendEmail(sender, recipient, subject, body);
}

export async function verifyDomain(domain: string) {
  const client = new SESClient({ region: 'us-west-2' });
  // Step 1: 驗證網域身份
  const verifyDomain = await client.send(
    new VerifyDomainIdentityCommand({
      Domain: domain,
    })
  );
  console.log('SPF 記錄:', verifyDomain.VerificationToken); // 顯示要加入 DNS 的 TXT 記錄
  // Step 2: 啟用 DKIM
  const dkim = await client.send(
    new VerifyDomainDkimCommand({
      Domain: domain,
    })
  );
  console.log('DKIM 記錄:', dkim.DkimTokens); // 共三組，加入 TXT 記錄 default._domainkey.brand.com ...
}

export async function verifyStatus(domain:string){
  const client = new SESClient({ region: 'us-west-2' });
  const verifyStatus = await client.send(new GetIdentityVerificationAttributesCommand({
    Identities: [domain]
  }));

  return verifyStatus
}
//