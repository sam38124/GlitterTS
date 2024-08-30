import { ApiShop } from "../glitter-base/route/shopping.js";
const html = String.raw;
export class BgGuide {
    constructor(gvc, guide) {
        this.guidePage = [{
                value: "init",
                title: "初始化介面",
                innerHTML: () => {
                    return this.drawInitGuide();
                }
            }, {
                value: "setFinanceWay",
                title: "金流設定",
                innerHTML: () => {
                    return this.drawFinanceWayGuide();
                }
            }, {
                value: "shippment_setting",
                title: "配送設定",
                innerHTML: () => {
                    return this.drawInitGuide();
                }
            }, {
                value: "logistics_setting",
                title: "運費設定",
                innerHTML: () => {
                    return this.drawInitGuide();
                }
            }, {
                value: "product-manager",
                title: "商品上架",
                innerHTML: () => {
                    return this.drawInitGuide();
                }
            }, {
                value: "shop_information",
                title: "商店訊息",
                innerHTML: () => {
                    return this.drawInitGuide();
                }
            }, {
                value: "web_theme",
                title: "佈置官網",
                innerHTML: () => {
                    return this.drawInitGuide();
                }
            }, {
                value: "manage_theme",
                title: "管理主題庫",
                innerHTML: () => {
                    return this.drawInitGuide();
                }
            }];
        this.eventSet = [];
        this.guide = guide;
        this.gvc = gvc;
        this.step = 0;
    }
    showGuideInfo() {
        console.log(this.guidePage[this.guide]);
    }
    detectClickThrough(target, clickEvent) {
        console.log("target -- ", target);
        const handleClick = () => {
            setTimeout(() => {
                clickEvent();
                this.eventSet = this.eventSet.filter((d) => {
                    return d !== handleClick;
                });
                target.removeEventListener('click', handleClick);
            }, 0);
        };
        target.addEventListener("click", handleClick);
        this.eventSet.push(() => {
            target.removeEventListener('click', handleClick);
        });
    }
    deleteEvent(handleClick) {
    }
    leaveGuide(vm) {
        vm.step = -1;
        const element = document.querySelector('.guide-BG');
        this.eventSet.forEach((del) => {
            del();
        });
        element.remove();
    }
    holeBG(left, right, top, bottom) {
        return `clip-path: polygon(0% 0%, 0% 100%, ${left.toFixed(0)}px 100%, ${left.toFixed(0)}px ${top.toFixed(0)}px, ${right.toFixed(0)}px ${top.toFixed(0)}px, ${right.toFixed(0)}px ${bottom.toFixed(0)}px, ${left.toFixed(0)}px ${bottom.toFixed(0)}px, ${left.toFixed(0)}px 100%, 100% 100%, 100% 0%);`;
    }
    preventDefault(e) {
        e.preventDefault();
    }
    findIframeDom(cssSelector) {
        let iframe = document.querySelector(`iframe`);
        return iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow.document.querySelector(cssSelector);
    }
    drawShipmentGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        return gvc.bindView({
            bind: "financeInit",
            dataList: [],
            view: () => {
                const BG = document.querySelector(`.guide-BG`);
                switch (vm.step) {
                    case 2: {
                        BG.style.clipPath = ``;
                        const target = document.querySelector(`.guide2-2`);
                        const rect = (target) ? target.getBoundingClientRect() : "";
                        if (rect) {
                            BG.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px ${rect.top}px, 0 ${rect.top}px)`;
                            this.detectClickThrough(target, () => {
                                vm.step = 3;
                                this.gvc.notifyDataChange('financeInit');
                            });
                            return html `
                                <div style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${rect.bottom + 12}px;left: ${rect.right + 12}px;transform: translateY(-100%);z-index:1033;">
                                    <div style="position: relative;border-radius: 10px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22"
                                             viewBox="0 0 18 22" fill="none"
                                             style="position: absolute;bottom: 19px;left: -18px;">
                                            <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z"
                                                  fill="white"/>
                                        </svg>
                                        <div style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;">
                                            金流設定
                                            <div class="d-flex ms-auto align-items-center"
                                                 style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                                步驟 2/6
                                                <svg style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg"
                                                     width="14" height="13" viewBox="0 0 14 13" fill="none"
                                                     onclick="${gvc.event(() => {
                                this.leaveGuide(vm);
                            })}">
                                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;">
                                            點擊<span
                                                style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「金流設定」</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        return ``;
                    }
                    case 3: {
                        BG.style.clipPath = ``;
                    }
                    default: {
                        const target = document.querySelector(`.mainRow1`);
                        const rect = (target) ? target.getBoundingClientRect() : "";
                        console.log("target -- ", target);
                        if (rect) {
                            BG.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px ${rect.top}px, 0 ${rect.top}px)`;
                            this.detectClickThrough(`.mainRow1`, () => {
                                vm.step = 2;
                                this.gvc.notifyDataChange('financeInit');
                            });
                            return html `
                                <div style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${rect.bottom + 12}px;left: ${rect.right + 12}px;transform: translateY(-100%);z-index:1033;">
                                    <div style="position: relative;border-radius: 10px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22"
                                             viewBox="0 0 18 22" fill="none"
                                             style="position: absolute;bottom: 19px;left: -18px;">
                                            <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z"
                                                  fill="white"/>
                                        </svg>
                                        <div style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;">
                                            金流
                                            <div class="d-flex ms-auto align-items-center"
                                                 style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                                步驟 1/6
                                                <svg style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg"
                                                     width="14" height="13" viewBox="0 0 14 13" fill="none"
                                                     onclick="${gvc.event(() => {
                                this.leaveGuide(vm);
                            })}">
                                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;">
                                            點擊<span
                                                style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「商店設定」</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        return ``;
                    }
                }
            }, divCreate: {}
        });
    }
    drawFinanceWayGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        let tempHTML = ``;
        return gvc.bindView({
            bind: "financeInit",
            dataList: [],
            view: () => {
                const that = this;
                const BG = document.querySelector(`.guide-BG`);
                switch (vm.step) {
                    case 2: {
                        BG.style.clipPath = ``;
                        const target = document.querySelector(`.guide2-2`);
                        const rect = (target) ? target.getBoundingClientRect() : "";
                        if (rect) {
                            BG.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px ${rect.top}px, 0 ${rect.top}px)`;
                            this.detectClickThrough(target, () => {
                                vm.step = 3;
                                this.gvc.notifyDataChange('financeInit');
                            });
                            return html `
                                <div style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${rect.bottom + 12}px;left: ${rect.right + 12}px;transform: translateY(-100%);z-index:1033;">
                                    <div style="position: relative;border-radius: 10px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22"
                                             viewBox="0 0 18 22" fill="none"
                                             style="position: absolute;bottom: 19px;left: -18px;">
                                            <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z"
                                                  fill="white"/>
                                        </svg>
                                        <div style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;">
                                            金流設定
                                            <div class="d-flex ms-auto align-items-center"
                                                 style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                                步驟 2/6
                                                <svg style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg"
                                                     width="14" height="13" viewBox="0 0 14 13" fill="none"
                                                     onclick="${gvc.event(() => {
                                this.leaveGuide(vm);
                            })}">
                                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;">
                                            點擊<span
                                                style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「金流設定」</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        return ``;
                    }
                    case 3: {
                        function disableScroll() {
                            that.findIframeDom('.guideOverflow').parentElement.style.overflow = 'hidden';
                        }
                        function enableScroll() {
                            that.findIframeDom('.guideOverflow').parentElement.style.overflow = 'auto';
                        }
                        let iframeRect = undefined;
                        let rect = undefined;
                        let left = undefined;
                        let top = undefined;
                        let right = undefined;
                        let bottom = undefined;
                        BG.style.clipPath = ``;
                        if (tempHTML == ``) {
                            const timer = setInterval(() => {
                                let iframe = document.querySelector(`iframe`);
                                const target = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow.document.querySelector(`.guide2-3`);
                                if (iframe && target) {
                                    iframeRect = iframe.getBoundingClientRect();
                                    rect = target.parentElement.parentElement.getBoundingClientRect();
                                    left = rect.left + iframeRect.left;
                                    top = rect.top + iframeRect.top;
                                    right = rect.right + iframeRect.left;
                                    bottom = rect.bottom + iframeRect.top;
                                    if (target) {
                                        function close() {
                                            enableScroll();
                                            BG.classList.remove(`guide2-3`);
                                        }
                                        this.detectClickThrough(target.parentElement.parentElement, () => {
                                            close();
                                            vm.step++;
                                            this.gvc.notifyDataChange('financeInit');
                                        });
                                        clearInterval(timer);
                                        gvc.addStyle(`
                                            .guide2-3 {
                                                ${this.holeBG(left, right, top, bottom)}
                                            }
                                        `);
                                        disableScroll();
                                        BG.classList.add(`guide2-3`);
                                        tempHTML = html `
                                            <div class="d-flex flex-column"
                                                 style="width: 332px;height: 131px;flex-shrink: 0;position: absolute;left: ${left}px;top:${rect.bottom + iframeRect.top + 12}px;">

                                                <div class="w-100" style="padding-left: 20px;height:24px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18"
                                                         viewBox="0 0 22 18" fill="none">
                                                        <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z"
                                                              fill="#FEAD20"/>
                                                    </svg>
                                                </div>
                                                <div class="w-100" style="border-radius: 10px;">
                                                    <div style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;">
                                                        選擇線下付款
                                                        <div class="d-flex ms-auto align-items-center"
                                                             style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                                            步驟 3/6
                                                            <svg style="cursor: pointer;"
                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                 width="14" height="13" viewBox="0 0 14 13" fill="none"
                                                                 onclick="${gvc.event(() => {
                                            this.leaveGuide(vm);
                                        })}">
                                                                <path d="M1 0.5L13 12.5" stroke="white"
                                                                      stroke-linecap="round"/>
                                                                <path d="M13 0.5L1 12.5" stroke="white"
                                                                      stroke-linecap="round"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;">
                                                        點擊線下付款，設定付款方式
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                        gvc.notifyDataChange(`financeInit`);
                                    }
                                }
                            }, 500);
                        }
                        return tempHTML;
                    }
                    case 4: {
                        console.log(this.findIframeDom('.guide2-4'));
                        let iframe = document.querySelector(`iframe`);
                        let iframeRect = iframe.getBoundingClientRect();
                        let target = this.findIframeDom('.guide2-4');
                        let rect = target.getBoundingClientRect();
                        let left = rect.left + iframeRect.left;
                        let top = rect.top + iframeRect.top;
                        let right = rect.right + iframeRect.left;
                        let bottom = rect.bottom + iframeRect.top;
                        let position = [];
                        BG.classList.add(`guide2-4`);
                        gvc.addStyle(`
                            .guide2-4 {
                                ${this.holeBG(left, right, top, bottom)}
                            }
                        `);
                        return html `
                            <div class="d-flex flex-column"
                                 style="width: 332px;height: 209px;flex-shrink: 0;position: absolute;left: ${left}px;top:${rect.bottom + iframeRect.top + 24}px;">

                                <div class="w-100" style="padding-left: 20px;height:23px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18"
                                         viewBox="0 0 22 18" fill="none">
                                        <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z"
                                              fill="#FEAD20"/>
                                    </svg>
                                </div>
                                <div class="w-100" style="border-radius: 10px;">
                                    <div style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;">
                                        付款方式
                                        <div class="d-flex ms-auto align-items-center"
                                             style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                            步驟 4/6
                                            <svg style="cursor: pointer;"
                                                 xmlns="http://www.w3.org/2000/svg"
                                                 width="14" height="13" viewBox="0 0 14 13" fill="none"
                                                 onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                        })}">
                                                <path d="M1 0.5L13 12.5" stroke="white"
                                                      stroke-linecap="round"/>
                                                <path d="M13 0.5L1 12.5" stroke="white"
                                                      stroke-linecap="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;">
                                        選擇ATM銀行轉帳
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div>上一步</div>
                                            <div>下一步</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    default: {
                        const target = document.querySelector(`.mainRow1`);
                        const rect = (target) ? target.getBoundingClientRect() : "";
                        if (rect) {
                            BG.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px ${rect.top}px, 0 ${rect.top}px)`;
                            this.detectClickThrough(target, () => {
                                vm.step = 2;
                                this.gvc.notifyDataChange('financeInit');
                            });
                            return html `
                                <div style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${rect.bottom + 12}px;left: ${rect.right + 12}px;transform: translateY(-100%);z-index:1033;">
                                    <div style="position: relative;border-radius: 10px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22"
                                             viewBox="0 0 18 22" fill="none"
                                             style="position: absolute;bottom: 19px;left: -18px;">
                                            <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z"
                                                  fill="white"/>
                                        </svg>
                                        <div style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;">
                                            金流
                                            <div class="d-flex ms-auto align-items-center"
                                                 style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
                                                步驟 1/6
                                                <svg style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg"
                                                     width="14" height="13" viewBox="0 0 14 13" fill="none"
                                                     onclick="${gvc.event(() => {
                                this.leaveGuide(vm);
                            })}">
                                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round"/>
                                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;">
                                            點擊<span
                                                style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「商店設定」</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        return ``;
                    }
                }
            }, divCreate: {}
        });
    }
    drawInitGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        return gvc.bindView({
            bind: "init",
            dataList: [{ key: 'step', obj: vm }],
            view: () => {
                let dataList = [{
                        value: "setFinanceWay",
                        title: "金流設定",
                        finished: true
                    }, {
                        value: "shippment_setting",
                        title: "配送設定",
                        finished: false
                    }, {
                        value: "shippment-setting",
                        title: "運費設定",
                        finished: false
                    }, {
                        value: "product-manager",
                        title: "商品上架",
                        finished: false
                    }, {
                        value: "shop_information",
                        title: "商店訊息",
                        finished: false
                    }];
                let count = dataList.filter((data) => {
                    return data.finished;
                }).length;
                ApiShop.getGuide().then(r => {
                    dataList = r.response.value.guideList;
                });
                gvc.addStyle(html `
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
                    background: conic-gradient(#FEAD20 0, #FEAD20 ${count / dataList.length * 100}%, #EAEAEA ${count / dataList.length * 100}%, #EAEAEA);
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
                    transform: translate(0, -55px);
                    }

                    &::after {
                    transform: rotate(${count / dataList.length * 360}deg) translate(0, -55px) ;
                    }
                    }
                `);
                switch (vm.step) {
                    case -1: {
                        const target = document.querySelector(`.indexGuideBTN`);
                        const rect = target.getBoundingClientRect();
                        gvc.addStyle(`
                            .guide-BG {
                                clip-path: polygon(0 0, ${rect.left}px 0, ${rect.left}px ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px 0, 100% 0, 100% 100%, 0 100%);

                            }
                        `);
                        return html `
                            <div class=""
                                 style="width: 317px;height: 157px;position:absolute;top:${rect.bottom + window.scrollY + 12 + 'px'};left : ${rect.left + window.scrollX + 'px'};gap:20px;padding-top: 22px;">
                                <div class="" style="position: absolute;top: 0;left: 20px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18"
                                         fill="none">
                                        <path d="M11 0L21.3923 18H0.607696L11 0Z" fill="#FEAD20"/>
                                    </svg>
                                </div>
                                <div style="display: flex;width: 317px;padding: 24px 32px;;flex-direction: column;justify-content: center;align-items: center;gap: 24px;border-radius: 10px;background: #FEAD20;">
                                    <div style="color: #FFF;font-size: 24px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.96px;">
                                        這裡可以回顧開店導覽
                                    </div>
                                    <div class="border border-danger"
                                         style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;"
                                         onclick="${gvc.event(() => {
                            document.querySelector(`.guide-BG`).remove();
                        })}">
                                        我知道了
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    case 0: {
                        return html `
                            <div style="width: 461px;height:210px;display: flex;flex-direction: column;align-items:center;border-radius: 10px;background: #FEAD20;">
                                <div class="w-100 d-flex align-items-center justify-content-end" style="padding: 16px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13"
                                         fill="none" style="cursor: pointer;" onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                        })}">
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
                                    <div class="d-flex align-items-end"
                                         style="cursor:pointer;;height:100%;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;text-decoration-line: underline;"
                                         onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                        })}">
                                        我已經學會了
                                    </div>
                                    <div style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-weight: 700;line-height: normal;cursor:pointer;"
                                         onclick="${gvc.event(() => {
                            vm.step++;
                        })}">
                                        開店導覽
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    case 1: {
                        return html `
                            <div class="d-flex flex-column"
                                 style="width:588px;border-radius: 10px;background-color: white;">
                                <div class="d-flex w-100 align-items-center"
                                     style="height: 51px;padding: 12px 24px;background: #FEAD20;color: #FFF;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;border-radius: 10px 10px 0 0;">
                                    開店導覽
                                    <svg class="ms-auto" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                         viewBox="0 0 14 14" fill="none" onclick="${gvc.event(() => {
                            this.leaveGuide(vm);
                        })}">
                                        <path d="M1 1L13 13" stroke="white" stroke-linecap="round"/>
                                        <path d="M13 1L1 13" stroke="white" stroke-linecap="round"/>
                                    </svg>
                                </div>
                                <div class=" d-flex flex-column align-items-center justify-content-center"
                                     style="width: 100%;padding:24px;gap:24px;">
                                    <div class="g-container position-relative " style="">
                                        <div class="g-progress"></div>
                                        <div class="g-circle"></div>
                                        <div style="font-size: 25.92px;font-style: normal;font-weight: 700;line-height: normal;color:#393939;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%)">
                                            ${dataList.filter((data) => {
                            return data.finished;
                        }).length}/${dataList.length}
                                        </div>
                                    </div>
                                    <div class="d-flex flex-column justify-content-start" style="gap:16px;">
                                        <div style="font-size: 18px;font-style: normal;font-weight: 700;line-height: normal;">
                                            完成以下設定，即可開張您的商店
                                        </div>
                                        ${gvc.bindView({
                            bind: "guideDirect",
                            view: () => {
                                return dataList.map((data) => {
                                    return html `
                                                        <div style="padding: 6px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;cursor: pointer; ${data.finished ? 'border: 2px solid #393939;color:#393939;' : 'color:#8D8D8D;'}"
                                                             onclick="${gvc.event(() => {
                                        this.guide = 1;
                                        this.drawBG();
                                    })}">
                                                            ${data.title}
                                                        </div>
                                                    `;
                                }).join('');
                            },
                            divCreate: {
                                class: `d-flex w-100 align-items-center`,
                                style: `gap:10px;color:#8D8D8D;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;`
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
                                        url: ``
                                    },
                                    {
                                        title: `管理主題庫`,
                                        des: `可根據需求新增及切換官網主題`,
                                        url: ``
                                    },
                                ];
                                return html `
                                                    <div style="font-size: 18px;font-style: normal;font-weight: 700;line-height: normal;">
                                                        其他導覽
                                                    </div>
                                                    ${dataList.map((data) => {
                                    return html `
                                                            <div class="w-100"
                                                                 style="display: flex;align-items: center;gap: 24px;">
                                                                <div class="d-flex flex-column"
                                                                     style="gap:2px;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;color:#393939">
                                                                    ${data.title}
                                                                    <div class=""
                                                                         style="font-size: 14px;font-style: normal;font-weight: 400;line-height: normal;color:#8D8D8D">
                                                                        ${data.des}
                                                                    </div>
                                                                </div>
                                                                <div class="ms-auto"
                                                                     style="color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;padding: 6px 18px;border-radius: 10px;border: 1px solid #FEAD20;background: #FFF;">
                                                                    前往
                                                                </div>
                                                            </div>
                                                        `;
                                }).join('')}

                                                `;
                            },
                            divCreate: { style: `display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-self: stretch;` }
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13"
                                 fill="none" style="cursor: pointer;" onclick="${gvc.event(() => {
                    this.leaveGuide(vm);
                })}">
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
                            <div class="d-flex align-items-end"
                                 style="height:100%;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;text-decoration-line: underline;cursor: pointer;">
                                我已經學會了
                            </div>
                            <div style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-weight: 700;line-height: normal;cursor: pointer;">
                                開店導覽
                            </div>
                        </div>
                    </div>
                `;
            }, divCreate: {}
        });
    }
    drawBG() {
        let body = document.querySelector('.editorContainer');
        if (body && !document.querySelector('.guide-BG')) {
            body.innerHTML += html `
                <div class="guide-BG d-flex align-items-center justify-content-center"
                     style="width:100vw;height: 100vh;background: rgba(0, 0, 0, 0.60);position: absolute;left: 0;top: 0;z-index:1031;"
                     onclick="${this.gvc.event(() => {
            })}">

                </div>
            `;
        }
        const innerHTML = this.guidePage[this.guide].innerHTML();
        document.querySelector('.guide-BG').innerHTML = innerHTML !== null && innerHTML !== void 0 ? innerHTML : ``;
        return html `
        `;
    }
    drawGuide() {
        const that = this;
        const timer = setInterval(function () {
            if (document.querySelector('iframe')) {
                that.drawBG();
                clearInterval(timer);
            }
        }, 1000);
        return html ``;
    }
}
