import { ApiTrack } from '../../glitter-base/route/api-track.js';
export class Ad {
    static gtagEvent(name, obj) {
        const gtag = window.gtag;
        if (gtag) {
            gtag('event', name, obj);
        }
    }
    static fbqEvent(name, obj) {
        const fbq = window.fbq;
        obj.eventID = obj.eventID || window.glitter.getUUID();
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
