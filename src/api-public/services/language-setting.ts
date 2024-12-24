import {User} from "./user.js";

export class LanguageSetting {
   public static async getLanguage(prefer:string,appName:string){
       let store_info = await new User(appName).getConfigV2({
           key: 'store-information',
           user_id: 'manager',
       });
       if(store_info.language_setting.support.includes(prefer)){
           return prefer
       }else{
           return store_info.language_setting.def;
       }
   }
}