var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { PosFunction } from './pos-function.js';
const html = String.raw;
export class CreditCard {
    static refundView(gvc) {
        const vm = {
            orderID: '',
            transactionID: '',
            refund: '',
        };
        BgWidget.settingDialog({
            gvc: gvc,
            title: '信用卡刷退',
            innerHTML: (gvc) => {
                return `<div>${[
                    BgWidget.editeInput({
                        title: '訂單編號',
                        gvc: gvc,
                        style: `background:white;`,
                        default: vm.orderID,
                        placeHolder: '請輸入訂單編號',
                        callback: text => {
                        },
                        onclick: () => {
                            PosFunction.setMoney(gvc, vm.orderID, money => {
                                vm.orderID = `${money}`;
                                gvc.recreateView();
                            }, '退款金額');
                        },
                        readonly: true
                    }),
                    BgWidget.editeInput({
                        title: '金流編號',
                        gvc: gvc,
                        style: `background:white;`,
                        default: vm.transactionID,
                        placeHolder: '請輸入金流編號',
                        callback: text => {
                        },
                        onclick: () => {
                            PosFunction.setMoney(gvc, vm.transactionID, money => {
                                vm.transactionID = `${money}`;
                                gvc.recreateView();
                            }, '金流編號');
                        },
                        readonly: true
                    }),
                    BgWidget.editeInput({
                        title: '退款金額',
                        gvc: gvc,
                        style: `background:white;`,
                        default: `${vm.refund}`,
                        placeHolder: '請輸入退款金額',
                        callback: text => {
                        },
                        onclick: () => {
                            PosFunction.setMoney(gvc, vm.refund, money => {
                                vm.refund = `${money}`;
                                gvc.recreateView();
                            }, '退款金額');
                        },
                        readonly: true
                    })
                ].join('')}</div>`;
            },
            footer_html: gvc => {
                return [
                    BgWidget.save(gvc.event(() => {
                        gvc.glitter.runJsInterFace('toCreditCardHistory', {}, () => { });
                    }), '查詢刷卡紀錄'),
                    BgWidget.danger(gvc.event(() => __awaiter(this, void 0, void 0, function* () {
                        const dialog = new ShareDialog(gvc.glitter);
                        dialog.dataLoading({
                            visible: true,
                        });
                        const saasConfig = window.parent.saasConfig;
                        gvc.glitter.runJsInterFace('CreditCardRefund', {
                            order_id: vm.orderID,
                            transaction_id: vm.transactionID,
                            amount: `${vm.refund}`,
                            pwd: (yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'glitter_finance')).response.result[0]['value'].ut_credit_card.pwd
                        }, () => {
                            dialog.dataLoading({
                                visible: false,
                            });
                            gvc.closeDialog();
                        });
                    })), '退刷'),
                ].join('');
            },
        });
    }
}
