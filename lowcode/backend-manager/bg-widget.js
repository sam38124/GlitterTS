import { PageSplit } from './splitPage.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
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
                        return html ` <div class=" fs-2 text-center" style="padding-bottom:32px;">${vm.stateText}</div>`;
                    }
                    else {
                        return html ` <div class=" p-0 " style="">
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
                        return html ` <div class="fs-2 text-center" style="padding-bottom: 32px;">${vm.stateText}</div>`;
                    }
                    else {
                        return html ` <div class="m-0 p-0" style="${(_a = obj.table_style) !== null && _a !== void 0 ? _a : ''}">
                            ${obj.filter ? html `<div style="padding: 12px;">${obj.filter}</div>` : ''}
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
                                                                  class="${(_a = dd.position) !== null && _a !== void 0 ? _a : 'text-start'} tx_normal"
                                                                  style="border:none; color:#393939 !important; ${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}"
                                                              >
                                                                  ${dd.key}
                                                              </th>`;
                            })
                                .join('')}
                                              </tr>`}
                                    </thead>
                                    <tbody>
                                        ${vm.data.length === 0
                            ? html ` <div class="fs-2 text-center" style="padding-bottom:32px;">${vm.stateText}</div>`
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
                                                                          style="color:#393939 !important;border:none;${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}"
                                                                      >
                                                                          <div class="my-auto" style="${(obj.style || []) && obj.style[index] ? obj.style[index] : ``}">${d3.value}</div>
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
    static card(htmlString, classStyle = 'p-3 bg-white rounded-3 shadow border w-100') {
        return html `<div class="${classStyle}" style="">${htmlString}</div>`;
    }
    static cancel(event, text = '取消') {
        return html `<div class="cursor_it bt_c39_w" onclick="${event}">${text}</div>`;
    }
    static save(event, text = '儲存') {
        return html `<div class="cursor_it bt_c39" onclick="${event}">${text}</div>`;
    }
    static card_main(htmlString) {
        return html `<div class="w-100" style="border-radius: 10px; padding: 20px; background: #FFF; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);">${htmlString}</div>`;
    }
    static container(html, width, style) {
        return `<div class="mx-auto" style="padding:24px;${width ? `max-width:100%;width:${width}px;` : ``};color:black;${style !== null && style !== void 0 ? style : ''}">${html}</div>`;
    }
    static title(title) {
        return html ` <h3 class="my-auto tx_title">${title}</h3>`;
    }
    static goBack(event) {
        return html `<div class="d-flex align-items-center justify-content-center" style="width: 5px; height: 11px; cursor:pointer; margin-right: 10px;" onclick="${event}">
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
                                        class="d-flex align-items-center cursor_it"
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
                    class: `ps-1 d-flex`,
                    style: `gap:10px;margin-top:10px;`,
                },
            };
        })}
        `;
    }
    static editeInput(obj) {
        var _a, _b, _c, _d;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        return html `${obj.title ? html `<div class="tx_normal fw-normal">${obj.title}</div>` : ``}
            <input
                class="bgw-input ${obj.readonly ? `bgw-input-readonly` : ``}"
                style="${(_b = obj.style) !== null && _b !== void 0 ? _b : ''}"
                type="${(_c = obj.type) !== null && _c !== void 0 ? _c : 'text'}"
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
                value="${(_d = obj.default) !== null && _d !== void 0 ? _d : ''}"
                ${obj.readonly ? `readonly` : ``}
            />`;
    }
    static textArea(obj) {
        var _a, _b, _c;
        obj.title = (_a = obj.title) !== null && _a !== void 0 ? _a : '';
        return html `${obj.title ? html `<div class="tx_normal fw-normal">${obj.title}</div>` : ''}
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
        return html `<div class="w-100 position-relative" style="margin: ${margin};">
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
                target.push({ name: title, icon: '', link: `./?collection=${title}&page=all_product` });
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
                    return html `${obj.title ? html `<div class="tx_normal fw-normal">${obj.title}</div>` : ``}
                        <div style="position: relative">
                            ${obj.gvc.bindView({
                        bind: linkComp.id,
                        view: () => {
                            var _a, _b;
                            if (linkComp.loading) {
                                return html `<div
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
                                            return html `<div
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
                                        productList.push({ name: title, icon: icon, link: `./product_detail?product_id=${id}` });
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
                                            acticleList.push({ name: name, icon: '', link: `./article?appName=${appName}&article=${tag}` });
                                        }
                                    });
                                }
                                resolve();
                            });
                        }),
                    ]).then(() => {
                        dropMenu.recentList = [
                            { name: '首頁', icon: 'fa-regular fa-house', link: './index' },
                            { name: '商品', icon: 'fa-regular fa-tag', link: './all_product', items: productList },
                            { name: '商品分類', icon: 'fa-regular fa-tags', link: '', items: collectionList },
                            { name: '網誌文章', icon: 'fa-regular fa-newspaper', link: './blog_list', items: acticleList },
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
        return html `<div class="ms-2 border-end position-absolute h-100" style="left: 0px;"></div>`;
    }
    static grayButton(text, event) {
        return html `<button class="btn-gary" type="button" onclick="${event}">${text}</button>`;
    }
    static searchFilter(event, vale, placeholder, margin) {
        return html `<div class="w-100 position-relative" style="margin: ${margin !== null && margin !== void 0 ? margin : 0};">
            <i class=" fa-regular fa-magnifying-glass" style=" font-size: 18px;color: #A0A0A0;position: absolute;left:20px;top:50%;transform: translateY(-50%);" aria-hidden="true"></i>
            <input class="form-control h-100 " style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;" placeholder="${placeholder}" onchange="${event}" value="${vale}" />
        </div>`;
    }
    static selectFilter(obj) {
        return html `<select
            class="c_select"
            onchange="${obj.gvc.event((e) => {
            obj.callback(e.value);
        })}"
        >
            ${obj.gvc.map(obj.options.map((opt) => html ` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>${opt.value}</option>`))}
        </select>`;
    }
    static funnelFilter(obj) {
        return html `<div
            class="c_funnel"
            onclick="${obj.gvc.event((e) => {
            obj.callback('c_funnel');
        })}"
        >
            <i class="fa-regular fa-filter"></i>
        </div>`;
    }
    static updownFilter(obj) {
        obj.gvc.addStyle(`
            .form-check-input:checked[type='radio'] {
                border: 2px solid #000;
                background-color: #fff;
                background-image: url(${this.dotDataImage('#000')});
                background-position: center center;
            }
        `);
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            show: false,
            top: 0,
            right: 0,
        };
        return html `<div
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
                        return html `<div>
                                            <input
                                                class="form-check-input"
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
        const defualt = def.length > 1 ? def : ['', ''];
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
    static multiCheckboxContainer(gvc, data, def, callback) {
        gvc.addStyle(`
            .form-check-input:checked[type='checkbox'] {
                border: 2px solid #000;
                background-color: #fff;
                background-image: url(${this.checkedDataImage('#000')});
                background-position: center center;
            }
        `);
        const id = gvc.glitter.getUUID();
        let checkboxHTML = '';
        data.map((item) => {
            checkboxHTML += html `
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="${id}_${item.key}"
                        onchange="${gvc.event((e) => {
                if (e.checked) {
                    def.push(item.key);
                }
                else {
                    def = def.filter((d) => d !== item.key);
                }
                callback(def);
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
        gvc.addStyle(`
            .form-check-input:checked[type='radio'] {
                border: 2px solid #000;
                background-color: #fff;
                background-image: url(${this.dotDataImage('#000')});
                background-position: center center;
            }
        `);
        const id = gvc.glitter.getUUID();
        return gvc.bindView({
            bind: id,
            view: () => {
                let radioInputHTML = '';
                data.map((item) => {
                    var _a, _b;
                    radioInputHTML += html `
                        <div class="m-1">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
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
                                ${item.unit ? html `<div class="py-2 pe-3">${item.unit}</div>` : ''}
                            </div>
                        </div>
                    `;
                });
                return html ` <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">${radioInputHTML}</div> `;
            },
        });
    }
}
window.glitter.setModule(import.meta.url, BgWidget);
