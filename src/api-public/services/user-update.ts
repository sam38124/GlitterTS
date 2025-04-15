import { User } from './user.js';
import db from '../../modules/database.js';

export class UserUpdate {
  public static async update(app_name:string,userID:string) {
    const levels = await new User(app_name).getUserLevel([{userId:userID}]);
    const dd_=levels.find((dd)=>{
      return `${dd.id}`===`${userID}`
    })
    if(dd_?.data.id){
      await db.query(`update \`${app_name}\`.t_user set member_level=? where userID=?`,[
        dd_?.data.id,
        userID
      ])
    }

    await db.query(`UPDATE \`${app_name}\`.t_user
                    SET
                        phone = JSON_UNQUOTE(JSON_EXTRACT(userData, '$.phone')),
                        email = JSON_UNQUOTE(JSON_EXTRACT(userData, '$.email'))  where userID>?`,[
      userID
    ])
  }
}
