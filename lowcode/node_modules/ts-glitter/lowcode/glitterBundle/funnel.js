'use strict';
const $ = window.$;
export class Funnel {
    constructor(gvc) {
        this.randomString = (max) => {
            let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
            for (let i = 1; i < max; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
        this.parseCookie = () => {
            let cookieObj = {};
            let cookieAry = window.document.cookie.split(';');
            let cookie;
            for (let i = 0, l = cookieAry.length; i < l; ++i) {
                cookie = cookieAry[i].trim().split('=');
                cookieObj[cookie[0]] = cookie[1];
            }
            return cookieObj;
        };
        this.setCookie = (key, value) => {
            let oneYear = 2592000 * 12;
            window.document.cookie = `${key}=${value}; max-age=${oneYear}; path=/`;
        };
        this.getCookieByName = (name) => {
            let value = this.parseCookie()[name];
            value && (value = decodeURIComponent(value));
            return value;
        };
        this.removeCookie = (keyList) => {
            if (Array.isArray(keyList)) {
                keyList.map((k) => (window.document.cookie = `${k}=''; max-age=-99999999; path=/`));
            }
            else if (keyList == '*') {
                let list = window.document.cookie.split('; ');
                list.map((l) => (window.document.cookie = `${l.split('=')[0]}=''; max-age=-99999999; path=/`));
            }
        };
        this.ObjCompare = (obj1, obj2) => {
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
        this.apiAJAX = (obj, callback) => {
            if (obj) {
                $.ajax({
                    url: obj.route,
                    type: obj.method,
                    data: JSON.stringify(obj.data),
                    contentType: 'application/json; charset=utf-8',
                    headers: { Authorization: this.getCookieByName('token') },
                    success: (suss) => callback && callback(suss),
                    error: (err) => {
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
        this.setFavicon = (ico) => {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = ico;
        };
        this.copyRight = (name, url, color) => {
            return `Copyright &copy; ${new Date().getFullYear()}
            <a href="${url ? url : ``}" target="_blank" rel="noreferrer noopener" style="cursor:pointer;color:${color ? color : `#2E4053`}"
                >${name ? name : ''}</a
            >
            All Rights Reserved.`;
        };
        this.addQuantile = (num) => {
            if (typeof num !== 'number')
                return num;
            let result = [];
            num.toString()
                .split('')
                .reverse()
                .map((n, i) => {
                result.splice(0, 0, n);
                i % 3 == 2 && i != num.toString().length - 1 && result.splice(0, 0, ',');
            });
            return result.join('');
        };
        this.isUNO = (value) => {
            if (value === undefined ||
                value === null ||
                value === 0 ||
                value.length === 0 ||
                (typeof value === 'object' && Object.keys(value).length === 0)) {
                return true;
            }
            else {
                return false;
            }
        };
        this.isURL = (str_url) => {
            try {
                return Boolean(new URL(str_url));
            }
            catch (e) {
                return false;
            }
        };
        this.centerImage = (img_url) => {
            let ran = this.randomString(5);
            const img = new Image();
            img.onload = function () {
                let obj = { w: '100%', h: '' };
                if (this.width > this.height) {
                    obj.h = '24vh';
                }
                else if (this.width == this.height) {
                    obj.h = '36vh';
                }
                else {
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
            return `<div class="${ran}"></div>`;
        };
        this.ensure = (argument, message = 'This value was promised to be there.') => {
            if (argument === undefined || argument === null) {
                throw new TypeError(message);
            }
            return argument;
        };
        this.encodeFileBase64 = (files, callback) => {
            var file = files;
            var reader = new FileReader();
            reader.onloadend = () => callback(reader.result);
            reader.readAsDataURL(file);
        };
        this.buildData = (data) => {
            return new Promise((resolve, reject) => {
                let arrayData = [];
                let arrayTitle = Object.keys(data[0]);
                arrayData.push(arrayTitle);
                Array.prototype.forEach.call(data, (d) => {
                    let items = [];
                    Array.prototype.forEach.call(arrayTitle, (title) => {
                        let item = d[title] || '無';
                        items.push(item);
                    });
                    arrayData.push(items);
                });
                resolve(arrayData);
            });
        };
        this.downloadCSV = (data, setFileName) => {
            let csvContent = '';
            Array.prototype.forEach.call(data, (d) => {
                let dataString = d.join(',') + '\n';
                csvContent += dataString;
            });
            let fileName = setFileName + '.csv';
            let link = document.createElement('a');
            link.setAttribute('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(csvContent));
            link.setAttribute('download', fileName);
            link.click();
        };
        this.cutString = (text, limit) => (text.length > limit ? text.substring(0, limit) + '...' : text);
        this.optionSreach = (set, callback, arg) => {
            const funnel = this;
            let ra = this.randomString(7);
            let mu = this.randomString(7);
            let last = 0;
            let multiSpec = '';
            function caller(value) {
                funnel.apiAJAX({
                    route: set.path + (value !== null && value !== void 0 ? value : ''),
                    method: 'get',
                }, (data) => {
                    let t = '';
                    data.map((x) => {
                        t += `<li
                                class="${ra}_li"
                                style="cursor:pointer"
                                onclick="${gvc.event(() => {
                            if (set.multi) {
                                if (Array.isArray(set.def) && set.def.findIndex((z) => funnel.ObjCompare(z, x)) == -1) {
                                    let rn = funnel.randomString(6);
                                    $(`.${mu}`).append(`<div class="spec-span" id="${rn}">
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
                            }
                            else {
                                $(`#${ra}_input`).val(x[set.key]);
                                callback(x);
                                $(`#${ra}_option`).css('display', 'none');
                            }
                        })}"
                            >
                                ${x[set.key]}
                            </li>`;
                    });
                    $(`#${ra}_option`).html(`<ul style="list-style-type:none">
                                ${t}
                            </ul>`);
                    $(`.${ra}_li`).hover(function () {
                        $(this).css('background-color', '#eef2f7');
                        $(this).css('color', '#343a40');
                    }, function () {
                        $(this).css('background-color', '');
                        $(this).css('color', '');
                    });
                    if (set.multi) {
                        $(document).click(function (p) {
                            if ($(p.target).attr('class') !== `${ra}_li`) {
                                $(`#${ra}_option`).css('display', 'none');
                                $(document).off('click');
                                callback({ title: arg ? arg.title : null, value: set.def });
                            }
                        });
                    }
                });
            }
            return `
                <div class="m-2" id="${ra}">
                    ${(() => {
                if (set.multi && Array.isArray(set.def)) {
                    set.def.map((y) => {
                        let rn = funnel.randomString(6);
                        multiSpec += `<div class="spec-span" id="${rn}">
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
                    return `<div class="${mu} d-flex flex-wrap mb-2 align-items-center">
                                <a class="me-2 text-white fs-5">可複選： </a>${multiSpec}
                            </div>`;
                }
                else {
                    return ``;
                }
            })()}
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            id="${ra}_input"
                            onclick="${gvc.event((e) => {
                $(`#${ra}_option`).css('display', '');
                caller();
                $(e).on('input', function (ele) {
                    last = ele.timeStamp;
                    setTimeout(function () {
                        last - ele.timeStamp == 0 && caller($(e).val());
                    }, set.setTime && set.setTime > 200 ? set.setTime : 200);
                });
            })}"
                            onblur="${gvc.event(() => !set.multi && setTimeout(() => $(`#${ra}_option`).css('display', 'none'), 200))}"
                            value="${set.multi ? `` : set.def ? set.def : ''}"
                            placeholder="請輸入關鍵字"
                        />
                        ${set.multi
                ? `<button
                                  class="btn btn-secondary"
                                  type="button"
                                  onclick="${gvc.event(() => {
                    callback({ title: arg ? arg.title : null, value: set.def });
                })}"
                              >
                                  收合
                              </button>`
                : ``}
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
