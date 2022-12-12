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

export const randomString = (max: number) => {
    let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

export const randomLetter = (max: number) => {
    let text = '';
    let possible = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

export const parseCookie = () => {
    let cookieObj: any = {};
    let cookieAry = window.document.cookie.split(';');
    let cookie: any[];
    for (let i = 0, l = cookieAry.length; i < l; ++i) {
        cookie = cookieAry[i].trim().split('=');
        cookieObj[cookie[0]] = cookie[1];
    }
    return cookieObj;
};

export const getCookieByName = (name: string) => {
    let value = parseCookie()[name];
    value && (value = decodeURIComponent(value));
    return value;
};

export const setCookie = (key: string, value: any) => {
    let oneYear = 2592000 * 12;
    window.document.cookie = `${key}=${value}; max-age=${oneYear}; path=/`;
};

export const removeCookie = (keyList: string[] | string) => {
    if (Array.isArray(keyList)) {
        keyList.map((k) => (window.document.cookie = `${k}=''; max-age=-99999999; path=/`));
    } else if (keyList == '*') {
        let list = window.document.cookie.split('; ');
        list.map((l) => (window.document.cookie = `${l.split('=')[0]}=''; max-age=-99999999; path=/`));
    }
};

export const setFavicon = (ico: string): void => {
    let link: any = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = ico;
};

export const copyRight = (name: string, url: string, color?: string) => {
    return /*html*/ `Copyright &copy; ${new Date().getFullYear()}
        <a href="${url ? url : ``}" target="_blank" rel="noreferrer noopener" style="cursor:pointer;color:${color ? color : `#2E4053`}"
            >${name ? name : ''}</a
        >
        All Rights Reserved.`;
};

export const addQuantile = (num: number | string) => {
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

export const isUNO = (value: any) => {
    if (value === undefined || value === null || value.length == 0) {
        return true;
    } else {
        return false;
    }
};

export const isURL = (str_url: string) => {
    let url: { protocol: string };
    try {
        url = new URL(str_url);
    } catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
};

export const formatDatetime = (date?: string | Date, symbol?: { date: string; time: string } | false, apm?: boolean) => {
    let d = date === undefined || date === null || date == '' ? new Date() : new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = (apm && d.getHours() > 12 ? d.getHours() - 12 : d.getHours()).toString(),
        min = '' + d.getMinutes(),
        sec = '' + d.getSeconds(),
        meridiem = d.getHours() < 12 ? ' AM' : ' PM';

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;
    if (sec.length < 2) sec = '0' + sec;

    return (
        [year, month, day].join(symbol ? symbol.date : '-') +
        ' ' +
        [hour, min].join(symbol ? symbol.time : ':') +
        (apm ? meridiem : ':' + sec)
    );
};

export const formatDate = (date?: string | Date, symbol?: string) => {
    let d = date === undefined || date === null || date == '' ? new Date() : new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join(symbol ?? '-');
};

export const formatTimeByAPM = (time?: string | Date, apm?: boolean) => {
    let d = time ? new Date(time) : new Date(),
        hour = (apm && d.getHours() > 12 ? d.getHours() - 12 : d.getHours()).toString(),
        min = '' + d.getMinutes(),
        meridiem = d.getHours() < 12 ? ' AM' : ' PM';
    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;
    let result = [hour, min].join(':');
    apm && (result += meridiem);

    return result;
};

export const formatTimeByHMS = (time?: string, symbol?: string) => {
    let result: string = '';
    if (time === undefined) {
        let date = new Date(),
            h = '' + date.getHours(),
            m = '' + date.getMinutes(),
            s = '' + date.getSeconds();
        if (h.length < 2) h = '0' + h;
        if (m.length < 2) m = '0' + m;
        if (s.length < 2) s = '0' + s;
        result = [h, m, s].join(symbol ?? ':');
    } else {
        time.length < 8 && (time = '0' + time);
        let hour = time.slice(0, 2),
            min = time.slice(3, 5),
            meridiem = time.slice(6, 8);
        if ((meridiem === 'pm' || meridiem === 'PM') && hour !== '12') {
            hour = (parseInt(hour) + 12).toString();
        } else if ((meridiem === 'am' || meridiem === 'AM') && hour === '12') {
            hour = '00';
        }
        result = [hour, min, '00'].join(symbol ?? ':');
    }
    return result;
};

export const apiAJAX = (obj: ajaxType, callback?: (res: any) => void) => {
    if (obj) {
        $.ajax({
            url: obj.route,
            type: obj.method,
            data: JSON.stringify(obj.data),
            contentType: 'application/json; charset=utf-8',
            headers: { Authorization: getCookieByName('token') },
            success: (suss: any) => callback && callback(suss),
            error: (err: any) => {
                switch (err.status) {
                    case 401:
                        alert('未經授權的錯誤，系統將跳轉至登入畫面');
                        removeCookie(['token', 'account']);
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

export const centerImage = (img_url: string) => {
    var ran = randomLetter(5);
    const img: any = new Image();
    img.onload = function (this: { width: number; height: number }) {
        var obj = { w: '100%', h: '' };
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

export const ensure = <T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T => {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }
    return argument;
};

export const encodeFileBase64 = (files: File, callback: (resp: any) => void) => {
    var file = files;
    var reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
};

export const ObjCompare = (obj1: { [k: string]: any }, obj2: { [k: string]: any }) => {
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

export class Funnel {
    public optionSreach: (set: osType, callback: (res: any) => void, arg?: { [k: string]: any }) => string;
    constructor(gvc: GVC) {
        this.optionSreach = (set: osType, callback: (res: any) => void, arg?: { [k: string]: any }) => {
            let ra = randomString(7);
            let mu = randomString(7);
            let last = 0;
            let multiSpec = '';

            function caller(value?: string | number) {
                apiAJAX(
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
                                    if (Array.isArray(set.def) && set.def.findIndex((z: any) => ObjCompare(z, x)) == -1) {
                                        let rn = randomString(6);
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
                        let rn = randomString(6);
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
}