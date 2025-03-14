import db from '../../modules/database';

export class Reconciliation {
  public app_name: string;

  public constructor(app: string) {
    this.app_name = app;
  }

  public async summary() {
    let result={
      total:0,
      total_received:0,
      offset_amount:0,
    };
    (await db.query(
      `select total, total_received, offset_amount
                    from \`${this.app_name}\`.t_checkout `,
      []
    )).map((item: any) => {
      if(item.total){
        result.total+=item.total;
        result.total_received+=item.total_received || 0;
        result.offset_amount+=item.offset_amount || 0;
        if(item.total_received !== null){

        }
      }
    });
  }
}
