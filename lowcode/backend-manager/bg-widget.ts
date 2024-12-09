import {GVC} from '../glitterBundle/GVController.js';
import {EditorElem} from '../glitterBundle/plugins/editor-elem.js';
import {PageSplit} from './splitPage.js';
import {Tool} from '../modules/tool.js';
import {ApiShop} from '../glitter-base/route/shopping.js';
import {Article} from '../glitter-base/route/article.js';
import {ApiUser} from '../glitter-base/route/user.js';
import {FormModule} from '../cms-plugin/module/form-module.js';
import {ShareDialog} from '../glitterBundle/dialog/ShareDialog.js';
import {FormCheck} from '../cms-plugin/module/form-check.js';
import {Language} from "../glitter-base/global/language.js";

const html = String.raw;
const css = String.raw;

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

type TableV3 = {
    loading: boolean;
    page: number;
    pageSize: number;
    tableData: {
        key: string;
        value: string;
    }[][];
    originalData: any;
    callback: () => void;
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
        return html` <h3 class="tx_title" style="white-space: nowrap; ${style}">${title}</h3>`;
    }

    static grayNote(text: string, style: string = ''): string {
        return html`<span
                style="white-space: normal;word-break: break-all;color: #8D8D8D; font-size: 14px; font-weight: 400; ${style}">${text}</span>`;
    }

    static blueNote(text: string, event: string = '', style: string = ''): string {
        return html`<span
                style="color: #4D86DB; font-size: 14px; font-weight: 400; cursor:pointer; overflow-wrap: break-word; ${style}"
                onclick="${event}">${text}</span>`;
    }

    static greenNote(text: string, event: string = '', style: string = ''): string {
        return html`<span
                style="color: #006621; font-size: 14px; font-weight: 400; cursor:pointer; overflow-wrap: break-word; text-decoration: underline; ${style}"
                onclick="${event}">${text}</span>`;
    }

    static dangerNote(text: string, event: string = '', style: string = ''): string {
        return html`<span
                style="color: #ef4444 !important; font-size: 14px; font-weight: 400; cursor:pointer; overflow-wrap: break-word; text-decoration: underline; ${style}"
                onclick="${event}"
        >${text}</span
        >`;
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
        return html`
            <button type="button" class="btn btn-${button.color} ${buttonSize} ${button.class ?? ''}"
                    style="${button.style ?? ''}" onclick="${event}">
                <i class="${icon ? icon.name : 'd-none'}"></i>
                <span class="${textColor} ${text.class ?? ''}"
                      style="${textSize} ${text.style ?? ''}">${text.name}</span>
            </button>`;
    }

    static save(event: string, text: string = '儲存', customClass?: string) {
        return html`
            <button class="btn btn-black ${customClass ?? ``}" type="button" onclick="${event}">
                <span class="tx_700_white">${text}</span>
            </button>`;
    }

    static ai_generator(gvc: GVC, format: any, callback: (data: any) => void) {
        return ``;
        // return html`
        //     <button class="btn btn-black ${customClass ?? ``}" type="button" onclick="${event}">
        //         <span class="tx_700_white">${text}</span>
        //     </button>`;
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
        return html`
            <button class="btn btn-gray" style="" type="button" onclick="${event}">
                <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}" style="color: #393939"></i>
                ${text.length > 0 ? html`<span class="tx_700" style="${obj?.textStyle ?? ''}">${text}</span>` : ''}
            </button>`;
    }

    static darkButton(
        text: string,
        event: string,
        obj?: {
            icon?: string;
            textStyle?: string;
            class?: string;
            style?: string;
        }
    ) {
        return html`
            <button type="button" class="btn btn-black ${obj?.class ?? ''}" style="${obj?.style ?? ''}"
                    onclick="${event}">
                <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}"></i>
                <span class="tx_700_white" style="${obj?.textStyle ?? ''}">${text}</span>
            </button>`;
    }

    static redButton(text: string, event: string, obj?: { icon?: string; textStyle?: string }) {
        return html`
            <button class="btn btn-red" type="button" onclick="${event}">
                <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}"></i>
                <span class="tx_700_white" style="${obj?.textStyle ?? ''}">${text}</span>
            </button>`;
    }

    static plusButton(obj: { title: string; event: string }) {
        return html`
            <div class="w-100 d-flex justify-content-center align-items-center gap-2 cursor_pointer"
                 style="color: #3366BB" onclick="${obj.event}">
                <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                    ${obj.title}
                </div>
                <i class="fa-solid fa-plus"></i>
            </div>`;
    }

    static dropPlusButton(obj: {
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
                        <div style="font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                            ${obj.title}
                        </div>
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <div class="dropdown-menu dropdown-menu-start my-1">
                        ${obj.options
                                .map((dd) => {
                                    return html`<a
                                            class="dropdown-item d-flex align-items-center"
                                            onclick="${obj.gvc.event(() => {
                                                dd.callback();
                                            })}"
                                    >
                                        <div class="me-2">${dd.icon}</div>
                                        ${dd.title}</a
                                    >`;
                                })
                                .join('')}
                    </div>
                </div>
            </div>
        `;
    }

    static questionButton(
        event: string,
        obj?: {
            size?: number;
        }
    ) {
        return html`<i class="fa-regular fa-circle-question cursor_pointer" style="font-size: ${obj?.size ?? 18}px"
                       onclick="${event}"></i>`;
    }

    static generateTooltipButton(
        gvc: GVC,
        innerHTML: string,
        obj?: {
            size?: number;
        }
    ) {
        return html`<i class="fa-regular fa-circle-question cursor_pointer" data-check="false"
                       style="font-size: ${obj?.size ?? 18}px" onclick="${gvc.event((e) => {
            if (!e.parentElement.classList.contains('position-relative')) {
                e.parentElement.classList.add('position-relative');
            }
            e.nextElementSibling.classList.toggle('d-none');
        })}"></i>
        <div class="w-100 d-none" style="position: absolute;left: 0;top: 100%;z-index:2;">
            <div class="" style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index:3;"
                 onclick="${gvc.event((e) => {
                     if (e.parentElement) {
                         e.parentElement.classList.toggle('d-none');
                     }

                 })}"></div>
            ${innerHTML}
        </div>
        `;
    }

    static iconButton(obj: { icon: 'info' | 'question'; event: string; size?: number }) {
        const iconClass = (() => {
            switch (obj.icon) {
                case 'info':
                    return 'fa-regular fa-circle-info';
                case 'question':
                    return 'fa-regular fa-circle-question';
            }
        })();
        return html`<i class="${iconClass} cursor_pointer" style="font-size: ${obj?.size ?? 18}px"
                       onclick="${obj.event}"></i>`;
    }

    static switchButton(gvc: GVC, def: boolean, callback: (value: boolean) => void) {
        return html`
            <div class="form-check form-switch m-0 cursor_pointer" style="margin-top: 10px;">
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
        return html`
            <div style="display: flex; align-items: center;">
                <div class="tx_normal me-2">${text.left ?? ''}</div>
                <div class="form-check form-switch m-0 cursor_pointer"
                     style="margin-top: 10px; display: flex; align-items: center;">
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
        return html`
            <div class="d-flex align-items-center justify-content-center" style="cursor:pointer; margin-right: 10px;"
                 onclick="${event}">
                <i class="fa-solid fa-angle-left"
                   style="margin-top: 0.25rem; color: #393939; font-size: 1.75rem; font-weight: 900;"></i>
            </div>`;
    }

    static aiChatButton(obj: {
        gvc: GVC;
        select: 'writer' | 'order_analysis' | 'operation_guide';
        title?: string,
        click?: () => void
    }) {
        const text =
            obj.title ??
            (() => {
                switch (obj.select) {
                    case 'writer':
                        return 'AI助手';
                    case 'order_analysis':
                        return '使用AI分析工具';
                    case 'operation_guide':
                        return '使用AI操作導引';
                }
            })();
        const size = document.body.clientWidth > 768 ? 24 : 18;
        return html`
            <div
                    class="bt_orange_lin"
                    onclick="${obj.gvc.event(() => {
                        if (obj.click) {
                            obj.click && obj.click()
                        } else {
                            (window.parent as any).glitter.share.ai_message.vm.select_bt = obj.select;
                            (window.parent as any).glitter.share.ai_message.toggle(true);
                        }
                    })}"
            >
                <img
                        src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_sas0s9s0s1sesas0_1697354801736-Glitterlogo.png"
                        class="me-1"
                        style="width: ${size}px; height: ${size}px;"
                />${text}
            </div>`;
    }

    // 標籤
    static primaryInsignia(text: string) {
        return html`
            <div class="insignia insignia-primary">${text}</div>`;
    }

    static successInsignia(text: string) {
        return html`
            <div class="insignia insignia-success">${text}</div>`;
    }

    static dangerInsignia(text: string) {
        return html`
            <div class="insignia insignia-danger">${text}</div>`;
    }

    static infoInsignia(text: string) {
        return html`
            <div class="insignia insignia-info">${text}</div>`;
    }

    static warningInsignia(text: string) {
        return html`
            <div class="insignia insignia-warning">${text}</div>`;
    }

    static notifyInsignia(text: string) {
        return html`
            <div class="insignia insignia-notify">${text}</div>`;
    }

    static secondaryInsignia(text: string) {
        return html`
            <div class="insignia insignia-secondary">${text}</div>`;
    }

    // 元素
    static leftLineBar() {
        return html`
            <div class="ms-2 border-end position-absolute h-100 left-0"></div>`;
    }

    //
    static languageInsignia(language:'en-US'|'zh-CN'|'zh-TW',style?:string){
      switch (language){
          case "zh-TW":
              return `  <div class="insignia " style="background: #ffe9b2;${style || ''};">${Language.getLanguageText({
                  local:true,
                  compare:language
              })}</div>`
          case "en-US":
              return `  <div class="insignia " style="background: #D8E7EC;${style || ''};">${Language.getLanguageText({
                  local:true,
                  compare:language
              })}</div>`
          case "zh-CN":
              return `  <div class="insignia " style="background: #FFD5D0;${style || ''};">${Language.getLanguageText({
                  local:true,
                  compare:language
              })}</div>`
      }
    }

    static horizontalLine(css?: { color?: string; size?: number; margin?: number }) {
        return html`
            <div class="w-100"
                 style="margin: ${css?.margin ?? 1}rem 0; border-bottom: ${css?.size ?? 1}px solid ${css?.color ?? '#DDD'}"></div>`;
    }

    static isValidEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidNumbers(str: string) {
        const numberRegex = /^\d+$/;
        return numberRegex.test(str);
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
        oninput?: (text: string) => void;
    }) {
        obj.title = obj.title ?? '';
        return html`
            <div style="${obj.divStyle ?? ''}">
                ${obj.title ? html`
                    <div class="tx_normal fw-normal" style="${obj.titleStyle ?? ''}">${obj.title}</div>` : ``}
                <div class="d-flex w-100 align-items-center border rounded-3 ${obj.readonly ? `bgw-input-readonly` : ``}"
                     style="margin: 8px 0;">
                    ${obj.startText ? html`
                        <div class="py-2 ps-3" style="white-space: nowrap">${obj.startText}</div>` : ''}
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
                                obj.oninput && obj.oninput(e.value);
                            })}"
                            value="${obj.default ?? ''}"
                            ${obj.readonly ? `readonly` : ``}
                    />
                    ${obj.endText ? html`
                        <div class="py-2 pe-3" style="white-space: nowrap">${obj.endText}</div>` : ''}
                </div>
            </div>
        `;
    }

    static textArea(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
        style?: string;
        type?: string;
        readonly?: boolean;
        pattern?: string
    }) {
        obj.title = obj.title ?? '';
        return html`${obj.title ? html`
            <div class="tx_normal fw-normal">${obj.title}</div>` : ''}
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

    static searchPlace(event: string, vale: string, placeholder: string, margin?: string, padding?: string) {
        const defMargin = document.body.clientWidth > 768 ? '16px 0' : '8px 0';
        const defPadding = document.body.clientWidth > 768 ? '0 16px' : '0';
        return html`
            <div style="margin: ${margin ?? defMargin}; padding: ${padding ?? defPadding}">
                <div class="w-100 position-relative">
                    <i class=" fa-regular fa-magnifying-glass"
                       style="font-size: 18px;color: #A0A0A0;position: absolute;left:20px;top:50%;transform: translateY(-50%);"
                       aria-hidden="true"></i>
                    <input class="form-control h-100 "
                           style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px;"
                           placeholder="${placeholder}" onchange="${event}" value="${vale}"/>
                </div>
            </div>
        `;
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
                const {title, array, code} = item;
                target.push({name: title, icon: '', link: `/collections/${code}`});
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
                    return {icon: item.icon, nameMap: [item.name]};
                }
                if (item.items) {
                    const path = findMenuItemPathByLink(item.items, link);
                    if (path?.nameMap) {
                        return {icon: item.icon, nameMap: [item.name, ...path?.nameMap]};
                    }
                }
            }
            return undefined;
        };

        // 繪製父子層容器 html
        const formatLinkHTML = (icon: string, pathList: string[]) => {
            let pathHTML = '';
            pathList.map((path, index) => {
                pathHTML += html`<span class="mx-1"
                                       style="font-size: 14px;">${path}</span>${index === pathList.length - 1 ? '' : html`
                    <i class="fa-solid fa-chevron-right"></i>`}`;
            });
            return html`
                <div style="display: flex; flex-wrap: wrap; align-items: center; font-size: 14px; font-weight: 500; gap: 6px; line-height: 140%;cursor: default;">
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
                    return BgWidget.spinner({text: {visible: false}});
                } else {
                    let dataList = JSON.parse(JSON.stringify(dropMenu.recentList)) as MenuItem[];
                    return html`${obj.title ? html`
                        <div class="tx_normal fw-normal">${obj.title}</div>` : ``}
                    <div style="position: relative">
                        ${obj.gvc.bindView({
                            bind: linkComp.id,
                            view: () => {
                                if (linkComp.loading) {
                                    return html`
                                        <div
                                                class="bgw-input border rounded-3"
                                                style="${linkComp.text.length > 0 ? '' : 'padding: 9.5px 12px;'} ${obj.style ?? ''}"
                                                id="${dropMenu.elementClass}"
                                                onclick="${obj.gvc.event(() => {
                                                    componentFresh();
                                                })}"
                                        >
                                            ${linkComp.text.length > 0 ? formatLinkText(linkComp.text) : html`<span
                                                    style="color: #777777;">${obj.placeHolder}</span>`}
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
                                                        callbackEvent({link: e.value});
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
                            onCreate: () => {
                            },
                        })}
                        ${obj.gvc.bindView({
                            bind: dropMenu.id,
                            view: () => {
                                if (dropMenu.loading) {
                                    return '';
                                } else {
                                    let h1 = '';
                                    if (dropMenu.prevList.length > 0) {
                                        h1 += html`
                                            <div
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
                                                    <div class="m-2"
                                                         style="cursor:pointer;display: flex; align-items: center; justify-content: space-between;">
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
                                                            <div style="min-width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                                                ${(() => {
                                                                    if (tag.icon.includes('https://')) {
                                                                        return html`
                                                                            <div
                                                                                    style="
                                                                                width: 25px; height: 25px;
                                                                                background-image: url('${tag.icon}');
                                                                                background-position: center;
                                                                                background-size: cover;
                                                                                background-repeat: no-repeat;
                                                                            "
                                                                            ></div>`;
                                                                    }
                                                                    return html`<i
                                                                            class="${tag.icon.length > 0 ? tag.icon : 'fa-regular fa-image'}"></i>`;
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
                                        <div class="border border-2 rounded-2 p-2"
                                             style="width: ${dropMenu.elementWidth}px;">
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
                            ApiShop.getProduct({page: 0, limit: 50000, search: ''}).then((data: any) => {
                                if (data.result) {
                                    (data.response.data || []).map((item: {
                                        content: { id: string; title: string; preview_image: string[] }
                                    }) => {
                                        const {id, title, preview_image} = item.content;
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
                                        const {name, tag} = item.content;
                                        if (name) {
                                            acticleList.push({name: name, icon: '', link: `/blogs/${tag}`});
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
                                            const {name, tag, page_type} = item.content;
                                            if (name) {
                                                switch (page_type) {
                                                    case 'page':
                                                        blockPageList.push({
                                                            name: name,
                                                            icon: '',
                                                            link: `/pages/${tag}`,
                                                        });
                                                        break;
                                                    case 'hidden':
                                                        hiddenPageList.push({
                                                            name: name,
                                                            icon: '',
                                                            link: `/hidden/${tag}`,
                                                        });
                                                        break;
                                                    case 'shopping':
                                                        oneStoreList.push({name: name, icon: '', link: `/shop/${tag}`});
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

    static select(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string;
        options: OptionsItem[];
        style?: string;
        readonly?: boolean;
        place_holder?: string
    }) {
        return html`<select
                class="c_select c_select_w_100"
                style="${obj.style ?? ''}; ${obj.readonly ? 'background: #f7f7f7;' : ''}"
                onchange="${obj.gvc.event((e) => {
                    obj.callback(e.value);
                })}"
                ${obj.readonly ? 'disabled' : ''}
        >
            ${obj.gvc.map(obj.options.map((opt) => html`
                <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>
                    ${opt.value}
                </option>`))}
            ${(obj.options as any).find((opt: any) => {
                return obj.default === opt.key;
            })
                    ? ``
                    : `<option class="d-none" selected>${obj.place_holder || `請選擇項目`}</option>`}
        </select>`;
    }

    // 頁面
    static dotlottieJS = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';

    static maintenance() {
        return html`
            <div class="d-flex flex-column align-items-center justify-content-center vh-100 vw-100">
                <iframe src="https://embed.lottiefiles.com/animation/99312"
                        style="width:35vw;height:30vw;min-width:300px;min-height:300px;"></iframe>
                <h3 style="margin-top: 30px;">此頁面功能維護中</h3>
            </div>`;
    }

    static noPermission() {
        return html`
            <script src="${this.dotlottieJS}" type="module"></script>
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
        return html`
            <div class="d-flex align-items-center justify-content-center flex-column w-100 mx-auto ${container.class}"
                 style="${container.style}">
                <div
                        class="spinner-border ${circleAttr.visible ? '' : 'd-none'}"
                        style="font-size: ${circleAttr.borderSize}px; width: ${circleAttr.width}px; height: ${circleAttr.width}px;"
                        role="status"
                ></div>
                <span class="mt-3 ${textAttr.visible ? '' : 'd-none'}"
                      style="font-size: ${textAttr.fontSize}px;">${textAttr.value}</span>
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
                        return html`
                            <div class="fs-2 text-center" style="padding:32px;">${vm.stateText}</div>`;
                    } else {
                        return html`
                            <div class="p-0">
                                <div style="overflow-x:scroll;">
                                    <table
                                            class="table table-centered table-nowrap  text-center table-hover fw-500 fs-7"
                                            style="overflow-x:scroll;margin-left: 32px;margin-right: 32px;width:calc(100% - 64px);${obj.table_style ?? ''}"
                                    >
                                        <div style="padding: 16px 32px;">${obj.filter ?? ''}</div>

                                        <thead>
                                        ${vm.data.length === 0
                                                ? ''
                                                : html`
                                                    <tr>
                                                        ${vm.data[0]
                                                                .map(
                                                                        (dd: any, index: number) =>
                                                                                html`
                                                                                    <th
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
                                                ? html`
                                                    <div class=" fs-2 text-center" style="padding-bottom:32px;">
                                                        ${vm.stateText}
                                                    </div>`
                                                : html`${vm.data
                                                        .map((dd: any, index: number) => {
                                                            const pencilId = gvc.glitter.getUUID();
                                                            return html`
                                                                <tr
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
                                                                                            html`
                                                                                                <td
                                                                                                        class="${d3.position ?? 'text-start'}  tx_normal"
                                                                                                        style="color:#393939 !important;border:none; ${obj.style && obj.style![index] ? obj.style![index] : ``}"
                                                                                                >
                                                                                                    <div class="my-auto"
                                                                                                         style="${obj.style && obj.style![index] ? obj.style![index] : ``}">
                                                                                                        ${d3.value}
                                                                                                    </div>
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
                        return html`
                            <div class="fs-2 text-center" style="padding: 32px;">${vm.stateText}</div>`;
                    } else {
                        return html`
                            <div class="m-0 p-0" style="${obj.table_style ?? ''}">
                                ${obj.filter ? html`
                                    <div class="m-0">${obj.filter}</div>` : ''}
                                <div style="margin-top: 4px; overflow-x: scroll; z-index: 1;">
                                    <table class="table table-centered table-nowrap text-center table-hover fw-400 fs-7"
                                           style="overflow-x:scroll; ">
                                        <thead>
                                        ${vm.data.length === 0
                                                ? ''
                                                : html`
                                                    <tr>
                                                        ${vm.data[0]
                                                                .map(
                                                                        (dd: any, index: number) =>
                                                                                html`
                                                                                    <th
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
                                                ? html`
                                                    <div class="fs-2 text-center"
                                                         style="padding-bottom:32px;white-space:nowrap;">${vm.stateText}
                                                    </div>`
                                                : html`${vm.data
                                                        .map((dd: any, index: number) => {
                                                            const pencilId = gvc.glitter.getUUID();
                                                            return html`
                                                                <tr
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
                                                                                            html`
                                                                                                <td
                                                                                                        class="${d3.position ?? 'text-start'} tx_normal px-1"
                                                                                                        style="color:#393939 !important;border:none;vertical-align: middle;${obj.style && obj.style![index] ? obj.style![index] : ``}"
                                                                                                >
                                                                                                    <div class="my-1 text-nowrap"
                                                                                                         style="${obj.style && obj.style![index] ? obj.style![index] : ``}">
                                                                                                        ${d3.value}
                                                                                                    </div>
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

    static tableV3(obj: {
        gvc: GVC;
        getData: (vm: TableV3) => void;
        rowClick: (data: any, index: number) => void;
        filter: {
            name: string;
            option?: boolean;
            event: (data: any) => void;
        }[];
        item_select?: () => void;
        hiddenPageSplit?: boolean;
    }) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const ps = new PageSplit(gvc);

        const widthList: number[] = [];
        let defWidth = 0;
        let fullWidth = 0;

        const ids = {
            container: glitter.getUUID(),
            filter: glitter.getUUID(),
            pencil: gvc.glitter.getUUID(),
            header: Tool.randomString(6),
            headerCell: Tool.randomString(6),
            tr: Tool.randomString(6),
            textClass: Tool.randomString(6),
        };

        const created = {
            checkbox: false,
            header: false,
            table: false,
        };

        gvc.addStyle(`
            .${ids.textClass} {
                text-align: left !important;
                padding-right: 0.25rem !important;
                padding-left: 0.25rem !important;
            }
        `);

        return gvc.bindView(() => {
            const vm: TableV3 = {
                loading: true,
                page: 1,
                pageSize: 0,
                tableData: [],
                originalData: [],
                callback: () => {
                    setTimeout(() => {
                        vm.loading = false;
                        gvc.notifyDataChange(ids.container);
                    }, 50);
                },
            };

            return {
                bind: ids.container,
                view: () => {
                    try {
                        if (vm.loading) {
                            return html`
                                <div style="text-align: center; padding: 24px; font-size: 24px; font-weight: 700;">資料載入中
                                    ....
                                </div>`;
                        }
                        if (vm.tableData.length === 0) {
                            return html`
                                <div style="text-align: center; padding: 24px; font-size: 24px; font-weight: 700;">
                                    暫無資料
                                </div>`;
                        }

                        // 表頭行爲全選按鈕
                        function checkAllBox(changeView: boolean) {
                            return EditorElem.checkBoxOnly({
                                gvc: gvc,
                                def: vm.originalData.every((item: any) => item.checked),
                                callback: (result) => {
                                    vm.originalData.map((dd: any, index: number) => {
                                        const checkboxParent = gvc.glitter.document.querySelector(`[gvc-checkbox="checkbox${index}"]`);
                                        if (checkboxParent) {
                                            const checkboxIcon = checkboxParent.querySelector(result ? 'i.fa-regular.fa-square' : 'i.fa-solid.fa-square-check ') as any;
                                            if (checkboxIcon) {
                                                checkboxIcon.click();
                                            }
                                        }
                                    });
                                    gvc.notifyDataChange(ids.filter);
                                    obj.item_select && obj.item_select();
                                    changeHeaderStyle();
                                },
                                stopChangeView: changeView,
                            });
                        }

                        // 表頭位置設定
                        function changeHeaderStyle() {
                            const target = document.querySelector(`[gvc-id="${gvc.id(ids.header)}"]`) as HTMLElement;
                            if (target) {
                                if (vm.originalData.find((dd: any) => dd.checked)) {
                                    target.style.position = 'sticky';
                                    target.style.top = '0';
                                    target.style.left = '0';
                                } else {
                                    target.style.position = 'relative';
                                    target.style.top = '';
                                    target.style.left = '';
                                }
                            }
                        }

                        // 判斷是否添加行爲按鈕
                        if (!created.checkbox) {
                            vm.tableData = vm.tableData.map((item, index: number) => {
                                if (obj.filter.length > 0) {
                                    return [
                                        {
                                            key: checkAllBox(true),
                                            value: EditorElem.checkBoxOnly({
                                                gvc: gvc,
                                                def: false,
                                                callback: (result) => {
                                                    vm.originalData[index].checked = result;
                                                    gvc.notifyDataChange(ids.filter);
                                                    changeHeaderStyle();
                                                    obj.item_select && obj.item_select();
                                                },
                                            }),
                                        },
                                        ...item,
                                    ];
                                }
                                return item;
                            });
                            created.checkbox = !created.checkbox;
                        }

                        return html`
                            <div style="margin-top: 4px; overflow-x: scroll; position: relative; min-height: 350px">
                                <div class="w-100 h-100 bg-white top-0"
                                     style="position: absolute; z-index: ${defWidth > 0 ? 0 : 2}; display: ${defWidth > 0 ? 'none' : 'block'};"></div>
                                ${gvc.bindView({
                                    bind: ids.header,
                                    view: () => {
                                        return gvc.bindView({
                                            bind: ids.filter,
                                            view: () => {
                                                // 顯示行為列
                                                if (vm.originalData.find((dd: any) => dd.checked)) {
                                                    const checkedData = vm.originalData.filter((dd: any) => dd.checked);

                                                    // 手機版
                                                    if (document.body.clientWidth < 768) {
                                                        return BgWidget.selNavbar({
                                                            checkbox: checkAllBox(false),
                                                            count: checkedData.length,
                                                            buttonList: [
                                                                BgWidget.selEventDropmenu({
                                                                    gvc: gvc,
                                                                    options: obj.filter.map((item) => {
                                                                        return {
                                                                            name: item.name,
                                                                            event: gvc.event(() => item.event(checkedData)),
                                                                        };
                                                                    }),
                                                                    text: '',
                                                                }),
                                                            ],
                                                        });
                                                    }

                                                    // 電腦版
                                                    const inButtons = obj.filter.filter((item) => item.option);
                                                    const outButtons = obj.filter.filter((item) => !item.option);
                                                    const inList =
                                                            inButtons.length > 0
                                                                    ? [
                                                                        BgWidget.selEventDropmenu({
                                                                            gvc: gvc,
                                                                            options: inButtons.map((item) => {
                                                                                return {
                                                                                    name: item.name,
                                                                                    event: gvc.event(() => item.event(checkedData)),
                                                                                };
                                                                            }),
                                                                            text: '更多操作',
                                                                        }),
                                                                    ]
                                                                    : [];
                                                    const outList = outButtons.map((item) => {
                                                        return BgWidget.selEventButton(
                                                                item.name,
                                                                gvc.event(() => item.event(checkedData))
                                                        );
                                                    });
                                                    return BgWidget.selNavbar({
                                                        checkbox: checkAllBox(false),
                                                        count: checkedData.length,
                                                        buttonList: [...inList, ...outList],
                                                    });
                                                }
                                                // 顯示表頭
                                                return vm.tableData[0]
                                                        .map((dd, index: number) => {
                                                            return html`
                                                                <div class="${ids.headerCell} ${ids.textClass} tx_700"
                                                                     style="min-width: ${widthList[index]}px;">${dd.key}
                                                                </div>`;
                                                        })
                                                        .join('');
                                            },
                                            divCreate: {
                                                class: `d-flex align-items-center mb-2 ${ids.header}`,
                                                style: `height: 40px !important;`,
                                            },
                                            onCreate: () => {
                                                if (!created.header) {
                                                    let timer = 0;
                                                    const si = setInterval(() => {
                                                        timer++;
                                                        const header = gvc.glitter.document.querySelector(`.${ids.header}`) as HTMLElement;
                                                        if (!created.header && header && header.offsetWidth > 0) {
                                                            let n = 0;
                                                            const htmlTags = new RegExp(/<[^>]*>/);
                                                            header?.querySelectorAll('div').forEach((div: any) => {
                                                                if (div.classList.contains(ids.headerCell)) {
                                                                    const baseWidth = htmlTags.test(div.innerHTML) ? 0 : div.innerHTML.replace(/\n/g, '').trim().length * 24;
                                                                    widthList[n] = div.offsetWidth > baseWidth ? div.offsetWidth : baseWidth;
                                                                    n++;
                                                                }
                                                            });
                                                            fullWidth = header.offsetWidth;
                                                            created.header = !created.header;
                                                            clearInterval(si);
                                                        }
                                                        if (timer > 500) {
                                                            clearInterval(si);
                                                        }
                                                    }, 50);
                                                }
                                            },
                                        });
                                    },
                                })}
                                <table class="table table-centered table-nowrap text-center table-hover"
                                       style="width: ${defWidth}px;">
                                    <tbody>
                                    ${vm.tableData
                                            .map((dd, trIndex: number) => {
                                                return html`
                                                    <tr
                                                            class="${trIndex === 0 ? ids.tr : ''}"
                                                            onclick="${gvc.event(() => {
                                                                obj.rowClick && obj.rowClick(dd, trIndex);
                                                            })}"
                                                            onmouseover="${gvc.event(() => {
                                                                $(`#${ids.pencil}${trIndex}`).removeClass('d-none');
                                                            })}"
                                                            onmouseout="${gvc.event(() => {
                                                                $(`#${ids.pencil}${trIndex}`).addClass('d-none');
                                                            })}"
                                                    >
                                                        ${dd
                                                                .map((d3, tdIndex: number) => {
                                                                    const tdClass = Tool.randomString(5);
                                                                    gvc.addStyle(`
                                                            .${tdClass} {
                                                                border: none;
                                                                vertical-align: middle;
                                                                width: ${widthList[tdIndex]}px;
                                                                ${dd.length > 1 && tdIndex === 0 ? 'border-radius: 10px 0 0 10px;' : ''}
                                                                ${dd.length > 1 && tdIndex === dd.length - 1 ? 'border-radius: 0 10px 10px 0;' : ''}
                                                                ${dd.length === 1 ? 'border-radius: 10px;' : ''}
                                                            }
                                                        `);
                                                                    return html`
                                                                        <td
                                                                                class="${ids.textClass} ${tdClass} tx_normal"
                                                                                ${obj.filter.length !== 0 && tdIndex === 0 ? `gvc-checkbox="checkbox${trIndex}"` : ''}
                                                                        >
                                                                            <div class="text-nowrap"
                                                                                 style="color: #393939 !important;">
                                                                                ${d3.value}
                                                                            </div>
                                                                        </td>`;
                                                                })
                                                                .join('')}
                                                    </tr>`;
                                            })
                                            .join('')}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                ${obj.hiddenPageSplit
                                        ? ''
                                        : ps.pageSplitV2(
                                                vm.pageSize,
                                                vm.page,
                                                (page) => {
                                                    vm.tableData = [];
                                                    vm.page = page;
                                                    vm.loading = true;
                                                    created.checkbox = false;
                                                    gvc.notifyDataChange(ids.container);
                                                },
                                                false
                                        )}
                            </div>`;
                    } catch (e) {
                        console.error(e);
                        return `${e}`;
                    }
                },
                divCreate: {},
                onCreate: () => {
                    if (vm.loading) {
                        obj.getData(vm);
                    } else {
                        if (!created.table) {
                            let timer = 0;
                            const si = setInterval(() => {
                                timer++;
                                if (created.header) {
                                    const checkbox = obj.filter.length > 0;
                                    const tr = gvc.glitter.document.querySelector(`.${ids.tr}`) as HTMLElement;

                                    tr?.querySelectorAll('td').forEach((td: any, index: number) => {
                                        if (checkbox && index === 0) {
                                            widthList[index] = 60;
                                        } else {
                                            widthList[index] = td.offsetWidth > widthList[index] ? td.offsetWidth : widthList[index];
                                        }
                                        defWidth += widthList[index];
                                    });

                                    if (fullWidth > defWidth) {
                                        const extraWidth = (fullWidth - defWidth) / (widthList.length - (checkbox ? 1 : 0));
                                        widthList.map((width, index) => {
                                            if (!(checkbox && index === 0)) {
                                                widthList[index] = width + extraWidth;
                                            }
                                        });
                                        defWidth = fullWidth;
                                    }

                                    created.table = !created.table;
                                    gvc.notifyDataChange(ids.container);
                                    clearInterval(si);
                                }
                                if (timer > 500) {
                                    clearInterval(si);
                                }
                            }, 50);
                        }
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

    static container(
        htmlString: string,
        obj?: {
            style?: string;
        }
    ) {
        return html`
            <div class="mt-4 mb-0 ${document.body.clientWidth > 768 ? 'mx-auto' : 'w-100 mx-0'}"
                 style="max-width: 100%; width: ${this.getContainerWidth()}px; ${obj?.style ?? ''}">
                ${htmlString}
            </div>`;
    }

    static container1x2(
        cont1: {
            html: string;
            ratio: number;
        },
        cont2: {
            html: string;
            ratio: number;
        }
    ) {
        return html`
            <div class="d-flex mt-4 mb-0 ${document.body.clientWidth > 768 ? 'mx-auto' : 'w-100 mx-0 flex-column'}"
                 style="gap: 24px;">
                <div style="width: ${document.body.clientWidth > 768 ? cont1.ratio : 100}%">${cont1.html}</div>
                <div style="width: ${document.body.clientWidth > 768 ? cont2.ratio : 100}%">${cont2.html}</div>
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
                                <label class="form-check-label" for="${id}_${item.key}"
                                       style="font-size: 16px; color: #393939;">${item.name}</label>
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
                                ${item.unit ? html`
                                    <div class="py-2 pe-3">${item.unit}</div>` : ''}
                            </div>
                        </div>
                    `;
                });

                return html`
                    <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">${radioInputHTML}
                    </div> `;
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
                                <label class="form-check-label cursor_pointer" for="${id}_${item.key}"
                                       style="font-size: 16px; color: #393939;">${item.name}</label>
                            </div>
                            ${def.includes(item.key) && item.innerHtml
                                    ? html`
                                        <div class="d-flex position-relative my-2">
                                            ${item.hiddenLeftLine ? '' : this.leftLineBar()}
                                            <div class="ms-4 w-100 flex-fill">${item.innerHtml}</div>
                                        </div>`
                                    : ``}
                        </div>
                    `;
                });

                return html`
                    <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">${checkboxHTML}</div> `;
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
            ${obj.title ? html`
                <div class="tx_normal fw-normal">${obj.title}</div>` : ``}
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
                                            <label class="form-check-label cursor_pointer" for="${id}_${dd.value}"
                                                   style="font-size: 16px; color: #393939;">${dd.title}</label>
                                        </div>
                                        ${obj.def === dd.value && dd.innerHtml ? html`
                                            <div class="mt-1">${dd.innerHtml}</div>` : ``}
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
        return html`
            <div style="margin-bottom: ${margin_bottom_px}px"></div>`;
    }

    static card(htmlString: string, classStyle: string = 'p-3 bg-white rounded-3 shadow border w-100') {
        // return html` <div class="${classStyle}">${htmlString}</div>`;
        return this.mainCard(htmlString);
    }

    static mainCard(htmlString: string) {
        return html`
            <div class="main-card">${htmlString}</div>`;
    }

    static summaryCard(htmlString: string) {
        return html`
            <div class="main-card summary-card">${htmlString ?? ''}</div>`;
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
        return html`
            <div
                    style="justify-content: flex-start; align-items: flex-start; gap: 22px; display: inline-flex;cursor: pointer;margin-top: 24px;margin-bottom: 24px;font-size: 18px; ${style ?? ''};"
            >
                ${data
                        .map((dd) => {
                            if (select === dd.key) {
                                return html`
                                    <div style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                                        <div
                                                style="align-self: stretch; text-align: center; color: #393939; font-family: Noto Sans; font-weight: 700; line-height: 18px; word-wrap: break-word;white-space: nowrap;"
                                                onclick="${gvc.event(() => {
                                                    callback(dd.key);
                                                })}"
                                        >
                                            ${dd.title}
                                        </div>
                                        <div style="align-self: stretch; height: 0px; border: 1px #393939 solid"></div>
                                    </div>`;
                            } else {
                                return html`
                                    <div
                                            style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex"
                                            onclick="${gvc.event(() => {
                                                callback(dd.key);
                                            })}"
                                    >
                                        <div
                                                style="align-self: stretch; text-align: center; color: #8D8D8D; font-family: Noto Sans; font-weight: 400; line-height: 18px; word-wrap: break-word;white-space: nowrap;"
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
                h += html`<p class="mb-1" style="white-space: normal; word-break: break-all;">${str}</p>`;
            });
        }
        return html`
            <div class="w-100 alert alert-secondary p-3 mb-0 ${css.class}"
                 style="white-space: normal; word-break: break-all; ${css.style} ">
                <div class="fs-5 mb-0"><strong>${title}</strong></div>
                ${messageList && messageList.length > 0 ? `<div class="mt-2" style="white-space: normal; word-break: break-all;">${h}</div>` : ``}
            </div>`;
    }

    static selNavbar(data: { checkbox?: string; count: number; buttonList: string[] }): string {
        const navbarStyle = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px !important;
            border-radius: 10px;
            background: linear-gradient(0deg, #f7f7f7 0%, #f7f7f7 100%), #fff;
            padding: 0 22px;
            ${document.body.clientWidth > 768 ? `width: 100%;` : `width: calc(100vw - 24px); `}
        `;
        return html`
            <div
                    style="${navbarStyle
                            .replace(/;\s+/g, ';')
                            .replace(/[\r\n]/g, '')
                            .trim()}"
            >
                <div style="display: flex; align-items: center; font-size: 14px; color: #393939; font-weight: 700;">
                    ${data.checkbox ?? ''}
                    <span style="margin-left: 24px;">已選取${data.count}項</span>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 12px;">${data.buttonList.join('')}</div>
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

        return html`
            <div>
                <div
                        class="sel_normal"
                        onclick="${obj.gvc.event(() => {
                            vm.show = !vm.show;
                            obj.gvc.notifyDataChange(vm.id);
                        })}"
                >
                    <span style="font-size: 14px; color: #393939; font-weight: 400;">${obj.text}</span>
                    ${document.body.clientWidth > 768 ? html`<i class="fa-regular fa-angle-down ms-1"></i>` : html`<i
                            class="fa-solid fa-ellipsis"></i>`}
                </div>
                ${obj.gvc.bindView({
                    bind: vm.id,
                    view: () => {
                        if (vm.show) {
                            return html`
                                <div class="c_absolute" style="top: 0; right: 0;">
                                    <div class="form-check d-flex flex-column ps-0" style="gap: 16px">
                                        ${obj.gvc.map(
                                                obj.options.map((opt) => {
                                                    return html`
                                                        <div class="cursor_pointer" onclick="${opt.event}">${opt.name}
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
                })}
            </div>`;
    }

    static summaryHTML(stringArray: string[][]) {
        return stringArray
            .map((list) => {
                return list
                    .map((item) => {
                        return html`
                            <div class="tx_normal" style="overflow-wrap: break-word;">${item}</div>`;
                    })
                    .join(this.mbContainer(8));
            })
            .join(this.horizontalLine());
    }

    static openBoxContainer(obj: {
        gvc: GVC;
        tag: string;
        title: string;
        insideHTML: string;
        height?: number;
        autoClose?: boolean;
        guideClass?: string;
        openOnInit?: boolean
    }): string {
        const bvid = Tool.randomString(5);
        const text = Tool.randomString(5);
        const height = obj.height ?? 500;
        const closeHeight = 56;

        obj.gvc.addStyle(`
            .box-container-${text} {
                position: relative;
                height: ${closeHeight}px;
                border: 1px solid #ddd;
                border-radius: 10px;
                overflow-y: hidden;
                transition: height 0.3s ease-out;
            }
            .box-container-${text}.open-box {
                max-height: ${height}px;
                height: ${height}px;
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
                    padding: 1rem;
                }
            }
        `);

        return obj.gvc.bindView({
            bind: bvid,
            view: () => {
                return html`
                    <div class="box-tag-${obj.tag} box-container-${text}">
                        <div
                                class="box-navbar-${text} ${obj.guideClass ?? ''}"
                                onclick="${obj.gvc.event((e) => {
                                    if (!obj.autoClose) {
                                        const boxes = document.querySelectorAll(`.box-tag-${obj.tag}`);
                                        boxes.forEach((box: any) => {
                                            const isOpening = box.classList.contains('open-box');
                                            const isSelf = box.classList.contains(`box-container-${text}`) || box.classList.contains(`arrow-icon-${text}`);
                                            if (isOpening && !isSelf) {
                                                box.classList.remove('open-box');
                                                if (box.tagName === 'DIV') {
                                                    box.style.height = `${closeHeight}px`;
                                                }
                                            }
                                        });
                                    }

                                    setTimeout(() => {
                                        e.parentElement.classList.toggle('open-box');
                                        e.parentElement.querySelector(`.arrow-icon-${text}`).classList.toggle('open-box');

                                        const container = window.document.querySelector(`.box-container-${text}`) as any;
                                        if (e.parentElement.classList.contains('open-box')) {
                                            const si = setInterval(() => {
                                                const inside = window.document.querySelector(`.box-inside-${text}`) as any;
                                                if (inside) {
                                                    const insideHeight = inside.clientHeight;
                                                    if (insideHeight + closeHeight < height) {
                                                        container.style.height = `${insideHeight + closeHeight + 20}px`;
                                                    } else {
                                                        container.style.height = `${height}px`;
                                                    }
                                                    clearInterval(si);
                                                }
                                            }, 100);
                                        } else {
                                            container.style.height = `${closeHeight}px`;
                                        }
                                    }, 50);
                                })}"
                        >
                            <div class="d-flex tx_700">${obj.title}</div>
                            <div class="d-flex">
                                <button class="box-tag-${obj.tag} arrow-icon-${text}"></button>
                            </div>
                        </div>
                        <div class="box-inside-${text} ${obj.guideClass ? `box-inside-${obj.guideClass}` : ''}">
                            ${obj.insideHTML}
                        </div>
                    </div>`;
            },
            divCreate: {},
            onCreate: () => {
                if (obj.openOnInit) {
                    const si = setInterval(() => {
                        const inside = window.document.querySelector(`.box-inside-${text}`) as any;
                        if (inside) {
                            const navs = window.document.getElementsByClassName(`box-navbar-${text}`) as any;
                            navs.length > 0 && navs[0].click();
                            clearInterval(si);
                        }
                    }, 300);
                }
            },
        });
    }

    static richTextView(text: string) {
        return html`
            <div style="width: 100%; height: 150px; position: relative; background: white; border-radius: 10px; overflow: hidden; border: 1px #DDDDDD solid">
                <div
                        style="left: 18px; right: 18px; top: 59px; position: absolute; color: ${text.length > 0
                                ? '#393939'
                                : '#8D8D8D'}; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word"
                >
                    ${text.length > 0 ? text : '點擊填寫商品描述及說明'}
                </div>
                <div
                        style="width: 100%; padding-top: 10px; padding-bottom: 10px; padding-left: 18px; padding-right: 18px; left: 0px; top: 0px; position: absolute; background: white; border-top-left-radius: 10px; border-top-right-radius: 10px; overflow: hidden; border-bottom: 1px #DDDDDD solid; justify-content: flex-start; align-items: center; display: inline-flex"
                >
                    <div style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex">
                        <div style="justify-content: flex-start; align-items: center; gap: 44px; display: flex">
                            <div style="color: #393939; font-size: 14px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                段落
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="5" viewBox="0 0 9 5" fill="none">
                                <path d="M8 1L4.5 4L1 1" stroke="#393939" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div style="width: 0px; height: 16px; border-radius: 1px; border: 1px #8D8D8D solid"></div>
                        <div style="justify-content: flex-start; align-items: center; gap: 16px; display: flex">
                            <div style="width: 12px; position: relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15"
                                     fill="none">
                                    <path
                                            d="M0 2.25C0 1.76602 0.446875 1.375 1 1.375H2.5H3H7C9.20938 1.375 11 2.9418 11 4.875C11 5.73086 10.6469 6.51836 10.0625 7.12539C11.2219 7.73789 12 8.85078 12 10.125C12 12.0582 10.2094 13.625 8 13.625H3H2.5H1C0.446875 13.625 0 13.234 0 12.75C0 12.266 0.446875 11.875 1 11.875H1.5V7.5V3.125H1C0.446875 3.125 0 2.73398 0 2.25ZM7 6.625C8.10312 6.625 9 5.84023 9 4.875C9 3.90977 8.10312 3.125 7 3.125H3.5V6.625H7ZM3.5 8.375V11.875H8C9.10312 11.875 10 11.0902 10 10.125C10 9.15977 9.10312 8.375 8 8.375H7H3.5Z"
                                            fill="#393939"
                                    />
                                </svg>
                            </div>
                            <div style="width: 12px; position: relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="15" viewBox="0 0 12 15"
                                     fill="none">
                                    <g clip-path="url(#clip0_9874_190584)">
                                        <path
                                                d="M0.163923 2.25C0.163923 1.76602 0.546959 1.375 1.02107 1.375H3.59249C4.0666 1.375 4.44964 1.76602 4.44964 2.25C4.44964 2.73398 4.0666 3.125 3.59249 3.125H3.16392V6.625C3.16392 8.07422 4.31571 9.25 5.73535 9.25C7.15499 9.25 8.30678 8.07422 8.30678 6.625V3.125H7.87821C7.4041 3.125 7.02107 2.73398 7.02107 2.25C7.02107 1.76602 7.4041 1.375 7.87821 1.375H10.4496C10.9237 1.375 11.3068 1.76602 11.3068 2.25C11.3068 2.73398 10.9237 3.125 10.4496 3.125H10.0211V6.625C10.0211 9.04219 8.10321 11 5.73535 11C3.36749 11 1.44964 9.04219 1.44964 6.625V3.125H1.02107C0.546959 3.125 0.163923 2.73398 0.163923 2.25ZM-0.264648 12.75C-0.264648 12.266 0.118387 11.875 0.592494 11.875H10.8782C11.3523 11.875 11.7354 12.266 11.7354 12.75C11.7354 13.234 11.3523 13.625 10.8782 13.625H0.592494C0.118387 13.625 -0.264648 13.234 -0.264648 12.75Z"
                                                fill="#393939"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_9874_190584">
                                            <rect width="12" height="14" fill="white" transform="translate(0 0.5)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div style="width: 14px; position: relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15"
                                     fill="none">
                                    <path
                                            d="M4.41055 4.43771C4.49805 3.96739 4.79336 3.61466 5.33203 3.38224C5.90898 3.13614 6.74844 3.04591 7.75469 3.2045C8.08008 3.25646 9.08906 3.45333 9.39805 3.53263C9.86563 3.65568 10.3441 3.3795 10.4699 2.91192C10.5957 2.44435 10.3168 1.96583 9.84922 1.84005C9.4582 1.73614 8.38359 1.52833 8.02812 1.47364C6.80586 1.28224 5.61367 1.3588 4.6457 1.77169C3.64766 2.19825 2.88477 2.99669 2.68242 4.1588C2.67969 4.17521 2.67695 4.18888 2.67695 4.20528C2.60039 4.8588 2.69062 5.45216 2.95312 5.97169C3.07617 6.21778 3.23203 6.4338 3.40977 6.62521H0.875C0.391016 6.62521 0 7.01622 0 7.50021C0 7.98419 0.391016 8.37521 0.875 8.37521H13.125C13.609 8.37521 14 7.98419 14 7.50021C14 7.01622 13.609 6.62521 13.125 6.62521H7.38555C7.38281 6.62521 7.37734 6.62247 7.37461 6.62247L7.34453 6.61427C6.36016 6.31896 5.56172 6.07833 5.01484 5.70919C4.76055 5.53693 4.60469 5.36466 4.51719 5.18692C4.43242 5.02013 4.375 4.78771 4.41328 4.43771H4.41055ZM9.54023 9.72052C9.61406 9.89825 9.66055 10.1525 9.59219 10.5436C9.51016 11.0248 9.21484 11.3858 8.66523 11.6209C8.08828 11.867 7.25156 11.9572 6.24531 11.7986C5.75312 11.7193 4.90273 11.4295 4.21094 11.1943C4.05781 11.1424 3.91016 11.0932 3.77617 11.0467C3.3168 10.8936 2.82187 11.1424 2.66875 11.6018C2.51562 12.0611 2.76445 12.5561 3.22383 12.7092C3.32227 12.742 3.43984 12.783 3.57109 12.8268C4.25195 13.0592 5.31016 13.4201 5.96641 13.5268H5.97187C7.19414 13.7182 8.38633 13.6416 9.3543 13.2287C10.3523 12.8022 11.1152 12.0037 11.3176 10.8416C11.416 10.2674 11.3914 9.73693 11.2328 9.25294H9.16289C9.3543 9.40607 9.47461 9.55919 9.54297 9.72325L9.54023 9.72052Z"
                                            fill="#393939"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div style="width: 0px; height: 16px; border-radius: 1px; border: 1px #8D8D8D solid"></div>
                        <div style="justify-content: flex-start; align-items: center; gap: 8px; display: flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15"
                                 fill="none">
                                <path
                                        d="M9 1.5C9 2.05313 8.55312 2.5 8 2.5H1C0.446875 2.5 0 2.05313 0 1.5C0 0.946875 0.446875 0.5 1 0.5H8C8.55312 0.5 9 0.946875 9 1.5ZM9 9.5C9 10.0531 8.55312 10.5 8 10.5H1C0.446875 10.5 0 10.0531 0 9.5C0 8.94688 0.446875 8.5 1 8.5H8C8.55312 8.5 9 8.94688 9 9.5ZM0 5.5C0 4.94688 0.446875 4.5 1 4.5H13C13.5531 4.5 14 4.94688 14 5.5C14 6.05313 13.5531 6.5 13 6.5H1C0.446875 6.5 0 6.05313 0 5.5ZM14 13.5C14 14.0531 13.5531 14.5 13 14.5H1C0.446875 14.5 0 14.0531 0 13.5C0 12.9469 0.446875 12.5 1 12.5H13C13.5531 12.5 14 12.9469 14 13.5Z"
                                        fill="#393939"
                                />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="5" viewBox="0 0 9 5" fill="none">
                                <path d="M8 1L4.5 4L1 1" stroke="#393939" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div style="width: 0px; height: 16px; border-radius: 1px; border: 1px #8D8D8D solid"></div>
                    </div>
                </div>
            </div>`;
    }

    // 視窗
    static selectFilter(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string;
        options: OptionsItem[];
        style?: string
    }) {
        return html`<select
                class="c_select"
                style="${obj.style ?? ''}"
                onchange="${obj.gvc.event((e) => {
                    obj.callback(e.value);
                })}"
        >
            ${obj.gvc.map(obj.options.map((opt) => html`
                <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>
                    ${opt.value}
                </option>`))}
        </select>`;
    }

    static searchFilter(event: string, vale: string, placeholder: string, margin?: string) {
        return html`
            <div class="w-100 position-relative" style="height: 40px !important; margin: ${margin ?? 0};">
                <i class="fa-regular fa-magnifying-glass"
                   style="font-size: 18px; color: #A0A0A0; position: absolute; left: 18px; top: 50%; transform: translateY(-50%);"
                   aria-hidden="true"></i>
                <input class="form-control h-100"
                       style="border-radius: 10px; border: 1px solid #DDD; padding-left: 50px; height: 100%;"
                       placeholder="${placeholder}" onchange="${event}" value="${vale}"/>
            </div>`;
    }

    static funnelFilter(obj: { gvc: GVC; callback: (value: any) => void }) {
        return html`
            <div
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

        return html`
            <div
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
                        return html`
                            <div class="c_absolute" style="top: 20px; right: 20px;">
                                <div class="form-check d-flex flex-column" style="gap: 16px">
                                    ${obj.gvc.map(
                                            obj.options.map((opt) => {
                                                return html`
                                                    <div>
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

    static selectDropList(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string[];
        options: OptionsItem[];
        style?: string;
        placeholder?: string
    }) {
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
                return html`
                    <div class="c_select" style="position: relative; ${obj.style ?? ''}">
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
                                ? html`
                                    <div class="c_dropdown">
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

                                                            return html`
                                                                <div class="d-flex align-items-center"
                                                                     style="gap: 24px">
                                                                    <input
                                                                            class="form-check-input mt-0 ${vm.checkClass}"
                                                                            type="checkbox"
                                                                            id="${opt.key}"
                                                                            name="radio_${vm.id}"
                                                                            onclick="${obj.gvc.event(() => call())}"
                                                                            ${obj.default.includes(opt.key) ? 'checked' : ''}
                                                                    />
                                                                    <div class="form-check-label c_updown_label cursor_pointer"
                                                                         onclick="${obj.gvc.event(() => call())}">
                                                                        <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                            ${opt.value}
                                                                        </div>
                                                                        ${opt.note ? html`
                                                                            <div class="tx_gray_12">${opt.note}
                                                                            </div> ` : ''}
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
        callback: (value: any, status?: number) => void;
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

            return html`
                <div class="bg-white shadow rounded-3"
                     style="overflow-y: auto; ${document.body.clientWidth > 768 ? 'min-width: 400px; width: 600px;' : 'min-width: 92.5vw;'}">
                    ${obj.gvc.bindView({
                        bind: vm.id,
                        view: () => {
                            if (vm.loading) {
                                return html`
                                    <div class="my-4">${this.spinner()}</div>`;
                            }
                            return html`
                                <div style="width: 100%; overflow-y: auto;" class="bg-white shadow rounded-3">
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
                                                        : html`
                                                            <div class="d-flex" style="gap: 12px;">
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

                                                            return html`
                                                                <div
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
                                                                    <div class="form-check-label c_updown_label ${obj.readonly ? '' : 'cursor_pointer'}"
                                                                         onclick="${obj.gvc.event(() => call())}">
                                                                        <div class="tx_normal ${opt.note ? 'mb-1' : ''}">
                                                                            ${opt.value}
                                                                        </div>
                                                                        ${opt.note ? html`
                                                                            <div class="tx_gray_12">${opt.note}
                                                                            </div> ` : ''}
                                                                    </div>
                                                                </div>`;
                                                        })
                                                )}
                                            </div>
                                            ${obj.readonly || obj.single
                                                    ? ''
                                                    : html`
                                                        <div class="c_dialog_bar">
                                                            ${BgWidget.cancel(
                                                                    obj.gvc.event(() => {
                                                                        obj.callback([], -1);
                                                                        gvc.closeDialog();
                                                                    }),
                                                                    '清除全部'
                                                            )}
                                                            ${BgWidget.cancel(
                                                                    obj.gvc.event(() => {
                                                                        obj.callback(vm.def, 0);
                                                                        gvc.closeDialog();
                                                                    })
                                                            )}
                                                            ${BgWidget.save(
                                                                    obj.gvc.event(() => {
                                                                        obj.callback(
                                                                                obj.default.filter((item) => {
                                                                                    return vm.options.find((opt: OptionsItem) => opt.key === item);
                                                                                }),
                                                                                1
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

            return html`
                <div class="bg-white shadow rounded-3"
                     style="overflow-y: auto;${document.body.clientWidth > 768 ? 'min-width: 400px; width: 600px;' : 'min-width: 90vw; max-width: 92.5vw;'}">
                    ${obj.gvc.bindView({
                        bind: vm.id,
                        view: () => {
                            if (vm.loading) {
                                return html`
                                    <div class="my-4">${this.spinner()}</div>`;
                            }
                            return html`
                                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
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
                                            <div class="c_dialog_main" style="gap: 24px; max-height: 500px;">
                                                ${obj.innerHTML ?? ''}
                                            </div>
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
                                    vm.options = data.response.data.map((product: {
                                        content: { id: number; title: string; preview_image: string[] }
                                    }) => {
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

    static settingDialog(obj: {
        gvc: GVC;
        title: string;
        width?: number;
        height?: number;
        innerHTML: (gvc: GVC) => string;
        footer_html: (gvc: GVC) => string;
        closeCallback?: () => void
    }) {
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

            return html`
                <div
                        class="bg-white shadow rounded-3"
                        style="overflow-y: auto; ${document.body.clientWidth > 768 ? `min-width: 400px; width: ${obj.width ?? 600}px;` : 'min-width: 90vw; max-width: 92.5vw;'}"
                >
                    ${gvc.bindView({
                        bind: vm.id,
                        view: () => {
                            const footer = obj.footer_html(gvc) ?? '';
                            if (vm.loading) {
                                return html`
                                    <div class="my-4">${this.spinner()}</div>`;
                            }
                            return html`
                                <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
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
                                            <div class="c_dialog_main"
                                                 style="gap: 24px; height: ${obj.height ? `${obj.height}px` : 'auto'}; max-height: 500px;">
                                                ${obj.innerHTML(gvc) ?? ''}
                                            </div>
                                            ${footer ? `<div class="c_dialog_bar">${footer}</div>` : ``}
                                        </div>
                                    </div>
                                </div>`;
                        },
                        onCreate: () => {
                        },
                    })}
                </div>`;
        }, obj.gvc.glitter.getUUID());
    }

    static dialog(obj: {
        gvc: GVC;
        title: string;
        innerHTML: (gvc: GVC) => string;
        width?: number;
        height?: number;
        style?: string;
        save?: {
            text?: string;
            event: (gvc: GVC) => Promise<boolean>;
        };
        cancel?: {
            text?: string;
            event?: (gvc: GVC) => Promise<boolean>;
        };
        xmark?: (gvc: GVC) => Promise<boolean>;
    }) {
        if (obj.gvc.glitter.getUrlParameter('cms') === 'true') {
            obj.gvc = (window.parent as any).glitter.pageConfig[0].gvc;
        }
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            return html`
                <div
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
                                        if (obj.xmark) {
                                            obj.xmark(gvc).then((response) => {
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
                                <div class="c_dialog_main"
                                     style="${obj.style ? obj.style : `gap: 24px; height: ${obj.height ? `${obj.height}px` : 'auto'}; max-height: 500px;`}">
                                    ${obj.innerHTML && obj.innerHTML(gvc)}
                                </div>
                            </div>
                        </div>
                        ${obj.save || obj.cancel
                                ? html`
                                    <div class="c_dialog_bar">
                                        ${obj.cancel
                                                ? BgWidget.cancel(
                                                        gvc.event(() => {
                                                            if (obj.cancel?.event) {
                                                                obj.cancel?.event(gvc).then((response) => {
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
                                                            obj.save?.event(gvc).then((response) => {
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

    static quesDialog(obj: {
        gvc: GVC;
        innerHTML: (gvc: GVC) => string;
        width?: number;
        height?: number;
        style?: string;
        save?: {
            text?: string;
            event: (gvc: GVC) => Promise<boolean>;
        };
        cancel?: {
            text?: string;
            event?: (gvc: GVC) => Promise<boolean>;
        };
        xmark?: (gvc: GVC) => Promise<boolean>;
    }) {
        if (obj.gvc.glitter.getUrlParameter('cms') === 'true') {
            obj.gvc = (window.parent as any).glitter.pageConfig[0].gvc;
        }
        const html = String.raw;

        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            return html`
                <div
                        style="height: 100vh;width: 100vw;"
                        class="d-flex align-items-center justify-content-center"
                        onclick="${gvc.event(() => {
                            gvc.closeDialog();
                        })}"
                >
                    <div
                            class="shadow rounded-3"
                            style="background-color: #393939;overflow-y: auto; ${document.body.clientWidth > 768
                                    ? `min-width: 400px; width: ${obj.width ?? 600}px;`
                                    : 'min-width: 90vw; max-width: 92.5vw;'}"
                    >
                        <div class=" shadow rounded-3" style="width: 100%; overflow-y: auto;">
                            <div class="c_dialog" style="background-color: #393939;">
                                <div class="c_dialog_body">
                                    <div class="c_dialog_main"
                                         style="${obj.style ? obj.style : `gap: 24px; height: ${obj.height ? `${obj.height}px` : 'auto'}; max-height: 500px;padding:20px;`}">
                                        ${obj.innerHTML && obj.innerHTML(gvc)}
                                    </div>
                                </div>
                            </div>
                            ${obj.save || obj.cancel
                                    ? html`
                                        <div class="c_dialog_bar">
                                            ${obj.cancel
                                                    ? BgWidget.cancel(
                                                            gvc.event(() => {
                                                                if (obj.cancel?.event) {
                                                                    obj.cancel?.event(gvc).then((response) => {
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
                                                                obj.save?.event(gvc).then((response) => {
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
                    </div>
                </div>
            `;
        }, Tool.randomString(7));
    }

    static appPreview(obj: {
        gvc: GVC;
        title: string;
        width?: number;
        height?: number;
        src: string;
        save?: {
            text?: string;
            event: (gvc: GVC) => Promise<boolean>;
        };
        cancel?: {
            text?: string;
            event?: (gvc: GVC) => Promise<boolean>;
        };
        style?: string;
    }) {
        if (obj.gvc.glitter.getUrlParameter('cms') === 'true') {
            obj.gvc = (window.parent as any).glitter.pageConfig[0].gvc;
        }
        return obj.gvc.glitter.innerDialog((gvc: GVC) => {
            return html`
                <div class="bg-white shadow rounded-3" style="overflow-y: auto;width:414px;">
                    <div class="bg-white shadow rounded-3" style="width: 100%; overflow-y: auto;">
                        <div class="w-100 d-flex align-items-center p-3 border-bottom">
                            <div class="tx_700">${obj.title}</div>
                            <div class="flex-fill"></div>
                            <i
                                    class="fa-regular fa-circle-xmark fs-5 text-dark cursor_pointer"
                                    onclick="${gvc.event(() => {
                                        if (obj.cancel?.event) {
                                            obj.cancel?.event(gvc).then((response) => {
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
                                <div class="c_dialog_main p-0"
                                     style="${obj.style ? obj.style : `gap: 24px; height: ${obj.height ? `${obj.height}px` : 'auto'}; max-height: 500px;`}">
                                    <iframe src="${obj.src}"
                                            style="width:414px;height:902px;max-width: 100vw;max-height: 100%;"></iframe>
                                </div>
                            </div>
                        </div>
                        ${obj.save || obj.cancel
                                ? html`
                                    <div class="c_dialog_bar">
                                        ${obj.cancel
                                                ? BgWidget.cancel(
                                                        gvc.event(() => {
                                                            if (obj.cancel?.event) {
                                                                obj.cancel?.event(gvc).then((response) => {
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
                                                            obj.save?.event(gvc).then((response) => {
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

    static jumpAlert(obj: {
        gvc: GVC;
        text: string;
        justify: 'top' | 'bottom';
        align: 'left' | 'center' | 'right';
        timeout?: number;
        width?: number
    }) {
        const className = Tool.randomString(5);
        const fixedStyle = (() => {
            let style = '';
            if (obj.justify === 'top') {
                style += `top: 12px;`;
            } else if (obj.justify === 'bottom') {
                style += `bottom: 12px;`;
            }
            if (obj.align === 'left') {
                style += `left: 12px;`;
            } else if (obj.align === 'center') {
                style += `left: 50%; right: 50%;`;
            } else if (obj.align === 'right') {
                style += `right: 12px;`;
            }
            return style;
        })();
        const transX = obj.align === 'center' ? '-50%' : '0';

        obj.gvc.addStyle(`
            .bounce-effect-${className} {
                animation: bounce 0.5s alternate;
                animation-iteration-count: 2;
                position: fixed;
                ${fixedStyle}
                background-color: #393939;
                opacity: 0.85;
                color: white;
                padding: 10px;
                border-radius: 8px;
                width: ${obj.width ?? 120}px;
                text-align: center;
                z-index: 11;
                transform: translateX(${transX});
            }

            @keyframes bounce {
                0% {
                    transform: translate(${transX}, 0);
                }
                100% {
                    transform: translate(${transX}, -6px);
                }
            }
        `);
        const htmlString = html`
            <div class="bounce-effect-${className}">${obj.text}</div>`;
        obj.gvc.glitter.document.body.insertAdjacentHTML('beforeend', htmlString);
        setTimeout(() => {
            const element = document.querySelector(`.bounce-effect-${className}`) as HTMLElement;
            if (element) {
                element.remove();
            }
        }, obj.timeout ?? 2000);
    }

    static fullDialog(obj: {
        gvc: GVC;
        title: string | ((data: GVC) => string);
        width?: number;
        height?: number;
        innerHTML: (gvc: GVC) => string;
        footer_html: (gvc: GVC) => string;
        closeCallback?: () => void
    }) {
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

            return html`
                <div
                        class="bg-white shadow ${document.body.clientWidth < 800 ? `` : `rounded-3`}"
                        style="overflow-y: auto; width: calc(100% - ${document.body.clientWidth > 768 ? 70 : 0}px); ${document.body.clientWidth > 768
                                ? `height: calc(100% - 70px);`
                                : `height:${(window.parent as any).innerHeight}px;padding-top:${gvc.glitter.share.top_inset || 0}px;`}"
                >
                    ${gvc.bindView({
                        bind: vm.id,
                        view: () => {
                            const footer = obj.footer_html(gvc) ?? '';
                            if (vm.loading) {
                                return html`
                                    <div class="my-4">${this.spinner()}</div>`;
                            }
                            return html`
                                <div class="bg-white shadow rounded-3"
                                     style="width: 100%; max-height: 100%; overflow-y: auto; position: relative;">
                                    <div class="w-100 d-flex align-items-center p-3 border-bottom"
                                         style="position: sticky; top: 0; z-index: 2; background: #fff;">
                                        <div class="tx_700">
                                            ${(typeof obj.title === 'function') ? obj.title(gvc) : (obj.title ?? '產品列表')}
                                        </div>
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
                                    <div class="c_dialog h-100">
                                        <div class="c_dialog_body h-100">
                                            <div class="c_dialog_main h-100"
                                                 style="max-height: 100%; padding: 0; gap: 24px; z-index: 1; position: relative;">
                                                ${obj.innerHTML(gvc) ?? ''}
                                            </div>
                                            ${footer ? `<div class="c_dialog_bar" style="z-index: 2;">${footer}</div>` : ``}
                                        </div>
                                    </div>
                                </div>`;
                        },
                        divCreate: {
                            class: 'h-100',
                        },
                        onCreate: () => {
                        },
                    })}
                </div>`;
        }, obj.gvc.glitter.getUUID());
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

    static validImageBox(obj: {
        gvc: GVC;
        image: string;
        width: number;
        height?: number;
        class?: string;
        style?: string
    }) {
        const imageVM = {
            id: obj.gvc.glitter.getUUID(),
            loading: true,
            url: this.noImageURL,
        };
        const wh = `
            display: flex;
            min-width: ${obj.width}px;
            min-height: ${obj.height ?? obj.width}px;
            max-width: ${obj.width}px;
            max-height: ${obj.height ?? obj.width}px;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        `;
        return obj.gvc.bindView({
            bind: imageVM.id,
            view: () => {
                if (imageVM.loading) {
                    return obj.gvc.bindView(() => {
                        return {
                            bind: obj.gvc.glitter.getUUID(),
                            view: () => {
                                return this.spinner({
                                    container: {class: 'mt-0'},
                                    text: {visible: false},
                                });
                            },
                            divCreate: {
                                style: `${wh}${obj.style ?? ''}`,
                                class: obj.class ?? '',
                            },
                        };
                    });
                } else {
                    return obj.gvc.bindView(() => {
                        return {
                            bind: obj.gvc.glitter.getUUID(),
                            view: () => {
                                return '';
                            },
                            divCreate: {
                                elem: 'img',
                                style: `${wh}${obj.style ?? ''}`,
                                class: obj.class ?? '',
                                option: [
                                    {
                                        key: 'src',
                                        value: imageVM.url,
                                    },
                                ],
                            },
                        };
                    });
                }
            },
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
                        return html`
                            <div
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
                        return html`
                            <div>
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
                                            <img style="position: absolute;max-width: 100%;height: calc(100% - 10px);  "
                                                 src="${image}"/>
                                        </div>
                                        <div
                                                class="child_"
                                                style="position: absolute;    width: 100%;    height: 100%;    background: rgba(0, 0, 0, 0.726);top: 0px;  "
                                                onclick="${gvc.event(() => {
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    dialog.checkYesOrNot({
                                                        text: '是否確認移除圖片?',
                                                        callback: (response) => {
                                                            if (response) {
                                                                image = '';
                                                                callback('');
                                                            }
                                                        },
                                                    });

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

    static imageDialog(obj: {
        gvc: GVC;
        image: string;
        width: number;
        height?: number;
        create?: () => void;
        read?: () => void;
        update?: () => void;
        delete?: () => void
    }) {
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
                        container: {class: 'mt-0'},
                        text: {visible: false},
                    });
                } else {
                    return html`
                        <div
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

    static imageLibraryDialog(obj: {
        gvc: GVC;
        title: string;
        innerHTML: (gvc: GVC) => string;
        footer_html: (gvc: GVC) => string;
        closeCallback?: () => void;
        closeTarget?: string
    }) {
        const windowID = obj.gvc.glitter.getUUID();
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

            return html`
                <div
                        class="bg-white shadow rounded-3"
                        style="max-height:calc(${window.parent.innerHeight - 50}px);height:700px;overflow-y: auto;${document.body.clientWidth > 768
                                ? 'min-width: 800px; width: 1080px;'
                                : 'min-width: 90vw; max-width: 92.5vw;'}"
                >
                    ${gvc.bindView({
                        bind: vm.id,
                        view: () => {
                            if (vm.loading) {
                                return html`
                                    <div class="my-4">${this.spinner()}</div>`;
                            }
                            return html`
                                <div class="bg-white shadow rounded-3 h-100 d-flex flex-column" style="width: 100%; ">
                                    <div class="w-100 d-flex align-items-center p-3 border-bottom"
                                         style="background: #F2F2F2;">
                                        <div class="tx_700">${obj.title ?? '產品列表'}</div>
                                        <div class="flex-fill"></div>

                                        <i
                                                class="fa-sharp fa-solid fa-xmark fs-5 text-dark cursor_pointer"
                                                onclick="${gvc.event(() => {
                                                    if (obj.closeCallback) {
                                                        obj.closeCallback();
                                                    }
                                                    gvc.closeDialog();
                                                })}"
                                        ></i>
                                    </div>
                                    <div class="c_dialog flex-fill">
                                        <div class="c_dialog_body d-flex flex-column h-100">
                                            <div class="c_dialog_main flex-fill" style="gap: 24px;max-height:100%; ">
                                                ${obj.innerHTML(gvc) ?? ''}
                                            </div>
                                            <div class="c_dialog_bar">${obj.footer_html(gvc) ?? ''}</div>
                                        </div>
                                    </div>
                                </div>`;
                        },
                        divCreate: {class: 'h-100'},
                        onCreate: () => {
                        },
                    })}
                </div>`;
        }, windowID);
    }

    static customForm(gvc: GVC, key: { title: string; key: string; no_padding?: boolean }[]) {
        let form_formats: any = {};

        return {
            view: gvc.bindView(() => {
                return {
                    bind: gvc.glitter.getUUID(),
                    view: () => {
                        return new Promise(async (resolve, reject) => {
                            let form_keys = key;
                            for (const b of form_keys) {
                                form_formats[b.key] = (await ApiUser.getPublicConfig(b.key, 'manager')).response.value || {list: []};
                                //判斷是註冊表單，必須帶入必要值
                                if (b.key === 'custom_form_register') {
                                    FormCheck.initialRegisterForm(form_formats[b.key].list);
                                }
                                form_formats[b.key].list.map((dd: any) => {
                                    dd.toggle = false;
                                });
                            }
                            resolve(
                                form_keys
                                    .map((dd) => {
                                        if (dd.no_padding) {
                                            return FormModule.editor(gvc, form_formats[dd.key].list, dd.title);
                                        } else {
                                            return BgWidget.mainCard(FormModule.editor(gvc, form_formats[dd.key].list, dd.title));
                                        }
                                    })
                                    .join(BgWidget.mbContainer(24))
                            );
                        });
                    },
                    divCreate: {
                        class: 'p-0',
                    },
                };
            }),
            save: async () => {
                for (const b of key) {
                    await ApiUser.setPublicConfig({
                        key: b.key,
                        value: form_formats[b.key],
                        user_id: 'manager',
                    });
                }
            },
        };
    }
}

(window as any).glitter.setModule(import.meta.url, BgWidget);
