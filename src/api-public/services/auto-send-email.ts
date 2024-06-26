import {User} from "../services/user.js";


export class AutoSendEmail{
    public static async getDefCompare(app_string:string,tag: string) {
        const dataList: any = [
            {
                tag: 'auto-email-shipment-arrival',
                tag_name: '商品到貨',
                title: `[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達`,
                content: `[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 已到達`,
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-shipment',
                tag_name: '商品出貨',
                title: `[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中`,
                content: '[@{{app_name}}] #@{{訂單號碼}} 送貨狀態 更新為: 出貨中',
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-payment-successful',
                tag_name: '訂單付款成功',
                title: `[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款`,
                content: '[@{{app_name}}] #@{{訂單號碼}} 付款狀態 更新為: 已付款',
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-order-create',
                tag_name: '訂單成立',
                title: `[@{{app_name}}]  你的訂單 #@{{訂單號碼}} 已成立 `,
                content: '[@{{app_name}}]  你的訂單 #@{{訂單號碼}} 已成立',
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-order-cancel-success',
                tag_name: '取消訂單成功',
                content: '[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}}',
                title: `[@{{app_name}}] 您已成功取消訂單 #@{{訂單號碼}} `,
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-order-cancel-false',
                tag_name: '取消訂單失敗',
                content: '[@{{app_name}}] 取消訂單申請 #@{{訂單號碼}} 已失敗',
                title: `[@{{app_name}}] 取消訂單申請 #@{{訂單號碼}} 已失敗`,
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-birthday',
                tag_name: '生日祝福',
                content: '[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！',
                title: `[@{{app_name}}] [@{{user_name}}] 今天是您一年一度的大日子！祝您生日快樂！`,
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-welcome',
                tag_name: '歡迎信件',
                content: '[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店',
                title: `[@{{app_name}}] 歡迎您加入@{{app_name}}！ 最豐富的選品商店`,
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-verify',
                tag_name: '信箱驗證',
                content: '嗨！歡迎加入 @{{app_name}}，請輸入驗證碼「 @{{code}}  」。請於1分鐘內輸入並完成驗證。',
                title: '[@{{app_name}}] 帳號認證通知',
                name:'@{{app_name}}',
                toggle: true
            },
            {
                tag: 'auto-email-forget',
                tag_name: '忘記密碼',
                content: '[@{{app_name}}] 重設密碼',
                title: '[@{{app_name}}] 重設密碼',
                name:'@{{app_name}}',
                toggle: true
            }
        ]
        const keyData = await new User(app_string).getConfigV2({
            key:tag,
            user_id:'manager'
        });
        const appData = await new User(app_string).getConfigV2({
            key:'store-information',
            user_id:'manager'
        });
        const b = dataList.find((dd: any) => {
            return dd.tag === tag
        })!
        if (keyData) {
            b.title = keyData.title || b.title;
            b.toggle = keyData.toggle ?? true;
            b.content = keyData.content || b.content;
            b.name=keyData.name || b.name;
            b.updated_time = new Date(keyData.updated_time);
        }
        Object.keys(b).map((dd)=>{
            if(typeof b[dd]==='string'){
                b[dd]=b[dd].replace(/@\{\{app_name\}\}/g,((appData) && appData.shop_name) || '商店名稱')
            }

        })
        return b
    }
}