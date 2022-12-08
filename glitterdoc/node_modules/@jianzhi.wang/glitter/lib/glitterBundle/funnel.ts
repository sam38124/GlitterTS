'use strict';
// import { Glitter } from './Glitter.js';
// const glitter = Glitter.shared();
const $=(window as any).$
interface osType {
    path: string;
    key: string;
    def: string;
}

interface ajaxType {
    api?: string;
    route: string;
    method: string;
    data?: any;
}

export const randomString = (max: number) => {
    let text = '';
    let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
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

export const formatDate = (date: string | Date, symbol?: string) => {
    let d = date === undefined || date === null || date == '' ? new Date() : new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join(symbol ?? '-');
};

export const formatTimeByAPM = (time: string | Date, apm?: boolean) => {
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

export const formatTimeByHMS = (time: string) => {
    time.length < 8 && (time = '0' + time);
    let hour = time.slice(0, 2),
        min = time.slice(3, 5),
        meridiem = time.slice(6, 8);
    if ((meridiem === 'pm' || meridiem === 'PM') && hour !== '12') {
        hour = (parseInt(hour) + 12).toString();
    } else if ((meridiem === 'am' || meridiem === 'AM') && hour === '12') {
        hour = '00';
    }

    let result = [hour, min, '00'].join(':');
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

export const optionSreach = (set: osType, callback: (res: any) => void, modules: { [key: string]: any }) => {
    const event = modules.event;
    const $ = modules.$;
    let ra = randomString(7);
    let last = 0;

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
                        onclick="${event(() => {
                            $(`#${ra}_input`).val(x[set.key]);
                            callback(x);
                            $(`#${ra}_option`).css('display', 'none');
                        })}"
                    >
                        ${x[set.key]}
                    </li>`;
                });
                $(`#${ra}_option`).html(/*html*/ `<ul style="list-style-type:none">${t}</ul>`);
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
            }
        );
    }

    return /*html*/ `
        <div class="m-2" id="${ra}">
            <input
                type="text"
                class="form-control"
                id="${ra}_input"
                onclick="${event((e: any) => {
                    $(`#${ra}_option`).css('display', '');
                    caller();
                    $(e).on('keyup', function (ele: { timeStamp: number }) {
                        last = ele.timeStamp;
                        setTimeout(function () {
                            last - ele.timeStamp == 0 && caller($(e).val());
                        }, 200);
                    });
                })}"
                onblur="${event(() => setTimeout(() => $(`#${ra}_option`).css('display', 'none'), 200))}"
                value="${set.def ?? ''}"
                placeholder="請輸入關鍵字"
            />
            <div
                style="
                    display: none;
                    height: 8rem;
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
