import {GlobalUser} from "../../glitter-base/global/global-user.js";
import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {ShareDialog} from "../../dialog/ShareDialog.js";


TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.theme = object.theme ?? {}
            object.app_name = object.app_name ?? {}
            return {
                editor: () => {

                    return [TriggerEvent.editer(gvc,
                        widget,
                        object.theme,
                        {
                            hover: false,
                            option: [],
                            title: '主題來源'
                        }),
                        TriggerEvent.editer(gvc,
                            widget,
                            object.app_name,
                            {
                                hover: false,
                                option: [],
                                title: 'APP名稱'
                            })
                    ].join(`<div class="my-2"></div>`);

                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const saasConfig: {
                            config: any;
                            api: any;
                        } = (window as any).saasConfig;
                        const theme = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.theme,
                            subData: subData,
                        })
                        const app_name = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.app_name,
                            subData: subData,
                        })

                        BaseApi.create({
                            "url": saasConfig.config.url + `/api/v1/app/theme`,
                            "type": "PUT",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": GlobalUser.saas_token
                            },
                            "data": JSON.stringify({
                                "theme": theme,
                                "app_name": app_name
                            })
                        }).then((d2) => {
                            resolve(true)
                        })

                    })
                }
            }
        }
    };
});

