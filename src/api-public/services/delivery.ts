import app from "../../app.js";
import axios from "axios/index.js";

export class Delivery {
    public appName: string

    public constructor(appName: string) {
        this.appName = appName
    }

    public async getC2CMap(returnURL:string,logistics:string) {
        const appName=this.appName;
        return new Promise<string>((resolve, reject) => {
            resolve(`<form name="Newebpay" action="https://logistics.ecpay.com.tw/Express/map" method="POST" class="payment">
                            <input type="hidden" name="MerchantID" value="${process.env.EC_SHIPMENT_ID}" />
                            <input type="hidden" name="MerchantTradeNo" value="${new Date().getTime()}" />
                            <input type="hidden" name="LogisticsType" value="CVS" />
                            <input type="hidden" name="LogisticsSubType" value="${logistics}" />
                            <input type="hidden" name="IsCollection" value="N" />
                            <input type="hidden" name="ServerReplyURL" value="${process.env.DOMAIN}/api-public/v1/delivery/c2cRedirect?g-app=${appName}&return=${encodeURIComponent(returnURL)}" />
                            <button
                                type="submit"
                                class="btn btn-secondary custom-btn beside-btn"
                                id="submit"
                                hidden
                            ></button>
                        </form>`)

        })
    }
}