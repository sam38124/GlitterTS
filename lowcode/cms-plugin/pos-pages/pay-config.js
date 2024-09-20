export class PayConfig {
    static get linePay() {
        if (PayConfig.mode === "normal") {
            return {
                "X-LINE-ChannelId": "2006263059",
                "X-LINE-ChannelSecret": "9bcca1d8f66b9ec60cd1a3498be253e2",
                "api": "https://sandbox-api-pay.line.me"
            };
        }
        else {
            return {
                "X-LINE-ChannelId": "2006263059",
                "X-LINE-ChannelSecret": "9bcca1d8f66b9ec60cd1a3498be253e2",
                "api": "https://sandbox-api-pay.line.me"
            };
        }
    }
}
PayConfig.mode = "beta";
PayConfig.deviceType = 'web';
PayConfig.pos_config = {};
