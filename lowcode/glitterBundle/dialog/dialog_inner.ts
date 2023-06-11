import {init} from "../GVController.js";

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            return `
 <div class="vw-100 vh-100 position-absolute " style="background:rgba(0,0,0,0.7);z-index:0;"></div>
 <div class="vw-100 vh-100 d-flex align-items-center justify-content-center position-relative" style="z-index:1;">
 ${gBundle.getView(gvc)}
</div>

            `
        }
    }
})