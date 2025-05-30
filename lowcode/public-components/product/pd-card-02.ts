import { GVC } from '../../glitterBundle/GVController.js';
import { PdClass } from './pd-class.js';
import { ApiUser } from '../../glitter-base/route/user.js';

const html = String.raw;

export class ProductCard02 {
  static noImageURL = 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png';

  static main(gvc: GVC, widget: any, subData: any) {
    const glitter = gvc.glitter;
    const prod = typeof subData.content !== 'object' ? subData : subData.content;
    let label: any = {};
    let loading = false;
    const titleFontColor = glitter.share.globalValue['theme_color.0.title'] ?? '#333333';
    const borderButtonBgr = glitter.share.globalValue['theme_color.0.border-button-bg'] ?? '#fff';
    const borderButtonText = glitter.share.globalValue['theme_color.0.border-button-text'] ?? '#333333';
    const vm = {
      quantity: '1',
      data: prod,
      specs: prod.specs.map((spec: { option: { title: string }[] }) => {
        return spec.option[0].title;
      }),
      wishStatus: (glitter.share.wishList ?? []).some((item: { id: number }) => {
        return item.id === prod.id;
      }),
    };

    // 設定 ratio
    let ratio = widget.formData.ratio || '1:1';
    if (ratio.split(':').length !== 2) {
      ratio = '1:1';
    }
    const rsp = ratio.split(':').map((dd: string) => Number(dd));

    // 設定 radius
    let radius = widget.formData.border.split(',');
    if (radius.length !== 4) {
      radius = [20, 20, 20, 20];
    }

    // changePage function
    let changePage = (index: string, type: 'page' | 'home', subData: any) => {};
    gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
      changePage = cl.changePage;
    });

    // add style
    PdClass.addSpecStyle(gvc);
    gvc.addStyle(`
      .card-border {
        border-radius: 0;
        border: 0;
        overflow: hidden;
        background: none !important;
      }
      .card-image {
        cursor: pointer;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        position: relative;
        overflow: hidden;
      }
      .card-image-fit-center {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
      .add-cart-child {
        width: 45px;
        height: 45px;
        cursor: pointer;
      }
      .add-cart-text {
        font-size: 16px;
        font-weight: 500;
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 10px;
      }
      .wish-button {
        cursor: pointer;
        position: absolute;
        right: 15px;
        top: 15px;
        min-height: 40px;
        min-width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 50%;
        z-index: 2;
      }
      .card-title-container {
        min-height: 55px;
        align-items: center;
        padding-bottom: 10px;
        padding-top: 10px;
      }
      .card-title-text {
        text-align: start;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 1.76px;
        color: #322b25;
      }
      .card-price-container {
        align-items: baseline;
        justify-content: start;
      }
      .card-sale-price {
        font-family: 'Noto Sans';
        text-align: start;
        font-style: normal;
        line-height: normal;
        font-size: 15px;
        opacity: 0.9;
        color: #322b25;
      }
      .card-cost-price {
        font-family: 'Noto Sans';
        text-align: start;
        color: #d45151;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: 14px;
        margin-right: 4px;
      }
    `);

    const labelID = glitter.getUUID();

    function getImgSrc(index: number) {
      const innerText = prod.preview_image[index] || prod.preview_image[0] || ProductCard02.noImageURL;
      let rela_link = innerText;
      if (innerText.includes('size1440_s*px$_')) {
        [150, 600, 1200, 1440].reverse().map(dd => {
          if (document.body.clientWidth < dd) {
            rela_link = innerText.replace('size1440_s*px$_', `size${dd}_s*px$_`);
          }
        });
      }
      return rela_link;
    }

    return html`<div
      class="card mb-7 card-border"
      style="cursor: pointer"
      onclick="${gvc.event(() => {
        if (PdClass.isShoppingPage()) {
          PdClass.addCartAction({
            gvc: gvc,
            titleFontColor: titleFontColor,
            prod: prod,
            vm: vm,
          });
        } else {
          PdClass.changePage(prod, gvc);
        }
      })}"
    >
      <div
        class="card-img-top parent card-image position-relative"
        style="border-radius: ${radius.map((dd: string) => `${dd}px`).join(' ')};
        padding-bottom: ${((rsp[1] / rsp[0]) * 100).toFixed(0)}%;"
      >
        ${gvc.bindView({
          bind: labelID,
          view: () => {
            if (prod.label && !loading) {
              ApiUser.getPublicConfig('promo-label', 'manager').then((data: any) => {
                label = data.response.value.find((item: { id: number }) => item.id == prod.label);
                loading = true;
                gvc.notifyDataChange(labelID);
              });
            }
            if (Object.entries(label).length > 0) {
              function showPosition() {
                switch (label.data.position) {
                  case '左上':
                    return `left:0;top:0;`;
                  case '右上':
                    return `right:0;top:0;`;
                  case '左下':
                    return `left:0;bottom:0;`;
                  default:
                    return `right:0;bottom:0;`;
                }
              }
              return html` <div style="position: absolute;${showPosition()};z-index:2;">${label.data.content}</div> `;
            }
            return ``;
          },
          divCreate: { class: `probLabel w-100 h-100`, style: `position: absolute;left: 0;top: 0;` },
        })}
        <img
          class="card-image-fit-center"
          src="${getImgSrc(0)}"
          onmouseover="${gvc.event((e, event) => {
            if (widget.formData.show_second === 'true') {
              e.src = getImgSrc(1);
            }
          })}"
          onmouseleave="${gvc.event((e, event) => {
            if (widget.formData.show_second === 'true') {
              e.src = getImgSrc(0);
            }
          })}"
        />
      </div>

      <div class="card-collapse-parent">
        <div class="d-flex card-title-container justify-content-between align-items-center">
          <div class="row gx-0 mb-1" style="max-width:calc(100% - 50px);">
            <div class="col-12 mb-1">
              <div class="w-100 d-flex ${PdClass.isPad() ? 'justify-content-center' : ''}">
                <span class="card-title-text" style="white-space: normal;word-break: break-all;">${prod.title}</span>
              </div>
            </div>
            <div
              class="d-block col-12 p-0  ${(window as any).store_info.interval_price_card
                ? 'd-lg-flex flex-column'
                : 'd-lg-flex gap-1'} card-price-container"
            >
              ${(() => {
                // 取得最低價和最高價規格
                const { minVariant, maxVariant } = PdClass.getSpecPriceRange(prod.variants);

                // 根據是否有價格範圍決定回傳值
                return minVariant && maxVariant
                  ? PdClass.priceViewer(minVariant, maxVariant)
                  : (prod.variants[0]?.sale_price ?? '價格錯誤');
              })()}
            </div>
          </div>
          <div class="add-cart-child">
            ${(() => {
              const isAllUnderstocking = prod.variants.every((item: any) => item.show_understocking === 'true');
              const stockTotal = prod.variants.reduce((sum: number, item: any) => sum + item.stock, 0);
              const isSoldOut = isAllUnderstocking && stockTotal === 0;

              return html`<div
                class="w-100 h-100 p-3 add-cart-text"
                style="border-radius: 50%; color: ${borderButtonText}; border: 1px solid ${borderButtonBgr}; ${isSoldOut
                  ? 'background-color: #d5d5d5'
                  : ''}"
                onclick="${gvc.event((_, event) => {
                  event.stopPropagation();

                  if (!isSoldOut) {
                    PdClass.addCartAction({
                      gvc: gvc,
                      titleFontColor: titleFontColor,
                      prod: prod,
                      vm: vm,
                    });
                  }
                })}"
              >
                ${isSoldOut ? html`<i class="fa-solid fa-ban"></i>` : html`<i class="fa-solid fa-cart-plus"></i>`}
              </div>`;
            })()}
          </div>
        </div>
      </div>
      <div class="checkout-container"></div>
    </div>`;
  }
}

(window as any).glitter.setModule(import.meta.url, ProductCard02);
