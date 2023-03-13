'use strict';
export class Entry {
    static onCreate(glitter) {
        var _a, _b, _c, _d, _e;
        glitter.share.htmlExtension = (_a = glitter.share.htmlExtension) !== null && _a !== void 0 ? _a : {};
        window.mode = 'dark';
        window.root = document.getElementsByTagName('html')[0];
        window.root.classList.add('dark-mode');
        glitter.addMtScript(['https://kit.fontawesome.com/02e2dc09e3.js'], () => {
        }, () => {
        });
        if (glitter.getUrlParameter('page') == 'htmlEditor') {
            glitter.setHome('jspage/lowcode/render.js', 'htmlEditor', {
                data: window.parent.editerData,
                editMode: true
            });
        }
        else if (glitter.getUrlParameter('page') == 'lowcode/main') {
            glitter.setHome(`jspage/${(_b = glitter.getUrlParameter('page')) !== null && _b !== void 0 ? _b : 'getting-started/introduction'}.js`, (_c = glitter.getUrlParameter('page')) !== null && _c !== void 0 ? _c : 'getting-started/introduction', {
                setting: [
                    {
                        "route": "homee_home",
                        "type": "banner",
                        "id": "banner",
                        "label": "輪播圖",
                        "js": "jspage/htmlExtension/homee_home.js",
                        "data": {
                            "link": [
                                {
                                    "img": "https://media.istockphoto.com/id/604373174/zh/%E7%85%A7%E7%89%87/skyline-of-taipei-city.jpg?s=612x612&w=0&k=20&c=chjFFZCrfe-3QP6lKlnDhsCnOu7ROdAizA_eyJPpvoU="
                                },
                                {
                                    "img": "https://media.istockphoto.com/id/604373174/zh/%E7%85%A7%E7%89%87/skyline-of-taipei-city.jpg?s=612x612&w=0&k=20&c=chjFFZCrfe-3QP6lKlnDhsCnOu7ROdAizA_eyJPpvoU="
                                }
                            ]
                        }
                    },
                    {
                        "route": "Glitter",
                        "type": "container",
                        "id": "container",
                        "label": "自定區塊",
                        "js": "jspage/htmlExtension/official.js",
                        "data": {
                            "setting": [
                                {
                                    "route": "Glitter",
                                    "type": "image",
                                    "id": "image",
                                    "label": "圖片",
                                    "js": "jspage/htmlExtension/official.js",
                                    "data": {
                                        "setting": [],
                                        "link": "https://storage.googleapis.com/squarestudio/img/1672274794979.png",
                                        "class": "",
                                        "style": "border-radius: 12px;"
                                    },
                                    "expand": false,
                                    "expandStyle": false,
                                    "class": "col-6",
                                    "refreshAllParameter": {},
                                    "refreshComponentParameter": {}
                                },
                                {
                                    "route": "homee_home",
                                    "type": "rankingBlock",
                                    "id": "rankingBlock",
                                    "label": "黑色星期五",
                                    "js": "jspage/htmlExtension/homee_home.js",
                                    "data": {
                                        "setting": [],
                                        "style": "border-radius: 12px;",
                                        "class": "bg-black flex-column",
                                        "paddingL": "",
                                        "layout": "d-flex",
                                        "bgcolor": "#F8F3ED",
                                        "radius": "12"
                                    },
                                    "expand": true,
                                    "expandStyle": false,
                                    "class": "col-6 ",
                                    "refreshAllParameter": {},
                                    "refreshComponentParameter": {},
                                    "style": "height: 128px;"
                                }
                            ],
                            "layout": "row",
                            "class": "",
                            "style": "",
                            "paddingT": "10px",
                            "paddingL": "17px",
                            "paddingR": "17px"
                        },
                        "expandStyle": false
                    }
                ]
            }, { backGroundColor: `transparent;` });
        }
        else {
            glitter.setHome(`jspage/${(_d = glitter.getUrlParameter('page')) !== null && _d !== void 0 ? _d : 'getting-started/introduction'}.js`, (_e = glitter.getUrlParameter('page')) !== null && _e !== void 0 ? _e : 'getting-started/introduction', {}, { backGroundColor: `transparent;` });
        }
    }
}
