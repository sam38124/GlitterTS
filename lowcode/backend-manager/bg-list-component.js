import { BgWidget } from './bg-widget.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
const html = String.raw;
export class BgListComponent {
    constructor(gvc, vm, filterObj) {
        this.gvc = gvc;
        this.vm = vm;
        this.filterObj = filterObj;
    }
    filterObject(select) {
        const obj = this.filterObj;
        if (!select) {
            return obj;
        }
        if (typeof select === 'string') {
            return obj[select];
        }
        const result = {};
        for (const key of select) {
            result[key] = obj[key];
        }
        return result;
    }
    getFilterObject(select) {
        return JSON.parse(JSON.stringify(this.filterObject(select)));
    }
    static duringInputVerify(during) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (during.length === 2 && dateRegex.test(during[0]) && dateRegex.test(during[1])) {
            const jsDate1 = new Date(during[0]);
            const jsDate2 = new Date(during[1]);
            return jsDate2 >= jsDate1;
        }
        return true;
    }
    tagBadge(key, name, value) {
        return html `<div class="c_filter_tag">
      ${name}：${value}
      <i
        class="fa-solid fa-xmark ms-1"
        style="cursor: pointer"
        onclick="${this.gvc.event(() => {
            this.vm.filter[key] = this.getFilterObject(key);
            this.gvc.notifyDataChange(this.vm.id);
        })}"
      ></i>
    </div>`;
    }
    getFilterTags(items) {
        let h = '';
        items.map(item => {
            const data = this.vm.filter[item.key];
            if (data) {
                switch (item.type) {
                    case 'during':
                        h +=
                            data[0].length > 0 && data[1].length > 0
                                ? this.tagBadge(item.key, item.name, `${data.join(` ${item.data.centerText} `)}`)
                                : '';
                        break;
                    case 'multi_checkbox':
                        h +=
                            data.length > 0
                                ? this.tagBadge(item.key, item.name, item.data
                                    .filter((d) => {
                                    return data.includes(d.key);
                                })
                                    .map((d) => {
                                    return d.name;
                                })
                                    .join(', '))
                                : '';
                        break;
                    case 'radio_and_input':
                        h +=
                            data.value.length > 0
                                ? (() => {
                                    const obj = item.data.find((d) => data.key === d.key);
                                    return this.tagBadge(item.key, item.name, [obj.name, data.value, obj.unit].join(' '));
                                })()
                                : '';
                        break;
                }
            }
        });
        return html `<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px">${h}</div>`;
    }
    showRightMenu(items) {
        const glitter = window.parent.glitter;
        const gvc = glitter.pageConfig[glitter.pageConfig.length - 1].gvc;
        const menu = glitter.share.NormalPageEditor;
        const vmShow = { id: gvc.glitter.getUUID() };
        menu.closeEvent = () => gvc.notifyDataChange(this.vm.id);
        return menu.toggle({
            visible: true,
            title: '篩選',
            view: gvc.bindView(() => {
                return {
                    bind: vmShow.id,
                    view: () => {
                        return html `<!-- Accordion: 篩選 -->
              <div class="accordion" id="accordion${vmShow.id}">
                ${gvc.map(items.length > 0
                            ? items.map((item) => {
                                let contentHTML = '';
                                switch (item.type) {
                                    case 'during':
                                        contentHTML +=
                                            item.data && item.data.list.length > 0
                                                ? BgWidget.duringInputContainer(gvc, item.data, this.vm.filter[item.key], value => {
                                                    this.vm.filter[item.key] = value;
                                                })
                                                : '';
                                        break;
                                    case 'multi_checkbox':
                                        contentHTML +=
                                            item.data.length > 0
                                                ? BgWidget.multiCheckboxContainer(gvc, item.data, this.vm.filter[item.key], value => {
                                                    this.vm.filter[item.key] = value;
                                                })
                                                : '';
                                        break;
                                    case 'radio_and_input':
                                        contentHTML +=
                                            item.data.length > 0
                                                ? BgWidget.radioInputContainer(gvc, item.data, this.vm.filter[item.key], value => {
                                                    this.vm.filter[item.key] = value;
                                                })
                                                : '';
                                        break;
                                }
                                return contentHTML.length > 0
                                    ? html `<!-- Item -->
                              <div class="accordion-item border-0 rounded-3 mb-3">
                                <h3 class="accordion-header" id="heading${item.key}">
                                  <button
                                    class="accordion-button shadow-none rounded-3 p-0 collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapse${item.key}"
                                    aria-expanded="false"
                                    aria-controls="collapse${item.key}"
                                  >
                                    ${item.name}
                                  </button>
                                </h3>
                                <div
                                  class="accordion-collapse collapse"
                                  id="collapse${item.key}"
                                  aria-labelledby="heading${item.key}"
                                  data-bs-parent="#accordion${vmShow.id}"
                                >
                                  <div class="accordion-body p-0 pt-1">${contentHTML}</div>
                                </div>
                              </div> `
                                    : '';
                            })
                            : ['無篩選項目'])}
              </div>
              <div
                class="position-absolute bottom-0 left-0 w-100 d-flex align-items-center justify-content-end p-3 border-top pe-4"
                style="gap:10px;"
              >
                ${BgWidget.cancel(gvc.event(() => {
                            this.vm.filter = this.getFilterObject();
                            menu.toggle({ visible: false });
                            this.vm.type = 'list';
                            gvc.notifyDataChange(this.vm.id);
                        }), '清除')}
                ${BgWidget.save(gvc.event(() => {
                            for (const name of Object.keys(this.vm.filter)) {
                                const obj = items.find(item => item.key === name);
                                const during = this.vm.filter[name];
                                const dialog = new ShareDialog(gvc.glitter);
                                if (obj && obj.type === 'during') {
                                    if ((during[0].length > 0 && during[1].length === 0) ||
                                        (during[0].length === 0 && during[1].length > 0)) {
                                        dialog.infoMessage({ text: `${obj.name}欄位，開始日期與結束日期皆為必填` });
                                        return;
                                    }
                                    if (!BgListComponent.duringInputVerify(during)) {
                                        dialog.infoMessage({ text: `${obj.name}欄位，結束日期不得早於開始日期` });
                                        return;
                                    }
                                }
                            }
                            menu.toggle({ visible: false });
                            this.vm.type = 'list';
                            gvc.notifyDataChange(this.vm.id);
                        }), '完成')}
              </div>`;
                    },
                    divCreate: { style: 'padding: 20px;' },
                    onCreate: () => {
                        gvc.addStyle(`
              .accordion-button:not(.collapsed)::after {
                box-shadow: none !important;
                color: #393939 !important;
                background-color: #fff !important;
                background-image: url(${BgWidget.arrowDownDataImage('#000')}) !important;
              }

              .accordion-button::after {
                background-color: #fff !important;
              }
            `);
                    },
                };
            }),
            right: true,
        });
    }
    static rightMenu(obj) {
        const glitter = window.parent.glitter;
        const gvc = glitter.pageConfig[glitter.pageConfig.length - 1].gvc;
        const menu = glitter.share.NormalPageEditor;
        const items = obj.items;
        const menuTitle = obj.menuTitle;
        const cancelType = obj.cancelType;
        const cloneFrame = structuredClone(obj.frame);
        const cloneDefault = structuredClone(obj.default);
        const vmShow = { id: gvc.glitter.getUUID() };
        const vm = {
            id: gvc.glitter.getUUID(),
            filter: obj.default,
            getFilterObject: () => cloneFrame,
            getConfigObject: () => cloneDefault,
        };
        menu.closeEvent = () => gvc.notifyDataChange(vm.id);
        return menu.toggle({
            visible: true,
            title: menuTitle !== null && menuTitle !== void 0 ? menuTitle : '篩選',
            view: gvc.bindView(() => {
                return {
                    bind: vmShow.id,
                    view: () => {
                        return html `<!-- Accordion: 篩選 -->
              <div class="accordion" id="accordion${vmShow.id}">
                ${gvc.map(items.length > 0
                            ? items.map((item) => {
                                let contentHTML = '';
                                switch (item.type) {
                                    case 'during':
                                        contentHTML +=
                                            item.data && item.data.list.length > 0
                                                ? BgWidget.duringInputContainer(gvc, item.data, vm.filter[item.key], value => {
                                                    vm.filter[item.key] = value;
                                                })
                                                : '';
                                        break;
                                    case 'multi_checkbox':
                                        contentHTML +=
                                            item.data.length > 0
                                                ? BgWidget.multiCheckboxContainer(gvc, item.data, vm.filter[item.key], value => {
                                                    vm.filter[item.key] = value;
                                                })
                                                : '';
                                        break;
                                    case 'radio_and_input':
                                        contentHTML +=
                                            item.data.length > 0
                                                ? BgWidget.radioInputContainer(gvc, item.data, vm.filter[item.key], value => {
                                                    vm.filter[item.key] = value;
                                                })
                                                : '';
                                        break;
                                }
                                return contentHTML.length > 0
                                    ? html `<!-- Item -->
                              <div class="accordion-item border-0 rounded-3 mb-3">
                                <h3 class="accordion-header" id="heading${item.key}">
                                  <button
                                    class="accordion-button shadow-none rounded-3 p-0 collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapse${item.key}"
                                    aria-expanded="false"
                                    aria-controls="collapse${item.key}"
                                  >
                                    ${item.name}
                                  </button>
                                </h3>
                                <div
                                  class="accordion-collapse collapse"
                                  id="collapse${item.key}"
                                  aria-labelledby="heading${item.key}"
                                  data-bs-parent="#accordion${vmShow.id}"
                                >
                                  <div class="accordion-body p-0 pt-1">${contentHTML}</div>
                                </div>
                              </div> `
                                    : '';
                            })
                            : ['無篩選項目'])}
              </div>
              <div
                class="position-absolute bottom-0 left-0 w-100 d-flex align-items-center justify-content-end p-3 border-top pe-4"
                style="gap:10px;"
              >
                ${BgWidget.cancel(gvc.event(() => {
                            const cancelMap = {
                                default: () => {
                                    vm.filter = vm.getConfigObject();
                                    gvc.notifyDataChange(vmShow.id);
                                },
                                clear: () => {
                                    vm.filter = vm.getFilterObject();
                                    menu.toggle({ visible: false });
                                    gvc.notifyDataChange(vm.id);
                                },
                            };
                            return cancelMap[cancelType] ? cancelMap[cancelType]() : cancelMap.default();
                        }), (() => {
                            var _a;
                            const cancelMap = {
                                default: '回到預設值',
                                clear: '清除',
                            };
                            return (_a = cancelMap[cancelType]) !== null && _a !== void 0 ? _a : cancelMap.default;
                        })())}
                ${BgWidget.save(gvc.event(() => {
                            for (const name of Object.keys(vm.filter)) {
                                const obj = items.find(item => item.key === name);
                                const during = vm.filter[name];
                                const dialog = new ShareDialog(gvc.glitter);
                                if (obj && obj.type === 'during') {
                                    if ((during[0].length > 0 && during[1].length === 0) ||
                                        (during[0].length === 0 && during[1].length > 0)) {
                                        dialog.infoMessage({ text: `${obj.name}欄位，開始日期與結束日期皆為必填` });
                                        return;
                                    }
                                    if (!BgListComponent.duringInputVerify(during)) {
                                        dialog.infoMessage({ text: `${obj.name}欄位，結束日期不得早於開始日期` });
                                        return;
                                    }
                                }
                            }
                            menu.toggle({ visible: false });
                            obj.save(vm.filter);
                        }), '完成')}
              </div>`;
                    },
                    divCreate: { style: 'padding: 20px;' },
                    onCreate: () => {
                        gvc.addStyle(`
              .accordion-button:not(.collapsed)::after {
                box-shadow: none !important;
                color: #393939 !important;
                background-color: #fff !important;
                background-image: url(${BgWidget.arrowDownDataImage('#000')}) !important;
              }

              .accordion-button::after {
                background-color: #fff !important;
              }
            `);
                        items.map((item) => {
                            const elem = window.parent.document.getElementById(`heading${item.key}`);
                            if (elem && item.defaultOpen) {
                                setTimeout(() => {
                                    const button = elem.querySelector('.accordion-button');
                                    button ? button.click() : elem.click();
                                }, 200);
                            }
                        });
                    },
                };
            }),
            right: true,
        });
    }
    static listBarRWD(filterList, filterTags) {
        var _a, _b, _c;
        if (document.body.clientWidth > 768) {
            return html ` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
        <div>${filterTags}</div>`;
        }
        return html ` <div
        style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between"
      >
        <div>${filterList[0]}</div>
        <div style="display: flex; gap: 4px;">${(_a = filterList[2]) !== null && _a !== void 0 ? _a : ''} ${(_b = filterList[3]) !== null && _b !== void 0 ? _b : ''} ${(_c = filterList[4]) !== null && _c !== void 0 ? _c : ''}</div>
      </div>
      <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
      <div>${filterTags}</div>`;
    }
}
window.glitter.setModule(import.meta.url, BgListComponent);
