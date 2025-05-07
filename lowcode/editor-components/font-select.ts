// import { BgWidget } from '../backend-manager/bg-widget.js';
// import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
// import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
// import { FontsConfig } from '../setting/fonts-config.js';
//
// export class FontSelect {
//   public static setFont(obj: { index: number; gvc: any; vm_c: any; globalValue: any; dd: any }) {
//     const { index, gvc, vm_c, globalValue, dd } = obj;
//     return `<div class="col-12 mb-3" style="cursor: pointer;">
//                                             <div class="rounded border p-2 d-flex  w-100 flex-column" style="gap:10px;">
//                                                 ${BgWidget.title(index === 0 ? `預設字型` : dd.value || `字型樣式 ${index}`, 'font-size: 16px;')}
//                                                 <div class="d-flex align-items-center" style="gap:10px;">
//                                                     ${EditorElem.searchInputDynamicV2({
//                                                       title: '',
//                                                       gvc: gvc,
//                                                       // default: dd.value,
//                                                       def: dd.value,
//                                                       array: vm_c.fonts.map((dd: any, index: number) => {
//                                                           return dd.title;
//                                                       }),
//                                                       callback: text => {
//                                                         if (
//                                                           vm_c.fonts.find((dd: any, index: number) => {
//                                                             return dd.title === text;
//                                                           })
//                                                         ) {
//                                                           dd.title = text;
//                                                           dd.value = text;
//                                                           FontsConfig.reInitialFontTheme(globalValue, gvc);
//                                                         }
//                                                         gvc.notifyDataChange(vm_c.id);
//                                                       },
//                                                       placeHolder: '搜尋字體',
//                                                       readonly: 'true',
//                                                     })}
//                                                     ${
//                                                       index !== 0
//                                                         ? BgWidget.cancel(
//                                                             gvc.event(() => {
//                                                               const dialog = new ShareDialog(gvc.glitter);
//                                                               dialog.checkYesOrNot({
//                                                                 text: '是否確認刪除此字型?',
//                                                                 callback: response => {
//                                                                   if (response) {
//                                                                     globalValue.font_theme.splice(index, 1);
//                                                                     gvc.notifyDataChange(vm_c.id);
//                                                                   }
//                                                                 },
//                                                               });
//                                                             }),
//                                                             '<i class="fa-solid  fa-trash-can"></i>'
//                                                           )
//                                                         : ``
//                                                     }
//                                                 </div>
//                                             </div>
//                                             <div class="d-flex p-2 align-items-center" style="gap:10px;">
//                                                 <div class="fs-6">預覽字體:</div>
//                                                 <div class="fs-6 bgf6 p-2" style="font-family: '${dd.value}' !important;">字型</div>
//                                                 <div class="fs-6 bgf6 p-2" style="font-family: '${dd.value}' !important;">fonts</div>
//                                             </div>
//                                         </div>`;
//   }
// }
