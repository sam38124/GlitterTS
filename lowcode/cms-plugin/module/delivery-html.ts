import { BgWidget } from '../../backend-manager/bg-widget.js';
import { GVC } from '../../glitterBundle/GVController.js';

const html = String.raw;

export class DeliveryHTML {
    static print(ogvc: GVC) {
        return BgWidget.fullDialog({
            gvc: ogvc,
            title: (gvc) => {
                return '列印出貨單';
            },
            innerHTML: (gvc) => {
                return html` <div>123</div>`;
            },
            footer_html: (gvc: GVC) => {
                return [
                    BgWidget.cancel(
                        gvc.event(() => {
                            gvc.closeDialog();
                        })
                    ),
                    BgWidget.save(
                        gvc.event(() => {
                            gvc.closeDialog();
                            console.log('開始列印出貨單');
                        })
                    ),
                ].join('');
            },
            closeCallback: () => {},
        });
    }
}
