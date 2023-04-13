import { init } from '../glitterBundle/GVController.js';
init((gvc, glitter, gBundle) => {
    console.log('sss');
    gvc.addStyle(`.nav {
  white-space: nowrap;
  display:block!important;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch
}
.nav li {
  display: inline-block
}`);
    function getSource(dd) {
        return dd.src.official;
    }
    return {
        onCreateView: () => {
            let viewModel = {
                loading: true,
                pluginList: []
            };
            return `
            <div  class="w-100 h-100 d-flex flex-column align-items-center justify-content-center" style="background-color: rgba(255,255,255,0.5);" >
            <div class="bg-dark m-auto rounded" style="max-width: 100%;max-height: 100%;width: 720px;height: 800px;">
        <div class="w-100 d-flex align-items-center border-bottom justify-content-center position-relative" style="height: 68px;">
        <h3 class="modal-title fs-4" >添加頁面</h3>
        <i class="fa-solid fa-xmark text-white position-absolute " style="font-size:20px;transform: translateY(-50%);right: 20px;top: 50%;cursor: pointer;"
        onclick="${gvc.event(() => {
                glitter.closeDiaLog();
            })}"></i>
</div>    
<div class="container w-100 pt-2 overflow-scroll" style="height: calc(100% - 180px);">

</div>

</div>
</div>
            `;
        }
    };
});
