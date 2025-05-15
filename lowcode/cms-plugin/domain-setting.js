import { PageEditor } from "../editor/page-editor.js";
export class DomainSetting {
    static main(gvc) {
        const id = gvc.glitter.getUUID();
        const html = String.raw;
        return html `
            <div class="bg-white rounded" style="max-height:90vh;">
                <div class="position-relative bgf6 d-flex align-items-center justify-content-between  px-2 py-3 border-bottom shadow">
                    <span class="fs-lg fw-bold " style="color:black;">網域設定</span>

                </div>
                <div class="d-flex " >
                    <div>
                        ${gvc.bindView(() => {
            return {
                bind: id,
                view: () => {
                    const contentVM = {
                        loading: true,
                        leftID: gvc.glitter.getUUID(),
                        rightID: gvc.glitter.getUUID(),
                        leftBar: '',
                        rightBar: ''
                    };
                    PageEditor.domainRender(gvc).then((response) => {
                        contentVM.loading = false;
                        contentVM.leftBar = response.left;
                        contentVM.rightBar = response.right;
                        gvc.notifyDataChange([contentVM.leftID, contentVM.rightID]);
                    });
                    return html `
                                        <div class="d-flex">
                                            <div  class="border-end w-100">
                                                ${gvc.bindView(() => {
                        return {
                            bind: contentVM.leftID,
                            view: () => {
                                return contentVM.leftBar;
                            },
                            divCreate: {
                                class: `position-relative`,
                                style: `background-color:#f3f6ff !important`
                            }
                        };
                    })}
                                            </div>
                                            ${gvc.bindView(() => {
                        return {
                            bind: contentVM.rightID,
                            view: () => {
                                return contentVM.rightBar;
                            },
                            divCreate: {
                                class: `position-relative`
                            }
                        };
                    })}
                                        </div>`;
                },
                divCreate: {
                    style: `overflow-y:auto;`
                },
                onCreate: () => {
                }
            };
        })}
                    </div>
                </div>
            </div>
        `;
    }
}
window.glitter.setModule(import.meta.url, DomainSetting);
