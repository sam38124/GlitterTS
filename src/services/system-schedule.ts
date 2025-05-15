import exception from "../modules/exception";
import {Schedule} from "../api-public/services/schedule";
import db from '../modules/database';
import {Ssh} from "../modules/ssh";
type ScheduleItem = {
    second: number;
    status: boolean;
    func: keyof SystemSchedule;
    desc: string;
};

export class SystemSchedule {
    //檢查mysql狀態，如異常則重啟。
    async checkMysqlStatus(sec: number) {
      const prepared_stmt_count=(await db.query(`show global status like 'prepared_stmt_count';`,[]))[0]['Value']
      if(parseInt(prepared_stmt_count,10)> 10000){
           const response = await new Promise((resolve, reject) => {
               Ssh.exec([
                   //重啟MYSQL
                   // `sudo systemctl restart mysqld`,
                   //重啟Docker
                   `sudo docker restart $(sudo docker ps --filter "expose=3080" --format "{{.ID}}")`]).then(
                   (res: any) => {
                       resolve(res && res.join('').indexOf('Successfully') !== -1);
                   }
               );
           });
       }else{
           setTimeout(()=>{
               this.checkMysqlStatus(sec)
           },sec)
       }
    }

     start() {
        const scheduleList: ScheduleItem[] = [
            {second: 60, status: true, func: 'checkMysqlStatus', desc: 'MYSQL狀態檢查'}
        ];
        try {
            scheduleList.forEach((schedule: any) => {
                if (schedule.status && typeof (this as any)[schedule.func] === 'function') {
                    ((this as any)[schedule.func] as (sec: number) => void)(schedule.second);
                }
            });
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'Init Schedule Error: ' + e, null);
        }
    }
}