var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { ApiCart } from '../../glitter-base/route/api-cart.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { ShipmentConfig } from '../../glitter-base/global/shipment-config.js';
import { PdClass } from '../product/pd-class.js';
export class CartModule {
    static getLineItemAndShipmentCart() {
        return __awaiter(this, void 0, void 0, function* () {
            const vm = {
                shippings: [],
                dataList: [],
                logisticsGroup: [],
                hasFullLengthCart: false,
            };
            const cart = new ApiCart(ApiCart.checkoutCart).cart;
            yield Promise.all([
                ShipmentConfig.list,
                new Promise(resolve => {
                    ApiShop.getProduct({
                        page: 0,
                        limit: 10000,
                        status: 'inRange',
                        show_hidden: true,
                        productType: 'all',
                        id_list: [...new Set(cart.line_items.map(item => item.id))].join(','),
                    }).then(d => {
                        resolve(d);
                    });
                }),
                ApiUser.getPublicConfig('logistics_group', 'manager').then(r => r.response.value),
            ]).then((dataArray) => __awaiter(this, void 0, void 0, function* () {
                vm.shippings = [...dataArray[0]].map(item => {
                    item.cartLength = 0;
                    return item;
                });
                vm.logisticsGroup = dataArray[2];
                vm.dataList = [
                    ...vm.shippings.map(item => {
                        return {
                            logistic: item.value,
                            group: vm.logisticsGroup
                                .filter(group => {
                                return group.list.includes(item.value);
                            })
                                .map(item => {
                                return item.key;
                            }),
                            cart: [],
                        };
                    }),
                ];
                if (!dataArray[1].result || !dataArray[1].response) {
                    return vm;
                }
                const products = dataArray[1].response.data;
                for (const item of cart.line_items) {
                    const product = products.find((p) => `${p.id}` === `${item.id}`);
                    if (product) {
                        const productLogi = product.content.designated_logistics;
                        for (const data of vm.dataList) {
                            const findShip = vm.shippings.find(ship => ship.value === data.logistic);
                            if (findShip) {
                                if (productLogi === undefined || productLogi.type === 'all') {
                                    findShip.cartLength++;
                                    continue;
                                }
                                const findGroup = vm.logisticsGroup.find(group => productLogi.group.includes(group.key));
                                if (findGroup && findGroup.list.includes(data.logistic)) {
                                    findShip.cartLength++;
                                    continue;
                                }
                            }
                        }
                    }
                }
                for (const item of cart.line_items) {
                    const product = products.find((p) => `${p.id}` === `${item.id}`);
                    if (product) {
                        const variant = PdClass.getVariant(product.content, { specs: item.spec });
                        const lineItem = {
                            id: item.id,
                            title: product.content.title,
                            count: item.count,
                            spec: item.spec,
                            specs: product.content.specs,
                            price: variant ? variant.sale_price : 0,
                            image: yield (() => __awaiter(this, void 0, void 0, function* () {
                                if (!variant) {
                                    if (product.content && product.content.preview_image) {
                                        return product.content.preview_image[0];
                                    }
                                    return this.noImageURL;
                                }
                                const img = yield this.isImageUrlValid(variant.preview_image).then(isValid => {
                                    return isValid ? variant.preview_image : product.content.preview_image[0] || this.noImageURL;
                                });
                                return img;
                            }))(),
                        };
                        const productLogi = product.content.designated_logistics;
                        for (const data of vm.dataList) {
                            if (productLogi === undefined || productLogi.type === 'all') {
                                data.cart.push(lineItem);
                                continue;
                            }
                            const filterGroup = vm.logisticsGroup.filter(group => productLogi.group.includes(group.key));
                            for (const group of filterGroup) {
                                if (group && group.list.includes(data.logistic)) {
                                    data.cart.push(lineItem);
                                }
                            }
                        }
                    }
                }
                vm.dataList = vm.dataList.filter(item => item.cart.length > 0);
                const filterFullShipping = vm.dataList.filter(item => item.cart.length === cart.line_items.length);
                if (filterFullShipping.length > 0) {
                    vm.dataList = filterFullShipping;
                    vm.hasFullLengthCart = true;
                }
            }));
            return vm;
        });
    }
    static isImageUrlValid(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    static addStyle(gvc, classPrefix) {
        gvc.addStyle(`
      .${classPrefix}-container {
        max-width: 1200px !important;
        margin: 2.5rem auto !important;
      }

      .${classPrefix}-null-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh !important;
      }

      .${classPrefix}-header {
        color: #393939;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 12px;
        text-align: center;
        margin-bottom: 24px;
      }

      .${classPrefix}-banner-bgr {
        padding: 1rem;
        border-radius: 10px;
        background: #f6f6f6;
      }

      .${classPrefix}-banner-text {
        color: #393939;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 2px;
      }

      .${classPrefix}-text-1 {
        color: #393939;
        font-size: 20px;
      }

      .${classPrefix}-text-2 {
        color: #393939;
        font-size: 16px;
      }

      .${classPrefix}-text-3 {
        color: #393939;
        font-size: 14px;
      }

      .${classPrefix}-label {
        color: #393939;
        font-size: 16px;
        margin-bottom: 8px;
      }

      .${classPrefix}-bold {
        font-weight: 700;
      }

      .${classPrefix}-button-bgr {
        width: 100%;
        border: 0;
        border-radius: 0.375rem;
        height: 40px;
        background: #393939;
        padding: 0 24px;
        margin: 18px 0;
      }

      .${classPrefix}-button-bgr-disable {
        width: 100%;
        border: 0;
        border-radius: 0.375rem;
        height: 40px;
        background: #dddddd;
        padding: 0 24px;
        margin: 18px 0;
        cursor: not-allowed !important;
      }

      .${classPrefix}-button-text {
        color: #fff;
        font-size: 16px;
      }

      .${classPrefix}-input {
        width: 100%;
        border-radius: 10px;
        border: 1px solid #ddd;
        height: 40px;
        padding: 0px 18px;
      }

      .${classPrefix}-select {
        display: flex;
        padding: 7px 30px 7px 18px;
        max-height: 40px;
        align-items: center;
        gap: 6px;
        border-radius: 10px;
        border: 1px solid #ddd;
        background: transparent url('https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1718100926212-Vector 89.png')
          no-repeat;
        background-position-x: calc(100% - 12px);
        background-position-y: 16px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        color: #393939;
        background-color: white;
      }

      .${classPrefix}-select:focus {
        outline: 0;
      }

      .${classPrefix}-group-input {
        border: none;
        background: none;
        text-align: start;
        color: #393939;
        font-size: 16px;
        font-weight: 400;
        word-wrap: break-word;
        padding-left: 12px;
      }

      .${classPrefix}-first-td {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30%;
      }

      .${classPrefix}-group-input:focus {
        outline: 0;
      }

      .${classPrefix}-group-button {
        padding: 9px 18px;
        background: #393939;
        align-items: center;
        gap: 5px;
        display: flex;
        font-size: 16px;
        justify-content: center;
        cursor: pointer;
      }

      .${classPrefix}-td {
        display: flex;
        align-items: center;
        justify-content: start;
        width: 15%;
      }

      .${classPrefix}-first-td {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40%;
      }

      .${classPrefix}-price-container {
        display: flex;
        flex-direction: column;
        width: 400px;
        align-items: center;
        padding: 0;
        gap: 12px;
        margin: 24px 0;
      }

      .${classPrefix}-price-row {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
      }

      .${classPrefix}-origin-price {
        text-align: end;
        font-weight: 400;
        word-wrap: break-word;
        text-decoration: line-through;
        color: #636363;
        font-style: italic;
        margin-top: auto;
      }

      .${classPrefix}-add-item-badge {
        height: 22px;
        padding-left: 6px;
        padding-right: 6px;
        padding-top: 4px;
        padding-bottom: 4px;
        background: #ffe9b2;
        border-radius: 7px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        display: inline-flex;
      }

      .${classPrefix}-add-item-text {
        color: #393939;
        font-size: 14px;
        font-weight: 400;
        word-wrap: break-word;
      }

      .${classPrefix}-shipping-hint {
        white-space: normal;
        word-break: break-all;
        color: #8d8d8d;
        font-size: 14px;
        font-weight: 400;
        margin: 4px 0;
      }

      .${classPrefix}-price-text {
        color: #ff5353ff;
      }

      .${classPrefix}-danger-text {
        color: #ff5353ff;
        font-size: 14px;
        font-weight: 500;
      }

      .img-106px {
        width: 106px;
        min-width: 106px;
        height: 106px;
        border-radius: 3px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }

      .banner-font-15 {
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        max-width: 130px;
        text-overflow: ellipsis;
      }

      .ntd-font-14 {
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 140%;
      }

      @media (max-width: 768px) {
        .${classPrefix}-container {
          max-width: 100% !important;
          margin: 2.5rem auto !important;
        }

        .${classPrefix}-td {
          display: flex;
          align-items: center;
          justify-content: start;
          width: 100%;
        }

        .${classPrefix}-66text {
          color: #666666;
        }

        .${classPrefix}-price-container {
          display: flex;
          flex-direction: column;
          width: 100% !important;
          align-items: center;
          padding: 0;
          gap: 12px;
          margin: 24px 0;
        }
      }
    `);
    }
}
CartModule.noImageURL = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg';
