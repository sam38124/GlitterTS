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
    }
}
