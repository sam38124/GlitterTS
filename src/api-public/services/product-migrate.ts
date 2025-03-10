import db from '../../modules/database.js';

export class ProductMigrate{

  public static async migrate(app_name:string,obj:{content:any,id:string,created_time:string,updated_time:string}[]){
    // let updateSet:any[]=[]
    // for (const b of obj){
    //
    //   updateSet.push({
    //     active:b.content.status,
    //     sold_out:
    //   })
    // }
    // await db.query(
    //   `insert into \`${obj.app_name}\`.t_checkout
    //    set ?
    //    where id = ${obj.id}`,
    //   [update_object]
    // );
  }
}