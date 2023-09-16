export class OfflineConverter {
    public static covert(data: any) {
        const glitter=(window as any).glitter
        if (Array.isArray(data)) {
            data.map((dd: any) => {
                OfflineConverter.covert(dd)
            })
        } else if (typeof data === 'object') {
            Object.keys(data).map((d2) => {
                OfflineConverter.covert(data[d2])
            })
            if (data.clickEvent && data.clickEvent.src) {
                data.clickEvent.src = glitter.htmlGenerate.resourceHook(data.clickEvent.src)
            }
            if (data.clickEvent && Array.isArray(data.clickEvent)) {
                data.clickEvent.map((dd: any) => {
                    OfflineConverter.covert(dd)
                })
            }
            if (data.js) {
                data.js = glitter.htmlGenerate.resourceHook(data.js)
            }
        }
    }

    public static convertALL(array: any) {
        array.map((dd: any) => {
            OfflineConverter.covert(dd)
        })
    }
}