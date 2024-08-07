import { init } from '../glitterBundle/GVController.js';

init(import.meta.url, (gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const html = String.raw;
            return html`
                <div class="d-flex flex-column align-items-center justify-content-center vh-100 vw-100">
                    <iframe src="https://embed.lottiefiles.com/animation/99312" style="width:100vw;height:100vw;"></iframe>
                    <h3>手機版編輯器加速開發中...</h3>
                    <button
                        class="btn btn-danger"
                        onclick="${gvc.event(() => {
                            location.href = new URL('./', location.href).href;
                        })}"
                    >
                        返回首頁
                    </button>
                </div>
            `;
        },
    };
});
