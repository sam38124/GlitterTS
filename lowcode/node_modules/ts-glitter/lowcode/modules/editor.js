'use strict';
import { Funnel } from '../glitterBundle/funnel.js';
export class Editor {
    constructor(gvc) {
        var _a;
        const funnel = new Funnel(gvc);
        const editor = this;
        const glitter = gvc.glitter;
        const $ = window.$;
        glitter.share.formExtra = (_a = glitter.share.formExtra) !== null && _a !== void 0 ? _a : {};
        this.generateForm = (data, window, callback, second) => {
            let id = glitter.getUUID();
            return `<div id="${id}" class="w-100">
        ${gvc.bindView({
                bind: id,
                view: function () {
                    let html = ``;
                    data.map((dd, index) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
                        if (!dd.disable) {
                            if (!dd.custom) {
                                html += `
                                <div class="w-100 fs-3 d-flex ">
                                    <label class="form-label fw-bold" style="font-size: 16px; font-weight: 400;">
                                        <span class="fw-bold${dd.need ? `` : ` d-none`}" style="color: red; font-size: 18px; font-weight: 300;"
                                            >*</span
                                        >
                                        ${(_c = (typeof dd.name === 'function' ? (_a = dd.name()) !== null && _a !== void 0 ? _a : '' : (_b = dd.name) !== null && _b !== void 0 ? _b : '')) !== null && _c !== void 0 ? _c : ''}</label
                                    >
                                    <div class="flex-fill"></div>
                                    ${dd.preView
                                    ? `
                                              <button
                                                  class="btn btn-warning"
                                                  onclick="${gvc.event(() => {
                                        let editEdit = glitter.getUUID();
                                        $('#standard-modal').remove();
                                        $('body').append(` <div
                                                          id="standard-modal"
                                                          class="modal fade"
                                                          tabindex="-1"
                                                          role="dialog"
                                                          aria-labelledby="standard-modalLabel"
                                                          aria-hidden="true"
                                                      >
                                                          <div
                                                              class="modal-dialog modal-dialog-centered${glitter.ut.frSize({ sm: `` }, ' m-0')}"
                                                          >
                                                              <div class="modal-content">
                                                                  <div class="modal-header d-flex border-bottom">
                                                                      <h4
                                                                          class="modal-title fw-light"
                                                                          style="font-size: 28px;"
                                                                          id="standard-modalLabel"
                                                                      >
                                                                          預覽
                                                                      </h4>
                                                                      <div class="flex-fill"></div>
                                                                      <button
                                                                          type="button"
                                                                          class="btn"
                                                                          data-bs-dismiss="modal"
                                                                          aria-hidden="true"
                                                                          style="margin-right: -10px;"
                                                                      >
                                                                          <i
                                                                              class="fa-regular fa-circle-xmark text-white"
                                                                              style="font-size: 25px;"
                                                                          ></i>
                                                                      </button>
                                                                  </div>
                                                                  <div class="modal-body pt-2 px-2" id="${editEdit}">
                                                                      ${gvc.bindView(() => {
                                            return {
                                                bind: `${editEdit}`,
                                                view: () => editor.generateForm(JSON.parse(JSON.stringify(dd.value)), window, () => { }),
                                            };
                                        })}
                                                                  </div>
                                                                  <div class="modal-footer w-100">
                                                                      <button
                                                                          type="button"
                                                                          class="btn btn-light flex-fill"
                                                                          data-bs-dismiss="modal"
                                                                      >
                                                                          關閉
                                                                      </button>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      </div>`);
                                        $('#standard-modal').modal('show');
                                    })}"
                                              >
                                                  <i class="fa-solid fa-eye fs-6 me-1 "></i>預覽表單
                                              </button>
                                          `
                                    : ``}
                                </div>
                            `;
                            }
                            switch (dd.elem) {
                                case 'selected':
                                    html += `<select
                                    class="form-select"
                                    aria-label="Default select example"
                                    style="font-size: 14px;"
                                    onchange="${gvc.event((e) => ((dd.value = $(e).val()), callback(dd)))}"
                                >
                                    ${glitter.print(() => {
                                        let html = '';
                                        dd.option.map((d2) => {
                                            html += `<option
                                                value="${d2.value}"
                                                ${d2.value === dd.value ? `selected` : ``}
                                                ${d2.disable ? `hidden` : ``}
                                            >
                                                ${d2.name}
                                            </option>`;
                                        });
                                        return html;
                                    })}
                                </select>`;
                                    break;
                                case 'checked':
                                    dd.option = glitter.ut.toJson(dd.option, []);
                                    dd.option.map((d2) => {
                                        var _a;
                                        let labelID = glitter.getUUID();
                                        html += `
                                        <div class="py-1 d-flex">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                role="${(_a = dd.role) !== null && _a !== void 0 ? _a : ''}"
                                                id="${labelID}"
                                                onchange="${gvc.event((e) => {
                                            dd.type === 'single' &&
                                                dd.option.map((d3) => (d3.checked = false));
                                            d2.checked = $(e).get(0).checked;
                                            gvc.notifyDataChange(id), callback(dd);
                                        })}"
                                                ${d2.checked ? `checked` : ``}
                                            />
                                            ${glitter.print(() => {
                                            let h = '';
                                            if (d2.elem && d2.checked) {
                                                h += `<div style="width: calc(100% - 30px);">
                                                        ${glitter.print(() => {
                                                    if (d2.elem === 'form') {
                                                        return ` <label
                                                                        class="ms-1"
                                                                        for="${labelID}"
                                                                        style="font-size: 16px;font-weight: 400;"
                                                                    >
                                                                        ${d2.name}
                                                                    </label>
                                                                    ${editor.generateForm(d2.value, window, callback, true)}`;
                                                    }
                                                    else {
                                                        return `<div class="ms-1">
                                                                    ${editor.generateForm([d2], window, callback, true)}
                                                                </div>`;
                                                    }
                                                })}
                                                    </div>`;
                                            }
                                            else {
                                                h += ` <label
                                                        class="ms-1"
                                                        for="${labelID}"
                                                        style="font-size: 16px;font-weight: 400;"
                                                    >
                                                        ${d2.name}
                                                    </label>`;
                                            }
                                            return h;
                                        })}
                                        </div>
                                    `;
                                    });
                                    break;
                                case 'form':
                                    html += `<div class="my-2 px-3">${editor.generateForm(dd.value, window, callback, true)}</div>`;
                                    break;
                                case 'formEdit':
                                    html += glitter.share.formEdit.formEditor(dd.value, window, dd.formSetting, false);
                                    break;
                                case 'input':
                                    switch (dd.type) {
                                        case 'switch':
                                            const ran = funnel.randomString(4);
                                            html += `<div class="m-1 text-start">
                                            <input
                                                type="checkbox"
                                                id="switch${ran}"
                                                ${dd.value ? `checked` : ``}
                                                onclick="${gvc.event((e) => {
                                                dd.value = $(e).attr('checked') === 'checked' ? true : false;
                                                callback(dd);
                                            })}"
                                                data-switch="primary"
                                            />
                                            <label for="switch${ran}" data-on-label="On" data-off-label="Off"></label>
                                        </div>`;
                                            break;
                                        case 'email':
                                            html += `<div class="input-group input-group-merge">
                                            <input
                                                class="form-control"
                                                type="email"
                                                placeholder="${(_d = dd.placeholder) !== null && _d !== void 0 ? _d : '請輸入' + dd.name}"
                                                onchange="${gvc.event((e) => (dd.value = $(e).val()))}"
                                                value="${(_e = dd.value) !== null && _e !== void 0 ? _e : ''}"
                                                ${dd.readonly ? `readonly` : ``}
                                            />
                                            ${dd.needAuth
                                                ? `<div
                                                      class="btn btn-outline-primary"
                                                      onclick="${gvc.event(() => {
                                                })}"
                                                  >
                                                      <span>驗證</span>
                                                  </div>`
                                                : ``}
                                        </div>`;
                                            break;
                                        case 'phone':
                                            html += ` <div class="input-group input-group-merge">
                                            <input
                                                class="form-control"
                                                type="email"
                                                placeholder="${(_f = dd.placeholder) !== null && _f !== void 0 ? _f : '請輸入' + dd.name}"
                                                onchange="${gvc.event((e) => (dd.value = $(e).val()))}"
                                                value="${(_g = dd.value) !== null && _g !== void 0 ? _g : ''}"
                                                ${dd.readonly ? `readonly` : ``}
                                            />
                                            ${dd.needAuth
                                                ? ` <div
                                                          class="btn btn-outline-primary"
                                                          onclick="${gvc.event(() => {
                                                })}"
                                                      >
                                                          <span>驗證</span>
                                                      </div>`
                                                : ``}
                                        </div>`;
                                            break;
                                        case 'text':
                                            html += `
                                            <div class="w-100 input-group ">
                                                <input
                                                    type="text"
                                                    class="form-control w-100"
                                                    placeholder="${(_h = dd.placeholder) !== null && _h !== void 0 ? _h : '請輸入' + dd.name}"
                                                    value="${(_j = dd.value) !== null && _j !== void 0 ? _j : ''}"
                                                    onchange="${gvc.event((e) => {
                                                dd.value = $(e).val();
                                                gvc.notifyDataChange(id), callback(dd);
                                            })}"
                                                    ${dd.readonly ? `readonly` : ``}
                                                />
                                            </div>
                                        `;
                                            break;
                                        case 'date':
                                            let dateID = glitter.getUUID();
                                            html += `
                                            <div class="w-100 input-group " id="${dateID}">
                                                <input
                                                    type="text"
                                                    placeholder="${(_k = dd.placeholder) !== null && _k !== void 0 ? _k : '請輸入' + dd.name}"
                                                    class="form-control"
                                                    data-provide="datepicker"
                                                    data-date-format="yyyy/mm/dd"
                                                    data-date-container="#${dateID}"
                                                    value="${(_l = dd.value) !== null && _l !== void 0 ? _l : ''}"
                                                    onchange="${gvc.event((e) => ((dd.value = $(e).val()), callback(dd)))}"
                                                    ${dd.readonly ? `readonly` : ``}
                                                />
                                            </div>
                                        `;
                                            break;
                                        case 'number':
                                            html += `
                                            <div class="w-100 input-group ">
                                                <input
                                                    type="text"
                                                    class="form-control w-100"
                                                    placeholder="${(_m = dd.placeholder) !== null && _m !== void 0 ? _m : '請輸入' + dd.name}"
                                                    value="${(_o = dd.value) !== null && _o !== void 0 ? _o : ''}"
                                                    onchange="${gvc.event((e) => {
                                                dd.value = glitter.utText.filterNumber($(e).val());
                                                gvc.notifyDataChange(id), callback(dd);
                                            })}"
                                                    oninput="${gvc.event((e) => $(e).val(glitter.utText.filterNumber($(e).val())))}"
                                                    ${dd.readonly ? `readonly` : ``}
                                                />
                                            </div>
                                        `;
                                            break;
                                        case 'word':
                                            html += `
                                            <div class="w-100 input-group ">
                                                <input
                                                    type="text"
                                                    class="form-control w-100"
                                                    placeholder="${(_p = dd.placeholder) !== null && _p !== void 0 ? _p : '請輸入' + dd.name}"
                                                    value="${(_q = dd.value) !== null && _q !== void 0 ? _q : ''}"
                                                    onchange="${gvc.event((e) => {
                                                dd.value = $(e).val().replace(/[\W]/g, '');
                                                gvc.notifyDataChange(id), callback(dd);
                                            })}"
                                                    oninput="${gvc.event((e) => $(e).val($(e).val().replace(/[\W]/g, '')))}"
                                                    ${dd.readonly ? `readonly` : ``}
                                                />
                                            </div>
                                        `;
                                            break;
                                        case 'time':
                                            let pickerID = glitter.getUUID();
                                            html += `
                                            <div class="mb-3 position-relative">
                                                ${gvc.bindView({
                                                bind: pickerID,
                                                view: () => {
                                                    var _a, _b;
                                                    return `
                                                            <div
                                                                id="pickerID${pickerID}"
                                                                type="text"
                                                                class="form-control"
                                                                ${dd.readonly ? `readonly` : ``}
                                                                onclick="${gvc.event(() => {
                                                    })}"
                                                            >
                                                                ${(_a = dd.value) !== null && _a !== void 0 ? _a : `<span style="color: gray">
                                                                    ${(_b = dd.placeholder) !== null && _b !== void 0 ? _b : '請輸入' + dd.name}</span
                                                                >`}
                                                            </div>
                                                        `;
                                                },
                                                divCreate: { class: 'w-100 input-group' },
                                                onCreate: () => { },
                                            })}
                                            </div>
                                        `;
                                            break;
                                        case 'group':
                                            html += `
                                            <div class="w-50 input-group mb-2">
                                                <input
                                                    type="${dd.elem_type ? dd.elem_type : `text`}"
                                                    class="form-control"
                                                    placeholder="${(_r = dd.placeholder) !== null && _r !== void 0 ? _r : '請輸入' + dd.name}"
                                                    onchange="${gvc.event((e) => {
                                                dd.value = $(e).val();
                                                gvc.notifyDataChange(id), callback(dd);
                                            })}"
                                                    value="${(_s = dd.value) !== null && _s !== void 0 ? _s : 0}"
                                                />
                                                <div class="input-group-text">${(_t = dd.unit) !== null && _t !== void 0 ? _t : ''}</div>
                                            </div>
                                        `;
                                            break;
                                        default:
                                            html += `
                                            <div class="w-100 input-group">
                                                <input
                                                    type="${dd.type}"
                                                    class="form-control w-100"
                                                    placeholder="${(_u = dd.placeholder) !== null && _u !== void 0 ? _u : '請輸入' + dd.name}"
                                                    value="${(_v = dd.value) !== null && _v !== void 0 ? _v : ''}"
                                                    onchange="${gvc.event((e) => {
                                                dd.value = $(e).val();
                                                gvc.notifyDataChange(id), callback(dd);
                                            })}"
                                                    ${dd.readonly ? `readonly` : ``}
                                                    ${dd.type == 'password' ? `autocomplete="new-password"` : ``}
                                                />
                                            </div>
                                        `;
                                    }
                                    html += ``;
                                    break;
                                case 'textArea':
                                    html += `<div class="w-100 px-1">
                                    <textarea
                                        class="form-control border rounded"
                                        rows="4"
                                        onchange="${gvc.event((e) => ((dd.value = $(e).val()), callback(dd)))}"
                                        placeholder="${(_w = dd.placeholder) !== null && _w !== void 0 ? _w : ''}"
                                    >${(_x = dd.value) !== null && _x !== void 0 ? _x : ''}</textarea
                                    >
                                </div>`;
                                    break;
                                case 'button':
                                    html += `<button class="btn btn-primary" onclick="${gvc.event(() => dd.click(window))}">
                                    ${dd.placeholder}
                                </button>`;
                                    break;
                                default:
                                    if (glitter.share.formExtra[dd.elem]) {
                                        html += glitter.share.formExtra[dd.elem](dd, window, callback);
                                    }
                                    break;
                            }
                            if (index !== data.length - 1) {
                                html += `<div class="w-100 my-2 bg-light" style="height: 1px;"></div>`;
                            }
                        }
                    });
                    return html;
                },
                divCreate: {},
                onCreate: () => { },
            })}
    </div>`;
        };
    }
}
