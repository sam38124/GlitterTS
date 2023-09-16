export class OfflineConverter {
    static covert(data) {
        const glitter = window.glitter;
        if (Array.isArray(data)) {
            data.map((dd) => {
                OfflineConverter.covert(dd);
            });
        }
        else if (typeof data === 'object') {
            Object.keys(data).map((d2) => {
                OfflineConverter.covert(data[d2]);
            });
            if (data.clickEvent && data.clickEvent.src) {
                data.clickEvent.src = glitter.htmlGenerate.resourceHook(data.clickEvent.src);
            }
            if (data.clickEvent && Array.isArray(data.clickEvent)) {
                data.clickEvent.map((dd) => {
                    OfflineConverter.covert(dd);
                });
            }
            if (data.js) {
                data.js = glitter.htmlGenerate.resourceHook(data.js);
            }
        }
    }
    static convertALL(array) {
        array.map((dd) => {
            OfflineConverter.covert(dd);
        });
    }
}
