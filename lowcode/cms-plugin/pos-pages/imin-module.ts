//Imin機台的功能
import {PayConfig} from "./pay-config.js";
import {PaymentPage} from "./payment-page.js";

export class IminModule{
    //列印發票
    public static async printInvoice(invoice:any,orderID:string,staff_title:string){
        const IminPrintInstance:any=(window as any).IminPrintInstance
        function generateBarcodeBase64(barcodeString:any) {
            const canvas = document.createElement("canvas");

            // 使用 JsBarcode 將條碼字串渲染到 canvas
            //@ts-ignore
            JsBarcode(canvas, barcodeString, {
                format: "CODE128", // 條碼格式，可根據需求更換
                lineColor: "#000000", // 條碼顏色
                width: 2,            // 條碼寬度
                height: 50,          // 條碼高度
                displayValue: false   // 是否顯示條碼值
            });

            // 將 canvas 轉換為 base64 圖片
            const base64String = canvas.toDataURL("image/png");
            console.log("Base64 Barcode:", base64String);

            return base64String;
        }
        //列印公司名稱
        await IminPrintInstance.setAlignment(1);
        await IminPrintInstance.setTextSize(50)
        await IminPrintInstance.setTextStyle(1)
        await IminPrintInstance.printText(PayConfig.pos_config.shop_name)
        await IminPrintInstance.printAndFeedPaper(20)
        //列印電子發票證明聯
        await IminPrintInstance.setAlignment(1);
        await IminPrintInstance.setTextSize(40)
        await IminPrintInstance.setTextStyle(0)
        await IminPrintInstance.printText('電子發票證明聯')
        await IminPrintInstance.printAndFeedPaper(5)
        //列印電子發票證明聯
        await IminPrintInstance.setAlignment(1);
        await IminPrintInstance.setTextSize(50)
        await IminPrintInstance.setTextStyle(0)
        await IminPrintInstance.printText(invoice.date)
        //列印電子發票號碼
        await IminPrintInstance.setAlignment(1);
        await IminPrintInstance.setTextSize(50)
        await IminPrintInstance.setTextStyle(0)
        await IminPrintInstance.printText(invoice.invoice_code)
        //列印日期
        await IminPrintInstance.printAndFeedPaper(5)
        await IminPrintInstance.setAlignment(0);
        await IminPrintInstance.setTextSize(24)
        await IminPrintInstance.setTextStyle(0)
        await IminPrintInstance.printText(invoice.create_date)
        //列印日期和總計
        await IminPrintInstance.printAndFeedPaper(5)
        await IminPrintInstance.setAlignment(0);
        await IminPrintInstance.setTextSize(24)
        await IminPrintInstance.setTextStyle(0)
        await IminPrintInstance.printText(`${invoice.random_code}             ${invoice.total}`)
        //賣方與買方
        await IminPrintInstance.printAndFeedPaper(5)
        await IminPrintInstance.setAlignment(0);
        await IminPrintInstance.setTextSize(24)
        await IminPrintInstance.setTextStyle(0)
        await IminPrintInstance.printText(`${invoice.sale_gui}        ${invoice.buy_gui}`)
        //列印條碼
        await IminPrintInstance.printAndFeedPaper(5)
        IminPrintInstance.printSingleBitmap(generateBarcodeBase64(invoice.bar_code))
        setTimeout(async ()=>{
            await IminPrintInstance.printAndFeedPaper(5)
            await IminPrintInstance.setQrCodeSize(2);
            await IminPrintInstance.setDoubleQRSize(4)
            await IminPrintInstance.setDoubleQR1MarginLeft(10)
            await IminPrintInstance.setDoubleQR2MarginLeft(520)
            const ba=(new Blob([invoice.qrcode_0]).size - (new Blob([invoice.qrcode_1]).size))*1.1
            for (let a=0;a<=ba;a++){
                invoice.qrcode_1+='*'
            }
            await IminPrintInstance.printDoubleQR([invoice.qrcode_0,invoice.qrcode_1])
            await IminPrintInstance.printAndFeedPaper(100)
            //列印交易明細
            await IminPrintInstance.printAndFeedPaper(5)
            await IminPrintInstance.setAlignment(1);
            await IminPrintInstance.setTextSize(40)
            await IminPrintInstance.setTextStyle(0)
            await IminPrintInstance.printText('交易明細')
            //列印日期
            await IminPrintInstance.printAndFeedPaper(10)
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24)
            await IminPrintInstance.setTextStyle(0)
            await IminPrintInstance.printText('時間:'+invoice.create_date)
            //營業人統編
            await IminPrintInstance.printAndFeedPaper(5)
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24)
            await IminPrintInstance.setTextStyle(0)
            await IminPrintInstance.printText('營業人統編:'+invoice.sale_gui.replace('賣方 ',''))
            //訂單號碼
            await IminPrintInstance.printAndFeedPaper(5)
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24)
            await IminPrintInstance.setTextStyle(0)
            await IminPrintInstance.printText('訂單編號:'+orderID)
            //訂單號碼
            await IminPrintInstance.printAndFeedPaper(5)
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24)
            await IminPrintInstance.setTextStyle(0)
            await IminPrintInstance.printText('發票號碼:'+invoice.invoice_code)
            //員工
            await IminPrintInstance.printAndFeedPaper(5)
            await IminPrintInstance.setAlignment(0);
            await IminPrintInstance.setTextSize(24)
            await IminPrintInstance.setTextStyle(0)
            await IminPrintInstance.printText('員工:'+staff_title)
            //分隔線
            await IminPrintInstance.printAndFeedPaper(30)
            await IminPrintInstance.printText('品名               單價*數量               金額 ')
            const pay_what=PaymentPage.stripHtmlTags(invoice.pay_detail)
            for (let a=0;a<pay_what.length;a++){
                await IminPrintInstance.printAndFeedPaper(5)
                await IminPrintInstance.setAlignment(a%3);
                await IminPrintInstance.setTextSize(24)
                await IminPrintInstance.setTextStyle(0)
                await IminPrintInstance.printText(pay_what[a])
            }
            await IminPrintInstance.setAlignment(0)
            let tempDiv = document.createElement("div");
            // 设置其内容为给定的HTML字符串
            tempDiv.innerHTML = invoice.pay_detail_footer;
            const text=`${tempDiv.querySelector('.invoice-detail-sum')!!.children[0].textContent}
${tempDiv.querySelector('.invoice-detail-sum')!!.children[1].textContent}
${tempDiv.querySelector('.invoice-detail-sum')!!.children[2].textContent!.replace(/ /g, '')}`
            await IminPrintInstance.printText(text)
            await IminPrintInstance.printAndFeedPaper(100)
        },1000)
    }
}