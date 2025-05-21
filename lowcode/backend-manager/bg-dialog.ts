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
import { BgWidget } from './bg-widget.js';

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

  viewAll(event: string, text: string = '檢視已選取項目'): string {
    return html`<span
      style="color: #4D86DB; font-size: 16px; font-weight: 400; cursor: pointer; overflow-wrap: break-word;"
      onclick="${event}"
      >${text}</span
    >`;
  }

  clearAll(event: string, text: string = '清除全部'): string {
    return html`<span
      style="margin-right: 8px; font-size: 16px; text-decoration: underline; cursor: pointer"
      onclick="${event}"
      >${text}</span
    >`;
  }

  marketShop() {
    const gvc = this.gvc;
    const glitter = this.glitter;

    const vm = {
      id: glitter.getUUID(),
      loading: false,
      search: '',
      orderString: '',
    };

    const marketOptions = [
      { key: 'hidden', value: '隱形賣場' },
      { key: 'onepage', value: '一頁商店' },
      { key: 'group', value: '拼團賣場' },
      { key: 'recommend', value: '分銷連結' },
    ];

    const dialogView = (gvc: GVC) => {
      const bindView = gvc.bindView({
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
                <div class="c_dialog_main" style="height: auto; max-height: 500px; gap: 8px;">
                  ${BgWidget.select({
                    gvc,
                    default: marketOptions[0].key,
                    options: marketOptions,
                    callback: value => {
                      console.log(value);
                    },
                  })}
                  <div class="d-flex" style="gap: 10px">
                    ${[
                      BgWidget.select({
                        gvc,
                        default: marketOptions[0].key,
                        options: marketOptions,
                        callback: value => {
                          console.log(value);
                        },
                        style: 'max-width: 120px;',
                      }),
                      html`<div class="w-100">
                        ${BgWidget.searchPlace(
                          gvc.event(e => {
                            vm.search = e.value;
                          }),
                          vm.search || '',
                          '搜尋賣場名稱',
                          '0',
                          '0'
                        )}
                      </div>`,
                      BgWidget.updownFilter({
                        gvc,
                        callback: (value: any) => {
                          vm.orderString = value;
                        },
                        default: vm.orderString || 'default',
                        options: [],
                      }),
                    ].join('')}
                  </div>
                </div>
                <div class="${this.prefix}_footer">
                  <div class="${this.prefix}_footer_left">
                    ${this.viewAll(
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
                      BgWidget.cancel(
                        gvc.event(() => {
                          console.log('cancel');
                          gvc.closeDialog();
                        })
                      ),
                      BgWidget.save(
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
      });

      return html` <div class="${this.prefix}_body">${bindView}</div>`;
    };

    return glitter.innerDialog(dialogView, gvc.glitter.getUUID(), { animation: Animation.fade });
  }
}
