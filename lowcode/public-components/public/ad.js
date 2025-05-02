var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiTrack } from '../../glitter-base/route/api-track.js';
import { GlobalUser } from '../../glitter-base/global/global-user.js';
export class Ad {
    static gtagEvent(name, obj) {
        const gtag = window.gtag;
        if (gtag) {
            gtag('event', name, obj);
        }
    }
    static fbqEvent(name, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const fbq = window.fbq;
            obj.eventID = obj.eventID || window.glitter.getUUID();
            if (fbq) {
                if (GlobalUser.userInfo) {
                    function hashSHA256(input) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const encoder = new TextEncoder();
                            const data = encoder.encode(input.trim().toLowerCase());
                            const hashBuffer = yield crypto.subtle.digest('SHA-256', data);
                            return Array.from(new Uint8Array(hashBuffer))
                                .map(b => b.toString(16).padStart(2, '0'))
                                .join('');
                        });
                    }
                    const obj = {};
                    if (GlobalUser.userInfo.email) {
                        obj.email = yield hashSHA256(GlobalUser.userInfo.email);
                    }
                    if (GlobalUser.userInfo.phone) {
                        obj.phone = yield hashSHA256(GlobalUser.userInfo.phone);
                    }
                    fbq('init', window.fb_pixel_id, obj);
                }
                fbq('track', name, JSON.parse(JSON.stringify(obj)));
            }
            obj.event_id = obj.eventID;
            delete obj.eventID;
            ApiTrack.track({
                event_name: name,
                custom_data: obj,
            });
        });
    }
}
