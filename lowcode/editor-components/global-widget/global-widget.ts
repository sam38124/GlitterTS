//找靈感
import { NormalPageEditor } from '../../editor/normal-page-editor.js';
import { GVC } from '../../glitterBundle/GVController.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiPageConfig } from '../../api/pageConfig.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';

export class GlobalWidget {
  public static leftSelect = [
    {
      title: '標頭樣式',
      src: new URL(`./src/header.png`, import.meta.url).href,
      tag: '標頭元件',
    },
    {
      title: '商品卡片樣式',
      src: new URL(`./src/product.jpg`, import.meta.url).href,
      tag: '商品卡片',
    },
    {
      title: '頁腳樣式',
      src: new URL(`./src/footer.jpg`, import.meta.url).href,
      tag: '頁腳元件',
    }
  ];

  public static main(obg: {
    gvc: GVC;
    type?: 'idea' | 'template';
    def?: string;
    selectCallback?: (app_data: any) => void;
  }) {
    const gvc = obg.gvc;

    const vm: {
      select: string;
      left_id: string;
      right_id: string;
    } = {
      select: obg.def || '標頭元件',
      left_id: gvc.glitter.getUUID(),
      right_id: gvc.glitter.getUUID(),
    };
    let data: any = undefined;
    const html = String.raw;
    return html` <div class="w-100 d-flex">
      <div class="d-flex flex-column border-end" style="width:200px;">
        ${gvc.bindView(() => {
          return {
            bind: vm.left_id,
            view: () => {
              return html`
                <div class="w-100" style=" overflow-y: auto;">
                  <div class="d-flex flex-column ">
                    ${GlobalWidget.leftSelect
                      .map((dd, index: number) => {
                        return html`
                          <div class="rounded-3">
                            <div
                              class="d-flex flex-column justify-content-center w-100 "
                              style="gap:5px;cursor:pointer;${vm.select === dd.tag
                                ? `overflow:hidden;background: #FFB400;border: 1px solid #FF6C02;padding:10px;border-radius: 5px;`
                                : ``}"
                            >
                              <div
                                class="card w-100 position-relative rounded hoverHidden bgf6 rounded-3"
                                style="padding-bottom: 56%;"
                                onclick="${gvc.event(() => {
                                  vm.select = dd.tag;
                                  gvc.notifyDataChange([vm.left_id, vm.right_id]);
                                })}"
                              >
                                <div
                                  class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                                  style="overflow: hidden;"
                                >
                                  <img class="w-100 " src="${dd.src}" />
                                </div>

                                <div
                                  class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                  style="background: rgba(0,0,0,0.5);gap:5px;"
                                >
                                  <button
                                    class="btn btn-secondary d-flex align-items-center "
                                    style="height: 28px;width: 75px;gap:5px;"
                                  >
                                    選擇
                                  </button>
                                </div>
                              </div>
                              <div
                                class="mb-0 d-flex justify-content-center align-items-center fw-bold"
                                style="font-size:15px;"
                              >
                                ${dd.title}
                              </div>
                            </div>
                          </div>
                        `;
                      })
                      .join(`<div class="my-2"></div>`)}
                  </div>
                </div>
              `;
            },
            divCreate: {
              style: 'height: calc(100vh - 125px) !important;overflow-y:auto;',
              class: `p-2`,
            },
          };
        })}
      </div>
      <div  style="${document.body.clientWidth < 768 ? `width: calc(100%)` : `width: calc(100% - 200px)`};">
        ${gvc.bindView(() => {
          return {
            bind: vm.right_id,
            view: async () => {
              if (!vm.select) {
                return `<div class="w-100 p-3 d-flex align-items-center justify-content-center flex-column"
                                 style="gap: 10px;">
                                <div class="spinner-border fs-5"></div>
                                <div class="fs-6 fw-500">載入中...</div>
                            </div>`;
              }
              let module_list = (
                await ApiPageConfig.getPageTemplate({
                  template_from: 'all',
                  page: '0',
                  limit: '3000',
                  type: 'module',
                  tag: vm.select,
                })
              ).response.result.data;
              return module_list
                .map((dd: any) => {
                  return `
<div class="d-flex align-items-center justify-content-center bgf6 hoverHidden position-relative py-4" style="min-height:200px;">
<img class="w-100" src="${dd.template_config.image[0]}">
  <div
                                    class="position-absolute w-100 h-100  align-items-center justify-content-center rounded fs-6 flex-column"
                                    style="background: rgba(0,0,0,0.5);gap:5px;"
                                  >
                                    <button
                                      class="btn btn-secondary d-flex align-items-center "
                                      style="height: 28px;width: 75px;gap:5px;"
                                      onclick="${gvc.event(async ()=>{
                    // obg.selectCallback && obg.selectCallback(dd)
                    //Real tag
                    const ci_tag=(()=>{
                      switch (vm.select){
                        case '標頭元件':
                          return 'c_header'
                        case '頁腳元件':
                          return  `footer`
                        case '商品卡片':
                          return  `product_widget`
                        case '廣告輪播':
                          return 'advertise'
                      }
                    })()
                    //參照元件
                    let widget = await (async () => {
                      if (['標頭元件', '頁腳元件', '商品卡片', '廣告輪播'].includes(vm.select)) {
                        return (
                          await ApiPageConfig.getPage({
                            appName: (window as any).appName,
                            type: 'template',
                            tag:ci_tag,
                          })
                        ).response.result[0];
                      }else{
                        return  {}
                      }
                    })();

                    const dialog = new ShareDialog(gvc.glitter);
                    dialog.checkYesOrNot({
                      text: '是否確認替換樣式?',
                      callback: (response) => {
                        if (response) {
                          dialog.dataLoading({visible: true});
                          ((window as any).glitterInitialHelper).getPageData({
                            tag: dd.tag,
                            appName: dd.appName
                          }, (d3: any) => {
                            widget.config[0] = {
                              id: gvc.glitter.getUUID(),
                              js: './official_view_component/official.js',
                              css: {
                                class: {},
                                style: {},
                              },
                              data: {
                                refer_app: dd.appName,
                                refer_form_data: d3.response.result[0].page_config.formData,
                                tag: dd.tag,
                                list: [],
                                carryData: {},
                              },
                              type: 'component',
                              class: 'w-100',
                              index: 0,
                              label: dd.name,
                              style: '',
                              bundle: {},
                              global: [],
                              toggle: false,
                              stylist: [],
                              dataType: 'static',
                              style_from: 'code',
                              classDataType: 'static',
                              preloadEvenet: {},
                              share: {},
                              "gCount": "single"
                            };
                            ApiPageConfig.setPage({
                              id: widget.id,
                              appName: widget.appName,
                              tag: widget.tag,
                              name: widget.name,
                              config: widget.config,
                              group: widget.group,
                              page_config: widget.page_config,
                              page_type: widget.page_type,
                              preview_image: widget.preview_image,
                              favorite: widget.favorite,
                            }).then((api) => {
                              dialog.dataLoading({visible: false});
                              location.reload();
                            });
                          })
                        }
                      },
                    });
                  })}"
                                    >
                                      選擇
                                    </button>
                                  </div>
</div>`;
                })
                .join(`<div class="w-100 border-top"></div>`)+`<div class="w-100 border-top"></div>`;
            },
            divCreate: {
              style: `position:relative;height:calc(100vh - 65px) !important;overflow-y:auto;`,
              class: `w-100`,
            },
          };
        })}
      </div>
    </div>`;
  }

  public static open(gvc: GVC,def:string) {
    NormalPageEditor.toggle({
      visible: true,
      title: `全站設計元件`,
      view: GlobalWidget.main({
        gvc: gvc,
        type: 'idea',
       def:def
      }),
      width: document.body.clientWidth < 992 ? document.body.clientWidth : 800,
    });
  }
}

(window as any).glitter.setModule(import.meta.url, GlobalWidget);
