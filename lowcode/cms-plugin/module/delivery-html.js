import { BgWidget } from '../../backend-manager/bg-widget.js';
const html = String.raw;
export class DeliveryHTML {
    static print(ogvc) {
        return BgWidget.fullDialog({
            gvc: ogvc,
            title: (gvc) => {
                return '列印出貨單';
            },
            innerHTML: (gvc) => {
                return html ` <div>123</div>`;
            },
            footer_html: (gvc) => {
                return [
                    BgWidget.cancel(gvc.event(() => {
                        gvc.closeDialog();
                    })),
                    BgWidget.save(gvc.event(() => {
                        gvc.closeDialog();
                        console.log('開始列印出貨單');
                    })),
                ].join('');
            },
            closeCallback: () => { },
        });
    }
}
