'use strict';
import { GVC } from './GVController.js';
const $ = (window as any).$;

interface osType {
    path: string;
    key: string;
    def: string | { [k: string]: any }[];
    height?: number;
    setTime?: number;
    multi?: boolean;
}

interface ajaxType {
    api?: string;
    route: string;
    method: string;
    data?: any;
}

export class Funnel {
    constructor(gvc: GVC) {
        // 產生 input/select/option 的表單HTML元素，內容為 API 取得的 JSON 資料
        this.optionSreach = (set: osType, callback: (res: any) => void, arg?: { [k: string]: any }) => {
            const funnel = this;
            let ra = this.randomString(7);
            let mu = this.randomString(7);
            let last = 0;
            let multiSpec = '';

            function caller(value?: string | number) {
                funnel.apiAJAX(
                    {
                        route: set.path + (value ?? ''),
                        method: 'get',
                    },
                    (data) => {
                        let t = '';
                        data.map((x: any) => {
                            t += /*html*/ `<li
                                class="${ra}_li"
                                style="cursor:pointer"
                                onclick="${gvc.event(() => {
                                    if (set.multi) {
                                        if (Array.isArray(set.def) && set.def.findIndex((z: any) => funnel.ObjCompare(z, x)) == -1) {
                                            let rn = funnel.randomString(6);
                                            $(`.${mu}`).append(/*html*/ `<div class="spec-span" id="${rn}">
                                                <span>${x[set.key]}</span>
                                                <i
                                                    class="dripicons-cross spec-icon"
                                                    onclick="${gvc.event(() => {
                                                        if (Array.isArray(set.def)) {
                                                            set.def = set.def.filter((l) => l.id !== x.id);
                                                            $(`#${rn}`).remove();
                                                        }
                                                    })}"
                                                ></i>
                                            </div>`);
                                            set.def.push(x);
                                        }
                                    } else {
                                        $(`#${ra}_input`).val(x[set.key]);
                                        callback(x);
                                        $(`#${ra}_option`).css('display', 'none');
                                    }
                                })}"
                            >
                                ${x[set.key]}
                            </li>`;
                        });
                        $(`#${ra}_option`).html(/*html*/ `<ul style="list-style-type:none">
                                ${t}
                            </ul>`);
                        $(`.${ra}_li`).hover(
                            function (this: any) {
                                $(this).css('background-color', '#eef2f7');
                                $(this).css('color', '#343a40');
                            },
                            function (this: any) {
                                $(this).css('background-color', '');
                                $(this).css('color', '');
                            }
                        );
                        if (set.multi) {
                            $(document).click(function (p: any) {
                                if ($(p.target).attr('class') !== `${ra}_li`) {
                                    $(`#${ra}_option`).css('display', 'none');
                                    $(document).off('click');
                                    callback({ title: arg ? arg.title : null, value: set.def });
                                }
                            });
                        }
                    }
                );
            }

            return /*html*/ `
                <div class="m-2" id="${ra}">
                    ${(() => {
                        if (set.multi && Array.isArray(set.def)) {
                            set.def.map((y) => {
                                let rn = funnel.randomString(6);
                                multiSpec += /*html*/ `<div class="spec-span" id="${rn}">
                                    <span>${y[set.key]}</span>
                                    <i
                                        class="dripicons-cross spec-icon"
                                        onclick="${gvc.event(() => {
                                            if (Array.isArray(set.def)) {
                                                set.def = set.def.filter((l) => l.id !== y.id);
                                                callback({ title: arg ? arg.title : null, value: set.def });
                                            }
                                        })}"
                                    ></i>
                                </div>`;
                            });
                            return /*html*/ `<div class="${mu} d-flex flex-wrap mb-2 align-items-center">
                                <a class="me-2 text-white fs-5">可複選： </a>${multiSpec}
                            </div>`;
                        } else {
                            return ``;
                        }
                    })()}
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            id="${ra}_input"
                            onclick="${gvc.event((e: any) => {
                                $(`#${ra}_option`).css('display', '');
                                caller();
                                $(e).on('input', function (ele: { timeStamp: number }) {
                                    last = ele.timeStamp;
                                    setTimeout(
                                        function () {
                                            last - ele.timeStamp == 0 && caller($(e).val());
                                        },
                                        set.setTime && set.setTime > 200 ? set.setTime : 200
                                    );
                                });
                            })}"
                            onblur="${gvc.event(() => !set.multi && setTimeout(() => $(`#${ra}_option`).css('display', 'none'), 200))}"
                            value="${set.multi ? `` : set.def ? set.def : ''}"
                            placeholder="請輸入關鍵字"
                        />
                        ${
                            set.multi
                                ? /*html*/ `<button
                                  class="btn btn-secondary"
                                  type="button"
                                  onclick="${gvc.event(() => {
                                      callback({ title: arg ? arg.title : null, value: set.def });
                                  })}"
                              >
                                  收合
                              </button>`
                                : ``
                        }
                    </div>
                    <div
                        style="
                    display: none;
                    height: ${set.height && set.height > 0 ? set.height : 8}rem;
                    word-break: break-all;
                    overflow: scroll;
                    text-align: left;
                    border-radius: 0 0 0.5rem 0.5rem;
                    border: 1px solid black;
                    padding-right: 2rem;
                    "
                        id="${ra}_option"
                    ></div>
                </div>
            `;
        };
    }

    // optionSreach 定義
    optionSreach: (set: osType, callback: (res: any) => void, arg?: { [k: string]: any }) => string;

    // 輸入位數產生隨機字串，首字為英文字母
    randomString = (max: number) => {
        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };

    // Cookie
    parseCookie = () => {
        let cookieObj: any = {};
        let cookieAry = window.document.cookie.split(';');
        let cookie: any[];
        for (let i = 0, l = cookieAry.length; i < l; ++i) {
            cookie = cookieAry[i].trim().split('=');
            cookieObj[cookie[0]] = cookie[1];
        }
        return cookieObj;
    };
    setCookie = (key: string, value: any) => {
        let oneYear = 2592000 * 12;
        window.document.cookie = `${key}=${value}; max-age=${oneYear}; path=/`;
    };
    getCookieByName = (name: string) => {
        let value = this.parseCookie()[name];
        value && (value = decodeURIComponent(value));
        return value;
    };
    removeCookie = (keyList: string[] | string) => {
        if (Array.isArray(keyList)) {
            keyList.map((k) => (window.document.cookie = `${k}=''; max-age=-99999999; path=/`));
        } else if (keyList == '*') {
            let list = window.document.cookie.split('; ');
            list.map((l) => (window.document.cookie = `${l.split('=')[0]}=''; max-age=-99999999; path=/`));
        }
    };

    // 比較兩個 Object 是否相同
    ObjCompare = (obj1: { [k: string]: any }, obj2: { [k: string]: any }) => {
        const Obj1_keys = Object.keys(obj1);
        const Obj2_keys = Object.keys(obj2);
        if (Obj1_keys.length !== Obj2_keys.length) {
            return false;
        }
        for (let k of Obj1_keys) {
            if (obj1[k] !== obj2[k]) {
                return false;
            }
        }
        return true;
    };

    // 簡易 AJAX
    apiAJAX = (obj: ajaxType, callback?: (res: any) => void) => {
        if (obj) {
            $.ajax({
                url: obj.route,
                type: obj.method,
                data: JSON.stringify(obj.data),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: this.getCookieByName('token') },
                success: (suss: any) => callback && callback(suss),
                error: (err: any) => {
                    switch (err.status) {
                        case 401:
                            alert('未經授權的錯誤，系統將跳轉至登入畫面');
                            this.removeCookie(['token', 'account']);
                            location.reload();
                            break;
                        default:
                            alert('發生錯誤！');
                            location.reload();
                            break;
                    }
                },
            });
        }
    };

    // 設置 favicon
    setFavicon = (ico: string): void => {
        let link: any = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = ico;
    };

    // 著作權
    copyRight = (name: string, url: string, color?: string) => {
        return /*html*/ `Copyright &copy; ${new Date().getFullYear()}
            <a href="${url ? url : ``}" target="_blank" rel="noreferrer noopener" style="cursor:pointer;color:${color ? color : `#2E4053`}"
                >${name ? name : ''}</a
            >
            All Rights Reserved.`;
    };

    // 千分位
    addQuantile = (num: number | string) => {
        if (typeof num !== 'number') return num;
        let result: string[] = [];
        num.toString()
            .split('')
            .reverse()
            .map((n, i) => {
                result.splice(0, 0, n);
                i % 3 == 2 && i != num.toString().length - 1 && result.splice(0, 0, ',');
            });
        return result.join('');
    };

    // 是否為 UNO
    isUNO = (value: any) => {
        if (
            value === undefined ||
            value === null ||
            value === 0 ||
            value.length === 0 ||
            (typeof value === 'object' && Object.keys(value).length === 0)
        ) {
            return true;
        } else {
            return false;
        }
    };

    // 是否為 URL
    isURL = (str_url: string) => {
        try {
            return Boolean(new URL(str_url));
        } catch (e) {
            return false;
        }
    };

    // 置中圖片
    centerImage = (img_url: string) => {
        let ran = this.randomString(5);
        const img: any = new Image();
        img.onload = function (this: { width: number; height: number }) {
            let obj = { w: '100%', h: '' };
            if (this.width > this.height) {
                obj.h = '24vh';
            } else if (this.width == this.height) {
                obj.h = '36vh';
            } else {
                obj.h = '48vh';
            }
            $(`.${ran}`).css({
                background: `url(${img_url})`,
                width: obj.w,
                height: obj.h,
                'background-size': 'cover',
                'background-position': 'center center',
                'background-repeat': 'no-repeat',
            });
        };
        img.src = img_url;
        return /*html*/ `<div class="${ran}"></div>`;
    };

    // 確保陣列尋找
    ensure = <T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T => {
        if (argument === undefined || argument === null) {
            throw new TypeError(message);
        }
        return argument;
    };

    // 將檔案編碼成 Base64 格式
    encodeFileBase64 = (files: File, callback: (resp: any) => void) => {
        var file = files;
        var reader = new FileReader();
        reader.onloadend = () => callback(reader.result);
        reader.readAsDataURL(file);
    };

    // JSON to CSV & Download
    buildData = (data: {}[]) => {
        return new Promise((resolve, reject) => {
            // 最後所有的資料會存在這
            let arrayData = [];

            // 取 data 的第一個 Object 的 key 當表頭
            let arrayTitle = Object.keys(data[0]);
            arrayData.push(arrayTitle);

            // 取出每一個 Object 裡的 value，push 進新的 Array 裡
            Array.prototype.forEach.call(data, (d) => {
                let items = <any>[];
                Array.prototype.forEach.call(arrayTitle, (title) => {
                    let item = d[title] || '無';
                    items.push(item);
                });
                arrayData.push(items);
            });

            resolve(arrayData);
        });
    };
    downloadCSV = (data: {}[], setFileName: string) => {
        let csvContent = '';
        Array.prototype.forEach.call(data, (d) => {
            let dataString = d.join(',') + '\n';
            csvContent += dataString;
        });

        // 下載的檔案名稱
        let fileName = setFileName + '.csv';

        // 建立一個 a，並點擊它
        let link = document.createElement('a');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent));
        link.setAttribute('download', fileName);
        link.click();
    };
    cutString = (text: string, limit: number) => (text.length > limit ? text.substring(0, limit) + '...' : text);
}
