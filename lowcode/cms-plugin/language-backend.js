import { BgWidget } from '../backend-manager/bg-widget.js';
import { Language } from '../glitter-base/global/language.js';
const html = String.raw;
export class LanguageBackend {
    static switchBtn(cf) {
        const gvc = cf.gvc;
        return BgWidget.grayButton(html `<div class="d-flex align-items-center" style="gap:5px;">
        <i class="fa-duotone fa-solid fa-earth-americas"></i>${Language.getLanguageText({
            local: true,
            compare: cf.language,
        })}
      </div>`, gvc.event(() => {
            BgWidget.settingDialog({
                gvc: gvc,
                innerHTML: (gvc) => {
                    return gvc.bindView((() => {
                        const id = gvc.glitter.getUUID();
                        const glitter = gvc.glitter;
                        const html = String.raw;
                        let img = '';
                        return {
                            bind: id,
                            view: () => {
                                return html ` <div style="position: relative;word-break: break-all;white-space: normal;">
                      ${BgWidget.grayNote('前往商店設定->商店訊息中，設定支援的語言。')}
                      ${gvc.bindView(() => {
                                    const html = String.raw;
                                    return {
                                        bind: glitter.getUUID(),
                                        view: () => {
                                            const sup = [
                                                {
                                                    key: 'en-US',
                                                    value: '英文',
                                                },
                                                {
                                                    key: 'zh-CN',
                                                    value: '簡體中文',
                                                },
                                                {
                                                    key: 'zh-TW',
                                                    value: '繁體中文',
                                                },
                                            ]
                                                .filter(dd => {
                                                return window.parent.store_info.language_setting.support.includes(dd.key);
                                            })
                                                .sort((dd) => {
                                                return dd.key === cf.language ? -1 : 1;
                                            });
                                            return html ` <div
                              class="d-flex mt-3 flex-wrap align-items-center justify-content-center"
                              style="gap:15px;"
                            >
                              ${sup
                                                .map((dd) => {
                                                return html `
                                    <div
                                      class="px-3 py-1 text-white position-relative d-flex align-items-center justify-content-center"
                                      style="border-radius: 20px;background: #393939;cursor: pointer;width:100px;"
                                      onclick="${gvc.event(() => {
                                                    cf.callback(dd.key);
                                                    gvc.closeDialog();
                                                })}"
                                    >
                                      ${dd.value}
                                      <div
                                        class="position-absolute  text-white rounded-2 px-2 d-flex align-items-center rounded-3 ${dd.key !==
                                                    cf.language
                                                    ? `d-none`
                                                    : ``}"
                                        style="top: -12px;right: -10px; height:20px;font-size: 11px;background: #ff6c02;"
                                      >
                                        已選擇
                                      </div>
                                    </div>
                                  `;
                                            })
                                                .join('')}
                            </div>`;
                                        },
                                    };
                                })}
                    </div>`;
                            },
                            divCreate: {},
                            onCreate: () => { },
                        };
                    })());
                },
                title: '切換語系',
                footer_html: gvc => {
                    return ``;
                },
                width: 350,
            });
        }));
    }
}
