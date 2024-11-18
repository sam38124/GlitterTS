import { NormalPageEditor } from './normal-page-editor.js';
import { ApiPageConfig } from '../api/pageConfig.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { AddComponent } from './add-component.js';
export class SearchIdea {
    static main(obg) {
        const gvc = obg.gvc;
        gvc.glitter.share.add_from_idea = (cf) => {
            AddComponent.addWidget(gvc, cf);
            NormalPageEditor.toggle({ visible: false });
        };
        const vm = {
            select: obg.def || '',
            left_id: gvc.glitter.getUUID(),
            right_id: gvc.glitter.getUUID(),
        };
        let data = undefined;
        const html = String.raw;
        return `<div class="w-100 d-flex">
<div class="d-flex flex-column border-end" style="width:200px;">
<div class="bgf6 p-3 w-100 border-bottom">${BgWidget.title((obg.type === 'idea') ? '選擇偏好模板' : '模板預覽', 'font-size:16px;')}</div>
${gvc.bindView(() => {
            ApiPageConfig.getTemplateList().then((res) => {
                data = res;
                data.response.result.reverse();
                vm.select = vm.select || data.response.result[0].appName;
                gvc.notifyDataChange([vm.left_id, vm.right_id]);
            });
            return {
                bind: vm.left_id,
                view: () => {
                    if (data) {
                        return html `
                            <div class="w-100" style=" overflow-y: auto;">
                                <div class="d-flex flex-column ">
                                    ${data.response.result
                            .map((dd, index) => {
                            var _a;
                            return html `
                                                    <div class="rounded-3">
                                                        <div
                                                                class="d-flex flex-column justify-content-center w-100 "
                                                                style="gap:5px;cursor:pointer;${vm.select === dd.appName
                                ? `overflow:hidden;background: #FFB400;border: 1px solid #FF6C02;padding:10px;border-radius: 5px;`
                                : ``}"
                                                        >
                                                            <div
                                                                    class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                                                    style="padding-bottom: 133%;"
                                                                    onclick="${gvc.event(() => {
                                vm.select = dd.appName;
                                gvc.notifyDataChange([vm.left_id, vm.right_id]);
                            })}"
                                                            >
                                                                <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                     style="overflow: hidden;">
                                                                    <img
                                                                            class="w-100 "
                                                                            src="${(_a = dd.template_config.image[0]) !== null && _a !== void 0 ? _a : 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"
                                                                    />
                                                                </div>

                                                                <div
                                                                        class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                                                        style="background: rgba(0,0,0,0.5);gap:5px;"
                                                                >
                                                                    <button class="btn btn-secondary d-flex align-items-center "
                                                                            style="height: 28px;width: 75px;gap:5px;">選擇
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div class="mb-0 d-flex justify-content-center align-items-center fw-bold" style="font-size:15px;" >
                                                                ${dd.template_config.name}</div>
                                                        </div>
                                                    </div>
                                                `;
                        })
                            .join(`<div class="my-2"></div>`)}
                                </div>
                            </div>
                        `;
                    }
                    else {
                        return html `
                            <div class="w-100 p-3 d-flex align-items-center justify-content-center flex-column"
                                 style="gap: 10px;">
                                <div class="spinner-border fs-5"></div>
                                <div class="fs-6 fw-500">載入中...</div>
                            </div>`;
                    }
                },
                divCreate: {
                    style: 'height: calc(100vh - 125px) !important;overflow-y:auto;',
                    class: `p-2`,
                },
            };
        })}
</div>
<div class="" style="${document.body.clientWidth < 768 ? `width: calc(100%)` : `width: calc(100% - 200px)`};">
${(() => {
            if (obg.type === 'idea') {
                return `<div class="bgf6 p-3 w-100 border-bottom">${BgWidget.title('點擊喜愛的區塊進行複製', 'font-size:16px;')}</div>`;
            }
            else {
                return `<div class="bgf6 px-3 align-items-center w-100 border-bottom d-flex" style="height:53.8px;">
<div class="flex-fill"></div>
${BgWidget.save(gvc.event(() => {
                    obg.selectCallback && obg.selectCallback(data.response.result.find((dd) => {
                        return dd.appName === vm.select;
                    }));
                    NormalPageEditor.toggle({ visible: false });
                }), '確認套用')}
</div>
`;
            }
        })()}

${gvc.bindView(() => {
            return {
                bind: vm.right_id,
                view: () => {
                    if (!vm.select) {
                        return `<div class="w-100 p-3 d-flex align-items-center justify-content-center flex-column"
                                 style="gap: 10px;">
                                <div class="spinner-border fs-5"></div>
                                <div class="fs-6 fw-500">載入中...</div>
                            </div>`;
                    }
                    return [
                        `<iframe class="" style="height: calc(2.5 * (100vh - 125px)) !important;
width: calc(250%);
transform: scale(0.4) translateX(-75%) translateY(-75%);
    position: absolute;
    left: 0;
" src="${(() => {
                            const url = new URL((obg.type === 'idea') ? `${gvc.glitter.root_path}index?appName=${vm.select}&select_widget=true&type=find_idea` : `${gvc.glitter.root_path}index?appName=${vm.select}&select_widget=false&type=find_idea`);
                            return url.href;
                        })()}" ></iframe>`,
                    ].join('');
                },
                divCreate: {
                    style: `position:relative;height:calc(100vh - 125px) !important;overflow-y:auto;`,
                    class: `w-100`,
                },
            };
        })}
</div>

</div>`;
    }
    static open(gvc) {
        NormalPageEditor.toggle({
            visible: true,
            title: `找靈感`,
            view: SearchIdea.main({
                gvc: gvc,
                type: 'idea'
            }),
            width: document.body.clientWidth < 992 ? document.body.clientWidth : 800,
        });
    }
    static findTemplate(gvc, def, callback) {
        NormalPageEditor.toggle({
            visible: true,
            title: `模板預覽`,
            view: SearchIdea.main({
                gvc: gvc,
                type: 'template',
                def: def,
                selectCallback: callback
            }),
            width: document.body.clientWidth < 992 ? document.body.clientWidth : 800,
        });
    }
}
window.glitter.setModule(import.meta.url, SearchIdea);
