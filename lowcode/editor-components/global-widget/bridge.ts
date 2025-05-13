import { GVC } from '../../glitterBundle/GVController.js';
import { ToolSetting } from '../../jspage/function-page/tool-setting.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';

export class Bridge {
  public static main(obj: any) {
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

    c_view.push(  `<div style="height:1px;" class="border-top mx-n3"></div>`)
    return c_view.join(`<div style="height:10px;"></div>`);
  }
}

(window as any).glitter.setModule(import.meta.url, Bridge);
