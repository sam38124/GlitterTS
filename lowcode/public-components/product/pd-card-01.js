import { PdClass } from './pd-class.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { Language } from '../../glitter-base/global/language.js';
const html = String.raw;
export class ProductCard01 {
    static main(gvc, widget, subData) {
        var _a, _b;
        const glitter = gvc.glitter;
        const prod = typeof subData.content !== 'object' ? subData : subData.content;
        const titleFontColor = (_a = glitter.share.globalValue['theme_color.0.title']) !== null && _a !== void 0 ? _a : '#333333';
        let label = {};
        let loading = false;
        const vm = {
            quantity: '1',
            data: prod,
            specs: prod.specs.map((spec) => {
                return spec.option[0].title;
            }),
            wishStatus: ((_b = glitter.share.wishList) !== null && _b !== void 0 ? _b : []).some((item) => {
                return item.id === prod.id;
            }),
        };
        let ratio = widget.formData.ratio || '1:1';
        if (ratio.split(':').length !== 2) {
            ratio = '1:1';
        }
        const rsp = ratio.split(':').map((dd) => Number(dd));
        let radius = widget.formData.border.split(',');
        if (radius.length !== 4) {
            radius = [20, 20, 20, 20];
        }
        let changePage = (index, type, subData) => { };
        gvc.glitter.getModule(new URL('./official_event/page/change-page.js', gvc.glitter.root_path).href, cl => {
            changePage = cl.changePage;
        });
        PdClass.addSpecStyle(gvc);
        gvc.addStyle(`
      .card-border {
        cursor: pointer;
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
        width: 100%;
        height: 45px;
        cursor: pointer;
        position: absolute;
        bottom: 0px;
        z-index: 2;
      }
      .add-cart-text {
        font-size: 16px;
        font-weight: 500;
        word-wrap: break-word;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #322b25;
        color: #ffffff;
      }
      .wish-button {
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
        font-size: ${glitter.ut.frSize({ sm: '16' }, '14')}px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 1.76px;
        color: #322b25;
      }
      .ellipsis {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2; /* 限制顯示的行數 */
        line-height: 1.5; /* 行高，可以調整 */
        max-height: calc(1.5em * 2); /* 設定最大高度，對應行高和行數 */
        text-align: start;
      }
      .card-price-container {
        align-items: baseline;
        justify-content: start;
      }
      .card-sale-price {
        font-family: 'Noto Sans';
        text-align: center;
        font-style: normal;
        line-height: normal;
        font-size: ${glitter.ut.frSize({ sm: '16' }, '14')}px;
        opacity: 0.9;
        color: #322b25;
      }
      .card-cost-price {
        font-family: 'Noto Sans';
        text-align: center;
        color: #d45151;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: 14px;
        margin-right: 4px;
      }
    `);
        const labelID = glitter.getUUID();
        function getImgSrc(index) {
            const innerText = prod.preview_image[index] || prod.preview_image[0] || ProductCard01.noImageURL;
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
        return html ` <div
      class="card mb-7 card-border"
      onclick="${gvc.event(() => {
            if (PdClass.isShoppingPage()) {
                PdClass.addCartAction({
                    gvc: gvc,
                    titleFontColor: titleFontColor,
                    prod: prod,
                    vm: vm,
                });
            }
            else {
                PdClass.changePage(prod, gvc);
            }
        })}"
    >
      <div
        class="card-img-top parent card-image position-relative"
        style="overflow: hidden;  border-radius: ${radius.map((dd) => `${dd}px`).join(' ')};
        padding-bottom: ${((rsp[1] / rsp[0]) * 100).toFixed(0)}%;"
      >
        ${gvc.bindView({
            bind: labelID,
            view: () => {
                if (prod.label && !loading) {
                    ApiUser.getPublicConfig('promo-label', 'manager').then((data) => {
                        label = data.response.value.find((item) => item.id == prod.label);
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
                    return html ` <div style="position: absolute;${showPosition()};z-index:2;">${label.data.content}</div> `;
                }
                return ``;
            },
            divCreate: { class: `probLabel w-100 h-100`, style: `position: absolute;left: 0;top: 0;` },
        })}
        <img
          class="card-image-fit-center "
          src="${getImgSrc(0)}"
          onmouseover="${gvc.event(e => {
            if (widget.formData.show_second === 'true') {
                e.src = getImgSrc(1);
            }
        })}"
          onmouseleave="${gvc.event(e => {
            if (widget.formData.show_second === 'true') {
                e.src = getImgSrc(0);
            }
        })}"
        />
        <div class="child add-cart-child">
          ${(() => {
            const isAllUnderstocking = prod.variants.every((item) => item.show_understocking === 'true');
            const stockTotal = prod.variants.reduce((sum, item) => sum + item.stock, 0);
            const isSoldOut = isAllUnderstocking && stockTotal === 0;
            return html `<div
              class="w-100 h-100 p-3 add-cart-text"
              style="${isSoldOut ? 'background-color: #aeaeae' : ''}"
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
              ${isSoldOut
                ? html `<i class="fa-solid fa-ban me-2"></i>${Language.text('sold_out')}`
                : html `<i class="fa-regular fa-cart-shopping me-2"></i>${Language.text('add_to_cart')}`}
            </div>`;
        })()}
        </div>
      </div>
      <div class="card-collapse-parent cursor_pointer">
        <div>
          <div class="row gx-0 card-title-container mb-1">
            <div class="col-12 mb-1">
              <div class="w-100 d-flex ${PdClass.isPad() ? 'justify-content-center' : ''}">
                <span class="card-title-text ellipsis">${prod.title}</span>
              </div>
            </div>
            <div
              class="d-block col-12 p-0  ${window.store_info.interval_price_card
            ? 'd-lg-flex flex-column'
            : 'd-lg-flex gap-2'} card-price-container"
            >
              ${(() => {
            var _a, _b;
            const { minVariant, maxVariant } = PdClass.getSpecPriceRange(prod.variants);
            return minVariant && maxVariant
                ? PdClass.priceViewer(minVariant, maxVariant)
                : ((_b = (_a = prod.variants[0]) === null || _a === void 0 ? void 0 : _a.sale_price) !== null && _b !== void 0 ? _b : '價格錯誤');
        })()}
            </div>
          </div>
        </div>
      </div>
      <div class="checkout-container"></div>
    </div>`;
    }
}
ProductCard01.noImageURL = 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png';
window.glitter.setModule(import.meta.url, ProductCard01);
