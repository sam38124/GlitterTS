import { ToolSetting } from '../../jspage/function-page/tool-setting.js';
const html = String.raw;
export class Bridge {
    static grayButton(text, event, obj) {
        var _a;
        return html ` <button class="btn btn-gray ${(obj === null || obj === void 0 ? void 0 : obj.class) || ''}" type="button" onclick="${event}">
      <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}" style="color: #393939"></i>
      ${text.length > 0 ? html `<span class="tx_700" style="${(_a = obj === null || obj === void 0 ? void 0 : obj.textStyle) !== null && _a !== void 0 ? _a : ''}">${text}</span>` : ''}
    </button>`;
    }
    static select(obj) {
        var _a;
        return html ` ${obj.title ? html ` <div class="tx_normal fw-normal mb-2">${obj.title}</div>` : ``}
      <select
        class="c_select c_select_w_100"
        style="${(_a = obj.style) !== null && _a !== void 0 ? _a : ''}; ${obj.readonly ? 'background: #f7f7f7;' : ''}"
        onchange="${obj.gvc.event(e => {
            obj.callback(e.value);
        })}"
        ${obj.readonly ? 'disabled' : ''}
      >
        ${obj.gvc.map(obj.options.map(opt => html ` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>
                ${opt.value}
              </option>`))}
        ${obj.options.find((opt) => {
            return obj.default === opt.key;
        })
            ? ``
            : `<option class="d-none" selected>${obj.place_holder || `請選擇項目`}</option>`}
      </select>`;
    }
    static main(obj) {
        console.log(`refer_form_data=>`, obj.widget);
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const is_sub_page = ['pages/', 'hidden/', 'shop/'].find((dd) => {
            return (glitter.getUrlParameter('page') || '').startsWith(dd);
        });
        const c_view = [
            `<div style="height:5px;"></div>`,
        ];
        c_view.push(ToolSetting.item({
            gvc: gvc,
            dd: (() => {
                switch (glitter.share.editorViewModel.selectItem.data.tag) {
                    case 'c_header':
                        return {
                            title: '標頭選單',
                            tag: '標頭元件',
                            hint: (is_sub_page) ? `
                此頁面標頭將預設為以下樣式
                ` : `全館 (首頁,隱形賣場,一頁式網頁) 的標頭將預設為以下樣式`,
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
        }));
        c_view.push(`<div style="height:1px;" class="border-top mx-n3"></div>`);
        return c_view.join(`<div style="height:10px;"></div>`);
    }
}
window.glitter.setModule(import.meta.url, Bridge);
