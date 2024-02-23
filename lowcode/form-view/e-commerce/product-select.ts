import {CreateForm} from "../create-form.js";
import {GVC} from "../../glitterBundle/GVController.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {ApiShop} from "../../glitter-base/route/shopping.js";

CreateForm.setFormModule(import.meta.url,(bundle:{
    gvc:GVC,
    formData:any,
    key:string
})=>{
    const glitter=bundle.gvc.glitter
    bundle.formData[bundle.key]=bundle.formData[bundle.key] ?? ''
    return bundle.gvc.bindView(()=>{
        const id=glitter.getUUID()
        let interval:any=0;
        function refresh(){
            bundle.gvc.notifyDataChange(id)
        }
        return {
            bind:id,
            view:()=>{
                return new Promise(async (resolve, reject) => {
                    const title = await new Promise((resolve, reject) => {
                        ApiShop.getProduct({
                            page: 0,
                            limit: 50,
                            id: bundle.formData[bundle.key]
                        }).then((data) => {
                            if (data.result && data.response.result) {
                                resolve(data.response.data.content.title)
                            } else {
                                resolve('')
                            }
                        })
                    })
                    resolve(EditorElem.searchInputDynamic({
                        title: '搜尋商品',
                        gvc: bundle.gvc,
                        def: title as string,
                        search: (text, callback) => {
                            clearInterval(interval)
                            interval = setTimeout(() => {
                                ApiShop.getProduct({
                                    page: 0,
                                    limit: 50,
                                    search: ''
                                }).then((data) => {
                                    callback(data.response.data.map((dd: any) => {
                                        return dd.content.title
                                    }))
                                })
                            }, 100)
                        },
                        callback: (text) => {
                            ApiShop.getProduct({
                                page: 0,
                                limit: 50,
                                search: text
                            }).then((data) => {
                                bundle.formData[bundle.key] = data.response.data.find((dd: any) => {
                                    return dd.content.title === text
                                }).id
                            })
                        },
                        placeHolder: '請輸入商品名稱'
                    }))
                })
            },
            divCreate:{
                style:'min-height:200px;'
            }
        }
    })
})