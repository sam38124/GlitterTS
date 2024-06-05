import {PageSplit} from "./splitPage.js";
import {ApiShop} from "../glitter-base/route/shopping.js";
import {GVC} from "../glitterBundle/GVController.js";
import {BgShopping} from "./bg-shopping.js";

export class BgWidget {
    public static table(obj: {
        gvc: GVC,
        getData: (vm: { page: number, loading: boolean, callback: () => void, pageSize: number, data: any }) => void,
        rowClick?: (data: any, index: number) => void,
        filter?: string,
        style?: string[],
        table_style?: string,
        editable?:boolean
    }) {
        obj.style = obj.style || []
        const gvc = obj.gvc
        const glitter = obj.gvc.glitter
        const html = String.raw
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
                obj.getData(vm)

            };
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return html`
                            <div class=" fs-2 text-center" style="padding-bottom:32px;">${vm.stateText}</div>`;
                    } else {
                        return html`

                            <div class=" p-0 " style="">
                                <div class="" style="overflow-x:scroll;">
                                    <table
                                            class="table table-centered table-nowrap  text-center table-hover fw-500 fs-7"
                                            style="overflow-x:scroll;margin-left: 32px;margin-right: 32px;width:calc(100% - 64px);${obj.table_style ?? ''}"
                                    >
                                        <div class="" style="padding: 16px 32px;">
                                            ${obj.filter ?? ""}
                                        </div>

                                        <thead class="" style="">
                                        ${vm.data.length === 0
                                                ? ''
                                                : html`
                                                    <tr>
                                                        ${vm.data[0]
                                                                .map(
                                                                        (dd: any, index: number) =>
                                                                                html`
                                                                                    <th
                                                                                            class="${dd.position ?? 'text-start'} t_39_16 fw-bold"
                                                                                            style="border:none;padding-bottom: 30px;color:#393939 !important;${((obj.style || []) && obj.style![index]) ? obj.style![index] : ``}"
                                                                                    >
                                                                                        ${dd.key}
                                                                                    </th>`
                                                                )
                                                                .join('')}
                                                    </tr>`}
                                        </thead>

                                        <tbody>
                                        ${vm.data.length === 0
                                                ? html`
                                                    <div class=" fs-2 text-center" style="padding-bottom:32px;">
                                                        ${vm.stateText}
                                                    </div>`
                                                : html`${vm.data
                                                        .map((dd: any, index: number) => {
                                                            const pencilId = gvc.glitter.getUUID()
                                                            return html`
                                                                <tr style="${(obj.rowClick) ? `cursor:pointer;` : ``};color:#303030;position: relative;"
                                                                    onclick="${gvc.event(() => {
                                                                        obj.rowClick && obj.rowClick(dd, index)
                                                                    })}" onmouseover="${gvc.event(() => {
                                                                    $('#' + pencilId).removeClass('d-none')
                                                                })}" onmouseout="${gvc.event(() => {
                                                                    $('#' + pencilId).addClass('d-none')
                                                                })}">
                                                                    ${dd
                                                                            .map(
                                                                                    (d3: any, index: number) =>
                                                                                            html`
                                                                                                <td
                                                                                                        class="${d3.position ??
                                                                                                        'text-start'}  t_39_16"
                                                                                                        ${d3.key === '●' || d3.stopDialog
                                                                                                                ? ''
                                                                                                                : html` onclick="${gvc.event(
                                                                                                                        () => {

                                                                                                                        }
                                                                                                                )}"`}
                                                                                                        style="color:#393939 !important;border:none;
${((obj.style || []) && obj.style![index]) ? obj.style![index] : ``}
">
                                                                                                    <div class="my-auto"
                                                                                                         style="${((obj.style || []) && obj.style![index]) ? obj.style![index] : ``}">
                                                                                                        ${d3.value}
                                                                                                    </div>
                                                                                                    ${((index === dd.length - 1) &&obj.editable) ? `
                                                                                                      <i id="${pencilId}" class="fa-regular fa-pencil position-absolute d-none me-2" style="right: 5px;transform: translateY(-50%);top:50%;"></i>
                                                                                                    ` : ``}

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
                                                            (vm.data = []),
                                                                    (vm.editData = []),
                                                                    (vm.page = page);
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
                    class: `card`, style: `width:100%;overflow:hidden;border-radius: 10px;
background: #FFF;
box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);`
                },
                onCreate: () => {
                    if (vm.loading) {
                        getData(), (vm.loading = false), gvc.notifyDataChange(id);
                    }
                },
            };
        });
    }

    public static card(html: string, classStyle: string = 'p-3 bg-white rounded-3 shadow border w-100 ',) {
        return `<div class="${classStyle}" style="">
${html}
</div>`
    }

    public static cancel(event: string) {
        return `<div class="cursor_it bt_c39_w" onclick="${event}">
取消
</div>`
    }

    public static save(event: string) {
        return `<div class="cursor_it bt_c39" onclick="${event}">
儲存
</div>`
    }

    public static card_main(html: string) {
        return `<div  class="w-100" style="border-radius: 10px;
padding: 20px;
background: #FFF;
/* 陰影 */
box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);">
${html}
</div>`
    }

    public static container(html: string, width?: number, style?: string) {
        return `<div class="mx-auto" style="padding:24px;${(width) ? `max-width:100%;width:${width}px;` : ``};color:black;${style ?? ''}">
${html}
</div>`
    }

    public static title(title: string) {
        return ` <h3 class="my-auto t_39_title" >${title}</h3>`
    }

    public static goBack(event: string) {
        return `<div class="d-flex align-items-center justify-content-center  me-2  fs-5" style="cursor:pointer;" onclick="${event}">
                              <i class="fa-solid fa-angle-left" style="color:#393939;"></i>
                                </div>`
    }

    public static inlineCheckBox(obj: {
        title: string;
        gvc: any;
        def: string | string[];
        array: string[] | { title: string; value: string; innerHtml?: string }[];
        callback: (text: string) => void;
        type?: 'single' | 'multiple';
    }) {
        const html = String.raw
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
                                            ${(isSelect()) ? `<i class="fa-sharp fa-solid fa-circle-dot cl_39"></i>` : ` <div class="c_39_checkbox"></div>`}
                                            <span class="t_39_16">${dd.title}</span>
                                        </div>
                                        ${obj.def === dd.value && dd.innerHtml ? `<div class="mt-1">${dd.innerHtml}</div>` : ``} `;
                                })
                                .join('');
                    },
                    divCreate: {
                        class: `ps-1 d-flex`, style: `gap:10px;margin-top:10px;`
                    },
                };
            })}
        `;
    }

    public static editeInput(obj: {
        gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void; style?: string; type?: string; readonly?: boolean,
        pattern?: string
    }) {
        obj.title = obj.title ?? '';
        const html = String.raw;
        return html`${obj.title ? `<div class="t_39_16 fw-normal">${obj.title}</div>` : ``}
        <input
                class="form-control"
                style="${obj.style ?? ''} margin-top:8px;"
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

    public static searchPlace(event: string, vale: string, placeholder: string) {
        return `<div class="w-100 position-relative" style="margin-top: 16px;">
<i class=" fa-regular fa-magnifying-glass" style=" font-size: 18px;color: #A0A0A0;position: absolute;left:20px;top:50%;transform: translateY(-50%);"  aria-hidden="true"></i>
    <input class="form-control h-100 " style="border-radius: 10px;
border: 1px solid #DDD;
padding-left: 50px;"
           placeholder="${placeholder}" onchange="${event}" value="${vale}">
</div>`
    }
}

(window as any).glitter.setModule(import.meta.url, BgWidget)