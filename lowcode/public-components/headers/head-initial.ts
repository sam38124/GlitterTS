import { GVC } from '../../glitterBundle/GVController.js';

export class HeadInitial{
  public static initial(cf: { browser: () => string; mobile: () => string, gvc: GVC,widget:any }) {
    const gvc = cf.gvc;
    if(gvc.glitter.share.is_application){

      return cf.mobile()
    }else{
      return cf.browser()
    }
  }
}