var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PayConfig } from './pay-config.js';
import { PaymentPage } from './payment-page.js';
export class IminModule {
    static init() {
        return new Promise((resolve, reject) => {
            window.glitter.addMtScript([
                'https://oss-sg.imin.sg/web/iMinPartner/js/imin-printer.min.js',
                'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
                window.glitter.root_path + 'jslib/qrcode-d.js',
            ], () => {
                resolve(true);
            }, () => {
                resolve(false);
            });
        });
    }
    static printInvoice(invoice, orderID, staff_title) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IminModule.init();
            if (window.parent.glitter.share.PayConfig.posType === 'SUNMI') {
                IminModule.printInvoiceSunMi(invoice, orderID, staff_title);
                return;
            }
            const IminPrintInstance = window.IminPrintInstance;
            function generateBarcodeBase64(barcodeString) {
                const canvas = document.createElement('canvas');
                JsBarcode(canvas, barcodeString, {
                    format: 'CODE128',
                    lineColor: '#000000',
                    width: 2,
                    height: 50,
                    displayValue: false,
                });
                const base64String = canvas.toDataURL('image/png');
                console.log('Base64 Barcode:', base64String);
                return base64String;
            }
            yield IminPrintInstance.setAlignment(1);
            yield IminPrintInstance.setTextSize(50);
            yield IminPrintInstance.setTextStyle(1);
            yield IminPrintInstance.printText(PayConfig.pos_config.shop_name);
            yield IminPrintInstance.printAndFeedPaper(20);
            yield IminPrintInstance.setAlignment(1);
            yield IminPrintInstance.setTextSize(40);
            yield IminPrintInstance.setTextStyle(0);
            yield IminPrintInstance.printText('電子發票證明聯');
            yield IminPrintInstance.printAndFeedPaper(5);
            yield IminPrintInstance.setAlignment(1);
            yield IminPrintInstance.setTextSize(50);
            yield IminPrintInstance.setTextStyle(0);
            yield IminPrintInstance.printText(invoice.date);
            yield IminPrintInstance.setAlignment(1);
            yield IminPrintInstance.setTextSize(50);
            yield IminPrintInstance.setTextStyle(0);
            yield IminPrintInstance.printText(invoice.invoice_code);
            yield IminPrintInstance.printAndFeedPaper(5);
            yield IminPrintInstance.setAlignment(0);
            yield IminPrintInstance.setTextSize(24);
            yield IminPrintInstance.setTextStyle(0);
            yield IminPrintInstance.printText(invoice.create_date);
            yield IminPrintInstance.printAndFeedPaper(5);
            yield IminPrintInstance.setAlignment(0);
            yield IminPrintInstance.setTextSize(24);
            yield IminPrintInstance.setTextStyle(0);
            yield IminPrintInstance.printText(`${invoice.random_code}             ${invoice.total}`);
            yield IminPrintInstance.printAndFeedPaper(5);
            yield IminPrintInstance.setAlignment(0);
            yield IminPrintInstance.setTextSize(24);
            yield IminPrintInstance.setTextStyle(0);
            yield IminPrintInstance.printText(`${invoice.sale_gui}        ${invoice.buy_gui}`);
            yield IminPrintInstance.printAndFeedPaper(5);
            IminPrintInstance.printSingleBitmap(generateBarcodeBase64(invoice.bar_code));
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield IminPrintInstance.printAndFeedPaper(5);
                yield IminPrintInstance.setQrCodeSize(2);
                yield IminPrintInstance.setDoubleQRSize(4);
                yield IminPrintInstance.setDoubleQR1MarginLeft(10);
                yield IminPrintInstance.setDoubleQR2MarginLeft(520);
                const ba = (new Blob([invoice.qrcode_0]).size - (new Blob([invoice.qrcode_1]).size)) * 1.1;
                for (let a = 0; a <= ba; a++) {
                    invoice.qrcode_1 += '*';
                }
                yield IminPrintInstance.printDoubleQR([invoice.qrcode_0, invoice.qrcode_1]);
                yield IminPrintInstance.printAndFeedPaper(100);
                yield IminPrintInstance.printAndFeedPaper(5);
                yield IminPrintInstance.setAlignment(1);
                yield IminPrintInstance.setTextSize(40);
                yield IminPrintInstance.setTextStyle(0);
                yield IminPrintInstance.printText('交易明細');
                yield IminPrintInstance.printAndFeedPaper(10);
                yield IminPrintInstance.setAlignment(0);
                yield IminPrintInstance.setTextSize(24);
                yield IminPrintInstance.setTextStyle(0);
                yield IminPrintInstance.printText('時間:' + invoice.create_date);
                yield IminPrintInstance.printAndFeedPaper(5);
                yield IminPrintInstance.setAlignment(0);
                yield IminPrintInstance.setTextSize(24);
                yield IminPrintInstance.setTextStyle(0);
                yield IminPrintInstance.printText('營業人統編:' + invoice.sale_gui.replace('賣方 ', ''));
                yield IminPrintInstance.printAndFeedPaper(5);
                yield IminPrintInstance.setAlignment(0);
                yield IminPrintInstance.setTextSize(24);
                yield IminPrintInstance.setTextStyle(0);
                yield IminPrintInstance.printText('訂單編號:' + orderID);
                yield IminPrintInstance.printAndFeedPaper(5);
                yield IminPrintInstance.setAlignment(0);
                yield IminPrintInstance.setTextSize(24);
                yield IminPrintInstance.setTextStyle(0);
                yield IminPrintInstance.printText('發票號碼:' + invoice.invoice_code);
                yield IminPrintInstance.printAndFeedPaper(5);
                yield IminPrintInstance.setAlignment(0);
                yield IminPrintInstance.setTextSize(24);
                yield IminPrintInstance.setTextStyle(0);
                yield IminPrintInstance.printText('員工:' + staff_title);
                yield IminPrintInstance.printAndFeedPaper(30);
                yield IminPrintInstance.printText('品名               單價*數量               金額 ');
                const pay_what = PaymentPage.stripHtmlTags(invoice.pay_detail);
                for (let a = 0; a < pay_what.length; a++) {
                    yield IminPrintInstance.printAndFeedPaper(5);
                    yield IminPrintInstance.setAlignment(a % 3);
                    yield IminPrintInstance.setTextSize(24);
                    yield IminPrintInstance.setTextStyle(0);
                    yield IminPrintInstance.printText(pay_what[a]);
                }
                yield IminPrintInstance.setAlignment(0);
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = invoice.pay_detail_footer;
                const text = `${tempDiv.querySelector('.invoice-detail-sum').children[0].textContent}
${tempDiv.querySelector('.invoice-detail-sum').children[1].textContent}
${tempDiv.querySelector('.invoice-detail-sum').children[2].textContent.replace(/ /g, '')}`;
                yield IminPrintInstance.printText(text);
                yield IminPrintInstance.printAndFeedPaper(100);
            }), 1000);
        });
    }
    static printInvoiceSunMi(invoice, orderID, staff_title) {
        return __awaiter(this, void 0, void 0, function* () {
            const glitter = window.glitter;
            function mergeQRCodes(code) {
                return __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        let size = 190;
                        let gap = 15;
                        let qr1 = yield generateQRCode(code[0], size);
                        let qr2 = yield generateQRCode(code[1], size);
                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        let img1 = new Image();
                        let img2 = new Image();
                        img1.src = qr1;
                        img2.src = qr2;
                        img1.onload = () => {
                            img2.onload = () => {
                                canvas.width = size * 2 + gap;
                                canvas.height = size;
                                ctx.fillStyle = 'white';
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(img1, 0, 0, size, size);
                                ctx.drawImage(img2, size + gap, 0, size, size);
                                resolve(canvas.toDataURL('image/png').split('base64,')[1]);
                                console.log(`two-qrcode=>`, canvas.toDataURL('image/png'));
                            };
                        };
                    }));
                });
            }
            function generateQRCode(text, size) {
                return new Promise((resolve) => {
                    try {
                        const div = document.createElement('div');
                        var qrcode_R = new QRCode(div, {
                            text: text,
                            width: 50,
                            height: 50,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.M
                        });
                        setTimeout(() => {
                            resolve(div.querySelector('canvas').toDataURL('image/png'));
                        }, 200);
                    }
                    catch (e) {
                        console.log('qr生成失敗');
                        console.log('qr生成失敗', e);
                    }
                });
            }
            mergeQRCodes([invoice.qrcode_0, invoice.qrcode_1]).then((res) => {
                console.log(`two-qrcode=>`, res);
                glitter.runJsInterFace('start-print', {
                    'command-list': [
                        {
                            key: 'print-text', data: {
                                style: 'bold',
                                text: PayConfig.pos_config.shop_name,
                                font_size: 50,
                                align: 1,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 20,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: '電子發票證明聯',
                                font_size: 40,
                                align: 1,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: invoice.date,
                                font_size: 50,
                                align: 1,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: invoice.invoice_code,
                                font_size: 50,
                                align: 1,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 10,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: invoice.create_date,
                                font_size: 24,
                                align: 0,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 5,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: `${invoice.random_code}             ${invoice.total}`,
                                font_size: 24,
                                align: 0,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 5,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: `${invoice.sale_gui}        ${invoice.buy_gui}`,
                                font_size: 24,
                                align: 0,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 15,
                            },
                        },
                        {
                            key: 'barcode', data: {
                                text: invoice.bar_code,
                                height: 50,
                                width: 384,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 15,
                            },
                        },
                        {
                            key: 'print-bitmap', data: {
                                base64: res,
                                height: 150,
                                width: 350,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 100,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: '交易明細',
                                font_size: 40,
                                align: 1,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 5,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: '時間:' + invoice.create_date,
                                font_size: 24,
                                align: 0,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 5,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: '營業人統編:' + invoice.sale_gui.replace('賣方 ', ''),
                                font_size: 24,
                                align: 0,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 5,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: '訂單編號:' + orderID,
                                font_size: 24,
                                align: 0,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 5,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: '發票號碼:' + invoice.invoice_code,
                                font_size: 24,
                                align: 0,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 5,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: '員工:' + staff_title,
                                font_size: 24,
                                align: 0,
                            },
                        },
                        {
                            key: 'print-space', data: {
                                space: 20,
                            },
                        },
                        {
                            key: 'print-text', data: {
                                style: 'normal',
                                text: '品名      單價*數量      金額',
                                font_size: 24,
                                align: 0,
                            },
                        },
                        ...(() => {
                            let b = [];
                            const pay_what = PaymentPage.stripHtmlTags(invoice.pay_detail);
                            for (let a = 0; a < pay_what.length; a++) {
                                b.push({
                                    key: 'print-text', data: {
                                        style: 'normal',
                                        text: pay_what[a],
                                        font_size: 24,
                                        align: a % 3,
                                    },
                                });
                            }
                            return b;
                        })(),
                        {
                            key: 'print-space', data: {
                                space: 5,
                            },
                        },
                        ...(() => {
                            const c = [];
                            let tempDiv = document.createElement('div');
                            tempDiv.innerHTML = invoice.pay_detail_footer;
                            c.push({
                                key: 'print-text', data: {
                                    style: 'normal',
                                    text: tempDiv.querySelector('.invoice-detail-sum').children[0].textContent,
                                    font_size: 24,
                                    align: 0,
                                },
                            });
                            c.push({
                                key: 'print-space', data: {
                                    space: 5,
                                },
                            });
                            c.push({
                                key: 'print-text', data: {
                                    style: 'normal',
                                    text: tempDiv.querySelector('.invoice-detail-sum').children[1].textContent,
                                    font_size: 24,
                                    align: 0,
                                },
                            });
                            c.push({
                                key: 'print-space', data: {
                                    space: 20,
                                },
                            });
                            c.push({
                                key: 'print-text', data: {
                                    style: 'normal',
                                    text: tempDiv.querySelector('.invoice-detail-sum').children[2].textContent,
                                    font_size: 24,
                                    align: 0,
                                },
                            });
                            return c;
                        })(),
                        {
                            key: 'print-space', data: {
                                space: 150,
                            },
                        },
                    ],
                }, () => {
                }, {});
            });
        });
    }
    static printCodeSumi(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const glitter = window.glitter;
            glitter.runJsInterFace('start-print', {
                'command-list': [
                    {
                        key: 'barcode', data: {
                            text: code,
                            height: 50,
                            width: 384,
                        },
                    },
                    {
                        key: 'print-space', data: {
                            space: 150,
                        },
                    },
                ],
            }, () => {
            }, {});
        });
    }
    static printQrCodeSumi(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const glitter = window.glitter;
            glitter.addMtScript([
                'https://oss-sg.imin.sg/web/iMinPartner/js/imin-printer.min.js',
                'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
                glitter.root_path + 'jslib/qrcode-d.js',
            ], () => {
                function generateQRCode(text, size) {
                    return new Promise((resolve) => {
                        try {
                            const div = document.createElement('div');
                            var qrcode_R = new QRCode(div, {
                                text: text,
                                width: 100,
                                height: 100,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.M
                            });
                            setTimeout(() => {
                                resolve(div.querySelector('canvas').toDataURL('image/png'));
                            }, 200);
                        }
                        catch (e) {
                            console.log('qr生成失敗');
                            console.log('qr生成失敗', e);
                        }
                    });
                }
                generateQRCode(code, 185).then((res) => {
                    console.log(`two-qrcode=>`, res);
                    glitter.runJsInterFace('start-print', {
                        'command-list': [
                            {
                                key: 'print-bitmap', data: {
                                    base64: res.split('base64,')[1],
                                    height: 185,
                                    width: 185,
                                },
                            },
                            {
                                key: 'print-space', data: {
                                    space: 150,
                                },
                            },
                        ],
                    }, () => {
                    }, {});
                });
            }, () => {
            });
        });
    }
    static printCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const IminPrintInstance = window.parent.IminPrintInstance;
            function generateBarcodeBase64(barcodeString) {
                const canvas = window.parent.document.createElement('canvas');
                window.parent.JsBarcode(canvas, barcodeString, {
                    format: 'CODE128',
                    lineColor: '#000000',
                    width: 2,
                    height: 50,
                    displayValue: false,
                });
                const base64String = canvas.toDataURL('image/png');
                console.log('Base64 Barcode:', base64String);
                return base64String;
            }
            IminPrintInstance.printSingleBitmap(generateBarcodeBase64(code));
            yield IminPrintInstance.printAndFeedPaper(70);
        });
    }
}
