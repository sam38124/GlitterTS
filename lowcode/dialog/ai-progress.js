import { init } from '../glitterBundle/GVController.js';
import { ShareDialog } from "./ShareDialog.js";
init((gvc, glitter, gBundle) => {
    const dialog = new ShareDialog(glitter);
    return {
        onCreateView: () => {
            gvc.addMtScript([{ src: 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js' }], () => { }, () => { });
            return `<div class="vw-100 vh-100 position-fixed top-0 left-0"  style="background-color: rgba(0,0,0,0.5);z-index: 29999;">
<div class="rounded text-center" style="width: 300px;position: absolute;z-index: 999;transform: translate(-50%,-50%);left: 50%;top:50%;">
        <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_itilDAyVNt.json"  background="transparent"  speed="1"  style="width: 300px; height: 300px;"  loop  autoplay></lottie-player>
         <h3 class="fw-bold" style="color: white;font-size: 26px;margin-top: 0px;width: 100%;text-align: center">AI運算中，請稍候...</h3>
     </div>
</div>`;
        },
        onCreate: () => {
        }
    };
});
