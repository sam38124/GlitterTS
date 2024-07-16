export class EditorConfig {
    static get editor_layout() {
        switch (window.glitterBase) {
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
    static paymentInfo(gvc) {
        if (gvc.glitter.getUrlParameter('function') !== 'backend-manger') {
            return ``;
        }
        const plan = EditorConfig.getPaymentStatus();
        let text = '';
        let paymentBtn = `<span style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700; text-decoration: underline; word-wrap: break-word;cursor: pointer;"  class="" onclick="${gvc.event(() => {
            gvc.glitter.setUrlParameter('tab', 'member_plan');
            gvc.recreateView();
        })}">前往續約</span>`;
        let differenceInTime = new Date(plan.dead_line).getTime() - new Date().getTime();
        let differenceInDays = (differenceInTime / (1000 * 3600 * 24)).toFixed(0);
        if (plan.plan === 'free' && differenceInDays > 1) {
            text = `<span style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700;" class="me-3">方案提醒：當前為免費試用方案，立即升級方案，享受全方位支援服務。</span>${paymentBtn}`;
        }
        else if (new Date(plan.dead_line).getTime() < new Date().getTime()) {
            text = `<span style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700; ">方案到期提醒：您的方案已過期，為維護您的權益，請儘速${paymentBtn}。</span>`;
        }
        else if (differenceInDays < 30) {
            text = `<span style="color: white; font-size: 16px; font-family: Noto Sans; font-weight: 700; ">方案到期提醒：您的方案將於${differenceInDays}天後到期，為維護您的權益，請儘速${paymentBtn}。</span>`;
        }
        else {
            return ``;
        }
        return `<div class="position-fixed vw-100 p-2" style="z-index:999;margin-top:56px;width: 100%; min-height: 42px; background: #FEAD20; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08); ">
  <div style="text-align: center;white-space:normal;" class="w-100">
    <i class="fa-sharp fa-solid fa-bullhorn" style="color: white;"></i>
    ${text}
  </div>
</div>`;
    }
    static getPaddingTop(gvc) {
        return EditorConfig.paymentInfo(gvc)
            ? gvc.glitter.ut.frSize({
                sm: 40,
            }, 67)
            : 0;
    }
    static getPaymentStatus() {
        const config = window.parent.glitter.share.editorViewModel.app_config_original;
        let planText = 'free';
        if (config.plan === 'basic') {
            planText = 'basic';
        }
        else if (config.plan === 'web+app') {
            planText = 'web+app';
        }
        return {
            plan: planText,
            dead_line: config.dead_line,
        };
    }
}
EditorConfig.page_type_list = [
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
EditorConfig.color_setting_config = [
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
