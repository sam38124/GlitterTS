import { ApiTrack } from "../../glitter-base/route/api-track.js";
export class Ad {
    static gtagEvent(name, obj) {
        const gtag = window.gtag;
        if (gtag) {
            gtag('event', name, obj);
        }
    }
    static fbqEvent(name, obj) {
        const fbq = window.fbq;
        if (fbq) {
            fbq('track', name, obj);
        }
        ApiTrack.track({
            event_name: name,
            custom_data: obj
        });
    }
}
