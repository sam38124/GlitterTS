import { init } from "../glitterBundle/GVController.js";
init(import.meta.url, (gvc, glitter, gBundle) => {
    glitter.addMtScript([{ src: `https://kit.fontawesome.com/02e2dc09e3.js` }], () => { }, () => { });
    return {
        onCreateView: () => {
            const id = glitter.getUUID();
            const hd = glitter.getUUID();
            return `<div class="vw-100 vh-100 d-flex align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.5);">
<div id="${hd}" style="height:50px;right:0;top:0;background-color: rgba(0,0,0,0.8);" class="position-absolute d-flex align-items-center justify-content-center" >
<button class="btn-dark btn ms-2" onclick="${gvc.event((e, event) => {
                $('#' + hd).addClass('d-none');
                window.print();
                $('#' + hd).removeClass('d-none');
            })}">列印</button>
<div class="btn d-flex align-items-center justify-content-center" style="width:50px;height:50px;background-color: rgba(0,0,0,0.8);" onclick="${gvc.event(() => {
                gvc.closeDialog();
            })}">
<i class="fa-solid fa-xmark " style="color:white;"></i>
</div>
</div>
<div id="${id}" style="max-width: 100%;max-height: 100%;">
<img style="max-width: 100vw;max-height: 100vh;" src="${gBundle}" >
</div>
</div>`;
        }
    };
});
