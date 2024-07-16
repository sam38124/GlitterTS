import {saasConfig} from "../../config.js";
import db from '../../modules/database.js';
import {Firebase} from "../../modules/firebase.js";
import {sendmail} from "../../services/ses.js";
import process from "process";

//管理員通知
export class ManagerNotify {
    public app_name: string

    constructor(app_name: string) {
        this.app_name = app_name
    }

    public async getSaasAPP() {
        const return_data = (await db.query(`select brand, user
                                             from \`${saasConfig.SAAS_NAME}\`.app_config
                                             where appName = ?`, [this.app_name]))[0];
        const account = await db.query(`select account
                                        from \`${return_data.brand}\`.t_user
                                        where userID = ?`, [return_data.user])
        return_data.account = account[0].account
        return return_data
    }

    //新用戶註冊
    public async userRegister(cf: {
        user_id: string
    }) {
        if(this.app_name==='shopnex'){
            this.saasRegister({
                user_id:  cf.user_id
            })
        }
        const saas = await this.getSaasAPP()
        const user_data = (await db.query(`select *
                                           from \`${this.app_name}\`.t_user
                                           where userID = ?`, [
            cf.user_id
        ]))[0];
        if (await this.checkNotify('register')) {
            const link = `./index?type=editor&appName=${this.app_name}&function=backend-manger&tab=user_list`
            new Firebase(saas.brand).sendMessage({
                title: `帳號註冊通知`,
                userID: saas.user,
                tag: 'register',
                link: link,
                body: `新用戶『 ${user_data.userData.name} 』註冊了帳號。`
            })
            await this.sendEmail(saas.account, '帳號註冊通知', `新用戶『 ${user_data.userData.name} 』註冊了帳號。`, link)
        }
        return true
    }

    //SHOPNEX註冊通知事項
    public async saasRegister(cf: {
        user_id: string
    }){

        const link = `https://shopnex.cc/contact-us`
        new Firebase(this.app_name).sendMessage({
            title: `歡迎使用SHOPNEX`,
            userID: cf.user_id,
            tag: 'welcome',
            link: link,
            body: `歡迎使用SHOPNEX開店平台，立即撥打諮詢電話:0978028730，提供免費諮詢服務。`
        })
    }

    //Checkout and payment success
    public async checkout(cf:{
        orderData:any,
        status:number,
    }){

        const saas = await this.getSaasAPP();
        const link = `./index?type=editor&appName=${this.app_name}&function=backend-manger&tab=order_list`


        new Firebase(saas.brand).sendMessage({
            title: `您有新訂單`,
            userID: saas.user,
            tag: 'checkout',
            link: link,
            body: `您有一筆新訂單 <br>『 ${cf.orderData.orderID} 』${(cf.status) ? `已付款`:`尚未付款`}，消費總金額 : ${cf.orderData.total} 。`
        })
    }

    //表單提交
    public async formSubmit(cf:{
        user_id: string
    }){
        const saas = await this.getSaasAPP();
        const link = `./index?type=editor&appName=${this.app_name}&function=backend-manger&tab=form_receive`;
        const user_data = (await db.query(`select *
                                           from \`${this.app_name}\`.t_user
                                           where userID = ?`, [
            cf.user_id
        ]))[0];
        new Firebase(saas.brand).sendMessage({
            title: `您有新表單`,
            userID: saas.user,
            tag: 'formSubmit',
            link: link,
            body: `收到來自『${user_data.userData.name}』提交的表單。`
        })
    }

    public async sendEmail(email: string, title: string, content: string, href: string) {
        try {
            const html = String.raw
            const text = html`
                <table width="100%" border="0" cellpadding="0" cellspacing="0"
                       style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(65, 65, 65); font-family: sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; background-color: rgb(255, 255, 255);"
                       id="isPasted">
                    <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                    <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                        <td style="box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;">

                            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0"
                                   style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; --bs-gutter-x: 1.5rem; --bs-gutter-y: 0; display: flex; flex-wrap: wrap; margin-top: calc(-1 * var(--bs-gutter-y)); margin-right: calc(-0.5 * var(--bs-gutter-x)); margin-left: calc(-0.5 * var(--bs-gutter-x)); border: none; empty-cells: show; max-width: 100%;">
                                <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased; flex-shrink: 0; width: 1055.59px; max-width: 100%; padding-right: calc(var(--bs-gutter-x) * 0.5); padding-left: calc(var(--bs-gutter-x) * 0.5); margin-top: var(--bs-gutter-y);">
                                <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                    <td style="box-sizing: border-box; border: 0px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px;">

                                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                                               style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; color: rgb(0, 0, 0); width: 600px; margin: 0px auto;">
                                            <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                            <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                <td width="100%"
                                                    style="box-sizing: border-box; border: 0px; -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;">

                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;">
                                                        <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                        <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                            <td style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; width: 599px;">
                                                                <div align="center"
                                                                     style="box-sizing: border-box; -webkit-font-smoothing: antialiased; line-height: 10px;">
                                                                    <div style="box-sizing: border-box; -webkit-font-smoothing: antialiased; max-width: 600px;">
                                                                        <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1719903595261-s3s4scs3s7sfsfs7.png"
                                                                             class="fr-fic fr-dii"
                                                                             style="width: 100%;">
                                                                        <br>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%;">
                                                        <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                        <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                            <td style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 60px 45px 30px; text-align: left; width: 599px;">

                                                                <h1 style="box-sizing: border-box; margin: 0px; font-weight: 700; line-height: 33.6px; color: rgb(54, 54, 54); font-size: 28px; -webkit-font-smoothing: antialiased; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; direction: ltr; font-family: Arial, Helvetica, sans-serif; text-align: left;"
                                                                    id="isPasted">訊息通知</h1>
                                                                <br>
                                                                <div style="width: 100%;text-align: start;"> @{{text}}</div>
                                                                <br>
                                                                <br><span
                                                                    style="color: rgb(16, 17, 18); font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><a
                                                                    href="${new URL(href, 'https://shopnex.cc')}"
                                                                    target="_blank"
                                                                    style="box-sizing: border-box; color: rgb(255, 255, 255); text-decoration: none; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 148, 2); border-width: 0px; border-style: solid; border-color: transparent; border-radius: 5px; display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 24px; padding-bottom: 15px; padding-top: 15px; text-align: center; width: auto; word-break: keep-all;"
                                                                    id="isPasted"><span
                                                                    style="box-sizing: border-box; -webkit-font-smoothing: antialiased; padding-left: 30px; padding-right: 30px; font-size: 24px; display: inline-block; letter-spacing: normal;"><span
                                                                    style="box-sizing: border-box; -webkit-font-smoothing: antialiased; word-break: break-word; line-height: 48px;"><strong
                                                                    style="box-sizing: border-box; font-weight: 700; -webkit-font-smoothing: antialiased;">前往商店</strong></span></span></a></span>
                                                                <br>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                

                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);">
                                                        <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                        <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                            <td style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 28px 45px 10px;">
                                                                <div style="box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0px; line-height: 19.2px; text-align: left;">

                                                                    <p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;">
                                                                        如果您有任何疑問或需要幫助，我們的團隊隨時在這裡為您提供支持。</p>

                                                                    <p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;">
                                                                        服務電話：+886 978-028-730</p>

                                                                    <p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;">
                                                                        電子郵件：mk@ncdesign.info</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0"
                                                           style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; -webkit-font-smoothing: antialiased; border: none; empty-cells: show; max-width: 100%; word-break: break-word; background-color: rgb(247, 247, 247);">
                                                        <tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                        <tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px; -webkit-font-smoothing: antialiased;">
                                                            <td style="box-sizing: border-box; border: 1px solid rgb(221, 221, 221); -webkit-font-smoothing: antialiased; user-select: text; min-width: 5px; padding: 20px 10px 10px;">
                                                                <div style="box-sizing: border-box; -webkit-font-smoothing: antialiased; color: rgb(16, 17, 18); direction: ltr; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; letter-spacing: 0px; line-height: 16.8px; text-align: center;">

                                                                    <p style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.25rem; -webkit-font-smoothing: antialiased;">
                                                                        <a href="https://shopnex.cc/?article=termsofservice&page=blog_detail"
                                                                           target="_blank" rel="noopener"
                                                                           style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;">服務條款</a>&nbsp;
                                                                        &nbsp; &nbsp; &nbsp; &nbsp; <a
                                                                            href="https://shopnex.cc/?article=privacyterms&page=blog_detail"
                                                                            target="_blank" rel="noopener"
                                                                            style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;">隱私條款</a>&nbsp;
                                                                        &nbsp; &nbsp; &nbsp; &nbsp; <a
                                                                            href="https://shopnex.cc/?article=privacyterms&page=e-commerce-blog"
                                                                            target="_blank" rel="noopener"
                                                                            style="box-sizing: border-box; color: rgb(28, 28, 28); text-decoration: underline; -webkit-font-smoothing: antialiased; transition: color 0.2s ease-in-out 0s; user-select: auto;">開店教學</a>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            `
            sendmail(`SHOPNEX <${process.env.smtp}>`, email, title, text.replace('@{{text}}', content));
        } catch (e) {

        }
    }

    //判斷是否進行推播通知
    public async checkNotify(tag: string) {
        return true
    }
}