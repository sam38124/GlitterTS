import { ApiTrack } from '../../glitter-base/route/api-track.js';

export class Ad {
  static gtagEvent(name: string, obj: any) {
    const gtag = (window as any).gtag;
    if (gtag) {
      gtag('event', name, obj);
    }
  }

  static fbqEvent(name: string, obj: any) {
    const fbq = (window as any).fbq;
    obj.eventID = obj.eventID || (window as any).glitter.getUUID();
    if (fbq) {
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
