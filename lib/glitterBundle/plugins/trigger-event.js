export class TriggerEvent {
    static getUrlParameter(url, sParam) {
        try {
            let sPageURL = url.split("?")[1], sURLVariables = sPageURL.split('&'), sParameterName, i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? undefined : decodeURIComponent(sParameterName[1]);
                }
            }
            return undefined;
        }
        catch (e) {
            return undefined;
        }
    }
    static setEventRouter(original, relative) {
        const glitter = window.glitter;
        const url = new URL(relative, original);
        url.searchParams.set("original", original);
        return (gvc, widget, obj, subData, element) => {
            var _a, _b, _c;
            const editViewId = glitter.getUUID();
            glitter.share.componentData = (_a = glitter.share.componentData) !== null && _a !== void 0 ? _a : {};
            let val = glitter.share.componentData[url.href];
            glitter.share.componentCallback = (_b = glitter.share.componentCallback) !== null && _b !== void 0 ? _b : {};
            glitter.share.componentCallback[url.href] = (_c = glitter.share.componentCallback[url.href]) !== null && _c !== void 0 ? _c : [];
            glitter.share.componentCallback[url.href].push((dd) => {
                glitter.share.componentData[url.href] = dd;
                gvc.notifyDataChange(editViewId);
            });
            gvc.glitter.addMtScript([
                {
                    src: url,
                    type: 'module'
                }
            ], () => {
                val = glitter.share.componentData[url.href];
                glitter.deBugMessage('setComponent-->' + url);
            }, () => {
            });
            return {
                event: () => {
                    return new Promise(async (resolve, reject) => {
                        const event = await (new Promise((resolve, reject) => {
                            const timer = setInterval(() => {
                                if (val) {
                                    resolve(val);
                                    clearInterval(timer);
                                }
                            }, 20);
                            setTimeout(() => {
                                clearInterval(timer);
                                resolve(false);
                            }, 3000);
                        }));
                        if (event) {
                            resolve((await val.fun(gvc, widget, obj, subData, element).event()));
                        }
                        else {
                            resolve(false);
                        }
                    });
                },
                editor: () => {
                    return gvc.bindView(() => {
                        return {
                            bind: editViewId,
                            view: () => {
                                if (!val) {
                                    return ``;
                                }
                                else {
                                    return val.fun(gvc, widget, obj, subData, element).editor();
                                }
                            },
                            divCreate: {}
                        };
                    });
                }
            };
        };
    }
    static createSingleEvent(url, fun) {
        const glitter = window.glitter;
        const val = fun(glitter);
        let fal = 0;
        function tryLoop() {
            try {
                let delete2 = 0;
                glitter.share.componentCallback[url].map((dd, index) => {
                    dd(val);
                    delete2 = index;
                });
                glitter.share.componentCallback[url].splice(0, delete2);
            }
            catch (e) {
                if (fal < 10) {
                    setTimeout(() => {
                        tryLoop();
                    }, 100);
                }
                fal += 1;
                console.log('error' + url);
            }
        }
        tryLoop();
        return val;
    }
    static create(url, event) {
        var _a;
        const glitter = window.glitter;
        glitter.share.clickEvent = (_a = glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
        glitter.share.clickEvent[url] = event;
    }
    static trigger(oj) {
        const glitter = window.glitter;
        const event = oj.clickEvent.clickEvent;
        let returnData = '';
        async function run() {
            return new Promise(async (resolve, reject) => {
                var _a;
                async function pass() {
                    try {
                        setTimeout(() => {
                            resolve(true);
                        }, 4000);
                        returnData = await oj.gvc.glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(event.src)][event.route].fun(oj.gvc, oj.widget, oj.clickEvent, oj.subData, oj.element).event();
                        resolve(true);
                    }
                    catch (e) {
                        resolve(false);
                    }
                }
                oj.gvc.glitter.share.clickEvent = (_a = oj.gvc.glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
                if (!oj.gvc.glitter.share.clickEvent[event.src]) {
                    await new Promise((resolve, reject) => {
                        oj.gvc.glitter.addMtScript([
                            { src: `${glitter.htmlGenerate.resourceHook(event.src)}`, type: 'module' }
                        ], () => {
                            pass();
                        }, () => {
                            resolve(false);
                        });
                    });
                }
                else {
                    pass();
                }
            });
        }
        return new Promise(async (resolve, reject) => {
            let fal = 10;
            function check() {
                run().then((res) => {
                    if (res || (fal === 0)) {
                        resolve(returnData);
                    }
                    else {
                        setTimeout(() => {
                            fal -= 1;
                            check();
                        }, 100);
                    }
                });
            }
            check();
        });
    }
    static editer(gvc, widget, obj, option = { hover: false, option: [] }) {
        var _a, _b;
        gvc.glitter.share.clickEvent = (_a = gvc.glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
        const glitter = gvc.glitter;
        const selectID = glitter.getUUID();
        return `<div class="mt-2 ${(option.hover) ? `alert alert-primary` : ``}">
 <h3 class="m-0" style="font-size: 16px;">${(_b = option.title) !== null && _b !== void 0 ? _b : "點擊事件"}</h3>
 ${gvc.bindView(() => {
            return {
                bind: selectID,
                view: () => {
                    var _a;
                    var select = false;
                    return `<select class="form-select m-0 mt-2" onchange="${gvc.event((e) => {
                        var _a;
                        if (e.value === 'undefined') {
                            obj.clickEvent = undefined;
                        }
                        else {
                            obj.clickEvent = JSON.parse(e.value);
                            obj.clickEvent.src = (_a = TriggerEvent.getUrlParameter(obj.clickEvent.src, 'resource')) !== null && _a !== void 0 ? _a : obj.clickEvent.src;
                        }
                        gvc.notifyDataChange(selectID);
                    })}">
                        
                        ${gvc.map(Object.keys(((_a = glitter.share) === null || _a === void 0 ? void 0 : _a.clickEvent) || {}).filter((dd) => {
                        return TriggerEvent.getUrlParameter(dd, "resource") !== undefined;
                    }).map((key) => {
                        const value = glitter.share.clickEvent[key];
                        return gvc.map(Object.keys(value).map((v2) => {
                            var _a;
                            if (option.option.length > 0) {
                                if (option.option.indexOf(v2) === -1) {
                                    return ``;
                                }
                            }
                            const value2 = value[v2];
                            const selected = JSON.stringify({
                                src: (_a = TriggerEvent.getUrlParameter(key, 'resource')) !== null && _a !== void 0 ? _a : obj.clickEvent.src,
                                route: v2
                            }) === JSON.stringify(obj.clickEvent);
                            select = selected || select;
                            return `<option value='${JSON.stringify({
                                src: key,
                                route: v2
                            })}' ${(selected) ? `selected` : ``}>${value2.title}</option>`;
                        }));
                    }))}
<option value="undefined"  ${(!select) ? `selected` : ``}>未定義</option>
</select>
${gvc.bindView(() => {
                        const id = glitter.getUUID();
                        setTimeout(() => {
                            gvc.notifyDataChange(id);
                        }, 200);
                        return {
                            bind: id,
                            view: () => {
                                try {
                                    if (!glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)]) {
                                        return ``;
                                    }
                                    return glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)][obj.clickEvent.route].fun(gvc, widget, obj).editor();
                                }
                                catch (e) {
                                    return ``;
                                }
                            },
                            divCreate: {},
                            onCreate: () => {
                                var _a;
                                glitter.share.clickEvent = (_a = glitter.share.clickEvent) !== null && _a !== void 0 ? _a : {};
                                try {
                                    if (!glitter.share.clickEvent[glitter.htmlGenerate.resourceHook(obj.clickEvent.src)]) {
                                        -glitter.addMtScript([
                                            {
                                                src: glitter.htmlGenerate.resourceHook(obj.clickEvent.src),
                                                type: 'module'
                                            }
                                        ], () => {
                                            setTimeout(() => {
                                                gvc.notifyDataChange(id);
                                            }, 200);
                                        }, () => {
                                            console.log(`loadingError:` + obj.clickEvent.src);
                                        });
                                    }
                                }
                                catch (e) {
                                }
                            }
                        };
                    })}
`;
                },
                divCreate: {}
            };
        })}
</div> `;
    }
}