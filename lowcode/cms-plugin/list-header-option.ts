export class ListHeaderOption {
  static userListFrame = {
    headerColumn: [],
  };

  static userListItems = [
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

  static orderListFrame = {
    headerColumn: [],
  };

  static orderListItems = [
    {
      key: 'headerColumn',
      type: 'multi_checkbox',
      name: '欄位顯示',
      data: [
        '訂單編號',
        '訂單日期',
        '訂購人',
        '收件人',
        '訂單金額',
        '付款狀態',
        '出貨狀態',
        '訂單狀態',
        '運送方式',
        '付款方式',
        '付款時間',
        '對帳狀態',
        '發票號碼',
      ].map(t => ({
        key: t,
        name: t,
      })),
      defaultOpen: true,
    },
  ];
}
