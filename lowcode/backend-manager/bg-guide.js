import { ApiShop } from '../glitter-base/route/shopping.js';
import { ShareDialog } from "../dialog/ShareDialog.js";
const html = String.raw;
export class BgGuide {
    constructor(gvc, guide, type = 'backend-manger', step = 0) {
        this.uiGuidePage = [
            {
                value: 'init',
                title: '初始化介面',
                innerHTML: () => {
                    return this.drawUIGuide();
                },
            },
            {
                value: 'editor',
                title: '頁面編輯',
                innerHTML: () => {
                    return this.drawEditorGuide();
                },
            },
            {
                value: 'global',
                title: '全站樣式',
                innerHTML: () => {
                    return this.drawGlobalEditorGuide();
                },
            },
            {
                value: 'design',
                title: '設計元件',
                innerHTML: () => {
                    return this.drawDesignEditorGuide();
                },
            },
        ];
        this.guidePage = [
            {
                value: 'init',
                title: '初始化介面',
                innerHTML: () => {
                    return this.drawInitGuide();
                },
            },
            {
                value: 'setFinanceWay',
                title: '金流設定',
                innerHTML: () => {
                    return this.drawFinanceWayGuide();
                },
            },
            {
                value: 'shippment_setting',
                title: '配送設定',
                innerHTML: () => {
                    return this.drawShipmentGuide();
                },
            },
            {
                value: 'logistics_setting',
                title: '運費設定',
                innerHTML: () => {
                    return this.drawLogisticsGuide();
                },
            },
            {
                value: 'product-manager',
                title: '商品上架',
                innerHTML: () => {
                    return this.drawProductGuide();
                },
            },
            {
                value: 'shop_information',
                title: '商店訊息',
                innerHTML: () => {
                    return this.drawMessageGuide();
                },
            },
            {
                value: 'web_theme',
                title: '佈置官網',
                innerHTML: () => {
                    return this.drawLayoutGuide();
                },
            },
            {
                value: 'manage_theme',
                title: '管理主題庫',
                innerHTML: () => {
                    return this.drawThemeGuide();
                },
            },
        ];
        this.eventSet = [];
        this.guide = guide;
        this.gvc = gvc;
        this.type = type;
        this.step = step;
    }
    detectClickThrough(target, clickEvent) {
        target.classList.add('guideClickListen');
        const handleClick = () => {
            setTimeout(() => {
                clickEvent();
                this.eventSet = this.eventSet.filter((d) => {
                    return d !== handleClick;
                });
                target.removeEventListener('click', handleClick);
            }, 0);
        };
        target.addEventListener('click', handleClick);
        this.eventSet.push(() => {
            target.removeEventListener('click', handleClick);
        });
    }
    detectOninputThrough(target, clickEvent) {
        const handleClick = () => {
            setTimeout(() => {
                if (target.value.length > 0) {
                    clickEvent();
                    this.eventSet = this.eventSet.filter((d) => {
                        return d !== handleClick;
                    });
                    target.removeEventListener('input', handleClick);
                }
            }, 0);
        };
        target.addEventListener('input', handleClick);
        this.eventSet.push(() => {
            target.removeEventListener('input', handleClick);
        });
    }
    clearEvent() {
        this.eventSet.forEach((del) => {
            del();
        });
    }
    leaveGuide(vm, step) {
        try {
            const element = document.querySelector('.guide-BG');
            this.clearEvent();
            element.remove();
        }
        catch (e) {
        }
        this.step = step !== null && step !== void 0 ? step : -1;
        if (!step) {
            ApiShop.getFEGuideLeave().then(r => {
                var _a;
                if (!((_a = r.response) === null || _a === void 0 ? void 0 : _a.value)) {
                    ApiShop.setFEGuideLeave().then(r => {
                        this.guide = 0;
                        this.drawBG();
                    });
                }
                else {
                    try {
                        document.querySelector(`.guide-BG`).remove();
                    }
                    catch (e) {
                    }
                    this.guide = 0;
                    this.drawBG();
                }
            });
        }
    }
    holeBG(left, right, top, bottom) {
        return `clip-path: polygon(0% 0%, 0% 100%, ${left.toFixed(0)}px 100%, ${left.toFixed(0)}px ${top.toFixed(0)}px, ${right.toFixed(0)}px ${top.toFixed(0)}px, ${right.toFixed(0)}px ${bottom.toFixed(0)}px, ${left.toFixed(0)}px ${bottom.toFixed(0)}px, ${left.toFixed(0)}px 100%, 100% 100%, 100% 0%);`;
    }
    holeTwoBG(first, second) {
        return `clip-path: polygon(0 0, 0 ${first.y1}px, ${first.x2}px ${first.y1}px, ${first.x2}px ${first.y2}px, 0 ${first.y2}px, 0 100%, ${second.x1}px 100%, ${second.x1}px ${second.y1}px, ${second.x2}px ${second.y1}px, ${second.x2}px ${second.y2}px, ${second.x1}px ${second.y2}px, ${second.x1}px 100%, 100% 100%, 100% 0%);`;
    }
    preventDefault(e) {
        e.preventDefault();
    }
    findPageIframe() {
        const iframes = document.querySelectorAll(`iframe`);
        let iframe = undefined;
        iframes.forEach((element, index) => {
            if (index === 0 || (element && element.src.includes(this.gvc.glitter.getUrlParameter('tab')))) {
                iframe = element;
            }
        });
        return iframe;
    }
    findIframeDom(cssSelector) {
        return this.findPageIframe().contentWindow.document.querySelector(cssSelector);
    }
    disableScroll() {
        this.enableScroll(BgGuide.disableFunction);
        BgGuide.disableFunction = (event) => {
            event.preventDefault();
        };
        const contentWindow = this.findPageIframe().contentWindow;
        if (contentWindow) {
            contentWindow.addEventListener('scroll', BgGuide.disableFunction, { passive: false });
            contentWindow.addEventListener('wheel', BgGuide.disableFunction, { passive: false });
            contentWindow.addEventListener('touchmove', BgGuide.disableFunction, { passive: false });
            contentWindow.document.addEventListener('scroll', BgGuide.disableFunction, { passive: false });
            contentWindow.document.addEventListener('wheel', BgGuide.disableFunction, { passive: false });
            contentWindow.document.addEventListener('touchmove', BgGuide.disableFunction, { passive: false });
        }
        return BgGuide.disableFunction;
    }
    enableScroll(preventScroll) {
        const contentWindow = this.findPageIframe().contentWindow;
        if (contentWindow) {
            contentWindow.removeEventListener('scroll', preventScroll);
            contentWindow.removeEventListener('wheel', preventScroll);
            contentWindow.removeEventListener('touchmove', preventScroll);
            contentWindow.document.removeEventListener('scroll', preventScroll);
            contentWindow.document.removeEventListener('wheel', preventScroll);
            contentWindow.document.removeEventListener('touchmove', preventScroll);
        }
    }
    finGuide(key) {
        ApiShop.getGuide().then((r) => {
            let dataList = r.response.value;
            let target = dataList.find((data) => {
                return data.value === key;
            });
            target.finished = true;
            ApiShop.setGuide(dataList).then(r => {
            });
        });
    }
    drawMainRowBG(BG, vm, targetSelector, viewID, step, title) {
        const target = document.querySelector(targetSelector);
        const rect = target ? target.getBoundingClientRect() : '';
        if (rect) {
            BG.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px ${rect.top}px, 0 ${rect.top}px)`;
            this.detectClickThrough(target, () => {
                vm.step = 2;
                this.gvc.notifyDataChange(viewID);
            });
            return html `
                <div
                        style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${rect.bottom +
                12}px;left: ${rect.right + 12}px;transform: translateY(-100%);z-index:1033;"
                >
                    <div style="position: relative;border-radius: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22" fill="none"
                             style="position: absolute;bottom: 19px;left: -18px;">
                            <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z" fill="white"/>
                        </svg>
                        <div
                                style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                        >
                            ${title ? title : '商店設定'}
                            <div class="d-flex ms-auto align-items-center"
                                 style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                步驟 1/${step}
                                <svg
                                        style="cursor: pointer;"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="13"
                                        viewBox="0 0 14 13"
                                        fill="none"
                                        onclick="${this.gvc.event(() => {
                this.leaveGuide(vm);
            })}"
                                >
                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div
                                style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                        >
                            點擊<span
                                style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「${title ? title : '商店設定'} 」</span>
                        </div>
                    </div>
                </div>
            `;
        }
        return ``;
    }
    drawSecondRowBG(BG, vm, targetSelector, viewID, title, step) {
        BG.style.clipPath = ``;
        const gvc = this.gvc;
        let target = document.querySelector(targetSelector);
        let rect = target ? target.getBoundingClientRect() : '';
        if (rect) {
            target = document.querySelector(targetSelector);
            rect = target.getBoundingClientRect();
            BG.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px ${rect.top}px, 0 ${rect.top}px)`;
            this.detectClickThrough(target, () => {
                vm.step = 3;
                BG.style.clipPath = ``;
                this.gvc.notifyDataChange(viewID);
            });
            return html `
                <div
                        style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${rect.bottom +
                12}px;left: ${rect.right + 12}px;transform: translateY(-100%);z-index:1033;"
                >
                    <div style="position: relative;border-radius: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22" fill="none"
                             style="position: absolute;bottom: 19px;left: -18px;">
                            <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z" fill="white"/>
                        </svg>
                        <div
                                style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                        >
                            ${title}
                            <div class="d-flex ms-auto align-items-center"
                                 style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                步驟 2/${step}
                                <svg
                                        style="cursor: pointer;"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="13"
                                        viewBox="0 0 14 13"
                                        fill="none"
                                        onclick="${gvc.event(() => {
                this.leaveGuide(vm);
            })}"
                                >
                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                </svg>
                            </div>
                        </div>
                        <div
                                style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                        >
                            點擊<span
                                style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「${title} 」</span>
                        </div>
                    </div>
                </div>
            `;
        }
        return ``;
    }
    drawBGwithBelowWindow(BG, vm, targetSelector, viewID, step, allStep, window, closeEvent) {
        var _a, _b;
        let gvc = this.gvc;
        function close() {
            if (closeEvent) {
                closeEvent();
            }
            if (window.cover) {
                if (document.querySelector('.clickInterface')) {
                    document.querySelector('.clickInterface').remove();
                }
            }
            BG.classList.remove(`${targetSelector.split('.')[1]}`);
        }
        function next() {
            vm.step++;
            close();
            gvc.notifyDataChange(viewID);
        }
        let iframe = this.findPageIframe();
        let iframeRect = iframe.getBoundingClientRect();
        let target = (_a = window.dom) !== null && _a !== void 0 ? _a : this.findIframeDom(`${targetSelector}`);
        let rect = target.getBoundingClientRect();
        let left = rect.left + iframeRect.left - 6;
        let top = rect.top + iframeRect.top - 6;
        let right = rect.right + iframeRect.left + 6;
        let bottom = rect.bottom + iframeRect.top + 6;
        let mid = (right + left) / 2;
        gvc.addStyle(`
                            ${targetSelector} {
                                ${this.holeBG(left, right, top, bottom)}
                            }                       
                        `);
        if (window.cover) {
            let body = document.querySelector('.editorContainer');
            if (body && !document.querySelector('.clickInterface')) {
                $(body).append(html `
                    <div class="clickInterface"
                         style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index: 1030;cursor: pointer;"
                         onclick="${gvc.event(() => {
                })}"></div>
                `);
            }
        }
        BG.classList.add(`${targetSelector.split('.')[1]}`);
        let winPosition = () => {
            switch (window.alignment) {
                case 'left': {
                    return `left: ${right - window.width}px;top:${rect.bottom + iframeRect.top + 24}px;`;
                }
                default: {
                    return `left: ${mid - window.width / 2}px;top:${rect.bottom + iframeRect.top + 24}px;`;
                }
            }
        };
        let arrowPosition = () => {
            switch (window.alignment) {
                case 'left': {
                    return window.width - 42;
                }
                default: {
                    return window.width / 2 - 11;
                }
            }
        };
        return html `
            <div class="d-flex flex-column"
                 style="width: ${window.width}px;height: ${window.height}px;flex-shrink: 0;position: absolute;${winPosition()};">
                <div class="w-100" style="padding-left: ${arrowPosition()}px;height:23px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                        <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z" fill="#FEAD20"/>
                    </svg>
                </div>
                <div class="w-100" style="border-radius: 10px;">
                    <div
                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                    >
                        ${window.title}
                        <div class="d-flex ms-auto align-items-center"
                             style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                            步驟 ${step}/${allStep}
                            <svg
                                    style="cursor: pointer;"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="13"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    onclick="${gvc.event(() => {
            close();
            this.leaveGuide(vm);
        })}"
                            >
                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                    <div
                            class="d-flex flex-column w-100"
                            style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal"
                    >
                        ${window.content}
                        <div class="d-flex align-items-center justify-content-between w-100"
                             style="margin-top: 24px;height:52px;">
                            <div
                                    class="${window.preview ? 'd-none' : ''}"
                                    style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                    onclick="${gvc.event(() => {
            vm.step--;
            close();
            if (window.previewEvent) {
                window.previewEvent();
            }
            gvc.notifyDataChange(viewID);
        })}"
                            >
                                上一步
                            </div>
                            <div class="${window.next ? 'd-none' : 'd-flex'} align-items-center justify-content-center ms-auto"
                                 style="width: 96px;height: 46px;">
                                <div
                                        class="${window.disable ? `` : `breathing-light`} "
                                        style="${window.disable
            ? `opacity: 0.8;background: #FFE9B2`
            : `background: #FEAD20;cursor: pointer`};padding: 6px 18px;border-radius: 10px;color: #FFF; ;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;"
                                        onclick="${gvc.event(() => {
            if (!window.disable) {
                next();
            }
            if (window.nextEvent) {
                window.nextEvent();
            }
        })}"
                                >
                                    ${(_b = window.btnText) !== null && _b !== void 0 ? _b : '下一步'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    drawBGwithRightWindow(BG, vm, htmlElement, targetSelector, viewID, step, allStep, window, closeEvent) {
        var _a;
        let gvc = this.gvc;
        let that = this;
        function close() {
            if (closeEvent) {
                closeEvent();
            }
            if (window.cover) {
                if (document.querySelector('.clickInterface')) {
                    document.querySelector('.clickInterface').remove();
                }
            }
            that.clearEvent();
            BG.classList.remove(`${targetSelector.split('.')[1]}`);
        }
        function next() {
            vm.step++;
            close();
            gvc.notifyDataChange(viewID);
        }
        let target = htmlElement;
        let rect = target.getBoundingClientRect();
        let left = rect.left - 3;
        let top = rect.top - 6;
        let right = rect.right + 3;
        let bottom = rect.bottom + 6;
        let mid = (right + left) / 2;
        let bodyMidHeight = (bottom - top) / 2;
        if (!window.ignoreStyle) {
            gvc.addStyle(`
                            ${targetSelector} {
                                ${this.holeBG(left, right, top, bottom)}
                            }                       
                        `);
        }
        if (window.cover) {
            let body = document.querySelector('.editorContainer');
            if (body && !document.querySelector('.clickInterface')) {
                $(body).append(html `
                    <div class="clickInterface"
                         style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index: 1030;cursor: pointer;"
                         onclick="${gvc.event(() => {
                })}"></div>
                `);
            }
        }
        BG.classList.add(`${targetSelector.split('.')[1]}`);
        let winPosition = () => {
            switch (window.alignment) {
                case 'left': {
                    return `left: ${right - window.width}px;top:${rect.bottom + 24}px;`;
                }
                case 'right': {
                    return `left: ${right + 12}px;top:${rect.top + 24}px;`;
                }
                case 'right2': {
                    return `left: ${right + 12}px;top:${top - 52.5 - 11 + bodyMidHeight}px;`;
                }
                default: {
                    return `left: ${mid - window.width / 2}px;top:${rect.bottom + 24}px;`;
                }
            }
        };
        let arrowPosition = () => {
            switch (window.alignment) {
                case 'left': {
                    return window.width - 42;
                }
                default: {
                    return window.width / 2 - 11;
                }
            }
        };
        return html `
            <div class="d-flex ${(window.alignment) ? '' : 'flex-column'} "
                 style="width: ${window.width}px;height: ${window.height}px;flex-shrink: 0;position: absolute;${winPosition()};">
                <div class="w-100 d-flex align-items-end ${(window.alignment) ? 'd-none' : ''}"
                     style="padding-left: ${arrowPosition()}px;height:23px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                        <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z" fill="#FEAD20"/>
                    </svg>
                </div>
                <div class=" ${(window.alignment) ? '' : 'd-none'}" style="height:100%;width:18px;position: relative">
                    <svg style="position: absolute;left: 1px;top: 52px;z-index: 1" xmlns="http://www.w3.org/2000/svg"
                         width="18" height="22" viewBox="0 0 18 22" fill="none">
                        <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z" fill="white"/>
                    </svg>
                </div>
                <div class="w-100" style="border-radius: 10px;">
                    <div
                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                    >
                        ${window.title}
                        <div class="d-flex ms-auto align-items-center"
                             style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                            步驟 ${step}/${allStep}
                            <svg
                                    style="cursor: pointer;"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="13"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    onclick="${gvc.event(() => {
            close();
            this.leaveGuide(vm);
        })}"
                            >
                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                    <div
                            class="d-flex flex-column w-100"
                            style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal"
                    >
                        ${window.content}
                        <div class="${(window.next && window.preview ? 'd-none' : 'd-flex')} align-items-center justify-content-between w-100"
                             style="margin-top: 34px;">
                            <div
                                    class="${window.preview ? 'd-none' : ''}"
                                    style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                    onclick="${gvc.event(() => {
            vm.step--;
            if (window.previewEvent) {
                window.previewEvent();
            }
            setTimeout(() => {
                close();
                gvc.notifyDataChange(viewID);
            });
        })}"
                            >
                                上一步
                            </div>
                            <div class="${window.next ? 'd-none' : 'd-flex'} align-items-center justify-content-center ms-auto"
                                 style="width: 96px;height: 46px;">
                                <div
                                        class="${window.disable ? `` : `breathing-light`} "
                                        style="${window.disable
            ? `opacity: 0.8;background: #FFE9B2`
            : `background: #FEAD20;cursor: pointer`};padding: 6px 18px;border-radius: 10px;color: #FFF; ;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;"
                                        onclick="${gvc.event(() => {
            if (!window.disable) {
                next();
            }
            if (window.nextEvent) {
                window.nextEvent();
            }
        })}"
                                >
                                    ${(_a = window.btnText) !== null && _a !== void 0 ? _a : '下一步'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    drawBGwithTopWindow(BG, vm, targetSelector, viewID, step, allStep, window, closeEvent) {
        var _a;
        let gvc = this.gvc;
        function close() {
            if (closeEvent) {
                closeEvent();
            }
            if (window.cover) {
                if (document.querySelector('.clickInterface')) {
                    document.querySelector('.clickInterface').remove();
                }
            }
            BG.classList.remove(`${targetSelector.split('.')[1]}`);
        }
        function next() {
            vm.step++;
            close();
            gvc.notifyDataChange(viewID);
        }
        let iframe = this.findPageIframe();
        let iframeRect = iframe.getBoundingClientRect();
        let target = this.findIframeDom(`${targetSelector}`);
        let rect = target.getBoundingClientRect();
        let left = rect.left + iframeRect.left - 6;
        let top = rect.top + iframeRect.top - 6;
        let right = rect.right + iframeRect.left + 6;
        let bottom = rect.bottom + iframeRect.top + 6;
        let mid = (right + left) / 2;
        gvc.addStyle(`
                            ${targetSelector} {
                                ${this.holeBG(left, right, top, bottom)}
                            }                       
                        `);
        if (window.cover) {
            let body = document.querySelector('.editorContainer');
            if (body && !document.querySelector('.clickInterface')) {
                $(body).append(html `
                    <div class="clickInterface"
                         style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index: 1030;cursor: pointer;"
                         onclick="${gvc.event(() => {
                })}"></div>
                `);
            }
        }
        BG.classList.add(`${targetSelector.split('.')[1]}`);
        let winPosition = () => {
            switch (window.alignment) {
                case 'left': {
                    return `left: ${right - window.width}px;top:${rect.bottom + iframeRect.top + 24}px;`;
                }
                default: {
                    return `left: ${mid - window.width / 2}px;top:${rect.bottom + iframeRect.top + 24}px;`;
                }
            }
        };
        let arrowPosition = () => {
            switch (window.alignment) {
                case 'left': {
                    return window.width - 42;
                }
                default: {
                    return window.width / 2 - 11;
                }
            }
        };
        return html `
            <div class="d-flex flex-column"
                 style="width: ${window.width}px;height: ${window.height}px;flex-shrink: 0;position: absolute;${winPosition()};">
                <div class="w-100" style="padding-left: ${arrowPosition()}px;height:23px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                        <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z" fill="#FEAD20"/>
                    </svg>
                </div>
                <div class="w-100" style="border-radius: 10px;">
                    <div
                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                    >
                        ${window.title}
                        <div class="d-flex ms-auto align-items-center"
                             style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                            步驟 ${step}/${allStep}
                            <svg
                                    style="cursor: pointer;"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="13"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    onclick="${gvc.event(() => {
            close();
            this.leaveGuide(vm);
        })}"
                            >
                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                    <div
                            class="d-flex flex-column w-100"
                            style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal"
                    >
                        ${window.content}
                        <div class="d-flex align-items-center justify-content-between w-100"
                             style="margin-top: 24px;height:52px;">
                            <div
                                    class="${window.preview ? 'd-none' : ''}"
                                    style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                    onclick="${gvc.event(() => {
            vm.step--;
            close();
            if (window.previewEvent) {
                window.previewEvent();
            }
            gvc.notifyDataChange(viewID);
        })}"
                            >
                                上一步
                            </div>
                            <div class="${window.next ? 'd-none' : 'd-flex'} align-items-center justify-content-center ms-auto"
                                 style="width: 96px;height: 46px;">
                                <div
                                        class="${window.disable ? `` : `breathing-light`} "
                                        style="${window.disable
            ? `opacity: 0.8;background: #FFE9B2`
            : `background: #FEAD20;cursor: pointer`};padding: 6px 18px;border-radius: 10px;color: #FFF; ;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;"
                                        onclick="${gvc.event(() => {
            if (!window.disable) {
                next();
            }
            if (window.nextEvent) {
                window.nextEvent();
            }
        })}"
                                >
                                    ${(_a = window.btnText) !== null && _a !== void 0 ? _a : '下一步'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    drawFinBG(BG, vm, targetSelector, viewID, step, key, window) {
        function close() {
            BG.classList.remove(targetSelector);
        }
        const gvc = this.gvc;
        let iframe = this.findPageIframe();
        let iframeRect = iframe.getBoundingClientRect();
        let target = this.findIframeDom(`.${targetSelector}`);
        let rect = target.getBoundingClientRect();
        let left = rect.left + iframeRect.left - 12;
        let top = rect.top + iframeRect.top - 12;
        let right = rect.right + iframeRect.left + 12;
        let bottom = rect.bottom + iframeRect.top + 12;
        BG.classList.add(targetSelector);
        gvc.addStyle(`
                            .${targetSelector} {
                                ${this.holeBG(left, right, top, bottom)}
                            }                         
                        `);
        this.detectClickThrough(target, () => {
            if (window === null || window === void 0 ? void 0 : window.loading) {
                let timer1 = setInterval(() => {
                    if (document.querySelector('.dialog-success')) {
                        setTimeout(() => {
                            close();
                            this.finGuide(key);
                            this.leaveGuide(vm, 0);
                            clearInterval(timer1);
                        }, 1500);
                    }
                }, 400);
            }
            else {
                close();
                this.finGuide(key);
                this.leaveGuide(vm, 0);
            }
        });
        return html `
            <div class="d-flex flex-column"
                 style="width: 332px;height: 200px;flex-shrink: 0;position: absolute;right: 18px;bottom:90px;)">
                <div class="w-100" style="border-radius: 10px;">
                    <div
                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                    >
                        儲存
                        <div class="d-flex ms-auto align-items-center"
                             style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                            步驟 ${step}/${step}
                            <svg
                                    style="cursor: pointer;"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="13"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    onclick="${gvc.event(() => {
            close();
            this.leaveGuide(vm);
        })}"
                            >
                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                    <div
                            class="d-flex flex-column w-100"
                            style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                    >
                        <div class="d-flex">點擊<span style="font-weight: 700;">儲存</span>按鈕，完成設定</div>
                        <div class="d-flex align-items-center justify-content-between"
                             style="margin-top: 24px;height:52px;">
                            <div
                                    style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                    onclick="${gvc.event(() => {
            vm.step--;
            close();
            gvc.notifyDataChange(viewID);
        })}"
                            >
                                上一步
                            </div>
                            <div class="d-flex align-items-center justify-content-center"
                                 style="width: 96px;height: 46px;"></div>
                        </div>
                    </div>
                </div>
                <div class="w-100 d-flex justify-content-end" style="padding-right: 20px;height:23px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                        <path d="M11 18L21.3923 -1.90735e-06L0.607696 -1.90735e-06L11 18Z" fill="white"/>
                    </svg>
                </div>
            </div>
        `;
    }
    drawLayoutGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        let layer2Delay = true;
        let totalStep = 4;
        return gvc.bindView({
            bind: 'layoutInit',
            dataList: [],
            view: () => {
                let viewID = 'layoutInit';
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`);
                gvc.addStyle(`                        
                    .breathing-light {
                        position:relative;
                        z-index: 1;
                        border: 1px solid rgba(255, 233, 178, 0.5);
                    }
                    .breathing-light::before {
                        content: '';
                        position: absolute;
                       top: -5px; /* 控制光效范围 */
                        left: -5px;
                        right: -5px;
                        bottom: -5px;
                        border: 5px solid #FFE9B2; /* 边框颜色 */
                        border-radius: inherit; /* 保持和容器一样的圆角 */
                        filter: blur(2px); /* 模糊程度 */
                        animation: breathing 1.5s infinite alternate; /* 呼吸灯效果 */
                    }
                    @keyframes breathing {
                        
                        0% {
                            opacity: 1;
                            transform: scale(1); /* 放大效果 */
                            box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                        }
                        100% {
                            opacity: 0.5;
                            transform: scale(1);
                            box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                        }
                    }
                `);
                switch (vm.step) {
                    case 2: {
                        if (layer2Delay) {
                            const timer = setInterval(() => {
                                layer2Delay = false;
                                clearInterval(timer);
                                gvc.notifyDataChange('layoutInit');
                            }, 500);
                            return ``;
                        }
                        return this.drawSecondRowBG(BG, vm, `.guide7-2`, viewID, '佈景主題', totalStep);
                    }
                    case 3: {
                        let target = this.findIframeDom(`.guide7-3`);
                        let check = true;
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide7-3`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        return this.drawBGwithBelowWindow(BG, vm, '.guide7-3', viewID, totalStep - 1, totalStep, {
                            width: 332,
                            height: 209,
                            title: '當前主題',
                            content: '為當前首頁套用的主題資訊',
                            cover: true,
                            preview: true
                        }, () => {
                        });
                    }
                    case 4: {
                        let target = this.findIframeDom(`.guide7-4`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide7-4`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        let content = html `
                            <div class="d-flex flex-wrap"
                                 style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;">
                                點擊<span style="font-weight: 700;">自訂</span>，即可前往<span style="font-weight: 700;">頁面編輯器頁面</span>，自由將官網編輯成您理想中的模樣
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.guide7-4', viewID, totalStep, totalStep, {
                            width: 332,
                            height: 235,
                            title: '自訂主題',
                            content: content,
                            alignment: 'left',
                            btnText: '完成',
                            cover: true,
                            nextEvent: () => {
                                this.leaveGuide(vm);
                            },
                        });
                    }
                    default: {
                        function close() {
                            BG.classList.remove('guide7-1');
                        }
                        let target1 = document.querySelector(`.mainRow11`);
                        let rect = target1.getBoundingClientRect();
                        let target2 = this.findIframeDom(`.guide7-1`);
                        let iframeRect = iframe.getBoundingClientRect();
                        this.detectClickThrough(target1, () => {
                            close();
                            totalStep = 3;
                            vm.step = 2;
                            gvc.notifyDataChange(viewID);
                        });
                        if (target2) {
                            let rect2 = target2.getBoundingClientRect();
                            let cssStyle = this.holeTwoBG({
                                x1: rect.left,
                                x2: rect.right,
                                y1: rect.top,
                                y2: rect.bottom,
                            }, {
                                x1: iframeRect.left + rect2.left - 12,
                                x2: iframeRect.left + rect2.right + 12,
                                y1: iframeRect.top + rect2.top - 12,
                                y2: iframeRect.top + rect2.bottom + 12,
                            });
                            BG.classList.add('guide7-1');
                            const handler = (event) => {
                                close();
                                totalStep = 3;
                                vm.step = 3;
                                gvc.notifyDataChange(viewID);
                                target2.removeEventListener('click', handler, { capture: true });
                            };
                            target2.addEventListener('click', handler, { capture: true });
                            gvc.addStyle(`
                                .guide7-1{
                                    ${cssStyle}
                                }
                            `);
                            return html `
                                <div
                                        style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${(rect.top -
                                12 +
                                iframeRect.top +
                                rect2.bottom) /
                                2}px;left: ${(rect.right + iframeRect.left + rect2.left) / 2}px;transform: translate(-50%, -50%);z-index:1033;"
                                >
                                    <div style="position: relative;border-radius: 10px;">
                                        <div
                                                style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                                        >
                                            品牌官網
                                            <div
                                                    class="d-flex ms-auto align-items-center"
                                                    style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;"
                                            >
                                                步驟 1/${totalStep}
                                                <svg
                                                        style="cursor: pointer;"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="13"
                                                        viewBox="0 0 14 13"
                                                        fill="none"
                                                        onclick="${this.gvc.event(() => {
                                this.leaveGuide(vm);
                            })}"
                                                >
                                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div
                                                style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                                        >
                                            點擊<span
                                                style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「品牌官網」</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        return this.drawMainRowBG(BG, vm, `.mainRow11`, viewID, 5, '品牌官網');
                    }
                }
            },
            divCreate: {},
        });
    }
    drawThemeGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        let totalStep = 6;
        let layer2Delay = true;
        let themeNumbers = 0;
        return gvc.bindView({
            bind: 'layoutInit',
            dataList: [],
            view: () => {
                let viewID = 'layoutInit';
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`);
                gvc.addStyle(`                        
                    .breathing-light {
                        position:relative;
                        z-index: 1;
                        border: 1px solid rgba(255, 233, 178, 0.5);
                    }
                    .breathing-light::before {
                        content: '';
                        position: absolute;
                       top: -5px; /* 控制光效范围 */
                        left: -5px;
                        right: -5px;
                        bottom: -5px;
                        border: 5px solid #FFE9B2; /* 边框颜色 */
                        border-radius: inherit; /* 保持和容器一样的圆角 */
                        filter: blur(2px); /* 模糊程度 */
                        animation: breathing 1.5s infinite alternate; /* 呼吸灯效果 */
                    }
                    @keyframes breathing {
                        
                        0% {
                            opacity: 1;
                            transform: scale(1); /* 放大效果 */
                            box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                        }
                        100% {
                            opacity: 0.5;
                            transform: scale(1);
                            box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                        }
                    }
                `);
                switch (vm.step) {
                    case 2: {
                        let target = document.querySelector('.guide7-2');
                        if (layer2Delay) {
                            const timer = setInterval(() => {
                                layer2Delay = false;
                                clearInterval(timer);
                                target.scrollIntoView();
                                gvc.notifyDataChange(viewID);
                            }, 300);
                            return ``;
                        }
                        return this.drawSecondRowBG(BG, vm, `.guide7-2`, viewID, '佈景主題', totalStep);
                    }
                    case 3: {
                        let target = this.findIframeDom(`.guide8-5`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide8-5`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        target.scrollIntoView();
                        let content = html `
                            <div class=""
                                 style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                在<span style="font-weight: 700;">佈景主題庫</span>儲存並管理多個設計主題，可根據需求靈活切換應用，展現多樣視覺效果，增強品牌吸引力
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.guide8-5', viewID, totalStep - 4, totalStep, {
                            width: 439,
                            height: 261,
                            title: '自訂主題',
                            content: content,
                            cover: true
                        });
                    }
                    case 4: {
                        let target = this.findIframeDom(`.themeGroup`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.themeGroup`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        target.parentElement.scrollIntoView();
                        this.detectClickThrough(target.querySelector('.addTheme'), () => {
                            vm.step++;
                            gvc.notifyDataChange(viewID);
                        });
                        let content = html `
                            <div class=""
                                 style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                滑鼠移入喜歡的主題後點擊<span style="font-weight: 700;">新增</span>
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.themeGroup', viewID, totalStep - 3, totalStep, {
                            width: 439,
                            height: 261,
                            title: '選擇主題',
                            content: content,
                            next: true
                        });
                    }
                    case 5: {
                        let target = this.findIframeDom(`.guide8-5`);
                        let themeRow = this.findPageIframe().contentWindow.document.querySelectorAll('.themeRow');
                        if (themeNumbers == 0) {
                            themeNumbers = themeRow.length;
                        }
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide8-5`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        if (themeNumbers == this.findPageIframe().contentWindow.document.querySelectorAll('.themeRow').length) {
                            const timer = setInterval(() => {
                                if (themeNumbers != this.findPageIframe().contentWindow.document.querySelectorAll('.themeRow').length) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        target.scrollIntoView();
                        let content = html `
                            <div class=""
                                 style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                您可以對剛新增的主題進行操作，如自定義樣式、切換、複製及下載等等
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.guide8-5', viewID, totalStep - 2, totalStep, {
                            width: 439,
                            height: 261,
                            title: '管理主題庫',
                            content: content,
                        });
                    }
                    case 6: {
                        let target = this.findIframeDom(`.themeSwitch`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.themeSwitch`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        target.parentElement.scrollIntoView();
                        let content = html `
                            <div class=""
                                 style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                使用<span style="font-weight: 700;">切換</span>功能，您可以將官網快速切換為主題庫中的其他主題，輕鬆又快速變換官網風格。
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.themeSwitch', viewID, totalStep, totalStep, {
                            width: 439,
                            height: 261,
                            title: '切換主題',
                            content: content,
                            alignment: 'left',
                            btnText: '完成',
                            nextEvent: () => {
                                this.leaveGuide(vm);
                            },
                        });
                    }
                    case 7: {
                        return html `
                            <div
                                    class="d-flex flex-column align-items-center justify-content-center"
                                    style="width: 492px;height: 307px;flex-shrink: 0;border-radius: 10px;background: #FFF;padding: 36px 64px;"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 76 75"
                                     fill="none">
                                    <g clip-path="url(#clip0_12208_36243)">
                                        <path
                                                d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z"
                                                fill="#393939"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_12208_36243">
                                            <rect width="75" height="75" fill="white" transform="translate(0.5)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <div style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;color:#393939;margin-top: 24px;">
                                    是否刪除導覽新增的主題？
                                </div>
                                <div style="color: #8D8D8D;font-size: 14px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.56px;margin-top: 8px;">
                                    ※您已按照教學導覽新增了一個主題。<br/>
                                    若無需使用，建議刪除以保持主題庫整潔。
                                </div>
                                <div class="d-flex align-items-center justify-content-center"
                                     style="margin-top: 24px;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;gap:14px;">
                                    <div
                                            style="color:#393939;display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                            onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                        })}"
                                    >
                                        取消
                                    </div>
                                    <div style="color:#FFF;display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #DA1313;">
                                        刪除
                                    </div>
                                </div>
                            </div>`;
                    }
                    case -3: {
                        let target = this.findIframeDom(`.guide7-3`);
                        let check = true;
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide7-3`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        target.scrollIntoView();
                        return this.drawBGwithTopWindow(BG, vm, '.guide7-3', viewID, totalStep - 6, totalStep, {
                            width: 332,
                            height: 209,
                            title: '當前主題',
                            content: '為當前首頁套用的主題資訊',
                            cover: true,
                            preview: true
                        }, () => {
                        });
                    }
                    case -4: {
                        let target = this.findIframeDom(`.guide7-4`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide7-4`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 600);
                        }
                        let content = html `
                            <div class="d-flex flex-wrap"
                                 style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;">
                                點擊<span style="font-weight: 700;">自訂</span>，可前往<span style="font-weight: 700;">頁面編輯器頁面</span>，自由將官網編輯成您理想中的模樣
                            </div>
                        `;
                        target.scrollIntoView();
                        return this.drawBGwithBelowWindow(BG, vm, '.guide7-4', viewID, totalStep - 5, totalStep, {
                            width: 332,
                            height: 235,
                            title: '自訂主題',
                            content: content,
                            alignment: 'left',
                            cover: true,
                        });
                    }
                    default: {
                        function close() {
                            BG.classList.remove('guide7-1');
                        }
                        let target1 = document.querySelector(`.mainRow11`);
                        let rect = target1.getBoundingClientRect();
                        let target2 = this.findIframeDom(`.guide7-1`);
                        let iframeRect = iframe.getBoundingClientRect();
                        this.detectClickThrough(target1, () => {
                            close();
                            totalStep = 7;
                            vm.step = 2;
                            gvc.notifyDataChange(viewID);
                        });
                        if (target2) {
                            let rect2 = target2.getBoundingClientRect();
                            let cssStyle = this.holeTwoBG({
                                x1: rect.left,
                                x2: rect.right,
                                y1: rect.top,
                                y2: rect.bottom,
                            }, {
                                x1: iframeRect.left + rect2.left - 12,
                                x2: iframeRect.left + rect2.right + 12,
                                y1: iframeRect.top + rect2.top - 12,
                                y2: iframeRect.top + rect2.bottom + 12,
                            });
                            BG.classList.add('guide7-1');
                            const handler = (event) => {
                                close();
                                totalStep = 7;
                                vm.step = 3;
                                gvc.notifyDataChange(viewID);
                                target2.removeEventListener('click', handler, { capture: true });
                            };
                            target2.addEventListener('click', handler, { capture: true });
                            gvc.addStyle(`
                                .guide7-1{
                                    ${cssStyle}
                                }
                            `);
                            return html `
                                <div
                                        style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${(rect.top -
                                12 +
                                iframeRect.top +
                                rect2.bottom) /
                                2}px;left: ${(rect.right + iframeRect.left + rect2.left) / 2}px;transform: translate(-50%, -50%);z-index:1033;"
                                >
                                    <div style="position: relative;border-radius: 10px;">
                                        <div
                                                style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                                        >
                                            品牌官網
                                            <div
                                                    class="d-flex ms-auto align-items-center"
                                                    style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;"
                                            >
                                                步驟 1/${totalStep}
                                                <svg
                                                        style="cursor: pointer;"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="13"
                                                        viewBox="0 0 14 13"
                                                        fill="none"
                                                        onclick="${this.gvc.event(() => {
                                this.leaveGuide(vm);
                            })}"
                                                >
                                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div
                                                style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                                        >
                                            點擊<span
                                                style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「品牌官網」</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        return this.drawMainRowBG(BG, vm, `.mainRow11`, viewID, totalStep, '品牌官網');
                    }
                }
            },
            divCreate: {},
        });
    }
    drawMessageGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        let layer2Delay = true;
        return gvc.bindView({
            bind: 'messageInit',
            dataList: [],
            view: () => {
                let viewID = 'messageInit';
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`);
                gvc.addStyle(`                        
                    .breathing-light {
                        position:relative;
                        z-index: 1;
                        border: 1px solid rgba(255, 233, 178, 0.5);
                    }
                    .breathing-light::before {
                        content: '';
                        position: absolute;
                       top: -5px; /* 控制光效范围 */
                        left: -5px;
                        right: -5px;
                        bottom: -5px;
                        border: 5px solid #FFE9B2; /* 边框颜色 */
                        border-radius: inherit; /* 保持和容器一样的圆角 */
                        filter: blur(2px); /* 模糊程度 */
                        animation: breathing 1.5s infinite alternate; /* 呼吸灯效果 */
                    }
                    @keyframes breathing {
                        
                        0% {
                            opacity: 1;
                            transform: scale(1); /* 放大效果 */
                            box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                        }
                        100% {
                            opacity: 0.5;
                            transform: scale(1);
                            box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                        }
                    }
                `);
                switch (vm.step) {
                    case 2: {
                        if (layer2Delay) {
                            const timer = setInterval(() => {
                                layer2Delay = false;
                                clearInterval(timer);
                                gvc.notifyDataChange('messageInit');
                            }, 500);
                            return ``;
                        }
                        return this.drawSecondRowBG(BG, vm, `.guide6-2`, viewID, '商店訊息', 5);
                    }
                    case 3: {
                        let target = this.findIframeDom(`.guide6-3`);
                        let check = true;
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide6-3`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        return this.drawBGwithBelowWindow(BG, vm, '.guide6-3', viewID, 3, 5, {
                            width: 332,
                            height: 209,
                            title: '商店基本資訊',
                            content: '在這裡可以修改商店的基本訊息',
                        }, () => {
                        });
                    }
                    case 4: {
                        let target = this.findIframeDom(`.guide6-4`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide6-4`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        target.parentElement.parentElement.scrollIntoView();
                        return this.drawBGwithBelowWindow(BG, vm, '.guide6-4', viewID, 4, 5, {
                            width: 332,
                            height: 209,
                            title: 'SEO設定',
                            content: '完善SEO系統，提升網站的曝光度。',
                        });
                    }
                    case 5: {
                        let target = this.findIframeDom(`.guide6-5`);
                        target.parentElement.scrollIntoView({});
                        return this.drawBGwithBelowWindow(BG, vm, '.guide6-5', viewID, 5, 5, {
                            width: 332,
                            height: 209,
                            title: '網域設定',
                            content: '您可以選擇使用免費的子網域，或是額外付費申請獨立網域',
                            btnText: '完成',
                        }, () => {
                            this.leaveGuide(vm, 0);
                            this.finGuide('shop_information');
                        });
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow1`, viewID, 5);
                    }
                }
            },
            divCreate: {},
        });
    }
    drawProductGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        let layer2Delay = true;
        return gvc.bindView({
            bind: 'productInit',
            dataList: [],
            view: () => {
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`);
                gvc.addStyle(`                        
                    .breathing-light {
                        position:relative;
                        z-index: 1;
                        border: 1px solid rgba(255, 233, 178, 0.5);
                    }
                    .breathing-light::before {
                        content: '';
                        position: absolute;
                       top: -5px; /* 控制光效范围 */
                        left: -5px;
                        right: -5px;
                        bottom: -5px;
                        border: 5px solid #FFE9B2; /* 边框颜色 */
                        border-radius: inherit; /* 保持和容器一样的圆角 */
                        filter: blur(2px); /* 模糊程度 */
                        animation: breathing 1.5s infinite alternate; /* 呼吸灯效果 */
                    }
                    @keyframes breathing {
                        
                        0% {
                            opacity: 1;
                            transform: scale(1); /* 放大效果 */
                            box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                        }
                        100% {
                            opacity: 0.5;
                            transform: scale(1);
                            box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                        }
                    }
                `);
                switch (vm.step) {
                    case 2: {
                        if (layer2Delay) {
                            const timer = setInterval(() => {
                                layer2Delay = false;
                                clearInterval(timer);
                                gvc.notifyDataChange('productInit');
                            }, 500);
                            return ``;
                        }
                        return this.drawSecondRowBG(BG, vm, `.guide5-2`, 'productInit', '商品列表', 8);
                    }
                    case 3: {
                        let target = this.findIframeDom(`.guide5-3`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide5-3`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(`productInit`);
                                }
                            }, 400);
                        }
                        let content = html `
                            <div class="d-flex" style="font-weight: 400;line-height: 160%;letter-spacing: 0.64px;">
                                點擊<span style="font-weight: 700;">新增</span>，填寫商品詳細資訊
                            </div>
                        `;
                        this.detectClickThrough(target, () => {
                            vm.step++;
                            BG.classList.remove('guide5-3');
                            gvc.notifyDataChange('productInit');
                        });
                        if (target) {
                            return this.drawBGwithBelowWindow(BG, vm, '.guide5-3', 'productInit', 3, 8, {
                                width: 332,
                                height: 209,
                                title: '上架商品',
                                content: content,
                                alignment: 'left',
                                next: true,
                            }, () => {
                            });
                        }
                        else {
                            return this.drawBGwithBelowWindow(BG, vm, '.guide5-3', 'productInit', 3, 8, {
                                width: 332,
                                height: 209,
                                title: '上架商品',
                                content: '輸入商品名稱',
                                disable: true,
                            }, () => {
                            });
                        }
                    }
                    case 4: {
                        let target = this.findIframeDom(`.guide5-4`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide5-4`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(`productInit`);
                                }
                            }, 400);
                        }
                        if (target.querySelector('input').value.length > 0) {
                            return this.drawBGwithBelowWindow(BG, vm, '.guide5-4', 'productInit', 4, 8, {
                                width: 332,
                                height: 209,
                                title: '商品名稱',
                                content: '輸入商品名稱',
                                preview: true,
                            });
                        }
                        this.detectOninputThrough(target.querySelector('input'), () => {
                            gvc.notifyDataChange('productInit');
                        });
                        return this.drawBGwithBelowWindow(BG, vm, '.guide5-4', 'productInit', 4, 8, {
                            width: 332,
                            height: 209,
                            title: '商品名稱',
                            content: '輸入商品名稱',
                            disable: true,
                            preview: true,
                        });
                    }
                    case 5: {
                        let target = this.findIframeDom(`.guide5-5`);
                        target.parentElement.parentElement.scrollIntoView({});
                        if (target.querySelector('input').value.length > 0 && target.querySelector('input').value != 0) {
                            return this.drawBGwithBelowWindow(BG, vm, '.guide5-5', 'productInit', 5, 8, {
                                width: 332,
                                height: 209,
                                title: '售價',
                                content: '輸入商品的售價',
                                previewEvent: () => {
                                    this.findIframeDom('.guide5-4').parentElement.parentElement.scrollIntoView();
                                },
                            });
                        }
                        this.detectOninputThrough(target.querySelector('input'), () => {
                            gvc.notifyDataChange('productInit');
                        });
                        return this.drawBGwithBelowWindow(BG, vm, '.guide5-5', 'productInit', 5, 8, {
                            width: 332,
                            height: 209,
                            title: '售價',
                            content: '輸入商品的售價',
                            disable: true,
                            previewEvent: () => {
                                this.findIframeDom('.guide5-4').parentElement.parentElement.scrollIntoView();
                            },
                        });
                    }
                    case 6: {
                        let target = this.findIframeDom('.guide5-6');
                        target.parentElement.parentElement.parentElement.parentElement.scrollIntoView({});
                        this.detectClickThrough(target, () => {
                            BG.classList.remove('guide5-6');
                            vm.step++;
                            gvc.notifyDataChange('productInit');
                        });
                        return this.drawBGwithBelowWindow(BG, vm, '.guide5-6', 'productInit', 6, 8, {
                            width: 332,
                            height: 209,
                            title: '運費計算',
                            content: html `
                                <div class="" style="white-space: normal">
                                    點擊<span style="font-weight: 700;">依材積計算</span>，作為此商品的運費計算方式
                                </div>`,
                            next: true,
                        });
                    }
                    case 7: {
                        let target = this.findIframeDom('.guide5-7');
                        const inputGroup = target.querySelectorAll('input');
                        target.parentElement.parentElement.scrollIntoView({});
                        let check = true;
                        inputGroup.forEach((el) => {
                            if (!el.classList.contains('addListener')) {
                                that.detectOninputThrough(el, () => {
                                    gvc.notifyDataChange('productInit');
                                });
                                el.classList.add('addListener');
                            }
                            if (el.value.length < 0 || el.value == 0) {
                                check = false;
                            }
                        });
                        if (check) {
                            return this.drawBGwithBelowWindow(BG, vm, '.guide5-7', 'productInit', 7, 8, {
                                width: 350,
                                height: 217,
                                title: '商品材積',
                                content: '由於您在上一步驟選擇依材積計算，此處必須填寫商品的材積',
                            });
                        }
                        return this.drawBGwithBelowWindow(BG, vm, '.guide5-7', 'productInit', 7, 8, {
                            width: 350,
                            height: 217,
                            title: '商品材積',
                            content: '由於您在上一步驟選擇依材積計算，此處必須填寫商品的材積',
                            disable: true,
                        });
                    }
                    case 8: {
                        return this.drawFinBG(BG, vm, 'guide5-8', 'productInit', 8, 'product-manager', { loading: true });
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow2`, 'productInit', 8, '商品管理');
                    }
                }
            },
            divCreate: {},
        });
    }
    drawLogisticsGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        let layer2Delay = true;
        return gvc.bindView({
            bind: 'logisticsInit',
            dataList: [],
            view: () => {
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`);
                gvc.addStyle(`                        
                    .breathing-light {
                        position:relative;
                        z-index: 1;
                        border: 1px solid rgba(255, 233, 178, 0.5);
                    }
                    .breathing-light::before {
                        content: '';
                        position: absolute;
                       top: -5px; /* 控制光效范围 */
                        left: -5px;
                        right: -5px;
                        bottom: -5px;
                        border: 5px solid #FFE9B2; /* 边框颜色 */
                        border-radius: inherit; /* 保持和容器一样的圆角 */
                        filter: blur(2px); /* 模糊程度 */
                        animation: breathing 1.5s infinite alternate; /* 呼吸灯效果 */
                    }
                    @keyframes breathing {
                        
                        0% {
                            opacity: 1;
                            transform: scale(1); /* 放大效果 */
                            box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                        }
                        100% {
                            opacity: 0.5;
                            transform: scale(1);
                            box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                        }
                    }
                `);
                switch (vm.step) {
                    case 2: {
                        if (layer2Delay) {
                            const timer = setInterval(() => {
                                layer2Delay = false;
                                clearInterval(timer);
                                gvc.notifyDataChange('logisticsInit');
                            }, 500);
                            return ``;
                        }
                        return this.drawSecondRowBG(BG, vm, `.guide4-2`, 'logisticsInit', '運費設定', 8);
                    }
                    case 3: {
                        function close() {
                            BG.classList.remove(`guide4-3`);
                            clearInterval(timer);
                        }
                        function next() {
                            vm.step++;
                            close();
                            gvc.notifyDataChange('logisticsInit');
                        }
                        function drawHole(left, right, y1, y2, y3, y4) {
                            gvc.addStyle(`
                                .guide4-3{
                                    clip-path: polygon(0 100%, ${left}px 100%, ${left}px ${y1}px, ${right}px ${y1}px, ${right}px ${y2}px, ${left}px ${y2}px, ${left}px ${y3}px, ${right}px ${y3}px, ${right}px ${y4}px, ${left}px ${y4}px , ${left}px 100%, 100% 100%, 100% 0, 0 0);                                   
                                }
                            `);
                        }
                        let iframeRect = iframe.getBoundingClientRect();
                        let target = this.findIframeDom('.guide4-3-1');
                        let target2 = this.findIframeDom('.guide4-3-2');
                        if (!target || !target2) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom('.guide4-3-1') && this.findIframeDom('.guide4-3-2')) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange('logisticsInit');
                                }
                            }, 500);
                        }
                        let rect = target.getBoundingClientRect();
                        let rect2 = target2.getBoundingClientRect();
                        let left = rect.left + iframeRect.left - 12;
                        let top = rect.top + iframeRect.top - 12;
                        let top2 = rect2.top + iframeRect.top - 12;
                        let right = rect.right + iframeRect.left + 12;
                        let bottom = rect.bottom + iframeRect.top + 12;
                        let bottom2 = rect2.bottom + iframeRect.top + 12;
                        let mid = (right + left) / 2;
                        let checked = target.querySelector('input[checked]');
                        drawHole(left, right, top, bottom, top2, bottom2);
                        const timer = setInterval(() => {
                            checked = target.querySelector('input[checked]');
                        }, 500);
                        BG.classList.add(`guide4-3`);
                        return html `
                            <div class="d-flex flex-column"
                                 style="width: 440px;height: 218px;flex-shrink: 0;position: absolute;left: ${mid - 220}px;top:${(bottom + top2) / 2 - 109}px;">
                                <div class="w-100" style="border-radius: 10px;">
                                    <div
                                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                                    >
                                        靈活選擇計算方式
                                        <div
                                                class="d-flex ms-auto align-items-center"
                                                style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;"
                                        >
                                            步驟 3/8
                                            <svg
                                                    style="cursor: pointer;"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="13"
                                                    viewBox="0 0 14 13"
                                                    fill="none"
                                                    onclick="${gvc.event(() => {
                            close();
                            this.leaveGuide(vm);
                        })}"
                                            >
                                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                            class="d-flex flex-column w-100"
                                            style="white-space: normal;background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                                    >
                                        根據商品的特性決定運費要依照「材積」還是「重量」計算，靈活選擇每個商品的運費計算方式。
                                        <div class="d-flex align-items-center justify-content-between"
                                             style="margin-top: 24px;height:52px;">
                                            <div
                                                    style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                    onclick="${gvc.event(() => {
                            vm.step--;
                            close();
                            gvc.notifyDataChange('logisticsInit');
                        })}"
                                            >
                                                上一步
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center"
                                                 style="width: 96px;height: 46px;">
                                                <div
                                                        class="breathing-light"
                                                        style="padding: 6px 18px;border-radius: 10px;background: #FEAD20;;color: #FFF; ;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                        onclick="${gvc.event(() => {
                            next();
                        })}"
                                                >
                                                    下一步
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    case 4: {
                        return this.drawBGwithBelowWindow(BG, vm, '.guide4-4', 'logisticsInit', 4, 8, {
                            width: 332,
                            height: 209,
                            title: '填寫材積區間',
                            content: '填寫材積的運費計算區間',
                        });
                    }
                    case 5: {
                        this.detectClickThrough(this.findIframeDom('.guide4-5'), () => {
                            vm.step++;
                            setTimeout(() => {
                                gvc.notifyDataChange('logisticsInit');
                            }, 200);
                        });
                        return this.drawBGwithBelowWindow(BG, vm, '.guide4-5', 'logisticsInit', 5, 8, {
                            width: 332,
                            height: 209,
                            title: '新增計算區間',
                            next: true,
                            content: '點擊藍字即可新增一個計算區間',
                        });
                    }
                    case 6: {
                        let target = this.findPageIframe().contentWindow.document.querySelectorAll('.guide4-6');
                        target = target[target.length - 1];
                        this.detectClickThrough(target, () => {
                            vm.step++;
                            gvc.notifyDataChange('logisticsInit');
                        });
                        let content = html `
                            <div class="d-flex align-items-center" style="">
                                點擊
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"
                                     style="margin:0 6px;" fill="none">
                                    <path d="M1 1L13 13" stroke="#8D8D8D" stroke-linecap="round"/>
                                    <path d="M13 1L1 13" stroke="#8D8D8D" stroke-linecap="round"/>
                                </svg>
                                可以刪除計算區間
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.guide4-6', 'logisticsInit', 6, 8, {
                            width: 332,
                            height: 209,
                            title: '刪除計算區間',
                            content: content,
                            next: true,
                            dom: target
                        }, () => {
                            if (document.querySelector('.clickInterface')) {
                                document.querySelector('.clickInterface').remove();
                            }
                        });
                    }
                    case 7: {
                        let target = this.findIframeDom('.guide4-7');
                        let select = this.findIframeDom('.volumeSelect');
                        if (!select) {
                            this.detectClickThrough(target, () => {
                                gvc.notifyDataChange(`logisticsInit`);
                            });
                        }
                        return this.drawBGwithBelowWindow(BG, vm, '.guide4-7', 'logisticsInit', 7, 8, {
                            width: 350,
                            height: 217,
                            title: '設為預設計算方式',
                            content: '將「依材積計算」設為預設的運費計算方式，新增商品時將會自動代入',
                            disable: !select,
                        });
                    }
                    case 8: {
                        return this.drawFinBG(BG, vm, 'guide4-8', 'logisticsInit', 8, 'logistics_setting', { loading: true });
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow1`, 'logisticsInit', 8);
                    }
                }
            },
            divCreate: {},
        });
    }
    drawShipmentGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        let layer2Delay = true;
        return gvc.bindView({
            bind: 'shipInit',
            dataList: [],
            view: () => {
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`);
                gvc.addStyle(`                        
                    .breathing-light {
                        position:relative;
                        z-index: 1;
                        border: 1px solid rgba(255, 233, 178, 0.5);
                    }
                    .breathing-light::before {
                        content: '';
                        position: absolute;
                       top: -5px; /* 控制光效范围 */
                        left: -5px;
                        right: -5px;
                        bottom: -5px;
                        border: 5px solid #FFE9B2; /* 边框颜色 */
                        border-radius: inherit; /* 保持和容器一样的圆角 */
                        filter: blur(2px); /* 模糊程度 */
                        animation: breathing 1.5s infinite alternate; /* 呼吸灯效果 */
                    }
                    @keyframes breathing {
                        
                        0% {
                            opacity: 1;
                            transform: scale(1); /* 放大效果 */
                            box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                        }
                        100% {
                            opacity: 0.5;
                            transform: scale(1);
                            box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                        }
                    }
                `);
                switch (vm.step) {
                    case 2: {
                        if (layer2Delay) {
                            const timer = setInterval(() => {
                                layer2Delay = false;
                                clearInterval(timer);
                                gvc.notifyDataChange('shipInit');
                            }, 500);
                            return ``;
                        }
                        return this.drawSecondRowBG(BG, vm, `.guide3-2`, 'shipInit', '配送設定', 5);
                    }
                    case 3: {
                        const scrollEvent = this.disableScroll();
                        const that = this;
                        function close() {
                            BG.classList.remove(`guide3-3`);
                            that.enableScroll(scrollEvent);
                            that.findIframeDom('.innerGuide').remove();
                        }
                        function next() {
                            vm.step++;
                            close();
                            gvc.notifyDataChange('shipInit');
                        }
                        let iframeRect = iframe.getBoundingClientRect();
                        let target = this.findIframeDom('.guide3-3');
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom('.guide3-3')) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange('shipInit');
                                }
                            }, 500);
                        }
                        let rect = target.getBoundingClientRect();
                        let left = rect.left + iframeRect.left;
                        let top = rect.top + iframeRect.top;
                        let right = rect.right + iframeRect.left;
                        let bottom = rect.bottom + iframeRect.top;
                        gvc.addStyle(`
                            .guide3-3 {
                                ${this.holeBG(left, right, top, bottom)}
                            }
                        `);
                        BG.classList.add(`guide3-3`);
                        target.classList.add(`position-relative`);
                        const child_gvc = document.querySelector(`iframe`).contentWindow.glitter.pageConfig[0].gvc;
                        $(target).append(child_gvc.bindView({
                            bind: `guide3-3`,
                            view: () => {
                                return html `
                                        <div class="d-flex flex-column"
                                             style="width: 332px;height: 209px;flex-shrink: 0;position: absolute;left: calc(50% - 166px);bottom:calc(50% - 104px);filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.40));">
                                            <div class="w-100" style="border-radius: 10px;">
                                                <div
                                                        style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                                                >
                                                    配送方式
                                                    <div
                                                            class="d-flex ms-auto align-items-center"
                                                            style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;"
                                                    >
                                                        步驟 3/5
                                                        <svg
                                                                style="cursor: pointer;"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="14"
                                                                height="13"
                                                                viewBox="0 0 14 13"
                                                                fill="none"
                                                                onclick="${child_gvc.event(() => {
                                    close();
                                    this.leaveGuide(vm);
                                })}"
                                                        >
                                                            <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                            <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div
                                                        class="d-flex flex-column w-100"
                                                        style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                                                >
                                                    這裡可以設定配送方式
                                                    <div class="d-flex align-items-center justify-content-between"
                                                         style="margin-top: 24px;height:52px;">
                                                        <div
                                                                style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                                onclick="${child_gvc.event(() => {
                                    vm.step--;
                                    close();
                                    gvc.notifyDataChange('shipInit');
                                })}"
                                                        >
                                                            上一步
                                                        </div>
                                                        <div class="d-flex align-items-center justify-content-center"
                                                             style="width: 96px;height: 46px;">
                                                            <div
                                                                    class="breathing-light"
                                                                    style="   padding: 6px 18px;border-radius: 10px;background: #FEAD20;color: #FFF; ;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                                    onclick="${child_gvc.event(() => {
                                    next();
                                })}"
                                                            >
                                                                下一步
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                            },
                            divCreate: { class: `innerGuide` },
                        }));
                        return ``;
                    }
                    case 4: {
                        let that = this;
                        const scrollEvent = this.disableScroll();
                        function close() {
                            BG.classList.remove(`guide3-4`);
                            that.enableScroll(scrollEvent);
                            that.findIframeDom('.innerGuide').remove();
                        }
                        function next() {
                            vm.step++;
                            close();
                            gvc.notifyDataChange('shipInit');
                        }
                        let iframeRect = iframe.getBoundingClientRect();
                        let target = this.findIframeDom('.guide3-4');
                        target.scrollIntoView({});
                        let rect = target.getBoundingClientRect();
                        let left = rect.left + iframeRect.left;
                        let top = rect.top + iframeRect.top;
                        let right = rect.right + iframeRect.left;
                        let bottom = rect.bottom + iframeRect.top;
                        gvc.addStyle(`
                            .guide3-4 {
                                ${this.holeBG(left, right, top, bottom)}
                            }                       
                        `);
                        BG.classList.add(`guide3-4`);
                        target.classList.add(`position-relative`);
                        const child_gvc = document.querySelector(`iframe`).contentWindow.glitter.pageConfig[0].gvc;
                        $(target).append(child_gvc.bindView({
                            bind: `guide3-4`,
                            view: () => {
                                return html `
                                        <div
                                                class="d-flex flex-column"
                                                style="width: 332px;height: 209px;flex-shrink: 0;position: absolute;left: 50%;bottom:35px;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));transform: translate(-50%,0%);z-index: 1;"
                                        >
                                            <div class="w-100" style="padding-left: 155px;height:23px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18"
                                                     viewBox="0 0 22 18" fill="none">
                                                    <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z"
                                                          fill="#FEAD20"/>
                                                </svg>
                                            </div>
                                            <div class="w-100" style="border-radius: 10px;">
                                                <div
                                                        style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                                                >
                                                    填寫配送說明
                                                    <div
                                                            class="d-flex ms-auto align-items-center"
                                                            style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;"
                                                    >
                                                        步驟 4/5
                                                        <svg
                                                                style="cursor: pointer;"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="14"
                                                                height="13"
                                                                viewBox="0 0 14 13"
                                                                fill="none"
                                                                onclick="${child_gvc.event(() => {
                                    close();
                                    this.leaveGuide(vm);
                                })}"
                                                        >
                                                            <path d="M1 0.5L13 12.5" stroke="white"
                                                                  stroke-linecap="round"/>
                                                            <path d="M13 0.5L1 12.5" stroke="white"
                                                                  stroke-linecap="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div
                                                        class="d-flex flex-column w-100"
                                                        style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                                                >
                                                    填寫詳細配送說明，將會出現在結帳頁供顧客閱讀
                                                    <div class="d-flex align-items-center justify-content-between"
                                                         style="margin-top: 24px;height:52px;">
                                                        <div
                                                                style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                                onclick="${child_gvc.event(() => {
                                    vm.step--;
                                    close();
                                    that.findIframeDom('.guide3-3').parentElement.scrollIntoView({});
                                    gvc.notifyDataChange('shipInit');
                                })}"
                                                        >
                                                            上一步
                                                        </div>
                                                        <div class="d-flex align-items-center justify-content-center"
                                                             style="width: 96px;height: 46px;">
                                                            <div
                                                                    class="breathing-light"
                                                                    style="padding: 6px 18px;border-radius: 10px;background: #FEAD20;color: #FFF; ;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                                    onclick="${child_gvc.event(() => {
                                    next();
                                })}"
                                                            >
                                                                下一步
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                            },
                            divCreate: { class: `innerGuide` },
                        }));
                        return ``;
                    }
                    case 5: {
                        return this.drawFinBG(BG, vm, 'guide3-5', 'shipInit', 5, 'shippment_setting', { loading: true });
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow1`, 'shipInit', 5);
                    }
                }
            },
            divCreate: {},
        });
    }
    drawFinanceWayGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        let viewID = 'financeInit';
        let tempHTML = ``;
        let layer2Delay = true;
        return gvc.bindView({
            bind: viewID,
            dataList: [],
            view: () => {
                const that = this;
                const BG = document.querySelector(`.guide-BG`);
                gvc.addStyle(`                        
                    .breathing-light {
                        position:relative;
                        z-index: 1;
                        border: 1px solid rgba(255, 233, 178, 0.5);
                    }
                    .breathing-light::before {
                        content: '';
                        position: absolute;
                       top: -5px; /* 控制光效范围 */
                        left: -5px;
                        right: -5px;
                        bottom: -5px;
                        border: 5px solid #FFE9B2; /* 边框颜色 */
                        border-radius: inherit; /* 保持和容器一样的圆角 */
                        filter: blur(2px); /* 模糊程度 */
                        animation: breathing 1.5s infinite alternate; /* 呼吸灯效果 */
                    }
                    @keyframes breathing {
                        
                        0% {
                            opacity: 1;
                            transform: scale(1); /* 放大效果 */
                            box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                        }
                        100% {
                            opacity: 0.5;
                            transform: scale(1);
                            box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                        }
                    }
                `);
                switch (vm.step) {
                    case 2: {
                        if (layer2Delay) {
                            const timer = setInterval(() => {
                                layer2Delay = false;
                                clearInterval(timer);
                                gvc.notifyDataChange(viewID);
                            }, 500);
                            return ``;
                        }
                        return this.drawSecondRowBG(BG, vm, `.guide2-2`, 'financeInit', '金流設定', 6);
                    }
                    case 3: {
                        let target = this.findIframeDom(`.guide2-3`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide2-3`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(`financeInit`);
                                }
                            }, 400);
                        }
                        if (target.querySelector('input').checked) {
                            let body = document.querySelector('.editorContainer');
                            if (body && !document.querySelector('.clickInterface')) {
                                $(body).append(html `
                                    <div
                                            class="clickInterface"
                                            style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index: 1030;cursor: pointer;"
                                            onclick="${gvc.event(() => {
                                    if (document.querySelector('.breathing-light')) {
                                        document.querySelector('.breathing-light').click();
                                    }
                                })}"
                                    ></div>
                                `);
                            }
                        }
                        else {
                            this.detectClickThrough(target, () => {
                                target.querySelector('input').checked = true;
                                vm.step++;
                                gvc.notifyDataChange(`financeInit`);
                            });
                        }
                        return this.drawBGwithBelowWindow(BG, vm, '.guide2-3', 'financeInit', 3, 6, {
                            width: 332,
                            height: 199,
                            title: '付款方式',
                            content: '選擇ATM銀行轉帳',
                            next: true,
                        }, () => {
                            if (document.querySelector('.clickInterface')) {
                                document.querySelector('.clickInterface').remove();
                            }
                        });
                    }
                    case 4: {
                        let targetSelector = '.guide2-4';
                        let target = this.findIframeDom(targetSelector);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(targetSelector)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        if (target.querySelector('.open-box')) {
                            target.click();
                            let timer2 = setInterval(() => {
                                clearInterval(timer2);
                                gvc.notifyDataChange(viewID);
                            }, 500);
                            return ``;
                        }
                        this.detectClickThrough(target, () => {
                            BG.classList.remove('guide2-4');
                            vm.step = 5;
                            gvc.notifyDataChange(`financeInit`);
                        });
                        target.parentElement.parentElement.scrollIntoView();
                        let content = html `
                            <div class="d-flex align-items-center">
                                點擊
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="8" viewBox="0 0 13 8"
                                     fill="none" style="margin: 0 6px;">
                                    <path d="M12 1.5L6.5 6.5L1 1.5" stroke="#393939" stroke-width="2"
                                          stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                展開，填寫付款資訊
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, targetSelector, viewID, 4, 6, {
                            width: 332,
                            height: 199,
                            title: '付款方式',
                            content: content,
                            next: true,
                        });
                    }
                    case 5: {
                        function close() {
                            let target = that.findIframeDom('.guide2-5');
                            BG.classList.remove(`guide2-5`);
                            target.classList.remove(`position-relative`);
                            let element = that.findIframeDom('.innerGuide');
                            element.remove();
                        }
                        setTimeout(() => {
                            let target = this.findIframeDom('.guide2-5');
                            target.parentElement.parentElement.scrollIntoView();
                            let iframe = this.findPageIframe();
                            let iframeRect = iframe.getBoundingClientRect();
                            let rect = target.getBoundingClientRect();
                            let left = rect.left + iframeRect.left - 24;
                            let top = iframeRect.top + 4;
                            let right = rect.right + iframeRect.left + 24;
                            let bottom = iframeRect.bottom - 230;
                            const scrollEvent = this.disableScroll();
                            BG.classList.add('guide2-5');
                            target.classList.add(`position-relative`);
                            const child_gvc = iframe.contentWindow.glitter.pageConfig[0].gvc;
                            gvc.addStyle(`
                                .guide2-5 {
                                    ${this.holeBG(left, right, top, bottom)}
                                    .breathing-light {
                                    position:relative;
                                    z-index: 1;
                                    border: 1px solid rgba(255, 233, 178, 0.5);
                                }
                                
                            `);
                            child_gvc.addStyle(`
                                .breathing-light {
                                    position:relative;
                                    z-index: 1;
                                    border: 1px solid rgba(255, 233, 178, 0.5);
                                }
                                .breathing-light::before {
                                    content: '';
                                    position: absolute;
                                    top: -5px; /* 控制光效范围 */
                                    left: -5px;
                                    right: -5px;
                                    bottom: -5px;
                                    border: 5px solid #FFE9B2; /* 边框颜色 */
                                    border-radius: inherit; /* 保持和容器一样的圆角 */
                                    filter: blur(2px); /* 模糊程度 */
                                    animation: breathing 1s infinite alternate; /* 呼吸灯效果 */
                                }
                                @keyframes breathing {
                                    
                                    0% {
                                        opacity: 1;
                                        transform: scale(1); /* 放大效果 */
                                        box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                                    }
                                    100% {
                                        opacity: 0.5;
                                        transform: scale(1);
                                        box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                                    }
                                }
                                }
                            `);
                            $(target).append(child_gvc.bindView({
                                bind: `guide2-5`,
                                view: () => {
                                    let inputGroup = target.querySelectorAll('input');
                                    let allCheck = true;
                                    inputGroup.forEach((el) => {
                                        if (el.value.length == 0) {
                                            allCheck = false;
                                            this.detectOninputThrough(el, () => {
                                                child_gvc.notifyDataChange(`guide2-5`);
                                            });
                                        }
                                    });
                                    return html `
                                            <div class="d-flex  "
                                                 style="width: 457px;height: 191px;flex-shrink: 0;position: absolute;right: 2px;top:245px;z-index:1;">
                                                <div class="h-100 d-flex align-items-center justify-content-center"
                                                     style="width: 24px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22"
                                                         viewBox="0 0 18 22" fill="none">
                                                        <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z"
                                                              fill="white"/>
                                                    </svg>
                                                </div>

                                                <div class="flex-fill "
                                                     style="border-radius: 10px;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));">
                                                    <div
                                                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                                                    >
                                                        填寫付款資訊
                                                        <div
                                                                class="d-flex ms-auto align-items-center"
                                                                style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;"
                                                        >
                                                            步驟 5/6
                                                            <svg
                                                                    style="cursor: pointer;"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="14"
                                                                    height="13"
                                                                    viewBox="0 0 14 13"
                                                                    fill="none"
                                                                    onclick="${child_gvc.event(() => {
                                        close();
                                        this.enableScroll(scrollEvent);
                                        this.leaveGuide(vm);
                                    })}"
                                                            >
                                                                <path d="M1 0.5L13 12.5" stroke="white"
                                                                      stroke-linecap="round"/>
                                                                <path d="M13 0.5L1 12.5" stroke="white"
                                                                      stroke-linecap="round"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div
                                                            class="d-flex flex-column w-100 "
                                                            style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                                                    >
                                                        填寫銀行資訊及付款說明
                                                        <div class="d-flex align-items-center justify-content-between"
                                                             style="margin-top: 24px;height:52px;">
                                                            <div
                                                                    style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                                    onclick="${child_gvc.event(() => {
                                        let iframe = this.findPageIframe();
                                        const openGroup = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow.document.querySelectorAll('.openIt');
                                        openGroup.forEach((el) => {
                                            el.classList.toggle('openIt');
                                        });
                                        this.enableScroll(scrollEvent);
                                        close();
                                        setTimeout(() => {
                                            this.findIframeDom('.guide2-4').scrollIntoView({});
                                            vm.step = 4;
                                            gvc.notifyDataChange('financeInit');
                                        }, 600);
                                    })}"
                                                            >
                                                                上一步
                                                            </div>
                                                            ${allCheck
                                        ? html `
                                                                        <div class="d-flex align-items-center justify-content-center"
                                                                             style="width: 96px;height: 46px;">
                                                                            <div
                                                                                    class="breathing-light"
                                                                                    style="padding: 6px 18px;border-radius: 10px;background: #FEAD20;color: #FFF;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                                                    onclick="${child_gvc.event(() => {
                                            vm.step++;
                                            this.enableScroll(scrollEvent);
                                            close();
                                            gvc.notifyDataChange('financeInit');
                                        })}"
                                                                            >
                                                                                下一步
                                                                            </div>
                                                                        </div>
                                                                    `
                                        : html `
                                                                        <div class="d-flex align-items-center justify-content-center"
                                                                             style="width: 96px;height: 46px;">
                                                                            <div
                                                                                    class="breathing-light"
                                                                                    style="opacity: 0.8;padding: 6px 18px;border-radius: 10px;background: #FFE9B2;color: #FFF;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;"
                                                                            >
                                                                                下一步
                                                                            </div>
                                                                        </div>
                                                                    `}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                },
                                divCreate: { class: `innerGuide` },
                            }));
                        }, 400);
                        return ``;
                    }
                    case 6: {
                        return this.drawFinBG(BG, vm, 'guide2-6', 'financeInit', 6, 'setFinanceWay', { loading: true });
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow1`, 'financeInit', 6);
                    }
                }
            },
            divCreate: {},
        });
    }
    drawInitGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
            progress: [],
        };
        return gvc.bindView({
            bind: 'init',
            dataList: [{ key: 'step', obj: vm }],
            view: () => {
                if (vm.progress.length == 0) {
                    ApiShop.getGuide().then((r) => {
                        vm.progress = r.response.value;
                        if (vm.progress.length == 0) {
                            vm.progress = [
                                {
                                    title: '金流設定',
                                    value: 'setFinanceWay',
                                    finished: false,
                                },
                                {
                                    title: '配送設定',
                                    value: 'shippment_setting',
                                    finished: false,
                                },
                                {
                                    title: '運費設定',
                                    value: 'logistics_setting',
                                    finished: false,
                                },
                                {
                                    title: '商品上架',
                                    value: 'product-manager',
                                    finished: false,
                                },
                                {
                                    title: '商店訊息',
                                    value: 'shop_information',
                                    finished: false,
                                },
                            ];
                            ApiShop.setGuide(vm.progress).then((r) => {
                            });
                        }
                        gvc.notifyDataChange('init');
                    });
                }
                let count = vm.progress.filter((data) => {
                    return data.finished;
                }).length;
                gvc.addStyle(`
                    .g-container {
                        position: relative;
                        margin: auto;
                        width: 124px;
                        height: 124px;
                    }
                    .g-progress {
                        position: relative;
                        margin: auto;
                        width: 124px;
                        height: 124px;
                        border-radius: 50%;
                        background: conic-gradient(#FEAD20 0, #FEAD20 ${(count / vm.progress.length) * 100}%, #EAEAEA ${(count / vm.progress.length) * 100}%, #EAEAEA);
                        mask: radial-gradient(transparent, transparent 48px, #000 48.5px, #000 0);
                    }
                    .g-circle {
                        position: absolute;
                        top: 0;
                        left: 0;
                        &::before,
                        &::after {
                        content: "";
                        position: absolute;
                        top: 55px;
                        left: 55px;
                        width: 14px;
                        height: 14px;
                        border-radius: 50%;
                        background: #FEAD20;
                        z-index: 1;
                    }

                    &::before {
                        ${count == 0 ? `background:#EAEAEA` : ``};
                        transform: translate(0, -55px);
                        
                    }

                    &::after {
                         ${count == 0 ? `background:#EAEAEA` : ``};
                        transform: rotate(${(count / vm.progress.length) * 360}deg) translate(0, -55px) ;                      
                    }
                    }
                `);
                switch (vm.step) {
                    case -1: {
                        const target = document.querySelector(`.indexGuideBTN`);
                        const BG = document.querySelector(`.guide-BG`);
                        const rect = target.getBoundingClientRect();
                        gvc.addStyle(`
                            .leave-guide-BG {
                                clip-path: polygon(0 0, ${rect.left}px 0, ${rect.left}px ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px 0, 100% 0, 100% 100%, 0 100%);

                            }
                        `);
                        BG.classList.add('leave-guide-BG');
                        return html `
                            <div
                                    class=""
                                    style="width: 317px;height: 157px;position:absolute;top:${rect.bottom + window.scrollY + 12 + 'px'};left : ${rect.left +
                            window.scrollX +
                            'px'};gap:20px;padding-top: 22px;"
                            >
                                <div class="" style="position: absolute;top: 0;left: 20px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18"
                                         fill="none">
                                        <path d="M11 0L21.3923 18H0.607696L11 0Z" fill="#FEAD20"/>
                                    </svg>
                                </div>
                                <div
                                        style="display: flex;width: 317px;padding: 24px 32px;;flex-direction: column;justify-content: center;align-items: center;gap: 24px;border-radius: 10px;background: #FEAD20;"
                                >
                                    <div style="color: #FFF;font-size: 24px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.96px;">
                                        這裡可以回顧開店導覽
                                    </div>
                                    <div
                                            class="border border-danger"
                                            style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                            onclick="${gvc.event(() => {
                            document.querySelector(`.guide-BG`).remove();
                            ApiShop.setGuideable({});
                        })}"
                                    >
                                        我知道了
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    case 1: {
                        return html `
                            <div style="width: 461px;height:210px;display: flex;flex-direction: column;align-items:center;border-radius: 10px;background: #FEAD20;">
                                <div class="w-100 d-flex align-items-center justify-content-end" style="padding: 16px;">
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="13"
                                            viewBox="0 0 14 13"
                                            fill="none"
                                            style="cursor: pointer;"
                                            onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                        })}"
                                    >
                                        <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                        <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <div style="color: #FFF;font-size: 24px;font-weight: 700;letter-spacing: 0.96px;margin-top:12px;">
                                    商店創建成功！
                                </div>
                                <div style="color: #FFF;font-size: 16px;font-style: normal;font-weight: 500;line-height: 160%;letter-spacing: 0.64px;margin-top:6px;">
                                    跟著導覽教學，開張您的商店
                                </div>
                                <div style="width:100%;margin-top: 24px;display: flex;align-items: center;justify-content: space-between;padding: 0 32px;">
                                    <div
                                            class="d-flex align-items-end"
                                            style="cursor:pointer;;height:100%;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;text-decoration-line: underline;"
                                            onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                        })}"
                                    >
                                        我已經學會了
                                    </div>
                                    <div
                                            style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-weight: 700;line-height: normal;cursor:pointer;"
                                            onclick="${gvc.event(() => {
                            vm.step++;
                        })}"
                                    >
                                        開店導覽
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    case 0: {
                        return html `
                            <div class="d-flex flex-column"
                                 style="width:588px;border-radius: 10px;background-color: white;">
                                <div
                                        class="d-flex w-100 align-items-center"
                                        style="height: 51px;padding: 12px 24px;background: #FEAD20;color: #FFF;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;border-radius: 10px 10px 0 0;"
                                >
                                    開店導覽
                                    <svg
                                            class="ms-auto"
                                            style="cursor: pointer;"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                        })}"
                                    >
                                        <path d="M1 1L13 13" stroke="white" stroke-linecap="round"/>
                                        <path d="M13 1L1 13" stroke="white" stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <div class=" d-flex flex-column align-items-center justify-content-center"
                                     style="width: 100%;padding:24px;gap:24px;">
                                    <div class="g-container position-relative " style="">
                                        <div class="g-progress"></div>
                                        <div class="g-circle"></div>
                                        <div
                                                style="font-size: 25.92px;font-style: normal;font-weight: 700;line-height: normal;color:#393939;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%)"
                                        >
                                            ${vm.progress.filter((data) => {
                            return data.finished;
                        }).length}/${vm.progress.length}
                                        </div>
                                    </div>
                                    <div class="d-flex flex-column justify-content-start" style="gap:16px;">
                                        <div style="font-size: 18px;font-style: normal;font-weight: 700;line-height: normal;">
                                            完成以下設定，即可開張您的商店
                                        </div>
                                        ${gvc.bindView({
                            bind: 'guideDirect',
                            view: () => {
                                let dialog = new ShareDialog(gvc.glitter);
                                if (vm.progress.length == 0) {
                                    dialog.dataLoading({ visible: true });
                                }
                                else {
                                    dialog.dataLoading({ visible: false });
                                }
                                setTimeout(() => {
                                }, 300);
                                return vm.progress
                                    .map((data, index) => {
                                    return html `
                                                                <div
                                                                        style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;cursor: pointer; position: relative; ${data.finished
                                        ? 'border: 2px solid #393939;color:#393939;'
                                        : 'color:#8D8D8D;'}"
                                                                        onclick="${gvc.event(() => {
                                        this.guide = index + 1;
                                        this.drawBG();
                                    })}"
                                                                >
                                                                    <svg
                                                                            style="position: absolute;right: -12px;top: -12px;${data.finished ? '' : 'display:none'}"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="25"
                                                                            height="25"
                                                                            viewBox="0 0 25 25"
                                                                            fill="none"
                                                                    >
                                                                        <rect x="1" y="1" width="23" height="23"
                                                                              rx="11.5" fill="#FEAD20"/>
                                                                        <rect x="1" y="1" width="23" height="23"
                                                                              rx="11.5" stroke="#393939"
                                                                              stroke-width="2"/>
                                                                        <path d="M9 13.5L11.5 16L16 10" stroke="#393939"
                                                                              stroke-width="2" stroke-linecap="round"
                                                                              stroke-linejoin="round"/>
                                                                    </svg>
                                                                    ${data.title}
                                                                </div>
                                                            `;
                                })
                                    .join('');
                            },
                            divCreate: {
                                class: `d-flex w-100 align-items-center`,
                                style: `gap:10px;color:#8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;`,
                            },
                        })}
                                        <div style="width: 100%;height: 1px;background-color: #DDD"></div>
                                        ${gvc.bindView({
                            bind: `otherGuide`,
                            view: () => {
                                let dataList = [
                                    {
                                        title: `佈置官網`,
                                        des: `自定義樣式，打造獨一無二的官網`,
                                        url: ``,
                                        guide: 6,
                                    },
                                    {
                                        title: `管理主題庫`,
                                        des: `可根據需求新增及切換官網主題`,
                                        url: ``,
                                        guide: 7,
                                    },
                                ];
                                return html `
                                                    <div style="font-size: 18px;font-style: normal;font-weight: 700;line-height: normal;">
                                                        其他導覽
                                                    </div>
                                                    ${dataList
                                    .map((data) => {
                                    return html `
                                                                    <div class="w-100"
                                                                         style="display: flex;align-items: center;gap: 24px;">
                                                                        <div
                                                                                class="d-flex flex-column"
                                                                                style="gap:2px;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;color:#393939"
                                                                        >
                                                                            ${data.title}
                                                                            <div class=""
                                                                                 style="font-size: 14px;font-style: normal;font-weight: 400;line-height: normal;color:#8D8D8D">
                                                                                ${data.des}
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                                class="ms-auto"
                                                                                style="color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;padding: 6px 18px;border-radius: 10px;border: 1px solid #FEAD20;background: #FFF;cursor: pointer;"
                                                                                onclick="${gvc.event(() => {
                                        this.guide = data.guide;
                                        this.drawBG();
                                    })}"
                                                                        >
                                                                            前往
                                                                        </div>
                                                                    </div>
                                                                `;
                                })
                                    .join('')}
                                                `;
                            },
                            divCreate: { style: `display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-self: stretch;` },
                        })}
                                        <div style="width: 100%;height: 1px;background-color: #DDD"></div>
                                        <div style="color: #4D86DB;text-align: right;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;text-decoration-line: underline;">
                                            更多教學文章
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
                return html `
                    <div style="width: 461px;height:210px;display: flex;flex-direction: column;align-items:center;border-radius: 10px;background: #FEAD20;position: relative">
                        <div class="w-100 d-flex align-items-center justify-content-end" style="padding: 16px;">
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="13"
                                    viewBox="0 0 14 13"
                                    fill="none"
                                    style="cursor: pointer;"
                                    onclick="${gvc.event(() => {
                    this.leaveGuide(vm);
                })}"
                            >
                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div style="color: #FFF;font-size: 24px;font-weight: 700;letter-spacing: 0.96px;">
                            商店創建成功！
                        </div>
                        <div style="color: #FFF;font-size: 16px;font-style: normal;font-weight: 500;line-height: 160%;letter-spacing: 0.64px;margin-top:6px;">
                            跟著導覽教學，開張您的商店
                        </div>
                        <div style="width:100%;margin-top: 24px;display: flex;align-items: center;justify-content: space-between;padding: 0 32px;">
                            <div
                                    class="d-flex align-items-end"
                                    style="height:100%;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;text-decoration-line: underline;cursor: pointer;"
                            >
                                我已經學會了
                            </div>
                            <div
                                    style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-weight: 700;line-height: normal;cursor: pointer;"
                            >
                                開店導覽
                            </div>
                        </div>
                    </div>
                `;
            },
            divCreate: {},
        });
    }
    drawUIGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
            viewID: 'UIGuide'
        };
        const that = this;
        const totalStep = 13;
        const viewID = 'UIGuide';
        const BG = document.querySelector(`.guide-BG`);
        let dataList = [];
        return gvc.bindView({
            bind: viewID,
            view: () => {
                switch (vm.step) {
                    case -1: {
                        const target = document.querySelector(`.indexGuideBTN`);
                        const BG = document.querySelector(`.guide-BG`);
                        const rect = target.getBoundingClientRect();
                        gvc.addStyle(`
                            .leave-guide-BG {
                                clip-path: polygon(0 0, ${rect.left}px 0, ${rect.left}px ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px 0, 100% 0, 100% 100%, 0 100%);
                            }
                        `);
                        BG.classList.add('leave-guide-BG');
                        return html `
                            <div
                                    class=""
                                    style="width: 317px;height: 157px;position:absolute;top:${rect.bottom + window.scrollY + 12 + 'px'};left : ${rect.left +
                            window.scrollX +
                            'px'};gap:20px;padding-top: 22px;"
                            >
                                <div class="" style="position: absolute;top: 0;left: 20px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18"
                                         fill="none">
                                        <path d="M11 0L21.3923 18H0.607696L11 0Z" fill="#FEAD20"/>
                                    </svg>
                                </div>
                                <div
                                        style="display: flex;width: 317px;padding: 24px 32px;;flex-direction: column;justify-content: center;align-items: center;gap: 24px;border-radius: 10px;background: #FEAD20;"
                                >
                                    <div style="color: #FFF;font-size: 24px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.96px;">
                                        這裡可以回顧新手導覽
                                    </div>
                                    <div
                                            class="border border-danger"
                                            style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                            onclick="${gvc.event(() => {
                            document.querySelector(`.guide-BG`).remove();
                            ApiShop.setGuideable({});
                        })}"
                                    >
                                        我知道了
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    case 1: {
                        if (dataList.length == 0) {
                            ApiShop.getEditorGuide().then(r => {
                                if (r.result) {
                                    if (r.response.value.length > 0) {
                                        dataList = r.response.value;
                                    }
                                    else {
                                        dataList = [
                                            {
                                                title: "頁面編輯",
                                                icon: "fa-duotone fa-window fs-5 fw-bold   p-2 rounded",
                                                content: "彈性的編輯，打造獨一無二的官網",
                                                finish: false
                                            },
                                            {
                                                title: "全站樣式",
                                                icon: "fa-sharp fa-regular fa-globe fs-5 fw-bold   p-2 rounded",
                                                content: "統一管理全站的樣式設置，確保官網的一致",
                                                finish: false
                                            },
                                            {
                                                title: "設計元件",
                                                icon: "fa-regular fa-grid-2 fs-5 fw-bold p-2 rounded",
                                                content: "統一設置全站部分元件的預設樣式",
                                                finish: false
                                            },
                                        ];
                                        ApiShop.setEditorGuide(dataList);
                                    }
                                    gvc.notifyDataChange(viewID);
                                }
                                return html `修改中`;
                            });
                        }
                        return html `
                            <div style="padding-left: 18px;width: 473px;height: 354px;flex-shrink: 0;z-index:1033;">
                                <div style="position: relative;border-radius: 10px;">
                                    <div style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;">
                                        新手教學
                                        <div class="d-flex ms-auto align-items-center"
                                             style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                            <svg
                                                    style="cursor: pointer;"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="13"
                                                    viewBox="0 0 14 13"
                                                    fill="none"
                                                    onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                            gvc.notifyDataChange(viewID);
                        })}"
                                            >
                                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;">
                                        <div class="d-flex flex-column" style="gap: 24px">
                                            ${dataList.map((data, index) => {
                            let checkPass = index == 0 || (index != 0 && dataList[index - 1].finish);
                            return html `
                                                    <div class="d-flex" style="gap:24px;">
                                                        <div class="flex-fill d-flex flex-column" style="gap:4px;">
                                                            <div class="d-flex align-items-center"
                                                                 style="font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;color:#393939">
                                                                <span class="${data.icon}"
                                                                      style="cursor:pointer;background:linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);;color:white;margin-right: 6px;"></span>
                                                                ${data.title}
                                                            </div>
                                                            <div class="d-flex"
                                                                 style="color: #8D8D8D;font-size: 14px;font-style: normal;font-weight: 400;line-height: normal;">
                                                                ${data.content}
                                                            </div>
                                                        </div>
                                                        <div class="ms-auto d-flex align-items-center justify-content-center">
                                                            <div style="${checkPass ? 'background: #FEAD20;border: 1px solid #FEAD20;cursor: pointer;' : 'background: #FFE9B2'};color:white;display: flex;padding: 6px 18px;justify-content: center;align-items: center;gap: 8px;border-radius: 10px;font-weight: 700;"
                                                                 onclick="${gvc.event(() => {
                                if (checkPass) {
                                    this.guide = index + 1;
                                    this.step = 1;
                                    this.drawBG();
                                }
                            })}"
                                                            >
                                                                前往
                                                            </div>
                                                        </div>
                                                    </div>
                                                `;
                        }).join('')}
                                            <div class="w-100" style="height: 1px;background-color: #DDD"></div>
                                            <div class="w-100 d-flex justify-content-end">
                                                <a style="color: #4D86DB;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;text-decoration-line: underline;">更多教學文章</a>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    default: {
                        return html `
                            <div style="width: 461px;height:210px;display: flex;flex-direction: column;align-items:center;border-radius: 10px;background: #FEAD20;">
                                <div class="w-100 d-flex align-items-center justify-content-end" style="padding: 16px;">
                                    <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="13"
                                            viewBox="0 0 14 13"
                                            fill="none"
                                            style="cursor: pointer;"
                                            onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                            gvc.notifyDataChange(viewID);
                        })}"
                                    >
                                        <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                        <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <div style="color: #FFF;font-size: 24px;font-weight: 700;letter-spacing: 0.96px;margin-top:12px;">
                                    歡迎來到SHOPNEX商店佈景編輯器
                                </div>
                                <div style="color: #FFF;font-size: 16px;font-style: normal;font-weight: 500;line-height: 160%;letter-spacing: 0.64px;margin-top:6px;">
                                    助您打造獨一無二的官網，建立及提升品牌形象
                                </div>
                                <div style="width:100%;margin-top: 24px;display: flex;align-items: center;justify-content: space-between;padding: 0 32px;">
                                    <div
                                            class="d-flex align-items-end"
                                            style="cursor:pointer;;height:100%;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;text-decoration-line: underline;"
                                            onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                            gvc.notifyDataChange(viewID);
                        })}"
                                    >
                                        我已經學會了
                                    </div>
                                    <div
                                            style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-weight: 700;line-height: normal;cursor:pointer;"
                                            onclick="${gvc.event(() => {
                            vm.step++;
                            document.querySelector('.guide-user-editor-1-icon').click();
                            setTimeout(() => {
                                gvc.notifyDataChange(viewID);
                            }, 300);
                        })}"
                                    >
                                        新手教學
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
            },
            divCreate: {},
        });
    }
    drawEditorGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
            viewID: 'UIGuide'
        };
        const that = this;
        const totalStep = 13;
        const viewID = 'UIGuide';
        const BG = document.querySelector(`.guide-BG`);
        return gvc.bindView({
            bind: viewID,
            view: () => {
                switch (vm.step) {
                    case 1: {
                        function close() {
                            BG.classList.remove("guide-user-1");
                            if (document.querySelector('.clickInterface')) {
                                document.querySelector('.clickInterface').remove();
                            }
                            gvc.notifyDataChange(viewID);
                        }
                        BG.classList.add('guide-user-1');
                        let body = document.querySelector('.editorContainer');
                        if (body && !document.querySelector('.clickInterface')) {
                            $(body).append(html `
                                <div class="clickInterface"
                                     style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index: 1030;cursor: pointer;"
                                     onclick="${gvc.event(() => {
                            })}"></div>
                            `);
                        }
                        function digBG(x1, x2, x3, y1, y2, y3) {
                            gvc.addStyle(`
                                .guide-user-1{
                                    clip-path: polygon(0 0, ${x1}px ${y1}px , ${x3}px ${y1}px, ${x3}px ${y3}px, ${x2}px ${y3}px, ${x2}px ${y2}px, ${x1}px ${y2}px, 0 100%, 100% 100%, 100% 0);
                                }
                            `);
                        }
                        const target = document.querySelector('.guide-user-editor-1');
                        const rect = target.getBoundingClientRect();
                        let x1 = 0;
                        let x2 = target.children[0].getBoundingClientRect().right;
                        let x3 = rect.right;
                        let y1 = rect.top;
                        let y2 = target.children[0].children[0].getBoundingClientRect().bottom + 15;
                        let y3 = target.children[1].children[0].getBoundingClientRect().bottom;
                        digBG(x1, x2, x3, y1, y2, y3);
                        gvc.addStyle(`
                                .breathing-light {
                                    position:relative;
                                    z-index: 1;
                                    border: 1px solid rgba(255, 233, 178, 0.5);
                                }
                                .breathing-light::before {
                                    content: '';
                                    position: absolute;
                                   top: -5px; /* 控制光效范围 */
                                    left: -5px;
                                    right: -5px;
                                    bottom: -5px;
                                    border: 5px solid #FFE9B2; /* 边框颜色 */
                                    border-radius: inherit; /* 保持和容器一样的圆角 */
                                    filter: blur(2px); /* 模糊程度 */
                                    animation: breathing 1s infinite alternate; /* 呼吸灯效果 */
                                }
                                @keyframes breathing {
                                    
                                    0% {
                                        opacity: 1;
                                        transform: scale(1); /* 放大效果 */
                                        box-shadow: 0 0 4px 6px rgba(255, 233, 178, 0.8);
                                    }
                                    100% {
                                        opacity: 0.5;
                                        transform: scale(1);
                                        box-shadow: 0 0 4px rgba(255, 233, 178, 0.5);
                                    }
                                }
                                }
                            `);
                        const icon = html `
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none">
                                <path
                                        d="M0 4.5C0 2.84531 1.34531 1.5 3 1.5H21C22.6547 1.5 24 2.84531 24 4.5V7.5V9.75V10.5V19.5C24 21.1547 22.6547 22.5 21 22.5H3C1.34531 22.5 0 21.1547 0 19.5V10.5V9.75V7.5V4.5ZM21.75 10.5H2.25V19.5C2.25 19.9125 2.5875 20.25 3 20.25H21C21.4125 20.25 21.75 19.9125 21.75 19.5V10.5ZM4.5 7.5C4.89782 7.5 5.27936 7.34196 5.56066 7.06066C5.84196 6.77936 6 6.39782 6 6C6 5.60218 5.84196 5.22064 5.56066 4.93934C5.27936 4.65804 4.89782 4.5 4.5 4.5C4.10218 4.5 3.72064 4.65804 3.43934 4.93934C3.15804 5.22064 3 5.60218 3 6C3 6.39782 3.15804 6.77936 3.43934 7.06066C3.72064 7.34196 4.10218 7.5 4.5 7.5ZM10.5 6C10.5 5.60218 10.342 5.22064 10.0607 4.93934C9.77936 4.65804 9.39782 4.5 9 4.5C8.60218 4.5 8.22064 4.65804 7.93934 4.93934C7.65804 5.22064 7.5 5.60218 7.5 6C7.5 6.39782 7.65804 6.77936 7.93934 7.06066C8.22064 7.34196 8.60218 7.5 9 7.5C9.39782 7.5 9.77936 7.34196 10.0607 7.06066C10.342 6.77936 10.5 6.39782 10.5 6ZM13.5 7.5C13.8978 7.5 14.2794 7.34196 14.5607 7.06066C14.842 6.77936 15 6.39782 15 6C15 5.60218 14.842 5.22064 14.5607 4.93934C14.2794 4.65804 13.8978 4.5 13.5 4.5C13.1022 4.5 12.7206 4.65804 12.4393 4.93934C12.158 5.22064 12 5.60218 12 6C12 6.39782 12.158 6.77936 12.4393 7.06066C12.7206 7.34196 13.1022 7.5 13.5 7.5Z"
                                        fill="white"
                                />
                            </svg>
                        `;
                        return html `
                            <div
                                    style="padding-left: 18px;width: 457px;height: 217px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${y1 +
                            12}px;left: ${x3 + 12}px;z-index:1033;"
                            >
                                <div style="position: relative;border-radius: 10px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22"
                                         fill="none" style="position: absolute;top: 52.5px;left: -18px;">
                                        <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z"
                                              fill="white"/>
                                    </svg>
                                    <div
                                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                                    >
                                        「頁面編輯」
                                        <div
                                                class="d-flex ms-auto align-items-center"
                                                style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;"
                                        >
                                            步驟 1/${totalStep}
                                            <svg
                                                    style="cursor: pointer;"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="13"
                                                    viewBox="0 0 14 13"
                                                    fill="none"
                                                    onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                            gvc.notifyDataChange(viewID);
                        })}"
                                            >
                                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                            style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                                    >
                                        <div class="d-flex">
                                            於<span style="font-weight: 700;">「頁面編輯」</span
                                        ><span
                                                style="display: flex;width: 24px;height: 24px;padding: 5.143px;justify-content: center;align-items: center;border-radius: 4px;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);"
                                        >
                                                ${icon}
                                            </span>
                                            頁面，您可以自由地變更版面的
                                        </div>
                                        設計，靈活修改每個元件，設計出獨一無二的網頁。
                                        <div class="d-flex align-items-center justify-content-between w-100"
                                             style="margin-top: 24px;height:52px;">
                                            <div
                                                    class="d-none"
                                                    style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                    onclick="${gvc.event(() => {
                            vm.step--;
                            close();
                        })}"
                                            >
                                                上一步
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center ms-auto"
                                                 style="width: 96px;height: 46px;">
                                                <div
                                                        class="breathing-light"
                                                        style="background: #FEAD20;cursor: pointer;padding: 6px 18px;border-radius: 10px;color: #FFF; ;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;"
                                                        onclick="${gvc.event(() => {
                            vm.step++;
                            close();
                        })}"
                                                >
                                                    下一步
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    case 2: {
                        const target = document.querySelector('.guide-user-editor-1');
                        const context = html `
                            <div class="d-flex flex-column" style="">
                                <div style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                    滑鼠移至各元件可以進行<span style="font-weight: 700;">「刪除」「隱藏」</span>及<span
                                        style="font-weight: 700;">「更改順序」</span>三個動作。
                                </div>
                                <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_s2scscs2sesas7sd_guide.gif"
                                     alt="guide gif">
                            </div>
                        `;
                        return this.drawBGwithRightWindow(BG, vm, target.children[1].children[0], '.guide-user-editor-2', viewID, vm.step, totalStep, {
                            width: 457,
                            height: 467,
                            title: '元件基本操作',
                            content: context,
                            alignment: 'right',
                            cover: true,
                        });
                    }
                    case 3: {
                        const className = 'addNewComponent';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        let target = document.querySelectorAll(`.${className}`);
                        if (target) {
                            target = target[target.length - 1];
                            this.detectClickThrough(target, () => {
                                vm.step++;
                                BG.classList.remove(className);
                                setTimeout(() => {
                                    gvc.notifyDataChange(viewID);
                                }, 500);
                            });
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 181,
                                title: '新增區段',
                                content: `新增一個區段`,
                                alignment: 'right2',
                                next: true
                            });
                        }
                        return ``;
                    }
                    case 4: {
                        const className = 'simpleAddGuide';
                        if (document.querySelector(`#addComponentViewHover`).classList.contains("d-none")) {
                            const timer = setInterval(() => {
                                if (!document.querySelector(`#addComponentViewHover`).classList.contains("d-none")) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        BG.style.zIndex = "999999";
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            this.detectClickThrough(target.querySelector('button'), () => {
                                vm.step++;
                                BG.classList.remove(`${className}-BG`);
                                setTimeout(() => {
                                    gvc.notifyDataChange(viewID);
                                }, 500);
                            });
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 349,
                                height: 181,
                                title: '新增區段',
                                content: `新增一個區段`,
                                alignment: 'right2',
                                next: true,
                                previewEvent: () => {
                                    let previewBTN = document.querySelector(`.offcanvas-title`).nextElementSibling.nextElementSibling;
                                    previewBTN.click();
                                }
                            });
                        }
                        return ``;
                    }
                    case 5: {
                        const className = 'subComponentGuide';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            this.detectClickThrough(target, () => {
                                vm.step++;
                                BG.classList.remove(`${className}-BG`);
                                setTimeout(() => {
                                    gvc.notifyDataChange(viewID);
                                }, 700);
                            });
                            let content = html `
                                <div class="d-flex">
                                    點擊<span>標題</span>
                                </div>
                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 121,
                                title: '點擊標題',
                                content: content,
                                alignment: 'right2',
                                next: true,
                                preview: true
                            });
                        }
                        return ``;
                    }
                    case 6: {
                        const className = 'guide-user-editor-7';
                        if (!document.querySelector(`.${className}:not(.d-none)`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}:not(.d-none)`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        const target = document.querySelector(`.${className}:not(.d-none)`);
                        if (target) {
                            const context = html `
                                <div class="d-flex flex-column" style="">
                                    <div style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                        每個元件下方都會有<span>「設定」</span>，點擊進入後即可調整該元件更詳細的設計
                                    </div>
                                </div>
                            `;
                            this.detectClickThrough(target, () => {
                                vm.step++;
                                BG.classList.remove(`${className}`);
                                gvc.notifyDataChange(viewID);
                            });
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 207,
                                title: '進入設定',
                                content: context,
                                alignment: 'right2',
                                next: true,
                                previewEvent: () => {
                                    document.querySelector('.fa-chevron-left').click();
                                }
                            });
                        }
                        return ``;
                    }
                    case 7: {
                        let className = 'guide-user-editor-8';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            className = 'guide-user-editor-7';
                            target = target.parentElement.parentElement.parentElement.parentElement.parentElement;
                            const context = [{
                                    title: "1.「顏色設定」「間距設定」及「字型設定」",
                                    content: "可以選擇統一設定或為元件自定義設定"
                                }, {
                                    title: "2.「開發者設定」",
                                    content: "為開發者設置的進階選項，可以透過程式實現更加靈活及獨特的設計"
                                }].map((data) => {
                                return html `
                                    <div class="d-flex flex-column"
                                         style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                        <div style="font-weight: 700;">${data.title}</div>
                                        <div style="white-space: normal">${data.content}</div>
                                    </div>
                                `;
                            }).join('');
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 457,
                                height: 301,
                                title: '設置自定義選項',
                                content: context,
                                alignment: 'right2',
                                cover: true,
                                previewEvent: () => {
                                    document.querySelector('.fa-chevron-left').click();
                                }
                            });
                        }
                        return ``;
                    }
                    case 8: {
                        const className = 'guide-user-editor-8';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector('.guide-user-editor-8')) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelectorAll(`.${className}`);
                        if (target) {
                            target = target[1];
                            this.detectClickThrough(target, () => {
                                BG.classList.remove(`${className}-BG`);
                                vm.step = 9;
                                setTimeout(() => {
                                    gvc.notifyDataChange(viewID);
                                }, 300);
                            });
                            const context = html `
                                <div>點擊<span style="font-weight: 700;">「顏色設定」</span></div>

                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 181,
                                title: '點擊顏色設定',
                                content: context,
                                alignment: 'right2',
                                next: true,
                            });
                        }
                        return ``;
                    }
                    case 9: {
                        const className = 'colorSettingGuide';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            this.detectClickThrough(target, () => {
                                BG.classList.remove(`${className}-BG`);
                                vm.step++;
                                gvc.notifyDataChange(viewID);
                            });
                            const context = html `
                                <div>可以選擇要 <span style="font-weight: 700;">套用統一配色</span> 或是 <span
                                        style="font-weight: 700;">自定義配色</span></div>
                                ${[{
                                    title: "1.套用統一配色:",
                                    content: "選擇一個配色，全站應用此配色的元件顏色將同步，方便修改、確保風格一致"
                                }, {
                                    title: "2.自定義配色:",
                                    content: "可針對此元件設置獨特顏色，實現獨一無二的設計效果"
                                }].map((data) => {
                                return html `
                                        <div style="white-space: normal;">
                                            <span style="font-weight: 700">${data.title}</span>${data.content}
                                        </div>
                                    `;
                            }).join('')}
                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 439,
                                height: 307,
                                title: '顏色設定',
                                content: context,
                                alignment: 'right2',
                                cover: true
                            });
                        }
                        return ``;
                    }
                    case 10: {
                        const className = 'guideBackSetting';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            this.detectClickThrough(target, () => {
                                BG.classList.remove(`${className}-BG`);
                                vm.step++;
                                gvc.notifyDataChange(viewID);
                            });
                            const context = html `
                                <div>點擊<span style="font-weight: 700;margin: 0 6px;"><i
                                        class="fa-solid fa-chevron-left"></i></span>返回標題
                                </div>

                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 181,
                                title: '返回標題',
                                content: context,
                                alignment: 'right2',
                                next: true,
                            });
                        }
                        return ``;
                    }
                    case 11: {
                        const className = 'guide-user-editor-4';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        const target = document.querySelector(`.${className}`);
                        if (target) {
                            const context = html `
                                <div class="d-flex flex-column" style="">
                                    <div style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                        每個元件可以分為三種顯示樣式
                                        <div class="d-flex flex-column"
                                             style="gap: 2px;margin-top: 6px;margin-bottom: 12px;">
                                            ${(() => {
                                const viewMode = [
                                    {
                                        title: "預設樣式",
                                        icon: html `
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                                 xmlns="http://www.w3.org/2000/svg">
                                                                <rect width="24" height="24" rx="4.28571"
                                                                      fill="#F1F1F1"/>
                                                                <rect x="3.16192" y="6.30022" width="11.3929"
                                                                      height="11.3929" rx="5.69643" stroke="#393939"
                                                                      stroke-width="1.17857"/>
                                                                <g clip-path="url(#clip0_11947_163151)">
                                                                    <path d="M13.9682 8.85547L9.25391 12.784"
                                                                          stroke="#393939" stroke-width="1.17857"/>
                                                                    <path d="M14.3619 11.6055L9.64758 15.534"
                                                                          stroke="#393939" stroke-width="1.17857"/>
                                                                </g>
                                                                <rect x="9.44939" y="6.30022" width="11.3929"
                                                                      height="11.3929" rx="5.69643" stroke="#393939"
                                                                      stroke-width="1.17857"/>
                                                                <rect x="9.44939" y="6.30022" width="11.3929"
                                                                      height="11.3929" rx="5.69643" stroke="#393939"
                                                                      stroke-width="1.17857"/>
                                                                <defs>
                                                                    <clipPath id="clip0_11947_163151">
                                                                        <rect x="8.86011" y="5.71094" width="12.5714"
                                                                              height="12.5714" rx="6.28571"
                                                                              fill="white"/>
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>

                                                        `
                                    },
                                    {
                                        title: "電腦版",
                                        icon: html `
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none">
                                                                <rect width="24" height="24" rx="4.28571"
                                                                      fill="#F1F1F1"/>
                                                                <path d="M18.001 6.42829H6.00103C5.76531 6.42829 5.57246 6.62115 5.57246 6.85686V11.9997H18.4296V6.85686C18.4296 6.62115 18.2367 6.42829 18.001 6.42829ZM19.7153 11.9997V13.2854V14.5711C19.7153 15.5167 18.9466 16.2854 18.001 16.2854H14.0448L14.2591 17.5711H15.6439C16.0001 17.5711 16.2867 17.8578 16.2867 18.214C16.2867 18.5703 16.0001 18.8569 15.6439 18.8569H13.7153H10.2867H8.35817C8.00192 18.8569 7.71532 18.5703 7.71532 18.214C7.71532 17.8578 8.00192 17.5711 8.35817 17.5711H9.74299L9.95728 16.2854H6.00103C5.05549 16.2854 4.28674 15.5167 4.28674 14.5711V13.2854V11.9997V6.85686C4.28674 5.91133 5.05549 5.14258 6.00103 5.14258H18.001C18.9466 5.14258 19.7153 5.91133 19.7153 6.85686V11.9997ZM5.57246 13.2854V14.5711C5.57246 14.8069 5.76531 14.9997 6.00103 14.9997H10.7019C10.71 14.9997 10.718 14.9997 10.7234 14.9997H13.2734C13.2814 14.9997 13.2894 14.9997 13.2948 14.9997H18.001C18.2367 14.9997 18.4296 14.8069 18.4296 14.5711V13.2854H5.57246ZM11.0448 17.5711H12.9546L12.7403 16.2854H11.2591L11.0448 17.5711Z"
                                                                      fill="#393939"/>
                                                            </svg>
                                                        `
                                    },
                                    {
                                        title: "手機版",
                                        icon: html `
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                                                 height="24" viewBox="0 0 24 24" fill="none">
                                                                <rect width="24" height="24" rx="4.28571"
                                                                      fill="#F1F1F1"/>
                                                                <path d="M8.99897 17.1426C8.99897 17.3783 9.19183 17.5711 9.42754 17.5711H15.4275C15.6633 17.5711 15.8561 17.3783 15.8561 17.1426V14.9997H8.99897V17.1426ZM8.99897 13.714H15.8561V6.85686C15.8561 6.62115 15.6633 6.42829 15.4275 6.42829H9.42754C9.19183 6.42829 8.99897 6.62115 8.99897 6.85686V13.714ZM7.71326 6.85686C7.71326 5.91133 8.48201 5.14258 9.42754 5.14258H15.4275C16.3731 5.14258 17.1418 5.91133 17.1418 6.85686V17.1426C17.1418 18.0881 16.3731 18.8569 15.4275 18.8569H9.42754C8.48201 18.8569 7.71326 18.0881 7.71326 17.1426V6.85686ZM12.4275 15.6426C12.598 15.6426 12.7616 15.7103 12.8821 15.8309C13.0027 15.9514 13.0704 16.1149 13.0704 16.2854C13.0704 16.4559 13.0027 16.6194 12.8821 16.74C12.7616 16.8606 12.598 16.9283 12.4275 16.9283C12.257 16.9283 12.0935 16.8606 11.973 16.74C11.8524 16.6194 11.7847 16.4559 11.7847 16.2854C11.7847 16.1149 11.8524 15.9514 11.973 15.8309C12.0935 15.7103 12.257 15.6426 12.4275 15.6426Z"
                                                                      fill="#393939"/>
                                                            </svg>
                                                        `
                                    },
                                ];
                                return viewMode.map((data, index) => {
                                    return html `
                                                        <div class="d-flex"
                                                             style="font-size: 16px;font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">
                                                            ${index}
                                                                「${data.title}」
                                                            ${data.icon}
                                                        </div>
                                                    `;
                                }).join('');
                            })()}
                                        </div>
                                        若希望有不同設計，可切換至想修改的地方，並自定義需要修改的元件。
                                    </div>
                                </div>
                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}`, viewID, vm.step, totalStep, {
                                width: 357,
                                height: 343,
                                title: '元件顯示樣式',
                                content: context,
                                alignment: 'right2',
                                cover: true,
                                preview: true
                            });
                        }
                        return ``;
                    }
                    case 12: {
                        const className = 'guide-user-editor-5';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        const target = document.querySelector(`.${className}`);
                        if (target) {
                            this.detectClickThrough(target.parentElement, () => {
                                BG.classList.remove(`${className}`);
                                vm.step++;
                                setTimeout(() => {
                                    gvc.notifyDataChange(viewID);
                                }, 200);
                            });
                            const context = html `
                                <div class="d-flex flex-column" style="">
                                    <div style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                        點擊
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none">
                                            <rect width="24" height="24" rx="4.28571" fill="#F1F1F1"/>
                                            <path d="M8.99897 17.1426C8.99897 17.3783 9.19183 17.5711 9.42754 17.5711H15.4275C15.6633 17.5711 15.8561 17.3783 15.8561 17.1426V14.9997H8.99897V17.1426ZM8.99897 13.714H15.8561V6.85686C15.8561 6.62115 15.6633 6.42829 15.4275 6.42829H9.42754C9.19183 6.42829 8.99897 6.62115 8.99897 6.85686V13.714ZM7.71326 6.85686C7.71326 5.91133 8.48201 5.14258 9.42754 5.14258H15.4275C16.3731 5.14258 17.1418 5.91133 17.1418 6.85686V17.1426C17.1418 18.0881 16.3731 18.8569 15.4275 18.8569H9.42754C8.48201 18.8569 7.71326 18.0881 7.71326 17.1426V6.85686ZM12.4275 15.6426C12.598 15.6426 12.7616 15.7103 12.8821 15.8309C13.0027 15.9514 13.0704 16.1149 13.0704 16.2854C13.0704 16.4559 13.0027 16.6194 12.8821 16.74C12.7616 16.8606 12.598 16.9283 12.4275 16.9283C12.257 16.9283 12.0935 16.8606 11.973 16.74C11.8524 16.6194 11.7847 16.4559 11.7847 16.2854C11.7847 16.1149 11.8524 15.9514 11.973 15.8309C12.0935 15.7103 12.257 15.6426 12.4275 15.6426Z"
                                                  fill="#393939"/>
                                        </svg>
                                        切換至<span style="font-weight: 700;">「手機版」</span>
                                    </div>
                                </div>
                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 190,
                                title: '切換至手機版',
                                content: context,
                                alignment: 'right2',
                                next: true
                            });
                        }
                        return ``;
                    }
                    case 13: {
                        const className = 'guide-user-editor-6';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        const target = document.querySelector(`.${className}`);
                        const icon = html `
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none">
                                <rect width="24" height="24" rx="4.28571" fill="#F1F1F1"/>
                                <path d="M8.99897 17.1426C8.99897 17.3783 9.19183 17.5711 9.42754 17.5711H15.4275C15.6633 17.5711 15.8561 17.3783 15.8561 17.1426V14.9997H8.99897V17.1426ZM8.99897 13.714H15.8561V6.85686C15.8561 6.62115 15.6633 6.42829 15.4275 6.42829H9.42754C9.19183 6.42829 8.99897 6.62115 8.99897 6.85686V13.714ZM7.71326 6.85686C7.71326 5.91133 8.48201 5.14258 9.42754 5.14258H15.4275C16.3731 5.14258 17.1418 5.91133 17.1418 6.85686V17.1426C17.1418 18.0881 16.3731 18.8569 15.4275 18.8569H9.42754C8.48201 18.8569 7.71326 18.0881 7.71326 17.1426V6.85686ZM12.4275 15.6426C12.598 15.6426 12.7616 15.7103 12.8821 15.8309C13.0027 15.9514 13.0704 16.1149 13.0704 16.2854C13.0704 16.4559 13.0027 16.6194 12.8821 16.74C12.7616 16.8606 12.598 16.9283 12.4275 16.9283C12.257 16.9283 12.0935 16.8606 11.973 16.74C11.8524 16.6194 11.7847 16.4559 11.7847 16.2854C11.7847 16.1149 11.8524 15.9514 11.973 15.8309C12.0935 15.7103 12.257 15.6426 12.4275 15.6426Z"
                                      fill="#393939"/>
                            </svg>`;
                        this.detectClickThrough(target, () => {
                            BG.classList.remove(`${className}`);
                            vm.step++;
                            gvc.notifyDataChange(viewID);
                        });
                        if (target) {
                            const context = html `
                                <div class="d-flex flex-column"
                                     style="font-size: 14px;font-style: normal;line-height: 160%;letter-spacing: 0.56px;">
                                    <div class=" " style="white-space: normal">
                                        在<span style="font-weight: 700;">「手機版」</span>${icon}可以<span
                                            style="font-weight: 700;">設置自定義選項</span>
                                        <span style="word-break: break-all">，選擇需要自定義的元件並加以修改</span>
                                    </div>

                                    <div style="white-space: normal;margin-bottom:12px;">
                                        例: 我希望<span style="font-weight: 700;">「手機版」</span>商品的每行數量可減少至2個，則進入<span
                                            style="font-weight: 700;">「設置自定義選項」</span>勾選<span
                                            style="font-weight: 700;">每行數量</span> (如下圖)
                                    </div>
                                    <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/size1440_s*px$_scs8s9s3s4s4s2s1_%E6%88%AA%E5%9C%962024-09-09%E4%B8%8B%E5%8D%885.08.00.jpg"
                                         alt="img">
                                </div>
                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}`, viewID, vm.step, totalStep, {
                                width: 457,
                                height: 463,
                                title: '設置自定義選項',
                                content: context,
                                alignment: 'right2',
                                cover: true,
                                btnText: "完成",
                                nextEvent: () => {
                                    ApiShop.getEditorGuide().then(r => {
                                        r.response.value.find((element) => element.title == "頁面編輯").finish = true;
                                        ApiShop.setEditorGuide(r.response.value);
                                        this.leaveGuide(vm, 1);
                                    });
                                }
                            });
                        }
                        return ``;
                    }
                    default: {
                        this.guide = 0;
                        this.step = 1;
                        this.drawBG();
                        return ``;
                    }
                }
            },
            divCreate: {},
        });
    }
    drawGlobalEditorGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
            viewID: 'UIGuide'
        };
        const that = this;
        const totalStep = 5;
        const viewID = 'Global';
        const BG = document.querySelector(`.guide-BG`);
        return gvc.bindView({
            bind: viewID,
            view: () => {
                switch (vm.step) {
                    case 1: {
                        const className = 'guide-user-editor-11';
                        let clickTarget = document.querySelector(`.${className}-icon`);
                        if (!document.querySelector(`.${className}`)) {
                            clickTarget.click();
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            let clickTarget = document.querySelector(`.${className}-icon`);
                            let clickRect = clickTarget.getBoundingClientRect();
                            let rect = target.getBoundingClientRect();
                            function drawHole(x1, x2, x3, y1, y2, y3, y4) {
                                return `clip-path: polygon(0 0,
                                ${x1}px ${y2}px,
                                ${x2}px ${y2}px,
                                ${x2}px ${y1}px,
                                ${x3}px ${y1}px,
                                ${x3}px ${y4}px,
                                ${x2}px ${y4}px,
                                ${x2}px ${y3}px,
                                ${x1}px ${y3}px, 0 100%, 100% 100%, 100% 0);`;
                            }
                            let icon = html `
                                <span style="display: inline-flex;width: 24.002px;height: 24.002px;padding: 5.143px 5.142px 5.143px 5.144px;justify-content: center;align-items: center;border-radius: 4px;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"
                                          fill="none">
                                      <g clip-path="url(#clip0_13405_223884)">
                                        <path d="M7.0029 12.5722C7.20113 12.5722 7.72618 12.3793 8.27801 11.2756C8.51374 10.8015 8.71733 10.2255 8.86734 9.57192H5.13847C5.28848 10.2255 5.49207 10.8015 5.7278 11.2756C6.27963 12.3793 6.80467 12.5722 7.0029 12.5722ZM4.92684 8.2861H9.07897C9.12183 7.87624 9.14594 7.44496 9.14594 7.00028C9.14594 6.5556 9.12183 6.12432 9.07897 5.71446H4.92684C4.88398 6.12432 4.85987 6.5556 4.85987 7.00028C4.85987 7.44496 4.88398 7.87624 4.92684 8.2861ZM5.13847 4.42864H8.86734C8.71733 3.77502 8.51374 3.19908 8.27801 2.72493C7.72618 1.62127 7.20113 1.4284 7.0029 1.4284C6.80467 1.4284 6.27963 1.62127 5.7278 2.72493C5.49207 3.19908 5.28848 3.77502 5.13847 4.42864ZM10.3701 5.71446C10.4103 6.12967 10.4291 6.56096 10.4291 7.00028C10.4291 7.4396 10.4076 7.87089 10.3701 8.2861H12.4248C12.5212 7.87356 12.5748 7.44228 12.5748 7.00028C12.5748 6.55828 12.5239 6.12699 12.4248 5.71446H10.3701ZM11.9453 4.42864C11.372 3.32766 10.4425 2.44366 9.30934 1.92665C9.68705 2.61242 9.98708 3.46696 10.1826 4.42864H11.9479H11.9453ZM3.8205 4.42864C4.01605 3.46696 4.31608 2.6151 4.69379 1.92665C3.56066 2.44366 2.63112 3.32766 2.05786 4.42864H3.82318H3.8205ZM1.58103 5.71446C1.4846 6.12699 1.43102 6.55828 1.43102 7.00028C1.43102 7.44228 1.48192 7.87356 1.58103 8.2861H3.63567C3.59548 7.87089 3.57673 7.4396 3.57673 7.00028C3.57673 6.56096 3.59816 6.12967 3.63567 5.71446H1.58103ZM9.30934 12.0739C10.4425 11.5569 11.372 10.6729 11.9453 9.57192H10.1799C9.9844 10.5336 9.68437 11.3855 9.30666 12.0739H9.30934ZM4.69647 12.0739C4.31876 11.3881 4.01873 10.5336 3.82318 9.57192H2.05786C2.63112 10.6729 3.56066 11.5569 4.69379 12.0739H4.69647ZM7.0029 13.858C5.18413 13.858 3.43985 13.1355 2.15378 11.8494C0.867709 10.5633 0.145203 8.81905 0.145203 7.00028C0.145203 5.1815 0.867709 3.43722 2.15378 2.15115C3.43985 0.865084 5.18413 0.142578 7.0029 0.142578C8.82168 0.142578 10.566 0.865084 11.852 2.15115C13.1381 3.43722 13.8606 5.1815 13.8606 7.00028C13.8606 8.81905 13.1381 10.5633 11.852 11.8494C10.566 13.1355 8.82168 13.858 7.0029 13.858Z"
                                              fill="white"/>
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_13405_223884">
                                          <rect width="13.7154" height="13.7154" fill="white"
                                                transform="translate(0.144287 0.142578)"/>
                                        </clipPath>
                                      </defs>
                                    </svg>
                                </span>

                            `;
                            gvc.addStyle(`
                                .${className}-BG{
                                     ${drawHole(0, rect.left, rect.right, rect.top, clickRect.top - 7, clickRect.bottom + 7, rect.bottom)}
                                }
                            `);
                            const context = html `
                                <div class="" style="white-space: normal;word-break: break-all;">於<span
                                        style="font-weight: 700;">「全站樣式」</span>${icon}
                                    頁面，您可以統一管理全站的樣式設置，一旦您進行了修改，所有套用這些樣式的元件都會自動更新，確保官網設計的一致性。
                                </div>
                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 457,
                                height: 307,
                                title: '「全站樣式」',
                                content: context,
                                alignment: 'right2',
                                ignoreStyle: true,
                                cover: true,
                                preview: true
                            });
                        }
                        return ``;
                    }
                    case 2: {
                        let className = 'guide-user-editor-11';
                        if (document.querySelector('.fa-chevron-down') && !document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`) && !document.querySelector('.fa-chevron-down')) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            className = "new-guide-user-editor-11";
                            target = target.children[0];
                            this.detectClickThrough(target, () => {
                                vm.step++;
                                BG.classList.remove(`${className}-BG`);
                                setTimeout(() => {
                                    gvc.notifyDataChange(viewID);
                                }, 500);
                            });
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 349,
                                height: 181,
                                title: '點擊配色',
                                content: `<div>點擊<span style="font-weight: 700;">配色模式</span></div>`,
                                alignment: 'right2',
                                next: true
                            });
                        }
                        return ``;
                    }
                    case 3: {
                        const className = 'globalGuideColorSetting';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            const context = html `這邊是全站會使用到的配色，可以進行編輯或是新增一個新的`;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 217,
                                title: '全站配色',
                                content: context,
                                alignment: 'right2',
                                cover: true,
                                previewEvent: () => {
                                    document.querySelector('.fa-angle-down').click();
                                }
                            });
                        }
                        return ``;
                    }
                    case 4: {
                        const className = 'globalGuide-4';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            const context = html `
                                <div>點擊<span style="font-weight: 700">配色1</span>進入編輯</div>`;
                            this.detectClickThrough(target, () => {
                                vm.step++;
                                BG.classList.remove(`${className}-BG`);
                                gvc.notifyDataChange(viewID);
                            });
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 217,
                                title: '編輯配色1',
                                content: context,
                                alignment: 'right2',
                                next: true
                            });
                        }
                        return ``;
                    }
                    case 5: {
                        const className = 'globalGuide-5';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            target.scrollIntoView();
                            const context = html `若是修改了這裡的顏色，全站所有套用此配色的元件將會同步更新，確保官網設計的一致性。`;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 217,
                                title: '注意',
                                content: context,
                                alignment: 'right2',
                                btnText: "完成",
                                previewEvent: () => {
                                    document.querySelector('.fa-angle-left').click();
                                    setTimeout(() => {
                                        document.querySelector('.fa-chevron-right').click();
                                        gvc.notifyDataChange(viewID);
                                    }, 300);
                                },
                                nextEvent: () => {
                                    ApiShop.getEditorGuide().then(r => {
                                        r.response.value.find((element) => element.title == "全站樣式").finish = true;
                                        ApiShop.setEditorGuide(r.response.value);
                                        this.guide = 0;
                                        this.step = 1;
                                        this.drawBG();
                                    });
                                }
                            });
                        }
                        return ``;
                    }
                    default: {
                        this.guide = 0;
                        this.step = 1;
                        this.drawBG();
                        return ``;
                    }
                }
            },
            divCreate: {},
        });
    }
    drawDesignEditorGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
            viewID: 'UIGuide'
        };
        const that = this;
        const totalStep = 7;
        const viewID = 'Global';
        const BG = document.querySelector(`.guide-BG`);
        return gvc.bindView({
            bind: viewID,
            view: () => {
                switch (vm.step) {
                    case 1: {
                        const className = 'design-guide-1';
                        let clickTarget = document.querySelector(`.${className}-icon`);
                        clickTarget.click();
                        if (document.querySelector(`.${className}-icon`).style.color != 'white') {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            let clickTarget = document.querySelector(`.${className}-icon`);
                            let clickRect = clickTarget.getBoundingClientRect();
                            let rect = target.getBoundingClientRect();
                            function drawHole(x1, x2, x3, y1, y2, y3, y4) {
                                return `clip-path: polygon(0 0,
                                ${x1}px ${y2}px,
                                ${x2}px ${y2}px,
                                ${x2}px ${y1}px,
                                ${x3}px ${y1}px,
                                ${x3}px ${y4}px,
                                ${x2}px ${y4}px,
                                ${x2}px ${y3}px,
                                ${x1}px ${y3}px, 0 100%, 100% 100%, 100% 0);`;
                            }
                            let icon = html `
                                <span style="display: inline-flex;width: 24.002px;height: 24.002px;padding: 5.143px 5.142px 5.143px 5.144px;justify-content: center;align-items: center;border-radius: 4px;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"
                                          fill="none">
                                      <path d="M1.61258 1.61197V4.55074H4.55135V1.61197H1.61258ZM0.143188 1.61197C0.143188 0.800741 0.801352 0.142578 1.61258 0.142578H4.55135C5.36258 0.142578 6.02074 0.800741 6.02074 1.61197V4.55074C6.02074 5.36197 5.36258 6.02013 4.55135 6.02013H1.61258C0.801352 6.02013 0.143188 5.36197 0.143188 4.55074V1.61197ZM1.61258 9.4487V12.3875H4.55135V9.4487H1.61258ZM0.143188 9.4487C0.143188 8.63748 0.801352 7.97931 1.61258 7.97931H4.55135C5.36258 7.97931 6.02074 8.63748 6.02074 9.4487V12.3875C6.02074 13.1987 5.36258 13.8569 4.55135 13.8569H1.61258C0.801352 13.8569 0.143188 13.1987 0.143188 12.3875V9.4487ZM12.3881 1.61197H9.44931V4.55074H12.3881V1.61197ZM9.44931 0.142578H12.3881C13.1993 0.142578 13.8575 0.800741 13.8575 1.61197V4.55074C13.8575 5.36197 13.1993 6.02013 12.3881 6.02013H9.44931C8.63809 6.02013 7.97992 5.36197 7.97992 4.55074V1.61197C7.97992 0.800741 8.63809 0.142578 9.44931 0.142578ZM9.44931 9.4487V12.3875H12.3881V9.4487H9.44931ZM7.97992 9.4487C7.97992 8.63748 8.63809 7.97931 9.44931 7.97931H12.3881C13.1993 7.97931 13.8575 8.63748 13.8575 9.4487V12.3875C13.8575 13.1987 13.1993 13.8569 12.3881 13.8569H9.44931C8.63809 13.8569 7.97992 13.1987 7.97992 12.3875V9.4487Z"
                                            fill="white"/>
                                    </svg>
                                </span>

                            `;
                            gvc.addStyle(`
                                .${className}-BG{
                                     ${drawHole(0, rect.left, rect.right, rect.top, clickRect.top - 7, clickRect.bottom + 7, rect.bottom)}
                                }
                            `);
                            const context = html `
                                <div class="" style="white-space: normal;word-break: break-all;">於<span
                                        style="font-weight: 700;">「設計元件」</span>${icon}
                                    頁面，您可以替全站的<span style="font-weight: 700;">「標頭」</span>
                                    <span style="font-weight: 700;">「商品卡片」</span>及<span style="font-weight: 700;">「頁腳」</span>設置預設樣式，一旦您修改了預設樣式，所有網頁都會自動更新，確保一致性。
                                </div>
                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 457,
                                height: 243,
                                title: '「全站樣式」',
                                content: context,
                                alignment: 'right2',
                                ignoreStyle: true,
                                preview: true,
                                cover: true
                            });
                        }
                        return ``;
                    }
                    case 2: {
                        const className = 'guideDesign-2';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        let target = document.querySelector(`.${className}`).parentElement;
                        if (target) {
                            this.detectClickThrough(target, () => {
                                vm.step++;
                                BG.classList.remove(`${className}-BG`);
                                setTimeout(() => {
                                    gvc.notifyDataChange(viewID);
                                }, 500);
                            });
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 349,
                                height: 181,
                                title: '點擊標頭樣式',
                                content: `<div>點擊<span style="font-weight: 700;">標頭模式</span></div>`,
                                alignment: 'right2',
                                next: true
                            });
                        }
                        return ``;
                    }
                    case 3: {
                        const className = 'guideDesign-3';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            const context = html `這裡提供多種標頭樣式供您選擇，選定其中一個後，全站的標頭樣式將自動更新為所選樣式，並同步應用於所有新增的頁面。`;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 457,
                                height: 243,
                                title: '標頭樣式',
                                content: context,
                                alignment: 'right2',
                                cover: true,
                            });
                        }
                        return ``;
                    }
                    case 4: {
                        const className = 'guideDesign-3';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            const context = html `
                                <div>點擊<span style="font-weight: 700">配色1</span>進入編輯</div>`;
                            this.detectClickThrough(target.querySelector('button'), () => {
                                vm.step++;
                                BG.classList.remove(`${className}-BG`);
                                gvc.notifyDataChange(viewID);
                            });
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 217,
                                title: '編輯配色1',
                                content: context,
                                alignment: 'right2',
                                next: true
                            });
                        }
                        return ``;
                    }
                    case 5: {
                        const className = 'image-upload-container';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            const context = html `這裡可以更換此標頭樣式的Logo`;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 217,
                                title: '編輯樣式',
                                content: context,
                                alignment: 'right2',
                                preview: true
                            });
                        }
                        return ``;
                    }
                    case 6: {
                        const className = 'guide-user-editor-7';
                        if (!document.querySelector(`.${className}`)) {
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            const context = html `
                                <div>點擊<span style="font-weight: 700">設定</span>，修改更多細節</div>`;
                            this.detectClickThrough(target, () => {
                                vm.step++;
                                BG.classList.remove(`${className}-BG`);
                                setTimeout(() => {
                                    gvc.notifyDataChange(viewID);
                                }, 300);
                            });
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 350,
                                height: 217,
                                title: '點擊設定',
                                content: context,
                                alignment: 'right2',
                                next: true
                            });
                        }
                        return ``;
                    }
                    case 7: {
                        const className = 'design-guide-1';
                        if (document.querySelector(`.${className}-icon`).style.color != 'white') {
                            let clickTarget = document.querySelector(`.${className}-icon`);
                            clickTarget.click();
                            const timer = setInterval(() => {
                                if (document.querySelector(`.${className}`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 500);
                        }
                        let target = document.querySelector(`.${className}`);
                        if (target) {
                            let clickTarget = document.querySelector(`.${className}-icon`);
                            let clickRect = clickTarget.getBoundingClientRect();
                            let rect = target.getBoundingClientRect();
                            function drawHole(x1, x2, x3, y1, y2, y3, y4) {
                                return `clip-path: polygon(0 0,
                                ${x1}px ${y2}px,
                                ${x2}px ${y2}px,
                                ${x2}px ${y1}px,
                                ${x3}px ${y1}px,
                                ${x3}px ${y4}px,
                                ${x2}px ${y4}px,
                                ${x2}px ${y3}px,
                                ${x1}px ${y3}px, 0 100%, 100% 100%, 100% 0);`;
                            }
                            let icon = html `
                                <span style="display: inline-flex;width: 24.002px;height: 24.002px;padding: 5.143px 5.142px 5.143px 5.144px;justify-content: center;align-items: center;border-radius: 4px;background: linear-gradient(143deg, #FFB400 -22.7%, #FF6C02 114.57%);">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"
                                          fill="none">
                                      <path d="M1.61258 1.61197V4.55074H4.55135V1.61197H1.61258ZM0.143188 1.61197C0.143188 0.800741 0.801352 0.142578 1.61258 0.142578H4.55135C5.36258 0.142578 6.02074 0.800741 6.02074 1.61197V4.55074C6.02074 5.36197 5.36258 6.02013 4.55135 6.02013H1.61258C0.801352 6.02013 0.143188 5.36197 0.143188 4.55074V1.61197ZM1.61258 9.4487V12.3875H4.55135V9.4487H1.61258ZM0.143188 9.4487C0.143188 8.63748 0.801352 7.97931 1.61258 7.97931H4.55135C5.36258 7.97931 6.02074 8.63748 6.02074 9.4487V12.3875C6.02074 13.1987 5.36258 13.8569 4.55135 13.8569H1.61258C0.801352 13.8569 0.143188 13.1987 0.143188 12.3875V9.4487ZM12.3881 1.61197H9.44931V4.55074H12.3881V1.61197ZM9.44931 0.142578H12.3881C13.1993 0.142578 13.8575 0.800741 13.8575 1.61197V4.55074C13.8575 5.36197 13.1993 6.02013 12.3881 6.02013H9.44931C8.63809 6.02013 7.97992 5.36197 7.97992 4.55074V1.61197C7.97992 0.800741 8.63809 0.142578 9.44931 0.142578ZM9.44931 9.4487V12.3875H12.3881V9.4487H9.44931ZM7.97992 9.4487C7.97992 8.63748 8.63809 7.97931 9.44931 7.97931H12.3881C13.1993 7.97931 13.8575 8.63748 13.8575 9.4487V12.3875C13.8575 13.1987 13.1993 13.8569 12.3881 13.8569H9.44931C8.63809 13.8569 7.97992 13.1987 7.97992 12.3875V9.4487Z"
                                            fill="white"/>
                                    </svg>
                                </span>

                            `;
                            gvc.addStyle(`
                                .${className}-BG{
                                     ${drawHole(0, rect.left, rect.right, rect.top, clickRect.top - 7, clickRect.bottom + 7, rect.bottom)}
                                }
                            `);
                            const context = html `
                                <div class="" style="white-space: normal;word-break: break-all;">於<span
                                        style="font-weight: 700;">「設計元件」</span>${icon}
                                    頁面，您可以替全站的<span style="font-weight: 700;">「標頭」</span>
                                    <span style="font-weight: 700;">「商品卡片」</span>及<span style="font-weight: 700;">「頁腳」</span>設置預設樣式，一旦您修改了預設樣式，所有網頁都會自動更新，確保一致性。
                                </div>
                            `;
                            return this.drawBGwithRightWindow(BG, vm, target, `.${className}-BG`, viewID, vm.step, totalStep, {
                                width: 457,
                                height: 243,
                                title: '「全站樣式」',
                                content: context,
                                alignment: 'right2',
                                ignoreStyle: true,
                                btnText: "完成",
                                cover: true,
                                previewEvent: () => {
                                    document.querySelector('.fa-chevron-left').click();
                                },
                                nextEvent: () => {
                                    ApiShop.getEditorGuide().then(r => {
                                        r.response.value.find((element) => element.title == "設計元件").finish = true;
                                        ApiShop.setEditorGuide(r.response.value);
                                        this.guide = 0;
                                        this.step = 1;
                                        this.drawBG();
                                    });
                                }
                            });
                        }
                        return ``;
                    }
                    default: {
                        this.guide = 0;
                        this.step = 1;
                        this.drawBG();
                        return ``;
                    }
                }
            },
            divCreate: {},
        });
    }
    drawBG() {
        let body = document.querySelector('.editorContainer');
        if (body && !document.querySelector('.guide-BG')) {
            let appendHTML = html `
                <div
                        class="guide-BG d-flex align-items-center justify-content-center"
                        style="width:100vw;height: 100vh;background: rgba(0, 0, 0, 0.60);position: absolute;left: 0;top: 0;z-index:1031;"
                        onclick="${this.gvc.event(() => {
            })}"
                ></div>
            `;
            $(body).append(appendHTML);
        }
        if (this.type == 'user-editor') {
            const innerHTML = this.uiGuidePage[this.guide].innerHTML();
            document.querySelector('.guide-BG').innerHTML = innerHTML !== null && innerHTML !== void 0 ? innerHTML : ``;
        }
        else {
            document.querySelector('.scrollbar-hover').scrollTop = 0;
            const innerHTML = this.guidePage[this.guide].innerHTML();
            document.querySelector('.guide-BG').innerHTML = innerHTML !== null && innerHTML !== void 0 ? innerHTML : ``;
        }
        return html ``;
    }
    drawGuide() {
        if (document.body.clientWidth < 922) {
            return;
        }
        const that = this;
        const timer = setInterval(function () {
            if (document.querySelector('iframe')) {
                that.drawBG();
                clearInterval(timer);
            }
        }, 500);
        return html ``;
    }
}
BgGuide.disableFunction = () => { };
