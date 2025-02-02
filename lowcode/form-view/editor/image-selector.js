var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from "../../glitter-base/route/user.js";
import { imageLibrary } from "../../modules/image-library.js";
import { BgWidget } from "../../backend-manager/bg-widget.js";
export class ImageSelector {
    static main(cf) {
        const widget = cf.widget;
        const gvc = cf.gvc;
        const id = gvc.glitter.getUUID();
        const html = String.raw;
        return gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    if (typeof widget.bundle.form_data[widget.bundle.form_key] === 'object') {
                        widget.bundle.form_data[widget.bundle.form_key] = widget.bundle.form_data[widget.bundle.form_key].value;
                    }
                    const src = widget.bundle.form_data[widget.bundle.form_key];
                    function selectImage() {
                        imageLibrary.selectImageLibrary(gvc, (urlArray) => {
                            widget.bundle.form_data[widget.bundle.form_key] = urlArray[0].data;
                            widget.bundle.refresh && widget.bundle.refresh();
                            gvc.notifyDataChange(id);
                        }, html ` <div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">圖片庫</div>`, { mul: false });
                    }
                    return html `
                        <div class="fw-normal mt-2 fs-6 d-flex align-items-center" style="gap:8px;">${widget.bundle.form_title}
                            <button
                                    class="btn-size-sm btn-gray "
                                    style=""
                                    type="button"
                                    onclick="${gvc.event(() => {
                        selectImage();
                    })}"
                            >
                                <span class="tx_700" style="">替換</span>
                            </button>
                        </div>
                        <div
                                class="d-flex align-items-center justify-content-center rounded-3 shadow mt-2"

                                style="width:145px;height:145px;cursor:pointer;background-color: lightgrey;
background-image: url('${src || BgWidget.noImageURL}');background-size: cover;background-repeat: no-repeat;background-position: center;
"
                        >
                            <div
                                    class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image position-relative"
                                    style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;"
                            >
                               ${(src && (src !== BgWidget.noImageURL)) ? ` <button
                                        class="btn-size-sm btn-gray position-absolute"
                                        style="top:5px;right:5px;"
                                        type="button"
                                        onclick="${gvc.event(() => {
                        window.glitter.getModule(gvc.glitter.root_path + `backend-manager/bg-widget.js`, (BgWidget) => __awaiter(this, void 0, void 0, function* () {
                            const tag = gvc.glitter.generateCheckSum(src, 9);
                            let alt = (yield ApiUser.getPublicConfig(`alt_` + tag, 'manager')).response.value || { alt: '' };
                            function set_alt() {
                                return __awaiter(this, void 0, void 0, function* () {
                                    ApiUser.setPublicConfig({
                                        key: `alt_` + tag,
                                        value: alt,
                                        user_id: 'manager',
                                    });
                                });
                            }
                            BgWidget.settingDialog({
                                gvc: gvc,
                                title: '設定圖片描述',
                                innerHTML: (gvc) => {
                                    return `<div>${BgWidget.textArea({
                                        gvc: gvc,
                                        title: `ALT描述`,
                                        default: alt.alt,
                                        placeHolder: `請輸入ALT描述`,
                                        callback: (text) => {
                                            alt.alt = text;
                                        },
                                    })}</div>`;
                                },
                                footer_html: (gvc) => {
                                    let array = [
                                        BgWidget.cancel(gvc.event(() => {
                                            gvc.closeDialog();
                                        })),
                                        BgWidget.save(gvc.event(() => {
                                            set_alt();
                                            gvc.closeDialog();
                                        })),
                                    ];
                                    return array.join('');
                                },
                            });
                        }));
                    })}"
                                >
                                    <span class="tx_700" style="">ALT</span>
                                </button>
                                <i
                                        class="fa-regular fa-eye"
                                        onclick="${gvc.event(() => {
                        window.parent.glitter.openDiaLog(new URL('../../dialog/image-preview.js', import.meta.url).href, 'preview', src);
                    })}"
                                ></i>
                                <i
                                        class="fa-regular fa-trash"
                                        onclick="${gvc.event(() => {
                        widget.bundle.form_data[widget.bundle.form_key] = BgWidget.noImageURL;
                        widget.bundle.refresh && widget.bundle.refresh();
                        gvc.notifyDataChange(id);
                    })}"
                                ></i>` : `
                                <button
                                        class="btn-size-sm btn-gray "
                                        style=""
                                        type="button"
                                        onclick="${gvc.event(() => {
                        selectImage();
                    })}"
                                >
                                    <span class="tx_700" style="">選擇圖片</span>
                                </button>
                                `}
                            </div>
                        </div>`;
                }
            };
        });
    }
}
window.glitter.setModule(import.meta.url, ImageSelector);
