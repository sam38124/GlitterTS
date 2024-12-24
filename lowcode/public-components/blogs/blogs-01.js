import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { UmClass } from '../user-manager/um-class.js';
import { Language } from '../../glitter-base/global/language.js';
import { ApiCart } from "../../glitter-base/route/api-cart.js";
export class Blogs01 {
    static main(gvc, subData) {
        if (subData.content.generator !== 'page_editor') {
            return subData.content.text;
        }
        else {
            function startRender() {
                if (subData.content.relative_data && ['shopping', 'hidden'].includes(subData.content.page_type) && localStorage.getItem('block-refresh-cart') !== 'true') {
                    subData.content.relative_data.map((dd) => {
                        const key = [dd.product_id].concat(dd.variant.spec).join('-');
                        const cart = (new ApiCart()).cart;
                        const line_item = cart.line_items.find((dd) => {
                            return `${dd.id}-${dd.spec.join('-')}` === key;
                        });
                        let cle = [];
                        cart.line_items.map((dd) => {
                            if (!cle.find((d1) => {
                                return `${dd.id}-${dd.spec.join('-')}` === `${d1.id}-${d1.spec.join('-')}`;
                            })) {
                                cle.push(dd);
                            }
                        });
                        cart.line_items = cle;
                        if (!line_item) {
                            cart.line_items.push({
                                id: dd.product_id,
                                spec: dd.variant.spec,
                                count: 1,
                            });
                        }
                        gvc.glitter.share.ApiCart.cart = cart;
                    });
                }
                else {
                    localStorage.setItem('block-refresh-cart', 'false');
                }
                return new gvc.glitter.htmlGenerate(subData.content.config, [], subData.content).render(gvc, {
                    class: `w-100`,
                    style: `position:relative;`,
                    containerID: gvc.glitter.getUUID(),
                    tag: gvc.glitter.getUUID(),
                    jsFinish: () => { },
                    onCreate: () => { },
                    document: document,
                }, {});
            }
            if (subData.content.page_type === 'hidden') {
                if (subData.content.show_auth.auth === 'all') {
                    return startRender();
                }
                else if (subData.content.show_auth.auth === 'password') {
                    if (localStorage.getItem('password_to_see_' + subData.content.tag) === subData.content.show_auth.value) {
                        return startRender();
                    }
                    return gvc.bindView(() => {
                        const rid = gvc.glitter.getUUID();
                        return {
                            bind: rid,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                option: [{ key: 'id', value: rid }],
                            },
                            onCreate: () => {
                                function checkPwd() {
                                    const pwd = window.prompt(Language.text('enter_website_password'), '');
                                    localStorage.setItem('password_to_see_' + subData.content.tag, pwd !== null && pwd !== void 0 ? pwd : '');
                                    if (subData.content.show_auth.value === pwd) {
                                        document.querySelector(`#${rid}`).outerHTML = startRender();
                                    }
                                    else {
                                        const dialog = new ShareDialog(gvc.glitter);
                                        dialog.checkYesOrNot({
                                            text: Language.text('incorrect_website_password'),
                                            callback: () => {
                                                gvc.glitter.closeDiaLog();
                                                checkPwd();
                                            },
                                        });
                                    }
                                }
                                checkPwd();
                            },
                        };
                    });
                }
                else if (subData.content.show_auth.auth === 'member_type') {
                    return gvc.bindView(() => {
                        const rid = gvc.glitter.getUUID();
                        return {
                            bind: rid,
                            view: () => {
                                return ``;
                            },
                            divCreate: {
                                option: [{ key: 'id', value: rid }],
                            },
                            onCreate: () => {
                                const dialog = new ShareDialog(gvc.glitter);
                                UmClass.getUserData(gvc).then((resp) => {
                                    try {
                                        const mem = resp.member.find((d) => {
                                            return d.trigger;
                                        });
                                        if (subData.content.show_auth.value.includes(mem.id)) {
                                            document.querySelector(`#${rid}`).outerHTML = startRender();
                                        }
                                        else {
                                            dialog.errorMessage({ text: Language.text('no_access_permission') });
                                            gvc.glitter.href = '/index';
                                        }
                                    }
                                    catch (e) {
                                        dialog.errorMessage({ text: Language.text('no_access_permission') });
                                        gvc.glitter.href = '/index';
                                    }
                                });
                            },
                        };
                    });
                }
                else {
                    return startRender();
                }
            }
            else {
                return startRender();
            }
        }
    }
}
window.glitter.setModule(import.meta.url, Blogs01);
