var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiUser } from "../../glitter-base/route/user.js";
import { Language } from "../../glitter-base/global/language.js";
const html = String.raw;
export class TermsRelated {
    static main(obj) {
        const gvc = obj.gvc;
        const glitter = gvc.glitter;
        const title_color = glitter.share.globalValue['theme_color.0.title'];
        const page = glitter.getUrlParameter('page');
        return gvc.bindView(() => {
            return {
                bind: glitter.getUUID(),
                view: () => __awaiter(this, void 0, void 0, function* () {
                    if ((`${glitter.getUrlParameter('page')}`.startsWith(`collections`)) ||
                        (`${glitter.getUrlParameter('page')}`.startsWith(`all-product`))) {
                        return yield new Promise((resolve, reject) => {
                            glitter.getModule(new URL('./public-components/product/product-list.js', gvc.glitter.root_path).href, (res) => {
                                resolve(res.main(gvc));
                            });
                        });
                    }
                    else {
                        let lan_d = (yield ApiUser.getPublicConfig(`terms-related-${page}-${Language.getLanguage()}`, 'manager')).response.value.text;
                        if (!lan_d) {
                            lan_d = (yield ApiUser.getPublicConfig(`terms-related-${page}-${window.store_info.language_setting.def}`, 'manager')).response.value.text;
                        }
                        return html `
                        <div class="mb-5 mt-3" style="min-height: calc(100vh - 200px);">
                            ${lan_d || ''}
                        </div>`;
                    }
                }),
                divCreate: {
                    class: `container text-center`
                }
            };
        });
    }
}
window.glitter.setModule(import.meta.url, TermsRelated);
