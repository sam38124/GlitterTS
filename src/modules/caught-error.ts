import process from 'process';
import db from '../modules/database';
export class CaughtError {
  public static initial() {
    // 捕捉未處理例外
    process.on('uncaughtException',async err => {
      console.error('Uncaught Exception:', err);
      console.error('uncaughtException', err.message, err.stack);
      await db.query(`insert into \`${process.env.GLITTER_DB}\`.error_log (message, stack) values (?, ?)`,[
        err.message,
        err.stack
      ])
      process.exit(1); // 終止應用程式
    });
  }
}
