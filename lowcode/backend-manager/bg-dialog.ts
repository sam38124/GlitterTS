import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { PageSplit } from './splitPage.js';
import { Tool } from '../modules/tool.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { Article } from '../glitter-base/route/article.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { ApiStock } from '../glitter-base/route/stock.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { Language, LanguageLocation } from '../glitter-base/global/language.js';
import { FormModule } from '../cms-plugin/module/form-module.js';
import { FormCheck } from '../cms-plugin/module/form-check.js';
import { TableStorage } from '../cms-plugin/module/table-storage.js';
import { ProductAi } from '../cms-plugin/ai-generator/product-ai.js';
import { imageLibrary } from '../modules/image-library.js';
import { Animation } from '../glitterBundle/module/Animation.js';

const html = String.raw;
const css = String.raw;

export interface Option {
  key: string;
  value: string;
  note?: string;
  image?: string;
  icon?: string;
}

export class BgDialog {
  gvc: GVC;
  glitter: any;
  isMobile: Boolean;
  prefix: string;

  constructor(gvc: GVC) {
    this.gvc = gvc;
    this.glitter = gvc.glitter;
    this.isMobile = window.innerWidth <= 768;
    this.prefix = Tool.randomString(6);

    this.init();
  }

  private init() {
    this.gvc.addStyle(css`
      .${this.prefix}_body {
        border-radius: 10px;
        background: #fff;
        overflow-y: auto;
        min-width: calc(100vw - 180px);
        max-width: calc(100vw - 20px);
      }

      .${this.prefix}_header {
        width: 100%;
        display: flex;
        align-items: center;
        background: #f2f2f2;
        padding: 12px 20px;
      }

      .${this.prefix}_btn {
        display: flex;
        padding: 3.25px 18px;
        align-items: center;
        gap: 8px;
        border-radius: 10px;
      }

      .${this.prefix}_save {
        background: #393939;
      }

      .${this.prefix}_cancel {
        background: #fff;
        border: 1px solid #ddd;
      }

      .${this.prefix}_footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 20px 20px 20px;
      }

      .${this.prefix}_footer_left {
        display: flex;
        align-items: center;
        justify-content: start;
      }

      .${this.prefix}_footer_right {
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 14px;
      }
    `);
  }

  static select(obj: { gvc: GVC; default: string; options: Option[]; callback: (value: string) => void }) {
    return html` <select
      class="c_select c_select_w_100"
      onchange="${obj.gvc.event(e => {
        return obj.callback(e.value);
      })}"
    >
      ${obj.options
        .map(opt => {
          return html` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>
            ${opt.value}
          </option>`;
        })
        .join('')}
      ${obj.options.find(opt => obj.default === opt.key)
        ? ''
        : html`<option class="d-none" selected>請選擇項目</option>`}
    </select>`;
  }

  save(event: string, text: string = '完成'): string {
    return html` <button class="btn ${this.prefix}_btn ${this.prefix}_save" type="button" onclick="${event}">
      <span class="tx_700_white">${text}</span>
    </button>`;
  }

  cancal(event: string, text: string = '取消'): string {
    return html` <button class="btn ${this.prefix}_btn ${this.prefix}_cancel" type="button" onclick="${event}">
      <span class="tx_700">${text}</span>
    </button>`;
  }

  viewAllSelect(event: string, text: string = '檢視已選取項目'): string {
    return html`<span
      style="color: #4D86DB; font-size: 16px; font-weight: 400; cursor:pointer; overflow-wrap: break-word;"
      onclick="${event}"
      >${text}</span
    >`;
  }

  clearAll(event: string, text: string = '清除全部'): string {
    return html`<span style="margin-right: 8px; font-size: 16px; text-decoration: underline;" onclick="${event}"
      >${text}</span
    >`;
  }

  marketShop() {
    const gvc = this.gvc;
    const glitter = this.glitter;

    const marketOptions = [
      { key: 'hidden', value: '隱形賣場' },
      { key: 'onepage', value: '一頁商店' },
      { key: 'group', value: '拼團賣場' },
      { key: 'recommend', value: '分銷連結' },
    ];

    return glitter.innerDialog(
      (gvc: GVC) => {
        const vm = {
          id: gvc.glitter.getUUID(),
          loading: false,
        };

        return html` <div class="${this.prefix}_body">
          ${gvc.bindView({
            bind: vm.id,
            view: () => {
              if (vm.loading) {
                return 'Loading';
              }

              return html` <div class="${this.prefix}_header">
                  <div class="tx_700">產品列表</div>
                  <div class="flex-fill"></div>
                </div>
                <div class="c_dialog">
                  <div class="c_dialog_body">
                    <div class="c_dialog_main" style="height: auto; max-height: 500px; gap: 24px;">
                      ${BgDialog.select({
                        gvc,
                        default: marketOptions[0].key,
                        options: marketOptions,
                        callback: value => {
                          console.log(value);
                        },
                      })}
                    </div>
                    <div class="${this.prefix}_footer">
                      <div class="${this.prefix}_footer_left">
                        ${this.viewAllSelect(
                          gvc.event(() => {
                            console.log('viewAllSelect');
                          }),
                          '檢視已選商品(12)'
                        )}
                      </div>
                      <div class="${this.prefix}_footer_right">
                        ${[
                          this.clearAll(
                            gvc.event(() => {
                              console.log('clearAll');
                            })
                          ),
                          this.cancal(
                            gvc.event(() => {
                              console.log('cancal');
                            })
                          ),
                          this.save(
                            gvc.event(() => {
                              console.log('save');
                            })
                          ),
                        ].join('')}
                      </div>
                    </div>
                  </div>
                </div>`;
            },
          })}
        </div>`;
      },
      gvc.glitter.getUUID(),
      {
        animation: Animation.fade,
      }
    );
  }
}
