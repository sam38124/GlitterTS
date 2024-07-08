import { ShareDialog } from './ShareDialog.js';
import { init } from '../GVController.js';
init(import.meta.url, (gvc, glitter, gBundle) => {
    const dialog = new ShareDialog(glitter);
    return {
        onCreateView: () => {
            var _a, _b, _c;
            const html = String.raw;
            switch (gBundle.type) {
                case 'dataLoading':
                    return html `
                        <div class="vw-100 vh-100 d-flex align-items-center justify-content-center"
                             style="background-color: rgba(0,0,0,0.5);z-index: 10000;">
                            <div class=" m-auto rounded-3 shadow"
                                 style="width: 200px;background: white;padding: 24px;display: flex;align-items: center;justify-content: center;flex-direction: column;  ">
                                <div class=" spinner-border" style=" font-size: 50px;color: #393939;  "></div>
                                <div class=" mt-3 fs-6 fw-500" style=" color: #393939;  ">
                                    ${(_a = gBundle.obj.text) !== null && _a !== void 0 ? _a : '請稍候...'}
                                </div>
                            </div>
                        </div>`;
                case 'errorMessage':
                    return html `
                        <div class="vw-100 vh-100 d-flex align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.5);z-index: 10000;">
                            <div class=" m-auto rounded-3 shadow"
                                 style="     width: 200px;background: white;padding: 24px;display: flex;align-items: center;justify-content: center;flex-direction: column;position: relative;padding-bottom: 50px;  ">
                                <i class=" fa-solid fa-triangle-exclamation" style=" font-size: 50px;color: #393939;  "
                                   aria-hidden="true"></i>
                                <div class=" mt-3 fs-6 fw-500" style="     color: #393939;letter-spacing: 1px;  ">
                                    ${(_b = gBundle.obj.text) !== null && _b !== void 0 ? _b : "錯誤!"}
                                </div>
                                <div class=" w-100 border-top"
                                     style="     position: absolute;    left: 0px;    bottom: 0px;height: 40px;display: flex;align-items: center;justify-content: center;cursor: pointer;  ">
                                    <div class=" fw-500" style="     color: #393939;font-size: 15px;  " onclick=" gvc.event(() => {
                            glitter.closeDiaLog(gvc.parameter.pageConfig?.tag)
                        })">關閉
                                    </div>
                                </div>
                            </div>
                        </div>
                     `;
                case 'successMessage':
                    setTimeout(() => {
                        gvc.closeDialog();
                    }, 1000);
                    return `
<div class="vw-100 vh-100 position-fixed top-0 left-0 d-flex align-items-center justify-content-center"  style="background-color: rgba(0,0,0,0.5);z-index: 10000;">
<div class=" m-auto rounded-3 shadow" style="     width: 200px;background: white;padding: 24px;display: flex;align-items: center;justify-content: center;flex-direction: column;  "  ><i class=" fa-regular fa-circle-check" style="     font-size: 50px;color: #393939;  "   aria-hidden="true"></i><div class=" mt-3 fs-6 fw-500" style="     color: #393939;  "  >${(_c = gBundle.obj.text) !== null && _c !== void 0 ? _c : "成功!"}</div></div>
</div>
`;
                case 'checkYesOrNot':
                    return `
<div class="vw-100 vh-100 position-fixed top-0 left-0 d-flex align-items-center justify-content-center"  style="background-color: rgba(0,0,0,0.5);z-index: 10000;">
<div style="width: 250px;background-color: white;border-radius: 5px;display: flex;flex-direction: column;align-items: center;">
        <h3 style="height:40px;font-size:20px;color: black;margin-top: 5px;margin-bottom: 5px;border-bottom: whitesmoke solid 1px;width: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;">再次確認</h3>
<h3 class="text-danger fw-bold my-2 mx-2" style="font-size: 16px;">${gBundle.title}</h3>
<div class="mb-2 border-top pt-2 mt-2" style="display: flex;width: 100%;justify-content: space-around;">
<div style="height:35px;border-radius: 5px;border:1px solid gray;color: black;width: calc(50% - 15px);display: flex;align-items: center;
justify-content: center;cursor: pointer;" onclick="${gvc.event(() => {
                        gBundle.callback(false);
                    })}">取消</div>
<div style="height:35px;border-radius: 5px;background-color: dodgerblue;color: white;width: calc(50% - 15px);display: flex;align-items: center;
justify-content: center;cursor: pointer;" onclick="${gvc.event(() => {
                        gBundle.callback(true);
                    })}">確定</div>
</div>
</div>
</div>
`;
                default:
                    return "";
            }
        },
        onCreate: () => {
        }
    };
});
