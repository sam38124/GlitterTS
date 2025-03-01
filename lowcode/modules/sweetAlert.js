'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Funnel } from '../glitterBundle/funnel.js';
import { Editor } from './editor.js';
export class Swal {
    constructor(gvc) {
        const editor = new Editor(gvc);
        const funnel = new Funnel(gvc);
        let sw = window.Swal;
        this.init = (callback) => {
            if (window.Swal) {
                (sw = window.Swal);
                setTimeout(() => {
                    callback();
                }, 100);
                return;
            }
            gvc.glitter.addMtScript([{ src: 'https://cdn.jsdelivr.net/npm/sweetalert2@11.6.5/dist/sweetalert2.all.min.js' }], () => {
                const interval = setInterval(() => {
                    if (window.Swal) {
                        (sw = window.Swal);
                        callback();
                        clearInterval(interval);
                    }
                }, 1000);
            }, () => {
            });
        };
        this.fire = (title, text, icon) => {
            this.init(() => sw.fire(title, text, icon));
        };
        this.nextStep = (title, callback, icon) => {
            this.init(() => {
                sw.fire(title, '', icon ? icon : 'success').then((result) => result.isConfirmed && callback());
            });
        };
        this.notify = (title, text, icon, callback) => {
            this.init(() => {
                sw.fire({
                    title: title,
                    text: text,
                    icon: icon,
                    confirmButtonColor: '#6169d0',
                    confirmButtonText: '確定',
                    allowOutsideClick: false,
                }).then(() => callback());
            });
        };
        this.stoper = () => __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                this.init(() => resolve(sw.isVisible()));
            }).then((status) => (status ? sw.stopTimer() : ``));
        });
        this.isVisible = () => {
            this.init(() => sw.isVisible());
        };
        this.close = () => {
            this.init(() => sw.close());
        };
        this.loading = (text) => {
            return new Promise((resolve, reject) => {
                this.init(() => {
                    const loading = sw.mixin({
                        title: text,
                        allowOutsideClick: false,
                        didOpen: () => sw.showLoading(),
                    });
                    loading.fire();
                    resolve(true);
                });
            });
        };
        this.toast = (data) => {
            this.init(() => {
                const toast = sw.mixin({
                    toast: true,
                    position: data.position || 'bottom',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                    didOpen: (t) => {
                    },
                });
                toast.fire({ icon: data.icon, title: data.title });
            });
        };
        this.isConfirm = (text, icon, callback) => {
            this.init(() => {
                sw.fire({
                    title: `${text}？`,
                    icon: icon,
                    showCancelButton: true,
                    confirmButtonColor: '#6169d0',
                    cancelButtonColor: '#969ca2',
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                }).then((result) => result.isConfirmed && callback());
            });
        };
        this.deleteAlert = (text, callback) => {
            this.init(() => {
                sw.fire({
                    title: `確定要刪除${text}？`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#6169d0',
                    cancelButtonColor: '#969ca2',
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                }).then((result) => result.isConfirmed && callback());
            });
        };
        this.deleteAlertDetail = (text, callback) => {
            this.init(() => {
                sw.fire({
                    title: '刪除提示',
                    text: text,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#6169d0',
                    cancelButtonColor: '#969ca2',
                }).then((result) => result.isConfirmed && callback());
            });
        };
        this.formHTML = (title, formList, validList, formCB, finallyCB, confirmText) => {
            this.init(() => {
                sw.fire({
                    title: title,
                    html: editor.generateForm(formList, window, (res) => formCB(res)),
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonColor: '#6169d0',
                    cancelButtonColor: '#969ca2',
                    confirmButtonText: confirmText ? confirmText : '確定',
                    cancelButtonText: '取消',
                    allowOutsideClick: false,
                    preConfirm: () => {
                        if (Array.isArray(validList)) {
                            validList.reverse().map((v) => {
                                let value = funnel.ensure(formList.find((y) => y.title === v.title)).value;
                                v.fn(value) && sw.showValidationMessage(v.errorMsg);
                            });
                        }
                        else {
                            let isNotValue = formList.find((y) => y.need && !y.disable && funnel.isUNO(y.value));
                            isNotValue && sw.showValidationMessage(validList[isNotValue.title]);
                        }
                    },
                }).then((result) => result.isConfirmed && finallyCB());
            });
        };
        this.printHTML = (title, html, arg) => {
            this.init(() => {
                sw.fire({
                    title: title,
                    html: html,
                    width: (arg === null || arg === void 0 ? void 0 : arg.width) ? arg.width : '32em',
                    allowOutsideClick: (arg === null || arg === void 0 ? void 0 : arg.allowOutsideClick) === true,
                    showCancelButton: false,
                    showConfirmButton: false,
                });
            });
        };
        this.showValid = (text) => {
            this.init(() => sw.showValidationMessage(text));
        };
        this.resetValid = () => {
            this.init(() => sw.resetValidationMessage());
        };
    }
}
