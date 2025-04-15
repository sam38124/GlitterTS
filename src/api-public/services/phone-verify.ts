import redis from '../../modules/redis.js';

export class PhoneVerify{
  public static async verify(phone:string,code:string){
    if(await redis.getValue(`verify-phone-${phone}`)===code){
       redis.deleteKey(`verify-phone-${phone}-last-count`);
      return true;
    }else{
      return false;
    }

  }
}