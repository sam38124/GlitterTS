import { ShareDialog } from './ShareDialog.js';
import { init } from '../GVController.js';
init((gvc, glitter, gBundle) => {
    const dialog = new ShareDialog(glitter);
    return {
        onCreateView: () => {
            var _a, _b, _c;
            switch (gBundle.type) {
                case 'dataLoading':
                    return `<div class="vw-100 vh-100 position-fixed top-0 left-0"  style="background-color: rgba(0,0,0,0.5);z-index: 10000;">
<div class="bg-white rounded" style="width: 100px;height: 100px;position: absolute;z-index: 999;transform: translate(-50%,-50%);left: 50%;top:50%;">
         <img src="${new URL("../img/loading.gif", import.meta.url)}"  background="transparent"  speed="1"  style="position:relative;width: 70px; height: 70px;transform: translateX(-50%);left: 50%;"  loop  autoplay>
         <h3 style="color: #323643;font-size: 13px;margin-top: 0px;width: 100%;text-align: center">${(_a = gBundle.obj.text) !== null && _a !== void 0 ? _a : '請稍候...'}</h3>
     </div>
</div>`;
                case 'errorMessage':
                    return `<div class="vw-100 vh-100 position-fixed top-0 left-0"  style="background-color: rgba(0,0,0,0.5);z-index: 10000;">
<div class="bg-white rounded" style="width: 150px;position: absolute;z-index: 999;transform: translate(-50%,-50%);left: 50%;top:50%;">
  <div class="w-100 d-flex align-items-center justify-content-center text-danger" style="height: 80px;"> <i class="fad fa-exclamation-circle" style="font-size: 50px;margin: auto;"></i></div>
         <h3 id="info" style="font-size: 14px;margin-top: 0px;width: calc(100% - 10px);text-align: center;white-space: normal;word-break: break-all;" class="mx-auto">${(_b = gBundle.obj.text) !== null && _b !== void 0 ? _b : "錯誤!"}</h3>
         <div class="w-100 border-top d-flex align-items-center justify-content-center" style="height: 40px;font-size: 14px;margin-top: 10px;" onclick="${gvc.event(() => {
                        var _a;
                        glitter.closeDiaLog((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
                    })}">
             <h3  style="font-size: 14px;margin:auto;width: 100%;text-align: center;">確認</h3>
         </div>
     </div>
</div>`;
                case 'successMessage':
                    return `<div class="vw-100 vh-100 position-fixed top-0 left-0"  style="background-color: rgba(0,0,0,0.5);z-index: 10000;">
<div class="bg-white rounded" style="width: 150px;position: absolute;z-index: 999;transform: translate(-50%,-50%);left: 50%;top:50%;">
  <div class="w-100 d-flex align-items-center justify-content-center text-success" style="height: 80px;"> <i class="fad fa-badge-check" style="font-size: 50px;margin: auto;"></i></div>
         <h3 id="info" style="font-size: 14px;margin-top: 0px;width: calc(100% - 10px);text-align: center;white-space: normal;word-break: break-all;" class="mx-auto text-success">${(_c = gBundle.obj.text) !== null && _c !== void 0 ? _c : "成功!"}</h3>
         <div class="w-100 border-top d-flex align-items-center justify-content-center" style="height: 40px;font-size: 14px;margin-top: 10px;" onclick="${gvc.event(() => {
                        var _a;
                        glitter.closeDiaLog((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
                    })}">
             <h3  style="font-size: 14px;margin:auto;width: 100%;text-align: center;" class="text-success" onclick="${gvc.event(() => {
                        var _a;
                        glitter.closeDiaLog((_a = gvc.parameter.pageConfig) === null || _a === void 0 ? void 0 : _a.tag);
                    })}">確認</h3>
         </div>
     </div>
</div>`;
                case 'checkYesOrNot':
                    return `
<div class="vw-100 vh-100 position-fixed top-0 left-0 d-flex align-items-center justify-content-center"  style="background-color: rgba(0,0,0,0.5);z-index: 10000;">
<div style="width: 250px;background-color: white;border-radius: 5px;display: flex;flex-direction: column;align-items: center;">
        <h3 style="height:40px;font-size:20px;color: black;margin-top: 5px;margin-bottom: 5px;border-bottom: whitesmoke solid 1px;width: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;">再次確認</h3>
<h3 class="text-danger fw-bold mt-2" style="font-size: 16px;">${gBundle.title}</h3>
<div style="display: flex;width: 100%;justify-content: space-around;">
<div style="height:35px;margin-bottom:15px;margin-top:15px;border-radius: 5px;border:1px solid gray;color: black;width: calc(50% - 15px);display: flex;align-items: center;
justify-content: center;" onclick="${gvc.event(() => {
                        gBundle.callback(false);
                    })}">取消</div>
<div style="height:35px;margin-bottom:15px;margin-top:15px;border-radius: 5px;background-color: dodgerblue;color: white;width: calc(50% - 15px);display: flex;align-items: center;
justify-content: center;" onclick="${gvc.event(() => {
                        gBundle.callback(true);
                    })}">確定</div>
</div>
</div>
</div>
`;
                default:
                    return "";
            }
        },
        onCreate: () => {
        }
    };
});
