import { init } from '../GVController.js';

init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
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
                    return html` <div class="dialog-box">
                        <div class="dialog-content">
                            <div class="spinner-border fs-1"></div>
                            <div class="mt-3 fs-6 fw-500">${gBundle.obj.text ?? '請稍候...'}</div>
                        </div>
                    </div>`;
                case 'errorMessage':
                    return html`
                        <div class="dialog-box">
                            <div class="dialog-content position-relative pb-5">
                                <i class="fa-solid fa-triangle-exclamation fs-1"></i>
                                <div class="my-3 fs-6 fw-500">${gBundle.obj.text ?? '發生錯誤'}</div>
                                <div class="dialog-absolute" onclick="${gvc.event(() => gvc.closeDialog())}">
                                    <div class="fs-6 fw-500">關閉</div>
                                </div>
                            </div>
                        </div>
                    `;
                case 'successMessage':
                    setTimeout(() => gvc.closeDialog(), 1200);
                    return html`
                        <div
                            class="dialog-box"
                            onclick="${gvc.event(() => {
                                gvc.closeDialog();
                            })}"
                        >
                            <div class="dialog-content">
                                <i class="fa-regular fa-circle-check fs-1"></i>
                                <div class="mt-3 fs-6 fw-500">${gBundle.obj.text ?? '成功'}</div>
                            </div>
                        </div>
                    `;
                case 'checkYesOrNot':
                    return html`
                        <div class="dialog-box">
                            <div class="dialog-content position-relative pb-5" style="width: 270px;">
                                <i class="fa-regular fa-circle-question fs-1"></i>
                                <div class="my-3 fs-6 fw-500 text-center">${gBundle.title}</div>
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
                default:
                    return '';
            }
        },
        onCreate: () => {},
    };
});
