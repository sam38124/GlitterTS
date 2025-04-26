import process from 'process';
import db from '../modules/database';

export class CaughtError {
  public static initial() {
    // 捕捉未處理例外
    process.on('uncaughtException', async err => {
      //非本地開發再插入錯誤
      if(process.env.is_local !== 'true'){
        console.error('Uncaught Exception:', err);
        if(err.message.includes('Too many connections')){

        }else{
          await db.query(
            `insert into \`${process.env.GLITTER_DB}\`.error_log (message, stack)
                        values (?, ?)`,
            [err.message, err.stack]
          );
          process.exit(1); // 終止應用程式
        }
      }else{
        console.error('Uncaught Exception:', err);
        process.exit(1); // 終止應用程式
      }
    });
  }

  public static warning(tag: string, message: string, stack: string) {
    db.query(
      `insert into \`${process.env.GLITTER_DB}\`.warning_log (tag, message, stack)
              values (?, ?, ?)`,
      [tag, message, stack]
    );
  }
}
