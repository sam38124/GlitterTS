import { ToolSetting } from '../../jspage/function-page/tool-setting.js';
export class Bridge {
    static main(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        return [
            `<div style="height:5px;"></div>`,
            ToolSetting.item({
                gvc: gvc,
                dd: (() => {
                    switch (glitter.share.editorViewModel.selectItem.data.tag) {
                        case 'c_header':
                            return {
                                title: '標頭選單',
                                tag: '標頭元件',
                                hint: `全館 (首頁,隱形賣場,一頁式網頁) 的標頭將預設為以下樣式`,
                                toggle: true
                            };
                        case 'footer':
                            return {
                                title: '頁腳選單',
                                tag: '頁腳元件',
                                hint: `全館 (首頁,隱形賣場,一頁式網頁) 的頁腳將預設為以下樣式`,
                                toggle: true
                            };
                        case 'SY00-normal-products':
                        case 'SY02_page_product':
                        case 'SY00-normal-scroll-products':
                            return {
                                title: '商品卡片',
                                tag: '商品卡片',
                                hint: `全館 (首頁,隱形賣場,一頁式網頁) 的商品卡片將預設為以下樣式`,
                                toggle: true,
                                editable: true
                            };
                    }
                })(),
            }),
            `<div style="height:1px;" class="border-top mx-n3"></div>`,
        ].join(`<div style="height:10px;"></div>`);
    }
}
window.glitter.setModule(import.meta.url, Bridge);
