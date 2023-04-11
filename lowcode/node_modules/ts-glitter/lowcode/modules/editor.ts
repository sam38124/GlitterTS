'use strict';
import { GVC } from '../glitterBundle/GVController.js';
import { Funnel } from '../glitterBundle/funnel.js';

export class Editor {
    public generateForm: (data: any, window: Window, callback: (res?: any) => void, second?: boolean) => string;
    constructor(gvc: GVC) {
        const funnel=new Funnel(gvc);
        const editor = this;
        const glitter = gvc.glitter;
        const $ = (window as any).$;
        glitter.share.formExtra = glitter.share.formExtra ?? {};
        this.generateForm = (data: any, window: Window, callback: (res?: any) => void, second?: boolean) => {
            let id = glitter.getUUID();

            return /*html*/ `<div id="${id}" class="w-100">
        ${gvc.bindView({
            bind: id,
            view: function () {
                let html = ``;
                data.map((dd: any, index: number) => {
                    if (!dd.disable) {
                        if (!dd.custom) {
                            html += /*html*/ `
                                <div class="w-100 fs-3 d-flex ">
                                    <label class="form-label fw-bold" style="font-size: 16px; font-weight: 400;">
                                        <span class="fw-bold${
                                            dd.need ? `` : ` d-none`
                                        }" style="color: red; font-size: 18px; font-weight: 300;"
                                            >*</span
                                        >
                                        ${(typeof dd.name === 'function' ? dd.name() ?? '' : dd.name ?? '') ?? ''}</label
                                    >
                                    <div class="flex-fill"></div>
                                    ${
                                        dd.preView
                                            ? /*html*/ `
                                              <button
                                                  class="btn btn-warning"
                                                  onclick="${gvc.event(() => {
                                                      let editEdit = glitter.getUUID();
                                                      $('#standard-modal').remove();
                                                      $('body').append(/*html*/ ` <div
                                                          id="standard-modal"
                                                          class="modal fade"
                                                          tabindex="-1"
                                                          role="dialog"
                                                          aria-labelledby="standard-modalLabel"
                                                          aria-hidden="true"
                                                      >
                                                          <div
                                                              class="modal-dialog modal-dialog-centered${glitter.ut.frSize(
                                                                  { sm: `` },
                                                                  ' m-0'
                                                              )}"
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
                                                                              view: () =>
                                                                                  editor.generateForm(
                                                                                      JSON.parse(JSON.stringify(dd.value)),
                                                                                      window,
                                                                                      () => {}
                                                                                  ),
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
                                            : ``
                                    }
                                </div>
                            `;
                        }
                        switch (dd.elem) {
                            case 'selected':
                                html += /*html*/ `<select
                                    class="form-select"
                                    aria-label="Default select example"
                                    style="font-size: 14px;"
                                    onchange="${gvc.event((e) => ((dd.value = $(e).val()), callback(dd)))}"
                                >
                                    ${glitter.print(() => {
                                        let html = '';
                                        dd.option.map((d2: { value: number | string; name: number | string; disable: boolean }) => {
                                            html += /*html*/ `<option
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
                                dd.option.map((d2: { checked: boolean; elem: string; name: number | string; value: any }) => {
                                    let labelID = glitter.getUUID();
                                    html += /*html*/ `
                                        <div class="py-1 d-flex">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                role="${dd.role ?? ''}"
                                                id="${labelID}"
                                                onchange="${gvc.event((e) => {
                                                    dd.type === 'single' &&
                                                        dd.option.map((d3: { checked: boolean }) => (d3.checked = false));
                                                    d2.checked = $(e).get(0).checked;
                                                    gvc.notifyDataChange(id), callback(dd);
                                                })}"
                                                ${d2.checked ? `checked` : ``}
                                            />
                                            ${glitter.print(() => {
                                                let h = '';
                                                if (d2.elem && d2.checked) {
                                                    h += /*html*/ `<div style="width: calc(100% - 30px);">
                                                        ${glitter.print(() => {
                                                            if (d2.elem === 'form') {
                                                                return /*html*/ ` <label
                                                                        class="ms-1"
                                                                        for="${labelID}"
                                                                        style="font-size: 16px;font-weight: 400;"
                                                                    >
                                                                        ${d2.name}
                                                                    </label>
                                                                    ${editor.generateForm(d2.value, window, callback, true)}`;
                                                            } else {
                                                                return /*html*/ `<div class="ms-1">
                                                                    ${editor.generateForm([d2], window, callback, true)}
                                                                </div>`;
                                                            }
                                                        })}
                                                    </div>`;
                                                } else {
                                                    h += /*html*/ ` <label
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
                                html += /*html*/ `<div class="my-2 px-3">${editor.generateForm(dd.value, window, callback, true)}</div>`;
                                break;
                            case 'formEdit':
                                html += glitter.share.formEdit.formEditor(dd.value, window, dd.formSetting, false);
                                break;
                            case 'input':
                                switch (dd.type) {
                                    case 'switch':
                                        const ran = funnel.randomString(4);
                                        html += /*html*/ `<div class="m-1 text-start">
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
                                        html += /*html*/ `<div class="input-group input-group-merge">
                                            <input
                                                class="form-control"
                                                type="email"
                                                placeholder="${dd.placeholder ?? '請輸入' + dd.name}"
                                                onchange="${gvc.event((e) => (dd.value = $(e).val()))}"
                                                value="${dd.value ?? ''}"
                                                ${dd.readonly ? `readonly` : ``}
                                            />
                                            ${
                                                dd.needAuth
                                                    ? /*html*/ `<div
                                                      class="btn btn-outline-primary"
                                                      onclick="${gvc.event(() => {
                                                   
                                                      })}"
                                                  >
                                                      <span>驗證</span>
                                                  </div>`
                                                    : ``
                                            }
                                        </div>`;
                                        break;
                                    case 'phone':
                                        html += /*html*/ ` <div class="input-group input-group-merge">
                                            <input
                                                class="form-control"
                                                type="email"
                                                placeholder="${dd.placeholder ?? '請輸入' + dd.name}"
                                                onchange="${gvc.event((e) => (dd.value = $(e).val()))}"
                                                value="${dd.value ?? ''}"
                                                ${dd.readonly ? `readonly` : ``}
                                            />
                                            ${
                                                dd.needAuth
                                                    ? /*html*/ ` <div
                                                          class="btn btn-outline-primary"
                                                          onclick="${gvc.event(() => {
                                                       
                                                          })}"
                                                      >
                                                          <span>驗證</span>
                                                      </div>`
                                                    : ``
                                            }
                                        </div>`;
                                        break;
                                    case 'text':
                                        html += /*html*/ `
                                            <div class="w-100 input-group ">
                                                <input
                                                    type="text"
                                                    class="form-control w-100"
                                                    placeholder="${dd.placeholder ?? '請輸入' + dd.name}"
                                                    value="${dd.value ?? ''}"
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
                                        html += /*html*/ `
                                            <div class="w-100 input-group " id="${dateID}">
                                                <input
                                                    type="text"
                                                    placeholder="${dd.placeholder ?? '請輸入' + dd.name}"
                                                    class="form-control"
                                                    data-provide="datepicker"
                                                    data-date-format="yyyy/mm/dd"
                                                    data-date-container="#${dateID}"
                                                    value="${dd.value ?? ''}"
                                                    onchange="${gvc.event((e) => ((dd.value = $(e).val()), callback(dd)))}"
                                                    ${dd.readonly ? `readonly` : ``}
                                                />
                                            </div>
                                        `;
                                        break;
                                    case 'number':
                                        html += /*html*/ `
                                            <div class="w-100 input-group ">
                                                <input
                                                    type="text"
                                                    class="form-control w-100"
                                                    placeholder="${dd.placeholder ?? '請輸入' + dd.name}"
                                                    value="${dd.value ?? ''}"
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
                                        html += /*html*/ `
                                            <div class="w-100 input-group ">
                                                <input
                                                    type="text"
                                                    class="form-control w-100"
                                                    placeholder="${dd.placeholder ?? '請輸入' + dd.name}"
                                                    value="${dd.value ?? ''}"
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

                                        html += /*html*/ `
                                            <div class="mb-3 position-relative">
                                                ${gvc.bindView({
                                                    bind: pickerID,
                                                    view: () => {
                                                        return /*html*/ `
                                                            <div
                                                                id="pickerID${pickerID}"
                                                                type="text"
                                                                class="form-control"
                                                                ${dd.readonly ? `readonly` : ``}
                                                                onclick="${gvc.event(() => {
                                                                })}"
                                                            >
                                                                ${
                                                                    dd.value ??
                                                                    /*html*/ `<span style="color: gray">
                                                                    ${dd.placeholder ?? '請輸入' + dd.name}</span
                                                                >`
                                                                }
                                                            </div>
                                                        `;
                                                    },
                                                    divCreate: { class: 'w-100 input-group' },
                                                    onCreate: () => {},
                                                })}
                                            </div>
                                        `;
                                        break;
                                    case 'group':
                                        html += /*html*/ `
                                            <div class="w-50 input-group mb-2">
                                                <input
                                                    type="${dd.elem_type ? dd.elem_type : `text`}"
                                                    class="form-control"
                                                    placeholder="${dd.placeholder ?? '請輸入' + dd.name}"
                                                    onchange="${gvc.event((e) => {
                                                        dd.value = $(e).val();
                                                        gvc.notifyDataChange(id), callback(dd);
                                                    })}"
                                                    value="${dd.value ?? 0}"
                                                />
                                                <div class="input-group-text">${dd.unit ?? ''}</div>
                                            </div>
                                        `;
                                        break;
                                    default:
                                        html += /*html*/ `
                                            <div class="w-100 input-group">
                                                <input
                                                    type="${dd.type}"
                                                    class="form-control w-100"
                                                    placeholder="${dd.placeholder ?? '請輸入' + dd.name}"
                                                    value="${dd.value ?? ''}"
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
                                html += /*html*/ `<div class="w-100 px-1">
                                    <textarea
                                        class="form-control border rounded"
                                        rows="4"
                                        onchange="${gvc.event((e) => ((dd.value = $(e).val()), callback(dd)))}"
                                        placeholder="${dd.placeholder ?? ''}"
                                    >${dd.value ?? ''}</textarea
                                    >
                                </div>`;
                                break;
                            case 'button':
                                html += /*html*/ `<button class="btn btn-primary" onclick="${gvc.event(() => dd.click(window))}">
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
                            html += /*html*/ `<div class="w-100 my-2 bg-light" style="height: 1px;"></div>`;
                        }
                    }
                });
                return html;
            },
            divCreate: {},
            onCreate: () => {},
        })}
    </div>`;
        };
    }
}
