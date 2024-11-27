export class Ad {
    static gtagEvent(name: string, obj: any) {
        const gtag = (window as any).gtag;
        if (gtag) {
            gtag('event', name, obj);
        }
    }

    static fbqEvent(name: string, obj: any) {
        const fbq = (window as any).fbq;
        if (fbq) {
            fbq('track', name, obj);
        }
    }
}
