import { GVC } from '../../glitterBundle/GVController.js';
import { Storage } from '../../glitterBundle/helper/storage.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { EditorElem } from '../../glitterBundle/plugins/editor-elem.js';

const html = String.raw;

export class HeaderMobile {
  public static mian(cf: { gvc: GVC }) {
    const { gvc } = cf;

    return html`
      <div style="height:${66 + gvc.glitter.share.top_inset}px;"></div>
      ${
      gvc.bindView(()=>{
        const v_id=gvc.glitter.getUUID();
        let head_config:any = undefined;

          new Promise((resolve, reject) => {
          (window.parent as any).glitter.share.ApiUser.getPublicConfig(
            'app-header-config',
            'manager',
            (window.parent as any).appName
          ).then((res: any) => {
            head_config=res.response.value;
            resolve(res.response.value);
            gvc.notifyDataChange(v_id);
          });
        });
        return  {
          bind:v_id,
          view:()=>{
            if(!head_config){
              return  ``
            }
            return `<div
class="w-100 d-flex align-items-center" style="position: relative;">
<div
            class="d-flex align-items-center justify-content-center d-md-none"
            style="width:45px !important;height:40px !important;"
          >
            <i
              class="fa-solid fa-bars fa-fw  "
              style="font-size: 20px;
    color: ${ head_config.btn_color || '#ffffff'};"
              aria-hidden="true"
            ></i>
          </div>
          <div class="position-absolute" style="transform: translate(-50%,-50%);top:50%;left: 50%;">
            <img
              src="${head_config.header_img}"
              style="max-width:200px;max-height:60px;"
              alt=""
            />
          </div>
</div>`
          },
          divCreate:()=>{
            return {
              elem:'nav',
              class:`navbar navbar-expand-lg vw-100 header header-place shadow   top-0 left-0 px-2 py-0 position-fixed position-sm-relative
              ${head_config ? ``:`d-none`}
              `,
              style:`background:  ${head_config && head_config.background} !important;z-index:9999;
        height:${66 + gvc.glitter.share.top_inset}px;padding-top:${gvc.glitter.share.top_inset}px !important;
`
            }
          }
        }
      })
      }
    `;
  }

  public static editor(cf: { gvc: GVC; widget: any }) {
    const gvc = cf.gvc;

    return html`
      <div
        class="px-3 mx-n2 border-bottom pb-3 fw-bold mt-n3 mb-2 pt-3 hoverF2 d-flex align-items-center"
        style="cursor: pointer;color:#393939;border-radius: 0px;gap:10px;"
        onclick="${cf.gvc.event(() => {
          Storage.lastSelect = '';
          gvc.glitter.share.editorViewModel.selectItem = undefined;
          gvc.glitter.share.selectEditorItem();
        })}"
      >
        <i
          class="fa-solid fa-chevron-left h-100 d-flex align-items-center justify-content-center "
          style="cursor: pointer;"
          aria-hidden="true"
        ></i>
        <span style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
          >手機版標頭</span
        >
        <div class="flex-fill"></div>
      </div>
      ${gvc.bindView(() => {
        const vm = {
          id: gvc.glitter.getUUID(),
        };
        return {
          bind: vm.id,
          view: async () => {
            const BgWidget: any = await new Promise((resolve, reject) => {
              gvc.glitter.getModule(
                new URL(gvc.glitter.root_path + 'backend-manager/bg-widget.js', import.meta.url).href,
                clas => {
                  resolve(clas);
                }
              );
            });
            const EditorElem: any = await new Promise((resolve, reject) => {
              gvc.glitter.getModule(
                new URL(gvc.glitter.root_path + 'glitterBundle/plugins/editor-elem.js', import.meta.url).href,
                clas => {
                  resolve(clas);
                }
              );
            });
            const head_config: any = await new Promise((resolve, reject) => {
              (window.parent as any).glitter.share.ApiUser.getPublicConfig(
                'app-header-config',
                'manager',
                (window.parent as any).appName
              ).then((res: any) => {
                resolve(res.response.value);
              });
            });

            function refresh() {
              for (const b of (window.parent as any).document
                .querySelector('.iframe_view')
                .contentWindow.document.querySelectorAll(
                  `.${cf.widget.data.refer_app || (window as any).appName}_${cf.widget.data.tag}`
                )) {
                b.updatePageConfig({}, 'def', cf.widget);
              }
            }

            gvc.glitter.share.editorViewModel.saveArray[cf.widget.id] = () => {
              return new Promise((resolve, reject) => {
                (window.parent as any).glitter.share.ApiUser.setPublicConfig({
                  key: 'app-header-config',
                  value: head_config,
                  user_id: 'manager',
                }).then((r: any) => {
                  resolve(true);
                });
              });
            };
            return [
              BgWidget.title('LOGO圖片', 'font-size:16px;margin-bottom: 5px;'),
              BgWidget.imageSelector(gvc, head_config.header_img || '', (res: any) => {
                head_config.header_img = res;
                refresh();
                gvc.notifyDataChange(vm.id);
              }),
              html` <div class="tx_normal mt-2">背景顏色</div>`,
              EditorElem.colorSelect({
                gvc: gvc,
                title: '',
                callback: (text: string) => {
                  head_config.background = text;
                  refresh();
                  gvc.notifyDataChange(vm.id);
                },
                def: head_config.background,
              }),
              html` <div class="tx_normal mt-2">按鈕顏色</div>`,
              EditorElem.colorSelect({
                gvc: gvc,
                title: '',
                callback: (text: string) => {
                  head_config.btn_color = text;
                  refresh();
                  gvc.notifyDataChange(vm.id);
                },
                def:  head_config.btn_color,
              }),
            ].join('');
          },
          divCreate: {},
        };
      })}
    `;
  }
}

(window as any).glitter.setModule(import.meta.url, HeaderMobile);
