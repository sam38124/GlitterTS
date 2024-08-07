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
import { Funnel } from '../funnel.js';
export class Swal {
    constructor(gvc) {
        const funnel = new Funnel(gvc);
        let sw;
        this.init = (callback) => {
            gvc.addMtScript([{ src: 'https://cdn.jsdelivr.net/npm/sweetalert2@11.6.5/dist/sweetalert2.all.min.js' }], () => ((sw = window.Swal), callback()), () => { });
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
            this.init(() => {
                const loading = sw.mixin({
                    title: text,
                    allowOutsideClick: false,
                    didOpen: () => sw.showLoading(),
                });
                loading.fire();
            });
        };
        this.toast = (data) => {
            this.init(() => {
                const toast = sw.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (t) => {
                        t.addEventListener('mouseenter', sw.stopTimer);
                        t.addEventListener('mouseleave', sw.resumeTimer);
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
