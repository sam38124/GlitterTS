'use strict';
import { Funnel } from '../glitterBundle/funnel.js';
import { GVC } from '../glitterBundle/GVController.js';
import { Editor } from './editor.js';

type icons = 'success' | 'error' | 'warning' | 'info' | 'question';

export class Swal {
    public init: (callback: () => void) => void;
    public fire: (title: string, text: string, icon: icons) => void;
    public nextStep: (title: string, callback: () => void, icon?: icons) => void;
    public notify: (title: string, text: string, icon: string, callback: () => void) => void;
    public stoper: () => Promise<boolean>;
    public isVisible: () => void;
    public close: () => void;
    public loading: (text: string) => void;
    public toast: (data: { icon: icons; title: string }) => void;
    public isConfirm: (text: string, icon: string, callback: () => void) => void;
    public deleteAlertDetail: (text: string, callback: () => void) => void;
    public deleteAlert: (text: string, callback: () => void) => void;
    public formHTML: (
        title: string,
        formList: { title: string; value: any; [k: string]: any }[],
        validList: { [k: string]: any },
        formCB: (resp: any) => void,
        finallyCB: () => void,
        confirmText?: string
    ) => void;
    public printHTML: (title: string, html: string, arg?: { width?: string; allowOutsideClick?: boolean }) => void;
    public showValid: (text: string) => void;
    public resetValid: () => void;

    constructor(gvc: GVC) {
        const editor = new Editor(gvc);
        const funnel = new Funnel(gvc);
        let sw: any;
        this.init = (callback: () => void) => {
            gvc.addMtScript(
                [{ src: 'https://cdn.jsdelivr.net/npm/sweetalert2@11.6.5/dist/sweetalert2.all.min.js' }],
                () => ((sw = (window as any).Swal), callback()),
                () => {}
            );
        };

        this.fire = (title: string, text: string, icon: icons) => {
            this.init(() => sw.fire(title, text, icon));
        };

        this.nextStep = (title: string, callback: () => void, icon?: icons) => {
            this.init(() => {
                sw.fire(title, '', icon ? icon : 'success').then((result: { isConfirmed: boolean }) => result.isConfirmed && callback());
            });
        };

        this.notify = (title: string, text: string, icon: string, callback: () => void) => {
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

        this.stoper = async () => {
            return await new Promise<boolean>((resolve, reject) => {
                this.init(() => resolve(sw.isVisible()));
            }).then((status) => (status ? sw.stopTimer() : ``));
        };

        this.isVisible = () => {
            this.init(() => sw.isVisible());
        };

        this.close = () => {
            this.init(() => sw.close());
        };

        this.loading = (text: string) => {
            this.init(() => {
                const loading = sw.mixin({
                    title: text,
                    allowOutsideClick: false,
                    didOpen: () => sw.showLoading(),
                });
                loading.fire();
            });
        };

        this.toast = (data: { icon: icons; title: string }) => {
            this.init(() => {
                const toast = sw.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (t: any) => {
                        t.addEventListener('mouseenter', sw.stopTimer);
                        t.addEventListener('mouseleave', sw.resumeTimer);
                    },
                });
                toast.fire({ icon: data.icon, title: data.title });
            });
        };

        this.isConfirm = (text: string, icon: string, callback: () => void) => {
            this.init(() => {
                sw.fire({
                    title: `${text}？`,
                    icon: icon,
                    showCancelButton: true,
                    confirmButtonColor: '#6169d0',
                    cancelButtonColor: '#969ca2',
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                }).then((result: any) => result.isConfirmed && callback());
            });
        };

        this.deleteAlert = (text: string, callback: () => void) => {
            this.init(() => {
                sw.fire({
                    title: `確定要刪除${text}？`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#6169d0',
                    cancelButtonColor: '#969ca2',
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                }).then((result: any) => result.isConfirmed && callback());
            });
        };

        this.deleteAlertDetail = (text: string, callback: () => void) => {
            this.init(() => {
                sw.fire({
                    title: '刪除提示',
                    text: text,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#6169d0',
                    cancelButtonColor: '#969ca2',
                }).then((result: any) => result.isConfirmed && callback());
            });
        };

        this.formHTML = (
            title: string,
            formList: { title: string; value: any; [k: string]: any }[],
            validList: { [k: string]: any },
            formCB: (resp: any) => void,
            finallyCB: () => void,
            confirmText?: string
        ) => {
            this.init(() => {
                sw.fire({
                    title: title,
                    html: editor.generateForm(formList, window, (res:any) => formCB(res)),
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonColor: '#6169d0',
                    cancelButtonColor: '#969ca2',
                    confirmButtonText: confirmText ? confirmText : '確定',
                    cancelButtonText: '取消',
                    allowOutsideClick: false,
                    preConfirm: () => {
                        if (Array.isArray(validList)) {
                            validList.reverse().map((v: { title: string; fn: (res: any) => boolean; errorMsg: string }) => {
                                let value = funnel.ensure(formList.find((y: any) => y.title === v.title)).value;
                                v.fn(value) && sw.showValidationMessage(v.errorMsg);
                            });
                        } else {
                            let isNotValue = formList.find((y: any) => y.need && !y.disable && funnel.isUNO(y.value));
                            isNotValue && sw.showValidationMessage(validList[isNotValue.title]);
                        }
                    },
                }).then((result: { isConfirmed: boolean }) => result.isConfirmed && finallyCB());
            });
        };

        this.printHTML = (title: string, html: string, arg?: { width?: string; allowOutsideClick?: boolean }) => {
            this.init(() => {
                sw.fire({
                    title: title,
                    html: html,
                    width: arg?.width ? arg.width : '32em',
                    allowOutsideClick: arg?.allowOutsideClick === true,
                    showCancelButton: false,
                    showConfirmButton: false,
                });
            });
        };

        this.showValid = (text: string) => {
            this.init(() => sw.showValidationMessage(text));
        };

        this.resetValid = () => {
            this.init(() => sw.resetValidationMessage());
        };
    }
}
