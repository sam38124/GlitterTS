import { GlobalUser } from '../../glitter-base/global/global-user.js';
import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
import { BaseApi } from '../../glitterBundle/api/base.js';
import { ShareDialog } from '../../dialog/ShareDialog.js';

TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData) => {
            object.comefrom = object.comefrom ?? {};
            object.appName = object.appName ?? {};
            return {
                editor: () => {
                    return [
                        TriggerEvent.editer(gvc, widget, object.comefrom, {
                            hover: false,
                            option: [],
                            title: '複製專案來源',
                        }),
                        TriggerEvent.editer(gvc, widget, object.appName, {
                            hover: false,
                            option: [],
                            title: 'APP名稱',
                        }),
                    ].join(`<div class="my-2"></div>`);
                },
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const createAPP = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.comefrom,
                            subData: subData,
                        });
                        const appName = await TriggerEvent.trigger({
                            gvc: gvc,
                            widget: widget,
                            clickEvent: object.appName,
                            subData: subData,
                        });
                        const glitter = (window as any).glitter;
                        const shareDialog = new ShareDialog(glitter);
                        const html = String.raw;

                        if (gvc.glitter.getCookieByName('glitterToken') === undefined) {
                            shareDialog.errorMessage({ text: '請先登入' });
                            return;
                        } else {
                            if (!appName) {
                                shareDialog.errorMessage({ text: '請輸入APP名稱' });
                                return;
                            }
                            const saasConfig: {
                                config: any;
                                api: any;
                            } = (window as any).saasConfig;
                            shareDialog.dataLoading({
                                visible: true,
                            });
                            BaseApi.create({
                                url: saasConfig.config.url + `/api/v1/app`,
                                type: 'POST',
                                timeout: 0,
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: GlobalUser.token,
                                },
                                data: JSON.stringify({
                                    domain: '',
                                    appName: appName,
                                    copyApp: createAPP,
                                    brand: (window as any).appName,
                                    copyWith: ['checkout', 'user', 'public_config'],
                                }),
                            }).then((d2) => {
                                shareDialog.dataLoading({ visible: false });
                                if (d2.result) {
                                    const url = new URL(location.href);
                                    url.searchParams.set('type', 'editor');
                                    url.searchParams.set('page', '');
                                    url.searchParams.set('appName', appName as string);
                                    location.href = url.href;
                                    resolve(true);
                                } else {
                                    shareDialog.errorMessage({ text: '建立失敗，此名稱已被使用!' });
                                    resolve(false);
                                }
                            });
                        }
                    });
                },
            };
        },
    };
});
