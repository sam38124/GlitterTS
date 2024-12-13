export class ProductConfig {
    static getName(data) {
        if (`${data.visible}` === `false`) {
            return `隱形商品`;
        }
        else if (data.productType.giveaway) {
            return `贈品`;
        }
        else if (data.productType.addProduct) {
            return `加購品`;
        }
        else if (data.productType.product) {
            return `前台商品`;
        }
        return `前台商品`;
    }
    static getInitial(obj) {
        function getEmptyLanguageData() {
            return {
                title: '', seo: {
                    domain: '',
                    title: '',
                    content: '',
                    keywords: '',
                },
                content: '',
                content_array: []
            };
        }
        return {
            title: '',
            ai_description: '',
            language_data: {
                "en-US": getEmptyLanguageData(),
                "zh-CN": getEmptyLanguageData(),
                "zh-TW": {
                    title: (obj.defData && obj.defData.title) || '', seo: (obj.defData && obj.defData.seo) || {}
                }
            },
            productType: {
                product: true,
                addProduct: false,
                giveaway: false,
            },
            content: '',
            visible: 'true',
            status: 'active',
            collection: [],
            hideIndex: 'false',
            preview_image: [],
            specs: [],
            variants: [],
            seo: {
                title: '',
                content: '',
                keywords: '',
                domain: '',
            },
            relative_product: [],
            template: '',
            content_array: [],
            content_json: [],
            active_schedule: {
                startDate: this.getDateTime().date,
                startTime: this.getDateTime().time,
                endDate: this.getDateTime(7).date,
                endTime: this.getDateTime(7).time,
            },
            channel: ['normal', 'pos'],
        };
    }
}
ProductConfig.getDateTime = (n = 0) => {
    const now = new Date();
    now.setDate(now.getDate() + n);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:00`;
    return { date: dateStr, time: timeStr };
};
