import db from './modules/database';

export class UpdateScript {
    public static async run() {
        // const migrate_template = (await db.query('SELECT appName FROM glitter.app_config where template_type!=0;', [])).map((dd: any) => {
        //     return dd.appName
        // }).concat(['shop-template-clothing-v3'])
        // this.migrateDialog(migrate_template)
        // UpdateScript.migrateTermsOfService(['3131_shop', 't_1717152410650', 't_1717141688550', 't_1717129048727', 't_1719819344426'])
        // UpdateScript.migrateHeaderAndFooterAndCollection(migrate_template.filter((dd:any)=>{
        //     return dd !=='t_1719819344426'
        // }))
        // UpdateScript.migrateAccount('shop_template_black_style')
        // await UpdateScript.migrateLink(migrate_template)
        //  await UpdateScript.migrateLink(migrate_template)
        // migrate_template.map((dd:any)=>{
        //     UpdateScript.migrateAccount(dd)
        // })
        // await
        // await UpdateScript.migratePages(migrate_template.filter((dd:any)=>{
        //     return dd !=='t_1719819344426'
        // }),['about-us','privacy','terms','sample1','sample2','sample3'])
        // t_1719819344426
        // await this.migrateSinglePage(migrate_template.reverse())
        // await this.migrateInitialConfig(migrate_template.filter((dd:any)=>{
        //     return dd !=='t_1719819344426'
        // }))
        // await this.migrateHomePageFooter(migrate_template)
        // await this.migrate_blogs_toPage()
        for (const b of await db.query('SELECT appName FROM glitter.app_config where brand=?;', ['shopnex'])){
            await this.footer_migrate(b.appName)
        }

    }

    public static async footer_migrate(app_name: string) {
        const cf=(await db.query(`SELECT *
                                        FROM glitter.page_config
                                        where appName = ?
                                          and tag = 'footer';`, [app_name]))[0]
        const footer = cf['config'];
        const header = (await db.query(`SELECT *
                                        FROM glitter.page_config
                                        where appName = ?
                                          and tag = 'c_header';`, [app_name]))[0]['config'];
        if (footer[0]) {
            footer[0]['gCount'] = 'multiple'
            footer[0]["arrayData"] = {
                "clickEvent": [{
                    "clickEvent": {"src": "./official_event/event.js", "route": "code"},
                    "codeVersion": "v2",
                    "code": "    //判斷不是APP在顯示\n    if ((gvc.glitter.deviceType === glitter.deviceTypeEnum.Web) && (glitter.getUrlParameter('device') !== 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }"
                }]
            }
            const obj={"id":"s9s6s7s4s7ses7sc","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"tag":"SY02-APP-Footer","_gap":"","attr":[],"elem":"div","list":[],"inner":"","_other":{},"_border":{},"_margin":{},"_radius":"","_padding":{},"_reverse":"false","carryData":{},"refer_app":"shop_template_black_style","_max_width":"","_background":"","_style_refer":"custom","_hor_position":"center","refer_form_data":{"list":[{"img":"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1715430738690-house-solid.svg","event":{},"index":0,"title":"首頁","c_v_id":"s0s4s6s7sfscs8s4","toggle":false,"select_img":"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1715489454947-house-solid (1).svg","trigger_count":{}},{"img":"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1715431032138-handshake-regular (1).svg","event":{},"index":1,"title":"我的案件","c_v_id":"s7s9sds9sas6s2se","toggle":false,"select_img":"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1715489122193-handshake-regular (3).svg","trigger_count":{}}],"list2":[{"index":0,"c_v_id":"s3s4s1sds1s0sasc","toggle":false},{"index":1,"c_v_id":"ses5sesbs2s6s8sa","toggle":false},{"index":2,"c_v_id":"ses0s2s2s6sas5s8"},{"index":3,"c_v_id":"sbs6s9s0scs0ses0"}],"page_index":{"clickEvent":[{"code":"return 0;","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"select_color":"#EC690A","def_title_color":"#000000","r_1715424220575":{"type":"image","value":""},"un_select_color":"#888888","select_title_color":"#b71a1a"},"_background_setting":{"type":"none"},"_style_refer_global":{"index":"0"}},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-APP導覽列","style":"","gCount":"multiple","global":[],"mobile":{"id":"s2s1s1s7s9sas2s6","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"refer_app":"shop_template_black_style"},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-APP導覽列","refer":"custom","style":"","gCount":"multiple","global":[],"toggle":false,"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((gvc.glitter.deviceType === glitter.deviceTypeEnum.Web) && (glitter.getUrlParameter('device') !== 'mobile')) {\n        return []\n    } else {\n        return [subData]\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{}},"toggle":false,"desktop":{"id":"s2s1s1s7s9sas2s6","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"refer_app":"shop_template_black_style"},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-APP導覽列","refer":"custom","style":"","gCount":"multiple","global":[],"toggle":false,"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((gvc.glitter.deviceType === glitter.deviceTypeEnum.Web) && (glitter.getUrlParameter('device') !== 'mobile')) {\n        return []\n    } else {\n        return [subData]\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{}},"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((gvc.glitter.deviceType === glitter.deviceTypeEnum.Web) && (glitter.getUrlParameter('device') !== 'mobile')) {\n        return []\n    } else {\n        return [subData]\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{},"formData":{"link":[{"link":"https://www.facebook.com/profile.php?id=100083247586318&locale=zh_TW","type":"fb"},{"link":"ig","type":"ig"},{"link":"twitter","type":"twitter"},{"link":"youtube","type":"youtube"}],"list":[{"child":[{"page":"./?page=contact-us","title":"聯絡我們"},{"page":"./?page=ask","title":"問與答"},{"page":"./?page=refund_privacy","title":"配送與退款"}],"title":"支援"},{"child":[{"page":"./?page=aboutus","title":"我們個故事"},{"page":"./?page=blog_list","title":"Blog / 網誌"},{"page":"./?page=privacy","title":"服務與隱私條款"}],"title":"關於我們"},{"child":[{"title":"0912345678"},{"title":"04-25358993"},{"title":"sample@gmail.com"}],"title":"聯絡我們"}],"logo":"Dube Shop2.","background":"#1f1f1f","item_color":"#a6a6a6","title_color":"#ffffff"}}
            if(footer[1]){
                footer[1]=obj
            }else{
                footer.push(obj)
            }
            await db.query(`update glitter.page_config
                            set config=?
                            where appName = ?
                              and tag = 'footer'`, [JSON.stringify(footer), app_name])
        }
        if (header[0]){
            header[0]['gCount'] = 'multiple'
            header[0]["arrayData"] = {
                "clickEvent": [{
                    "clickEvent": {"src": "./official_event/event.js", "route": "code"},
                    "codeVersion": "v2",
                    "code": "    //判斷不是APP在顯示\n    if ((gvc.glitter.deviceType === glitter.deviceTypeEnum.Web) && (glitter.getUrlParameter('device') !== 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }"
                }]
            }
            if (!header[1]) {
                header.push({"id":"s2scscses9s3s6s9","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"tag":"MH-01","_gap":"","attr":[],"elem":"div","list":[],"inner":"","_other":{},"_border":{},"_margin":{},"_radius":"","_padding":{},"_reverse":"false","carryData":{},"refer_app":"shop_template_black_style","_max_width":"","_background":"","_style_refer":"global","_hor_position":"center","refer_form_data":{"logo":{"type":"text","value":"SHOPNEX"},"color":"black","option":[],"select":"#e8e8e8","title2":"","a_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"b_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"c_color":{"id":"1","title":"@{{theme_color.1.title}}","content":"@{{theme_color.1.content}}","background":"@{{theme_color.1.background}}","solid-button-bg":"@{{theme_color.1.solid-button-bg}}","border-button-bg":"@{{theme_color.1.border-button-bg}}","solid-button-text":"@{{theme_color.1.solid-button-text}}","border-button-text":"@{{theme_color.1.border-button-text}}"},"btn_color":"#ffffff","logo_text":{"type":"text","value":"Sample Shop"},"logo_type":"text","background":"#0d0d0d","theme_color":{"id":"0","title":"@{{theme_color.0.title}}","content":"@{{theme_color.0.content}}","background":"@{{theme_color.0.background}}","solid-button-bg":"@{{theme_color.0.solid-button-bg}}","border-button-bg":"@{{theme_color.0.border-button-bg}}","solid-button-text":"@{{theme_color.0.solid-button-text}}","border-button-text":"@{{theme_color.0.border-button-text}}"}},"_background_setting":{"type":"none"}},"list":[],"type":"component","class":"w-100","index":0,"label":"手機版標頭","style":"","gCount":"multiple","global":[],"mobile":{"id":"s1sds3s3s3sfs1s3","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"refer_app":"shop_template_black_style"},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-標頭","refer":"custom","style":"","gCount":"multiple","global":[],"toggle":false,"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((gvc.glitter.deviceType !== glitter.deviceTypeEnum.Web) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{}},"toggle":false,"desktop":{"id":"s1sds3s3s3sfs1s3","js":"./official_view_component/official.js","css":{"class":{},"style":{}},"data":{"refer_app":"shop_template_black_style"},"list":[],"type":"component","class":"w-100","index":0,"label":"SY02-標頭","refer":"custom","style":"","gCount":"multiple","global":[],"toggle":false,"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((gvc.glitter.deviceType !== glitter.deviceTypeEnum.Web) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{}},"stylist":[],"version":"v2","dataType":"static","arrayData":{"clickEvent":[{"code":"    //判斷不是APP在顯示\n    if ((gvc.glitter.deviceType !== glitter.deviceTypeEnum.Web) || (glitter.getUrlParameter('device') === 'mobile')) {\n        return [subData]\n    } else {\n        return []\n    }","clickEvent":{"src":"./official_event/event.js","route":"code"},"codeVersion":"v2"}]},"style_from":"code","hiddenEvent":{},"classDataType":"static","editor_bridge":{},"preloadEvenet":{},"container_fonts":0,"mobile_editable":[],"desktop_editable":[],"refreshAllParameter":{},"refreshComponentParameter":{},"formData":{"logo":"https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1708252131063-Screenshot 2024-02-18 at 6.22.20 PM.png","color":"black","option":[{"link":"?page=index","child":[],"index":0,"title":"首頁"},{"link":"./?page=all_product","child":[{"link":"?collection=狗狗&page=all_product","title":"狗狗專區"},{"link":"?collection=貓貓&page=all_product","title":"貓貓專區"}],"index":1,"title":"所有商品"},{"link":"?page=blog_list","child":[],"index":2,"title":"部落格 / 網誌"},{"link":"?page=aboutus","child":[],"index":3,"title":"關於我們"}],"select":"#554233","btn_color":"#000000","background":"#fcfcfc"}})
            }
            await db.query(`update glitter.page_config
                            set config=?
                            where appName = ?
                              and tag = 'c_header'`, [JSON.stringify(header), app_name])
        }
        if((await db.query(`select count(1) from glitter.page_config where appName = ? and tag=?`,[app_name,'index-mobile']))[0]['count(1)']===0){
            const config=[
                {
                    "id": "ses0sbs0s8s9s0s3",
                    "js": "./official_view_component/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "tag": "c_header",
                        "_gap": "",
                        "attr": [],
                        "elem": "div",
                        "list": [],
                        "inner": "",
                        "_other": {},
                        "_border": {},
                        "_margin": {},
                        "_radius": "",
                        "_padding": {},
                        "_reverse": "false",
                        "carryData": {},
                        "_max_width": "",
                        "_background": "",
                        "_style_refer": "global",
                        "_hor_position": "center",
                        "_background_setting": {
                            "type": "none"
                        }
                    },
                    "list": [],
                    "type": "component",
                    "class": "",
                    "index": 0,
                    "label": "標頭-Style1",
                    "style": "",
                    "global": [],
                    "mobile": {
                        "data": {},
                        "refer": "custom"
                    },
                    "toggle": false,
                    "desktop": {
                        "data": {},
                        "refer": "custom"
                    },
                    "stylist": [],
                    "version": "v2",
                    "visible": true,
                    "dataType": "static",
                    "deletable": "false",
                    "style_from": "code",
                    "classDataType": "static",
                    "editor_bridge": {},
                    "preloadEvenet": {},
                    "container_fonts": 0,
                    "mobile_editable": [],
                    "desktop_editable": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "sbses7s7s4s3sfs6",
                    "js": "./official_view_component/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "tag": "slider-v2",
                        "_gap": "",
                        "attr": [],
                        "elem": "div",
                        "list": [],
                        "inner": "",
                        "_other": {},
                        "_border": {},
                        "_margin": {},
                        "_radius": "",
                        "_padding": {},
                        "_reverse": "false",
                        "carryData": {},
                        "refer_app": "shop_template_black_style",
                        "_max_width": "",
                        "_background": "",
                        "_style_refer": "custom",
                        "_hor_position": "center",
                        "refer_form_data": {
                            "image": [
                                {
                                    "img": "https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s9s2s1s2s2sdsds5_Frame82(4).png",
                                    "link": "https://www.google.com.tw/",
                                    "index": 0,
                                    "title": "85折",
                                    "c_v_id": "s2sbses6s8s8scsd",
                                    "toggle": true,
                                    "button_text": "開始購物",
                                    "title_color": "#ffffff",
                                    "r_1714460674658": "質感選物"
                                },
                                {
                                    "img": "https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s4s2sbs1s7s4s4sd_Frame38.png",
                                    "index": 1,
                                    "title": "20周年慶",
                                    "c_v_id": "sas5sbsfs7s0s4s0",
                                    "toggle": true,
                                    "button_text": "前往打造",
                                    "title_color": "#ffffff",
                                    "r_1714460674658": "五行開運手環"
                                }
                            ],
                            "scale": "2:1",
                            "random": "true",
                            "autoplay": "true",
                            "title_size": "48",
                            "phone_image": [
                                {
                                    "img": "https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1714466372240-Frame 123 (1).jpg",
                                    "link": "https://www.google.com.tw/",
                                    "index": 0,
                                    "title": "質感選物",
                                    "c_v_id": "sfscs9s0s5ses4sa",
                                    "toggle": false,
                                    "button_text": "開始購物"
                                },
                                {
                                    "img": "https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1714466393413-Frame 131 (2).jpg",
                                    "link": "https://www.google.com.tw/",
                                    "index": 1,
                                    "title": "五行開運手環",
                                    "c_v_id": "s5s2s7s8s1sesdsd",
                                    "toggle": false,
                                    "button_text": "前往打造"
                                }
                            ],
                            "banner_height": {
                                "type": "number",
                                "unit": "px",
                                "value": "810px",
                                "number": "810"
                            },
                            "banner_height2": {
                                "unit": "px",
                                "value": "810px",
                                "number": "810"
                            },
                            "r_1718088289110": "./?page=index",
                            "phone_banner_height": {
                                "unit": "px",
                                "value": "510px",
                                "number": "510"
                            }
                        },
                        "_background_setting": {
                            "type": "none"
                        },
                        "_style_refer_global": {
                            "index": "0"
                        }
                    },
                    "list": [],
                    "type": "component",
                    "class": "w-100",
                    "index": 1,
                    "label": "輪播圖",
                    "style": "",
                    "global": [],
                    "mobile": {
                        "id": "sbses7s7s4s3sfs6",
                        "js": "./official_view_component/official.js",
                        "css": {
                            "class": {},
                            "style": {}
                        },
                        "data": {
                            "refer_app": "shop_template_black_style",
                            "refer_form_data": {}
                        },
                        "list": [],
                        "type": "component",
                        "class": "w-100",
                        "index": 1,
                        "label": "輪播圖",
                        "refer": "custom",
                        "style": "",
                        "global": [],
                        "toggle": false,
                        "stylist": [],
                        "version": "v2",
                        "visible": true,
                        "dataType": "static",
                        "style_from": "code",
                        "classDataType": "static",
                        "editor_bridge": {},
                        "preloadEvenet": {},
                        "container_fonts": 0,
                        "mobile_editable": [],
                        "desktop_editable": [],
                        "refreshAllParameter": {},
                        "refreshComponentParameter": {}
                    },
                    "toggle": false,
                    "desktop": {
                        "id": "sbses7s7s4s3sfs6",
                        "js": "./official_view_component/official.js",
                        "css": {
                            "class": {},
                            "style": {}
                        },
                        "data": {
                            "refer_app": "shop_template_black_style",
                            "refer_form_data": {}
                        },
                        "list": [],
                        "type": "component",
                        "class": "w-100",
                        "index": 1,
                        "label": "輪播圖",
                        "refer": "custom",
                        "style": "",
                        "global": [],
                        "toggle": false,
                        "stylist": [],
                        "version": "v2",
                        "visible": true,
                        "dataType": "static",
                        "style_from": "code",
                        "classDataType": "static",
                        "editor_bridge": {},
                        "preloadEvenet": {},
                        "container_fonts": 0,
                        "mobile_editable": [],
                        "desktop_editable": [],
                        "refreshAllParameter": {},
                        "refreshComponentParameter": {}
                    },
                    "stylist": [],
                    "version": "v2",
                    "visible": true,
                    "dataType": "static",
                    "style_from": "code",
                    "classDataType": "static",
                    "editor_bridge": {},
                    "preloadEvenet": {},
                    "container_fonts": 0,
                    "mobile_editable": [],
                    "desktop_editable": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "sasesbsds7s6sesf",
                    "js": "./official_view_component/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "tag": "SY02_page_product",
                        "_gap": "",
                        "attr": [],
                        "elem": "div",
                        "list": [],
                        "inner": "",
                        "_other": {},
                        "_border": {},
                        "_margin": {},
                        "_radius": "",
                        "_padding": {
                            "top": "0",
                            "left": "10",
                            "right": "10",
                            "bottom": "0"
                        },
                        "_reverse": "false",
                        "carryData": {},
                        "refer_app": "shop_template_black_style",
                        "_max_width": "1200",
                        "_background": "",
                        "_style_refer": "custom",
                        "_hor_position": "center",
                        "refer_form_data": {
                            "list": [
                                {
                                    "more": "https://tw.yahoo.com/",
                                    "index": 0,
                                    "title": "全部",
                                    "c_v_id": "sdsfs8sbs8s0s1sa",
                                    "toggle": false,
                                    "product_list": {
                                        "value": [],
                                        "select": "all"
                                    }
                                },
                                {
                                    "more": "www.google.com",
                                    "index": 1,
                                    "title": "外套",
                                    "c_v_id": "sbs7sbseses8scs3",
                                    "toggle": false,
                                    "product_list": {
                                        "value": [],
                                        "select": "all"
                                    }
                                },
                                {
                                    "more": "www.google.com",
                                    "index": 2,
                                    "title": "上衣",
                                    "c_v_id": "s4s9sds8s0scsfs7",
                                    "toggle": false,
                                    "product_list": {
                                        "value": [],
                                        "select": "all"
                                    }
                                },
                                {
                                    "more": "www.google.com",
                                    "index": 3,
                                    "title": "下身",
                                    "c_v_id": "sbs2s0s8s1s3s7s0",
                                    "toggle": false,
                                    "product_list": {
                                        "value": [],
                                        "select": "all"
                                    }
                                }
                            ],
                            "more": {
                                "bg": "#000000",
                                "size": "20",
                                "color": "#ffffff",
                                "toggle": false,
                                "border_color": "#ed1d1d",
                                "border_width": "0"
                            },
                            "count": "8",
                            "title": "所有商品",
                            "distance": {
                                "toggle": false,
                                "margin_pc": {},
                                "padding_pc": {
                                    "toggle": false
                                },
                                "margin_phone": {},
                                "padding_phone": {}
                            },
                            "margin_pc": {},
                            "padding_pc": {},
                            "theme_color": {
                                "id": "0",
                                "title": "@{{theme_color.0.title}}",
                                "content": "@{{theme_color.0.content}}",
                                "sec-title": "@{{theme_color.0.sec-title}}",
                                "background": "@{{theme_color.0.background}}",
                                "sec-background": "@{{theme_color.0.sec-background}}",
                                "solid-button-bg": "@{{theme_color.0.solid-button-bg}}",
                                "border-button-bg": "@{{theme_color.0.border-button-bg}}",
                                "solid-button-text": "@{{theme_color.0.solid-button-text}}",
                                "border-button-text": "@{{theme_color.0.border-button-text}}"
                            },
                            "card_setting": {
                                "sp": {
                                    "size": "16",
                                    "color": "#ff0000",
                                    "toggle": false
                                },
                                "name": {
                                    "size": "16",
                                    "color": "#8f4242",
                                    "toggle": false
                                },
                                "price": {
                                    "size": "16",
                                    "color": "#333333",
                                    "toggle": false
                                },
                                "toggle": false
                            },
                            "margin_phone": {},
                            "page_setting": {
                                "toggle": false,
                                "selected": {
                                    "bg": "#554233",
                                    "color": "#ffffff",
                                    "toggle": false,
                                    "border_color": "#0000ff",
                                    "border_width": "0"
                                },
                                "unselected": {
                                    "bg": "#e51010",
                                    "color": "#000000",
                                    "toggle": false,
                                    "border_color": "#ad9c8f",
                                    "border_width": "2"
                                }
                            },
                            "padding_phone": {},
                            "title_setting": {
                                "size": "40",
                                "color": "#000000",
                                "title": "所有商品",
                                "toggle": false,
                                "size_sm": "24"
                            }
                        },
                        "_background_setting": {
                            "type": "none"
                        },
                        "_style_refer_global": {
                            "index": "0"
                        }
                    },
                    "list": [],
                    "type": "component",
                    "class": "w-100",
                    "index": 0,
                    "label": "商品類別",
                    "style": "",
                    "global": [],
                    "mobile": {
                        "id": "sasesbsds7s6sesf",
                        "js": "./official_view_component/official.js",
                        "css": {
                            "class": {},
                            "style": {}
                        },
                        "data": {
                            "refer_app": "shop_template_black_style"
                        },
                        "list": [],
                        "type": "component",
                        "class": "w-100",
                        "index": 0,
                        "label": "商品類別",
                        "refer": "custom",
                        "style": "",
                        "global": [],
                        "toggle": false,
                        "stylist": [],
                        "version": "v2",
                        "visible": true,
                        "dataType": "static",
                        "style_from": "code",
                        "classDataType": "static",
                        "editor_bridge": {},
                        "preloadEvenet": {},
                        "container_fonts": 0,
                        "mobile_editable": [],
                        "desktop_editable": [],
                        "refreshAllParameter": {},
                        "refreshComponentParameter": {}
                    },
                    "toggle": false,
                    "desktop": {
                        "id": "sasesbsds7s6sesf",
                        "js": "./official_view_component/official.js",
                        "css": {
                            "class": {},
                            "style": {}
                        },
                        "data": {
                            "refer_app": "shop_template_black_style"
                        },
                        "list": [],
                        "type": "component",
                        "class": "w-100",
                        "index": 0,
                        "label": "商品類別",
                        "refer": "custom",
                        "style": "",
                        "global": [],
                        "toggle": false,
                        "stylist": [],
                        "version": "v2",
                        "visible": true,
                        "dataType": "static",
                        "style_from": "code",
                        "classDataType": "static",
                        "editor_bridge": {},
                        "preloadEvenet": {},
                        "container_fonts": 0,
                        "mobile_editable": [],
                        "desktop_editable": [],
                        "refreshAllParameter": {},
                        "refreshComponentParameter": {}
                    },
                    "stylist": [],
                    "version": "v2",
                    "visible": true,
                    "dataType": "static",
                    "style_from": "code",
                    "classDataType": "static",
                    "editor_bridge": {},
                    "preloadEvenet": {},
                    "container_fonts": 0,
                    "mobile_editable": [],
                    "desktop_editable": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                },
                {
                    "id": "sas9s9sfs0sbscs3-sfsas3sf-4s7s6sd-sasas2s9-sfs4s7s5s1s0s2sdsas2sfs7",
                    "js": "./official_view_component/official.js",
                    "css": {
                        "class": {},
                        "style": {}
                    },
                    "data": {
                        "tag": "footer",
                        "_gap": "",
                        "attr": [],
                        "elem": "div",
                        "list": [],
                        "inner": "",
                        "_other": {},
                        "_border": {},
                        "_margin": {},
                        "_radius": "",
                        "_padding": {},
                        "_reverse": "false",
                        "carryData": {},
                        "_max_width": "",
                        "_background": "",
                        "_style_refer": "global",
                        "_hor_position": "center",
                        "_background_setting": {
                            "type": "none"
                        }
                    },
                    "list": [],
                    "type": "component",
                    "index": 3,
                    "label": "頁腳區塊",
                    "global": [],
                    "mobile": {
                        "data": {},
                        "refer": "custom"
                    },
                    "toggle": false,
                    "desktop": {
                        "data": {},
                        "refer": "custom"
                    },
                    "version": "v2",
                    "visible": true,
                    "deletable": "false",
                    "hiddenEvent": {},
                    "editor_bridge": {},
                    "preloadEvenet": {},
                    "container_fonts": 0,
                    "mobile_editable": [],
                    "desktop_editable": [],
                    "refreshAllParameter": {},
                    "refreshComponentParameter": {}
                }
            ]
            const b=JSON.parse(JSON.stringify(cf))
            b.id=undefined
            b.config=JSON.stringify(config)
            b.tag='index-mobile'
            b.group='主畫面'
            b.page_type='page'
            b.page_config=JSON.stringify({
                "seo": {
                    "type": "custom",
                    "title": "",
                    "content": "",
                    "keywords": ""
                },
                "list": [],
                "version": "v2",
                "formData": {},
                "formFormat": [],
                "resource_from": "global",
                "globalStyleTag": [],
                "support_editor": "true"
            })
            b.created_time=new Date(b.created_time)
            b.updated_time=new Date(b.updated_time)
            if(b.template_config){
                b.template_config=JSON.stringify(b.template_config)
            }
            b.name='APP首頁'
           await db.query(`insert into glitter.page_config set ?`,[b])
        }
    }

    public static async container_migrate(app_name: string) {
        try {
            const global_theme = (await db.query(`SELECT *
                                                  FROM glitter.app_config
                                                  where appName = ?;`, [app_name]))[0]['config']['container_theme']
            // console.log(global_theme)
            const page_config = (await db.query(`SELECT *
                                                 FROM glitter.page_config
                                                 where appName = ?
                                                   and tag = 'index';`, [app_name]))[0]['config']

            function loop(widget: any) {
                if (widget.type === 'container') {
                    widget.data.setting.map((dd: any) => {
                        loop(dd)
                    });
                }

                function loopWidget(widget: any) {
                    if (widget) {
                        if (widget.data && widget.data._style_refer === 'global' && widget.data._style_refer_global && widget.data._style_refer_global.index) {
                            if (global_theme[parseInt(widget.data._style_refer_global.index, 10)]) {
                                const obj = global_theme[parseInt(widget.data._style_refer_global.index, 10)].data
                                Object.keys(obj).map((dd) => {
                                    widget.data[dd] = obj[dd]
                                })
                            }
                        }
                        if (widget.data) {
                            widget.data._style_refer = 'custom'
                        }
                    }

                }

                loopWidget(widget)
                loopWidget(widget.mobile)
                loopWidget(widget.desktop)
            }

            for (const b of page_config) {
                loop(b)
            }
            await db.query(`update glitter.page_config
                            set config=?
                            where appName = ?
                              and tag = 'index';`, [JSON.stringify(page_config), app_name])
            console.log(`migrate-finish-${app_name}`)
        } catch (e) {

        }
        //_style_refer==='global' && data._style_refer_global
    }

    public static async migrate_blogs_toPage() {
        const blogs = await db.query(`SELECT *
                                      FROM shopnex.t_manager_post
                                      where content ->>'$.for_index'='false' and content->>'$.page_type'='blog'`, [])
        for (const b of blogs) {
            b.content.page_type = 'page'
            await db.query(`update shopnex.t_manager_post
                            set content=?
                            where id = ?`, [
                JSON.stringify(b.content),
                b.id
            ])
        }
    }

    public static async migrateHomePageFooter(appList: string[]) {

        for (const b of appList) {
            const homePage = (await db.query(`select *
                                              from glitter.page_config
                                              where appName = ?
                                                and tag = ?`, [b, 'index']))[0]
            homePage.config[0]['deletable'] = 'false'
            homePage.config[homePage.config.length - 1]['deletable'] = 'false'
            homePage.created_time = new Date()
            homePage.config = JSON.stringify(homePage.config)
            homePage.page_config = JSON.stringify(homePage.page_config)
            await db.query(`update glitter.page_config
                            set ?
                            where id = ?`, [
                homePage, homePage.id
            ])
        }
    }

    public static async migrateInitialConfig(appList: string[]) {
        //覆蓋私有配置檔案
        let private_config = await db.query(`select *
                                             from glitter.private_config
                                             where app_name = ?`, ['t_1719819344426']);
        //覆蓋公開配置檔案
        let public_config = await db.query(`select *
                                            from \`t_1719819344426\`.t_user_public_config`, []);
        //覆蓋公開配置檔案2
        let pb_config2 = await db.query(`select *
                                         from \`t_1719819344426\`.public_config`, []);
        for (const v of appList) {
            for (const b of private_config) {
                b.id = undefined
                b.app_name = v
                b.updated_at = new Date()
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value)
                }
                await db.query(`delete
                                from glitter.private_config
                                where app_name = ?
                                  and \`key\` = ?`, [v, b.key])
                await db.query(`insert into glitter.private_config
                                set ?`, [
                    b
                ])
            }
            for (const b of public_config) {
                b.id = undefined
                b.updated_at = new Date()
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value)
                }
                await db.query(`delete
                                from \`${v}\`.t_user_public_config
                                where \`key\` = ?
                                  and id > 0`, [b.key])
                await db.query(`insert into \`${v}\`.t_user_public_config
                                set ?`, [
                    b
                ])
            }
            for (const b of pb_config2) {
                b.id = undefined
                b.updated_at = new Date()
                if (typeof b.value === 'object') {
                    b.value = JSON.stringify(b.value)
                }
                await db.query(`delete
                                from \`${v}\`.public_config
                                where \`key\` = ?
                                  and id > 0`, [b.key])
                await db.query(`insert into \`${v}\`.public_config
                                set ?`, [
                    b
                ])
            }
        }
    }

    public static async migrateSinglePage(appList: string[]) {
        const cart_footer = {
            "id": "sdsds5s9s9sasbs8",
            "js": "./official_view_component/official.js",
            "css": {"class": {}, "style": {}},
            "data": {
                "refer_app": "shop_template_black_style",
                "tag": "sy01_checkout_detail",
                "list": [],
                "carryData": {}
            },
            "type": "component",
            "class": "w-100",
            "index": 0,
            "label": "SY01-購物車詳情",
            "style": "",
            "bundle": {},
            "global": [],
            "toggle": false,
            "stylist": [],
            "dataType": "static",
            "style_from": "code",
            "classDataType": "static",
            "preloadEvenet": {},
            "share": {},
            "formData": {},
            "refreshAllParameter": {},
            "refreshComponentParameter": {},
            "list": [],
            "version": "v2",
            "storage": {},
            "mobile": {"refer": "def"},
            "desktop": {"refer": "def"}
        }
        let index2: any = 0
        for (const b of appList) {
            index2 = index2 + 1;
            await db.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, [b, 'spa'])
            await db.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, [b, 'spa' + index2])
            await db.query(`delete
                            from glitter.page_config
                            where appName = ?
                              and tag = ?`, ['shop_template_black_style', 'spa' + index2])
            const image = (await db.query(`SELECT *
                                           FROM glitter.app_config
                                           where appName = ?`, [b]))[0].template_config.image[0];
            const index = (await db.query(`select *
                                           from glitter.page_config
                                           where appName = ?
                                             and tag = ?`, [b, 'index']))[0]
            index.config.splice(index.config.length - 1, 1)
            index.config.splice(0, 1)
            index.config.push(cart_footer)
            index.page_config = {
                "list": [],
                "version": "v2",
                "formData": {},
                "formFormat": [],
                "resource_from": "global"
            }
            index.template_type = 2;
            index.group = '一頁商店'
            index.tag = 'spa' + index2
            index.name = `一頁購物-AS${(index2 < 10) ? `0${index2}` : index2}`
            index.appName = 'shop_template_black_style'
            index.template_config = {
                "tag": ["一頁購物"],
                "desc": "",
                "name": `一頁購物-AS${(index2 < 10) ? `0${index2}` : index2}`,
                "image": [image],
                "status": "wait",
                "post_to": "all",
                "version": "1.0",
                "created_by": "liondesign.io",
                "preview_img": image
            }
            index.template_config = JSON.stringify(index.template_config)
            index.config = JSON.stringify(index.config)
            index.page_config = JSON.stringify(index.page_config)
            index.id = undefined
            await db.query(`delete
                            from shop_template_black_style.t_manager_post
                            where id > 0
                              and content ->>'$.tag'=?`, [
                index.tag
            ]);
            await db.query(`insert into shop_template_black_style.t_manager_post
                            set ?`, [
                {
                    userID: index.userID,
                    content: JSON.stringify({
                        "seo": {},
                        "tag": index.tag,
                        "name": index.name,
                        "type": "article",
                        "config": JSON.parse(index.config),
                        "relative": "collection",
                        "template": "article",
                        "for_index": "false",
                        "generator": "page_editor",
                        "page_type": "page",
                        "collection": [],
                        "relative_data": [],
                        "with_discount": "false"
                    })
                }
            ])
            const data = await db.query(`insert into glitter.page_config
                                         set ?`, [index])
            await db.query(`replace
            into glitter.t_template_tag  (\`type\`,tag,bind) values (?,?,?)`, [
                'page', '一頁購物', data.insertId
            ])
            //

        }
    }

    public static async migrateLink(appList: string[]) {
        for (const appName of appList) {
            for (const b of appList) {
                await db.query(`update \`${b}\`.t_user_public_config
                                set value=?
                                where \`key\` = 'menu-setting'
                                  and id > 0`, [JSON.stringify([
                    {
                        "link": "./index",
                        "items": [],
                        "title": "首頁"
                    },
                    {
                        "link": "/all-product",
                        "items": [
                            {
                                "link": "/all-product?collection=分類一",
                                "items": [],
                                "title": "分類一"
                            },
                            {
                                "link": "/all-product?collection=分類二",
                                "items": [],
                                "title": "分類二"
                            }
                        ],
                        "title": "所有商品",
                        "toggle": false
                    },
                    {
                        "link": "/blogs",
                        "items": [],
                        "title": "部落格 / 網誌"
                    },
                    {
                        "link": "./pages/about-us",
                        "items": [],
                        "title": "關於我們"
                    }
                ])]);
                await db.query(`update \`${b}\`.t_user_public_config
                                set value=?
                                where \`key\` = 'footer-setting'
                                  and id > 0`, [JSON.stringify([{
                    "link": "",
                    "items": [{
                        "link": "./?page=aboutus",
                        "items": [],
                        "title": "品牌故事"
                    }, {"link": "./?page=contact-us", "items": [], "title": "加入我們"}, {
                        "link": "./?page=blog_list",
                        "items": [],
                        "title": "最新消息"
                    }],
                    "title": "關於我們",
                    "toggle": false
                }, {
                    "link": "",
                    "items": [{
                        "link": "./?page=ask",
                        "items": [],
                        "title": "常見問題"
                    }, {"link": "./?page=refund_privacy", "items": [], "title": "退換貨政策"}, {
                        "link": "",
                        "items": [],
                        "title": "購物須知"
                    }, {"link": "", "items": [], "title": "實體店面"}],
                    "title": "購買相關",
                    "toggle": false
                }, {
                    "link": "",
                    "items": [{
                        "link": "",
                        "items": [],
                        "title": "營業時間 : 10:00～19:00"
                    }, {"link": "http://lin.ee/s212wq", "items": [], "title": "line客服 : @sam31212"}, {
                        "link": "",
                        "items": [],
                        "title": "電話：0912345678"
                    }, {"link": "", "items": [], "title": "統一編號 : 90687281"}],
                    "title": "聯絡我們",
                    "toggle": true
                }])]);

            }
        }
    }

    public static async migrateRichText() {
        const page_list = (await db.query(`select page_config, id
                                           FROM glitter.page_config
                                           where template_type = 2`, []))
        page_list.map((d: any) => {
            d.page_config = JSON.parse(JSON.stringify(d.page_config).replace(/multiple_line_text/g, 'rich_text'))
        })
        for (const p of page_list) {
            await db.query(`update glitter.page_config
                            set page_config=?
                            where id = ?`, [JSON.stringify(p.page_config), p.id]);
        }
    }

    public static async migrateAccount(appName: string) {
        const page_list = (await db.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 't_1719819344426'
                                             and tag in ('account_userinfo', 'rebate', 'order_list', 'wishlist',
                                                         'register')`, []));
        page_list.map((d: any) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd])
                }
            })
        })
        for (const b of page_list) {
            await db.query(`delete
                            from glitter.page_config
                            where appName = ${db.escape(appName)}
                              and tag = ?`, [b.tag]);
            b['appName'] = appName
            b['id'] = undefined
            b['updated_time'] = new Date()
            b['created_time'] = new Date()
            await db.query(`insert into glitter.page_config
                            set ?`, [
                b
            ])
        }
    }

    public static async migrateHeaderAndFooterAndCollection(appList: string[]) {
        const rebate_page = (await db.query(`SELECT *
                                             FROM t_1719819344426.t_user_public_config
                                             where \`key\` in ('menu-setting', 'footer-setting', 'blog_collection');`, []));
        for (const b of appList) {
            for (const c of rebate_page) {
                if (typeof c.value !== 'string') {
                    c.value = JSON.stringify(c.value);
                }
                (await db.query(`replace
                into \`${b}\`.t_user_public_config set ?`, [
                    c
                ]));
            }
        }
    }

    public static async migratePages(appList: string[], migrate: string[]) {
        const rebate_page = (await db.query(`SELECT *
                                             FROM t_1719819344426.t_manager_post
                                             where content ->> '$.type' = 'article'
                                               and content ->> '$.tag' in (${migrate.map((dd) => {
                                                 return `"${dd}"`
                                             }).join(',')})`, []));
        rebate_page.map((dd: any) => {
            dd.content.template = 'article'
            dd.content = JSON.stringify(dd.content)
            dd['id'] = undefined
        })
        for (const b of appList) {
            await db.query(`delete
                            from \`${b}\`.t_manager_post
                            where content ->> '$.type' = 'article' `, []);
            for (const c of rebate_page) {
                await db.query(`insert into \`${b}\`.t_manager_post
                                set ?`, [
                    c
                ])
            }

        }
    }

    public static async migrateRebatePage(appList: string[]) {
        const rebate_page = (await db.query(`SELECT *
                                             FROM glitter.page_config
                                             where appName = 't_1719819344426'
                                               and tag = 'rebate'`, []))[0];
        const migrate = appList
        Object.keys(rebate_page).map((dd) => {
            if (typeof rebate_page[dd] === 'object') {
                rebate_page[dd] = JSON.stringify(rebate_page[dd])
            }
        })
        for (const b of migrate) {
            await db.query(`delete
                            from glitter.page_config
                            where appName = ${db.escape(b)}
                              and tag = 'rebate'`, []);
            rebate_page['id'] = undefined
            rebate_page['appName'] = b
            rebate_page['created_time'] = new Date()
            await db.query(`insert into glitter.page_config
                            set ?`, [
                rebate_page
            ])
        }
    }

    public static async migrateDialog(appList: string[]) {
        const page_list = (await db.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 'shop_template_black_style'
                                             and tag in ('loading_dialog', 'toast', 'false_dialog')`, []));
        const global_event = (await db.query(`SELECT *
                                              FROM cms_system.t_global_event;`, []));
        page_list.map((d: any) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd])
                }
            })
        })
        for (const appName of appList) {
            for (const b of page_list) {
                await db.query(`delete
                                from glitter.page_config
                                where appName = ${db.escape(appName)}
                                  and tag = ?`, [b.tag]);
                b['appName'] = appName
                b['id'] = undefined
                b['created_time'] = new Date()
                b['updated_time'] = new Date()
                await db.query(`insert into glitter.page_config
                                set ?`, [
                    b
                ])
                await db.query(`replace
                into \`${appName}\`.t_global_event
                            (tag,name,json) values ?`, [
                    global_event.map((dd: any) => {
                        dd.id = undefined
                        return [
                            dd.tag,
                            dd.name,
                            JSON.stringify(dd.json)
                        ]
                    })
                ])
                for (const b of global_event) {

                }
            }
        }
    }

    public static async hiddenEditorAble() {
        const hidden_page = await db.query(`SELECT *
                                            FROM glitter.page_config
                                            where tag!='index' and page_config->>'$.support_editor'="true";`, [])
        for (const b of hidden_page) {
            b.page_config.support_editor = 'false'
            b['id'] = undefined
            Object.keys(b).map((dd) => {
                if (typeof b[dd] === 'object') {
                    b[dd] = JSON.stringify(b[dd])
                }
            })
            b['created_time'] = new Date()
            b['updated_time'] = new Date()
            await db.query(`replace
            into glitter.page_config
                            set ?`, [
                b
            ])
        }
    }

    public static async migrateHeader(appList: string[]) {
        const page_list = (await db.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 't_1719819344426'
                                             and tag in ('c_header')`, []));
        page_list.map((d: any) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd])
                }
            })
        })
        for (const appName of appList) {
            for (const b of page_list) {
                await db.query(`delete
                                from glitter.page_config
                                where appName = ${db.escape(appName)}
                                  and tag = ?`, [b.tag]);
                b['appName'] = appName
                b['id'] = undefined
                b['created_time'] = new Date()
                b['updated_time'] = new Date()
                await db.query(`insert into glitter.page_config
                                set ?`, [
                    b
                ])
            }
        }
    }

    public static async migrateFooter(appList: string[]) {
        const page_list = (await db.query(`SELECT *
                                           FROM glitter.page_config
                                           where appName = 't_1719819344426'
                                             and tag in ('c_header')`, []));
        page_list.map((d: any) => {
            Object.keys(d).map((dd) => {
                if (typeof d[dd] === 'object') {
                    d[dd] = JSON.stringify(d[dd])
                }
            })
        })
        for (const appName of appList) {
            for (const b of page_list) {
                await db.query(`delete
                                from glitter.page_config
                                where appName = ${db.escape(appName)}
                                  and tag = ?`, [b.tag]);
                b['appName'] = appName
                b['id'] = undefined
                b['created_time'] = new Date()
                b['updated_time'] = new Date()
                await db.query(`insert into glitter.page_config
                                set ?`, [
                    b
                ])
            }
        }
    }
}