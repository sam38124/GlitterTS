export class FilterOptions {
}
FilterOptions.userFilterFrame = {
    created_time: ['', ''],
    birth: [],
    level: [],
    rebate: { key: '', value: '' },
    total_amount: { key: '', value: '' },
};
FilterOptions.userFunnel = [
    {
        key: 'created_time',
        type: 'during',
        name: '註冊日期',
        data: {
            centerText: '至',
            list: [
                { key: 'start', type: 'date', placeHolder: '請選擇開始時間' },
                { key: 'end', type: 'date', placeHolder: '請選擇結束時間' },
            ],
        },
    },
    {
        key: 'birth',
        type: 'multi_checkbox',
        name: '生日月份',
        data: [
            { key: 1, name: '一月' },
            { key: 2, name: '二月' },
            { key: 3, name: '三月' },
            { key: 4, name: '四月' },
            { key: 5, name: '五月' },
            { key: 6, name: '六月' },
            { key: 7, name: '七月' },
            { key: 8, name: '八月' },
            { key: 9, name: '九月' },
            { key: 10, name: '十月' },
            { key: 11, name: '十一月' },
            { key: 12, name: '十二月' },
        ],
    },
    {
        key: 'level',
        type: 'multi_checkbox',
        name: '會員等級',
        data: [],
    },
    {
        key: 'rebate',
        type: 'radio_and_input',
        name: '持有購物金',
        data: [
            { key: 'lessThan', name: '小於', type: 'number', placeHolder: '請輸入數值', unit: '元' },
            { key: 'moreThan', name: '大於', type: 'number', placeHolder: '請輸入數值', unit: '元' },
        ],
    },
    {
        key: 'total_amount',
        type: 'radio_and_input',
        name: '累積消費金額',
        data: [
            { key: 'lessThan', name: '小於', type: 'number', placeHolder: '請輸入數值', unit: '元' },
            { key: 'moreThan', name: '大於', type: 'number', placeHolder: '請輸入數值', unit: '元' },
        ],
    },
];
FilterOptions.userOrderBy = [
    { key: 'default', value: '預設' },
    { key: 'name', value: '顧客名稱' },
    { key: 'created_time_desc', value: '註冊時間新 > 舊' },
    { key: 'created_time_asc', value: '註冊時間舊 > 新' },
    { key: 'online_time_desc', value: '上次登入時間新 > 舊' },
    { key: 'online_time_asc', value: '上次登入時間舊 > 新' },
    { key: 'order_total_desc', value: '消費金額高 > 低' },
    { key: 'order_total_asc', value: '消費金額低 > 高' },
    { key: 'order_count_desc', value: '訂單數量多 > 少' },
    { key: 'order_count_asc', value: '訂單數量少 > 多' },
];
FilterOptions.userSelect = [
    { key: 'name', value: '顧客名稱' },
    { key: 'email', value: '電子信箱' },
    { key: 'phone', value: '電話號碼' },
];
FilterOptions.orderFilterFrame = {
    orderStatus: [],
    payload: [],
    progress: [],
    shipment: [],
    created_time: ['', ''],
};
FilterOptions.returnOrderFilterFrame = {
    progress: [],
    refund: [],
    created_time: ['', ''],
};
FilterOptions.orderFunnel = [
    {
        key: 'orderStatus',
        type: 'multi_checkbox',
        name: '訂單狀態',
        data: [
            { key: '1', name: '已完成' },
            { key: '0', name: '處理中' },
            { key: '-1', name: '已取消' },
        ],
    },
    {
        key: 'payload',
        type: 'multi_checkbox',
        name: '付款狀態',
        data: [
            { key: '-1', name: '付款失敗' },
            { key: '1', name: '已付款' },
            { key: '0', name: '未付款' },
            { key: '-2', name: '已退款' },
        ],
    },
    {
        key: 'progress',
        type: 'multi_checkbox',
        name: '出貨狀況',
        data: [
            { key: 'shipping', name: '配送中' },
            { key: 'wait', name: '未出貨' },
            { key: 'finish', name: '已取貨' },
            { key: 'returns', name: '已退貨' },
            { key: 'arrived', name: '已到貨' },
        ],
    },
    {
        key: 'shipment',
        type: 'multi_checkbox',
        name: '運送方式',
        data: [
            { key: 'normal', name: '宅配' },
            { key: 'UNIMARTC2C', name: '7-11店到店' },
            { key: 'FAMIC2C', name: '全家店到店' },
            { key: 'OKMARTC2C', name: 'OK店到店' },
            { key: 'HILIFEC2C', name: '萊爾富店到店' },
        ],
    },
    {
        key: 'created_time',
        type: 'during',
        name: '訂單日期',
        data: {
            centerText: '至',
            list: [
                { key: 'start', type: 'date', placeHolder: '請選擇開始時間' },
                { key: 'end', type: 'date', placeHolder: '請選擇結束時間' },
            ],
        },
    },
];
FilterOptions.returnOrderFunnel = [
    {
        key: 'progress',
        type: 'multi_checkbox',
        name: '退貨狀態',
        data: [
            { key: '1', name: '處理中' },
            { key: '0', name: '退貨中' },
            { key: '-1', name: '已退貨' },
        ],
    },
    {
        key: 'refund',
        type: 'multi_checkbox',
        name: '退款狀態',
        data: [
            { key: '1', name: '已退款' },
            { key: '0', name: '退款中' },
        ],
    },
    {
        key: 'created_time',
        type: 'during',
        name: '申請日期',
        data: {
            centerText: '至',
            list: [
                { key: 'start', type: 'date', placeHolder: '請選擇開始時間' },
                { key: 'end', type: 'date', placeHolder: '請選擇結束時間' },
            ],
        },
    },
];
FilterOptions.orderOrderBy = [
    { key: 'created_time_desc', value: '訂單時間新 > 舊' },
    { key: 'created_time_asc', value: '訂單時間舊 > 新' },
    { key: 'order_total_desc', value: '訂單金額高 > 低' },
    { key: 'order_total_asc', value: '訂單金額低 > 高' },
];
FilterOptions.returnOrderOrderBy = [
    { key: 'created_time_desc', value: '訂單時間新 > 舊' },
    { key: 'created_time_asc', value: '訂單時間舊 > 新' },
];
FilterOptions.orderSelect = [
    { key: 'cart_token', value: '訂單編號' },
    { key: 'name', value: '訂購人' },
    { key: 'phone', value: '手機' },
    { key: 'title', value: '商品名稱' },
    { key: 'sku', value: '商品編號' },
    { key: 'invoice_number', value: '發票號碼' },
];
FilterOptions.returnOrderSelect = [
    { key: 'order_id', value: '訂單編號' },
    { key: 'return_order_id', value: '退貨單編號' },
    { key: 'name', value: '退貨人名稱' },
    { key: 'phone', value: '退貨人電話' },
];
FilterOptions.productFilterFrame = {
    status: [],
    collection: [],
};
FilterOptions.productFunnel = [
    {
        key: 'status',
        type: 'multi_checkbox',
        name: '商品狀態',
        data: [
            { key: 'active', name: '已上架' },
            { key: 'draft', name: '已下架' },
        ],
    },
];
FilterOptions.productOrderBy = [
    { key: 'default', value: '預設' },
    { key: 'max_price', value: '價格高 > 低' },
    { key: 'min_price', value: '價格低 > 高' },
];
FilterOptions.productListOrderBy = [
    { key: 'default', value: '預設' },
    { key: 'title', value: '商品名稱' },
    { key: 'created_time_desc', value: '建立時間新 > 舊' },
    { key: 'created_time_asc', value: '建立時間舊 > 新' },
    { key: 'updated_time_desc', value: '更新時間新 > 舊' },
    { key: 'updated_time_asc', value: '更新時間舊 > 新' },
];
FilterOptions.imageLibraryOrderBy = [
    { key: 'default', value: '預設' },
    { key: 'created_time_desc', value: '上傳時間新 > 舊' },
    { key: 'created_time_asc', value: '上傳時間舊 > 新' },
    { key: 'name_AtoZ', value: '圖片名稱A>Z' },
    { key: 'name_ZtoA', value: '圖片名稱Z>A' },
];
FilterOptions.productSelect = [
    { key: 'title', value: '商品名稱' },
    { key: 'sku', value: '庫存單位(SKU)' },
    { key: 'barcode', value: '商品條碼' },
];
FilterOptions.stockFilterFrame = {
    status: [],
    collection: [],
    count: { key: '', value: '' },
};
FilterOptions.stockSelect = [
    { key: 'title', value: '商品名稱' },
    { key: 'sku', value: '商品貨號' },
];
FilterOptions.stockFunnel = [
    {
        key: 'status',
        type: 'multi_checkbox',
        name: '商品狀態',
        data: [
            { key: 'active', name: '已上架' },
            { key: 'draft', name: '已下架' },
        ],
    },
    {
        key: 'count',
        type: 'radio_and_input',
        name: '庫存量',
        data: [
            { key: 'lessThan', name: '少於多少', type: 'number', placeHolder: '請輸入數值', unit: '個' },
            { key: 'moreThan', name: '大於多少', type: 'number', placeHolder: '請輸入數值', unit: '個' },
            { key: 'lessSafe', name: '與安全庫存差距小於多少', type: 'number', placeHolder: '請輸入數值', unit: '個' },
        ],
    },
];
FilterOptions.stockOrderBy = [
    { key: 'default', value: '預設' },
    { key: 'max_price', value: '價格高 > 低' },
    { key: 'min_price', value: '價格低 > 高' },
    { key: 'stock_desc', value: '庫存數量多 > 少' },
    { key: 'stock_asc', value: '庫存數量少 > 多' },
];
FilterOptions.emailFilterFrame = {
    status: [],
    mailType: [],
};
FilterOptions.emailSelect = [
    { key: 'email', value: '顧客信箱' },
    { key: 'name', value: '寄件人名稱' },
    { key: 'title', value: '標題' },
];
FilterOptions.snsSelect = [
    { key: 'phone', value: '顧客電話' },
    { key: 'name', value: '收訊人名稱' },
    { key: 'title', value: '內容' },
];
FilterOptions.emailOptions = [
    { key: 'def', value: '請選擇根據的條件' },
    { key: 'all', value: '所有會員' },
    { key: 'customers', value: '指定會員' },
    { key: 'level', value: '會員等級' },
    { key: 'group', value: '顧客分群' },
    { key: 'birth', value: '顧客生日月份' },
    { key: 'remain', value: '購物金剩餘點數' },
];
FilterOptions.emailFunnel = [
    {
        key: 'status',
        type: 'multi_checkbox',
        name: '寄送狀態',
        data: [
            { key: '0', name: '尚未寄送' },
            { key: '1', name: '已寄送' },
        ],
    },
    {
        key: 'mailType',
        type: 'multi_checkbox',
        name: '寄件類型',
        data: [
            { key: 'auto-email-payment-successful', name: '訂單付款成功' },
            { key: 'auto-email-order-create', name: '訂單成立' },
            { key: 'proof-purchase', name: '訂單待核款' },
            { key: 'auto-email-birthday', name: '生日祝福' },
            { key: 'get-customer-message', name: '客服訊息' },
        ],
    },
];
FilterOptions.snsFunnel = [
    {
        key: 'status',
        type: 'multi_checkbox',
        name: '寄送狀態',
        data: [
            { key: '0', name: '尚未寄送' },
            { key: '1', name: '已寄送' },
        ],
    },
    {
        key: 'mailType',
        type: 'multi_checkbox',
        name: '寄件類型',
        data: [
            { key: 'auto-sns-payment-successful', name: '訂單付款成功' },
            { key: 'auto-sns-order-create', name: '訂單成立' },
            { key: 'sns-proof-purchase', name: '訂單待核款' },
            { key: 'auto-sns-birthday', name: '生日祝福' },
        ],
    },
];
FilterOptions.recommendUserFilterFrame = {};
FilterOptions.recommendUserSelect = [
    { key: 'name', value: '推薦人名稱' },
    { key: 'email', value: '推薦人信箱' },
    { key: 'phone', value: '推薦人電話' },
];
FilterOptions.recommendUserOrderBy = [
    { key: 'default', value: '預設' },
    { key: 'name', value: '推薦人名稱' },
    { key: 'created_time_desc', value: '註冊時間新 > 舊' },
    { key: 'created_time_asc', value: '註冊時間舊 > 新' },
];
FilterOptions.permissionFilterFrame = {
    status: [],
};
FilterOptions.permissionSelect = [
    { key: 'name', value: '員工名稱' },
    { key: 'email', value: '電子信箱' },
    { key: 'phone', value: '電話號碼' },
];
FilterOptions.permissionFunnel = [
    {
        key: 'status',
        type: 'multi_checkbox',
        name: '存取權',
        data: [
            { key: 'yes', name: '開啟' },
            { key: 'no', name: '關閉' },
        ],
    },
];
FilterOptions.permissionOrderBy = [
    { key: 'default', value: '預設' },
    { key: 'name', value: '顧客名稱' },
    { key: 'online_time_asc', value: '最後登入時間早 > 晚' },
    { key: 'online_time_desc', value: '最後登入時間晚 > 早' },
];
