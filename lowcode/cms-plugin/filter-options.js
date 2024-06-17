export class FilterOptions {
}
FilterOptions.userFilterFrame = {
    created_time: ['', ''],
    birth: [],
    rank: [],
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
