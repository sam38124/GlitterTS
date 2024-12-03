import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {ApiUser} from "../../api/user.js";
import {ShareDialog} from "../../glitterBundle/dialog/ShareDialog.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {UmClass} from "../user-manager/um-class.js";

export class Blogs01 {
    static main(gvc: GVC, subData: any) {
        if (subData.content.generator !== 'page_editor') {
            return subData.content.text;
        } else {
            console.log(`subData.content==>`, subData.content.show_auth)

            function startRender() {
                //隱形賣場和一頁商店，預設加入購物車
                if (subData.content.relative_data && ["shopping", "hidden"].includes(subData.content.page_type) && (localStorage.getItem('block-refresh-cart') !== 'true')) {
                    subData.content.relative_data.map((dd: any) => {
                        const key = [dd.product_id].concat(dd.variant.spec).join('-')
                        const cart = gvc.glitter.share.ApiCart.cart;
                        const line_item = cart.line_items.find((dd: any) => {
                            return `${dd.id}-${dd.spec.join('-')}` === key
                        })
                        let cle: any[] = [];
                        cart.line_items.map((dd: any) => {
                            if (!cle.find((d1) => {
                                return `${dd.id}-${dd.spec.join('-')}` === `${d1.id}-${d1.spec.join('-')}`
                            })) {
                                cle.push(dd)
                            }
                        });
                        cart.line_items = cle;
                        if (!line_item) {
                            cart.line_items.push({
                                id: dd.product_id,
                                spec: dd.variant.spec,
                                count: 1
                            })
                        }
                        gvc.glitter.share.ApiCart.cart = cart
                    })
                } else {
                    localStorage.setItem('block-refresh-cart', 'false')
                }
                return new gvc.glitter.htmlGenerate(subData.content.config, [], subData.content).render(gvc, {
                    class: `w-100`,
                    style: `position:relative;`,
                    containerID: gvc.glitter.getUUID(),
                    tag: gvc.glitter.getUUID(),
                    jsFinish: () => {
                    },
                    onCreate: () => {

                    },
                    document: document
                }, {})
            }

            //判斷是隱形賣場決定是否可見
            if (subData.content.page_type === 'hidden') {
                if (subData.content.show_auth.auth === 'all') {
                    return startRender()
                } else if (subData.content.show_auth.auth  === "password") {
                    if (localStorage.getItem('password_to_see_' + subData.content.tag) === subData.content.show_auth.value) {
                        return startRender()
                    }
                    return gvc.bindView(() => {
                        const rid = gvc.glitter.getUUID()
                        return {
                            bind: rid,
                            view: () => {
                                return ``
                            },
                            divCreate: {
                                option: [
                                    {key: 'id', value: rid}
                                ]
                            },
                            onCreate: () => {
                                function checkPwd() {
                                    const pwd = window.prompt('請輸入網站密碼', '');
                                    localStorage.setItem('password_to_see_' + subData.content.tag, pwd ?? '');
                                    if (subData.content.show_auth.value === pwd) {
                                        document.querySelector(`#${rid}`)!.outerHTML = startRender()
                                    } else {
                                        const dialog = new ShareDialog(gvc.glitter)
                                        dialog.checkYesOrNot({
                                            text: '網站密碼輸入錯誤', callback: () => {
                                                gvc.glitter.closeDiaLog()
                                                checkPwd()
                                            }
                                        })
                                    }
                                }
                                checkPwd()
                            }
                        }
                    })
                }else if(subData.content.show_auth.auth  === "member_type"){
                    return gvc.bindView(() => {
                        const rid = gvc.glitter.getUUID()
                        return {
                            bind: rid,
                            view: () => {
                                return ``
                            },
                            divCreate: {
                                option: [
                                    {key: 'id', value: rid}
                                ]
                            },
                            onCreate: () => {
                                const dialog=new ShareDialog(gvc.glitter)
                                UmClass.getUserData(gvc).then((resp: any) => {
                                    try {
                                        const mem = resp.member.find((d:any) => {
                                            return d.trigger;
                                        });
                                        if(subData.content.show_auth.value.includes(mem.id)){
                                            document.querySelector(`#${rid}`)!.outerHTML = startRender()
                                        }else{
                                            dialog.errorMessage({text:'無訪問權限'})
                                            gvc.glitter.href='/index'
                                        }
                                    } catch (e) {
                                        dialog.errorMessage({text:'無訪問權限'})
                                        gvc.glitter.href='/index'
                                    }
                                })
                            }
                        }
                    })

                }else{
                    return startRender()
                }
                // ApiUser
            } else {
                return startRender()
            }

        }
    }
}

(window as any).glitter.setModule(import.meta.url, Blogs01);
