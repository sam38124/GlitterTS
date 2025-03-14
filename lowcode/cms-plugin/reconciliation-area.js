import { BgWidget } from '../backend-manager/bg-widget.js';
const html = String.raw;
const globalStyle = {
    header_title: `
        color: #393939;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    `,
    sub_title: `
        color: #393939;
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    `,
    sub_14: `
        color: #393939;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    `,
    chart_width: 223,
    select_date: `
        color: #393939;
        font-size: 14.497px;
        font-style: normal;
        cursor: pointer;
        font-weight: 700;
        line-height: normal;
    `,
    un_select_date: `
        color: #8d8d8d;
        cursor: pointer;
        font-size: 14.497px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    `,
};
export class ReconciliationArea {
    static main(gvc) {
        const vm = {
            filter_date: 'week',
            start_date: '',
            end_date: '',
        };
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return BgWidget.container([
                        ` <div class="title-container">
        ${BgWidget.title(`對帳專區`)}
        <div class="flex-fill"></div>
        <div class="d-flex" style="gap: 14px;">
          ${[
                            BgWidget.grayButton('匯出', gvc.event(() => { })),
                            BgWidget.grayButton('匯入', gvc.event(() => { })),
                        ].join('')}
        </div>
      </div>`,
                        BgWidget.card(gvc.bindView(() => {
                            const id = gvc.glitter.getUUID();
                            const dateId = gvc.glitter.getUUID();
                            let loading = true;
                            return {
                                bind: id,
                                view: () => {
                                    if (loading) {
                                        BgWidget.spinner({
                                            circle: { visible: false },
                                            container: { style: 'margin: 3rem 0;' },
                                        });
                                    }
                                    return html `
                  <div style="${globalStyle.header_title}">統計時間</div>
                  <div
                    class="d-flex flex-wrap align-items-end"
                    style="${document.body.clientWidth < 768 ? `gap: 0px;` : `gap: 12px;`}"
                  >
                    <div class="d-flex flex-column">
                      ${BgWidget.select({
                                        gvc: gvc,
                                        default: vm.filter_date,
                                        callback: key => {
                                            vm.filter_date = key;
                                            gvc.notifyDataChange(dateId);
                                        },
                                        options: [
                                            { key: 'week', value: '近7日' },
                                            { key: '1m', value: '近1個月' },
                                            { key: 'year', value: '近12個月' },
                                            { key: 'custom', value: '自訂日期區間' },
                                        ],
                                        style: 'margin: 8px 0;',
                                    })}
                    </div>
                    ${gvc.bindView({
                                        bind: dateId,
                                        view: () => {
                                            return html ` <div
                          class="d-flex align-items-center flex-wrap ${vm.filter_date === 'custom' ? '' : 'd-none'}"
                          style="gap: 12px;"
                        >
                          <div class="d-flex flex-column">
                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'date',
                                                style: 'display: block; width: 160px; height: 38px;',
                                                default: vm.start_date ? vm.start_date.slice(0, 10) : '',
                                                placeHolder: '',
                                                callback: text => {
                                                    vm.start_date = text ? `${text} 00:00:00` : '';
                                                },
                                            })}
                          </div>
                          <div>至</div>
                          <div class="d-flex flex-column">
                            ${BgWidget.editeInput({
                                                gvc: gvc,
                                                title: '',
                                                type: 'date',
                                                style: 'display: block; width: 160px; height: 38px;',
                                                default: vm.end_date ? vm.end_date.slice(0, 10) : '',
                                                placeHolder: '',
                                                callback: text => {
                                                    vm.end_date = text ? `${text} 23:59:59` : '';
                                                },
                                            })}
                          </div>
                          <div
                            class="d-flex align-items-center justify-content-center ${document.body.clientWidth < 768
                                                ? `w-100`
                                                : ``}"
                          >
                            ${BgWidget.grayButton('查詢', gvc.event(() => {
                                            }), {
                                                class: `w-100`,
                                            })}
                          </div>
                        </div>`;
                                        },
                                    })}
                  </div>
                `;
                                },
                                divCreate: {},
                                onCreate: () => { },
                            };
                        })),
                        html ` <div class="row p-0  mx-n2" style="">
          ${[
                            {
                                title: '應收總金額',
                                value: 10,
                                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                            },
                            {
                                title: '實際入帳總金額',
                                value: 10,
                                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                            },
                            {
                                title: '待入帳總金額',
                                value: 10,
                                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                            },
                            {
                                title: '訂單總數',
                                value: 10,
                                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                            },
                            {
                                title: '應沖總金額',
                                value: 10,
                                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                            },
                            {
                                title: '短收總金額',
                                value: 10,
                                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                            },
                            {
                                title: '多收總金額',
                                value: 10,
                                icon: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1716560642608-clipboard-list-light 1.svg',
                            },
                        ]
                            .map(dd => {
                            return html ` <div
                class="w-100 px-3 py-3"
                style="align-self: stretch; background: white; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.10); border-radius: 10px; overflow: hidden; flex-direction: column; justify-content: center; align-items: flex-start; gap: 10px; display: inline-flex;"
              >
                <div
                  style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 16px; display: inline-flex;"
                >
                  <div
                    style="flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: center; gap: 2px; display: inline-flex;"
                  >
                    <div
                      style="align-self: stretch; color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 500; word-wrap: break-word;"
                    >
                      ${dd.title}
                    </div>
                    <div
                      style="align-self: stretch; color: #393939; font-size: 24px; font-family: Noto Sans; font-weight: 700; word-wrap: break-word;"
                    >
                      ${dd.value}
                    </div>
                   
                  </div>
                </div>
              </div>`;
                        })
                            .map(dd => {
                            return html ` <div class="col-sm-4 col-lg-3 col-12 px-0 px-sm-2 mb-sm-3 mb-1">${dd}</div>`;
                        })
                            .join('')}
        </div>`,
                    ].join(`<div style="height:18px;"></div>`));
                }
            };
        });
    }
}
window.glitter.setModule(import.meta.url, ReconciliationArea);
