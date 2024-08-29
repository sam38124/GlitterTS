import { NormalPageEditor } from "./normal-page-editor.js";
import { ApiPageConfig } from "../api/pageConfig.js";
import { BgWidget } from "../backend-manager/bg-widget.js";
import { AddComponent } from "./add-component.js";
export class SearchIdea {
    static main(gvc) {
        gvc.glitter.share.add_from_idea = (cf) => {
            AddComponent.addWidget(gvc, cf);
            NormalPageEditor.toggle({ visible: false });
        };
        const vm = {
            select: '',
            left_id: gvc.glitter.getUUID(),
            right_id: gvc.glitter.getUUID()
        };
        const html = String.raw;
        return `<div class="w-100 d-flex">
<div class="d-flex flex-column border-end" style="width:200px;">
<div class="bgf6 p-3 w-100 border-bottom">${BgWidget.title('選擇偏好模板', 'font-size:16px;')}</div>
${gvc.bindView(() => {
            let data = undefined;
            ApiPageConfig.getTemplateList().then((res) => {
                data = res;
                data.response.result.reverse();
                vm.select = data.response.result[0].appName;
                gvc.notifyDataChange([vm.left_id, vm.right_id]);
            });
            return {
                bind: vm.left_id,
                view: () => {
                    if (data) {
                        return html `
                            <div
                                    class="w-100"
                                    style=" overflow-y: auto;"
                            >
                                <div class="row m-0 pt-2  mx-n2">
                                    ${data.response.result
                            .map((dd, index) => {
                            var _a;
                            return html `
                                                    <div class="col-12 mb-3 rounded-3"
                                                    >
                                                        <div class="d-flex flex-column justify-content-center w-100 "
                                                             style="gap:5px;cursor:pointer;${vm.select === dd.appName ? `overflow:hidden;background: #FFB400;border: 1px solid #FF6C02;padding:10px;border-radius: 5px;` : ``}">
                                                            <div class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                                                 style="padding-bottom: 58%;"
                                                                 onclick="${gvc.event(() => {
                                vm.select = dd.appName;
                                gvc.notifyDataChange([vm.left_id, vm.right_id]);
                            })}">
                                                                <div
                                                                        class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                                                        style="overflow: hidden;"
                                                                >
                                                                    <img
                                                                            class="w-100 "
                                                                            src="${(_a = dd.template_config.image[0]) !== null && _a !== void 0 ? _a : 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1713445383494-未命名(1080x1080像素).jpg'}"
                                                                    />
                                                                </div>

                                                                <div
                                                                        class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                                                        style="background: rgba(0,0,0,0.5);gap:5px;"
                                                                >
                                                                    <button
                                                                            class="btn btn-secondary d-flex align-items-center "
                                                                            style="height: 28px;width: 75px;gap:5px;"
                                                                    >選擇
                                                                    </button>
                                                                </div>

                                                            </div>
                                                            <h3 class="fs-6 mb-0 d-flex justify-content-between align-items-center">
                                                                ${dd.template_config.name}</h3>
                                                        </div>
                                                    </div>
                                                `;
                        })
                            .join('')}
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
                    style: 'height: calc(100vh - 125px);overflow-y:auto;', class: `p-2`
                },
            };
        })}
</div>
<div class="" style="${(document.body.clientWidth < 800) ? `width: calc(100%)` : `width: calc(100% - 200px)`};">
<div class="bgf6 p-3 w-100 border-bottom">${BgWidget.title('點擊喜愛的區塊進行複製', 'font-size:16px;')}</div>
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
                        `<iframe class="" style="height: calc(2.5 * (100vh - 125px));
width: calc(250%);
transform: scale(0.4) translateX(-75%) translateY(-75%);
    position: absolute;
    left: 0;
" src="${(() => {
                            const url = new URL(`${gvc.glitter.root_path}index?appName=${vm.select}&select_widget=true&type=find_idea`);
                            return url.href;
                        })()}" ></iframe>`
                    ].join('');
                },
                divCreate: {
                    style: `position:relative;height:calc(100vh - 125px);overflow-y:auto;`, class: `w-100`
                }
            };
        })}
</div>

</div>`;
    }
    static open(gvc) {
        NormalPageEditor.toggle({
            visible: true,
            title: `找靈感
            <div class="d-flex    bg-white align-items-center w-100 justify-content-around  ms-n1 d-none"
                             style="gap:10px;">
                            ${(() => {
                const list = [
                    {
                        select: true,
                        key: 'idea',
                        label: '找靈感',
                    },
                    {
                        key: 'official',
                        label: '找模塊',
                        event: gvc.event(() => {
                            NormalPageEditor.toggle({ visible: false });
                            AddComponent.toggle(true);
                        })
                    }
                ];
                return list
                    .map((dd) => {
                    if (dd.select) {
                        return `<div class="d-flex align-items-center justify-content-center fw-bold px-3 py-2 fw-500" style="
gap: 10px;
border-radius: 7px;
cursor: pointer;
color: white;
font-size: 16px;
flex:1;
border: 1px solid #FFB400;
background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);" >${dd.label}</div>`;
                    }
                    else {
                        return `<div class="d-flex align-items-center justify-content-center fw-bold  px-3 py-2 fw-500" style="
border-radius: 7px;
flex:1;
font-size: 16px;
border: 1px solid #FFB400;
cursor: pointer;
background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;" onclick="${dd.event || ''}">${dd.label}</div>`;
                    }
                })
                    .join('');
            })()}
                        </div>
            `,
            view: SearchIdea.main(gvc),
            width: (document.body.clientWidth < 800) ? document.body.clientWidth : 800
        });
    }
}
window.glitter.setModule(import.meta.url, SearchIdea);
