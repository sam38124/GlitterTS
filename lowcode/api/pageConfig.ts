import {config} from "../config.js";
import {BaseApi} from "../glitterBundle/api/base.js";
import {GlobalUser} from "../glitter-base/global/global-user.js";
import {EditorElem} from "../glitterBundle/plugins/editor-elem";
import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";
import { ApiUser } from '../glitter-base/route/user.js';


export class ApiPageConfig {
    constructor() {
    }

    public static getAppList(theme?: string,token?:string) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app?` + (() => {
                let search: any = [];
                theme && search.push(`theme=${theme}`)
                return search.join('&')
            })(),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": token || GlobalUser.saas_token
            }
        })
    }

    public static getGlitterVersion() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/version?library=ts-glitter`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        })
    }

    public static getTemplateList() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/template?template_from=all`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            }
        })
    }

    public static getAppConfig() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app?appName=${config.appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static deleteApp(appName: string) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.saas_token
            },
            data: JSON.stringify({
                appName: appName
            })
        })
    }
    public static setSubDomain(cf: {
        app_name:string,
        sub_domain:string,
        token?: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/sub_domain`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": cf.token || config.token
            },
            data: JSON.stringify(cf)
        })
    }
    public static setDomain(cf: {
        domain: string,
        app_name?: string
        token?: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/domain`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": cf.token || config.token
            },
            data: JSON.stringify({
                app_name: cf.app_name || config.appName,
                domain: cf.domain
            })
        })
    }

    public static getPage(request: {
        appName?: string, tag?: string, group?: string, type?: 'article' | 'template', page_type?: string, me?: boolean, favorite?: boolean, token?: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template?` +
                (() => {
                    const query: string[] = [];
                    (request.appName) && (query.push(`appName=${request.appName}`));
                    (request.tag) && (query.push(`tag=${request.tag}`));
                    (request.group) && (query.push(`group=${request.group}`));
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.page_type) && (query.push(`page_type=${request.page_type}`));
                    (request.me) && (query.push(`me=${request.me}`));
                    (request.favorite) && (query.push(`favorite=${request.favorite}`));
                  (window as any).page_refer && query.push(`page_refer=${(window as any).page_refer}`);
                    return query.join('&')
                })()
            ,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": request.token || config.token
            }
        })
    }

    public static getPageTemplate(request: {
        template_from: 'all' | 'me' | 'project',
        page?: string,
        limit?: string,
        type?: 'page' | 'module' | 'article' | 'blog' | 'backend' | 'form_plugin',
        tag?: string,
        search?: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/template?` +
                (() => {
                    const query: string[] = [];
                    (request.template_from) && (query.push(`template_from=${request.template_from}`));
                    (request.page) && (query.push(`page=${request.page}`));
                    (request.limit) && (query.push(`limit=${request.limit}`));
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.tag) && (query.push(`tag=${request.tag}`));
                    (request.search) && (query.push(`search=${request.search}`));
                    return query.join('&')
                })()
            ,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static getTagList(request: {
        type: 'page' | 'module' | 'article' | 'blog' | 'backend',
        template_from: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/tag_list?` +
                (() => {
                    const query: string[] = [];
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.template_from) && (query.push(`template_from=${request.template_from}`));
                    return query.join('&')
                })()
            ,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static setPage(data: {
        "id": number
        "appName": "lionDesign",
        "tag"?: any,
        "group"?: "首頁相關",
        "name"?: "首頁",
        "config"?: [],
        "page_config"?: any,
        "page_type"?: string,
        favorite?: number,
        preview_image?: string
    }):Promise<{
      result: boolean
    }> {
const glitter=(window as any).glitter;
      if(data.tag==='c_header' && ['pages/','hidden/','shop/'].find((dd)=>{
        return (window.parent as any).glitter.getUrlParameter('page').startsWith(dd)
      })){
       return  new Promise(async (resolve,reject)=>{
         (data.config as any)[0].is_customer_header=true;
         await ApiUser.setPublicConfig({
           key: 'c_header_'+(window.parent as any).glitter.getUrlParameter('page'),
           value: data.config,
           user_id: 'manager',
         })
         resolve({
           result: true
         })
       });
      }else if(data.tag==='footer' && ['pages/','hidden/','shop/'].find((dd)=>{
        return (window.parent as any).glitter.getUrlParameter('page').startsWith(dd)
      })){
        return  new Promise(async (resolve,reject)=>{
          (data.config as any)[0].is_customer_footer=true;
          await ApiUser.setPublicConfig({
            key: 'c_footer_'+(window.parent as any).glitter.getUrlParameter('page'),
            value: data.config,
            user_id: 'manager',
          })
          resolve({
            result: true
          })
        })
      }else{
        return BaseApi.create({
          "url": config.url + `/api/v1/template`,
          "type": "PUT",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json",
            "Authorization": config.token
          },
          data: JSON.stringify(data)
        })
      }

    }

    public static addPage(data: {
        "appName": string,
        "tag": string,
        "group"?: string,
        "name"?: string,
        "config"?: [],
        "page_config"?: any,
        "copy"?: string,
        copyApp?: string,
        page_type?: string,
        replace?: boolean
    }) {

        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        })
    }

    public static getPlugin(appName: string) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/plugin?appName=${appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        })
    }

    public static deletePage(data: {
        "id"?: number
        "appName": string,
        "tag"?: string
    }) {

        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        })
    }

    public static setPlugin(appName: string, obj: any) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/plugin`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: appName,
                config: obj
            })
        })
    }

    public static createTemplate(appName: string, obj: any,token?:string) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/create_template`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": token || config.token
            },
            data: JSON.stringify({
                appName: appName,
                config: obj
            })
        })
    }

    public static createPageTemplate(appName: string, obj: any, tag: string) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/template`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: appName,
                config: obj,
                tag: tag
            })
        })
    }


    public static setPrivateConfig(appName: string, key: any, value: any) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization":  (window.parent as any).saasConfig.config.token
            },
            data: JSON.stringify({
                appName: appName,
                key: key,
                value: value
            })
        })
    }

    public static setPrivateConfigV2(cf: {
        key: string,
        value: string,
        appName?: string
    }) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: cf.appName || config.appName,
                key: cf.key,
                value: cf.value
            })
        })
    }

    public static getPrivateConfig(appName: string, key: any) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private?appName=${appName}&key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": (window.parent as any).saasConfig.config.token
            }
        })
    }

    public static getPrivateConfigV2(key: any) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private?appName=${config.appName}&key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static getEditorToken() {
        return BaseApi.create({
            "url": config.url + `/api/v1/user/editorToken`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        })
    }

    public static uploadFile(fileName: string) {
        return BaseApi.create({
            "url": config.url + `/api/v1/fileManager/upload`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                "fileName": fileName
            })
        })
    }
    public static async uploadFileAll(files:File | File[],type:'blob'|'file'='file'){
        if(!Array.isArray(files)){files=[files]}
        const dialog=new ShareDialog((window as any).glitter)
        let result=true
        let links:string[]=[]
        for (const file of files){
            const fileSizeKB = file.size / 1024; // 轉換為 KB
            // 假設你想限制上傳檔案最大為 500 KB
            if((file.name.toLowerCase()).endsWith('png')||(file.name.toLowerCase()).endsWith('jpg')||(file.name.toLowerCase()).endsWith('jpeg')){
                if (fileSizeKB > 500) {
                    const result=await new Promise((resolve,reject)=>{
                        dialog.checkYesOrNot({
                            text:'圖片上傳大小不得超過 500 KB，避免網頁加載速度緩慢，是否透過系統自動壓縮畫質?',
                            callback:(response)=>{
                                if(response){
                                    resolve(true)
                                }else{
                                    resolve(false)
                                }
                            }
                        })
                    })
                    if(!result){
                        dialog.dataLoading({visible:false})
                        return
                    }

                }
            }

            const file_id=(window as any).glitter.getUUID()
            //取得檔案名稱
            function getFileName(size?:any){
              let file_name  = (
                    file.name ||
                    `${file_id}.${(() => {
                        if (file.type === 'image/jpeg') {
                            return `jpg`;
                        } else if (file.type === 'image/png') {
                            return `png`;
                        } else {
                            return `png`;
                        }
                    })()}`
                ).replace(/ /g, '').replace(/'/g,'').replace(/"/g,'')

                if(file.type.startsWith('image')){
                    file_name=`${size ?`size${size}_`:``}s*px$_${file_id}_${file_name}`
                }
                return file_name
            }
            //壓縮圖片後再上傳
            if((file.name.toLowerCase()).endsWith('png')||(file.name.toLowerCase()).endsWith('jpg')||(file.name.toLowerCase()).endsWith('jpeg')){
                async function loopSize(size:number):Promise<string>{
                    return new Promise( (resolve,reject)=>{
                       const reader = new FileReader();
                       reader.onload = function(e) {
                           const img = new Image();
                           img.src = URL.createObjectURL(file);
                           img.onload =  function() {
                               let quality=0.9
                               // 获取图像宽度和高度
                               const og_width = img.width;
                               const og_height = img.height;
                               const canvas = document.createElement('canvas');
                               const maxWidth = size; // 设置最大宽度
                               const maxHeight = size/og_width*og_height; // 设置最大高度
                               let width = img.width;
                               let height = img.height;
                               // 保持纵横比调整尺寸
                               if (width > height) {
                                   if (width > maxWidth) {
                                       height *= maxWidth / width;
                                       width = maxWidth;
                                   }
                               } else {
                                   if (height > maxHeight) {
                                       width *= maxHeight / height;
                                       height = maxHeight;
                                   }
                               }

                               canvas.width = width;
                               canvas.height = height;
                               const ctx:any = canvas.getContext('2d');
                               ctx.drawImage(img, 0, 0, width, height);
                               function tryCompression() {
                                   canvas.toBlob(async (blob:any) => {
                                       console.log(`嘗試壓縮品質: ${quality}, 檔案大小: ${(blob.size / 1024).toFixed(2)} KB`);
                                       if (blob.size > 500 * 1024 && quality > 0.1) {
                                           quality -= 0.1; // 逐步降低品質
                                           tryCompression();
                                       } else {
                                           const s3res= (await ApiPageConfig.uploadFile(getFileName(size))).response;
                                           const res= await BaseApi.create({
                                               url: s3res.url,
                                               type: 'put',
                                               data: blob,
                                               headers: {
                                                   'Content-Type': s3res.type,
                                               }
                                           })
                                           resolve(s3res.fullUrl)
                                       }
                                   }, 'image/jpeg', quality);
                               }

                               tryCompression();
                           };
                       };
                       reader.readAsDataURL(file);
                   })
                }
                let chunk_size=[150,600,1200,1440,1920]
                if(fileSizeKB>500){
                    links.push(await loopSize(chunk_size[1200]))
                }else{
                    const s3res= (await ApiPageConfig.uploadFile(getFileName('original'))).response;
                    const res= await BaseApi.create({
                        url: s3res.url,
                        type: 'put',
                        data: file,
                        headers: {
                            'Content-Type': s3res.type,
                        }
                    })
                    links.push(s3res.fullUrl)
                }
                result=true
                if(!result){
                    return  {
                        result:false
                    }
                }
            }else{
                const s3res= (await ApiPageConfig.uploadFile(file.name.replace(/ /g, '').replace(/'/g,'').replace(/"/g,''))).response;
                const res= await BaseApi.create({
                    url: s3res.url,
                    type: 'put',
                    data: file,
                    headers: {
                        'Content-Type': s3res.type,
                    }
                })
                links.push(s3res.fullUrl)
            }
        }

     return {
            result:result,
         links:links
     }
    }
}

const interval = setInterval(() => {
    if ((window as any).glitter) {
        clearInterval(interval);
        (window as any).glitter.setModule(import.meta.url, ApiPageConfig);
    }
}, 100);
