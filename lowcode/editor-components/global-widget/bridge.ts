import { GVC } from '../../glitterBundle/GVController.js';
import { ToolSetting } from '../../jspage/function-page/tool-setting.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { OptionsItem } from '../../glitterBundle/html-component/global-widget.js';
const html=String.raw;
export class Bridge {

  static grayButton(text: string, event: string, obj?: { icon?: string; textStyle?: string; class?: string }) {
    return html` <button class="btn btn-gray ${obj?.class || ''}" type="button" onclick="${event}">
      <i class="${obj && obj.icon && obj.icon.length > 0 ? obj.icon : 'd-none'}" style="color: #393939"></i>
      ${text.length > 0 ? html`<span class="tx_700" style="${obj?.textStyle ?? ''}">${text}</span>` : ''}
    </button>`;
  }

  static select(obj: {
    gvc: GVC;
    callback: (value: any) => void;
    default: string;
    options: OptionsItem[];
    style?: string;
    title?: string;
    readonly?: boolean;
    place_holder?: string;
  }) {
    return html` ${obj.title ? html` <div class="tx_normal fw-normal mb-2">${obj.title}</div>` : ``}
      <select
        class="c_select c_select_w_100"
        style="${obj.style ?? ''}; ${obj.readonly ? 'background: #f7f7f7;' : ''}"
        onchange="${obj.gvc.event(e => {
      obj.callback(e.value);
    })}"
        ${obj.readonly ? 'disabled' : ''}
      >
        ${obj.gvc.map(
      obj.options.map(
        opt =>
          html` <option class="c_select_option" value="${opt.key}" ${obj.default === opt.key ? 'selected' : ''}>
                ${opt.value}
              </option>`
      )
    )}
        ${(obj.options as any).find((opt: any) => {
      return obj.default === opt.key;
    })
      ? ``
      : `<option class="d-none" selected>${obj.place_holder || `請選擇項目`}</option>`}
      </select>`;
  }
  public static main(obj: any) {
    console.log(`refer_form_data=>`,obj.widget)
    const gvc: GVC = obj.gvc;
    const glitter = gvc.glitter;
    const is_sub_page = ['pages/','hidden/','shop/'].find((dd)=>{
      return (glitter.getUrlParameter('page') || '').startsWith(dd)
    })
    const c_view=[
      `<div style="height:5px;"></div>`,
    ]
    c_view.push(ToolSetting.item({
      gvc: gvc,
      dd: (() => {
        switch (glitter.share.editorViewModel.selectItem.data.tag){
          case 'c_header':
            return  {
              title: '標頭選單',
              tag: '標頭元件',
              hint: (is_sub_page) ? `
                此頁面標頭將預設為以下樣式
                `:`全館 (首頁,隱形賣場,一頁式網頁) 的標頭將預設為以下樣式`,
              toggle:true
            };
          case 'footer':
            return {
              title: '頁腳選單',
              tag: '頁腳元件',
              hint: `全館 (首頁,隱形賣場,一頁式網頁) 的頁腳將預設為以下樣式`,
              toggle:true
            };
          case 'SY00-normal-products':
          case 'SY02_page_product':
          case 'SY00-normal-scroll-products':
            return   {
              title: '商品卡片',
              tag: '商品卡片',
              hint: `全館 (首頁,隱形賣場,一頁式網頁) 的商品卡片將預設為以下樣式`,
              toggle:true,
              editable:true
            }
        }
      })(),
    }))
//     c_view.push(
//       [
//         `<div class="fs-6 mb-2" style="color: black;">選單參照內容</div>`,
//         gvc.bindView(()=>{
//           const bi=gvc.glitter.getUUID()
//           return {
//             bind:bi,
//             view:async ()=>{
//               try {
//                 const vm:any={
//                   tab:'menu',
//                   dataList:[]
//                 }
//                 const tag=vm.tab==='menu' ? 'menu-setting':'footer-setting';
//                 let menu_all= (await ApiUser.getPublicConfig('menu-setting-list','manager')).response.value;
//                 menu_all.list = menu_all.list ?? [];
//                 vm.dataList = [
//                   { tag: tag, title: `系統預設
//                         ` },
//                   ...menu_all.list.filter((d1:any)=>{
//                     return d1.tab===tag
//                   })
//                 ];
//                 return  [
//                   this.select({
//                     gvc: gvc,
//                     callback: (text: any) => {
//                       glitter.share.refer_form['menu_refer']=text
//                       glitter.share.refresh_global();
//                     },
//                     default: glitter.share.refer_form['menu_refer'] ?? tag,
//                     options: vm.dataList.map((dd:any)=>{
//                       return {
//                         key:dd.tag,
//                         value:dd.title
//                       }
//                     })
//                   }),
//                   this.grayButton(
//                     '設定',
//                     gvc.event(() => {
//                       gvc.glitter.getModule(`${gvc.glitter.root_path}cms-plugin/menus-setting.js`, menu => {
//                         gvc.glitter.innerDialog((gvc)=>{
//                           return html`
//                           <div class="vw-100 vh-100 bg-white">
//                             <div class="d-flex align-items-center" style="height: 60px;width: 100vw;border-bottom: solid 1px #DDD;font-size: 16px;font-style: normal;font-weight: 700;color: #393939;">
//                               <div class="d-flex" style="padding:19px 32px;gap:8px;cursor: pointer;border-right: solid 1px #DDD;" onclick="${gvc.event(()=>{
//                             gvc.closeDialog()
//                           })}">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                   <path d="M13.7859 4.96406L8.02969 10.7203C7.69219 11.0578 7.5 11.5219 7.5 12C7.5 12.4781 7.69219 12.9422 8.02969 13.2797L13.7859 19.0359C14.0859 19.3359 14.4891 19.5 14.9109 19.5C15.7875 19.5 16.5 18.7875 16.5 17.9109V15H22.5C23.3297 15 24 14.3297 24 13.5V10.5C24 9.67031 23.3297 9 22.5 9H16.5V6.08906C16.5 5.2125 15.7875 4.5 14.9109 4.5C14.4891 4.5 14.0859 4.66875 13.7859 4.96406ZM7.5 19.5H4.5C3.67031 19.5 3 18.8297 3 18V6C3 5.17031 3.67031 4.5 4.5 4.5H7.5C8.32969 4.5 9 3.82969 9 3C9 2.17031 8.32969 1.5 7.5 1.5H4.5C2.01562 1.5 0 3.51562 0 6V18C0 20.4844 2.01562 22.5 4.5 22.5H7.5C8.32969 22.5 9 21.8297 9 21C9 20.1703 8.32969 19.5 7.5 19.5Z" fill="#393939"></path>
//                                 </svg>
//                                 返回
//                               </div>
//                               <div class="flex-fill" style="padding: 19px 32px;">編輯選單內容</div>
//                             </div>
//                             <div class="w-100">${
//                             menu.main(gvc, obj.widget)
//                           }</div>
//                           </div>
// `
//                         }, 'menus-setting',{
//                           dismiss:()=>{
//                             glitter.share.refresh_global();
//                           }
//                         });
//                       });
//                     }),
//                     {
//                     }
//                   )
//                 ].join('')
//               }catch (e) {
//                 console.log(e)
//                 return  ``
//               }
//             },
//             divCreate:{
//               class:`d-flex align-items-center`,style:`gap:5px;`
//             }
//           }
//         })
//       ].join('')
//     );
    // civ.push(`<div class="mx-n2 border-top mb-2 mt-3"></div>`);
    c_view.push(  `<div style="height:1px;" class="border-top mx-n3"></div>`)
    return c_view.join(`<div style="height:10px;"></div>`);
  }
}

(window as any).glitter.setModule(import.meta.url, Bridge);
