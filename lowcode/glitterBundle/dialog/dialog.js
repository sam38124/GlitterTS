import { init } from '../GVController.js';
import { Language } from '../../glitter-base/global/language.js';
init(import.meta.url, (gvc, glitter, gBundle) => {
    const html = String.raw;
    const icons = {
        loading: html ` <div class="mt-2"><div class="spinner-border fs-1"></div></div>`,
        success: html `<i class="fa-regular fa-circle-check mb-1" style="font-size: 4rem;"></i>`,
        error: html `<i class="fa-sharp fa-regular fa-circle-xmark mb-1" style="font-size: 4rem;"></i>`,
        info: html `<i class="fa-regular fa-circle-exclamation mb-1" style="font-size: 4rem;"></i>`,
        question: html `<i class="fa-regular fa-circle-question mb-1" style="font-size: 4rem;"></i>`,
    };
    const createButton = (config, classes = '') => {
        return html `<div class="btn ${classes}" style="font-size: 14px;" onclick="${gvc.event(config.event)}">${config.title}</div>`;
    };
    const createDialogBox = (config) => {
        var _a, _b;
        return html `
        <div class="dialog-box">
            <div class="dialog-content" style="width: ${(_a = config.width) !== null && _a !== void 0 ? _a : 280}px;">
                ${(_b = config.icon) !== null && _b !== void 0 ? _b : ''}
                <div class="mt-3 mb-3 fs-6 text-center w-100" style="white-space: normal;word-break: break-all;">${config.content}</div>
                <div class="d-flex gap-3 justify-content-center">
                    ${config.cancel ? createButton(config.cancel, 'btn-snow text-dark') : ''} ${config.confirm ? createButton(config.confirm, 'btn-black text-white') : ''}
                </div>
            </div>
        </div>
    `;
    };
    gvc.addStyle(`
        .dialog-box {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        }
        .dialog-content {
            background: white;
            padding: 24px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-radius: 0.5rem;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            color: #393939;
            max-width: 90%;
        }
        .btn-black {
            display: flex;
            padding: 8px 14px;
            max-height: 36px;
            justify-content: center;
            align-items: center;
            gap: 8px;
            border: 0;
            border-radius: 10px;
            background: #393939;
            cursor: pointer;
        }
        .btn-black:hover {
            background: #646464 !important;
        }
        .btn-snow {
            display: flex;
            padding: 8px 14px;
            max-height: 36px;
            justify-content: center;
            align-items: center;
            gap: 8px;
            border: 0;
            border-radius: 10px;
            border: 1px solid #ddd;
            background: #fff;
            cursor: pointer;
        }
        .btn-snow:hover {
            background: #d5d5d5;
        }
    `);
    return {
        onCreateView: () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                switch (gBundle.type) {
                    case 'dataLoading':
                        return createDialogBox({
                            icon: icons.loading,
                            content: (_b = (_a = gBundle.obj) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : Language.text('please_wait'),
                        });
                    case 'successMessage':
                        setTimeout(() => gvc.closeDialog(), 1200);
                        return createDialogBox({
                            icon: icons.success,
                            content: (_d = (_c = gBundle.obj) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : Language.text('success'),
                        });
                    case 'errorMessage':
                        return createDialogBox({
                            icon: icons.error,
                            content: (_f = (_e = gBundle.obj) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : Language.text('error'),
                            cancel: {
                                title: Language.text('close'),
                                event: () => {
                                    var _a, _b;
                                    (_b = (_a = gBundle.obj) === null || _a === void 0 ? void 0 : _a.callback) === null || _b === void 0 ? void 0 : _b.call(_a, true);
                                    gvc.closeDialog();
                                },
                            },
                        });
                    case 'infoMessage':
                        return createDialogBox({
                            icon: icons.info,
                            content: (_h = (_g = gBundle.obj) === null || _g === void 0 ? void 0 : _g.text) !== null && _h !== void 0 ? _h : '系統提示',
                            confirm: {
                                title: Language.text('okay'),
                                event: () => gvc.closeDialog(),
                            },
                            width: 420,
                        });
                    case 'checkYesOrNot':
                    case 'warningMessage':
                        return createDialogBox({
                            icon: icons.question,
                            content: (_j = gBundle.title) !== null && _j !== void 0 ? _j : '',
                            confirm: {
                                title: Language.text('okay'),
                                event: () => { var _a; return (_a = gBundle.callback) === null || _a === void 0 ? void 0 : _a.call(gBundle, true); },
                            },
                            cancel: {
                                title: Language.text('cancel'),
                                event: () => { var _a; return (_a = gBundle.callback) === null || _a === void 0 ? void 0 : _a.call(gBundle, false); },
                            },
                            width: 420,
                        });
                    case 'input_text':
                        return createDialogBox({
                            content: (_k = gBundle.title) !== null && _k !== void 0 ? _k : '',
                            confirm: {
                                title: Language.text('confirm'),
                                event: () => { var _a; return (_a = gBundle.callback) === null || _a === void 0 ? void 0 : _a.call(gBundle, true); },
                            },
                            cancel: {
                                title: Language.text('cancel'),
                                event: () => { var _a; return (_a = gBundle.callback) === null || _a === void 0 ? void 0 : _a.call(gBundle, false); },
                            },
                            width: 420,
                        });
                    default:
                        return '';
                }
            }
            catch (error) {
                console.error('Dialog rendering error:', error);
                return html `<div class="dialog-content">發生錯誤，請稍後再試</div>`;
            }
        },
        onCreate: () => { },
    };
});
