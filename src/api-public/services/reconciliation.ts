import db from '../../modules/database';

function convertTimeZone(date: string) {
  return `CONVERT_TZ(${date}, '+00:00', '+08:00')`;
}

export class Reconciliation {
  public app_name: string;

  public constructor(app: string) {
    this.app_name = app;
  }

  //對仗總結
  public async summary(filter_date: string, start_date: string, end_date: string) {
    let result = {
      total: 0,
      total_received: 0,
      offset_amount: 0,
      expected_received: 0,
      order_count: 0,
      short_total_amount: 0,
      over_total_amount: 0,
    };
    const dayOffset = (() => {
      if (['week', '1m', 'year'].includes(filter_date)) {
        return `DATE(${convertTimeZone('created_time')}) > DATE_SUB(${convertTimeZone(`DATE(NOW())`)}, INTERVAL ${
          [7, 30, 365][['week', '1m', 'year'].indexOf(filter_date)]
        } DAY)`;
      } else {
        return `created_time>='${start_date}' and created_time<='${end_date}'`;
      }
    })();
    (
      await db.query(
        `select total, total_received, offset_amount
         from \`${this.app_name}\`.t_checkout
         WHERE ${dayOffset}
        `,
        []
      )
    ).map((item: any) => {
      if (item.total) {
        result.total += item.total;
        result.total_received += ((item.total_received || 0)+item.offset_amount);
        result.offset_amount += item.offset_amount || 0;
        // result.total_received;
        if (item.total_received !== null) {
          if (item.total_received > item.total) {
            result.over_total_amount += item.total_received - item.total + item.offset_amount;
          }
          if (item.total > item.total_received) {
            result.short_total_amount += item.total - item.total_received - item.offset_amount;
          }
        }
        result.order_count += 1;
      }
    });
    result.expected_received = result.total - result.total_received;
    result.offset_amount = Math.abs(result.over_total_amount) + Math.abs(result.short_total_amount);
    // result.total_received=result.total_received+result.over_total_amount-result.short_total_amount
    return result;
  }

  //新增對仗紀錄
  public async putReconciliation(obj: { order_id: string; update: any }) {
    console.log(`obj.update`, obj.update);
    if (obj.update.reconciliation_date) {
      obj.update.reconciliation_date = new Date(obj.update.reconciliation_date);
    }
    return await db.query(
      `update \`${this.app_name}\`.t_checkout
       set ?
       where cart_token = ?`,
      [obj.update, obj.order_id]
    );
  }
}
