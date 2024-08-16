import { PageSplit } from './splitPage.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { Article } from '../glitter-base/route/article.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
export class BgWidget {
    static table(obj) {
        obj.style = obj.style || [];
        const gvc = obj.gvc;
        const glitter = obj.gvc.glitter;
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const ps = new PageSplit(gvc);
            const vm = {
                loading: true,
                callback: () => {
                    vm.stateText = vm.data.length > 0 ? '資料載入中 ....' : '尚未新增內容';
                    vm.loading = false;
                    gvc.notifyDataChange(id);
                },
                page: 1,
                data: [],
                pageSize: 0,
                editData: [],
                stateText: '資料載入中 ....',
            };
            const getData = () => {
                obj.getData(vm);
            };
            return {
                bind: id,
                view: () => {
                    var _a, _b;
                    if (vm.loading) {
                        return html ` <div class="fs-2 text-center" style="padding:32px;">${vm.stateText}</div>`;
                    }
                    else {
                        return html ` <div class="p-0">
                            <div style="overflow-x:scroll;">
                                <table
                                    class="table table-centered table-nowrap  text-center table-hover fw-500 fs-7"
                                    style="overflow-x:scroll;margin-left: 32px;margin-right: 32px;width:calc(100% - 64px);${(_a = obj.table_style) !== null && _a !== void 0 ? _a : ''}"
                                >
                                    <div style="padding: 16px 32px;">${(_b = obj.filter) !== null && _b !== void 0 ? _b : ''}</div>

                                    <thead>
                                        ${vm.data.length === 0
                            ? ''
                            : html ` <tr>
                                                  ${vm.data[0]
                                .map((dd, index) => {
                                var _a;
                                return html ` <th
                                                                  class="${(_a = dd.position) !== null && _a !== void 0 ? _a : 'text-start'} tx_normal fw-bold"
                                                                  style="border:none;padding-bottom: 30px;color:#393939 !important;${obj.style && obj.style[index] ? obj.style[index] : ``}"
                                                              >
                                                                  ${dd.key}
                                                              </th>`;
                            })
                                .join('')}
                                              </tr>`}
                                    </thead>

                                    <tbody>
                                        ${vm.data.length === 0
                            ? html ` <div class=" fs-2 text-center" style="padding-bottom:32px;">${vm.stateText}</div>`
                            : html `${vm.data
                                .map((dd, index) => {
                                const pencilId = gvc.glitter.getUUID();
                                return html ` <tr
                                                          style="${obj.rowClick ? `cursor:pointer;` : ``};color:#303030;position: relative;"
                                                          onclick="${gvc.event(() => {
                                    obj.rowClick && obj.rowClick(dd, index);
                                })}"
                                                          onmouseover="${gvc.event(() => {
                                    $('#' + pencilId).removeClass('d-none');
                                })}"
                                                          onmouseout="${gvc.event(() => {
                                    $('#' + pencilId).addClass('d-none');
                                })}"
                                                      >
                                                          ${dd
                                    .map((d3, index) => {
                                    var _a;
                                    return html ` <td
                                                                          class="${(_a = d3.position) !== null && _a !== void 0 ? _a : 'text-start'}  tx_normal"
                                                                          ${d3.key === '●' || d3.stopDialog ? '' : html ` onclick="${gvc.event(() => { })}"`}
                                                                          style="color:#393939 !important;border:none; ${obj.style && obj.style[index] ? obj.style[index] : ``}"
                                                                      >
                                                                          <div class="my-auto" style="${obj.style && obj.style[index] ? obj.style[index] : ``}">${d3.value}</div>
                                                                      </td>`;
                                })
                                    .join('')}
                                                      </tr>`;
                            })
                                .join('')}`}
                                    </tbody>
                                </table>
                                <div>
                                    ${vm.data.length === 0
                            ? ''
                            : ps.pageSplit(vm.pageSize, vm.page, (page) => {
                                (vm.data = []), (vm.editData = []), (vm.page = page);
                                (vm.loading = true), gvc.notifyDataChange(id);
                            }, false)}
                                </div>
                            </div>
                        </div>`;
                    }
                },
                divCreate: {
                    class: `card`,
                    style: `
                        width: 100%;
                        overflow: hidden;
                        border-radius: 10px;
                        background: #fff;
                        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
                    `,
                },
                onCreate: () => {
                    if (vm.loading) {
                        getData(), (vm.loading = false), gvc.notifyDataChange(id);
                    }
                },
            };
        });
    }
    static tableV2(obj) {
        obj.style = obj.style || [];
        const gvc = obj.gvc;
        const glitter = obj.gvc.glitter;
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const ps = new PageSplit(gvc);
            const vm = {
                loading: true,
                callback: () => {
                    vm.stateText = vm.data.length > 0 ? '資料載入中 ....' : '暫無資料';
                    vm.loading = false;
                    gvc.notifyDataChange(id);
                },
                page: 1,
                data: [],
                pageSize: 0,
                editData: [],
                stateText: '資料載入中 ....',
            };
            const getData = () => {
                obj.getData(vm);
            };
            return {
                bind: id,
                view: () => {
                    var _a;
                    if (vm.loading) {
                        return html ` <div class="fs-2 text-center" style="padding: 32px;">${vm.stateText}</div>`;
                    }
                    else {
                        return html ` <div class="m-0 p-0" style="${(_a = obj.table_style) !== null && _a !== void 0 ? _a : ''}">
                            ${obj.filter ? html ` <div class="m-0">${obj.filter}</div>` : ''}
                            <div style="margin-top: 4px; overflow-x: scroll; z-index: 1;">
                                <table class="table table-centered table-nowrap text-center table-hover fw-400 fs-7" style="overflow-x:scroll; ">
                                    <thead>
                                        ${vm.data.length === 0
                            ? ''
                            : html ` <tr>
                                                  ${vm.data[0]
                                .map((dd, index) => {
                                var _a;
                                return html ` <th
                                                                  class="${(_a = dd.position) !== null && _a !== void 0 ? _a : 'text-start'} tx_700"
                                                                  style="white-space:nowrap;border:none; color:#393939 !important; ${obj.style && obj.style[index] ? obj.style[index] : ``}"
                                                              >
                                                                  ${dd.key}
                                                              </th>`;
                            })
                                .join('')}
                                              </tr>`}
                                    </thead>
                                    <tbody>
                                        ${vm.data.length === 0
                            ? html ` <div class="fs-2 text-center" style="padding-bottom:32px;white-space:nowrap;">${vm.stateText}</div>`
                            : html `${vm.data
                                .map((dd, index) => {
                                const pencilId = gvc.glitter.getUUID();
                                return html ` <tr
                                                          style="${obj.rowClick ? `cursor:pointer;` : ``};color:#303030;position: relative;"
                                                          onclick="${gvc.event(() => {
                                    obj.rowClick && obj.rowClick(dd, index);
                                })}"
                                                          onmouseover="${gvc.event(() => {
                                    $('#' + pencilId).removeClass('d-none');
                                })}"
                                                          onmouseout="${gvc.event(() => {
                                    $('#' + pencilId).addClass('d-none');
                                })}"
                                                      >
                                                          ${dd
                                    .map((d3, index) => {
                                    var _a;
                                    return html ` <td
                                                                          class="${(_a = d3.position) !== null && _a !== void 0 ? _a : 'text-start'} tx_normal"
                                                                          ${d3.key === '●' || d3.stopDialog ? '' : html ` onclick="${gvc.event(() => { })}"`}
                                                                          style="color:#393939 !important;border:none;vertical-align: middle;${obj.style && obj.style[index] ? obj.style[index] : ``}"
                                                                      >
                                                                          <div class="my-1 text-nowrap" style="${obj.style && obj.style[index] ? obj.style[index] : ``}">${d3.value}</div>
                                                                      </td>`;
                                })
                                    .join('')}
                                                      </tr>`;
                            })
                                .join('')}`}
                                    </tbody>
                                </table>
                                <div>
                                    ${vm.data.length === 0 || obj.hiddenPageSplit
                            ? ''
                            : ps.pageSplitV2(vm.pageSize, vm.page, (page) => {
                                (vm.data = []), (vm.editData = []), (vm.page = page);
                                (vm.loading = true), gvc.notifyDataChange(id);
                            }, false)}
                                </div>
                            </div>
                        </div>`;
                    }
                },
                divCreate: {},
                onCreate: () => {
                    if (vm.loading) {
                        getData(), (vm.loading = false), gvc.notifyDataChange(id);
                    }
                },
            };
        });
    }
    static cancel(event, text = '取消') {
        return html `
            <button class="btn btn-snow" type="button" onclick="${event}">
                <span class="tx_700">${text}</span>
            </button>
        `;
    }
    static danger(event, text = '刪除') {
        return html `
            <button class="btn btn-red" type="button" onclick="${event}">
                <span class="text-white tx_700">${text}</span>
            </button>
        `;
    }
    static save(event, text = '儲存') {
        return html ` <button class="btn btn-black" type="button" onclick="${event}">
            <span class="tx_700_white">${text}</span>
        </button>`;
    }
    static maintenance() {
        return html ` <div class="d-flex flex-column align-items-center justify-content-center vh-100 vw-100">
            <iframe src="https://embed.lottiefiles.com/animation/99312" style="width:50vw;height:50vw;"></iframe>
            <h3 style="margin-top: 36px;">此頁面功能維護中</h3>
        </div>`;
    }
    static card(htmlString, classStyle = 'p-3 bg-white rounded-3 shadow border w-100') {
        return html ` <div class="${classStyle}">${htmlString}</div>`;
    }
    static mainCard(htmlString, classString, styleString) {
        return html ` <div class="main-card ${classString !== null && classString !== void 0 ? classString : ''}" style="${styleString !== null && styleString !== void 0 ? styleString : ''}">${htmlString !== null && htmlString !== void 0 ? htmlString : ''}</div>`;
    }
    static container(htmlString, width, style) {
        return html ` <div
            class="${document.body.clientWidth < 768 ? 'row col-12 w-100' : ''}"
            style="padding: 24px ${document.body.clientWidth < 768 ? '0.75rem' : '0'}; margin: 0 auto; ${width ? `max-width:100%; width:${width}px;` : ``} ${style !== null && style !== void 0 ? style : ''}"
        >
            ${htmlString}
        </div>`;
    }
    static containerMax(htmlString, width, style) {
        return html ` <div
            class="${document.body.clientWidth < 768 ? 'row col-12 w-100 px-0' : ''}"
            style="padding: 24px ${document.body.clientWidth < 768 ? '0.75rem' : '0'}; margin: 0 auto; ${width ? `max-width:100%; width:${width}px;` : ``} ${style !== null && style !== void 0 ? style : ''}"
        >
            ${htmlString}
        </div>`;
    }
    static title(title) {
        return html ` <h3 class="my-auto tx_title" style="white-space: nowrap;">${title}</h3>`;
    }
    static title_16(title, style = '') {
        return html ` <h3 class="my-auto tx_title" style="white-space: nowrap;font-size: 16px;${style}">${title}</h3>`;
    }
    static create_btn(event, title = "新增") {
        return html `
            <button class="btn btn-snow" style="padding: 6px 18px;border-radius: 10px;background: #393939;font-size: 16px;color: #FFF;font-weight: 700;" type="button" onclick="${event}">
                ${title}
            </button>
        `;
    }
    static plus_btn(title, gvc, option) {
        return html `
            <div class="w-100 d-flex align-items-center justify-content-center">
                <div class="btn-group dropdown ">
                    <div
                        class="w-100 "
                        style="justify-content: center; align-items: center; gap: 4px; display: flex;color: #3366BB;cursor: pointer;"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">${title}</div>
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <div class="dropdown-menu dropdown-menu-start my-1">
                        ${option
            .map((dd) => {
            return `<a onclick="${gvc.event(() => {
                dd.callback();
            })}" class="dropdown-item">${dd.icon}${dd.title}</a>`;
        })
            .join('')}
                    </div>
                </div>
            </div>
        `;
    }
    static hint_title(title) {
        return html ` <h3
            class="my-auto tx_title"
            style="color: #8D8D8D;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;"
        >
            ${title}
        </h3>`;
    }
    static sub_title(title) {
        return html `<h3 class="my-auto tx_title " style="white-space: nowrap;font-size: 14px;font-weight: 400;">${title}</h3>`;
    }
    static tab(data, gvc, select, callback, style) {
        return html ` <div style="justify-content: flex-start; align-items: flex-start; gap: 22px; display: inline-flex;cursor: pointer;margin-top: 24px;margin-bottom: 24px; ${style !== null && style !== void 0 ? style : ''}">
            ${data
            .map((dd) => {
            if (select === dd.key) {
                return html ` <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                            <div style="align-self: stretch; text-align: center; color: #393939; font-size: 18px; font-family: Noto Sans; font-weight: 700; line-height: 18px; word-wrap: break-word">
                                ${dd.title}
                            </div>
                            <div style="align-self: stretch; height: 0px; border: 2px #393939 solid"></div>
                        </div>`;
            }
            else {
                return html ` <div
                            style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex"
                            onclick="${gvc.event(() => {
                    callback(dd.key);
                })}"
                        >
                            <div style="align-self: stretch; text-align: center; color: #393939; font-size: 18px; font-family: Noto Sans; font-weight: 400; line-height: 18px; word-wrap: break-word">
                                ${dd.title}
                            </div>
                            <div style="align-self: stretch; height: 0px"></div>
                        </div>`;
            }
        })
            .join('')}
        </div>`;
    }
    static goBack(event) {
        return html ` <div class="d-flex align-items-center justify-content-center" style="width: 5px; height: 11px; cursor:pointer; margin-right: 10px;" onclick="${event}">
            <i class="fa-solid fa-angle-left" style="color: #393939;"></i>
        </div>`;
    }
    static columnCheckBox(obj) {
        const gvc = obj.gvc;
        return obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return obj.array
                        .map((dd) => {
                        return html ` <div>
                                ${[
                            html ` <div
                                        class="d-flex align-items-center cursor_pointer mb-2"
                                        style="gap:8px;"
                                        onclick="${obj.gvc.event(() => {
                                obj.def = dd.value;
                                obj.callback(dd.value);
                                gvc.notifyDataChange(id);
                            })}"
                                    >
                                        ${obj.def === dd.value ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>` : ` <div class="c_39_checkbox"></div>`}
                                        <div class="tx_normal fw-normal">${dd.title}</div>
                                    </div>`,
                            obj.def === dd.value && dd.innerHtml
                                ? html ` <div class="d-flex position-relative mt-2">
                                              <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>
                                              <div class="flex-fill " style="margin-left:30px;width: 100%;">${dd.innerHtml}</div>
                                          </div>`
                                : ``,
                        ].join('')}
                            </div>`;
                    })
                        .join('');
                },
                divCreate: {
                    style: ``,
                    class: `w-100`,
                },
            };
        });
    }
    static inlineCheckBox(obj) {
        var _a;
        obj.type = (_a = obj.type) !== null && _a !== void 0 ? _a : 'single';
        const gvc = obj.gvc;
        return html `
            ${obj.title ? `<div class="tx_normal fw-normal">${obj.title}</div>` : ``}
            ${obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return obj.array
                        .map((dd) => {
                        function isSelect() {
                            if (obj.type === 'multiple') {
                                return obj.def.find((d2) => {
                                    return d2 === dd.value;
                                });
                            }
                            else {
                                return obj.def === dd.value;
                            }
                        }
                        return html `
                                    <div
                                        class="d-flex align-items-center cursor_pointer"
                                        onclick="${obj.gvc.event(() => {
                            if (obj.type === 'multiple') {
                                if (obj.def.find((d2) => {
                                    return d2 === dd.value;
                                })) {
                                    obj.def = obj.def.filter((d2) => {
                                        return d2 !== dd.value;
                                    });
                                }
                                else {
                                    obj.def.push(dd.value);
                                }
                                obj.callback(obj.def);
                            }
                            else {
                                obj.def = dd.value;
                                obj.callback(dd.value);
                            }
                            gvc.notifyDataChange(id);
                        })}"
                                        style="gap:6px;"
                                    >
                                        ${isSelect() ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>` : ` <div class="c_39_checkbox"></div>`}
                                        <span class="tx_normal">${dd.title}</span>
                                    </div>
                                    ${obj.def === dd.value && dd.innerHtml ? `<div class="mt-1">${dd.innerHtml}</div>` : ``}
                                `;
                    })
                        .join('');
                },
                divCreate: {
                    class: `ps-1 d-flex flex-wrap`,
                    style: `gap:10px;margin-top:10px;`,
                },
            };
        })}
        `;
    }
    static editeInput(obj) {
        var _a, _b, _c, _d, _e, _f;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        return html `
            <div style="${(_b = obj.divStyle) !== null && _b !== void 0 ? _b : ''}">
                ${obj.title ? html ` <div class="tx_normal fw-normal" style="${(_c = obj.titleStyle) !== null && _c !== void 0 ? _c : ''}">${obj.title}</div>` : ``}
                <div class="d-flex w-100 align-items-center border rounded-3 ${obj.readonly ? `bgw-input-readonly` : ``}" style="margin: 8px 0;">
                    ${obj.startText ? html ` <div class="py-2 ps-3">${obj.startText}</div>` : ''}
                    <input
                        class="bgw-input ${obj.readonly ? `bgw-input-readonly` : ``}"
                        style="${(_d = obj.style) !== null && _d !== void 0 ? _d : ''}"
                        type="${(_e = obj.type) !== null && _e !== void 0 ? _e : 'text'}"
                        placeholder="${obj.placeHolder}"
                        onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
                        oninput="${obj.gvc.event((e) => {
            if (obj.pattern) {
                const value = e.value;
                const regex = new RegExp(`[^${obj.pattern}]`, 'g');
                const validValue = value.replace(regex, '');
                if (value !== validValue) {
                    e.value = validValue;
                }
            }
        })}"
                        value="${(_f = obj.default) !== null && _f !== void 0 ? _f : ''}"
                        ${obj.readonly ? `readonly` : ``}
                    />
                    ${obj.endText ? html ` <div class="py-2 pe-3">${obj.endText}</div>` : ''}
                </div>
            </div>
        `;
    }
    static textArea(obj) {
        var _a, _b, _c;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        return html `${obj.title ? html ` <div class="tx_normal fw-normal">${obj.title}</div>` : ''}
            <div class="w-100 px-1" style="margin-top:8px;">
                <textarea
                    class="form-control border rounded"
                    style="font-size: 16px; color: #393939;"
                    rows="4"
                    onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
                    placeholder="${(_b = obj.placeHolder) !== null && _b !== void 0 ? _b : ''}"
                    ${obj.readonly ? `readonly` : ``}
                >
${(_c = obj.default) !== null && _c !== void 0 ? _c : ''}</textarea
                >
            </div>`;
    }
    static searchPlace(event, vale, placeholder, margin = '16px 0 0 0') {
        return html ` <div class="w-100 position-relative" style="margin: ${margin};">
            <i class=" fa-regular fa-magnifying-glass" style="font-size: 18px;color: #A0A0A0;position: absolute;left:20px;top:50%;transform: translateY(-50%);" aria-hidden="true"></i>
            <input class="form-control h-100 " style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;" placeholder="${placeholder}" onchange="${event}" value="${vale}" />
        </div>`;
    }
    static linkList(obj) {
        var _a, _b;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
        };
        const linkComp = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
            text: (_b = obj.default) !== null && _b !== void 0 ? _b : '',
        };
        const dropMenu = {
            id: obj.gvc.glitter.getUUID(),
            elementClass: Tool.randomString(5),
            elementWidth: 240,
            loading: true,
            search: '',
            prevList: [],
            recentList: {},
            recentParent: [],
        };
        const setCollectionPath = (target, data) => {
            (data || []).map((item, index) => {
                const { title, array, code } = item;
                target.push({ name: title, icon: '', link: `/collections/${code}` });
                if (array && array.length > 0) {
                    target[index].items = [];
                    setCollectionPath(target[index].items, array);
                }
            });
        };
        const findMenuItemPathByLink = (items, link) => {
            for (const item of items) {
                if (item.link === link) {
                    return { icon: item.icon, nameMap: [item.name] };
                }
                if (item.items) {
                    const path = findMenuItemPathByLink(item.items, link);
                    if (path === null || path === void 0 ? void 0 : path.nameMap) {
                        return { icon: item.icon, nameMap: [item.name, ...path === null || path === void 0 ? void 0 : path.nameMap] };
                    }
                }
            }
            return undefined;
        };
        const formatLinkHTML = (icon, pathList) => {
            let pathHTML = '';
            pathList.map((path, index) => {
                pathHTML += html `<span class="mx-1" style="font-size: 14px;">${path}</span>${index === pathList.length - 1 ? '' : html ` <i class="fa-solid fa-chevron-right"></i>`}`;
            });
            return html ` <div style="display: flex; flex-wrap: wrap; align-items: center; font-size: 14px; font-weight: 500; gap: 6px; line-height: 140%;cursor: default;">
                <div style="width: 28px;height: 28px;display: flex; align-items: center; justify-content:center;">
                    <i class="${icon.length > 0 ? icon : 'fa-regular fa-image'}"></i>
                </div>
                ${pathHTML}
            </div>`;
        };
        const formatLinkText = (text) => {
            const firstRound = dropMenu.recentList.find((item) => item.link === text);
            if (firstRound) {
                return formatLinkHTML(firstRound.icon, [firstRound.name]);
            }
            const targetItem = findMenuItemPathByLink(dropMenu.recentList, text);
            if (targetItem) {
                return formatLinkHTML(targetItem.icon, targetItem.nameMap);
            }
            return text;
        };
        const componentFresh = () => {
            const notify = () => {
                obj.gvc.notifyDataChange(dropMenu.id);
                obj.gvc.notifyDataChange(linkComp.id);
            };
            linkComp.loading = !linkComp.loading;
            dropMenu.loading = !dropMenu.loading;
            if (dropMenu.loading) {
                notify();
            }
            else {
                const si = setInterval(() => {
                    const inputElement = obj.gvc.glitter.document.getElementById(dropMenu.elementClass);
                    if (inputElement) {
                        dropMenu.elementWidth = inputElement.clientWidth;
                        notify();
                        clearInterval(si);
                    }
                }, 50);
            }
        };
        const callbackEvent = (data) => {
            linkComp.text = data.link;
            obj.callback(data.link);
            componentFresh();
        };
        obj.gvc.addStyle(`
            #${dropMenu.elementClass} {
                font-size: 14px;
                margin-top: 8px;
                white-space: normal;
                word-break: break-all;
            }
        `);
        return obj.gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading) {
                    return this.spinner({ textNone: true });
                }
                else {
                    let dataList = JSON.parse(JSON.stringify(dropMenu.recentList));
                    return html `${obj.title ? html ` <div class="tx_normal fw-normal">${obj.title}</div>` : ``}
                        <div style="position: relative">
                            ${obj.gvc.bindView({
                        bind: linkComp.id,
                        view: () => {
                            var _a, _b;
                            if (linkComp.loading) {
                                return html ` <div
                                            class="bgw-input border rounded-3"
                                            style="${linkComp.text.length > 0 ? '' : 'padding: 9.5px 12px;'} ${(_a = obj.style) !== null && _a !== void 0 ? _a : ''}"
                                            id="${dropMenu.elementClass}"
                                            onclick="${obj.gvc.event(() => {
                                    componentFresh();
                                })}"
                                        >
                                            ${linkComp.text.length > 0 ? formatLinkText(linkComp.text) : html `<span style="color: #777777;">${obj.placeHolder}</span>`}
                                        </div>`;
                            }
                            else {
                                return html `
                                            <div class="d-flex align-items-center" style="margin-top: 8px;">
                                                <input
                                                    class="form-control"
                                                    style="${(_b = obj.style) !== null && _b !== void 0 ? _b : ''}"
                                                    type="text"
                                                    placeholder="${obj.placeHolder}"
                                                    onchange="${obj.gvc.event((e) => {
                                    callbackEvent({ link: e.value });
                                })}"
                                                    oninput="${obj.gvc.event((e) => {
                                    if (obj.pattern) {
                                        const value = e.value;
                                        const regex = new RegExp(`[^${obj.pattern}]`, 'g');
                                        const validValue = value.replace(regex, '');
                                        if (value !== validValue) {
                                            e.value = validValue;
                                        }
                                    }
                                })}"
                                                    value="${linkComp.text}"
                                                    ${obj.readonly ? `readonly` : ``}
                                                />
                                                <span style="margin: 0 0.75rem"
                                                    ><i
                                                        class="fa-solid fa-xmark text-dark cursor_pointer fs-5"
                                                        onclick="${obj.gvc.event(() => {
                                    componentFresh();
                                })}"
                                                    ></i
                                                ></span>
                                            </div>
                                        `;
                            }
                        },
                        divCreate: {},
                        onCreate: () => { },
                    })}
                            ${obj.gvc.bindView({
                        bind: dropMenu.id,
                        view: () => {
                            if (dropMenu.loading) {
                                return html ``;
                            }
                            else {
                                let h1 = '';
                                if (dropMenu.prevList.length > 0) {
                                    h1 += html ` <div
                                                    class="m-3 cursor_pointer"
                                                    style="font-size: 16px; font-weight: 500; gap: 6px; line-height: 140%;"
                                                    onclick=${obj.gvc.event(() => {
                                        dataList = dropMenu.prevList[dropMenu.prevList.length - 1];
                                        dropMenu.prevList.pop();
                                        dropMenu.recentParent.pop();
                                        dropMenu.search = '';
                                        obj.gvc.notifyDataChange(dropMenu.id);
                                    })}
                                                >
                                                    <i class="fa-solid fa-chevron-left me-2 hoverF2"></i>
                                                    <span>${dropMenu.recentParent[dropMenu.recentParent.length - 1]}</span>
                                                </div>
                                                <input
                                                    class="form-control m-2"
                                                    style="width: 92%"
                                                    type="text"
                                                    placeholder="搜尋"
                                                    onchange="${obj.gvc.event((e) => {
                                        dropMenu.search = e.value;
                                        obj.gvc.notifyDataChange(dropMenu.id);
                                    })}"
                                                    oninput="${obj.gvc.event((e) => {
                                        if (obj.pattern) {
                                            const value = e.value;
                                            const regex = new RegExp(`[^${obj.pattern}]`, 'g');
                                            const validValue = value.replace(regex, '');
                                            if (value !== validValue) {
                                                e.value = validValue;
                                            }
                                        }
                                    })}"
                                                    value="${dropMenu.search}"
                                                />`;
                                }
                                let h2 = '';
                                dataList
                                    .filter((tag) => {
                                    return tag.name.includes(dropMenu.search);
                                })
                                    .map((tag) => {
                                    h2 += html `
                                                    <div class="m-2" style="cursor:pointer;display: flex; align-items: center; justify-content: space-between;">
                                                        <div
                                                            class="w-100 p-1 link-item-container hoverF2 cursor_pointer text-wrap"
                                                            onclick=${obj.gvc.event(() => {
                                        if (tag.link && tag.link.length > 0 && !tag.ignoreFirst) {
                                            callbackEvent(tag);
                                        }
                                        else {
                                            dropMenu.prevList.push(dataList);
                                            dropMenu.recentParent.push(tag.name);
                                            tag.items && (dataList = tag.items);
                                            obj.gvc.notifyDataChange(dropMenu.id);
                                        }
                                    })}
                                                        >
                                                            <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                                                ${(() => {
                                        if (tag.icon.includes('https://')) {
                                            return html ` <div
                                                                            style="
                                                                                width: 25px; height: 25px;
                                                                                background-image: url('${tag.icon}');
                                                                                background-position: center;
                                                                                background-size: cover;
                                                                                background-repeat: no-repeat;
                                                                            "
                                                                        ></div>`;
                                        }
                                        return html `<i class="${tag.icon.length > 0 ? tag.icon : 'fa-regular fa-image'}"></i>`;
                                    })()}
                                                            </div>
                                                            ${tag.name}
                                                        </div>
                                                        <div
                                                            class="py-1 px-3 hoverF2 ${tag.items && tag.items.length > 0 ? '' : 'd-none'}"
                                                            onclick=${obj.gvc.event(() => {
                                        dropMenu.prevList.push(dataList);
                                        dropMenu.recentParent.push(tag.name);
                                        tag.items && (dataList = tag.items);
                                        obj.gvc.notifyDataChange(dropMenu.id);
                                    })}
                                                        >
                                                            <i class="fa-solid fa-chevron-right cursor_pointer"></i>
                                                        </div>
                                                    </div>
                                                `;
                                });
                                return html `
                                            <div class="border border-2 rounded-2 p-2" style="width: ${dropMenu.elementWidth}px;">
                                                ${h1}
                                                <div style="overflow-y: auto; max-height: 42.5vh;">${h2}</div>
                                            </div>
                                        `;
                            }
                        },
                        divCreate: {
                            style: 'position: absolute; top: 44px; left: 0; z-index: 1; background-color: #fff;',
                        },
                    })}
                        </div>`;
                }
            },
            divCreate: {},
            onCreate: () => {
                if (vm.loading) {
                    const acticleList = [];
                    const collectionList = [];
                    const productList = [];
                    const blockPageList = [];
                    const hiddenPageList = [];
                    const oneStoreList = [];
                    Promise.all([
                        new Promise((resolve) => {
                            ApiShop.getCollection().then((data) => {
                                setCollectionPath(collectionList, data.response && data.response.value.length > 0 ? data.response.value : []);
                                resolve();
                            });
                        }),
                        new Promise((resolve) => {
                            ApiShop.getProduct({ page: 0, limit: 50000, search: '' }).then((data) => {
                                if (data.result) {
                                    (data.response.data || []).map((item) => {
                                        const { id, title, preview_image } = item.content;
                                        const icon = preview_image && preview_image[0] ? preview_image[0] : '';
                                        productList.push({
                                            name: title,
                                            icon: icon,
                                            link: `/products?product_id=${id}`,
                                        });
                                    });
                                    resolve();
                                }
                            });
                        }),
                        new Promise((resolve) => {
                            Article.get({
                                page: 0,
                                limit: 99999,
                                status: '1',
                                for_index: 'true',
                            }).then((data) => {
                                if (data.result) {
                                    data.response.data.map((item) => {
                                        const { name, tag } = item.content;
                                        if (name) {
                                            acticleList.push({ name: name, icon: '', link: `/blogs/${tag}` });
                                        }
                                    });
                                }
                                resolve();
                            });
                        }),
                        new Promise((resolve) => {
                            Article.get({
                                page: 0,
                                limit: 99999,
                                status: '1',
                                for_index: 'false',
                            }).then((data) => {
                                if (data.result) {
                                    data.response.data.map((item) => {
                                        const { name, tag, page_type } = item.content;
                                        if (name) {
                                            const tagObj = { name: name, icon: '', link: `/pages/${tag}` };
                                            switch (page_type) {
                                                case 'page':
                                                    blockPageList.push(tagObj);
                                                    break;
                                                case 'hidden':
                                                    hiddenPageList.push(tagObj);
                                                    break;
                                                case 'shopping':
                                                    oneStoreList.push(tagObj);
                                                    break;
                                            }
                                        }
                                    });
                                }
                                resolve();
                            });
                        }),
                    ]).then(() => {
                        dropMenu.recentList = [
                            {
                                name: '首頁',
                                icon: 'fa-regular fa-house',
                                link: '/index',
                            },
                            {
                                name: '所有商品',
                                icon: 'fa-regular fa-tag',
                                link: '/all-product',
                                items: productList,
                            },
                            {
                                name: '商品分類',
                                icon: 'fa-regular fa-tags',
                                link: '',
                                items: collectionList,
                                ignoreFirst: true,
                            },
                            {
                                name: '網誌文章',
                                icon: 'fa-regular fa-newspaper',
                                link: '/blogs',
                                items: acticleList,
                            },
                            {
                                name: '分頁列表',
                                icon: 'fa-regular fa-pager',
                                link: '/pages',
                                items: blockPageList,
                                ignoreFirst: true,
                            },
                            {
                                name: '隱形賣場',
                                icon: 'fa-sharp fa-regular fa-face-dotted',
                                link: '/pages',
                                items: hiddenPageList,
                                ignoreFirst: true,
                            },
                            {
                                name: '一頁商店',
                                icon: 'fa-regular fa-page',
                                link: '/pages',
                                items: oneStoreList,
                                ignoreFirst: true,
                            },
                        ].filter((menu) => {
                            if (obj.filter && obj.filter.page && obj.filter.page.length > 0 && !obj.filter.page.includes(menu.name)) {
                                return false;
                            }
                            if (menu.items === undefined) {
                                return true;
                            }
                            return menu.items.length > 0;
                        });
                        vm.loading = false;
                        obj.gvc.notifyDataChange(vm.id);
                    });
                }
            },
        });
    }
    static grayNote(text, style) {
        return html `<span style="color: #8D8D8D; font-size: 16px; font-weight: 400; ${style}">${text}</span>`;
    }
    static blueNote(text, event, style) {
        return html `<span style="color: #4D86DB; font-size: 16px; font-weight: 400; cursor:pointer; ${style}" onclick="${event()}">${text}</span>`;
    }
    static leftLineBar() {
        return html ` <div class="ms-2 border-end position-absolute h-100 left-0"></div>`;
    }
    static horizontalLine() {
        return html ` <div class="my-3 w-100" style="border-bottom: 1px solid #DDD"></div>`;
    }
    static grayButton(text, event, obj) {
        var _a;
        return html ` <button class="btn btn-gray" type="button" onclick="${event}">
            <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}" style="color: #393939"></i>
            ${text.length > 0 ? html `<span class="tx_700" style="${(_a = obj === null || obj === void 0 ? void 0 : obj.textStyle) !== null && _a !== void 0 ? _a : ''}">${text}</span>` : ''}
        </button>`;
    }
    static darkButton(text, event, obj) {
        var _a, _b;
        const size = { btn: '', font: '' };
        if (obj && obj.size) {
            size.btn = `btn-black-${obj.size}`;
            size.font = `tx_white_${obj.size}`;
        }
        return html ` <button class="btn btn-black ${size.btn}" type="button" style="${(_a = obj === null || obj === void 0 ? void 0 : obj.style) !== null && _a !== void 0 ? _a : ''}" onclick="${event}">
            <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}"></i>
            <span class="tx_700_white ${size.font}" style="${(_b = obj === null || obj === void 0 ? void 0 : obj.textStyle) !== null && _b !== void 0 ? _b : ''}">${text}</span>
        </button>`;
    }
    static redButton(text, event, obj) {
        var _a;
        return html ` <button class="btn btn-red" type="button" onclick="${event}">
            <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}"></i>
            <span class="tx_700_white" style="${(_a = obj === null || obj === void 0 ? void 0 : obj.textStyle) !== null && _a !== void 0 ? _a : ''}">${text}</span>
        </button>`;
    }
    static switchButton(gvc, def, callback) {
        return html ` <div class="form-check form-switch m-0 cursor_pointer" style="margin-top: 10px;">
            <input
                class="form-check-input"
                type="checkbox"
                onchange="${gvc.event((e) => {
            callback(e.checked);
        })}"
                ${def ? `checked` : ``}
            />
        </div>`;
    }
    static switchTextButton(gvc, def, text, callback) {
        var _a, _b;
        return html ` <div style="display: flex; align-items: center;">
            <div class="tx_normal me-2">${(_a = text.left) !== null && _a !== void 0 ? _a : ''}</div>
            <div class="form-check form-switch m-0 cursor_pointer" style="margin-top: 10px; display: flex; align-items: center;">
                <input
                    class="form-check-input"
                    type="checkbox"
                    onchange="${gvc.event((e) => {
            callback(e.checked);
        })}"
                    ${def ? `checked` : ``}
                />
            </div>
            <div class="tx_normal">${(_b = text.right) !== null && _b !== void 0 ? _b : ''}</div>
        </div>`;
    }
    static searchFilter(event, vale, placeholder, margin) {
        return html ` <div class="w-100 position-relative" style="margin: ${margin !== null && margin !== void 0 ? margin : 0};">
            <i class="fa-regular fa-magnifying-glass" style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);" aria-hidden="true"></i>
            <input class="form-control h-100" style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;" placeholder="${placeholder}" onchange="${event}" value="${vale}" />
        </div>`;
    }
    static searchFilterOninput(event, vale, placeholder, margin) {
        return html ` <div class="w-100 position-relative" style="margin: ${margin !== null && margin !== void 0 ? margin : 0};">
            <i class="fa-regular fa-magnifying-glass" style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);" aria-hidden="true"></i>
            <input class="form-control h-100" style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;" placeholder="${placeholder}" oninput="${event}" value="${vale}" />
        </div>`;
    }
    static select(obj) {
        var _a;
        return html `<select
            class="c_select c_select_w_100"
            style="${(_a = obj.style) !== null && _a !== void 0 ? _a : ''}; ${obj.readonly ? 'background: #f7f7f7;' : ''}"
            onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
            ${obj.readonly ? 'disabled' : ''}
        >
            ${obj.gvc.map(obj.options.map((opt) => html ` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>${opt.value}</option>`))}
        </select>`;
    }
    static selectFilter(obj) {
        var _a;
        return html `<select
            class="c_select"
            style="${(_a = obj.style) !== null && _a !== void 0 ? _a : ''}"
            onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
        >
            ${obj.gvc.map(obj.options.map((opt) => html ` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>${opt.value}</option>`))}
        </select>`;
    }
    static selectDropList(obj) {
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            checkClass: this.getCheckedClass(obj.gvc),
            loading: true,
            show: false,
            def: JSON.parse(JSON.stringify(obj.default)),
        };
        return obj.gvc.bindView({
            bind: vm.id,
            view: () => {
                var _a, _b;
                const defLine = obj.options.filter((item) => {
                    return obj.default.includes(item.key);
                });
                return html ` <div class="c_select" style="position: relative; ${(_a = obj.style) !== null && _a !== void 0 ? _a : ''}">
                    <div
                        class="w-100 h-100"
                        onclick="${obj.gvc.event(() => {
                    vm.show = !vm.show;
                    if (!vm.show) {
                        obj.callback(obj.default.filter((item) => {
                            return obj.options.find((opt) => opt.key === item);
                        }));
                    }
                    obj.gvc.notifyDataChange(vm.id);
                })}"
                    >
                        <div style="font-size: 15px; cursor: pointer; color: #393939;">
                            ${defLine.length > 0
                    ? defLine
                        .map((item) => {
                        return item.value;
                    })
                        .join(' / ')
                    : BgWidget.grayNote((_b = obj.placeholder) !== null && _b !== void 0 ? _b : '（點擊選擇項目）')}
                        </div>
                    </div>
                    ${vm.show
                    ? html ` <div class="c_dropdown">
                              <div class="c_dropdown_body">
                                  <div class="c_dropdown_main">
                                      ${obj.gvc.map(obj.options.map((opt) => {
                        function call() {
                            if (obj.default.includes(opt.key)) {
                                obj.default = obj.default.filter((item) => item !== opt.key);
                            }
                            else {
                                obj.default.push(opt.key);
                            }
                            obj.gvc.notifyDataChange(vm.id);
                        }
                        return html ` <div class="d-flex align-items-center" style="gap: 24px">
                                                  <input
                                                      class="form-check-input mt-0 ${vm.checkClass}"
                                                      type="checkbox"
                                                      id="${opt.key}"
                                                      name="radio_${vm.id}"
                                                      onclick="${obj.gvc.event(() => call())}"
                                                      ${obj.default.includes(opt.key) ? 'checked' : ''}
                                                  />
                                                  <div class="form-check-label c_updown_label cursor_pointer" onclick="${obj.gvc.event(() => call())}">
                                                      <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                      ${opt.note ? html ` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                  </div>
                                              </div>`;
                    }))}
                                  </div>
                                  <div class="c_dropdown_bar">
                                      ${BgWidget.cancel(obj.gvc.event(() => {
                        obj.callback(vm.def);
                        vm.show = !vm.show;
                        obj.gvc.notifyDataChange(vm.id);
                    }))}
                                      ${BgWidget.save(obj.gvc.event(() => {
                        obj.callback(obj.default.filter((item) => {
                            return obj.options.find((opt) => opt.key === item);
                        }));
                        vm.show = !vm.show;
                        obj.gvc.notifyDataChange(vm.id);
                    }), '確認')}
                                  </div>
                              </div>
                          </div>`
                    : ''}
                </div>`;
            },
        });
    }
    static selectDropDialog(obj) {
        return obj.gvc.glitter.innerDialog((gvc) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                checkClass: this.getCheckedClass(obj.gvc),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [],
                query: '',
                orderString: '',
                selectKey: {
                    name: '',
                    index: 0,
                },
            };
            return html ` <div class="bg-white shadow rounded-3" style="overflow-y: auto; ${document.body.clientWidth > 768 ? 'min-width: 400px; width: 600px;' : 'min-width: 92.5vw;'}">
                ${obj.gvc.bindView({
                bind: vm.id,
                view: () => {
                    if (vm.loading) {
                        return this.spinner();
                    }
                    return html ` <div style="width: 100%; overflow-y: auto;" class="bg-white shadow rounded-3">
                            <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                <div class="tx_700">${obj.title}</div>
                                <div class="flex-fill"></div>
                                <i
                                    class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                    onclick="${gvc.event(() => {
                        obj.callback(vm.def);
                        gvc.closeDialog();
                    })}"
                                ></i>
                            </div>
                            <div class="c_dialog">
                                <div class="c_dialog_body">
                                    <div class="c_dialog_main">
                                        ${obj.readonly
                        ? ''
                        : html ` <div class="d-flex" style="gap: 12px;">
                                                  ${this.searchFilter(gvc.event((e, event) => {
                            vm.query = e.value;
                            vm.loading = true;
                            obj.gvc.notifyDataChange(vm.id);
                        }), vm.query || '', '搜尋')}
                                                  ${obj.updownOptions
                            ? this.updownFilter({
                                gvc,
                                callback: (value) => {
                                    vm.orderString = value;
                                    vm.loading = true;
                                    obj.gvc.notifyDataChange(vm.id);
                                },
                                default: vm.orderString || 'default',
                                options: obj.updownOptions || [],
                            })
                            : ''}
                                              </div>`}
                                        ${obj.gvc.map(vm.options.map((opt, index) => {
                        function call() {
                            vm.selectKey = {
                                name: opt.key,
                                index: index,
                            };
                            if (obj.default.includes(opt.key)) {
                                obj.default = obj.default.filter((item) => item !== opt.key);
                            }
                            else {
                                obj.default.push(opt.key);
                            }
                            obj.gvc.notifyDataChange(vm.id);
                        }
                        return html ` <div class="d-flex align-items-center" style="gap: 24px">
                                                    ${obj.readonly
                            ? ''
                            : html `<input
                                                              class="form-check-input mt-0 ${vm.checkClass}"
                                                              type="checkbox"
                                                              id="${opt.key}"
                                                              name="radio_${vm.id}"
                                                              onclick="${obj.gvc.event(() => call())}"
                                                              ${obj.default.includes(opt.key) ? 'checked' : ''}
                                                          />`}
                                                    ${opt.image
                            ? BgWidget.validImageBox({
                                gvc: obj.gvc,
                                image: opt.image,
                                width: 40,
                            })
                            : ''}
                                                    <div class="form-check-label c_updown_label ${obj.readonly ? '' : 'cursor_pointer'}" onclick="${obj.gvc.event(() => call())}">
                                                        <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                        ${opt.note ? html ` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                    </div>
                                                </div>`;
                    }))}
                                    </div>
                                    ${obj.readonly
                        ? ''
                        : html ` <div class="c_dialog_bar">
                                              ${BgWidget.cancel(obj.gvc.event(() => {
                            obj.callback([]);
                            gvc.closeDialog();
                        }), '清除全部')}
                                              ${BgWidget.cancel(obj.gvc.event(() => {
                            obj.callback(vm.def);
                            gvc.closeDialog();
                        }))}
                                              ${BgWidget.save(obj.gvc.event(() => {
                            obj.callback(obj.default.filter((item) => {
                                return vm.options.find((opt) => opt.key === item);
                            }));
                            gvc.closeDialog();
                        }), '確認')}
                                          </div>`}
                                </div>
                            </div>
                        </div>`;
                },
                onCreate: () => {
                    if (vm.loading) {
                        obj.api({
                            query: vm.query,
                            orderString: vm.orderString,
                        }).then((data) => {
                            vm.options = data;
                            vm.loading = false;
                            obj.gvc.notifyDataChange(vm.id);
                        });
                    }
                    else {
                        let n = 0;
                        const si = setInterval(() => {
                            const element = document.getElementById(vm.selectKey.name);
                            if (element) {
                                element.scrollIntoView();
                                const element2 = document.querySelector('.c_dialog_main');
                                if (element2 && vm.selectKey.index < vm.options.length - 5) {
                                    element2.scrollTop -= element2.clientHeight / 2;
                                }
                                clearInterval(si);
                            }
                            else {
                                n++;
                                if (n > 50) {
                                    clearInterval(si);
                                }
                            }
                        }, 100);
                    }
                },
            })}
            </div>`;
        }, obj.tag);
    }
    static funnelFilter(obj) {
        return html ` <div
            class="c_funnel"
            onclick="${obj.gvc.event((e) => {
            obj.callback('c_funnel');
        })}"
        >
            <i class="fa-regular fa-filter"></i>
        </div>`;
    }
    static updownFilter(obj) {
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            checkClass: this.getDarkDotClass(obj.gvc),
            show: false,
            top: 0,
            right: 0,
        };
        return html ` <div
                class="c_updown"
                onclick="${obj.gvc.event((e) => {
            vm.show = !vm.show;
            const element = document.querySelector('.c_updown');
            const rect = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
            if (rect) {
                vm.top = rect.top + 40;
                vm.right = rect.right;
            }
            obj.gvc.notifyDataChange(vm.id);
        })}"
            >
                <i class="fa-regular fa-arrow-up-arrow-down"></i>
            </div>
            ${obj.gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.show) {
                    return html ` <div class="c_fixed" style="top: ${vm.top}px; right: calc(100vw - ${vm.right}px)">
                            <div class="form-check d-flex flex-column" style="gap: 16px">
                                ${obj.gvc.map(obj.options.map((opt) => {
                        return html ` <div>
                                            <input
                                                class="form-check-input ${vm.checkClass}"
                                                type="radio"
                                                id="${opt.key}"
                                                name="radio_${vm.id}"
                                                onclick="${obj.gvc.event((e) => {
                            vm.show = !vm.show;
                            obj.callback(e.id);
                            obj.gvc.notifyDataChange(vm.id);
                        })}"
                                                ${obj.default === opt.key ? 'checked' : ''}
                                            />
                                            <label class="form-check-label c_updown_label" for="${opt.key}">${opt.value}</label>
                                        </div>`;
                    }))}
                            </div>
                        </div>`;
                }
                return '';
            },
            divCreate: {
                style: vm.show ? '' : 'd-none',
            },
        })}`;
    }
    static arrowDownDataImage(color) {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='${color}'%3e%3cpath d='M225.813 48.907L128 146.72 30.187 48.907 0 79.093l128 128 128-128z'/%3e%3c/svg%3e"`;
    }
    static checkedDataImage(color) {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='${color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"`;
    }
    static darkDotDataImage(color) {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='${color}'/%3e%3c/svg%3e"`;
    }
    static whiteDotDataImage(color) {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='16' height='16' rx='8' fill='${color}'/%3e%3crect x='4' y='4' width='8' height='8' rx='4' fill='white'/%3e%3c/svg%3e"`;
    }
    static duringInputContainer(gvc, obj, def, callback) {
        var _a, _b, _c, _d;
        const defualt = (def && def.length) > 1 ? def : ['', ''];
        if (obj.list.length > 1) {
            const first = obj.list[0];
            const second = obj.list[1];
            return html `
                <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
                    <input
                        class="form-control"
                        type="${(_a = first.type) !== null && _a !== void 0 ? _a : 'text'}"
                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                        placeholder="${(_b = first.placeHolder) !== null && _b !== void 0 ? _b : ''}"
                        onchange="${gvc.event((e, ele) => {
                defualt[0] = e.value;
                callback(defualt);
            })}"
                        value="${defualt[0]}"
                    />
                    <span>${obj.centerText}</span>
                    <input
                        class="form-control"
                        type="${(_c = second.type) !== null && _c !== void 0 ? _c : 'text'}"
                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                        placeholder="${(_d = second.placeHolder) !== null && _d !== void 0 ? _d : ''}"
                        onchange="${gvc.event((e, ele) => {
                defualt[1] = e.value;
                callback(defualt);
            })}"
                        value="${defualt[1]}"
                    />
                </div>
            `;
        }
        return '';
    }
    static multiCheckboxContainer(gvc, data, def, callback, obj) {
        const id = gvc.glitter.getUUID();
        const inputColor = obj && obj.readonly ? '#808080' : undefined;
        const randomString = obj && obj.single ? this.getWhiteDotClass(gvc, inputColor) : this.getCheckedClass(gvc, inputColor);
        const viewId = Tool.randomString(5);
        return gvc.bindView({
            bind: viewId,
            view: () => {
                let checkboxHTML = '';
                data.map((item) => {
                    checkboxHTML += html `
                        <div>
                            <div
                                class="form-check"
                                onclick="${gvc.event((e, evt) => {
                        if (obj && obj.readonly) {
                            evt.preventDefault();
                            return;
                        }
                        if (obj && obj.single) {
                            def = [item.key];
                            callback([item.key]);
                        }
                        else {
                            if (!def.find((d) => d === item.key)) {
                                def.push(item.key);
                            }
                            else {
                                def = def.filter((d) => d !== item.key);
                            }
                            def = def.filter((d) => data.map((item2) => item2.key).includes(d));
                            callback(def);
                        }
                        gvc.notifyDataChange(viewId);
                    })}"
                            >
                                <input
                                    class="form-check-input ${randomString} cursor_pointer"
                                    style="margin-top: 0.35rem;"
                                    type="${obj && obj.single ? 'radio' : 'checkbox'}"
                                    id="${id}_${item.key}"
                                    ${def.includes(item.key) ? 'checked' : ''}
                                />
                                <label class="form-check-label cursor_pointer" for="${id}_${item.key}" style="font-size: 16px; color: #393939;">${item.name}</label>
                            </div>
                            ${def.includes(item.key) && item.innerHtml
                        ? html ` <div class="d-flex position-relative my-2">
                                      ${this.leftLineBar()}
                                      <div class="ms-4 w-100 flex-fill">${item.innerHtml}</div>
                                  </div>`
                        : ``}
                        </div>
                    `;
                });
                return html ` <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">${checkboxHTML}</div> `;
            },
        });
    }
    static radioInputContainer(gvc, data, def, callback) {
        const id = gvc.glitter.getUUID();
        const randomString = this.getDarkDotClass(gvc);
        return gvc.bindView({
            bind: id,
            view: () => {
                let radioInputHTML = '';
                data.map((item) => {
                    var _a, _b;
                    radioInputHTML += html `
                        <div class="m-1">
                            <div class="form-check ps-0">
                                <input
                                    class="${randomString}"
                                    type="radio"
                                    id="${id}_${item.key}"
                                    name="radio_${id}"
                                    onchange="${gvc.event(() => {
                        def.key = item.key;
                        gvc.notifyDataChange(id);
                    })}"
                                    ${def.key === item.key ? 'checked' : ''}
                                />
                                <label class="form-check-label" for="${id}_${item.key}" style="font-size: 16px; color: #393939;">${item.name}</label>
                            </div>
                            <div class="d-flex align-items-center border rounded-3">
                                <input
                                    class="form-control border-0 bg-transparent shadow-none"
                                    type="${(_a = item.type) !== null && _a !== void 0 ? _a : 'text'}"
                                    style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                    placeholder="${(_b = item.placeHolder) !== null && _b !== void 0 ? _b : ''}"
                                    onchange="${gvc.event((e) => {
                        def.value = e.value;
                        callback(def);
                    })}"
                                    value="${def.key === item.key ? def.value : ''}"
                                    ${def.key === item.key ? '' : 'disabled'}
                                />
                                ${item.unit ? html ` <div class="py-2 pe-3">${item.unit}</div>` : ''}
                            </div>
                        </div>
                    `;
                });
                return html ` <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">${radioInputHTML}</div> `;
            },
        });
    }
    static spinner(obj) {
        return html ` <div class="d-flex align-items-center justify-content-center flex-column w-100 my-3 mx-auto">
            <div class="spinner-border ${obj && obj.spinnerNone ? 'd-none' : ''}" role="status"></div>
            <span class="mt-3 ${obj && obj.textNone ? 'd-none' : ''}">載入中...</span>
        </div>`;
    }
    static mbContainer(margin_bottom_px) {
        return html ` <div style="margin-bottom: ${margin_bottom_px}px"></div>`;
    }
    static mb240() {
        return html ` <div style="margin-bottom: 240px"></div>`;
    }
    static alertInfo(title, messageList, css = {
        class: '',
        style: '',
    }) {
        let h = '';
        if (messageList && messageList.length > 0) {
            messageList.map((str) => {
                h += html `<p class="mb-1">${str}</p>`;
            });
        }
        return html ` <div class="w-100 alert  alert-secondary p-3 mb-0 ${css.class}" style="${css.style}">
            <div class="fs-5 mb-0"><strong>${title}</strong></div>
            ${messageList && messageList.length > 0 ? `<div class="mt-2">${h}</div>` : ``}
        </div>`;
    }
    static imageSelector(gvc, image, callback) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (!image) {
                        return html ` <div
                            class="w-100 image-container"
                            style="flex: 1 1 0; align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; display: inline-flex;  "
                        >
                            <div
                                class="parent_"
                                style="align-self: stretch; border-radius: 10px; overflow: hidden; border: 1px #DDDDDD solid; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex;"
                            >
                                <div
                                    class="w-100"
                                    style="height: 191px; padding-top: 59px; padding-bottom: 58px; background: white; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden;  justify-content: center; align-items: center; display: flex;position: relative;"
                                >
                                    <div
                                        class="w-100"
                                        style="height: 191px; padding-top: 59px; padding-bottom: 58px; background: white; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden;  justify-content: center; align-items: center; display: flex;  "
                                    >
                                        <div style="flex-direction: column; justify-content: center; align-items: center;">
                                            <div
                                                style="padding: 10px; background: white; box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.10); border-radius: 10px; justify-content: center; align-items: center; gap: 10px; display: inline-flex;cursor: pointer;cursor: pointer;  "
                                            >
                                                <div
                                                    style="color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word;  "
                                                    onclick="${gvc.event(() => {
                            EditorElem.uploadFileFunction({
                                gvc: gvc,
                                callback: (text) => {
                                    callback(text);
                                    image = text;
                                    gvc.notifyDataChange(id);
                                },
                                type: `image/*, video/*`,
                            });
                        })}"
                                                >
                                                    新增圖片
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                    else {
                        return html ` <div>
                            <div
                                class="w-100 image-container"
                                style="flex: 1 1 0; align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; display: inline-flex;  "
                            >
                                <div
                                    class=" parent_"
                                    style="align-self: stretch; border-radius: 10px; overflow: hidden; border: 1px #DDDDDD solid; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex;  "
                                >
                                    <div
                                        class=" w-100"
                                        style="height: 191px; padding-top: 59px; padding-bottom: 58px; background: white; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden;  justify-content: center; align-items: center; display: flex;position: relative;  "
                                    >
                                        <img style="position: absolute;max-width: 100%;height: calc(100% - 10px);  " src="${image}" />
                                    </div>
                                    <div
                                        class=" child_"
                                        style="position: absolute;    width: 100%;    height: 100%;    background: rgba(0, 0, 0, 0.726);top: 0px;  "
                                        onclick="${gvc.event(() => {
                            image = '';
                            callback('');
                            gvc.notifyDataChange(id);
                        })}"
                                    >
                                        <i
                                            class=" fa-regular fa-trash mx-auto fs-1"
                                            style="position: absolute;    transform: translate(-50%,-50%);top: 50%;left: 50%;color: white;cursor: pointer;  "
                                            aria-hidden="true"
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }
                },
            };
        });
    }
    static selNavbar(data) {
        return html `
            <div
                style="display: flex; width: 100%; border-radius: 10px; padding: 0 18px;
                background: linear-gradient(0deg, #F7F7F7 0%, #F7F7F7 100%), #FFF;
                ${document.body.clientWidth > 768 ? 'justify-content: space-between; align-items: center; height: 40px;' : 'justify-content: center; gap: 8px; flex-direction: column; height: 80px;'}"
            >
                <div style="font-size: 14px; color: #393939; font-weight: 700;">已選取${data.count}項</div>
                <div style="display: flex; gap: 12px;">${data.buttonList.join('')}</div>
            </div>
        `;
    }
    static selEventButton(text, event) {
        return html `
            <button class="btn sel_normal" type="button" onclick="${event}">
                <span style="font-size: 14px; color: #393939; font-weight: 400;">${text}</span>
            </button>
        `;
    }
    static selEventDropmenu(obj) {
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            checkClass: Tool.randomString(5),
            show: false,
            top: 0,
            right: 0,
        };
        return html ` <div>
            <div
                class="sel_normal"
                onclick="${obj.gvc.event(() => {
            vm.show = !vm.show;
            const element = document.querySelector('.sel_normal');
            const rect = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
            if (rect) {
                vm.top = rect.top + 30;
                vm.right = document.body.clientWidth > 768 ? rect.right : 300;
            }
            obj.gvc.notifyDataChange(vm.id);
        })}"
            >
                <span style="font-size: 14px; color: #393939; font-weight: 400;">${obj.text}</span><i class="fa-regular fa-angle-down ms-1"></i>
            </div>
            ${obj.gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.show) {
                    return html ` <div class="c_fixed" style="top: ${vm.top}px; right: calc(100vw - ${vm.right}px)">
                            <div class="form-check d-flex flex-column ps-0" style="gap: 16px">
                                ${obj.gvc.map(obj.options.map((opt) => {
                        return html ` <div class="cursor_pointer" onclick="${opt.event}">${opt.name}</div>`;
                    }))}
                            </div>
                        </div>`;
                }
                return '';
            },
            divCreate: {
                style: vm.show ? '' : 'd-none',
            },
        })}
        </div>`;
    }
    static validImageBox(obj) {
        var _a, _b;
        const imageVM = {
            id: obj.gvc.glitter.getUUID(),
            class: Tool.randomString(6),
            loading: true,
            url: this.noImageURL,
        };
        obj.gvc.addStyle(`
            .${imageVM.class} {
                min-width: ${obj.width}px;
                min-height: ${(_a = obj.height) !== null && _a !== void 0 ? _a : obj.width}px;
                max-width: ${obj.width}px;
                max-height: ${(_b = obj.height) !== null && _b !== void 0 ? _b : obj.width}px;
            }
        `);
        return obj.gvc.bindView({
            bind: imageVM.id,
            view: () => {
                var _a, _b;
                return html `<img class="${imageVM.class} ${(_a = obj.class) !== null && _a !== void 0 ? _a : ''}" style="${(_b = obj.style) !== null && _b !== void 0 ? _b : ''}" src="${imageVM.url}" />`;
            },
            divCreate: {},
            onCreate: () => {
                if (imageVM.loading) {
                    this.isImageUrlValid(obj.image).then((isValid) => {
                        if (isValid) {
                            imageVM.url = obj.image;
                        }
                        imageVM.loading = false;
                        obj.gvc.notifyDataChange(imageVM.id);
                    });
                }
            },
        });
    }
    static isImageUrlValid(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    static getCheckedClass(gvc, color) {
        const className = Tool.randomString(6);
        gvc.addStyle(`
            .${className} {
                min-width: 1rem;
                min-height: 1rem;
            }
            .${className}:checked[type='checkbox'] {
                border: 2px solid ${color !== null && color !== void 0 ? color : '#000'};
                background-color: #fff;
                background-image: url(${this.checkedDataImage(color !== null && color !== void 0 ? color : '#000')});
                background-position: center center;
            }
        `);
        return className;
    }
    static getDarkDotClass(gvc, color) {
        const className = Tool.randomString(6);
        gvc.addStyle(`
            .${className} {
                min-width: 1rem;
                min-height: 1rem;
                margin-right: 4px;
            }
            .${className}:checked[type='radio'] {
                border: 2px solid #000;
                background-color: #fff;
                background-image: url(${this.darkDotDataImage(color !== null && color !== void 0 ? color : '#000')});
                background-position: center center;
            }
        `);
        return className;
    }
    static getWhiteDotClass(gvc, color) {
        const className = Tool.randomString(6);
        gvc.addStyle(`
            .${className} {
                min-width: 1rem;
                min-height: 1rem;
                margin-right: 4px;
            }
            .${className}:checked[type='radio'] {
                border: 0px solid #000;
                background-color: #fff;
                background-image: url(${this.whiteDotDataImage(color !== null && color !== void 0 ? color : '#000')});
                background-position: center center;
            }
        `);
        return className;
    }
    static summaryHTML(stringArray) {
        return stringArray
            .map((list) => {
            return list
                .map((item) => {
                return html `<div class="tx_normal" style="overflow-wrap: break-word;">${item}</div>`;
            })
                .join(this.mbContainer(8));
        })
            .join(this.horizontalLine());
    }
}
BgWidget.noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
BgWidget.getContainerWidth = (obj) => {
    const width = document.body.clientWidth;
    const rateForWeb = obj && obj.rate && obj.rate.web ? obj.rate.web : 0.79;
    const rateForPad = obj && obj.rate && obj.rate.pad ? obj.rate.pad : 0.92;
    const rateForPhone = obj && obj.rate && obj.rate.phone ? obj.rate.phone : 0.95;
    if (width >= 1440) {
        return 1440 * rateForWeb;
    }
    if (width >= 1200) {
        return 1200 * rateForWeb;
    }
    if (width >= 768) {
        return width * rateForPad;
    }
    return width * rateForPhone;
};
window.glitter.setModule(import.meta.url, BgWidget);
