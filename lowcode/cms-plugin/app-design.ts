import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiPageConfig } from '../api/pageConfig.js';

export class AppDesign {
  public static main(gvc: GVC) {
    const html = String.raw;
    return BgWidget.container(
      [
        html` <div class="title-container">${BgWidget.title('APP佈景主題')}</div>`,
        BgWidget.card(
          gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
              bind: id,
              view: () => {
                return html`
                  <div class="d-flex flex-column" style="gap:5px;">
                    ${[
                      `<div class="tx_normal fs-5 fw-500">2414-居家生活</div>`,
                      `<div class="tx_normal fs-sm fw-500 text-body" style="">上次儲存時間: 03-21 14:27</div>`,
                      ``,
                    ].join('')}
                  </div>
                  <div class="flex-fill"></div>
                  <div class="d-flex" style="gap:10px;">
                    ${[
                      BgWidget.grayButton(
                        '主題資訊',
                        gvc.event(() => {})
                      ),
                      BgWidget.save(
                        gvc.event(() => {
                          (window.parent as any).glitter.setUrlParameter('function','user-editor');
                          (window.parent as any).glitter.setUrlParameter('device','mobile');
                          (window.parent as any).glitter.setUrlParameter('page','index-app');
                          (window.parent as any).location.reload();
                        }),
                        '主題設計'
                      ),
                    ].join('')}
                  </div>
                `;
              },
              divCreate: {
                class: `w-100 d-flex align-items-center`,
                style: `gap:10px;`,
              },
            };
          })
        ),
        BgWidget.card(html`
          <div class="d-flex flex-column" style="gap:5px;">
            ${[
              `<div class="tx_normal fs-6 fw-bold">佈景主題庫</div>`,
              `<div class="tx_normal fs-sm fw-500 text-body" style="">從佈景主題庫中，更換佈景主題樣式。</div>`,
              ``,
            ].join('')}
          </div>
        `),
        BgWidget.card(html`
          <div class="d-flex flex-column" style="gap:5px;">
            ${[
              `<div class="tx_normal fs-6 fw-bold">熱門免費佈景主題</div>`,
              `<div class="tx_normal fs-sm fw-500 text-body" style="">佈景主題涵蓋核心功能，無需編寫程式碼即可讓您輕鬆自訂。</div>`,
              `<div class="w-100 border-top my-2"></div>`,
              gvc.bindView(()=>{
                return {
                  bind:gvc.glitter.getUUID(),
                  view:async ()=>{
                    const templateList = (await ApiPageConfig.getTemplateList()).response.result.reverse();
                    return templateList
                      .map((dd:any) => {
                        return html` <div class="w-100 h-100 parent mx-auto" style="cursor:pointer;">
      <div class="hoverBlock shadow rounded-3" style="position: relative;">
        <div
          class=" "
          style="width: 100%;
 position: relative;
 border-top-left-radius: 12.24px;
 border-top-right-radius: 12.24px;
top:0px;

             background-image: url('${dd.template_config.image[0]}');
 /* 设置背景图片的URL */
    background-size: cover;
 /* 将背景图片放大以覆盖整个容器 */
    background-position: center;
 /* 将背景图片水平和垂直居中对齐 */
    background-repeat: no-repeat;
 /* 防止背景图片重复 */
                 padding-bottom: 133%;"
        ></div>
        <div
          class="hoverPlace"
          style="position: absolute;width: 100%;height: 100%;background:rgba(255, 255, 255, 0.5);top: 0px;left: 0px;align-items: center;justify-content: center;gap:0px;opacity: 0;z-index: 2;"
        >
          <div
            class="btn btn-sm bgf6 text-black border"
            style="color: black !important;width: 60px;height: 28px;"
          >
            預覽
          </div>
          <div
            class="btn btn-primary-c addTheme"
            style="color: black;width: 40px;margin-left: 10px;color: white;height: 28px;background:#393939;"
          >
            新增
          </div>
        </div>
      </div>
      <div
        class="flex-fill py-3"
        style="display: flex;flex-direction: column;gap: 10px;"
      >
        <div
          class="fs-5"
          style="color: black;text-align: start;font-size: 24px;font-style: normal;font-weight: 600;line-height: 100%;"
        >
          ${dd.template_config.name}
        </div>
        <div class="d-flex flex-wrap" style="gap: 5px;" >
          ${
            dd.template_config.tag.map((dd:any)=>{
              return `  <div
            class="badge bg-primary text-white"
            style="color: rgb(218, 187, 131);text-align: start;font-size: 14px;font-style: normal;font-weight: 600;line-height: 100%;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);;"
          >
            ${dd}
          </div>`
            }).join('')
          }
        </div>
      </div>
    </div>`;
                      }).map((dd:string)=>{
                       
                        return `<div class="col-6 col-lg-4">${dd}</div>`
                      })
                      .join('')
                  },
                  divCreate:{
                    class:`row`
                  }
                }
              }),

            ].join('')}
          </div>
        `),
      ].join(`<div class="my-3"></div>`),
      {
        style: 'max-width:950px;',
      }
    );
  }
}

(window as any).glitter.setModule(import.meta.url, AppDesign);
