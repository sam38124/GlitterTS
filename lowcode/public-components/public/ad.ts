import { ApiTrack } from '../../glitter-base/route/api-track.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { Glitter } from '../../glitterBundle/Glitter.js';

export class Ad {
  static gtagEvent(name: string, obj: any) {
    const gtag = (window as any).gtag;
    if (gtag) {
      gtag('event', name, obj);
    }
  }

  static async fbqEvent(name: string, obj: any) {
    const fbq = (window as any).fbq;
    obj.eventID = obj.eventID || (window as any).glitter.getUUID();
    if (fbq) {
      if (GlobalUser.userInfo) {
        async function hashSHA256(input: any) {
          const encoder = new TextEncoder();
          const data = encoder.encode(input.trim().toLowerCase());
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }

        const obj: any = {};

        if(GlobalUser.userInfo.email){
          obj.em = await hashSHA256(GlobalUser.userInfo.email);
        }
        if(GlobalUser.userInfo.phone){
          obj.ph = await hashSHA256(GlobalUser.userInfo.phone);
        }
        fbq('init', (window as any).fb_pixel_id, obj);
      }
      obj.fbc=((window as any).glitter as Glitter).cookie('_fbc')
      fbq('track', name, JSON.parse(JSON.stringify(obj)));
    }
    obj.event_id = obj.eventID;
    delete obj.eventID;
    ApiTrack.track({
      event_name: name,
      custom_data: obj,
    });
  }
}
