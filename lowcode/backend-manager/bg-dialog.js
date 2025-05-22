import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { Tool } from '../modules/tool.js';
import { BgWidget } from './bg-widget.js';
import { Animation } from '../glitterBundle/module/Animation.js';
import { Article } from '../glitter-base/route/article.js';
import { ApiRecommend } from '../glitter-base/route/recommend.js';
const html = String.raw;
const css = String.raw;
export class BgDialog {
    constructor(gvc) {
        this.gvc = gvc;
        this.glitter = gvc.glitter;
        this.isMobile = window.innerWidth <= 768;
        this.prefix = Tool.randomString(6);
        this.init();
    }
    init() {
        this.gvc.addStyle(`
      .${this.prefix}_body {
        border-radius: 10px;
        background: #fff;
        overflow-y: auto;
        ${this.isMobile
            ? `
                width: calc(100vw - 20px);
              `
            : `
                min-width: calc(100vw - 40%);
                max-width: calc(100vw - 20px);
              `}
      }

      .${this.prefix}_header {
        width: 100%;
        display: flex;
        align-items: center;
        background: #f2f2f2;
        padding: 12px 20px;
      }

      .${this.prefix}_main {
        max-height: 540px;
        border: 20px solid #fff;
        gap: 0;
        position: relative;
      }

      .${this.prefix}_triple_bar {
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 0;
        background-color: #fff;
      }

      .${this.prefix}_param_bar {
        display: flex;
        margin-top: 8px;
        gap: 10px;
      }

      .${this.prefix}_checkbox_container {
        min-height: 353px;
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
        gap: ${this.isMobile ? 8 : 14}px;
      }

      .${this.prefix}_view_all {
        color: #4d86db;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        overflow-wrap: break-word;
      }

      .${this.prefix}_clear_all {
        margin-right: 8px;
        font-size: 16px;
        text-decoration: underline;
        cursor: pointer;
      }

      .${this.prefix}_icon {
        width: 16px;
        height: 16px;
        margin-right: 8px;
        text-align: center;
      }
    `);
    }
    viewAll(event, text = '檢視已選取項目') {
        return html `<span class="${this.prefix}_view_all" onclick="${event}">${text}</span>`;
    }
    clearAll(event, text = '清除全部') {
        return html `<span class="${this.prefix}_clear_all" onclick="${event}">${text}</span>`;
    }
    shopTypeRecord() {
        return {
            hidden: {
                key: 'hidden',
                icon: html `<i class="fa-solid fa-face-dotted ${this.prefix}_icon"></i>`,
                title: '隱形賣場',
            },
            onepage: {
                key: 'onepage',
                icon: html `<i class="fa-regular fa-file ${this.prefix}_icon"></i>`,
                title: '一頁商店',
            },
            group: {
                key: 'group',
                icon: html `<i class="fa-regular fa-puzzle-piece ${this.prefix}_icon"></i>`,
                title: '拼團賣場',
            },
            recommend: {
                key: 'recommend',
                icon: html `<i class="fa-regular fa-share-nodes ${this.prefix}_icon"></i>`,
                title: '分銷連結',
            },
        };
    }
    marketShop(args) {
        const gvc = this.gvc;
        const glitter = this.glitter;
        const dialog = new ShareDialog(glitter);
        const vm = {
            controllerId: glitter.getUUID(),
            control: 'view',
            mainId: glitter.getUUID(),
            selectedId: glitter.getUUID(),
            loading: true,
            pageType: 'hidden',
            searchType: 'title',
            search: '',
            orderString: '',
            dataList: [],
            filterList: [],
            postData: args.def,
            filterData: [],
        };
        const marketOptions = Object.values(this.shopTypeRecord())
            .filter(item => item.key !== 'group')
            .map(item => {
            return {
                key: item.key,
                value: item.title,
            };
        });
        const searchTypeOptions = [{ key: 'title', value: '賣場名稱' }];
        const resetPostData = () => {
            vm.postData = [
                ...new Set(vm.postData
                    .filter(key => {
                    return !vm.filterList.some(item => item.key === key);
                })
                    .concat(vm.filterData)),
            ];
        };
        const selectedView = (gvc) => {
            const selectedList = vm.dataList.filter(item => vm.postData.includes(item.key));
            const bindView = gvc.bindView({
                bind: vm.selectedId,
                view: () => {
                    return html ` <div class="${this.prefix}_header">
              <div class="tx_700">賣場列表</div>
              <div class="flex-fill"></div>
            </div>
            <div class="c_dialog">
              <div class="c_dialog_body">
                <div class="c_dialog_main ${this.prefix}_main">
                  <div class="${this.prefix}_triple_bar">
                    ${[
                        BgWidget.tripletCheckboxContainer(gvc, '賣場名稱', (() => {
                            if (vm.postData.length === 0)
                                return -1;
                            return vm.postData.length === selectedList.length ? 1 : 0;
                        })(), r => {
                            vm.postData = r === 1 ? selectedList.map(({ key }) => key) : [];
                            gvc.notifyDataChange(vm.selectedId);
                        }),
                        BgWidget.horizontalLine({ margin: 0.5 }),
                    ].join('')}
                  </div>
                  <div class="${this.prefix}_checkbox_container">
                    ${BgWidget.multiCheckboxContainer(gvc, selectedList, vm.postData, text => {
                        vm.postData = text;
                        gvc.notifyDataChange(vm.selectedId);
                    })}
                  </div>
                </div>
                <div class="${this.prefix}_footer">
                  <div class="${this.prefix}_footer_left">
                    ${this.viewAll(gvc.event(() => {
                        gvc.closeDialog();
                        vm.control = 'view';
                    }), '繼續選擇')}
                  </div>
                  <div class="${this.prefix}_footer_right">
                    ${[
                        this.clearAll(gvc.event(() => {
                            if (vm.postData.length > 0) {
                                dialog.checkYesOrNot({
                                    text: '確定要清除所有已選取的選項嗎？',
                                    callback: bool => {
                                        if (bool) {
                                            vm.postData = [];
                                            gvc.notifyDataChange(vm.selectedId);
                                        }
                                    },
                                });
                            }
                        }), this.isMobile ? '全刪' : '清除全部'),
                        BgWidget.cancel(gvc.event(() => {
                            gvc.closeDialog();
                        })),
                        BgWidget.save(gvc.event(() => {
                            args.callback(vm.postData);
                            gvc.closeDialog();
                        }), '完成'),
                    ].join('')}
                  </div>
                </div>
              </div>
            </div>`;
                },
            });
            return html `<div class="${this.prefix}_body">${bindView}</div>`;
        };
        const dialogView = (gvc) => {
            const bindView = gvc.bindView({
                bind: vm.mainId,
                view: () => {
                    if (vm.loading) {
                        return html `<div class="my-4">${BgWidget.spinner()}</div>`;
                    }
                    vm.filterList = vm.dataList.filter(item => item.key.includes(vm.pageType) && item.realname.includes(vm.search));
                    vm.filterData = vm.postData.filter(key => vm.filterList.find(item => item.key === key));
                    const pageTypeSelect = BgWidget.select({
                        gvc,
                        default: vm.pageType,
                        options: marketOptions,
                        callback: value => {
                            vm.pageType = value;
                            vm.search = '';
                            gvc.notifyDataChange(vm.mainId);
                        },
                    });
                    const searchTypeSelect = BgWidget.select({
                        gvc,
                        default: vm.searchType,
                        options: searchTypeOptions,
                        callback: value => {
                            vm.searchType = value;
                            gvc.notifyDataChange(vm.mainId);
                        },
                        style: 'max-width: 120px;',
                    });
                    const searchPlace = BgWidget.searchPlace(gvc.event(e => {
                        vm.search = e.value;
                        gvc.notifyDataChange(vm.mainId);
                    }), vm.search || '', '搜尋賣場名稱', '0', '0');
                    return html ` <div class="${this.prefix}_header">
              <div class="tx_700">賣場列表</div>
              <div class="flex-fill"></div>
            </div>
            <div class="c_dialog">
              <div class="c_dialog_body">
                <div class="c_dialog_main ${this.prefix}_main">
                  <div class="${this.prefix}_triple_bar">
                    ${this.isMobile
                        ? html ` <div class="${this.prefix}_param_bar">${[pageTypeSelect, searchTypeSelect].join('')}</div>
                          <div class="w-100 mt-2">${searchPlace}</div>`
                        : html `${pageTypeSelect}
                          <div class="${this.prefix}_param_bar">
                            ${[searchTypeSelect, html `<div class="w-100">${searchPlace}</div>`].join('')}
                          </div>`}
                    ${[
                        BgWidget.mbContainer(12),
                        BgWidget.tripletCheckboxContainer(gvc, '賣場名稱', (() => {
                            if (vm.filterData.length === 0)
                                return -1;
                            return vm.filterData.length === vm.filterList.length ? 1 : 0;
                        })(), r => {
                            vm.filterData = r === 1 ? vm.filterList.map(({ key }) => key) : [];
                            resetPostData();
                            gvc.notifyDataChange(vm.mainId);
                        }),
                        BgWidget.horizontalLine({ margin: 0.5 }),
                    ].join('')}
                  </div>
                  <div class="${this.prefix}_checkbox_container">
                    ${BgWidget.multiCheckboxContainer(gvc, vm.filterList, vm.filterData, text => {
                        vm.filterData = text;
                        resetPostData();
                        gvc.notifyDataChange(vm.mainId);
                    })}
                  </div>
                </div>
                <div class="${this.prefix}_footer">
                  <div class="${this.prefix}_footer_left">
                    ${this.viewAll(gvc.event(() => {
                        if (vm.postData.length > 0) {
                            gvc.closeDialog();
                            vm.control = 'selected';
                        }
                    }), this.isMobile ? `檢視(${vm.postData.length})` : `檢視已選賣場(${vm.postData.length})`)}
                  </div>
                  <div class="${this.prefix}_footer_right">
                    ${[
                        this.clearAll(gvc.event(() => {
                            if (vm.postData.length > 0) {
                                dialog.checkYesOrNot({
                                    text: '確定要清除所有已選取的選項嗎？',
                                    callback: bool => {
                                        if (bool) {
                                            vm.postData = [];
                                            gvc.notifyDataChange(vm.mainId);
                                        }
                                    },
                                });
                            }
                        }), this.isMobile ? '全刪' : '清除全部'),
                        BgWidget.cancel(gvc.event(() => {
                            gvc.closeDialog();
                        })),
                        BgWidget.save(gvc.event(() => {
                            args.callback(vm.postData);
                            gvc.closeDialog();
                        }), '完成'),
                    ].join('')}
                  </div>
                </div>
              </div>
            </div>`;
                },
                onCreate: () => {
                    if (vm.loading) {
                        vm.dataList = [];
                        Promise.all([
                            Article.get({
                                page: 0,
                                limit: 9999,
                                search: vm.search || undefined,
                                status: '0,1',
                            }),
                            ApiRecommend.getList({
                                page: 0,
                                limit: 9999,
                                data: {},
                                token: window.parent.config.token,
                            }),
                        ]).then(dataArray => {
                            var _a, _b;
                            const [article, recommend] = dataArray;
                            const shopTypeRecord = this.shopTypeRecord();
                            if (Array.isArray((_a = article.response) === null || _a === void 0 ? void 0 : _a.data)) {
                                article.response.data.map((item) => {
                                    if (['hidden', 'shopping'].includes(item.content.page_type)) {
                                        const pageType = item.content.page_type === 'hidden' ? 'hidden' : 'onepage';
                                        vm.dataList.push({
                                            key: `${pageType}-${item.id}`,
                                            name: `${shopTypeRecord[pageType].icon}${item.content.name}`,
                                            realname: item.content.name,
                                        });
                                    }
                                });
                            }
                            if (Array.isArray((_b = recommend.response) === null || _b === void 0 ? void 0 : _b.data)) {
                                recommend.response.data.map((item) => {
                                    vm.dataList.push({
                                        key: `recommend-${item.id}`,
                                        name: `${shopTypeRecord.recommend.icon}${item.content.title}`,
                                        realname: item.content.title,
                                    });
                                });
                            }
                            vm.loading = false;
                            gvc.notifyDataChange(vm.mainId);
                        });
                    }
                },
            });
            return html `<div class="${this.prefix}_body">${bindView}</div>`;
        };
        return gvc.bindView({
            bind: vm.controllerId,
            dataList: [{ obj: vm, key: 'control' }],
            view: () => {
                switch (vm.control) {
                    case 'selected':
                        glitter.innerDialog(selectedView, glitter.getUUID(), { animation: Animation.fade });
                        break;
                    case 'view':
                        glitter.innerDialog(dialogView, glitter.getUUID(), { animation: Animation.fade });
                        break;
                }
                return '';
            },
        });
    }
}
