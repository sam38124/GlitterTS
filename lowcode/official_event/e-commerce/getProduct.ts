import {TriggerEvent} from '../../glitterBundle/plugins/trigger-event.js';
import {ApiShop} from "../../glitter-base/route/shopping.js";
import {EditorElem} from "../../glitterBundle/plugins/editor-elem.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {

            return {
                editor: () => {
                    object.getType =object.getType ?? "manual"
                    const id = gvc.glitter.getUUID()
                    return EditorElem.select({
                        title:"取得商品方式",
                        gvc:gvc,
                        def:object.getType ?? "manual",
                        array:[{title:'手動輸入',value:'manual'},{title:'程式碼帶入',value:'code'}],
                        callback:(text)=>{
                            object.getType=text
                            gvc.notifyDataChange(id)
                        }
                    })+`<div class="my-2"></div>`+gvc.bindView(() => {
                        let interval: any = 0
                        return {
                            bind: id,
                            view: () => {
                                return new Promise(async (resolve, reject) => {
                                    if(object.getType=='manual'){
                                        const title=await new Promise((resolve, reject)=>{
                                            ApiShop.getProduct({page: 0, limit: 50, id: object.id}).then((data) => {
                                                if(data.result && data.response.result){
                                                    resolve(data.response.data.content.title)
                                                }else{
                                                    resolve('')
                                                }
                                            })
                                        })

                                        resolve(EditorElem.searchInputDynamic({
                                            title: '搜尋商品',
                                            gvc: gvc,
                                            def: title as string,
                                            search: (text, callback) => {
                                                clearInterval(interval)
                                                interval = setTimeout(() => {
                                                    ApiShop.getProduct({page: 0, limit: 50, search: ''}).then((data) => {
                                                        callback(data.response.data.map((dd: any) => {
                                                            return dd.content.title
                                                        }))
                                                    })
                                                }, 100)
                                            },
                                            callback: (text) => {
                                                ApiShop.getProduct({page: 0, limit: 50, search: text}).then((data) => {
                                                    object.id=data.response.data.find((dd: any) => {
                                                        return dd.content.title===text
                                                    }).id
                                                })
                                            },
                                            placeHolder: '請輸入商品名稱'
                                        }))
                                    }else{
                                        object.dataFrom=object.dataFrom ?? {}
                                        object.comefromTp= object.comefromTp ?? 'single'

                                        resolve([EditorElem.select({
                                            title:'來源類型',
                                            gvc:gvc,
                                            def:object.comefromTp,
                                            array:[
                                                {
                                                    title:'單一',
                                                    value:'single'
                                                },
                                                {
                                                    title:'多項',
                                                    value:'multiple'
                                                }
                                            ],
                                            callback:(text)=>{
                                                object.comefromTp=text
                                            }
                                        }),TriggerEvent.editer(gvc,widget,object.dataFrom,{
                                            hover:false,
                                            title:"取得商品ID",
                                            option:[]
                                        })].join(`<div class="my-2"></div>`))
                                    }
                                })
                            },
                            divCreate: {
                                style: `min-height:400px;pt-2`
                            }
                        }
                    })
                },
                event: () => {
                    return new Promise(async (resolve, reject)=>{
                      const data=  await new Promise(async (resolve, reject)=>{
                          if(object.getType=='code'){
                              const id:any=await TriggerEvent.trigger({
                                  gvc:gvc,
                                  widget:widget,
                                  clickEvent:object.dataFrom,
                                  subData:subData
                              })
                              if(object.comefromTp==='multiple'){
                                  ApiShop.getProduct({page: 0, limit: 200, id_list: id}).then((data) => {
                                      if(data.result && data.response.data){
                                          resolve(data.response.data.map((dd:any)=>{
                                              return dd.content;
                                          }))
                                      }else{
                                          resolve('')
                                      }
                                  })
                              }else{
                                  ApiShop.getProduct({page: 0, limit: 50, id: id}).then((data) => {
                                      if(data.result && data.response.result){
                                          resolve(data.response.data.content)
                                      }else{
                                          resolve('')
                                      }
                                  })
                              }

                          }else{
                              ApiShop.getProduct({page: 0, limit: 50, id: object.id}).then((data) => {
                                  if(data.result && data.response.result){
                                      resolve(data.response.data.content)
                                  }else{
                                      resolve('')
                                  }
                              })
                          }
                        })
                        resolve(data)
                    })
                },
            };
        },
    };
});
