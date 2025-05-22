var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const html = String.raw;
const css = String.raw;
export class FirstBanner {
    static main(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const gvc = obj.gvc;
            const id = gvc.glitter.getUUID();
            gvc.glitter.closeDiaLog('first-banner');
            gvc.glitter.addStyleLink(['https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css']);
            gvc.glitter.addMtScript([
                {
                    src: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
                }
            ], () => {
            }, () => {
            });
            if (gvc.glitter.getUrlParameter('page') !== 'index') {
                return;
            }
            gvc.addStyle(`
            .mySwiper_${id} .swiper-pagination .swiper-pagination-bullet{
                width:30px!important;
                height: 5px;
                border-radius: 1px;
                background: white !important;
            }
            .swiper-pagination-bullet,.swiper-pagination-bullet-active{
                background: #393939!important;
            }
        `);
            const formData = obj.widget.formData;
            if (formData.list && formData.list.length) {
                obj.gvc.glitter.innerDialog((gvc) => {
                    return gvc.bindView(() => {
                        return {
                            bind: id,
                            view: () => {
                                return html `
                            <div class="swiper mySwiper_${id}" style="width:520px;max-width:100vw;height:auto !important;">
                                <div class="swiper-wrapper">
                                    ${formData.list.map((dd) => {
                                    return html `
                                                    <div class="swiper-slide pb-4 d-flex align-items-center justify-content-center position-relative"
                                                         style="background: none;
overflow: hidden;;
">
                                                        <img  src="${dd.img || 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'}" style="width:520px;max-width:calc(100vw - 40px);max-height: 100vh;cursor: pointer;
border-radius: 25px;
" onclick="${gvc.event(() => {
                                        gvc.glitter.href = dd.link;
                                        gvc.closeDialog();
                                    })}" >
                                                        <div class="position-absolute d-flex align-items-center justify-content-center"
                                                             style="top:0px;right: 0px;width:50px;height: 50px;
background: rgba(0,0,0,0.5);border-top-right-radius: 25px;border-bottom-left-radius: 10px;cursor: pointer;" onclick="${(() => {
                                        if (gvc.glitter.htmlGenerate.isEditMode()) {
                                            return gvc.editorEvent(() => {
                                                gvc.closeDialog();
                                            });
                                        }
                                        else {
                                            return gvc.event(() => {
                                                gvc.closeDialog();
                                            });
                                        }
                                    })()}">
                                                            <i class="fa-regular fa-circle-xmark text-white fs-5"
                                                               ></i>
                                                        </div>
                                                    </div>
                                                `;
                                }).join('')}
                                </div>
                                <div class="swiper-pagination swiper-pagination-${id}"></div>
                            </div>`;
                            },
                            divCreate: {
                                class: `vw-100 vh-100 position-fixed ${id} d-flex align-items-center justify-content-center`,
                                style: css `z-index: 999999;
                            background: rgba(0, 0, 0, 0.5);`
                            },
                            onCreate: () => {
                                const interval = setInterval(() => {
                                    if (gvc.glitter.window.Swiper) {
                                        const swiper = new gvc.glitter.window.Swiper(`.mySwiper_${id}`, {
                                            loop: true,
                                            pagination: {
                                                el: `.swiper-pagination-${id}`,
                                                clickable: true,
                                            },
                                            on: {
                                                slideChange: function () {
                                                },
                                            },
                                        });
                                        clearTimeout(interval);
                                    }
                                }, 100);
                            }
                        };
                    });
                }, 'first-banner', {});
            }
            return ``;
        });
    }
}
window.glitter.setModule(import.meta.url, FirstBanner);
