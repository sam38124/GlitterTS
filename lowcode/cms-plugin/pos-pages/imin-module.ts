//Imin機台的功能
import { PayConfig } from './pay-config.js';
import { PaymentPage } from './payment-page.js';

export class IminModule {
    public static  init() {
       return new Promise((resolve, reject) => {
           (window as any).glitter.addMtScript(
             [
                 'https://oss-sg.imin.sg/web/iMinPartner/js/imin-printer.min.js',
                 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
                 (window as any).glitter.root_path + 'jslib/qrcode-d.js',
             ],()=>{
                 resolve(true)
             },()=>{
                 resolve(false)
             })
       })
    }
    //列印發票
    public static async printInvoice(invoice: any, orderID: string, staff_title: string) {
        await IminModule.init()
        if ( (window.parent as any).glitter.share.PayConfig.posType === 'SUNMI') {
            IminModule.printInvoiceSunMi(invoice, orderID, staff_title);
            return;
        }
        const IminPrintInstance: any = (window as any).IminPrintInstance;

        function generateBarcodeBase64(barcodeString: any) {
            const canvas = document.createElement('canvas');
            // 使用 JsBarcode 將條碼字串渲染到 canvas
            //@ts-ignore
            JsBarcode(canvas, barcodeString, {
                format: 'CODE128', // 條碼格式，可根據需求更換
                lineColor: '#000000', // 條碼顏色
                width: 2,            // 條碼寬度
                height: 50,          // 條碼高度
                displayValue: false,   // 是否顯示條碼值
            });

            // 將 canvas 轉換為 base64 圖片
            const base64String = canvas.toDataURL('image/png');
            console.log('Base64 Barcode:', base64String);

            return base64String;
        }

        //列印公司名稱
        await IminPrintInstance.setAlignment(1);
        await IminPrintInstance.setTextSize(50);
        await IminPrintInstance.setTextStyle(1);
        await IminPrintInstance.printText(PayConfig.pos_config.shop_name);
        await IminPrintInstance.printAndFeedPaper(20);
        //列印電子發票證明聯
        await IminPrintInstance.setAlignment(1);
        await IminPrintInstance.setTextSize(40);
        await IminPrintInstance.setTextStyle(0);
        await IminPrintInstance.printText('電子發票證明聯');
        await IminPrintInstance.printAndFeedPaper(5);
        //列印電子發票證明聯
        await IminPrintInstance.setAlignment(1);
        await IminPrintInstance.setTextSize(50);
        await IminPrintInstance.setTextStyle(0);
        await IminPrintInstance.printText(invoice.date);
        //列印電子發票號碼
        await IminPrintInstance.setAlignment(1);
        await IminPrintInstance.setTextSize(50);
        await IminPrintInstance.setTextStyle(0);
        await IminPrintInstance.printText(invoice.invoice_code);
        //列印日期
        await IminPrintInstance.printAndFeedPaper(5);
        await IminPrintInstance.setAlignment(0);
        await IminPrintInstance.setTextSize(24);
        await IminPrintInstance.setTextStyle(0);
        await IminPrintInstance.printText(invoice.create_date);
        //列印日期和總計
        await IminPrintInstance.printAndFeedPaper(5);
        await IminPrintInstance.setAlignment(0);
        await IminPrintInstance.setTextSize(24);
        await IminPrintInstance.setTextStyle(0);
        await IminPrintInstance.printText(`${invoice.random_code}             ${invoice.total}`);
        //賣方與買方
        await IminPrintInstance.printAndFeedPaper(5);
        await IminPrintInstance.setAlignment(0);
        await IminPrintInstance.setTextSize(24);
        await IminPrintInstance.setTextStyle(0);
        await IminPrintInstance.printText(`${invoice.sale_gui}        ${invoice.buy_gui}`);
        //列印條碼
        await IminPrintInstance.printAndFeedPaper(5);
        IminPrintInstance.printSingleBitmap(generateBarcodeBase64(invoice.bar_code));
        setTimeout(async () => {
            await IminPrintInstance.printAndFeedPaper(5);
            await IminPrintInstance.setQrCodeSize(2);
            await IminPrintInstance.setDoubleQRSize(4);
            await IminPrintInstance.setDoubleQR1MarginLeft(10);
            await IminPrintInstance.setDoubleQR2MarginLeft(520);
            const ba = (new Blob([invoice.qrcode_0]).size - (new Blob([invoice.qrcode_1]).size)) * 1.1;
            for (let a = 0; a <= ba; a++) {
                invoice.qrcode_1 += '*';
            }
            await IminPrintInstance.printDoubleQR([invoice.qrcode_0, invoice.qrcode_1]);
            await IminPrintInstance.printAndFeedPaper(100);
            //列印交易明細
            await IminPrintInstance.printAndFeedPaper(5);
            await IminPrintInstance.setAlignment(1);
            await IminPrintInstance.setTextSize(40);
            await IminPrintInstance.setTextStyle(0);
            await IminPrintInstance.printText('交易明細');
            //列印日期
            await IminPrintInstance.printAndFeedPaper(10);
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24);
            await IminPrintInstance.setTextStyle(0);
            await IminPrintInstance.printText('時間:' + invoice.create_date);
            //營業人統編
            await IminPrintInstance.printAndFeedPaper(5);
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24);
            await IminPrintInstance.setTextStyle(0);
            await IminPrintInstance.printText('營業人統編:' + invoice.sale_gui.replace('賣方 ', ''));
            //訂單號碼
            await IminPrintInstance.printAndFeedPaper(5);
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24);
            await IminPrintInstance.setTextStyle(0);
            await IminPrintInstance.printText('訂單編號:' + orderID);
            //訂單號碼
            await IminPrintInstance.printAndFeedPaper(5);
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24);
            await IminPrintInstance.setTextStyle(0);
            await IminPrintInstance.printText('發票號碼:' + invoice.invoice_code);
            //員工
            await IminPrintInstance.printAndFeedPaper(5);
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24);
            await IminPrintInstance.setTextStyle(0);
            await IminPrintInstance.printText('員工:' + staff_title);
            //分隔線
            await IminPrintInstance.printAndFeedPaper(30);
            await IminPrintInstance.printText('品名               單價*數量               金額 ');
            const pay_what = PaymentPage.stripHtmlTags(invoice.pay_detail);
            for (let a = 0; a < pay_what.length; a++) {
                await IminPrintInstance.printAndFeedPaper(5);
                await IminPrintInstance.setAlignment(a % 3);
                await IminPrintInstance.setTextSize(24);
                await IminPrintInstance.setTextStyle(0);
                await IminPrintInstance.printText(pay_what[a]);
            }
            await IminPrintInstance.setAlignment(0);
            let tempDiv = document.createElement('div');
            // 设置其内容为给定的HTML字符串
            tempDiv.innerHTML = invoice.pay_detail_footer;
            const text = `${tempDiv.querySelector('.invoice-detail-sum')!!.children[0].textContent}
${tempDiv.querySelector('.invoice-detail-sum')!!.children[1].textContent}
${tempDiv.querySelector('.invoice-detail-sum')!!.children[2].textContent!.replace(/ /g, '')}`;
            await IminPrintInstance.printText(text);
            await IminPrintInstance.printAndFeedPaper(100);
        }, 1000);
    }

    //SUMI的發票列印
    public static async printInvoiceSunMi(invoice: any, orderID: string, staff_title: string) {
        const glitter = (window as any).glitter;

        async function mergeQRCodes(code: string[]) {
            return new Promise(async (resolve, reject) => {
                let size = 190; // QR Code 尺寸
                let gap = 15; // 間距

                let qr1 = await generateQRCode(code[0], size);
                let qr2 = await generateQRCode(code[1], size);

                let canvas = document.createElement('canvas');
                let ctx: any = canvas.getContext('2d');

                let img1: any = new Image();
                let img2: any = new Image();

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
            });
        }

        function generateQRCode(text: string, size: number) {
            return new Promise((resolve) => {
                try {
                    const div = document.createElement('div');
                    //@ts-ignore
                    var qrcode_R = new QRCode(div, {
                        text: text,
                        width: 50,
                        height: 50,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        //@ts-ignore
                        correctLevel: QRCode.CorrectLevel.M
                    });
                    // 等待 QR Code 生成完畢
                    setTimeout(() => {
                        resolve(div.querySelector('canvas')!!.toDataURL('image/png'));
                    }, 200); // 延遲等待 QRCode 完成渲染
                }catch (e) {
                    console.log('qr生成失敗')
                    console.log('qr生成失敗',e)
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
                        let b: any = [];
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
                            // await IminPrintInstance.printAndFeedPaper(5);
                            // await IminPrintInstance.setAlignment(a % 3);
                            // await IminPrintInstance.setTextSize(24);
                            // await IminPrintInstance.setTextStyle(0);
                            // await IminPrintInstance.printText(pay_what[a]);
                        }
                        return b;
                    })(),
                    {
                        key: 'print-space', data: {
                            space: 5,
                        },
                    },
                    ...(() => {
                        const c: any = [];
                        let tempDiv = document.createElement('div');
                        // 设置其内容为给定的HTML字符串
                        tempDiv.innerHTML = invoice.pay_detail_footer;
                        c.push({
                            key: 'print-text', data: {
                                style: 'normal',
                                text: tempDiv.querySelector('.invoice-detail-sum')!!.children[0].textContent,
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
                                text: tempDiv.querySelector('.invoice-detail-sum')!!.children[1].textContent,
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
                                text: tempDiv.querySelector('.invoice-detail-sum')!!.children[2].textContent,
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
    }

    public static async printCodeSumi(code: string) {
        const glitter = (window as any).glitter;
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
    }

    public static async printQrCodeSumi(code: string) {
        const glitter = (window as any).glitter;
        glitter.addMtScript(
            [
                'https://oss-sg.imin.sg/web/iMinPartner/js/imin-printer.min.js',
                'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
                glitter.root_path + 'jslib/qrcode-d.js',
            ],
            () => {

                function generateQRCode(text: string, size: number) {
                    return new Promise((resolve) => {
                        try {
                            const div = document.createElement('div');
                            //@ts-ignore
                            var qrcode_R = new QRCode(div, {
                                text: text,
                                width: 100,
                                height: 100,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                //@ts-ignore
                                correctLevel: QRCode.CorrectLevel.M
                            });
                            // 等待 QR Code 生成完畢
                            setTimeout(() => {

                                resolve(div.querySelector('canvas')!!.toDataURL('image/png'));
                            }, 200); // 延遲等待 QRCode 完成渲染
                        }catch (e) {
                            console.log('qr生成失敗')
                            console.log('qr生成失敗',e)
                        }
                    });
                }

                generateQRCode(code, 185).then((res: any) => {
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
            },
            () => {
            },
        );
    }


    //列印QRCODE
    public static async printCode(code: string) {
        const IminPrintInstance: any = (window.parent as any).IminPrintInstance;

        function generateBarcodeBase64(barcodeString: any) {
            const canvas = (window.parent as any).document.createElement('canvas');
            // 使用 JsBarcode 將條碼字串渲染到 canvas
            //@ts-ignore
            (window.parent as any).JsBarcode(canvas, barcodeString, {
                format: 'CODE128', // 條碼格式，可根據需求更換
                lineColor: '#000000', // 條碼顏色
                width: 2,            // 條碼寬度
                height: 50,          // 條碼高度
                displayValue: false,   // 是否顯示條碼值
            });
            // 將 canvas 轉換為 base64 圖片
            const base64String = canvas.toDataURL('image/png');
            console.log('Base64 Barcode:', base64String);
            return base64String;
        }

        IminPrintInstance.printSingleBitmap(generateBarcodeBase64(code));
        await IminPrintInstance.printAndFeedPaper(70);
    }
}