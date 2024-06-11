import { PageSplit } from './splitPage.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { GVC } from '../glitterBundle/GVController.js';

interface MenuItem {
    name: string;
    icon: string;
    link: string;
    items?: MenuItem[];
}

interface CollecrtionItem {
    title: string;
    array?: CollecrtionItem[];
}

export class BgWidget {
    static table(obj: {
        gvc: GVC;
        getData: (vm: { page: number; loading: boolean; callback: () => void; pageSize: number; data: any }) => void;
        rowClick?: (data: any, index: number) => void;
        filter?: string;
        style?: string[];
        table_style?: string;
        editable?: boolean;
    }) {
        obj.style = obj.style || [];
        const gvc = obj.gvc;
        const glitter = obj.gvc.glitter;
        const html = String.raw;
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const ps = new PageSplit(gvc);
            const vm: {
                loading: boolean;
                callback: () => void;
                data: any;
                page: number;
                pageSize: number;
                editData: any;
                stateText: string;
            } = {
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
                    if (vm.loading) {
                        return html` <div class=" fs-2 text-center" style="padding-bottom:32px;">${vm.stateText}</div>`;
                    } else {
                        return html` <div class=" p-0 " style="">
                            <div class="" style="overflow-x:scroll;">
                                <table
                                    class="table table-centered table-nowrap  text-center table-hover fw-500 fs-7"
                                    style="overflow-x:scroll;margin-left: 32px;margin-right: 32px;width:calc(100% - 64px);${obj.table_style ?? ''}"
                                >
                                    <div class="" style="padding: 16px 32px;">${obj.filter ?? ''}</div>

                                    <thead class="" style="">
                                        ${vm.data.length === 0
                                            ? ''
                                            : html` <tr>
                                                  ${vm.data[0]
                                                      .map(
                                                          (dd: any, index: number) =>
                                                              html` <th
                                                                  class="${dd.position ?? 'text-start'} t_39_16 fw-bold"
                                                                  style="border:none;padding-bottom: 30px;color:#393939 !important;${(obj.style || []) && obj.style![index] ? obj.style![index] : ``}"
                                                              >
                                                                  ${dd.key}
                                                              </th>`
                                                      )
                                                      .join('')}
                                              </tr>`}
                                    </thead>

                                    <tbody>
                                        ${vm.data.length === 0
                                            ? html` <div class=" fs-2 text-center" style="padding-bottom:32px;">${vm.stateText}</div>`
                                            : html`${vm.data
                                                  .map((dd: any, index: number) => {
                                                      const pencilId = gvc.glitter.getUUID();
                                                      return html` <tr
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
                                                              .map(
                                                                  (d3: any, index: number) =>
                                                                      html` <td
                                                                          class="${d3.position ?? 'text-start'}  t_39_16"
                                                                          ${d3.key === '●' || d3.stopDialog ? '' : html` onclick="${gvc.event(() => {})}"`}
                                                                          style="color:#393939 !important;border:none;
${(obj.style || []) && obj.style![index] ? obj.style![index] : ``}
"
                                                                      >
                                                                          <div class="my-auto" style="${(obj.style || []) && obj.style![index] ? obj.style![index] : ``}">${d3.value}</div>
                                                                          ${index === dd.length - 1 && obj.editable
                                                                              ? `
                                                                                                      <i id="${pencilId}" class="fa-regular fa-pencil position-absolute d-none me-2" style="right: 5px;transform: translateY(-50%);top:50%;"></i>
                                                                                                    `
                                                                              : ``}
                                                                      </td>`
                                                              )
                                                              .join('')}
                                                      </tr>`;
                                                  })
                                                  .join('')}`}
                                    </tbody>
                                </table>
                                <div>
                                    ${vm.data.length === 0
                                        ? ''
                                        : ps.pageSplit(
                                              vm.pageSize,
                                              vm.page,
                                              (page) => {
                                                  (vm.data = []), (vm.editData = []), (vm.page = page);
                                                  (vm.loading = true), gvc.notifyDataChange(id);
                                              },
                                              false
                                          )}
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

    static tableV2(obj: {
        gvc: GVC;
        getData: (vm: { page: number; loading: boolean; callback: () => void; pageSize: number; data: any }) => void;
        rowClick?: (data: any, index: number) => void;
        filter?: string;
        style?: string[];
        table_style?: string;
        editable?: boolean;
        tableHeader?: string[];
    }) {
        obj.style = obj.style || [];
        const gvc = obj.gvc;
        const glitter = obj.gvc.glitter;
        const html = String.raw;
        return gvc.bindView(() => {
            const id = glitter.getUUID();
            const ps = new PageSplit(gvc);
            const vm: {
                loading: boolean;
                callback: () => void;
                data: any;
                page: number;
                pageSize: number;
                editData: any;
                stateText: string;
            } = {
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
                    if (vm.loading) {
                        return html` <div class="fs-2 text-center" style="padding-bottom: 32px;">${vm.stateText}</div>`;
                    } else {
                        return html` <div class="m-0 p-0">
                            <div style="overflow-x:scroll;">
                                <table class="table table-centered table-nowrap text-center table-hover fw-400 fs-7" style="overflow-x:scroll; ${obj.table_style ?? ''}">
                                    ${obj.filter ? html`<div style="padding: 16px 32px;">${obj.filter}</div>` : ''}
                                    <thead>
                                        ${vm.data.length === 0
                                            ? ''
                                            : html` <tr>
                                                  ${vm.data[0]
                                                      .map(
                                                          (dd: any, index: number) =>
                                                              html` <th
                                                                  class="${dd.position ?? 'text-start'} t_39_16"
                                                                  style="border:none; color:#393939 !important; ${(obj.style || []) && obj.style![index] ? obj.style![index] : ``}"
                                                              >
                                                                  ${dd.key}
                                                              </th>`
                                                      )
                                                      .join('')}
                                              </tr>`}
                                    </thead>
                                    <tbody>
                                        ${vm.data.length === 0
                                            ? html` <div class="fs-2 text-center" style="padding-bottom:32px;">${vm.stateText}</div>`
                                            : html`${vm.data
                                                  .map((dd: any, index: number) => {
                                                      const pencilId = gvc.glitter.getUUID();
                                                      return html` <tr
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
                                                              .map(
                                                                  (d3: any, index: number) =>
                                                                      html` <td
                                                                          class="${d3.position ?? 'text-start'} t_39_16"
                                                                          ${d3.key === '●' || d3.stopDialog ? '' : html` onclick="${gvc.event(() => {})}"`}
                                                                          style="color:#393939 !important;border:none;${(obj.style || []) && obj.style![index] ? obj.style![index] : ``}"
                                                                      >
                                                                          <div class="my-auto" style="${(obj.style || []) && obj.style![index] ? obj.style![index] : ``}">${d3.value}</div>
                                                                          ${index === dd.length - 1 && obj.editable
                                                                              ? html`
                                                                                    <i
                                                                                        id="${pencilId}"
                                                                                        class="fa-regular fa-pencil position-absolute d-none me-2"
                                                                                        style="right: 5px;transform: translateY(-50%);top:50%;"
                                                                                    ></i>
                                                                                `
                                                                              : ``}
                                                                      </td>`
                                                              )
                                                              .join('')}
                                                      </tr>`;
                                                  })
                                                  .join('')}`}
                                    </tbody>
                                </table>
                                <div>
                                    ${vm.data.length === 0
                                        ? ''
                                        : ps.pageSplitV2(
                                              vm.pageSize,
                                              vm.page,
                                              (page) => {
                                                  (vm.data = []), (vm.editData = []), (vm.page = page);
                                                  (vm.loading = true), gvc.notifyDataChange(id);
                                              },
                                              false
                                          )}
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

    static card(html: string, classStyle: string = 'p-3 bg-white rounded-3 shadow border w-100 ') {
        return `<div class="${classStyle}" style="">
${html}
</div>`;
    }

    static cancel(event: string) {
        return `<div class="cursor_it bt_c39_w" onclick="${event}">
取消
</div>`;
    }

    static save(event: string) {
        return `<div class="cursor_it bt_c39" onclick="${event}">
儲存
</div>`;
    }

    static card_main(html: string) {
        return `<div  class="w-100" style="border-radius: 10px;
padding: 20px;
background: #FFF;
/* 陰影 */
box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);">
${html}
</div>`;
    }

    static container(html: string, width?: number, style?: string) {
        return `<div class="mx-auto" style="padding:24px;${width ? `max-width:100%;width:${width}px;` : ``};color:black;${style ?? ''}">${html}</div>`;
    }

    static title(title: string) {
        return ` <h3 class="my-auto t_39_title" >${title}</h3>`;
    }

    static goBack(event: string) {
        const html = String.raw;
        return html`<div class="d-flex align-items-center justify-content-center" style="width: 5px; height: 11px; cursor:pointer; margin-right: 10px;" onclick="${event}">
            <i class="fa-solid fa-angle-left" style="color: #393939;"></i>
        </div>`;
    }

    static inlineCheckBox(obj: {
        title: string;
        gvc: any;
        def: string | string[];
        array: string[] | { title: string; value: string; innerHtml?: string }[];
        callback: (text: string) => void;
        type?: 'single' | 'multiple';
    }) {
        const html = String.raw;
        obj.type = obj.type ?? 'single';
        const gvc = obj.gvc;
        return html`
            ${obj.title ? `<div class="t_39_16 fw-normal">${obj.title}</div>` : ``}
            ${obj.gvc.bindView(() => {
                const id = obj.gvc.glitter.getUUID();
                return {
                    bind: id,
                    view: () => {
                        return obj.array
                            .map((dd: any) => {
                                function isSelect() {
                                    if (obj.type === 'multiple') {
                                        return (obj.def as any).find((d2: any) => {
                                            return d2 === dd.value;
                                        });
                                    } else {
                                        return obj.def === dd.value;
                                    }
                                }

                                return html`
                                    <div
                                        class="d-flex align-items-center cursor_it"
                                        onclick="${obj.gvc.event(() => {
                                            if (obj.type === 'multiple') {
                                                if (
                                                    (obj.def as any).find((d2: any) => {
                                                        return d2 === dd.value;
                                                    })
                                                ) {
                                                    obj.def = (obj.def as any).filter((d2: any) => {
                                                        return d2 !== dd.value;
                                                    });
                                                } else {
                                                    (obj.def as any).push(dd.value);
                                                }
                                                obj.callback(obj.def as any);
                                            } else {
                                                obj.def = dd.value;
                                                obj.callback(dd.value);
                                            }
                                            gvc.notifyDataChange(id);
                                        })}"
                                        style="gap:6px;"
                                    >
                                        ${isSelect() ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>` : ` <div class="c_39_checkbox"></div>`}
                                        <span class="t_39_16">${dd.title}</span>
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

    static editeInput(obj: { gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void; style?: string; type?: string; readonly?: boolean; pattern?: string }) {
        obj.title = obj.title ?? '';
        const html = String.raw;
        return html`${obj.title ? html`<div class="t_39_16 fw-normal">${obj.title}</div>` : ``}
            <input
                class="bgw-input ${obj.readonly ? `bgw-input-readonly` : ``}"
                style="${obj.style ?? ''}"
                type="${obj.type ?? 'text'}"
                placeholder="${obj.placeHolder}"
                onchange="${obj.gvc.event((e) => {
                    obj.callback(e.value);
                })}"
                oninput="${obj.gvc.event((e) => {
                    if (obj.pattern) {
                        const value = e.value;
                        // 只允許英文字符、數字和連字符
                        const regex = new RegExp(`[^${obj.pattern}]`, 'g');
                        const validValue = value.replace(regex, '');
                        if (value !== validValue) {
                            e.value = validValue;
                        }
                    }
                })}"
                value="${obj.default ?? ''}"
                ${obj.readonly ? `readonly` : ``}
            />`;
    }

    static textArea(obj: { gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void; style?: string; type?: string; readonly?: boolean; pattern?: string }) {
        obj.title = obj.title ?? '';
        const html = String.raw;
        return html`${obj.title ? html`<div class="t_39_16 fw-normal">${obj.title}</div>` : ''}
            <div class="w-100 px-1" style="margin-top:8px;">
                <textarea
                    class="form-control border rounded"
                    style="font-size: 16px; color: #393939;"
                    rows="4"
                    onchange="${obj.gvc.event((e) => {
                        obj.callback(e.value);
                    })}"
                    placeholder="${obj.placeHolder ?? ''}"
                    ${obj.readonly ? `readonly` : ``}
                >
${obj.default ?? ''}</textarea
                >
            </div>`;
    }

    static searchPlace(event: string, vale: string, placeholder: string) {
        const html = String.raw;
        return html`<div class="w-100 position-relative" style="margin-top: 16px;">
            <i class=" fa-regular fa-magnifying-glass" style=" font-size: 18px;color: #A0A0A0;position: absolute;left:20px;top:50%;transform: translateY(-50%);" aria-hidden="true"></i>
            <input class="form-control h-100 " style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;" placeholder="${placeholder}" onchange="${event}" value="${vale}" />
        </div>`;
    }

    static linkList(obj: { gvc: GVC; title: string; default: string; placeHolder: string; callback: (path: string) => void; style?: string; readonly?: boolean; pattern?: string }) {
        obj.title = obj.title ?? '';
        const html = String.raw;
        const appName = (window.parent as any).appName;
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
        };
        const linkComp = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
            text: obj.default ?? '',
        };
        const dropMenu = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
            search: '',
            prevList: [] as MenuItem[][],
            recentList: {} as MenuItem[],
            recentParent: [] as string[],
        };

        // 遞迴類別資料的物件
        const setCollectionPath = (target: MenuItem[], data: CollecrtionItem[]) => {
            (data || []).map((item, index) => {
                const { title, array } = item;
                target.push({ name: title, icon: '', link: `./?collection=${title}&page=all_product` });
                if (array && array.length > 0) {
                    target[index].items = [];
                    setCollectionPath(target[index].items as MenuItem[], array);
                }
            });
        };

        // 確認網址，回傳icon與父子層陣列
        const findMenuItemPathByLink = (items: MenuItem[], link: string): { icon: string; nameMap: string[] } | undefined => {
            for (const item of items) {
                if (item.link === link) {
                    return { icon: item.icon, nameMap: [item.name] };
                }
                if (item.items) {
                    const path = findMenuItemPathByLink(item.items, link);
                    if (path?.nameMap) {
                        return { icon: item.icon, nameMap: [item.name, ...path?.nameMap] };
                    }
                }
            }
            return undefined;
        };

        // 繪製父子層容器 html
        const formatLinkHTML = (icon: string, pathList: string[]) => {
            let pathHTML = '';
            pathList.map((path, index) => {
                pathHTML += html`<span class="mx-1">${path}</span>${index === pathList.length - 1 ? '' : html`<i class="fa-solid fa-chevron-right"></i>`}`;
            });
            return html` <div style="display: flex; flex-wrap: wrap; align-items: center; font-size: 16px; font-weight: 500; gap: 6px; line-height: 140%;cursor: default;">
                <div style="width: 28px;height: 28px;display: flex; align-items: center; justify-content:center;">
                    <i class="${icon.length > 0 ? icon : 'fa-regular fa-image'}"></i>
                </div>
                ${pathHTML}
            </div>`;
        };

        // 判斷父子層容器或純網址
        const formatLinkText = (text: string) => {
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

        // 重新刷新元件
        const componentFresh = () => {
            linkComp.loading = !linkComp.loading;
            dropMenu.loading = !dropMenu.loading;
            obj.gvc.notifyDataChange(dropMenu.id);
            obj.gvc.notifyDataChange(linkComp.id);
        };

        // callback 完整事件
        const callbackEvent = (data: any) => {
            linkComp.text = data.link;
            obj.callback(data.link);
            componentFresh();
        };

        return obj.gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading) {
                    return '';
                } else {
                    obj.gvc.addStyle(`
                        .link-item-container {
                            display: flex;
                            align-items: center;
                            font-size: 16px;
                            font-weight: 500;
                            gap: 6px;
                            line-height: 140%;
                            cursor: default;
                        }
                    `);
                    let dataList = JSON.parse(JSON.stringify(dropMenu.recentList)) as MenuItem[];
                    return html`${obj.title ? html`<div class="t_39_16 fw-normal">${obj.title}</div>` : ``}
                        <div style="position: relative">
                            ${obj.gvc.bindView({
                                bind: linkComp.id,
                                view: () => {
                                    if (linkComp.loading) {
                                        return html`<div
                                            class="form-control"
                                            style="${obj.style ?? ''} margin-top:8px;"
                                            onclick="${obj.gvc.event(() => {
                                                componentFresh();
                                            })}"
                                        >
                                            ${linkComp.text.length > 0 ? formatLinkText(linkComp.text) : `<span style="color: #b4b7c9">${obj.placeHolder}</span>`}
                                        </div>`;
                                    } else {
                                        return html`
                                            <input
                                                class="form-control"
                                                style="${obj.style ?? ''} margin-top:8px;"
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
                                onCreate: () => {},
                            })}
                            ${obj.gvc.bindView({
                                bind: dropMenu.id,
                                view: () => {
                                    if (dropMenu.loading) {
                                        return html``;
                                    } else {
                                        let h1 = '';
                                        if (dropMenu.prevList.length > 0) {
                                            h1 += html` <div
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
                                                h2 += html`
                                                    <div class="m-3" style="cursor:pointer;display: flex; align-items: center; justify-content: space-between;">
                                                        <div
                                                            class="link-item-container ${tag.link && tag.link.length > 0 ? 'hoverF2' : ''}" style="cursor: pointer;"
                                                            onclick=${obj.gvc.event(() => {
                                                                tag.link && tag.link.length > 0 && callbackEvent(tag);
                                                            })}
                                                        >
                                                            <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                                                ${(() => {
                                                                    if (tag.icon.includes('https://')) {
                                                                        return html`<div
                                                                            style="
                                                                                width: 25px; height: 25px;
                                                                                background-image: url('${tag.icon}');
                                                                                background-position: center;
                                                                                background-size: cover;
                                                                                background-repeat: no-repeat;
                                                                            "
                                                                        ></div>`;
                                                                    }
                                                                    return html`<i class="${tag.icon.length > 0 ? tag.icon : 'fa-regular fa-image'}"></i>`;
                                                                })()}
                                                            </div>
                                                            ${tag.name}
                                                        </div>
                                                        <div
                                                            class="hoverF2 pe-2" style=""
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
                                        return html`
                                            <div class="border border-2 rounded-2 p-2" style="width: 310px;">
                                                ${h1}
                                                <div style="overflow-y: auto; max-height: 42.5vh;">${h2}</div>
                                            </div>
                                        `;
                                    }
                                },
                                divCreate: { style: 'position: absolute; top: 42.5px; left: 0;' },
                            })}
                        </div>`;
                }
            },
            divCreate: {},
            onCreate: () => {
                if (vm.loading) {
                    const acticleList: MenuItem[] = [];
                    const collectionList: MenuItem[] = [];
                    const productList: MenuItem[] = [];

                    Promise.all([
                        new Promise<void>((resolve) => {
                            ApiShop.getCollection().then((data: any) => {
                                setCollectionPath(collectionList, data.length > 0 ? data.response.value : []);
                                resolve();
                            });
                        }),
                        new Promise<void>((resolve) => {
                            ApiShop.getProduct({ page: 0, limit: 50000, search: '' }).then((data: any) => {
                                if (data.result) {
                                    (data.response.data || []).map((item: { content: { id: string; title: string; preview_image: string[] } }) => {
                                        const { id, title, preview_image } = item.content;
                                        const icon = preview_image && preview_image[0] ? preview_image[0] : '';
                                        productList.push({ name: title, icon: icon, link: `./?product_id=${id}&page=product_detail` });
                                    });
                                    resolve();
                                }
                            });
                        }),
                        new Promise<void>((resolve) => {
                            ApiPost.getManagerPost({ page: 0, limit: 20, type: 'article' }).then((data) => {
                                if (data.result) {
                                    data.response.data.map((item: { content: { name: string; tag: string } }) => {
                                        const { name, tag } = item.content;
                                        if (name) {
                                            acticleList.push({ name: name, icon: '', link: `./?appName=${appName}&article=${tag}&page=article` });
                                        }
                                    });
                                }
                                resolve();
                            });
                        }),
                    ]).then(() => {
                        dropMenu.recentList = [
                            { name: '首頁', icon: 'fa-regular fa-house', link: './?page=index' },
                            { name: '商品', icon: 'fa-regular fa-tag', link: './?page=all_product', items: productList },
                            { name: '商品分類', icon: 'fa-regular fa-tags', link: '', items: collectionList },
                            { name: '網誌文章', icon: 'fa-regular fa-newspaper', link: './?page=blog_list', items: acticleList },
                            { name: '關於我們', icon: 'fa-regular fa-user-group', link: './?page=aboutus' },
                        ].filter((menu) => {
                            if (menu.items === undefined) return true;
                            return menu.items.length > 0 || menu.link.length > 0;
                        });
                        vm.loading = false;
                        obj.gvc.notifyDataChange(vm.id);
                    });
                }
            },
        });
    }

    static grayNote(text: string) {
        const html = String.raw;
        return html`<span style="color: #8D8D8D; font-size: 16px; font-weight: 400;">${text}</span>`;
    }

    static grayButton(text: string, event: string) {
        const html = String.raw;
        return html`<button class="btn-gary" type="button" onclick="${event}">${text}</button>`;
    }
}

(window as any).glitter.setModule(import.meta.url, BgWidget);
