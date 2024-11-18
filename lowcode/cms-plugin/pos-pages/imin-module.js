var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PayConfig } from "./pay-config.js";
import { PaymentPage } from "./payment-page.js";
export class IminModule {
    static printInvoice(invoice, orderID, staff_title) {
        return __awaiter(this, void 0, void 0, function* () {
            const IminPrintInstance = window.IminPrintInstance;
            function generateBarcodeBase64(barcodeString) {
                const canvas = document.createElement("canvas");
                JsBarcode(canvas, barcodeString, {
                    format: "CODE128",
                    lineColor: "#000000",
                    width: 2,
                    height: 50,
                    displayValue: false
                });
                const base64String = canvas.toDataURL("image/png");
                console.log("Base64 Barcode:", base64String);
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
                let tempDiv = document.createElement("div");
                tempDiv.innerHTML = invoice.pay_detail_footer;
                const text = `${tempDiv.querySelector('.invoice-detail-sum').children[0].textContent}
${tempDiv.querySelector('.invoice-detail-sum').children[1].textContent}
${tempDiv.querySelector('.invoice-detail-sum').children[2].textContent.replace(/ /g, '')}`;
                yield IminPrintInstance.printText(text);
                yield IminPrintInstance.printAndFeedPaper(100);
            }), 1000);
        });
    }
}
