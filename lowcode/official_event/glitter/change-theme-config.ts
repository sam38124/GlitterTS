import {TriggerEvent} from "../../glitterBundle/plugins/trigger-event.js";
import {BaseApi} from "../../glitterBundle/api/base.js";
import {GlobalUser} from "../../glitter-base/global/global-user.js";

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.theme = object.theme ?? {}
            object.theme_config = object.theme_config ?? {}
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
                            object.theme_config,
                            {
                                hover: false,
                                option: [],
                                title: '主題資訊'
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

                        const theme_config = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.theme_config,
                            subData: subData,
                        })

                        BaseApi.create({
                            "url": saasConfig.config.url + `/api/v1/app/theme_config`,
                            "type": "PUT",
                            "timeout": 0,
                            "headers": {
                                "Content-Type": "application/json",
                                "Authorization": GlobalUser.saas_token
                            },
                            "data": JSON.stringify({
                                "theme": theme,
                                "config": theme_config
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
