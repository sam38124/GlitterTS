export class NormalPageEditor {
    static back() {
        const index2 = NormalPageEditor.viewArray.length;
        NormalPageEditor.viewArray = NormalPageEditor.viewArray.filter((dd, index) => {
            return index < index2 - 1;
        });
        NormalPageEditor.refresh();
    }
    static view(gvc) {
        const html = String.raw;
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            NormalPageEditor.refresh = () => {
                gvc.notifyDataChange(id);
            };
            return {
                bind: id,
                view: () => {
                    if (NormalPageEditor.viewArray.length === 0) {
                        return ``;
                    }
                    $('#norViewHover').width(NormalPageEditor.viewArray[NormalPageEditor.viewArray.length - 1].width || 350);
                    return [
                        html ` <div class="w-100 d-flex align-items-center p-3 border-bottom">
                            <h5 class=" offcanvas-title  " style="">${NormalPageEditor.viewArray[NormalPageEditor.viewArray.length - 1].title}</h5>
                            <div class="flex-fill"></div>
                            <div
                                class="fs-5 text-black"
                                style="cursor: pointer;"
                                onclick="${gvc.event(() => {
                            NormalPageEditor.toggle({
                                visible: false,
                            });
                        })}"
                            >
                                <i class="fa-sharp fa-regular fa-circle-xmark" style="color:black;"></i>
                            </div>
                        </div>`,
                        `<ol class="breadcrumb mb-0 p-2 border-bottom d-flex flex-wrap ${NormalPageEditor.viewArray.length === 1 ? `d-none` : ``}" style="cursor:pointer;">
${NormalPageEditor.viewArray
                            .map((dd, index) => {
                            return `<li class="breadcrumb-item ${index === NormalPageEditor.viewArray.length - 1 ? `active` : ``}" onclick="${gvc.event(() => {
                                NormalPageEditor.viewArray = NormalPageEditor.viewArray.filter((dd, index2) => {
                                    return index2 <= index;
                                });
                                gvc.notifyDataChange(id);
                            })}">${dd.title}</li>`;
                        })
                            .join('')}
      
        </ol>`,
                        html ` <div style="height:calc(100vh - 65px);overflow-y: auto;padding-bottom: 100px;">${NormalPageEditor.viewArray[NormalPageEditor.viewArray.length - 1].view}</div>`,
                    ].join('');
                },
            };
        });
    }
    static leftNav(gvc) {
        const html = String.raw;
        return html ` <div
                class="vw-100 vh-100 position-fixed  top-0 d-none"
                id="norView"
                style="z-index: 99999;background: rgba(0,0,0,0.5);"
                onclick="${gvc.event(() => {
            NormalPageEditor.toggle({
                visible: false,
            });
        })}"
            ></div>

            <div id="norViewHover" class="position-fixed  top-0 h-100 bg-white shadow-lg scroll-out" style="width:350px;z-index: 99999;">${NormalPageEditor.view(gvc)}</div>`;
    }
    static toggle(cf) {
        try {
            NormalPageEditor.visible = cf.visible;
            if (cf.visible) {
                NormalPageEditor.isRight = cf.right;
                $('#norView').removeClass('d-none');
                $('#norViewHover').removeClass('scroll-out');
                $('#norViewHover').removeClass('scroll-right-out');
                $('#norViewHover').removeClass('scroll-in');
                $('#norViewHover').removeClass('scroll-right-in');
                if (NormalPageEditor.isRight) {
                    $('#norViewHover').addClass('scroll-right-in');
                }
                else {
                    $('#norViewHover').addClass('scroll-in');
                }
                NormalPageEditor.viewArray.push({
                    view: cf.view,
                    title: cf.title,
                    width: cf.width,
                });
                NormalPageEditor.refresh();
            }
            else {
                NormalPageEditor.viewArray = [];
                $('#norView').addClass('d-none');
                if (NormalPageEditor.isRight) {
                    $('#norViewHover').removeClass('scroll-out');
                    $('#norViewHover').removeClass('scroll-right-in');
                    $('#norViewHover').addClass('scroll-right-out');
                }
                else {
                    $('#norViewHover').removeClass('scroll-in');
                    $('#norViewHover').removeClass('scroll-right-out');
                    $('#norViewHover').addClass('scroll-out');
                }
                NormalPageEditor.closeEvent();
                NormalPageEditor.closeEvent = () => { };
            }
        }
        catch (r) { }
    }
    static isVisible() {
        return this.visible;
    }
}
NormalPageEditor.refresh = () => { };
NormalPageEditor.viewArray = [];
NormalPageEditor.isRight = false;
NormalPageEditor.visible = false;
NormalPageEditor.closeEvent = () => { };
