//這邊儲存所有宅配的配置檔案
export class ShipmentConfig {
    public static list=[
        {
            title: '黑貓宅配',
            value: 'black_cat',
            src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/w644 (1).jpeg',
            paynow_id:'36'
        },
        {
            title: '黑貓冷藏宅配',
            value: 'black_cat_ice',
            src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/w644 (1).jpeg',
            paynow_id:'36'
        },
        {
            title: '黑貓冷凍宅配',
            value: 'black_cat_freezing',
            src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/w644 (1).jpeg',
            paynow_id:'36'
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
            paynow_id:'01'
        },
        {
            title: '7-11冷凍店取',
            value: 'UNIMARTFREEZE',
            src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734544575-34f72af5b441738b1f65a0597c28d9cf (1).png',
            paynow_id:'21'
        },
        {
            title: '全家店到店',
            value: 'FAMIC2C',
            src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734396302-e970be63c9acb23e41cf80c77b7ca35b.jpeg',
            paynow_id:'03'
        },
        {
            title: '萊爾富店到店',
            value: 'HILIFEC2C',
            src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734423037-6e2664ad52332c40b4106868ada74646.png',
            paynow_id:'05'
        },
        {
            title: 'OK超商店到店',
            value: 'OKMARTC2C',
            src: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1716734510490-beb1c70f9e168b7bab198ea2bf226148.png',
            paynow_id:'10'
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
        }
    ]
    //支援列印托運單的配送方式
    public static supportPrintList=['FAMIC2C', 'UNIMARTC2C', 'HILIFEC2C', 'OKMARTC2C', 'normal', 'black_cat','black_cat_ice','UNIMARTFREEZE','black_cat_freezing']
    //超商列表
    public static supermarketList=['UNIMARTC2C', 'FAMIC2C', 'HILIFEC2C', 'OKMARTC2C','UNIMARTFREEZE']
}