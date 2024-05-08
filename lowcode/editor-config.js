export class EditorConfig {
    static get editor_layout() {
        switch ((window.glitterBase)) {
            case 'shopnex':
                return {
                    main_color: '#FFB400',
                    btn_background: 'linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);'
                };
            default:
                return {
                    main_color: '#295ed1',
                    btn_background: '#295ed1',
                };
        }
    }
}
EditorConfig.page_type_list = [
    {
        title: '網站頁面',
        value: 'page'
    }, {
        title: '嵌入模塊',
        value: 'module'
    },
    {
        title: '頁面模板',
        value: 'article'
    },
    {
        title: '商品頁樣板',
        value: 'product'
    }, {
        title: '後台插件',
        value: 'backend'
    }, {
        title: '表單插件',
        value: 'form_plugin'
    }
];
