import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { PayConfig } from './pay-config.js';
import { ConnectionMode } from './connection-mode.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { OrderDetail } from './models.js';

const html = String.raw;

export class PaymentFunction {
    public static cashFinish(gvc: GVC, total: number, callback: (result: boolean) => void) {
        gvc.addStyle(`
            .dialog-box {
                width: 100vw;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 10000;
            }

            .dialog-absolute {
                width: 100%;
                border-top: 1px solid #e2e5f1;
                position: absolute;
                left: 0px;
                bottom: 0px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }

            .hover-cancel {
                background-color: #fff;
                border-radius: 0 0 0 0.5rem;
            }

            .hover-cancel:hover {
                background-color: #e6e6e6;
            }

            .hover-save {
                background-color: #393939;
                border-radius: 0 0 0.5rem;
            }

            .hover-save:hover {
                background-color: #646464;
            }
        `);
        const dialog = new ShareDialog(gvc.glitter);
        gvc.glitter.innerDialog(
            (gvc: GVC) => {
                return html`
                    <div class="dialog-box">
                        <div class="dialog-content position-relative pb-5" style="width: 452px;max-width: calc(100% - 20px);">
                            <div
                                class="my-3 fs-6 fw-500 text-center"
                                style="white-space: normal; overflow-wrap: anywhere;font-size: 28px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;"
                            >
                                請先收取現金後進行結帳
                            </div>
                            <div style="font-size: 18px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.72px;">
                                本次結帳金額為 <span style="font-size: 28px;font-style: normal;font-weight: 700;line-height: 160%;">$${total.toLocaleString()}</span>
                            </div>
                            <div class="d-flex align-items-center justify-content-center" style="margin-top: 24px;font-size: 16px;font-weight: 700;letter-spacing: 0.64px;">
                                <div
                                    style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;width:120px;text-align:center;"
                                    onclick="${gvc.event(() => {
                                        gvc.glitter.closeDiaLog();
                                    })}"
                                >
                                    取消
                                </div>
                                <div
                                    style="border-radius: 10px;background: #393939;padding: 12px 24px;color: #FFF;margin-left: 24px;width:120px;text-align:center;"
                                    onclick="${gvc.event(() => {
                                        gvc.closeDialog();
                                        callback(true);
                                    })}"
                                >
                                    確認
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },
            'orderFinish',
            {
                dismiss: () => {
                    // vm.type = "list";
                },
            }
        );
    }

    public static creditFinish(gvc: GVC, total: number, orderDetail: any, callback: (result: boolean) => void) {
        const dialog = new ShareDialog(gvc.glitter);

        const pwd = orderDetail.payment_setting.find((dd: any) => {
            return dd.key === 'ut_credit_card';
        }).pwd;
        gvc.glitter.innerDialog(
            (gvc: GVC) => {
                if (PayConfig.deviceType === 'pos') {
                    gvc.glitter.runJsInterFace(
                        'credit_card',
                        {
                            amount: `${total}`,
                            memo: `訂單ID:${orderDetail.orderID}`,
                            orderID:orderDetail.orderID,
                            pwd: pwd,
                        },
                        (res: any) => {
                           const response=JSON.parse(res.result.data);
                            if (response.code === "250" ) {
                                gvc.closeDialog();
                                callback(true);
                            } else {
                                gvc.closeDialog();
                                // callback(false);
                                dialog.errorMessage({ text: `交易失敗，失敗原因:${response.msg ?? ''}` });
                            }
                        }
                    );
                } else if (ConnectionMode.on_connected_device) {
                    gvc.glitter.share.credit_card_callback = (res: any) => {
                      const response=JSON.parse(res.result.data);
                      if (response.code === "250" ) {
                        gvc.closeDialog();
                        callback(true);
                      } else {
                        gvc.closeDialog();
                        dialog.errorMessage({ text: `交易失敗，失敗原因:${response.msg ?? ''}` });
                      }
                    };
                    ConnectionMode.sendCommand({
                        cmd: 'credit_card',
                        amount: `${total}`,
                        memo: `訂單ID:${orderDetail.orderID}`,
                        orderID:orderDetail.orderID,
                        pwd: pwd,
                    });
                } else {
                    setTimeout(() => {
                        gvc.closeDialog();
                        dialog.errorMessage({ text: '尚未連線至刷卡機' });
                    }, 100);
                }

                return html`
                    <div class="dialog-box">
                        <div class="dialog-content position-relative "
                             style="width: 370px;max-width: calc(100% - 20px);">
                            <div class="my-3  fw-500 text-center"
                                 style="white-space: normal; overflow-wrap: anywhere;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;">
                                請感應或插入信用卡進行付款
                            </div>
                            <div style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.72px;">
                                若逾時將重新選擇付款方式
                            </div>
                            <img class="mt-3" style="max-width:70%;"
                                 src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_scsds7s8sbsfs3s8_b00f1f368f2a9b9fb067a844f940ca2a.gif"></img>
                            <div class="fw-500 w-100 mt-3"
                                 style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;width:120px;text-align:center;"
                                 onclick="${gvc.event(() => {
                                     // clearTimeout(timer)
                                     gvc.glitter.closeDiaLog();
                                 })}">取消付款
                            </div>
                        </div>
                    </div>
                `;
            },
            'orderFinish',
            {
                dismiss: () => {
                    // vm.type = "list";
                },
            }
        );
    }

    public static lineFinish(gvc: GVC, total: number, prefix: number, orderDetail: OrderDetail, callback: (result: boolean) => void) {
        const dialog = new ShareDialog(gvc.glitter);
        gvc.glitter.innerDialog(
            (gvc: GVC) => {
                let block = false;
                PayConfig.onPayment = (scanText) => {
                    if (block) {
                        return;
                    }
                    dialog.dataLoading({ visible: true });
                    ApiShop.toPOSLinePay({
                        amount: total,
                        currency: 'TWD',
                        orderId: `${orderDetail.orderID}-${orderDetail.line_prefix || 0}`,
                        productName: orderDetail.lineItems
                            .map((data: any) => {
                                return `${data.title} * ${data.count}`;
                            })
                            .join(','),
                        oneTimeKey: scanText,
                    }).then((res) => {
                        dialog.dataLoading({ visible: false });
                        if (!res.result || !res.response.result) {
                            dialog.errorMessage({ text: '交易失敗' });
                            callback(false);
                        } else {
                            gvc.closeDialog();
                            PayConfig.onPayment = undefined;
                            callback(true);
                        }
                    });
                };
                let m_text = '';
                return html`
                    <div class="dialog-box">
                        <div class="dialog-content position-relative "
                             style="width: 370px;max-width: calc(100% - 20px);">
                            <div class="my-3  fw-500 text-center"
                                 style="white-space: normal; overflow-wrap: anywhere;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 2.8px;">
                                請掃描LINE Pay付款條碼
                            </div>
                            <img class="mt-3" style="max-width:70%;"
                                 src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s6sfs4scs5s3s0sa_Screenshot2024-09-06at12.28.00 PM.jpg"></img>
                            <div class="d-flex w-100 align-items-center mt-3"
                                 style="border:1px solid grey;height: 50px;">
                                <input
                                        class="form-control h-100"
                                        style="border: none;"
                                        placeholder="請輸入或掃描付款代碼"
                                        onchange="${gvc.event((e, event) => {
                                            m_text = e.value;
                                        })}"
                                        value="${m_text || ''}"
                                        onfocus="${gvc.event(() => {
                                            block = true;
                                        })}"
                                        onblur="${gvc.event(() => {
                                            block = false;
                                        })}"
                                />
                                <div class="flex-fill"></div>
                                <div
                                        style="background: grey;width: 50px;"
                                        class="d-flex align-items-center justify-content-center text-white h-100"
                                        onclick="${gvc.event(() => {
                                            gvc.glitter.runJsInterFace('start_scan', {}, (res) => {
                                                PayConfig.onPayment!(res.text);
                                            });
                                        })}"
                                >
                                    <i class="fa-regular fa-barcode-read"></i>
                                </div>
                            </div>
                            <div class="d-flex align-items-center justify-content-center w-100"
                                 style="margin-top: 24px;font-size: 16px;font-weight: 700;letter-spacing: 0.64px;">
                                <div
                                        class="flex-fill"
                                        style="border-radius: 10px;border: 1px solid #DDD;background: #FFF;padding: 12px 24px;color: #393939;text-align:center;"
                                        onclick="${gvc.event(() => {
                                            PayConfig.onPayment = undefined;
                                            gvc.glitter.closeDiaLog();
                                        })}"
                                >
                                    取消
                                </div>
                                <div class="mx-2"></div>
                                <div
                                        class="flex-fill"
                                        style="border-radius: 10px;background: #393939;padding: 12px 24px;color: #FFF;text-align:center;"
                                        onclick="${gvc.event(async () => {
                                            if (!m_text) {
                                                dialog.errorMessage({ text: '請輸入交易條碼' });
                                                return;
                                            }
                                            block = false;
                                            PayConfig.onPayment!(m_text);
                                        })}"
                                >
                                    確定
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },
            'orderFinish',
            {
                dismiss: () => {
                    // vm.type = "list";
                    gvc.glitter.share.scan_back = () => {};
                },
            }
        );
    }
}
