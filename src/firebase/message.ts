import admin from 'firebase-admin';


export function sendMessage(key:  {
    projectId: string;
    clientEmail: string;
    privateKey: string;
}, message: {
    notification: {
        title: string,
        body: string,
    },
    type:"topic"|"token",
    for:string
},appName:string) {

    const messaging = (admin.apps.find((dd)=>dd?.name==appName)) ?? admin.initializeApp({credential: admin.credential.cert(key)},appName);
    const postConfig:any = {};
    postConfig[message.type]=message.for;
    postConfig.notification=message.notification;
    (messaging).messaging().send(postConfig)
        .then((response:any) => {
            console.log('成功發送推播：', response);
        })
        .catch((error:any) => {
            console.error('發送推播時發生錯誤：', error);
        });
}

