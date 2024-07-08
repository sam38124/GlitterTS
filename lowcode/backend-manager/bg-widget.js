import { PageSplit } from './splitPage.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { EditorElem } from "../glitterBundle/plugins/editor-elem.js";
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
                        return html ` <div class="p-0" style="">
                            <div class="" style="overflow-x:scroll;">
                                <table
                                    class="table table-centered table-nowrap  text-center table-hover fw-500 fs-7"
                                    style="overflow-x:scroll;margin-left: 32px;margin-right: 32px;width:calc(100% - 64px);${(_a = obj.table_style) !== null && _a !== void 0 ? _a : ''}"
                                >
                                    <div class="" style="padding: 16px 32px;">${(_b = obj.filter) !== null && _b !== void 0 ? _b : ''}</div>

                                    <thead class="" style="">
                                        ${vm.data.length === 0
                            ? ''
                            : html ` <tr>
                                                  ${vm.data[0]
                                .map((dd, index) => {
                                var _a;
                                return html ` <th
                                                                  class="${(_a = dd.position) !== null && _a !== void 0 ? _a : 'text-start'} tx_normal fw-bold"
                                                                  style="border:none;padding-bottom: 30px;color:#393939 !important;${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}"
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
                                                                          style="color:#393939 !important;border:none;
${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}
"
                                                                      >
                                                                          <div class="my-auto" style="${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}">${d3.value}</div>
                                                                          ${index === dd.length - 1 && obj.editable
                                        ? `
                                                                                                      <i id="${pencilId}" class="fa-regular fa-pencil position-absolute d-none me-2" style="right: 5px;transform: translateY(-50%);top:50%;"></i>
                                                                                                    `
                                        : ``}
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
                            ${obj.filter ? html ` <div style="padding: 12px;">${obj.filter}</div>` : ''}
                            <div style="overflow-x:scroll; z-index: 1;">
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
                                                                  style="white-space:nowrap;border:none; color:#393939 !important; ${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}"
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
                                                          onclick="${gvc.event((e, ev) => {
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
                                                                          style="color:#393939 !important;border:none;${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}"
                                                                      >
                                                                          <div class="my-1 text-nowrap" style="${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}">${d3.value}</div>
                                                                          ${index === dd.length - 1 && obj.editable
                                        ? html `
                                                                                    <i
                                                                                        id="${pencilId}"
                                                                                        class="fa-regular fa-pencil position-absolute d-none me-2"
                                                                                        style="right: 5px;transform: translateY(-50%);top:50%;"
                                                                                    ></i>
                                                                                `
                                        : ``}
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
    static danger(event, text = '取消') {
        return html `
            <button class="btn btn-red" type="button" onclick="${event}">
                <span class="text-white">${text}</span>
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
        return html ` <div class="${classStyle}" style="">${htmlString}</div>`;
    }
    static mainCard(htmlString, classString, styleString) {
        return html ` <div class="main-card ${classString !== null && classString !== void 0 ? classString : ''}" style="${styleString !== null && styleString !== void 0 ? styleString : ''}">${htmlString !== null && htmlString !== void 0 ? htmlString : ''}</div>`;
    }
    static mainCardMbp0(htmlString, classString, styleString) {
        return html ` <div class="main-card ${classString !== null && classString !== void 0 ? classString : ''}  " style="${document.body.clientWidth < 800 ? `border-radius: 0px;` : ``}${styleString !== null && styleString !== void 0 ? styleString : ''} ">${htmlString !== null && htmlString !== void 0 ? htmlString : ''}</div>`;
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
    static title_16(title) {
        return html ` <h3 class="my-auto tx_title" style="white-space: nowrap;font-size: 16px;">${title}</h3>`;
    }
    static hint_title(title) {
        return html ` <h3 class="my-auto tx_title" style="color: #8D8D8D;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;">${title}</h3>`;
    }
    static sub_title(title) {
        return html `<h3 class="my-auto tx_title " style="white-space: nowrap;font-size: 14px;font-weight: 400;">
            ${title}</h3>`;
    }
    static tab(data, gvc, select, callback) {
        return html `
            <div class=""
                 style="justify-content: flex-start; align-items: flex-start; gap: 22px; display: inline-flex;cursor: pointer;margin-top: 24px;margin-bottom: 24px;">
                ${data.map((dd) => {
            if (select === dd.key) {
                return `<div style=" flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
    <div style="align-self: stretch; text-align: center; color: #393939; font-size: 18px; font-family: Noto Sans; font-weight: 700; line-height: 18px; word-wrap: break-word">${dd.title}</div>
    <div style="align-self: stretch; height: 0px; border: 2px #393939 solid"></div>
  </div>`;
            }
            else {
                return `<div style=" flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex" onclick="${gvc.event(() => {
                    callback(dd.key);
                })}">
    <div style="align-self: stretch; text-align: center; color: #393939; font-size: 18px; font-family: Noto Sans; font-weight: 400; line-height: 18px; word-wrap: break-word">${dd.title}</div>
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
                <div class="d-flex align-items-center border rounded-3 ${obj.readonly ? `bgw-input-readonly` : ``}" style="margin: 8px 0;">
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
            <i class=" fa-regular fa-magnifying-glass" style=" font-size: 18px;color: #A0A0A0;position: absolute;left:20px;top:50%;transform: translateY(-50%);" aria-hidden="true"></i>
            <input class="form-control h-100 " style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;" placeholder="${placeholder}" onchange="${event}" value="${vale}" />
        </div>`;
    }
    static linkList(obj) {
        var _a, _b;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        const appName = window.parent.appName;
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
            loading: true,
            search: '',
            prevList: [],
            recentList: {},
            recentParent: [],
        };
        const setCollectionPath = (target, data) => {
            (data || []).map((item, index) => {
                const { title, array } = item;
                target.push({ name: title, icon: '', link: `./?collection=${title}&page=all-product` });
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
                pathHTML += html `<span class="mx-1">${path}</span>${index === pathList.length - 1 ? '' : html `<i class="fa-solid fa-chevron-right"></i>`}`;
            });
            return html ` <div style="display: flex; flex-wrap: wrap; align-items: center; font-size: 16px; font-weight: 500; gap: 6px; line-height: 140%;cursor: default;">
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
            linkComp.loading = !linkComp.loading;
            dropMenu.loading = !dropMenu.loading;
            obj.gvc.notifyDataChange(dropMenu.id);
            obj.gvc.notifyDataChange(linkComp.id);
        };
        const callbackEvent = (data) => {
            linkComp.text = data.link;
            obj.callback(data.link);
            componentFresh();
        };
        return obj.gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading) {
                    return '';
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
                                            class="form-control"
                                            style="${(_a = obj.style) !== null && _a !== void 0 ? _a : ''} margin-top:8px;"
                                            onclick="${obj.gvc.event(() => {
                                    componentFresh();
                                })}"
                                        >
                                            ${linkComp.text.length > 0 ? formatLinkText(linkComp.text) : `<span style="color: #b4b7c9">${obj.placeHolder}</span>`}
                                        </div>`;
                            }
                            else {
                                return html `
                                            <input
                                                class="form-control"
                                                style="${(_b = obj.style) !== null && _b !== void 0 ? _b : ''} margin-top:8px;"
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
                                                    class="m-3"
                                                    style="font-size: 16px; font-weight: 500; gap: 6px; line-height: 140%;cursor: pointer;"
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
                                    .filter((item) => {
                                    return item.name.includes(dropMenu.search);
                                })
                                    .map((tag) => {
                                    h2 += html `
                                                    <div class="m-3" style="cursor:pointer;display: flex; align-items: center; justify-content: space-between;">
                                                        <div
                                                            class="link-item-container ${tag.link && tag.link.length > 0 ? 'hoverF2' : ''}"
                                                            style="cursor: pointer;"
                                                            onclick=${obj.gvc.event(() => {
                                        tag.link && tag.link.length > 0 && callbackEvent(tag);
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
                                                            class="hoverF2 pe-2"
                                                            style=""
                                                            onclick=${obj.gvc.event(() => {
                                        dropMenu.prevList.push(dataList);
                                        dropMenu.recentParent.push(tag.name);
                                        tag.items && (dataList = tag.items);
                                        obj.gvc.notifyDataChange(dropMenu.id);
                                    })}
                                                        >
                                                            <i class="fa-solid fa-chevron-right ${tag.items && tag.items.length > 0 ? '' : 'd-none'}" style="cursor: pointer;"></i>
                                                        </div>
                                                    </div>
                                                `;
                                });
                                return html `
                                            <div class="border border-2 rounded-2 p-2" style="width: 310px;">
                                                ${h1}
                                                <div style="overflow-y: auto; max-height: 42.5vh;">${h2}</div>
                                            </div>
                                        `;
                            }
                        },
                        divCreate: { style: 'position: absolute; top: 42.5px; left: 0; z-index: 1; background-color: #fff;' },
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
                    Promise.all([
                        new Promise((resolve) => {
                            ApiShop.getCollection().then((data) => {
                                setCollectionPath(collectionList, data.length > 0 ? data.response.value : []);
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
                                            link: `./product_detail?product_id=${id}`,
                                        });
                                    });
                                    resolve();
                                }
                            });
                        }),
                        new Promise((resolve) => {
                            ApiPost.getManagerPost({ page: 0, limit: 20, type: 'article' }).then((data) => {
                                if (data.result) {
                                    data.response.data.map((item) => {
                                        const { name, tag } = item.content;
                                        if (name) {
                                            acticleList.push({ name: name, icon: '', link: `./article?article=${tag}` });
                                        }
                                    });
                                }
                                resolve();
                            });
                        }),
                    ]).then(() => {
                        dropMenu.recentList = [
                            { name: '首頁', icon: 'fa-regular fa-house', link: './index' },
                            { name: '商品', icon: 'fa-regular fa-tag', link: './all-product', items: productList },
                            { name: '商品分類', icon: 'fa-regular fa-tags', link: '', items: collectionList },
                            {
                                name: '網誌文章',
                                icon: 'fa-regular fa-newspaper',
                                link: './blog_list',
                                items: acticleList,
                            },
                            { name: '關於我們', icon: 'fa-regular fa-user-group', link: './aboutus' },
                        ].filter((menu) => {
                            if (menu.items === undefined)
                                return true;
                            return menu.items.length > 0 || menu.link.length > 0;
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
        return html ` <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>`;
    }
    static bottomLineBar() {
        return html ` <div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>`;
    }
    static grayButton(text, event, obj) {
        var _a;
        return html ` <button class="btn btn-gray" type="button" onclick="${event}">
            <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}"></i>
            <span class="tx_700" style="${(_a = obj === null || obj === void 0 ? void 0 : obj.textStyle) !== null && _a !== void 0 ? _a : ''}">${text}</span>
        </button>`;
    }
    static darkButton(text, event, obj) {
        var _a, _b;
        const size = { btn: '', font: '' };
        if (obj && obj.size) {
            size.btn = `btn-black-${obj.size}`;
            size.font = `tx_white_${obj.size}`;
        }
        return html `<button class="btn btn-black ${size.btn}" type="button" style="${(_a = obj === null || obj === void 0 ? void 0 : obj.style) !== null && _a !== void 0 ? _a : ''}" onclick="${event}">
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
        return html ` <div class="form-check form-switch m-0" style="margin-top: 10px; cursor: pointer;">
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
            <div class="form-check form-switch m-0 mt-1" style="margin-top: 10px; cursor: pointer;">
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
            checkClass: this.randomString(5),
            loading: true,
            show: false,
            def: JSON.parse(JSON.stringify(obj.default)),
        };
        obj.gvc.addStyle(`
            .${vm.checkClass}:checked[type='checkbox'] {
                border: 2px solid #000;
                background-color: #fff;
                background-image: url(${this.checkedDataImage('#000')});
                background-position: center center;
            }
        `);
        return obj.gvc.bindView({
            bind: vm.id,
            view: () => {
                var _a;
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
                        <div style="font-size: 15px; cursor: pointer; color: #000;">
                            ${defLine.length > 0
                    ? defLine
                        .map((item) => {
                        return item.value;
                    })
                        .join(' / ')
                    : BgWidget.grayNote('（點擊選擇項目）')}
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
                checkClass: this.randomString(5),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [],
                query: '',
                orderString: '',
            };
            obj.gvc.addStyle(`
                .${vm.checkClass}:checked[type='checkbox'] {
                    border: 2px solid #000;
                    background-color: #fff;
                    background-image: url(${this.checkedDataImage('#000')});
                    background-position: center center;
                }
            `);
            return html ` <div style="min-width: 400px; width: 600px; overflow-y: auto;" class="bg-white shadow rounded-3">
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
                                        <div class="d-flex" style="gap: 12px;">
                                            ${this.searchFilter(gvc.event((e, event) => {
                        vm.query = e.value;
                        vm.loading = true;
                        obj.gvc.notifyDataChange(vm.id);
                    }), vm.query || '', '搜尋')}
                                            ${this.updownFilter({
                        gvc,
                        callback: (value) => {
                            vm.orderString = value;
                            vm.loading = true;
                            obj.gvc.notifyDataChange(vm.id);
                        },
                        default: vm.orderString || 'default',
                        options: obj.updownOptions || [],
                    })}
                                        </div>
                                        ${obj.gvc.map(vm.options.map((opt) => {
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
                                    <div class="c_dialog_bar">
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
                                    </div>
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
            checkClass: this.randomString(5),
            show: false,
            top: 0,
            right: 0,
        };
        obj.gvc.addStyle(`
            .${vm.checkClass}:checked[type='radio'] {
                border: 2px solid #000;
                background-color: #fff;
                background-image: url(${this.dotDataImage('#000')});
                background-position: center center;
            }
        `);
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
                                            <label class="form-check-label c_updown_label" for="${opt.key}" style="">${opt.value}</label>
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
    static dotDataImage(color) {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='${color}'/%3e%3c/svg%3e"`;
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
    static randomString(max) {
        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    static multiCheckboxContainer(gvc, data, def, callback, readonly, single) {
        const id = gvc.glitter.getUUID();
        const randomString = this.randomString(5);
        let checkboxHTML = '';
        gvc.addStyle(`
            .${randomString}:checked[type='checkbox'] {
                border: 2px solid #000;
                background-color: #fff;
                background-image: url(${this.checkedDataImage('#000')});
                background-position: center center;
            }
        `);
        data.map((item) => {
            checkboxHTML += html `
                <div class="form-check">
                    <input
                        class="form-check-input ${randomString}"
                        style="margin-top: 0.35rem;"
                        type="checkbox"
                        id="${id}_${item.key}"
                        onclick="${gvc.event((e, ev) => {
                if (readonly) {
                    ev.preventDefault();
                    return;
                }
            })}"
                        onchange="${gvc.event((e, ev) => {
                if (single) {
                    callback([item.key]);
                }
                else {
                    if (e.checked) {
                        def.push(item.key);
                    }
                    else {
                        def = def.filter((d) => d !== item.key);
                    }
                    callback(def);
                }
            })}"
                        ${def.includes(item.key) ? 'checked' : ''}
                    />
                    <label class="form-check-label" for="${id}_${item.key}" style="font-size: 16px; color: #393939;">${item.name}</label>
                </div>
            `;
        });
        return html ` <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">${checkboxHTML}</div> `;
    }
    static radioInputContainer(gvc, data, def, callback) {
        const id = gvc.glitter.getUUID();
        const randomString = this.randomString(5);
        gvc.addStyle(`
            .${randomString}:checked[type='radio'] {
                margin-right: 4px;
                border: 2px solid #000;
                background-color: #fff;
                background-image: url(${this.dotDataImage('#000')});
                background-position: center center;
            }
        `);
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
    static alertInfo(title, messageList) {
        let h = '';
        if (messageList && messageList.length > 0) {
            messageList.map((str) => {
                h += html `<p class="mb-1">${str}</p>`;
            });
        }
        return html ` <div class="w-100 alert  alert-secondary p-3 mb-0" style="">
            <div class="fs-5 mb-0"><strong>${title}</strong></div>
            ${(messageList && messageList.length > 0) ? `<div class="mt-2">${h}</div>` : ``}
        </div>`;
    }
    static h(gvc) {
        const config = {
            id: 229,
            domain: 'clouthingV2.shopnex.cc',
            user: '234285319',
            appName: 't_1719819344426',
            created_time: '2024-02-18T02:28:37.000Z',
            dead_line: '2024-02-25T02:28:37.000Z',
            config: {
                homePage: 'index',
                dead_line: '2024-02-25T02:28:37.000Z',
                pagePlugin: [],
                color_theme: [
                    {
                        id: 's5s5s0scs6sbs1sa',
                        title: '#000000',
                        content: '#000000',
                        background: '#ffffff',
                        'solid-button-bg': '#000000',
                        'border-button-bg': '#000000',
                        'solid-button-text': '#FFFFFF',
                        'border-button-text': '#000000',
                    },
                    {
                        id: 'scsfses4s8s0s4sf',
                        title: '#FFFFFF',
                        content: '#FFFFFF',
                        background: '#000000',
                        'solid-button-bg': '#FFFFFF',
                        'border-button-bg': '#FFFFFF',
                        'solid-button-text': '#FFFFFF',
                        'border-button-text': '#FFFFFF',
                    },
                    {
                        id: 's7s8scs2s3s2s7s3',
                        title: '#a81515',
                        content: '#d70909',
                        background: '#000000',
                        'solid-button-bg': '#000000',
                        'border-button-bg': '#000000',
                        'solid-button-text': '#000000',
                        'border-button-text': '#fcfcfc',
                    },
                ],
                eventPlugin: [],
                globalStyle: [
                    {
                        id: 'sasfscses1sds4s1-s6s8s4s2-4s4s7s8-s8sbs6s1-scs2s2s7s8sas4sesdsas6sd',
                        js: '$style1/official.js',
                        data: {
                            attr: [],
                            elem: 'style',
                            inner: '/***請輸入設計代碼***/\n@import url(\'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;200;300;400;500;600;700;800;900&display=swap\');\n@import url(\'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&display=swap\');\n@import url(\'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap\');\n\nbody{\n     font-family: \'Noto Sans TC\' !important;\n}\n\npagination .page-item.active .page-link {\n    box-shadow: none;\n}\n.page-item.active .page-link {\n    z-index: 3;\n    color: #fff;\n    /*@{{btn_select}}*/\n}\n.page-link {\n    border:none !important;\n}\n.page-item:not(:first-child) .page-link {\n    margin-left: 0;\n}\n.pagination .page-link {\n    display: flex;\n    align-items: center;\n    height: 100%;\n    border-radius: 0.375rem;\n    font-size: .875rem;\n    font-weight: 600;\n}\n.page-link {\n    padding: 0.45rem 0.875rem;\n}\n.page-link {\n    position: relative;\n    display: block;\n    color: #3e4265;\n    text-decoration: none;\n    background-color: transparent;\n    transition: color .2s ease-in-out,background-color .2s ease-in-out,border-color .2s ease-in-out,box-shadow .2s ease-in-out;\n}\n@media (min-width: 1200px) {\n .hy-drawer-content{\n width: 434px;\n}\n.hy-drawer-content.hy-drawer-left{\nleft:-434px;\n}\n}\n\n.dropend-toggle:after {\n    content: "\\f054" !important;\n}\n\n.container img{\nmax-width: 100% !important;\n}\n\n/* 定义淡入动画的关键帧 */\n@keyframes fadeIn {\n  from {\n    opacity: 0; /* 从完全透明开始 */\n  }\n  to {\n    opacity: 1; /* 渐变到完全不透明 */\n  }\n}\n\n/* 应用动画效果的元素 */\n.fade {\n  animation: fadeIn 1s ease-in-out forwards; /* 1秒的动画时间，以及ease-in-out的缓动函数 */\n}\n\n\na {\n  text-decoration: none !important;\n}\n\n.swiper-pagination-bullet{\n  width: 8px !important;\n  height: 8px !important;\n}\n\n.btn-main{\n  background: #554233;\n  color: white !important;\npadding: 10px;\ncursor: pointer;\nborder-radius: 5px;\ntext-align: center;\ndisplay: flex;\nalign-items: center;\njustify-content: center;\n}\n\n.form-check-input:checked {\n  /*@{{check_input}}*/\n}\n\n.form-check-label{\n  /*@{{tc_bold}}*/\n  font-weight: 500;\n}\n\n.offcanvas-backdrop{\n  background-color: rgba(0, 0, 0, 0.3) !important;\n}\n\n\n\n.user-info-btn{\nheight:59px;\nalign-items: center;\njustify-content: center;\ndisplay: flex;\n/*@{{tc_no_select}}*/\nfont-family: "Open Sans";\nfont-size: 16px !important;\nfont-style: normal;\nfont-weight: 400;\nline-height: normal;\n}\n\n.user-info-btn-select{\nfont-family: "Open Sans";\nfont-style: normal;\nfont-weight: 700;\nfont-size: 16px !important;\nline-height: normal;\n/*@{{tc_bold}}*/\n}\n\n.order-table-head{\n/*@{{tc_bold}}*/\ntext-align: center;\nfont-family: "Open Sans";\nfont-size: 16px;\nfont-style: normal;\nfont-weight: 600;\n}\n\n@media (min-width: 1000px) {\n.user-info-btn{\nheight:59px;\nalign-items: center;\njustify-content: center;\ndisplay: flex;\n/*@{{tc_no_select}}*/\nfont-family: "Open Sans";\nfont-size: 18px;\nfont-style: normal;\nfont-weight: 400;\nline-height: normal;\n}\n\n.user-info-btn-select{\nfont-family: "Open Sans";\nfont-style: normal;\nfont-weight: 700;\nline-height: normal;\n/*@{{tc_bold}}*/\n}\n.order-table-head{\n/*@{{tc_bold}}*/\ntext-align: center;\nfont-family: "Open Sans";\nfont-size: 18px;\nfont-style: normal;\nfont-weight: 700;\n}\n       }\n\n\n\n.list-group-item-action:hover{\n  /*@{{tc_bold}}*/\n}\n\n.swiper-pagination-bullet-active{\n  /*@{{swiper_bg}}*/\n}',
                            dataFrom: 'static',
                            atrExpand: {
                                expand: true,
                            },
                            elemExpand: {
                                expand: true,
                            },
                            innerEvenet: {},
                        },
                        type: 'widget',
                        index: 0,
                        label: 'STYLE代碼',
                        onCreateEvent: {
                            clickEvent: [],
                        },
                        preloadEvenet: {},
                        refreshAllParameter: {},
                        refreshComponentParameter: {},
                    },
                    {
                        id: 'scsescs1sas6s7sb-s6sdsdsf-4s4s1s6-s9s7s4se-s8sases0sfs6sds7s0scsbsc',
                        js: 'https://sam38124.github.io/One-page-plugin/src/official.js',
                        css: {
                            class: {},
                            style: {},
                        },
                        data: {
                            attr: [
                                {
                                    attr: 'href',
                                    type: 'par',
                                    value: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1707495501605-theme.min.css',
                                    expand: false,
                                    attrType: 'link',
                                    valueFrom: 'manual',
                                },
                                {
                                    attr: 'rel',
                                    type: 'par',
                                    value: 'stylesheet',
                                    expand: false,
                                    attrType: 'normal',
                                },
                            ],
                            elem: 'link',
                            note: '',
                            class: '',
                            inner: '',
                            style: '',
                            setting: [],
                            dataFrom: 'static',
                            atrExpand: {
                                expand: true,
                            },
                            elemExpand: {
                                expand: true,
                            },
                            innerEvenet: {},
                        },
                        type: 'widget',
                        index: 1,
                        label: 'STYLE資源',
                        styleList: [],
                        onCreateEvent: {},
                        preloadEvenet: {},
                        refreshAllParameter: {},
                        refreshComponentParameter: {},
                    },
                    {
                        id: 's3s1s7s0sds3s6sd',
                        js: 'https://sam38124.github.io/One-page-plugin/src/official.js',
                        css: {
                            class: {},
                            style: {},
                        },
                        data: {
                            attr: [
                                {
                                    attr: 'href',
                                    type: 'par',
                                    value: 'https://kit.fontawesome.com/cccedec0f8.css',
                                    expand: false,
                                    attrType: 'normal',
                                    valueFrom: 'manual',
                                },
                                {
                                    attr: 'rel',
                                    type: 'par',
                                    value: 'stylesheet',
                                    expand: false,
                                    attrType: 'normal',
                                },
                            ],
                            elem: 'link',
                            note: '',
                            class: '',
                            inner: '',
                            style: '',
                            setting: [],
                            dataFrom: 'static',
                            atrExpand: {
                                expand: true,
                            },
                            elemExpand: {
                                expand: true,
                            },
                            innerEvenet: {},
                        },
                        type: 'widget',
                        index: 2,
                        label: 'STYLE資源',
                        styleList: [],
                        preloadEvenet: {},
                        refreshAllParameter: {},
                        refreshComponentParameter: {},
                    },
                ],
                globalValue: [
                    {
                        id: 's7sfsbs3sas3s8s9-ses9s1sc-4s8s8sb-sbscs1sc-sfsfs2sas9s8sfses6s4sds3',
                        data: {
                            setting: [
                                {
                                    id: 's6s8sdsasbscsbs1-s3s6s3se-4s3s5s9-s8s3s9s5-s0s8s7scses9s3s1s0s3s2s2',
                                    data: {
                                        tag: 'tc_bold',
                                        value: 'color: #554233 !important;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: '字體顏色-粗體',
                                    toggle: false,
                                },
                                {
                                    id: 'sds6s3sas0s6s3s7-s7s5s7s2-4s7s7s0-s8s4sesf-s3sfsas4s2sesdsbs6sbs5s1',
                                    data: {
                                        tag: 'tc_light',
                                        value: 'color: #554233;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 1,
                                    label: '字體顏色-細體',
                                    toggle: false,
                                },
                                {
                                    id: 's6s3s6s4s9sbs4sf-s3s0s5s7-4scs8s5-s8s4s3s6-s0s6s9sbs8sesfs5s4scs2sf',
                                    data: {
                                        tag: 'tc_no_select',
                                        value: 'color: #AD9C8F;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 2,
                                    label: '字體顏色-未選中',
                                },
                                {
                                    id: 's1s9s7s0s1scsds7-s7sbs7s1-4s7s4s3-s9s3sas8-s6sesascs1sbs3s3s2sfs1se',
                                    data: {
                                        tag: 'btn_noselect',
                                        value: 'background: white;border: 1px #AD9C8F solid;color: #AD9C8F;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 3,
                                    label: '按鈕樣式-未選中',
                                    toggle: false,
                                },
                                {
                                    id: 's8s8s9s6s2sfscs9-s0s8s0sa-4s6sesa-s9sbsbs9-sas9sbs2s0s8sds1s3s2sesc',
                                    data: {
                                        tag: 'btn_select',
                                        value: 'color: #554233;background: #E2D6CD;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 4,
                                    label: '按鈕樣式-選中',
                                    toggle: false,
                                },
                                {
                                    id: 's4s3s6sasbsas6s9-s5s2s8s7-4s3scsb-s8sbsdsa-s9sfsbsbsds9sbs2sfs7sas6',
                                    data: {
                                        tag: 'btn_select',
                                        value: 'color: white;background: #554233;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 5,
                                    label: '按鈕樣式-頁面切換',
                                    toggle: false,
                                },
                                {
                                    id: 's4sescs8sas7s3s7-s5s7sbs9-4s4sbsa-sbs2s7s3-s3s5sasbs5scs2ses8s8s9s5',
                                    data: {
                                        tag: 'check_input',
                                        value: 'background: #554233;border: 1px solid #554233;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 6,
                                    label: '勾選匡樣式',
                                    toggle: false,
                                },
                                {
                                    id: 'sasfs9ses1sbsesb-s1s9s3sb-4s9s3sd-s8sfs2sd-s7sesds0scs8s4s0s8sfs6s3',
                                    data: {
                                        tag: 'btn_action',
                                        value: 'background: #554233;color: white;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 7,
                                    label: '主要按鈕樣式',
                                },
                                {
                                    id: 'sfsases3sdsds9s2-s9s3s0s0-4sdscs4-s8sdscs1-scs7sfsfscs5sfs4s9sas8s4',
                                    data: {
                                        tag: 'border_color',
                                        value: 'border-color: #554233;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 8,
                                    label: '編筐線條顏色',
                                    toggle: false,
                                },
                                {
                                    id: 's3s8s7s3s1sas9sf-s0ses6s9-4sds0s9-sbs3sasd-s4sfs6sesbs6sasesfs3s4s9',
                                    data: {
                                        tag: 'swiper_bg',
                                        value: 'background-color: #554233 !important;',
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 9,
                                    label: 'Swiper按鈕背景樣式',
                                },
                            ],
                            tagType: 'value',
                        },
                        type: 'container',
                        index: 0,
                        label: '設計樣式',
                        toggle: true,
                    },
                ],
                initialCode: '',
                initialList: [],
                globalScript: [
                    {
                        id: 's2s1s3s3s3scsbs1-scs7s5s4-4sfs3s7-sascs8s5-scs8s2s6s5s9s2s1s6s7s0sc',
                        js: '$style1/official.js',
                        css: {
                            class: {},
                            style: {},
                        },
                        data: {
                            clickEvent: {
                                clickEvent: [
                                    {
                                        clickEvent: {
                                            src: './official_event/event.js',
                                            route: 'user_token_check',
                                        },
                                        errorEvent: {
                                            clickEvent: [
                                                {
                                                    eventList: [
                                                        {
                                                            title: '在帳號相關頁面',
                                                            trigger: {
                                                                clickEvent: [
                                                                    {
                                                                        link: 'login',
                                                                        clickEvent: {
                                                                            src: './official_event/event.js',
                                                                            route: 'link',
                                                                        },
                                                                        pluginExpand: {},
                                                                        stackControl: 'home',
                                                                        link_change_type: 'inlink',
                                                                    },
                                                                ],
                                                            },
                                                            yesEvent: {
                                                                clickEvent: [
                                                                    {
                                                                        code: "return ['wishlist','account_userinfo','order_list'].indexOf(glitter.getUrlParameter('page'))!==-1",
                                                                        clickEvent: {
                                                                            src: './official_event/event.js',
                                                                            route: 'code',
                                                                        },
                                                                        codeVersion: 'v2',
                                                                        pluginExpand: {},
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                    clickEvent: {
                                                        src: './official_event/event.js',
                                                        route: 'codeArray',
                                                    },
                                                    pluginExpand: {},
                                                },
                                            ],
                                        },
                                        pluginExpand: {},
                                        successEvent: {
                                            clickEvent: [],
                                        },
                                    },
                                ],
                            },
                            triggerTime: 'async',
                        },
                        type: 'code',
                        index: 0,
                        label: '代碼區塊',
                        preloadEvenet: {},
                        refreshAllParameter: {},
                        refreshComponentParameter: {},
                    },
                    {
                        id: 's6s6s8ses7s8s8s7-s8sfs3s7-4s7sas8-sbscs4s5-s5s8s9sbs8s3s7sescsbs6s5',
                        js: 'https://sam38124.github.io/One-page-plugin/src/official.js',
                        data: {
                            attr: [
                                {
                                    attr: 'src',
                                    type: 'par',
                                    value: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
                                    expand: false,
                                    attrType: 'normal',
                                },
                                {
                                    attr: 'crossorigin',
                                    type: 'par',
                                    value: 'anonymous',
                                    expand: false,
                                    attrType: 'normal',
                                },
                                {
                                    attr: 'async',
                                    type: 'append',
                                    attrType: 'normal',
                                    valueFrom: 'manual',
                                    clickEvent: [
                                        {
                                            code: 'return true;',
                                            clickEvent: {
                                                src: './official_event/event.js',
                                                route: 'code',
                                            },
                                            codeVersion: 'v2',
                                            pluginExpand: {},
                                        },
                                    ],
                                },
                            ],
                            elem: 'script',
                            note: '',
                            inner: '',
                            setting: [],
                            dataFrom: 'static',
                            atrExpand: {
                                expand: true,
                            },
                            elemExpand: {
                                expand: true,
                            },
                        },
                        type: 'widget',
                        index: 1,
                        label: 'SCRIPT資源',
                        styleList: [],
                        onCreateEvent: {},
                        preloadEvenet: {},
                        refreshAllParameter: {},
                        refreshComponentParameter: {},
                    },
                ],
                template_type: 2,
                backendPlugins: [],
                globalStyleTag: [
                    {
                        id: 's1s2s2s3s8s9s0sb-s6sds8sb-4sas7sc-s8s4s1sf-s1sas6sasbscsas2s8s6s7s6',
                        data: {
                            setting: [
                                {
                                    id: 's1ses9s0sas1s9s8-s9s9s0sb-4s2s8s3-sasdses4-sasds2sfsfs6s6s3sas2s7se',
                                    data: {
                                        tag: '商品卡片',
                                        value: {
                                            class: 'col-6 col-lg-3 col-md-4 p-2',
                                            style: 'margin-bottom: 10px;',
                                            stylist: [],
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: '商品卡片',
                                    refreshAllParameter: {},
                                    refreshComponentParameter: {},
                                },
                                {
                                    id: 's8s5s0s6ses4scsd-s1s8sasd-4ses8s3-sbs5s1s8-s0s7s0s8sfs4s3s0sfs5s4s1',
                                    data: {
                                        tag: '商品標題',
                                        value: {
                                            class: '',
                                            style: 'color: #171717;text-align: start;font-size: 24px;font-style: normal;font-weight: 400;margin-top:10px;line-height: 140%; /* 33.6px */',
                                            stylist: [],
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 1,
                                    label: '商品標題',
                                },
                                {
                                    id: 's4sdsds7s2s4s5s9-s9s0s0sc-4s7s7s6-s9s5s8sf-s2s6sds4s0s4s7s4s2sds3sf',
                                    data: {
                                        tag: '商品卡片-滑動',
                                        value: {
                                            list: [],
                                            class: '',
                                            style: 'width: calc(100% - 80px);min-width: calc(100% - 80px);',
                                            stylist: [
                                                {
                                                    size: '1000',
                                                    class: 'col-6 col-lg-3 col-md-4',
                                                    style: 'margin-bottom: 10px;',
                                                    dataType: 'static',
                                                    classDataType: 'static',
                                                },
                                            ],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 2,
                                    label: '商品卡片-滑動',
                                    refreshAllParameter: {},
                                    refreshComponentParameter: {},
                                },
                            ],
                        },
                        type: 'container',
                        index: 0,
                        label: '商品區塊',
                        toggle: true,
                    },
                    {
                        id: 'sasesesasfs0sfs1-s2s2s2se-4s6s6sa-s9s8sfsf-s0s3s4s2scs8s4sfs1s4s0se',
                        data: {
                            setting: [
                                {
                                    id: 'sds3s8s9sbs1s5sa-ses7s5s5-4s5s3s1-s9seses5-sbs7s3s8s0s8sas5s4sasfs4',
                                    data: {
                                        tag: 'input_conatiner',
                                        value: {
                                            list: [],
                                            class: '',
                                            style: 'display: flex;flex-direction: column;gap:10px;',
                                            stylist: [],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: 'input_conatiner',
                                },
                                {
                                    id: 's6s2ses8sfs4sas8-s5s2s8s3-4s5s3sf-s9s0s1s4-s6s5sbsasasbs2s9scs8scsd',
                                    data: {
                                        tag: 'input_label',
                                        value: {
                                            list: [],
                                            class: '',
                                            style: 'text-align: left; font-size: 16px; font-family: Open Sans; font-weight: 400; line-height: 22.40px; word-wrap: break-word;/*@{{tc_bold}}*/',
                                            stylist: [],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 1,
                                    label: 'input_label',
                                },
                                {
                                    id: 'sasfs1sas9s3s9sb-s8s8s4s3-4s2s9s3-s8s2sds7-s2sfsas2s4scsbs1s1scs5s9',
                                    data: {
                                        tag: 'input',
                                        value: {
                                            list: [],
                                            class: '',
                                            style: 'height: 44px; background: white; border: 1px #2F2F2F solid;padding-left: 10px;',
                                            stylist: [],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 2,
                                    label: 'input',
                                },
                            ],
                        },
                        type: 'container',
                        index: 1,
                        label: '訂單資訊',
                        toggle: true,
                    },
                    {
                        id: 'sfs3s8s4s4sas3sc-s7s5s5sc-4s5s9se-sascs3s4-s3sbs8sas7s0s3s2s1s1s5sc',
                        data: {
                            setting: [
                                {
                                    id: 's0s2s5sas8sbsbsf-s9s3sds0-4s6s0s2-sasdses8-s7s0s7sds1s2s5sfscs7sbs1',
                                    data: {
                                        tag: '選項分類',
                                        value: {
                                            class: 'fs-6',
                                            style: '',
                                            stylist: [],
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: '選項分類',
                                },
                            ],
                        },
                        type: 'container',
                        index: 2,
                        label: '分類元件',
                        toggle: false,
                    },
                    {
                        id: 'sfs4s1sesfs9s2s5-s2sas2s8-4s8s0s9-sas0sfsb-sas4sbs2s3s5s6s5s7sfs6sb',
                        data: {
                            setting: [
                                {
                                    id: 's5sfs1sds2s9s0s0-s9s8s6s7-4s2s0sf-s8s6s4s8-s5s1sfsds8sas0s0s6sfsds5',
                                    data: {
                                        tag: '首頁-標題',
                                        value: {
                                            class: 'px-3 px-lg-0',
                                            style: 'text-align: start;            font-family: Open Sans;            font-size: 32px;            font-style: normal;            font-weight: 700;            line-height: 140%;            padding-top: 48px;            padding-bottom: 36px;',
                                            stylist: [
                                                {
                                                    size: '1200',
                                                    class: 'px-3 px-lg-0',
                                                    style: 'text-align: start;            font-family: Open Sans;            font-size: 32px;            font-style: normal;            font-weight: 700;            line-height: 140%;            padding-top: 96px;            padding-bottom: 42px;',
                                                    dataType: 'static',
                                                    classDataType: 'static',
                                                },
                                            ],
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: '首頁-標題',
                                    refreshAllParameter: {},
                                    refreshComponentParameter: {},
                                },
                            ],
                        },
                        type: 'container',
                        index: 3,
                        label: '首頁',
                        toggle: false,
                    },
                    {
                        id: 'sfs2s9s8s2s3sds4-s0sas2sa-4sfs2s9-sascsfs5-s4sds8s0s2s3s8s0s6sds3s3',
                        data: {
                            setting: [
                                {
                                    id: 's5s8scsas9sbs3s2-ses3s6s4-4s4s1s3-s8sfs7s9-s4sdsfsas6sbs1s9sds3sds6',
                                    data: {
                                        tag: '輸入框樣式',
                                        value: {
                                            list: [],
                                            class: 'w-auto flex-fill',
                                            style: 'border: 1px solid #2F2F2F;background: #FFF;font-family: Open Sans;font-size: 14px;font-style: normal;font-weight: 400;line-height: 140%;height: 44px;width: 200px;padding-left: 20px;',
                                            stylist: [],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: '輸入框樣式',
                                },
                                {
                                    id: 's5sds5ses0sdses5-s8s5s9s0-4s0ses7-sas6s7sf-s4s5sesbs3s4s5sfs0s4sds2',
                                    data: {
                                        tag: '容器樣式',
                                        value: {
                                            list: [],
                                            class: 'd-flex',
                                            style: 'gap:10px;align-items: center;margin-bottom: 19px;',
                                            stylist: [
                                                {
                                                    size: '1000',
                                                    class: 'd-flex',
                                                    style: 'gap:30px;align-items: center;margin-bottom: 19px;',
                                                    dataType: 'static',
                                                    classDataType: 'static',
                                                },
                                            ],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 1,
                                    label: '容器樣式',
                                },
                                {
                                    id: 'sdsas4s1s5sasas6-s1sasesb-4s8sase-sbsbs8sf-s9s5s2sds3s5s1s1s2sasas8',
                                    data: {
                                        tag: 'Label',
                                        value: {
                                            list: [],
                                            class: 'form-label',
                                            style: 'width: 100px;',
                                            stylist: [
                                                {
                                                    size: '1000',
                                                    class: 'form-label',
                                                    style: 'width: 100px;',
                                                    dataType: 'static',
                                                    classDataType: 'static',
                                                },
                                            ],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 2,
                                    label: 'Label',
                                },
                            ],
                        },
                        type: 'container',
                        index: 4,
                        label: '表單樣式',
                        toggle: true,
                    },
                    {
                        id: 'sdscs8s7s8sbs1se-s4s7s7sd-4s6sfs2-s8s0s5sb-s3s8s9s3s7s8s4s9s7s4s1s5',
                        data: {
                            setting: [
                                {
                                    id: 's5s8scsas9sbs3s2-ses3s6s4-4s4s1s3-s8sfs7s9-s4sdsfsas6sbs1s9sds3sds6',
                                    data: {
                                        tag: '註冊頁面-輸入框',
                                        value: {
                                            list: [],
                                            class: 'w-100 form-control',
                                            style: 'border: 1px solid #554233;background: #FFF;font-family: Open Sans;font-size: 14px;font-style: normal;font-weight: 400;line-height: 140%;height: 60px;width: 200px;padding-left: 20px;border-radius: 100px;',
                                            stylist: [],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: '註冊頁面-輸入框',
                                },
                                {
                                    id: 's5sds5ses0sdses5-s8s5s9s0-4s0ses7-sas6s7sf-s4s5sesbs3s4s5sfs0s4sds2',
                                    data: {
                                        tag: '註冊頁面-容器',
                                        value: {
                                            list: [],
                                            class: 'd-flex',
                                            style: 'align-items: flex-start;flex-direction: column;margin-bottom: 10px;',
                                            stylist: [],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 1,
                                    label: '註冊頁面-容器',
                                },
                                {
                                    id: 'sdsas4s1s5sasas6-s1sasesb-4s8sase-sbsbs8sf-s9s5s2sds3s5s1s1s2sasas8',
                                    data: {
                                        tag: '註冊頁面-Label',
                                        value: {
                                            list: [],
                                            class: 'form-label fs-base',
                                            style: 'text-align: left;font-family: Open Sans;font-style: normal;font-weight: 400;line-height: 140%;/*@{{tc_bold}}*/',
                                            stylist: [
                                                {
                                                    size: '1000',
                                                    class: 'form-label fs-base',
                                                    style: '/*@{{tc_bold}}*/text-align: left;font-family: Open Sans;font-style: normal;font-weight: 400;line-height: 140%;width: 150px;',
                                                    dataType: 'static',
                                                    classDataType: 'static',
                                                },
                                            ],
                                            version: 'v2',
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 2,
                                    label: '註冊頁面-Label',
                                },
                            ],
                        },
                        type: 'container',
                        index: 5,
                        label: '註冊頁面-表單樣式',
                        toggle: true,
                    },
                    {
                        id: 's1s0sesfs8s1sds1-s4sbs5s3-4scsfs5-s9sfsds6-s0scs9sas8s2s9s2s5s5sasf',
                        data: {
                            setting: [
                                {
                                    id: 's5s8scsas9sbs3s2-ses3s6s4-4s4s1s3-s8sfs7s9-s4sdsfsas6sbs1s9sds3sds6',
                                    data: {
                                        tag: '輸入框樣式-重設密碼',
                                        value: {
                                            class: 'w-auto flex-fill',
                                            style: 'border: 1px solid #2F2F2F;background: #FFF;font-family: Open Sans;font-size: 14px;font-style: normal;font-weight: 400;line-height: 140%;height: 44px;width: 200px;padding-left: 20px;',
                                            stylist: [],
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: '輸入框樣式-重設密碼',
                                },
                                {
                                    id: 's5sds5ses0sdses5-s8s5s9s0-4s0ses7-sas6s7sf-s4s5sesbs3s4s5sfs0s4sds2',
                                    data: {
                                        tag: '容器樣式-重設密碼',
                                        value: {
                                            class: 'd-flex',
                                            style: 'gap:15px;align-items: center;margin-bottom: 19px;',
                                            stylist: [],
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 1,
                                    label: '容器樣式-重設密碼',
                                },
                                {
                                    id: 'sdsas4s1s5sasas6-s1sasesb-4s8sase-sbsbs8sf-s9s5s2sds3s5s1s1s2sasas8',
                                    data: {
                                        tag: 'Label-重設密碼',
                                        value: {
                                            class: 'fs-6',
                                            style: 'color: #000;text-align: right;font-family: Open Sans;font-style: normal;font-weight: 400;line-height: 140%;width: 80px;white-space: nowrap;margin-right: 10px;',
                                            stylist: [],
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'value',
                                    },
                                    type: 'text',
                                    index: 2,
                                    label: 'Label-重設密碼',
                                },
                            ],
                        },
                        type: 'container',
                        index: 6,
                        label: '表單樣式-重設密碼',
                        toggle: false,
                    },
                    {
                        id: 's7s5s5s1s3s2sesc-sfs0s4s0-4s7s4sa-sasds6s7-s8sescs5s5sdsfs4s8ses4s7',
                        data: {
                            setting: [
                                {
                                    id: 's0s1scsds1s9s7s2-sbs1sds9-4s6s6sd-sbs9s7sc-scs5scsbsesfs2sds7s7s5s5',
                                    data: {
                                        tag: 'aboutus-container',
                                        value: {
                                            class: 'my-2',
                                            style: '',
                                            stylist: [],
                                            dataType: 'static',
                                            classDataType: 'static',
                                        },
                                        tagType: 'style',
                                    },
                                    type: 'text',
                                    index: 0,
                                    label: 'aboutus-container',
                                },
                            ],
                        },
                        type: 'container',
                        index: 7,
                        label: '表單樣式-關於我們',
                        toggle: true,
                    },
                ],
                template_config: {
                    tag: ['電子商務', '服飾產業', '精品產業'],
                    desc: ' 這是一個關於服飾產業的電子商務主題模板。<br>\n        ．全站支援藍新/綠界/線下金流。<br>\n        ．超商取貨 / 宅配 。',
                    name: '2406-精品與服飾',
                    image: [
                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1709091655085-Screenshot 2024-02-28 at 11.39.29 AM.jpg',
                        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1709091643540-Screenshot 2024-02-28 at 11.39.51 AM.jpg',
                    ],
                    status: 'wait',
                    post_to: 'all',
                    version: '1.0',
                    created_by: 'Jianzhi.wang',
                    preview_img: '',
                },
                initialStyleSheet: [],
            },
            brand: 'shopnex',
            template_config: {
                tag: ['電子商務', '服飾產業', '精品產業'],
                desc: ' 這是一個關於服飾產業的電子商務主題模板。<br>\n        ．全站支援藍新/綠界/線下金流。<br>\n        ．超商取貨 / 宅配 。',
                name: '2406-精品與服飾',
                image: [
                    'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1709091655085-Screenshot 2024-02-28 at 11.39.29 AM.jpg',
                    'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1709091643540-Screenshot 2024-02-28 at 11.39.51 AM.jpg',
                ],
                status: 'wait',
                post_to: 'all',
                version: '1.0',
                created_by: 'Jianzhi.wang',
                preview_img: '',
            },
            template_type: 2,
            sql_pwd: 'utcaai5fdc0u',
            sql_admin: 'fqezcd',
            ec2_id: null,
            update_time: '2024-06-28T00:26:40.000Z',
            theme_config: null,
            refer_app: null,
            plan: null,
        };
        const planText = '免費試用';
        return html ` <div class="d-flex ${document.body.clientWidth > 768 ? '' : 'flex-column'}" style="color: #393939;">
            當前方案:${planText} ${document.body.clientWidth > 768 ? `<div class="mx-2 text-body">/</div>` : '<br />'}
            <div class="${new Date(config.dead_line).getTime() < new Date().getTime() ? `text-danger` : `text-body`}" style="font-size:14px;">
                ${new Date(config.dead_line).getTime() < new Date().getTime() ? ` 方案已過期` : ` 方案到期日`} ：${gvc.glitter.ut.dateFormat(new Date(config.dead_line), 'yyyy-MM-dd hh:mm')}
            </div>
        </div>`;
    }
    static imageSelector(gvc, image, callback) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (!image) {
                        return html `<div class="w-100 image-container" style="flex: 1 1 0; align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; display: inline-flex;  ">
                                <div class="parent_"
                                     style="align-self: stretch; border-radius: 10px; overflow: hidden; border: 1px #DDDDDD solid; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex;" >
                                    <div class="w-100"
                                         style="height: 191px; padding-top: 59px; padding-bottom: 58px; background: white; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden;  justify-content: center; align-items: center; display: flex;position: relative;">
                                        <div class="w-100"
                                             style=" height: 191px; padding-top: 59px; padding-bottom: 58px; background: white; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden;  justify-content: center; align-items: center; display: flex;  "
                                        >
                                            <div  style="flex-direction: column; justify-content: center; align-items: center;">
                                                <div  style=" padding: 10px; background: white; box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.10); border-radius: 10px; justify-content: center; align-items: center; gap: 10px; display: inline-flex;cursor: pointer;cursor: pointer;  ">
                                                    <div style=" color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word;  "
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
                        })}">新增圖片
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                    }
                    else {
                        return html `
                            <div class=" " style="">
                                <div class="w-100 image-container"
                                     style="     flex: 1 1 0; align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; display: inline-flex;  "
                                >
                                    <div class=" parent_"
                                         style=" align-self: stretch; border-radius: 10px; overflow: hidden; border: 1px #DDDDDD solid; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex;  "
                                    >
                                        <div class=" w-100"
                                             style="     height: 191px; padding-top: 59px; padding-bottom: 58px; background: white; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden;  justify-content: center; align-items: center; display: flex;position: relative;  "
                                        ><img class=""
                                              style="     position: absolute;max-width: 100%;height: calc(100% - 10px);  "

                                              src="${image}">
                                        </div>
                                        <div class=" child_"
                                             style="     position: absolute;    width: 100%;    height: 100%;    background: rgba(0, 0, 0, 0.726);top: 0px;  "
                                             onclick="${gvc.event(() => {
                            image = '';
                            callback('');
                            gvc.notifyDataChange(id);
                        })}"
                                        ><i class=" fa-regular fa-trash mx-auto fs-1"
                                            style="     position: absolute;    transform: translate(-50%,-50%);top: 50%;left: 50%;color: white;cursor: pointer;  "
                                            aria-hidden="true"></i></div>
                                    </div>
                                </div>
                            </div>`;
                    }
                }
            };
        });
    }
}
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
