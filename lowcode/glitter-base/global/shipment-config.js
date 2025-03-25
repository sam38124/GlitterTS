var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class ShipmentConfig {
    static shipmentMethod(cf) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const saasConfig = window.parent.saasConfig;
            const response = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, 'logistics_setting');
            let configData = ((_a = response.response.result[0]) === null || _a === void 0 ? void 0 : _a.value) || {};
            if (!configData.language_data) {
                configData.language_data = {
                    'en-US': { info: '' },
                    'zh-CN': { info: '' },
                    'zh-TW': { info: configData.info || '' },
                };
            }
            configData.support = (_b = configData.support) !== null && _b !== void 0 ? _b : [];
            const shipmentOptions = ShipmentConfig.list
                .map(dd => {
                return { key: dd.value, name: dd.title };
            })
                .concat(((_c = configData.custom_delivery) !== null && _c !== void 0 ? _c : []).map((dd) => {
                return { key: dd.id, name: dd.name };
            }))
                .filter(dd => {
                if (cf.type == 'all') {
                    return true;
                }
                else if (cf.type == 'market') {
                    return ShipmentConfig.supermarketList.includes(dd.key);
                }
                else if (cf.type == 'support') {
                    return configData.support.includes(dd.key);
                }
            })
                .map(d1 => {
                return { key: d1.key, name: d1.name, market: ShipmentConfig.supermarketList.includes(d1.key) };
            });
            return shipmentOptions;
        });
    }
}
ShipmentConfig.list = [
    {
        title: '黑貓宅配',
        value: 'black_cat',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/w644 (1).jpeg',
    },
    {
        title: '黑貓冷藏宅配',
        value: 'black_cat_ice',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/w644 (1).jpeg',
    },
    {
        title: '黑貓冷凍宅配',
        value: 'black_cat_freezing',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/w644 (1).jpeg',
    },
    {
        title: '中華郵政',
        value: 'normal',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/Chunghwa_Post_Logo.svg.png',
    },
    {
        title: '7-11交貨便',
        value: 'UNIMARTC2C',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734544575-34f72af5b441738b1f65a0597c28d9cf (1).png',
        paynow_id: '01',
    },
    {
        title: '7-11冷凍店取',
        value: 'UNIMARTFREEZE',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734544575-34f72af5b441738b1f65a0597c28d9cf (1).png',
        paynow_id: '21',
    },
    {
        title: '全家店到店',
        value: 'FAMIC2C',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734396302-e970be63c9acb23e41cf80c77b7ca35b.jpeg',
        paynow_id: '03',
    },
    {
        title: '全家冷凍店到店',
        value: 'FAMIC2CFREEZE',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734396302-e970be63c9acb23e41cf80c77b7ca35b.jpeg',
        paynow_id: '23',
    },
    {
        title: '萊爾富店到店',
        value: 'HILIFEC2C',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734423037-6e2664ad52332c40b4106868ada74646.png',
        paynow_id: '05',
    },
    {
        title: 'OK超商店到店',
        value: 'OKMARTC2C',
        src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734510490-beb1c70f9e168b7bab198ea2bf226148.png',
        paynow_id: '10',
    },
    {
        title: '國際快遞',
        value: 'global_express',
        type: 'font_awesome',
        src: `<i class="fa-sharp fa-regular fa-earth-americas" style="font-size: 35px;color:#1d59c0;"></i>`,
    },
    {
        title: '實體門市取貨',
        value: 'shop',
        type: 'font_awesome',
        src: `<i class="fa-duotone fa-solid fa-shop" style="font-size: 35px;color:#319e49;"></i>`,
    },
];
ShipmentConfig.supportPrintList = [
    'FAMIC2C',
    'UNIMARTC2C',
    'HILIFEC2C',
    'OKMARTC2C',
    'normal',
    'black_cat',
    'black_cat_ice',
    'UNIMARTFREEZE',
    'black_cat_freezing',
];
ShipmentConfig.supermarketList = ['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C', 'UNIMARTFREEZE', 'FAMIC2CFREEZE'];
window.glitter.setModule(import.meta.url, ShipmentConfig);
