import { init } from '../glitterBundle/GVController.js';
init(import.meta.url, (gvc, glitter, gBundle) => {
    glitter.addMtScript([{ src: `https://kit.fontawesome.com/02e2dc09e3.js` }], () => {
    }, () => {
    });
    return {
        onCreateView: () => {
            gvc.addStyle(`.btn-gray {
    display: flex;
    padding: 6px 18px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 10px;
    background: #dddddd;
    cursor: pointer;
    max-height: 40px;
      color:#585858 !important;
}

.btn-gray:hover {
    background: #aeaeae;
    color:#585858 !important;
}`);
            const id = glitter.getUUID();
            const hd = glitter.getUUID();
            const html = String.raw;
            return html `
                <div class="vw-100 vh-100 d-flex align-items-center justify-content-center"
                     style="background-color: rgba(0,0,0,0.5);">
                    <div id="${hd}" style="height:50px;right:0;top:${gvc.glitter.share.top_inset || 0}px;"
                         class="m-2 position-absolute d-flex align-items-center justify-content-center gap-2">
                        <div class="btn btn-gray" href="${gBundle}" onclick="${gvc.event(() => {
                const link = document.createElement('a');
                link.href = gBundle;
                link.click();
            })}">
                            <span class="tx_700" style="">下載圖片</span>
                        </div>
                        ${grayButton('關閉', gvc.event(() => {
                gvc.closeDialog();
            }))}
                    </div>
                    <div id="${id}" style="max-width: 100%;max-height: 100%;">
                        <img style="max-width: 85vw;max-height: 85vh;" src="${gBundle}"/>
                    </div>
                </div>`;
        },
    };
});
function grayButton(text, event, obj) {
    var _a;
    const html = String.raw;
    return html `
        <button class="btn btn-gray" style="" type="button" onclick="${event}">
            <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}" style="color: #393939"></i>
            ${text.length > 0 ? html `<span class="tx_700" style="${(_a = obj === null || obj === void 0 ? void 0 : obj.textStyle) !== null && _a !== void 0 ? _a : ''}">${text}</span>` : ''}
        </button>`;
}
