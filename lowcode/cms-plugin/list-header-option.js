export class ListHeaderOption {
}
ListHeaderOption.userListFrame = {
    headerColumn: [],
};
ListHeaderOption.userListItems = [
    {
        key: 'headerColumn',
        type: 'multi_checkbox',
        name: '欄位顯示',
        data: [
            '顧客名稱',
            '電子信箱',
            '訂單',
            '會員等級',
            '累積消費',
            '上次登入時間',
            '最後出貨時間',
            '社群綁定',
            '用戶狀態',
        ].map(t => ({
            key: t,
            name: t,
        })),
        defaultOpen: true,
    },
];
ListHeaderOption.orderListFrame = {
    headerColumn: [],
};
ListHeaderOption.orderListItems = [
    {
        key: 'headerColumn',
        type: 'multi_checkbox',
        name: '欄位顯示',
        data: ['訂單編號', '訂單日期', '訂購人', '訂單金額', '付款狀態', '出貨狀態', '訂單狀態'].map(t => ({
            key: t,
            name: t,
        })),
        defaultOpen: true,
    },
];
