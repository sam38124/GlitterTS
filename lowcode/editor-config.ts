import {GVC} from './glitterBundle/GVController.js';
import {BgWidget} from "./backend-manager/bg-widget.js";

export class EditorConfig {
    public static get editor_layout(): {
        main_color: string;
        btn_background: string;
    } {
        switch ((window as any).glitterBase) {
            case 'shopnex':
                return {
                    main_color: '#FFB400',
                    btn_background: 'linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);',
                };
            default:
                return {
                    main_color: '#295ed1',
                    btn_background: '#295ed1',
                };
        }
    }

    public static page_type_list = [
        {
            title: '網站頁面',
            value: 'page',
        },
        {
            title: '嵌入模塊',
            value: 'module',
        },
        {
            title: '頁面模板',
            value: 'article',
        },
        {
            title: '商品頁樣板',
            value: 'product',
        },
        {
            title: '後台插件',
            value: 'backend',
        },
        {
            title: '表單插件',
            value: 'form_plugin',
        },
    ];

    public static color_setting_config = [
        {
            key: 'background',
            title: '主背景顏色',
        },
        {
            key: 'sec-background',
            title: '次背景顏色',
        },
        {
            key: 'title',
            title: '主標題顏色',
        },
        {
            key: 'sec-title',
            title: '次標題顏色',
        },
        {
            key: 'content',
            title: '內文',
        },
        {
            key: 'solid-button-bg',
            title: '純色按鈕',
        },
        {
            key: 'solid-button-text',
            title: '純色按鈕文字',
        },
        {
            key: 'border-button-bg',
            title: '邊框按鈕',
        },
        {
            key: 'border-button-text',
            title: '邊框按鈕文字',
        },
    ];

    /**
     * 到期日相關頁面設定
     * */
    public static paymentInfo(gvc: GVC) {
        if (EditorConfig.backend_page() !== 'backend-manger') {
            return ``;
        }
        let bg_color = '#FEAD20'
        gvc.glitter.addStyle(`
        .notice_text {
        color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700;
        }
        `)
        function getText(){
            bg_color = '#FEAD20'
            const plan = EditorConfig.getPaymentStatus();
            let text = '';
            let paymentBtn = `<span style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700; text-decoration: underline; word-wrap: break-word;cursor: pointer;"  class="" onclick="${gvc.event(
                () => {
                    gvc.glitter.setUrlParameter('tab', 'member_plan');
                    gvc.recreateView();
                }
            )}">前往續約</span>`;
            // 計算兩個日期的毫秒數之差
            let differenceInTime = new Date(plan.dead_line).getTime() - new Date().getTime();
            // 將毫秒數轉換為天數
            let differenceInDays: any = (differenceInTime / (1000 * 3600 * 24)).toFixed(0);
            if (plan.plan === 'free' && differenceInDays > 1) {
                if (gvc.glitter.getUrlParameter('tab') === 'home_page' || ((gvc.glitter.deviceType !== gvc.glitter.deviceTypeEnum.Web) || document.body.clientWidth > 800)) {
                    text = `<div class="d-flex  flex-column flex-sm-row align-items-center justify-content-center" style="gap:5px;">
<span class="notice_text">立即聯繫開店顧問，專人協助打造高質感官網</span>
<button class="btn btn-black " type="button" style="height:30px;" onclick="${gvc.event(()=>{
    if(gvc.glitter.deviceType !== gvc.glitter.deviceTypeEnum.Web){
        location.href='https://liff.line.me/1645278921-kWRPP32q/?accountId=shopnex'
    }else{
        gvc.glitter.openNewTab(`https://liff.line.me/1645278921-kWRPP32q/?accountId=shopnex`)
    }
                    })}">
            <span class="tx_700_white">聯繫顧問</span>
        </button>
</div>`;
                } else {
                    bg_color = '#ff6c02'
                    text = `

<div class="d-flex  flex-column flex-sm-row align-items-center justify-content-center" style="gap:5px;">
<span class="notice_text">立即下載行動後台APP，享受流暢操作體驗</span>
<button class="btn btn-black " type="button" style="height:30px;" onclick="${gvc.event(()=>{
                        function isAppleDevice() {
                            return /iPhone|iPad|iPod/i.test(navigator.userAgent);
                        }
                        function isAndroidDevice() {
                            return /Android/i.test(navigator.userAgent);
                        }

                        if (isAppleDevice()) {
                            gvc.glitter.openNewTab(`https://apps.apple.com/us/app/shopnex-%E5%85%A8%E9%80%9A%E8%B7%AF%E6%95%B4%E5%90%88%E9%96%8B%E5%BA%97%E5%B9%B3%E5%8F%B0/id6736935325`)
                        } else if (isAndroidDevice()) {
                            gvc.glitter.openNewTab(`https://play.google.com/store/apps/details?id=shopnex.tw`)
                        }
                    })}">
            <span class="tx_700_white">前往下載</span>
        </button>
</div>
`;
                }
            } else if (new Date(plan.dead_line).getTime() < new Date().getTime()) {
                text = ` <i class="fa-sharp fa-solid fa-bullhorn" style="color: white;"></i><span style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700; ">方案到期提醒：您的方案已過期，為維護您的權益，請儘速${paymentBtn}。</span>`;
            } else if (differenceInDays < 30) {
                text = ` <i class="fa-sharp fa-solid fa-bullhorn" style="color: white;"></i><span style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700; ">方案到期提醒：您的方案將於${differenceInDays}天後到期，為維護您的權益，請儘速${paymentBtn}。</span>`;
            } else {
                return ``;
            }
            return  text
        }
        const html = String.raw;
        if(!getText()){
            return  ``
        }
        return gvc.bindView(() => {
            return {
                bind: 'top-notice',
                view: () => {

                    return html`
                        <div style="text-align: center;white-space:normal;" class="w-100">
                            ${getText()}
                        </div>`
                },
                divCreate: ()=>{
                    return {
                        class: `position-fixed vw-100 p-2`,
                        style: `z-index:999;margin-top:${56 + (parseInt(gvc.glitter.share.top_inset, 10) ? (parseInt(gvc.glitter.share.top_inset, 10) + 10) : 0)}px;width: 100%; min-height: 42px; background: ${bg_color}; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);`
                    }
                }
            }
        })
    }

    public static getPaddingTop(gvc: GVC) {
        return EditorConfig.paymentInfo(gvc)
            ? gvc.glitter.ut.frSize(
                {
                    sm: 40,
                },
                67
            )
            : 0;
    }

    public static getPaymentStatus() {
        const config = (window.parent as any).glitter.share.editorViewModel.app_config_original;
        let planText = config.plan || 'free';
        return {
            plan: planText,
            dead_line: config.dead_line,
        };
    }

    public static backend_page(): 'backend-manger' | 'page-editor' | 'user-editor' {
        if ((window as any).glitter.getUrlParameter('page') === 'cms') {
            return 'backend-manger'
        }
        return (window as any).glitter.getUrlParameter('function')
    }

}
