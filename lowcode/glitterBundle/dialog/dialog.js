import { init } from '../GVController.js';
init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            var _a, _b, _c, _d, _e;
            const html = String.raw;
            gvc.addStyle(`
                .dialog-box {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                }

                .dialog-content {
                    width: 200px;
                    background: white;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    border-radius: 0.5rem;
                    margin: auto;
                    box-shadow: 0 0.275rem 1.25rem rgba(19, 16, 34, 0.05), 0 0.25rem 0.5625rem rgba(19, 16, 34, 0.03);
                    color: #393939;
                    letter-spacing: 1px;
                }

                .dialog-absolute {
                    width: 100%;
                    border-top: 1px solid #e2e5f1;
                    position: absolute;
                    left: 0px;
                    bottom: 0px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .hover-cancel {
                    background-color: #fff;
                    border-radius: 0 0 0 0.5rem;
                }

                .hover-cancel:hover {
                    background-color: #e6e6e6;
                }

                .hover-save {
                    background-color: #393939;
                    border-radius: 0 0 0.5rem;
                }

                .hover-save:hover {
                    background-color: #646464;
                }
            `);
            switch (gBundle.type) {
                case 'dataLoading':
                    return html ` <div class="dialog-box">
                        <div class="dialog-content">
                            <div class="spinner-border fs-1"></div>
                            <div class="mt-3 fs-6 fw-500">${(_a = gBundle.obj.text) !== null && _a !== void 0 ? _a : '請稍候...'}</div>
                        </div>
                    </div>`;
                case 'infoMessage':
                    return html `
                        <div class="dialog-box">
                            <div class="dialog-content position-relative pb-5">
                                <i class="fa-sharp fa-solid fa-circle-info fs-1"></i>
                                <div class="my-3 fs-6 fw-500" style="white-space: normal;">${(_b = gBundle.obj.text) !== null && _b !== void 0 ? _b : '系統提示訊息'}</div>
                                <div class="dialog-absolute" onclick="${gvc.event(() => gvc.closeDialog())}">
                                    <div class="fs-6 fw-500">確認</div>
                                </div>
                            </div>
                        </div>
                    `;
                case 'errorMessage':
                    return html `
                        <div class="dialog-box">
                            <div class="dialog-content position-relative pb-5">
                                <i class="fa-solid fa-triangle-exclamation fs-1"></i>
                                <div class="my-3 fs-6 fw-500" style="white-space: normal;">${(_c = gBundle.obj.text) !== null && _c !== void 0 ? _c : '發生錯誤'}</div>
                                <div class="dialog-absolute" onclick="${gvc.event(() => gvc.closeDialog())}">
                                    <div class="fs-6 fw-500">關閉</div>
                                </div>
                            </div>
                        </div>
                    `;
                case 'successMessage':
                    setTimeout(() => gvc.closeDialog(), 1200);
                    return html `
                        <div
                            class="dialog-box"
                            onclick="${gvc.event(() => {
                        gvc.closeDialog();
                    })}"
                        >
                            <div class="dialog-content">
                                <i class="fa-regular fa-circle-check fs-1"></i>
                                <div class="mt-3 fs-6 fw-500">${(_d = gBundle.obj.text) !== null && _d !== void 0 ? _d : '成功'}</div>
                            </div>
                        </div>
                    `;
                case 'checkYesOrNot':
                    return html `
                        <div class="dialog-box">
                            <div class="dialog-content position-relative pb-5" style="width: 270px;">
                                <i class="${(_e = gBundle.icon) !== null && _e !== void 0 ? _e : 'fa-regular fa-circle-question '} fs-1"></i>
                                <div class="my-3 fs-6 fw-500 text-center" style="white-space: normal;">${gBundle.title}</div>
                                <div class="dialog-absolute">
                                    <div
                                        class="w-100 h-100 text-center pt-2 hover-cancel"
                                        onclick="${gvc.event(() => {
                        gBundle.callback(false);
                    })}"
                                    >
                                        <span class="fw-500 fs-6">取消</span>
                                    </div>
                                    <div
                                        class="w-100 h-100 text-center pt-2 hover-save"
                                        onclick="${gvc.event(() => {
                        gBundle.callback(true);
                    })}"
                                    >
                                        <span class="fw-500 fs-6 text-white">確認</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                case 'warningMessage':
                    return html `
                        <div class="dialog-box">
                            <div class="dialog-content position-relative pb-5" style="width: 494px;padding:36px 64px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 76 75" fill="none">
                                    <g clip-path="url(#clip0_11947_110999)">
                                        <path d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z" fill="#393939"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_11947_110999">
                                            <rect width="75" height="75" fill="white" transform="translate(0.5)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <div class="my-3 fs-6 text-center" style="white-space: normal;font-weight: 400;">${gBundle.title}</div>
                                <div class="d-flex " style="gap:14px;font-weight: 700;font-size: 16px;">
                                    <div style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;color: #393939;cursor: pointer;" onclick="${gvc.event(() => {
                        gBundle.callback(false);
                    })}">取消</div>
                                    <div style="padding: 6px 18px;border-radius: 10px;background: #393939;color: #FFF;cursor: pointer;" onclick="${gvc.event(() => {
                        gBundle.callback(true);
                    })}">確定</div>
                                </div>
                            </div>
                        </div>
                    `;
                default:
                    return '';
            }
        },
        onCreate: () => { },
    };
});
