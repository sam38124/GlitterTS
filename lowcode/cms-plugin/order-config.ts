export class OrderConfig{
  public static orderRow(orderData:any){
    return {
      // value by order
      訂單編號: orderData.orderID,
      訂單來源: orderData.orderSource === 'POS' ? 'POS' : '手動',
      訂單建立時間: glitter.ut.dateFormat(new Date(order.created_time), 'yyyy-MM-dd hh:mm:ss'),
      會員信箱: order.email ?? 'no-email',
      訂單處理狀態: (() => {
        switch (orderData.orderStatus ?? '0') {
          case '-1':
            return '已取消';
          case '1':
            return '已完成';
          case '0':
          default:
            return '處理中';
        }
      })(),
      付款狀態: (() => {
        switch (order.status ?? 0) {
          case 1:
            return '已付款';
          case -1:
            return '付款失敗';
          case -2:
            return '已退款';
          case 0:
          default:
            return '未付款';
        }
      })(),
      出貨狀態: (() => {
        switch (orderData.progress ?? 'wait') {
          case 'pre_order':
            return '待預購';
          case 'shipping':
            return '已出貨';
          case 'finish':
            return '已取貨';
          case 'arrived':
            return '已送達';
          case 'returns':
            return '已退貨';
          case 'wait':
          default:
            return '未出貨';
        }
      })(),
      訂單小計: orderData.total + orderData.discount - orderData.shipment_fee + orderData.use_rebate,
      訂單運費: orderData.shipment_fee,
      訂單使用優惠券: orderData.voucherList.map((voucher: any) => voucher.title).join(', '),
      訂單折扣: orderData.discount,
      訂單使用購物金: orderData.use_rebate,
      訂單總計: orderData.total,
      分銷連結代碼: orderData.distribution_info?.code ?? '',
      分銷連結名稱: orderData.distribution_info?.title ?? '',
      // value by lineitem
      商品名稱: item.title,
      商品規格: item.spec.length > 0 ? item.spec.join(' / ') : '單一規格',
      商品SKU: item.sku ?? '',
      商品購買數量: item.count,
      商品價格: item.sale_price,
      商品折扣: item.discount_price,
      // value by user
      顧客姓名: orderData.customer_info.name,
      顧客手機: orderData.customer_info.phone,
      顧客信箱: orderData.customer_info.email,
      收件人姓名: orderData.user_info.name,
      收件人手機: orderData.user_info.phone,
      收件人信箱: orderData.user_info.email,
      備註: orderData.user_info.note ?? '',
    }
  }
}