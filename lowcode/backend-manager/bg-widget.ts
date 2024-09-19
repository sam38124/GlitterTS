import { GVC } from '../glitterBundle/GVController.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { PageSplit } from './splitPage.js';
import { Tool } from '../modules/tool.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { Article } from '../glitter-base/route/article.js';

const html = String.raw;

type MenuItem = {
    name: string;
    icon: string;
    link: string;
    items?: MenuItem[];
    ignoreFirst?: boolean;
};

type CollecrtionItem = {
    title: string;
    array?: CollecrtionItem[];
    code: string;
};

export interface OptionsItem {
    key: string;
    value: string;
    note?: string;
    image?: string;
}

export interface SelEventItem {
    name: string;
    event: string;
}

export class BgWidget {
    // 文字
    static title(title: string, style: string = '') {
        return html` <h3 class="my-auto tx_title" style="white-space: nowrap; ${style}">${title}</h3>`;
    }

    static grayNote(text: string, style: string = ''): string {
        return html`<span style="color: #8D8D8D; font-size: 14px; font-weight: 400; ${style}">${text}</span>`;
    }

    static blueNote(text: string, event: string = '', style: string = ''): string {
        return html`<span style="color: #4D86DB; font-size: 14px; font-weight: 400; cursor:pointer; overflow-wrap: break-word; ${style}" onclick="${event}">${text}</span>`;
    }

    static greenNote(text: string, event: string = '', style: string = ''): string {
        return html`<span style="color: #006621; font-size: 14px; font-weight: 400; cursor:pointer; overflow-wrap: break-word; text-decoration: underline; ${style}" onclick="${event}">${text}</span>`;
    }

    static taiwanPhoneAlert(str: string = '請輸入正確的市話或手機號碼格式') {
        return html`
            <div class="text-center">
                <div>${str}</div>
                <div>（ex. 0912666987,</div>
                <div>02-25660123,</div>
                <div>04-25881234#78）</div>
            </div>
        `;
    }

    // 按鈕
    static customButton(setValue: {
        button: {
            color: 'black' | 'gray' | 'snow';
            size: 'sm' | 'md' | 'lg';
            class?: string;
            style?: string;
        };
        text: {
            name: string;
            class?: string;
            style?: string;
        };
        event: string;
        icon?: {
            name: string;
        };
    }) {
        const button = setValue.button;
        const event = setValue.event;
        const text = setValue.text;
        const icon = setValue.icon;
        const textColor = (() => {
            switch (button.color) {
                case 'black':
                    return 'tx_700_white';
                case 'gray':
                case 'snow':
                    return 'tx_700';
            }
        })();
        const buttonSize = (() => {
            switch (button.size) {
                case 'sm':
                    return 'btn-size-sm';
                case 'md':
                    return '';
                case 'lg':
                    return 'btn-size-lg';
            }
        })();
        const textSize = (() => {
            switch (button.size) {
                case 'sm':
                    return 'font-size: 12px;';
                case 'md':
                    return '';
                case 'lg':
                    return 'font-size: 20px;';
            }
        })();
        return html` <button type="button" class="btn btn-${button.color} ${buttonSize} ${button.class ?? ''}" style="${button.style ?? ''}" onclick="${event}">
            <i class="${icon ? icon.name : 'd-none'}"></i>
            <span class="${textColor} ${text.class ?? ''}" style="${textSize} ${text.style ?? ''}">${text.name}</span>
        </button>`;
    }

    static save(event: string, text: string = '儲存', customClass?: string) {
        return html` <button class="btn btn-black ${customClass ?? ``}" type="button" onclick="${event}">
            <span class="tx_700_white">${text}</span>
        </button>`;
    }

    static cancel(event: string, text: string = '取消') {
        return html`
            <button class="btn btn-snow" type="button" onclick="${event}">
                <span class="tx_700">${text}</span>
            </button>
        `;
    }

    static danger(event: string, text: string = '刪除') {
        return html`
            <button class="btn btn-red" type="button" onclick="${event}">
                <span class="text-white tx_700">${text}</span>
            </button>
        `;
    }

    static grayButton(text: string, event: string, obj?: { icon?: string; textStyle?: string }) {
        return html` <button class="btn btn-gray" style="" type="button" onclick="${event}">
            <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}" style="color: #393939"></i>
            ${text.length > 0 ? html`<span class="tx_700" style="${obj?.textStyle ?? ''}">${text}</span>` : ''}
        </button>`;
    }

    static darkButton(text: string, event: string, obj?: { icon?: string; textStyle?: string; class?: string; style?: string }) {
        return html` <button type="button" class="btn btn-black ${obj?.class ?? ''}" style="${obj?.style ?? ''}" onclick="${event}">
            <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}"></i>
            <span class="tx_700_white" style="${obj?.textStyle ?? ''}">${text}</span>
        </button>`;
    }

    static redButton(text: string, event: string, obj?: { icon?: string; textStyle?: string }) {
        return html` <button class="btn btn-red" type="button" onclick="${event}">
            <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}"></i>
            <span class="tx_700_white" style="${obj?.textStyle ?? ''}">${text}</span>
        </button>`;
    }

    static plusButton(obj: {
        gvc: GVC;
        title: string;
        options: {
            title: string;
            icon: string;
            callback: () => void;
        }[];
    }) {
        return html`
            <div class="w-100 d-flex align-items-center justify-content-center">
                <div class="btn-group dropdown">
                    <div
                        class="w-100"
                        style="justify-content: center; align-items: center; gap: 4px; display: flex;color: #3366BB;cursor: pointer;"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">${obj.title}</div>
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <div class="dropdown-menu dropdown-menu-start my-1">
                        ${obj.options
                            .map((dd) => {
                                return html`<a
                                    class="dropdown-item"
                                    onclick="${obj.gvc.event(() => {
                                        dd.callback();
                                    })}"
                                    >${dd.icon}${dd.title}</a
                                >`;
                            })
                            .join('')}
                    </div>
                </div>
            </div>
        `;
    }

    static switchButton(gvc: GVC, def: boolean, callback: (value: boolean) => void) {
        return html` <div class="form-check form-switch m-0 cursor_pointer" style="margin-top: 10px;">
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

    static switchTextButton(
        gvc: GVC,
        def: boolean,
        text: {
            left?: string;
            right?: string;
        },
        callback: (value: boolean) => void
    ) {
        return html` <div style="display: flex; align-items: center;">
            <div class="tx_normal me-2">${text.left ?? ''}</div>
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
            <div class="tx_normal">${text.right ?? ''}</div>
        </div>`;
    }

    static goBack(event: string) {
        return html` <div class="d-flex align-items-center justify-content-center" style="cursor:pointer; margin-right: 10px;" onclick="${event}">
            <i class="fa-solid fa-angle-left" style="margin-top: 0.25rem; color: #393939; font-size: 1.75rem; font-weight: 900;"></i>
        </div>`;
    }

    // 標籤
    static primaryInsignia(text: string) {
        return html`<div class="insignia insignia-primary">${text}</div>`;
    }

    static successInsignia(text: string) {
        return html`<div class="insignia insignia-success">${text}</div>`;
    }

    static dangerInsignia(text: string) {
        return html`<div class="insignia insignia-danger">${text}</div>`;
    }

    static infoInsignia(text: string) {
        return html`<div class="insignia insignia-info">${text}</div>`;
    }

    static warningInsignia(text: string) {
        return html`<div class="insignia insignia-warning">${text}</div>`;
    }

    static notifyInsignia(text: string) {
        return html`<div class="insignia insignia-notify">${text}</div>`;
    }

    static secondaryInsignia(text: string) {
        return html`<div class="insignia insignia-secondary">${text}</div>`;
    }

    // 元素
    static leftLineBar() {
        return html` <div class="ms-2 border-end position-absolute h-100 left-0"></div>`;
    }

    static horizontalLine(css?: { color?: string; size?: number; margin?: number }) {
        return html` <div class="w-100" style="margin: ${css?.margin ?? 1}rem 0; border-bottom: ${css?.size ?? 1}px solid ${css?.color ?? '#DDD'}"></div>`;
    }

    static editeInput(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
        divStyle?: string;
        titleStyle?: string;
        style?: string;
        type?: string;
        readonly?: boolean;
        pattern?: string;
        startText?: string;
        endText?: string;
    }) {
        obj.title = obj.title ?? '';
        return html`
            <div style="${obj.divStyle ?? ''}">
                ${obj.title ? html` <div class="tx_normal fw-normal" style="${obj.titleStyle ?? ''}">${obj.title}</div>` : ``}
                <div class="d-flex w-100 align-items-center border rounded-3 ${obj.readonly ? `bgw-input-readonly` : ``}" style="margin: 8px 0;">
                    ${obj.startText ? html` <div class="py-2 ps-3" style="white-space: nowrap">${obj.startText}</div>` : ''}
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
                                // 只允許英文字符、數字和連字符
                                const value = e.value;
                                const regex = new RegExp(`[^${obj.pattern}]`, 'g');
                                const validValue = value.replace(regex, '');
                                if (value !== validValue) {
                                    e.value = validValue;
                                }
                            }
                        })}"
                        value="${obj.default ?? ''}"
                        ${obj.readonly ? `readonly` : ``}
                    />
                    ${obj.endText ? html` <div class="py-2 pe-3" style="white-space: nowrap">${obj.endText}</div>` : ''}
                </div>
            </div>
        `;
    }

    static textArea(obj: { gvc: GVC; title: string; default: string; placeHolder: string; callback: (text: string) => void; style?: string; type?: string; readonly?: boolean; pattern?: string }) {
        obj.title = obj.title ?? '';
        return html`${obj.title ? html` <div class="tx_normal fw-normal">${obj.title}</div>` : ''}
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

    static searchPlace(event: string, vale: string, placeholder: string, margin: string = '16px 0 0 0') {
        return html` <div class="w-100 position-relative" style="margin: ${margin};">
            <i class=" fa-regular fa-magnifying-glass" style="font-size: 18px;color: #A0A0A0;position: absolute;left:20px;top:50%;transform: translateY(-50%);" aria-hidden="true"></i>
            <input class="form-control h-100 " style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;" placeholder="${placeholder}" onchange="${event}" value="${vale}" />
        </div>`;
    }

    static linkList(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (path: string) => void;
        style?: string;
        readonly?: boolean;
        pattern?: string;
        filter?: {
            page?: string[];
        };
    }) {
        obj.title = obj.title ?? '';
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
            elementClass: Tool.randomString(5),
            elementWidth: 240,
            loading: true,
            search: '',
            prevList: [] as MenuItem[][],
            recentList: {} as MenuItem[],
            recentParent: [] as string[],
        };

        // 遞迴類別資料的物件
        const setCollectionPath = (target: MenuItem[], data: CollecrtionItem[]) => {
            (data || []).map((item, index) => {
                const { title, array, code } = item;
                target.push({ name: title, icon: '', link: `/collections/${code}` });
                if (array && array.length > 0) {
                    target[index].items = [];
                    setCollectionPath(target[index].items as MenuItem[], array);
                }
            });
        };

        // 確認網址，回傳icon與父子層陣列
        const findMenuItemPathByLink = (
            items: MenuItem[],
            link: string
        ):
            | {
                  icon: string;
                  nameMap: string[];
              }
            | undefined => {
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
                pathHTML += html`<span class="mx-1" style="font-size: 14px;">${path}</span>${index === pathList.length - 1 ? '' : html` <i class="fa-solid fa-chevron-right"></i>`}`;
            });
            return html` <div style="display: flex; flex-wrap: wrap; align-items: center; font-size: 14px; font-weight: 500; gap: 6px; line-height: 140%;cursor: default;">
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
            const notify = () => {
                obj.gvc.notifyDataChange(dropMenu.id);
                obj.gvc.notifyDataChange(linkComp.id);
            };
            linkComp.loading = !linkComp.loading;
            dropMenu.loading = !dropMenu.loading;
            if (dropMenu.loading) {
                notify();
            } else {
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

        // callback 完整事件
        const callbackEvent = (data: any) => {
            linkComp.text = data.link;
            obj.callback(data.link);
            componentFresh();
        };

        // 新增 elementClass style
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
                    return BgWidget.spinner({ text: { visible: false } });
                } else {
                    let dataList = JSON.parse(JSON.stringify(dropMenu.recentList)) as MenuItem[];
                    return html`${obj.title ? html` <div class="tx_normal fw-normal">${obj.title}</div>` : ``}
                        <div style="position: relative">
                            ${obj.gvc.bindView({
                                bind: linkComp.id,
                                view: () => {
                                    if (linkComp.loading) {
                                        return html` <div
                                            class="bgw-input border rounded-3"
                                            style="${linkComp.text.length > 0 ? '' : 'padding: 9.5px 12px;'} ${obj.style ?? ''}"
                                            id="${dropMenu.elementClass}"
                                            onclick="${obj.gvc.event(() => {
                                                componentFresh();
                                            })}"
                                        >
                                            ${linkComp.text.length > 0 ? formatLinkText(linkComp.text) : html`<span style="color: #777777;">${obj.placeHolder}</span>`}
                                        </div>`;
                                    } else {
                                        return html`
                                            <div class="d-flex align-items-center" style="margin-top: 8px;">
                                                <input
                                                    class="form-control"
                                                    style="${obj.style ?? ''}"
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
                                onCreate: () => {},
                            })}
                            ${obj.gvc.bindView({
                                bind: dropMenu.id,
                                view: () => {
                                    if (dropMenu.loading) {
                                        return '';
                                    } else {
                                        let h1 = '';
                                        if (dropMenu.prevList.length > 0) {
                                            h1 += html` <div
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
                                                h2 += html`
                                                    <div class="m-2" style="cursor:pointer;display: flex; align-items: center; justify-content: space-between;">
                                                        <div
                                                            class="w-100 p-1 link-item-container hoverF2 cursor_pointer text-wrap"
                                                            onclick=${obj.gvc.event(() => {
                                                                if (tag.link && tag.link.length > 0 && !tag.ignoreFirst) {
                                                                    callbackEvent(tag);
                                                                } else {
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
                                                                        return html` <div
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
                                        return html`
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
                    const acticleList: MenuItem[] = [];
                    const collectionList: MenuItem[] = [];
                    const productList: MenuItem[] = [];
                    const blockPageList: MenuItem[] = [];
                    const hiddenPageList: MenuItem[] = [];
                    const oneStoreList: MenuItem[] = [];

                    Promise.all([
                        new Promise<void>((resolve) => {
                            ApiShop.getCollection().then((data: any) => {
                                setCollectionPath(collectionList, data.response && data.response.value.length > 0 ? data.response.value : []);
                                resolve();
                            });
                        }),
                        new Promise<void>((resolve) => {
                            ApiShop.getProduct({ page: 0, limit: 50000, search: '' }).then((data: any) => {
                                if (data.result) {
                                    (data.response.data || []).map((item: { content: { id: string; title: string; preview_image: string[] } }) => {
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
                        new Promise<void>((resolve) => {
                            Article.get({
                                page: 0,
                                limit: 99999,
                                status: '1',
                                for_index: 'true',
                            }).then((data) => {
                                if (data.result) {
                                    data.response.data.map((item: { content: { name: string; tag: string } }) => {
                                        const { name, tag } = item.content;
                                        if (name) {
                                            acticleList.push({ name: name, icon: '', link: `/blogs/${tag}` });
                                        }
                                    });
                                }
                                resolve();
                            });
                        }),
                        new Promise<void>((resolve) => {
                            Article.get({
                                page: 0,
                                limit: 99999,
                                status: '1',
                                for_index: 'false',
                            }).then((data) => {
                                if (data.result) {
                                    data.response.data.map(
                                        (item: {
                                            content: {
                                                name: string;
                                                tag: string;
                                                page_type: 'page' | 'hidden' | 'shopping';
                                            };
                                        }) => {
                                            const { name, tag, page_type } = item.content;
                                            if (name) {
                                                switch (page_type) {
                                                    case 'page':
                                                        blockPageList.push({ name: name, icon: '', link: `/pages/${tag}` });
                                                        break;
                                                    case 'hidden':
                                                        hiddenPageList.push({ name: name, icon: '', link: `/hidden/${tag}` });
                                                        break;
                                                    case 'shopping':
                                                        oneStoreList.push({ name: name, icon: '', link: `/shop/${tag}` });
                                                        break;
                                                }
                                            }
                                        }
                                    );
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
                                link: '/hidden',
                                items: hiddenPageList,
                                ignoreFirst: true,
                            },
                            {
                                name: '一頁商店',
                                icon: 'fa-regular fa-page',
                                link: '/shop',
                                items: oneStoreList,
                                ignoreFirst: true,
                            },
                        ].filter((menu) => {
                            if (obj.filter && obj.filter.page && obj.filter.page.length > 0 && !obj.filter.page.includes(menu.name)) {
                                return false; // 篩選不需顯示的連結頁面
                            }
                            if (menu.items === undefined) {
                                return true; // 首頁
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

    static select(obj: { gvc: GVC; callback: (value: any) => void; default: string; options: OptionsItem[]; style?: string; readonly?: boolean }) {
        return html`<select
            class="c_select c_select_w_100"
            style="${obj.style ?? ''}; ${obj.readonly ? 'background: #f7f7f7;' : ''}"
            onchange="${obj.gvc.event((e) => {
                obj.callback(e.value);
            })}"
            ${obj.readonly ? 'disabled' : ''}
        >
            ${obj.gvc.map(obj.options.map((opt) => html` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>${opt.value}</option>`))}
        </select>`;
    }

    // 頁面
    static dotlottieJS = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';

    static maintenance() {
        return html` <div class="d-flex flex-column align-items-center justify-content-center vh-100 vw-100">
            <iframe src="https://embed.lottiefiles.com/animation/99312" style="width:35vw;height:30vw;min-width:300px;min-height:300px;"></iframe>
            <h3 style="margin-top: 30px;">此頁面功能維護中</h3>
        </div>`;
    }

    static noPermission() {
        return html` <script src="${this.dotlottieJS}" type="module"></script>
            <div class="d-flex flex-column align-items-center justify-content-center vh-100 vw-100">
                <dotlottie-player
                    src="https://lottie.host/63d50162-9e49-47af-bb57-192f739db662/PhqkOljE9S.json"
                    background="transparent"
                    speed="1"
                    style="width:300px;height:300px;"
                    loop
                    autoplay
                ></dotlottie-player>
                <h3>您無權限瀏覽此頁面</h3>
            </div>`;
    }

    static spinner(obj?: {
        container?: {
            class?: string;
            style?: string;
        };
        circle?: {
            visible?: boolean;
            width?: number;
            borderSize?: number;
        };
        text?: {
            value?: string;
            visible?: boolean;
            fontSize?: number;
        };
    }) {
        const container = {
            class: `${obj?.container?.class ?? ''}`,
            style: `margin-top: 2rem ;${obj?.container?.style}`,
        };
        const circleAttr = {
            visible: obj?.circle?.visible === false ? false : true,
            width: obj?.circle?.width ?? 20,
            borderSize: obj?.circle?.borderSize ?? 16,
        };
        const textAttr = {
            value: obj?.text?.value ?? '載入中...',
            visible: obj?.text?.visible === false ? false : true,
            fontSize: obj?.text?.fontSize ?? 16,
        };
        return html` <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto ${container.class}" style="${container.style}">
            <div
                class="spinner-border ${circleAttr.visible ? '' : 'd-none'}"
                style="font-size: ${circleAttr.borderSize}px; width: ${circleAttr.width}px; height: ${circleAttr.width}px;"
                role="status"
            ></div>
            <span class="mt-3 ${textAttr.visible ? '' : 'd-none'}" style="font-size: ${textAttr.fontSize}px;">${textAttr.value}</span>
        </div>`;
    }

    // 表格
    static table(obj: {
        gvc: GVC;
        getData: (vm: { page: number; loading: boolean; callback: () => void; pageSize: number; data: any }) => void;
        rowClick?: (data: any, index: number) => void;
        filter?: string;
        style?: string[];
        table_style?: string;
    }) {
        obj.style = obj.style || [];
        const gvc = obj.gvc;
        const glitter = obj.gvc.glitter;
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
            const getData = () => obj.getData(vm);
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return html` <div class="fs-2 text-center" style="padding:32px;">${vm.stateText}</div>`;
                    } else {
                        return html` <div class="p-0">
                            <div style="overflow-x:scroll;">
                                <table
                                    class="table table-centered table-nowrap  text-center table-hover fw-500 fs-7"
                                    style="overflow-x:scroll;margin-left: 32px;margin-right: 32px;width:calc(100% - 64px);${obj.table_style ?? ''}"
                                >
                                    <div style="padding: 16px 32px;">${obj.filter ?? ''}</div>

                                    <thead>
                                        ${vm.data.length === 0
                                            ? ''
                                            : html`<tr>
                                                  ${vm.data[0]
                                                      .map(
                                                          (dd: any, index: number) =>
                                                              html` <th
                                                                  class="${dd.position ?? 'text-start'} tx_normal fw-bold"
                                                                  style="white-space:nowrap;border:none;padding-bottom: 30px;color:#393939 !important;${obj.style && obj.style![index]
                                                                      ? obj.style![index]
                                                                      : ``}"
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
                                                                          class="${d3.position ?? 'text-start'}  tx_normal"
                                                                          ${d3.key === '●' || d3.stopDialog ? '' : html` onclick="${gvc.event(() => {})}"`}
                                                                          style="color:#393939 !important;border:none; ${obj.style && obj.style![index] ? obj.style![index] : ``}"
                                                                      >
                                                                          <div class="my-auto" style="${obj.style && obj.style![index] ? obj.style![index] : ``}">${d3.value}</div>
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
                        getData();
                        vm.loading = false;
                        gvc.notifyDataChange(id);
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
        tableHeader?: string[];
        hiddenPageSplit?: boolean;
    }) {
        obj.style = obj.style || [];
        const gvc = obj.gvc;
        const glitter = obj.gvc.glitter;
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
            const getData = () => obj.getData(vm);
            return {
                bind: id,
                view: () => {
                    if (vm.loading) {
                        return html` <div class="fs-2 text-center" style="padding: 32px;">${vm.stateText}</div>`;
                    } else {
                        return html` <div class="m-0 p-0" style="${obj.table_style ?? ''}">
                            ${obj.filter ? html` <div class="m-0">${obj.filter}</div>` : ''}
                            <div style="margin-top: 4px; overflow-x: scroll; z-index: 1;">
                                <table class="table table-centered table-nowrap text-center table-hover fw-400 fs-7" style="overflow-x:scroll; ">
                                    <thead>
                                        ${vm.data.length === 0
                                            ? ''
                                            : html` <tr>
                                                  ${vm.data[0]
                                                      .map(
                                                          (dd: any, index: number) =>
                                                              html` <th
                                                                  class="${dd.position ?? 'text-start'} tx_700 px-1"
                                                                  style="white-space:nowrap;border:none; color:#393939 !important; ${obj.style && obj.style![index] ? obj.style![index] : ``}"
                                                              >
                                                                  ${dd.key}
                                                              </th>`
                                                      )
                                                      .join('')}
                                              </tr>`}
                                    </thead>
                                    <tbody>
                                        ${vm.data.length === 0
                                            ? html` <div class="fs-2 text-center" style="padding-bottom:32px;white-space:nowrap;">${vm.stateText}</div>`
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
                                                                          class="${d3.position ?? 'text-start'} tx_normal px-1"
                                                                          ${d3.key === '●' || d3.stopDialog ? '' : html` onclick="${gvc.event(() => {})}"`}
                                                                          style="color:#393939 !important;border:none;vertical-align: middle;${obj.style && obj.style![index] ? obj.style![index] : ``}"
                                                                      >
                                                                          <div class="my-1 text-nowrap" style="${obj.style && obj.style![index] ? obj.style![index] : ``}">${d3.value}</div>
                                                                      </td>`
                                                              )
                                                              .join('')}
                                                      </tr>`;
                                                  })
                                                  .join('')}`}
                                    </tbody>
                                </table>
                                <div>
                                    ${vm.data.length === 0 || obj.hiddenPageSplit
                                        ? ''
                                        : ps.pageSplitV2(
                                              vm.pageSize,
                                              vm.page,
                                              (page) => {
                                                  vm.data = [];
                                                  vm.editData = [];
                                                  vm.page = page;
                                                  vm.loading = true;
                                                  gvc.notifyDataChange(id);
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
                        getData();
                        vm.loading = false;
                        gvc.notifyDataChange(id);
                    }
                },
            };
        });
    }

    // 容器
    static getContainerWidth = (obj?: { rate?: { web?: number; pad?: number; phone?: number } }) => {
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

    static container(htmlString: string, width?: number, style?: string) {
        return html` <div
            class="${document.body.clientWidth < 768 ? 'row col-12 w-100' : ''}"
            style="padding: 24px ${document.body.clientWidth < 768 ? '0.75rem' : '0'}; margin: 0 auto; ${width ? `max-width:100%; width:${width}px;` : ``} ${style ?? ''}"
        >
            ${htmlString}
        </div>`;
    }

    static duringInputContainer(
        gvc: GVC,
        obj: {
            centerText: string;
            list: { key: string; type: string; placeHolder: string }[];
        },
        def: string[],
        callback: (value: string[]) => void
    ) {
        const defualt = (def && def.length) > 1 ? def : ['', ''];
        if (obj.list.length > 1) {
            const first = obj.list[0];
            const second = obj.list[1];

            return html`
                <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
                    <input
                        class="form-control"
                        type="${first.type ?? 'text'}"
                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                        placeholder="${first.placeHolder ?? ''}"
                        onchange="${gvc.event((e, ele) => {
                            defualt[0] = e.value;
                            callback(defualt);
                        })}"
                        value="${defualt[0]}"
                    />
                    <span>${obj.centerText}</span>
                    <input
                        class="form-control"
                        type="${second.type ?? 'text'}"
                        style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                        placeholder="${second.placeHolder ?? ''}"
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

    static radioInputContainer(
        gvc: GVC,
        data: { key: string; name: string; type: string; placeHolder: string; unit?: string }[],
        def: { key: string; value: string },
        callback: (value: { key: string; value: string }) => void
    ) {
        const id = gvc.glitter.getUUID();
        const randomString = this.getDarkDotClass(gvc);

        return gvc.bindView({
            bind: id,
            view: () => {
                let radioInputHTML = '';
                data.map((item) => {
                    radioInputHTML += html`
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
                                    type="${item.type ?? 'text'}"
                                    style="border-radius: 10px; border: 1px solid #DDD; padding-left: 18px;"
                                    placeholder="${item.placeHolder ?? ''}"
                                    onchange="${gvc.event((e) => {
                                        def.value = e.value;
                                        callback(def);
                                    })}"
                                    value="${def.key === item.key ? def.value : ''}"
                                    ${def.key === item.key ? '' : 'disabled'}
                                />
                                ${item.unit ? html` <div class="py-2 pe-3">${item.unit}</div>` : ''}
                            </div>
                        </div>
                    `;
                });

                return html` <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">${radioInputHTML}</div> `;
            },
        });
    }

    static multiCheckboxContainer(
        gvc: GVC,
        data: {
            key: string;
            name: string;
            innerHtml?: string;
            hiddenLeftLine?: boolean;
            customerClass?: string;
        }[],
        def: string[],
        callback: (value: string[]) => void,
        obj?: {
            readonly?: boolean;
            single?: boolean;
            zeroOption?: boolean;
        }
    ) {
        const id = gvc.glitter.getUUID();
        const inputColor = obj && obj.readonly ? '#808080' : undefined;
        const randomString = obj && obj.single ? this.getWhiteDotClass(gvc, inputColor) : this.getCheckedClass(gvc, inputColor);
        const viewId = Tool.randomString(5);

        return gvc.bindView({
            bind: viewId,
            view: () => {
                let checkboxHTML = '';
                data.map((item) => {
                    checkboxHTML += html`
                        <div>
                            <div
                                class="form-check ${item?.customerClass ?? ''}"
                                onclick="${gvc.event((e, evt) => {
                                    if (obj && obj.readonly) {
                                        evt.preventDefault();
                                        return;
                                    }
                                    if (obj && obj.single) {
                                        def = def[0] === item.key && obj.zeroOption ? [] : [item.key];
                                    } else {
                                        if (!def.find((d) => d === item.key)) {
                                            def.push(item.key);
                                        } else {
                                            def = def.filter((d) => d !== item.key);
                                        }
                                        def = def.filter((d) => data.map((item2) => item2.key).includes(d));
                                    }
                                    callback(def);
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
                                ? html` <div class="d-flex position-relative my-2">
                                      ${item.hiddenLeftLine ? '' : this.leftLineBar()}
                                      <div class="ms-4 w-100 flex-fill">${item.innerHtml}</div>
                                  </div>`
                                : ``}
                        </div>
                    `;
                });

                return html` <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">${checkboxHTML}</div> `;
            },
        });
    }

    static inlineCheckBox(obj: {
        title: string;
        gvc: any;
        def: string | string[];
        array: string[] | { title: string; value: string; innerHtml?: string }[];
        callback: (text: string) => void;
        type?: 'single' | 'multiple';
    }) {
        obj.type = obj.type ?? 'single';
        const gvc = obj.gvc;
        const inputColor = undefined;
        const randomString = obj.type === 'single' ? this.getWhiteDotClass(gvc, inputColor) : this.getCheckedClass(gvc, inputColor);
        return html`
            ${obj.title ? html`<div class="tx_normal fw-normal">${obj.title}</div>` : ``}
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
                                        class="d-flex align-items-center cursor_pointer mb-2"
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
                                        <input
                                            class="form-check-input ${randomString} cursor_pointer"
                                            style="margin-top: -2px;"
                                            type="${obj.type === 'single' ? 'radio' : 'checkbox'}"
                                            id="${id}_${dd.value}"
                                            ${isSelect() ? 'checked' : ''}
                                        />
                                        <label class="form-check-label cursor_pointer" for="${id}_${dd.value}" style="font-size: 16px; color: #393939;">${dd.title}</label>
                                    </div>
                                    ${obj.def === dd.value && dd.innerHtml ? html`<div class="mt-1">${dd.innerHtml}</div>` : ``}
                                `;
                            })
                            .join('');
                    },
                    divCreate: {
                        class: `ps-1 d-flex flex-wrap`,
                        style: `gap: 10px; margin-top: 10px;`,
                    },
                };
            })}
        `;
    }

    static mbContainer(margin_bottom_px: number) {
        return html` <div style="margin-bottom: ${margin_bottom_px}px"></div>`;
    }

    static card(htmlString: string, classStyle: string = 'p-3 bg-white rounded-3 shadow border w-100') {
        return html` <div class="${classStyle}">${htmlString}</div>`;
    }

    static mainCard(htmlString: string, classString?: string, styleString?: string) {
        return html` <div class="main-card ${classString ?? ''}" style="${styleString ?? ''}">${htmlString ?? ''}</div>`;
    }

    static tab(
        data: {
            title: string;
            key: string;
        }[],
        gvc: GVC,
        select: string,
        callback: (key: string) => void,
        style?: string
    ) {
        return html` <div
            style="justify-content: flex-start; align-items: flex-start; gap: 22px; display: inline-flex;cursor: pointer;margin-top: 24px;margin-bottom: 24px;font-size: 18px; ${style ?? ''};"
        >
            ${data
                .map((dd) => {
                    if (select === dd.key) {
                        return html` <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                            <div
                                style="align-self: stretch; text-align: center; color: #393939; font-size: 18px; font-family: Noto Sans; font-weight: 700; line-height: 18px; word-wrap: break-word;white-space: nowrap;"
                                onclick="${gvc.event(() => {
                                    callback(dd.key);
                                })}"
                            >
                                ${dd.title}
                            </div>
                            <div style="align-self: stretch; height: 0px; border: 2px #393939 solid"></div>
                        </div>`;
                    } else {
                        return html` <div
                            style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex"
                            onclick="${gvc.event(() => {
                                callback(dd.key);
                            })}"
                        >
                            <div
                                style="align-self: stretch; text-align: center; color: #393939;  font-family: Noto Sans; font-weight: 400; line-height: 18px; word-wrap: break-word;white-space: nowrap;"
                            >
                                ${dd.title}
                            </div>
                            <div style="align-self: stretch; height: 0px"></div>
                        </div>`;
                    }
                })
                .join('')}
        </div>`;
    }

    static alertInfo(
        title: string,
        messageList?: string[],
        css: { class: string; style: string } = {
            class: '',
            style: '',
        }
    ) {
        let h = '';
        if (messageList && messageList.length > 0) {
            messageList.map((str) => {
                h += html`<p class="mb-1">${str}</p>`;
            });
        }
        return html` <div class="w-100 alert  alert-secondary p-3 mb-0 ${css.class}" style="${css.style}">
            <div class="fs-5 mb-0"><strong>${title}</strong></div>
            ${messageList && messageList.length > 0 ? `<div class="mt-2">${h}</div>` : ``}
        </div>`;
    }

    static selNavbar(data: { count: number; buttonList: string[] }): string {
        return html`
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

    static selEventButton(text: string, event: string) {
        return html`
            <button class="btn sel_normal" type="button" onclick="${event}">
                <span style="font-size: 14px; color: #393939; font-weight: 400;">${text}</span>
            </button>
        `;
    }

    static selEventDropmenu(obj: { gvc: GVC; options: SelEventItem[]; text: string }) {
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            show: false,
        };

        return html` <div>
            <div
                class="sel_normal"
                onclick="${obj.gvc.event(() => {
                    vm.show = !vm.show;
                    obj.gvc.notifyDataChange(vm.id);
                })}"
            >
                <span style="font-size: 14px; color: #393939; font-weight: 400;">${obj.text}</span><i class="fa-regular fa-angle-down ms-1"></i>
            </div>
            ${obj.gvc.bindView({
                bind: vm.id,
                view: () => {
                    if (vm.show) {
                        return html` <div class="c_absolute" style="top: 0; right: 0;">
                            <div class="form-check d-flex flex-column ps-0" style="gap: 16px">
                                ${obj.gvc.map(
                                    obj.options.map((opt) => {
                                        return html` <div class="cursor_pointer" onclick="${opt.event}">${opt.name}</div>`;
                                    })
                                )}
                            </div>
                        </div>`;
                    }
                    return '';
                },
                divCreate: {
                    style: 'position: relative;',
                },
            })}
        </div>`;
    }

    static summaryHTML(stringArray: string[][]) {
        return stringArray
            .map((list) => {
                return list
                    .map((item) => {
                        return html`<div class="tx_normal" style="overflow-wrap: break-word;">${item}</div>`;
                    })
                    .join(this.mbContainer(8));
            })
            .join(this.horizontalLine());
    }

    static openBoxContainer(obj: { gvc: GVC; tag: string; title: string; insideHTML: string; openHeight?: number; autoClose?: boolean; guideClass?: string }): string {
        const text = Tool.randomString(5);

        obj.gvc.addStyle(`
            .box-container-${text} {
                position: relative;
                height: 56px;
                border: 1px solid #ddd;
                border-radius: 10px;
                overflow-y: hidden;
                transition: height 0.3s ease-out;
            }
            .box-container-${text}.open-box {
                max-height: ${obj.openHeight ?? 500}px;
                height: ${obj.openHeight && obj.openHeight < 500 ? obj.openHeight : 500}px;
                overflow-y: auto;
            }
            .box-navbar-${text} {
                position: sticky;
                top: 0;
                min-height: 20px;
                background-color: #fff;
                z-index: 10;
                display: flex;
                padding: 15px 20px;
                align-items: flex-start;
                justify-content: space-between;
                cursor: pointer;
            }
            .arrow-icon-${text} {
                color: #393939 !important;
                box-shadow: none !important;
                background-color: #fff !important;
                background-image: url(${BgWidget.arrowDownDataImage('#000')}) !important;
                background-repeat: no-repeat;
                cursor: pointer;
                height: 1rem;
                border: 0;
                margin-top: 0.35rem;
                transition: transform 0.3s;
            }
            .arrow-icon-${text}.open-box {
                margin-top: 0.15rem;
                transform: rotate(180deg);
            }
            .box-inside-${text} {
                padding: 0 1.5rem 1.5rem;
                overflow-y: auto;
            }

            @media (max-width: 768px) {
                .box-inside-${text} {
                    padding: 0.5rem 1.25rem 1.25rem;
                }
            }
        `);

        return html`<div class="box-tag-${obj.tag} box-container-${text}">
            <div
                class="box-navbar-${text} ${obj.guideClass ?? ''}"
                onclick="${obj.gvc.event((e) => {
                    if (!obj.autoClose) {
                        const boxes = document.querySelectorAll(`.box-tag-${obj.tag}`);
                        boxes.forEach((box) => {
                            const isOpening = box.classList.contains('open-box');
                            const isSelf = box.classList.contains(`box-container-${text}`) || box.classList.contains(`arrow-icon-${text}`);
                            if (isOpening && !isSelf) {
                                box.classList.remove('open-box');
                            }
                        });
                    }
                    setTimeout(() => {
                        e.parentElement.classList.toggle('open-box');
                        e.parentElement.querySelector(`.arrow-icon-${text}`).classList.toggle('open-box');
                    }, 50);
                })}"
            >
                <div class="d-flex tx_700">${obj.title}</div>
                <div class="d-flex">
                    <button class="box-tag-${obj.tag} arrow-icon-${text}"></button>
                </div>
            </div>
            <div class="box-inside-${text} ${obj.guideClass ? `box-inside-${obj.guideClass}` : ''}">${obj.insideHTML}</div>
        </div>`;
    }

    // 視窗
    static selectFilter(obj: { gvc: GVC; callback: (value: any) => void; default: string; options: OptionsItem[]; style?: string }) {
        return html`<select
            class="c_select"
            style="${obj.style ?? ''}"
            onchange="${obj.gvc.event((e) => {
                obj.callback(e.value);
            })}"
        >
            ${obj.gvc.map(obj.options.map((opt) => html` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>${opt.value}</option>`))}
        </select>`;
    }

    static searchFilter(event: string, vale: string, placeholder: string, margin?: string) {
        return html` <div class="w-100 position-relative" style="height: 40px; margin: ${margin ?? 0};">
            <i class="fa-regular fa-magnifying-glass" style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);" aria-hidden="true"></i>
            <input class="form-control h-100" style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px; height: 100%;" placeholder="${placeholder}" onchange="${event}" value="${vale}" />
        </div>`;
    }

    static funnelFilter(obj: { gvc: GVC; callback: (value: any) => void }) {
        return html` <div
            class="c_funnel"
            onclick="${obj.gvc.event((e) => {
                obj.callback('c_funnel');
            })}"
        >
            <i class="fa-regular fa-filter"></i>
        </div>`;
    }

    static updownFilter(obj: { gvc: GVC; callback: (value: any) => void; default: string; options: OptionsItem[] }) {
        const vm = {
            id: obj.gvc.glitter.getUUID(),
            checkClass: this.getDarkDotClass(obj.gvc),
            show: false,
        };

        return html` <div
                class="c_updown"
                onclick="${obj.gvc.event(() => {
                    vm.show = !vm.show;
                    obj.gvc.notifyDataChange(vm.id);
                })}"
            >
                <i class="fa-regular fa-arrow-up-arrow-down"></i>
            </div>
            ${obj.gvc.bindView({
                bind: vm.id,
                view: () => {
                    if (vm.show) {
                        return html` <div class="c_absolute" style="top: 20px; right: 20px;">
                            <div class="form-check d-flex flex-column" style="gap: 16px">
                                ${obj.gvc.map(
                                    obj.options.map((opt) => {
                                        return html` <div>
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
                                    })
                                )}
                            </div>
                        </div>`;
                    }
                    return '';
                },
                divCreate: {
                    style: 'position: relative;',
                },
            })}`;
    }

    static selectDropList(obj: { gvc: GVC; callback: (value: any) => void; default: string[]; options: OptionsItem[]; style?: string; placeholder?: string }) {
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
                const defLine = obj.options.filter((item) => {
                    return obj.default.includes(item.key);
                });
                return html` <div class="c_select" style="position: relative; ${obj.style ?? ''}">
                    <div
                        class="w-100 h-100 d-flex align-items-center"
                        onclick="${obj.gvc.event(() => {
                            vm.show = !vm.show;
                            if (!vm.show) {
                                obj.callback(
                                    obj.default.filter((item) => {
                                        return obj.options.find((opt) => opt.key === item);
                                    })
                                );
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
                                : BgWidget.grayNote(obj.placeholder ?? '（點擊選擇項目）', 'font-size: 16px;')}
                        </div>
                    </div>
                    ${vm.show
                        ? html` <div class="c_dropdown">
                              <div class="c_dropdown_body">
                                  <div class="c_dropdown_main">
                                      ${obj.gvc.map(
                                          obj.options.map((opt) => {
                                              function call() {
                                                  if (obj.default.includes(opt.key)) {
                                                      obj.default = obj.default.filter((item) => item !== opt.key);
                                                  } else {
                                                      obj.default.push(opt.key);
                                                  }
                                                  obj.gvc.notifyDataChange(vm.id);
                                              }

                                              return html` <div class="d-flex align-items-center" style="gap: 24px">
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
                                                      ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                  </div>
                                              </div>`;
                                          })
                                      )}
                                  </div>
                                  <div class="c_dropdown_bar">
                                      ${BgWidget.cancel(
                                          obj.gvc.event(() => {
                                              obj.callback(vm.def);
                                              vm.show = !vm.show;
                                              obj.gvc.notifyDataChange(vm.id);
                                          })
                                      )}
                                      ${BgWidget.save(
                                          obj.gvc.event(() => {
                                              obj.callback(
                                                  obj.default.filter((item) => {
                                                      return obj.options.find((opt) => opt.key === item);
                                                  })
                                              );
                                              vm.show = !vm.show;
                                              obj.gvc.notifyDataChange(vm.id);
                                          }),
                                          '確認'
                                      )}
                                  </div>
                              </div>
                          </div>`
                        : ''}
                </div>`;
            },
        });
    }

    static selectDropDialog(obj: {
        gvc: GVC;
        title: string;
        tag: string;
        single?: boolean;
        default: string[];
        updownOptions?: OptionsItem[];
        api: (obj: { query: string; orderString: string }) => Promise<OptionsItem[]>;
        callback: (value: any) => void;
        style?: string;
        readonly?: boolean;
        custom_line_items?: (data: any) => string;
    }) {
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                checkClass: this.getCheckedClass(obj.gvc),
                def: JSON.parse(JSON.stringify(obj.default)),
                options: [] as OptionsItem[],
                query: '',
                orderString: '',
                selectKey: {
                    name: '',
                    index: 0,
                },
            };

            return html` <div class="bg-white shadow rounded-3" style="overflow-y: auto; ${document.body.clientWidth > 768 ? 'min-width: 400px; width: 600px;' : 'min-width: 92.5vw;'}">
                ${obj.gvc.bindView({
                    bind: vm.id,
                    view: () => {
                        if (vm.loading) {
                            return html`<div class="my-4">${this.spinner()}</div>`;
                        }
                        return html` <div style="width: 100%; overflow-y: auto;" class="bg-white shadow rounded-3">
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
                                            : html` <div class="d-flex" style="gap: 12px;">
                                                  ${this.searchFilter(
                                                      gvc.event((e, event) => {
                                                          vm.query = e.value;
                                                          vm.loading = true;
                                                          obj.gvc.notifyDataChange(vm.id);
                                                      }),
                                                      vm.query || '',
                                                      '搜尋'
                                                  )}
                                                  ${obj.updownOptions
                                                      ? this.updownFilter({
                                                            gvc,
                                                            callback: (value: any) => {
                                                                vm.orderString = value;
                                                                vm.loading = true;
                                                                obj.gvc.notifyDataChange(vm.id);
                                                            },
                                                            default: vm.orderString || 'default',
                                                            options: obj.updownOptions || [],
                                                        })
                                                      : ''}
                                              </div>`}
                                        ${obj.gvc.map(
                                            vm.options.map((opt: OptionsItem, index: number) => {
                                                if (obj.custom_line_items) {
                                                    return obj.custom_line_items(opt);
                                                }
                                                function call() {
                                                    vm.selectKey = {
                                                        name: opt.key,
                                                        index: index,
                                                    };
                                                    if (obj.default.includes(opt.key)) {
                                                        obj.default = obj.default.filter((item) => item !== opt.key);
                                                    } else {
                                                        obj.default.push(opt.key);
                                                    }
                                                    obj.gvc.notifyDataChange(vm.id);
                                                }

                                                return html` <div
                                                    class="d-flex align-items-center"
                                                    style="gap: 24px"
                                                    onclick="${gvc.event(() => {
                                                        if (obj.single) {
                                                            obj.callback(opt.key);
                                                            gvc.closeDialog();
                                                        }
                                                    })}"
                                                >
                                                    ${obj.readonly || obj.single
                                                        ? ''
                                                        : html`<input
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
                                                        ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                    </div>
                                                </div>`;
                                            })
                                        )}
                                    </div>
                                    ${obj.readonly || obj.single
                                        ? ''
                                        : html` <div class="c_dialog_bar">
                                              ${BgWidget.cancel(
                                                  obj.gvc.event(() => {
                                                      obj.callback([]);
                                                      gvc.closeDialog();
                                                  }),
                                                  '清除全部'
                                              )}
                                              ${BgWidget.cancel(
                                                  obj.gvc.event(() => {
                                                      obj.callback(vm.def);
                                                      gvc.closeDialog();
                                                  })
                                              )}
                                              ${BgWidget.save(
                                                  obj.gvc.event(() => {
                                                      obj.callback(
                                                          obj.default.filter((item) => {
                                                              return vm.options.find((opt: OptionsItem) => opt.key === item);
                                                          })
                                                      );
                                                      gvc.closeDialog();
                                                  }),
                                                  '確認'
                                              )}
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
                        } else {
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
                                } else {
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

    static infoDialog(obj: { gvc: GVC; title: string; innerHTML: string; closeCallback?: () => void }) {
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: true,
                checkClass: BgWidget.getCheckedClass(gvc),
                options: [] as OptionsItem[],
                query: '',
                orderString: '',
            };

            return html`<div class="bg-white shadow rounded-3" style="overflow-y: auto;${document.body.clientWidth > 768 ? 'min-width: 400px; width: 600px;' : 'min-width: 90vw; max-width: 92.5vw;'}">
                ${obj.gvc.bindView({
                    bind: vm.id,
                    view: () => {
                        if (vm.loading) {
                            return html`<div class="my-4">${this.spinner()}</div>`;
                        }
                        return html`<div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                            <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                <div class="tx_700">${obj.title ?? '產品列表'}</div>
                                <div class="flex-fill"></div>
                                <i
                                    class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                    onclick="${gvc.event(() => {
                                        if (obj.closeCallback) {
                                            obj.closeCallback();
                                        }
                                        gvc.closeDialog();
                                    })}"
                                ></i>
                            </div>
                            <div class="c_dialog">
                                <div class="c_dialog_body">
                                    <div class="c_dialog_main" style="gap: 24px; max-height: 500px;">${obj.innerHTML ?? ''}</div>
                                </div>
                            </div>
                        </div>`;
                    },
                    onCreate: () => {
                        if (vm.loading) {
                            ApiShop.getProduct({
                                page: 0,
                                limit: 99999,
                                search: vm.query,
                                orderBy: (() => {
                                    switch (vm.orderString) {
                                        case 'max_price':
                                        case 'min_price':
                                            return vm.orderString;
                                        default:
                                            return '';
                                    }
                                })(),
                            }).then((data) => {
                                vm.options = data.response.data.map((product: { content: { id: number; title: string; preview_image: string[] } }) => {
                                    return {
                                        key: product.content.id,
                                        value: product.content.title,
                                        image: product.content.preview_image[0] ?? BgWidget.noImageURL,
                                    };
                                });
                                vm.loading = false;
                                obj.gvc.notifyDataChange(vm.id);
                            });
                        }
                    },
                })}
            </div>`;
        }, 'productsDialog');
    }

    static settingDialog(obj: { gvc: GVC; title: string; innerHTML: (gvc: GVC) => string; footer_html: (gvc: GVC) => string; closeCallback?: () => void }) {
        const glitter = (() => {
            let glitter = obj.gvc.glitter;
            if (glitter.getUrlParameter('cms') === 'true' || glitter.getUrlParameter('type') === 'htmlEditor') {
                glitter = (window.parent as any).glitter || obj.gvc.glitter;
            }
            return glitter;
        })();
        return (glitter as any).innerDialog((gvc: GVC) => {
            const vm = {
                id: obj.gvc.glitter.getUUID(),
                loading: false,
            };

            return html`<div class="bg-white shadow rounded-3" style="overflow-y: auto;${document.body.clientWidth > 768 ? 'min-width: 400px; width: 600px;' : 'min-width: 90vw; max-width: 92.5vw;'}">
                ${gvc.bindView({
                    bind: vm.id,
                    view: () => {
                        if (vm.loading) {
                            return html`<div class="my-4">${this.spinner()}</div>`;
                        }
                        return html`<div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                            <div class="w-100 d-flex align-items-center p-3 border-bottom">
                                <div class="tx_700">${obj.title ?? '產品列表'}</div>
                                <div class="flex-fill"></div>
                                <i
                                    class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                    onclick="${gvc.event(() => {
                                        if (obj.closeCallback) {
                                            obj.closeCallback();
                                        }
                                        gvc.closeDialog();
                                    })}"
                                ></i>
                            </div>
                            <div class="c_dialog">
                                <div class="c_dialog_body">
                                    <div class="c_dialog_main" style="gap: 24px; max-height: 500px;">${obj.innerHTML(gvc) ?? ''}</div>
                                    <div class="c_dialog_bar">${obj.footer_html(gvc) ?? ''}</div>
                                </div>
                            </div>
                        </div>`;
                    },
                    onCreate: () => {},
                })}
            </div>`;
        }, obj.gvc.glitter.getUUID());
    }

    static dialog(obj: {
        gvc: GVC;
        title: string;
        innerHTML: string;
        width?: number;
        height?: number;
        save?: {
            text?: string;
            event: () => Promise<boolean>;
        };
        cancel?: {
            text?: string;
            event?: () => Promise<boolean>;
        };
    }) {
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            return html`<div
                class="bg-white shadow rounded-3"
                style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: ${obj.width ?? 600}px;` : 'min-width: 90vw; max-width: 92.5vw;'}"
            >
                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                    <div class="w-100 d-flex align-items-center p-3 border-bottom">
                        <div class="tx_700">${obj.title}</div>
                        <div class="flex-fill"></div>
                        <i
                            class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                            onclick="${gvc.event(() => {
                                if (obj.cancel?.event) {
                                    obj.cancel?.event().then((response) => {
                                        response && gvc.closeDialog();
                                    });
                                } else {
                                    gvc.closeDialog();
                                }
                            })}"
                        ></i>
                    </div>
                    <div class="c_dialog">
                        <div class="c_dialog_body">
                            <div class="c_dialog_main" style="gap: 24px; height: ${obj.height ? `${obj.height}px` : 'auto'}; max-height: 500px;">${obj.innerHTML ?? ''}</div>
                        </div>
                    </div>
                    ${obj.save || obj.cancel
                        ? html`
                              <div class="c_dialog_bar">
                                  ${obj.cancel
                                      ? BgWidget.cancel(
                                            gvc.event(() => {
                                                if (obj.cancel?.event) {
                                                    obj.cancel?.event().then((response) => {
                                                        response && gvc.closeDialog();
                                                    });
                                                } else {
                                                    gvc.closeDialog();
                                                }
                                            }),
                                            obj.cancel.text ?? '取消'
                                        )
                                      : ''}
                                  ${obj.save
                                      ? BgWidget.save(
                                            gvc.event(() => {
                                                obj.save?.event().then((response) => {
                                                    response && gvc.closeDialog();
                                                });
                                            }),
                                            obj.save.text ?? '確認'
                                        )
                                      : ''}
                              </div>
                          `
                        : ''}
                </div>
            </div>`;
        }, Tool.randomString(7));
    }

    // 圖片
    static noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';

    static arrowDownDataImage(color: string): string {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' fill='${color}'%3e%3cpath d='M225.813 48.907L128 146.72 30.187 48.907 0 79.093l128 128 128-128z'/%3e%3c/svg%3e"`;
    }

    static checkedDataImage(color: string): string {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='${color}' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e"`;
    }

    static darkDotDataImage(color: string): string {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='${color}'/%3e%3c/svg%3e"`;
    }

    static whiteDotDataImage(color: string): string {
        color = color.replace('#', '%23');
        return `"data:image/svg+xml,%3csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='16' height='16' rx='8' fill='${color}'/%3e%3crect x='4' y='4' width='8' height='8' rx='4' fill='white'/%3e%3c/svg%3e"`;
    }

    static getCheckedClass(gvc: GVC, color?: string) {
        const className = Tool.randomString(6);
        gvc.addStyle(`
            .${className} {
                min-width: 1rem;
                min-height: 1rem;
            }
            .${className}:checked[type='checkbox'] {
                border: 2px solid ${color ?? '#000'};
                background-color: #fff;
                background-image: url(${this.checkedDataImage(color ?? '#000')});
                background-position: center center;
            }
        `);
        return className;
    }

    static getDarkDotClass(gvc: GVC, color?: string) {
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
                background-image: url(${this.darkDotDataImage(color ?? '#000')});
                background-position: center center;
            }
        `);
        return className;
    }

    static getWhiteDotClass(gvc: GVC, color?: string) {
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
                background-image: url(${this.whiteDotDataImage(color ?? '#000')});
                background-position: center center;
            }
        `);
        return className;
    }

    static isImageUrlValid(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    static validImageBox(obj: { gvc: GVC; image: string; width: number; height?: number; class?: string; style?: string }) {
        const imageVM = {
            id: obj.gvc.glitter.getUUID(),
            class: Tool.randomString(6),
            loading: true,
            url: this.noImageURL,
        };
        obj.gvc.addStyle(`
            .${imageVM.class} {
                display: flex;
                min-width: ${obj.width}px;
                min-height: ${obj.height ?? obj.width}px;
                max-width: ${obj.width}px;
                max-height: ${obj.height ?? obj.width}px;
            }
        `);
        return obj.gvc.bindView({
            bind: imageVM.id,
            view: () => {
                if (imageVM.loading) {
                    return html`<div class="${imageVM.class} ${obj.class ?? ''}" style="${obj.style ?? ''}">
                        ${this.spinner({
                            container: { class: 'mt-0' },
                            text: { visible: false },
                        })}
                    </div>`;
                } else {
                    return html`<img class="${imageVM.class} ${obj.class ?? ''}" style="${obj.style ?? ''}" src="${imageVM.url}" />`;
                }
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

    static imageSelector(gvc: GVC, image: string, callback: (src: string) => void) {
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    if (!image) {
                        return html` <div
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
                    } else {
                        return html` <div>
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

    static imageDialog(obj: { gvc: GVC; image: string; width: number; height?: number; create?: () => void; read?: () => void; update?: () => void; delete?: () => void }) {
        const imageVM = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
            url: this.noImageURL,
        };
        return obj.gvc.bindView({
            bind: imageVM.id,
            view: () => {
                if (imageVM.loading) {
                    return this.spinner({
                        container: { class: 'mt-0' },
                        text: { visible: false },
                    });
                } else {
                    return html` <div
                        class="d-flex align-items-center justify-content-center rounded-3 shadow"
                        style="min-width: ${obj.width}px; width: ${obj.width}px; height: ${obj.height ?? obj.width}px; cursor:pointer; background: 50%/cover url('${imageVM.url}');"
                    >
                        <div class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image">
                            ${obj.create
                                ? html`<i
                                      class="fa-regular fa-plus"
                                      onclick="${obj.gvc.event(() => {
                                          obj.create && obj.create();
                                      })}"
                                  ></i>`
                                : ''}
                            ${obj.read
                                ? html`<i
                                      class="fa-regular fa-eye"
                                      onclick="${obj.gvc.event(() => {
                                          (window.parent as any).glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', imageVM.url);
                                          obj.read && obj.read();
                                      })}"
                                  ></i>`
                                : ''}
                            ${obj.update
                                ? html`<i
                                      class="fa-regular fa-pencil"
                                      onclick="${obj.gvc.event(() => {
                                          obj.update && obj.update();
                                      })}"
                                  ></i>`
                                : ''}
                            ${obj.delete
                                ? html`<i
                                      class="fa-regular fa-trash-can"
                                      onclick="${obj.gvc.event(() => {
                                          obj.delete && obj.delete();
                                      })}"
                                  ></i>`
                                : ''}
                        </div>
                    </div>`;
                }
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
}

(window as any).glitter.setModule(import.meta.url, BgWidget);
