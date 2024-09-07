import { GVC } from '../glitterBundle/GVController.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { all } from 'underscore/index.js';

const html = String.raw;

export class BgGuide {
    public guide: number;
    public step: number;
    public gvc: GVC;
    private guidePage = [
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
    private eventSet: any = [];

    constructor(gvc: GVC, guide: number) {
        this.guide = guide;
        this.gvc = gvc;
        this.step = 0;
    }

    public detectClickThrough(target: any, clickEvent: () => void, cover?: boolean) {
        target.classList.add('guideClickListen');
        const handleClick = () => {
            setTimeout(() => {
                clickEvent();
                this.eventSet = this.eventSet.filter((d: any) => {
                    return d !== handleClick;
                });
                target!.removeEventListener('click', handleClick);
            }, 0);
        };
        target!.addEventListener('click', handleClick);
        this.eventSet.push(() => {
            target!.removeEventListener('click', handleClick);
        });
    }

    public detectOninputThrough(target: any, clickEvent: () => void) {
        const handleClick = () => {
            setTimeout(() => {
                if (target.value.length > 0) {
                    clickEvent();
                    this.eventSet = this.eventSet.filter((d: any) => {
                        return d !== handleClick;
                    });
                    target!.removeEventListener('input', handleClick);
                }
            }, 0);
        };
        target!.addEventListener('input', handleClick);
        this.eventSet.push(() => {
            target!.removeEventListener('input', handleClick);
        });
    }

    public leaveGuide(vm?: any) {
        vm.step = -1;
        if (vm.guide == 0) {
        } else {
            const element = document.querySelector('.guide-BG');

            this.eventSet.forEach((del: any) => {
                del();
            });
            element!.remove();
            vm.step = 1;
            this.guide = 0;
            this.drawBG();
        }

        // const clickInterface = document.querySelector('.clickInterface');
        // if (element) {
        //     if (vm.step){
        //         vm.step = -1;
        //     }

        // clickInterface!.remove()
        // }
    }

    public holeBG(left: number, right: number, top: number, bottom: number) {
        return `clip-path: polygon(0% 0%, 0% 100%, ${left.toFixed(0)}px 100%, ${left.toFixed(0)}px ${top.toFixed(0)}px, ${right.toFixed(0)}px ${top.toFixed(0)}px, ${right.toFixed(
            0
        )}px ${bottom.toFixed(0)}px, ${left.toFixed(0)}px ${bottom.toFixed(0)}px, ${left.toFixed(0)}px 100%, 100% 100%, 100% 0%);`;
    }

    //畫兩個洞的
    public holeTwoBG(
        first: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        },
        second: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        }
    ) {
        return `clip-path: polygon(0 0, 0 ${first.y1}px, ${first.x2}px ${first.y1}px, ${first.x2}px ${first.y2}px, 0 ${first.y2}px, 0 100%, ${second.x1}px 100%, ${second.x1}px ${second.y1}px, ${second.x2}px ${second.y1}px, ${second.x2}px ${second.y2}px, ${second.x1}px ${second.y2}px, ${second.x1}px 100%, 100% 100%, 100% 0%);`;
    }

    public preventDefault(e: any) {
        e.preventDefault();
    }

    public findPageIframe(): any {
        const iframes = document.querySelectorAll(`iframe`);
        let iframe = undefined;
        iframes.forEach((element, index) => {
            if (index === 0 || (element && element.src.includes(this.gvc.glitter.getUrlParameter('tab')))) {
                iframe = element;
            }
        });
        return iframe;
    }

    public findIframeDom(cssSelector: string) {
        return this.findPageIframe().contentWindow.document.querySelector(cssSelector);
    }

    public disableScroll() {
        this.findIframeDom('.guideOverflow').parentElement.style.overflow = 'hidden';
    }

    public enableScroll() {
        this.findIframeDom('.guideOverflow').parentElement.style.overflow = 'auto';
    }

    public finGuide(key: string) {
        ApiShop.getGuide().then((r) => {
            let dataList = r.response.value;
            let target: any = dataList.find((data: any) => {
                return data.value === key;
            });
            target.finished = true;
            ApiShop.setGuide(dataList);
        });
    }

    // 大部分用於step1，用於點擊左列大項次的教學
    private drawMainRowBG(BG: HTMLElement, vm: any, targetSelector: string, viewID: string, step: number, title?: string) {
        const target = document.querySelector(targetSelector) as HTMLElement;
        const rect = target ? target!.getBoundingClientRect() : '';
        if (rect) {
            BG.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px ${rect.top}px, 0 ${rect.top}px)`;
            this.detectClickThrough(target, () => {
                vm.step = 2;
                this.gvc.notifyDataChange(viewID);
            });
            return html`
                <div
                    style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${rect.bottom +
                    12}px;left: ${rect.right + 12}px;transform: translateY(-100%);z-index:1033;"
                >
                    <div style="position: relative;border-radius: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22" fill="none" style="position: absolute;bottom: 19px;left: -18px;">
                            <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z" fill="white" />
                        </svg>
                        <div
                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                        >
                            ${title ? title : '商店設定'}
                            <div class="d-flex ms-auto align-items-center" style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
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
                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div
                            style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                        >
                            點擊<span style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「${title ? title : '商店設定'} 」</span>
                        </div>
                    </div>
                </div>
            `;
        }
        return ``;
    }

    // 大部分用於step2，用於點擊左列次項次的教學
    private drawSecondRowBG(BG: HTMLElement, vm: any, targetSelector: string, viewID: string, title: string, step: number) {
        BG.style.clipPath = ``;
        const gvc = this.gvc;
        const target = document.querySelector(targetSelector) as HTMLElement;
        const rect = target ? target!.getBoundingClientRect() : '';
        if (rect) {
            BG.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px ${rect.top}px, 0 ${rect.top}px)`;
            this.detectClickThrough(target, () => {
                vm.step = 3;
                BG.style.clipPath = ``;
                this.gvc.notifyDataChange(viewID);
            });
            return html`
                <div
                    style="padding-left: 18px;width: 350px;height: 113px;flex-shrink: 0;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));position: absolute;top: ${rect.bottom +
                    12}px;left: ${rect.right + 12}px;transform: translateY(-100%);z-index:1033;"
                >
                    <div style="position: relative;border-radius: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22" fill="none" style="position: absolute;bottom: 19px;left: -18px;">
                            <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z" fill="white" />
                        </svg>
                        <div
                            style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                        >
                            ${title}
                            <div class="d-flex ms-auto align-items-center" style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
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
                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <div
                            style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                        >
                            點擊<span style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「${title} 」</span>
                        </div>
                    </div>
                </div>
            `;
        }
        return ``;
    }

    // 大部分用於視窗在下方的教學
    private drawBGwithBelowWindow(
        BG: HTMLElement,
        vm: any,
        targetSelector: string,
        viewID: string,
        step: number,
        allStep: number,
        window: {
            width: number;
            height: number;
            title: string;
            content: string;
            next?: boolean;
            disable?: boolean;
            alignment?: string;
            btnText?: string;
            preview?: boolean;
            previewEvent?: () => void;
            nextEvent?: () => void;
            cover?: boolean;
        },
        closeEvent?: () => void
    ) {
        let gvc = this.gvc;

        function close() {
            if (closeEvent) {
                closeEvent();
            }
            if (window.cover) {
                if (document.querySelector('.clickInterface')) {
                    document!.querySelector('.clickInterface')!.remove();
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
                $(body).append(html`
                    <div class="clickInterface" style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index: 1030;cursor: pointer;" onclick="${gvc.event(() => {})}"></div>
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
        return html`
            <div class="d-flex flex-column" style="width: ${window.width}px;height: ${window.height}px;flex-shrink: 0;position: absolute;${winPosition()};">
                <div class="w-100" style="padding-left: ${arrowPosition()}px;height:23px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                        <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z" fill="#FEAD20" />
                    </svg>
                </div>
                <div class="w-100" style="border-radius: 10px;">
                    <div
                        style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                    >
                        ${window.title}
                        <div class="d-flex ms-auto align-items-center" style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
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
                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                            </svg>
                        </div>
                    </div>
                    <div
                        class="d-flex flex-column w-100"
                        style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal"
                    >
                        ${window.content}
                        <div class="d-flex align-items-center justify-content-between w-100" style="margin-top: 24px;height:52px;">
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
                            <div class="${window.next ? 'd-none' : 'd-flex'} align-items-center justify-content-center ms-auto" style="width: 96px;height: 46px;">
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
                                    ${window.btnText ?? '下一步'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 用於按下儲存按鈕的教學
    private drawFinBG(BG: HTMLElement, vm: any, targetSelector: string, viewID: string, step: number, key: string) {
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
            close();
            this.leaveGuide(vm);
            this.finGuide(key);
        });
        return html`
            <div class="d-flex flex-column" style="width: 332px;height: 200px;flex-shrink: 0;position: absolute;right: 18px;bottom:90px;)">
                <div class="w-100" style="border-radius: 10px;">
                    <div
                        style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                    >
                        儲存
                        <div class="d-flex ms-auto align-items-center" style="gap:10px;color: #FFF;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;letter-spacing: 0.64px;">
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
                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                            </svg>
                        </div>
                    </div>
                    <div
                        class="d-flex flex-column w-100"
                        style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                    >
                        <div class="d-flex">點擊<span style="font-weight: 700;">儲存</span>按鈕，完成設定</div>
                        <div class="d-flex align-items-center justify-content-between" style="margin-top: 24px;height:52px;">
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
                            <div class="d-flex align-items-center justify-content-center" style="width: 96px;height: 46px;"></div>
                        </div>
                    </div>
                </div>
                <div class="w-100 d-flex justify-content-end" style="padding-right: 20px;height:23px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                        <path d="M11 18L21.3923 -1.90735e-06L0.607696 -1.90735e-06L11 18Z" fill="white" />
                    </svg>
                </div>
            </div>
        `;
    }

    //佈置官網設定
    public drawLayoutGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        let totalStep = 7;
        return gvc.bindView({
            bind: 'layoutInit',
            dataList: [],
            view: () => {
                let viewID = 'layoutInit';
                let iframe = this.findPageIframe();

                const BG = document.querySelector(`.guide-BG`) as HTMLElement;
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

                        return this.drawBGwithBelowWindow(
                            BG,
                            vm,
                            '.guide7-3',
                            viewID,
                            totalStep - 1,
                            totalStep,
                            {
                                width: 332,
                                height: 209,
                                title: '當前主題',
                                content: '為當前首頁套用的主題資訊',
                                cover: true,
                            },
                            () => {}
                        );
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
                        let content = html`
                            <div class="d-flex flex-wrap" style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;">
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

                        let target1 = document.querySelector(`.mainRow9`);
                        let rect = target1!.getBoundingClientRect();

                        let target2 = this.findIframeDom(`.guide7-1`);
                        let iframeRect = iframe.getBoundingClientRect();

                        this.detectClickThrough(target1, () => {
                            close();
                            totalStep = 4;
                            vm.step = 2;
                            gvc.notifyDataChange(viewID);
                        });
                        if (target2) {
                            let rect2 = target2!.getBoundingClientRect();
                            let cssStyle = this.holeTwoBG(
                                {
                                    x1: rect.left,
                                    x2: rect.right,
                                    y1: rect.top,
                                    y2: rect.bottom,
                                },
                                {
                                    x1: iframeRect.left + rect2.left - 12,
                                    x2: iframeRect.left + rect2.right + 12,
                                    y1: iframeRect.top + rect2.top - 12,
                                    y2: iframeRect.top + rect2.bottom + 12,
                                }
                            );
                            BG.classList.add('guide7-1');

                            this.detectClickThrough(target2, () => {
                                close();
                                vm.step = 3;
                                gvc.notifyDataChange(viewID);
                            });
                            gvc.addStyle(`
                                .guide7-1{
                                    ${cssStyle}
                                }
                            `);
                            return html`
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
                                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div
                                            style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                                        >
                                            點擊<span style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「品牌官網」</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        return this.drawMainRowBG(BG, vm, `.mainRow9`, viewID, 5, '品牌官網');
                    }
                }
            },
            divCreate: {},
        });
    }

    //主題庫設定
    public drawThemeGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        let totalStep = 7;
        return gvc.bindView({
            bind: 'layoutInit',
            dataList: [],
            view: () => {
                let viewID = 'layoutInit';
                let iframe = this.findPageIframe();

                const BG = document.querySelector(`.guide-BG`) as HTMLElement;
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

                        return this.drawBGwithBelowWindow(
                            BG,
                            vm,
                            '.guide7-3',
                            viewID,
                            totalStep - 5,
                            totalStep,
                            {
                                width: 332,
                                height: 209,
                                title: '當前主題',
                                content: '為當前首頁套用的主題資訊',
                                cover: true,
                            },
                            () => {}
                        );
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
                        let content = html`
                            <div class="d-flex flex-wrap" style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;">
                                點擊<span style="font-weight: 700;">自訂</span>，可前往<span style="font-weight: 700;">頁面編輯器頁面</span>，自由將官網編輯成您理想中的模樣
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.guide7-4', viewID, totalStep - 4, totalStep, {
                            width: 332,
                            height: 235,
                            title: '自訂主題',
                            content: content,
                            alignment: 'left',
                            cover: true,
                        });
                    }
                    case 5: {
                        let target = this.findIframeDom(`.guide8-5`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide8-5`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }

                        let content = html`
                            <div class="" style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                在<span style="font-weight: 700;">佈景主題庫</span>儲存並管理多個設計主題，可根據需求靈活切換應用，展現多樣視覺效果，增強品牌吸引力
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.guide8-5', viewID, totalStep - 3, totalStep, { width: 439, height: 261, title: '自訂主題', content: content, cover: true });
                    }
                    case 6: {
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
                        let content = html`
                            <div class="" style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                滑鼠移入喜歡的主題後點擊<span style="font-weight: 700;">新增</span>
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.themeGroup', viewID, totalStep - 2, totalStep, { width: 439, height: 261, title: '選擇主題', content: content });
                    }
                    case 7: {
                        let target = this.findIframeDom(`.guide8-5`);
                        if (!target) {
                            const timer = setInterval(() => {
                                if (this.findIframeDom(`.guide8-5`)) {
                                    clearInterval(timer);
                                    gvc.notifyDataChange(viewID);
                                }
                            }, 400);
                        }
                        target.parentElement.scrollIntoView();
                        let content = html`
                            <div class="" style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
                                您可以對剛新增的主題進行操作，如自定義樣式、切換、複製及下載等等
                            </div>
                        `;
                        return this.drawBGwithBelowWindow(BG, vm, '.guide8-5', viewID, totalStep - 1, totalStep, { width: 439, height: 261, title: '管理主題庫', content: content });
                    }
                    case 8: {
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

                        let content = html`
                            <div class="" style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;white-space: normal">
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
                    case 9: {
                        return html` <div
                            class="d-flex flex-column align-items-center justify-content-center"
                            style="width: 492px;height: 307px;flex-shrink: 0;border-radius: 10px;background: #FFF;padding: 36px 64px;"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 76 75" fill="none">
                                <g clip-path="url(#clip0_12208_36243)">
                                    <path
                                        d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z"
                                        fill="#393939"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_12208_36243">
                                        <rect width="75" height="75" fill="white" transform="translate(0.5)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div style="font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;color:#393939;margin-top: 24px;">是否刪除導覽新增的主題？</div>
                            <div style="color: #8D8D8D;font-size: 14px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.56px;margin-top: 8px;">
                                ※您已按照教學導覽新增了一個主題。<br />
                                若無需使用，建議刪除以保持主題庫整潔。
                            </div>
                            <div class="d-flex align-items-center justify-content-center" style="margin-top: 24px;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;gap:14px;">
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
                    default: {
                        function close() {
                            BG.classList.remove('guide7-1');
                        }

                        let target1 = document.querySelector(`.mainRow9`);
                        let rect = target1!.getBoundingClientRect();

                        let target2 = this.findIframeDom(`.guide7-1`);
                        let iframeRect = iframe.getBoundingClientRect();

                        this.detectClickThrough(target1, () => {
                            close();
                            totalStep = 9;
                            vm.step = 2;
                            gvc.notifyDataChange(viewID);
                        });
                        if (target2) {
                            let rect2 = target2!.getBoundingClientRect();
                            let cssStyle = this.holeTwoBG(
                                {
                                    x1: rect.left,
                                    x2: rect.right,
                                    y1: rect.top,
                                    y2: rect.bottom,
                                },
                                {
                                    x1: iframeRect.left + rect2.left - 12,
                                    x2: iframeRect.left + rect2.right + 12,
                                    y1: iframeRect.top + rect2.top - 12,
                                    y2: iframeRect.top + rect2.bottom + 12,
                                }
                            );
                            BG.classList.add('guide7-1');

                            this.detectClickThrough(target2, () => {
                                close();
                                vm.step = 3;
                                gvc.notifyDataChange(viewID);
                            });
                            gvc.addStyle(`
                                .guide7-1{
                                    ${cssStyle}
                                }
                            `);
                            return html`
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
                                                    <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                                    <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div
                                            style="background: #FFF;width:100%;padding: 18px 24px;display: flex;align-items: center;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%; /* 25.6px */letter-spacing: 0.64px;"
                                        >
                                            點擊<span style="font-style: normal;font-weight: 700;line-height: 160%;letter-spacing: 0.64px;">「品牌官網」</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        return this.drawMainRowBG(BG, vm, `.mainRow9`, viewID, totalStep, '品牌官網');
                    }
                }
            },
            divCreate: {},
        });
    }

    //網站資料設定
    public drawMessageGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        return gvc.bindView({
            bind: 'messageInit',
            dataList: [],
            view: () => {
                let viewID = 'messageInit';
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`) as HTMLElement;
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

                        return this.drawBGwithBelowWindow(
                            BG,
                            vm,
                            '.guide6-3',
                            viewID,
                            3,
                            5,
                            {
                                width: 332,
                                height: 209,
                                title: '商店基本資訊',
                                content: '在這裡可以修改商店的基本訊息',
                            },
                            () => {}
                        );
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
                        return this.drawBGwithBelowWindow(BG, vm, '.guide6-4', viewID, 4, 5, { width: 332, height: 209, title: 'SEO設定', content: '完善SEO系統，提升網站的曝光度。' });
                    }
                    case 5: {
                        let target = this.findIframeDom(`.guide6-5`);
                        target.parentElement.scrollIntoView({});

                        return this.drawBGwithBelowWindow(
                            BG,
                            vm,
                            '.guide6-5',
                            viewID,
                            5,
                            5,
                            {
                                width: 332,
                                height: 209,
                                title: '網域設定',
                                content: '您可以選擇使用免費的子網域，或是額外付費申請獨立網域',
                                btnText: '完成',
                            },
                            () => {
                                this.finGuide('shop_information');
                                this.leaveGuide(vm);
                            }
                        );
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow1`, viewID, 5);
                    }
                }
            },
            divCreate: {},
        });
    }

    //產品上架設定
    public drawProductGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        return gvc.bindView({
            bind: 'productInit',
            dataList: [],
            view: () => {
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`) as HTMLElement;
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
                        let content = html`
                            <div class="d-flex" style="font-weight: 400;line-height: 160%;letter-spacing: 0.64px;">點擊<span style="font-weight: 700;">新增</span>，填寫商品詳細資訊</div>
                        `;
                        this.detectClickThrough(target, () => {
                            vm.step++;
                            BG.classList.remove('guide5-3');
                            gvc.notifyDataChange('productInit');
                        });
                        if (target) {
                            return this.drawBGwithBelowWindow(
                                BG,
                                vm,
                                '.guide5-3',
                                'productInit',
                                3,
                                8,
                                {
                                    width: 332,
                                    height: 209,
                                    title: '上架商品',
                                    content: content,
                                    alignment: 'left',
                                    next: true,
                                },
                                () => {}
                            );
                        } else {
                            return this.drawBGwithBelowWindow(
                                BG,
                                vm,
                                '.guide5-3',
                                'productInit',
                                3,
                                8,
                                {
                                    width: 332,
                                    height: 209,
                                    title: '上架商品',
                                    content: '輸入商品名稱',
                                    disable: true,
                                },
                                () => {}
                            );
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
                            return this.drawBGwithBelowWindow(BG, vm, '.guide5-4', 'productInit', 4, 8, { width: 332, height: 209, title: '商品名稱', content: '輸入商品名稱', preview: true });
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
                                title: '販售價格',
                                content: '輸入商品的販售價格',
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
                            title: '販售價格',
                            content: '輸入商品的販售價格',
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
                            content: '選擇此商品的運費計算方式',
                            next: true,
                        });
                    }
                    case 7: {
                        let target = this.findIframeDom('.guide5-7');
                        const inputGroup = target.querySelectorAll('input');
                        target.parentElement.parentElement.scrollIntoView({});
                        let check = true;
                        inputGroup.forEach((el: any) => {
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
                        return this.drawFinBG(BG, vm, 'guide5-8', 'productInit', 8, 'product-manager');
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow2`, 'productInit', 8, '商品管理');
                    }
                }
            },
            divCreate: {},
        });
    }

    //運費設定
    public drawLogisticsGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        return gvc.bindView({
            bind: 'logisticsInit',
            dataList: [],
            view: () => {
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`) as HTMLElement;
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

                        function drawHole(left: number, right: number, y1: number, y2: number, y3: number, y4: number) {
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
                        return html`
                            <div class="d-flex flex-column" style="width: 440px;height: 218px;flex-shrink: 0;position: absolute;left: ${mid - 220}px;top:${(bottom + top2) / 2 - 109}px;">
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
                                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        class="d-flex flex-column w-100"
                                        style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                                    >
                                        開啟您要使用的配送方式
                                        <div class="d-flex align-items-center justify-content-between" style="margin-top: 24px;height:52px;">
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
                                            <div class="d-flex align-items-center justify-content-center" style="width: 96px;height: 46px;">
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
                        return this.drawBGwithBelowWindow(BG, vm, '.guide4-4', 'logisticsInit', 4, 8, { width: 332, height: 209, title: '填寫材積區間', content: '填寫材積的運費計算區間' });
                    }
                    case 5: {
                        return this.drawBGwithBelowWindow(BG, vm, '.guide4-5', 'logisticsInit', 5, 8, { width: 332, height: 209, title: '新增計算區間', content: '點擊藍字即可新增一個計算區間' });
                    }
                    case 6: {
                        let target = this.findIframeDom('.guide4-6');
                        const handleClick = (event: any) => {
                            this.eventSet = this.eventSet.filter((d: any) => {
                                return d !== handleClick;
                            });
                            target!.removeEventListener('click', handleClick);
                            // (event as any).preventDefault()
                            return;
                        };
                        target!.addEventListener('click', handleClick);
                        this.eventSet.push(() => {
                            target!.removeEventListener('click', handleClick);
                        });
                        let content = html`
                            <div class="d-flex align-items-center" style="">
                                點擊
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" style="margin:0 6px;" fill="none">
                                    <path d="M1 1L13 13" stroke="#8D8D8D" stroke-linecap="round" />
                                    <path d="M13 1L1 13" stroke="#8D8D8D" stroke-linecap="round" />
                                </svg>
                                可以刪除計算區間
                            </div>
                        `;
                        let body = document.querySelector('.editorContainer');
                        if (body && !document.querySelector('.clickInterface')) {
                            $(body).append(html`
                                <div
                                    class="clickInterface"
                                    style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index: 1030;cursor: pointer;"
                                    onclick="${gvc.event(() => {
                                        if (document.querySelector('.breathing-light')) {
                                            (document.querySelector('.breathing-light') as HTMLElement).click();
                                        }
                                    })}"
                                ></div>
                            `);
                        }
                        return this.drawBGwithBelowWindow(
                            BG,
                            vm,
                            '.guide4-6',
                            'logisticsInit',
                            6,
                            8,
                            {
                                width: 332,
                                height: 209,
                                title: '刪除計算區間',
                                content: content,
                                next: true,
                            },
                            () => {
                                if (document.querySelector('.clickInterface')) {
                                    document!.querySelector('.clickInterface')!.remove();
                                }
                            }
                        );
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
                        return this.drawFinBG(BG, vm, 'guide4-8', 'logisticsInit', 8, 'logistics_setting');
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow1`, 'logisticsInit', 8);
                    }
                }
            },
            divCreate: {},
        });
    }

    //配送畫面設定
    public drawShipmentGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        const that = this;
        return gvc.bindView({
            bind: 'shipInit',
            dataList: [],
            view: () => {
                let iframe = this.findPageIframe();
                const BG = document.querySelector(`.guide-BG`) as HTMLElement;
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
                        return this.drawSecondRowBG(BG, vm, `.guide3-2`, 'shipInit', '配送設定', 5);
                    }
                    case 3: {
                        function close() {
                            BG.classList.remove(`guide3-3`);
                            clearInterval(timer);
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
                        let mid = (right + left) / 2;
                        let checked = target.querySelector('input[checked]');
                        gvc.addStyle(`
                            .guide3-3 {
                                ${this.holeBG(left, right, top, bottom)}
                            }
                        `);
                        const timer = setInterval(() => {
                            checked = target.querySelector('input[checked]');
                        }, 500);
                        BG.classList.add(`guide3-3`);
                        return html`
                            <div class="d-flex flex-column" style="width: 332px;height: 209px;flex-shrink: 0;position: absolute;left: ${mid - 166}px;top:${rect.bottom + iframeRect.top + 24}px;">
                                <div class="w-100" style="padding-left: 155px;height:23px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                        <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z" fill="#FEAD20" />
                                    </svg>
                                </div>
                                <div class="w-100" style="border-radius: 10px;">
                                    <div
                                        style="display: flex;padding: 12px 24px;gap: 10px;width: 100%;background: #FEAD20;border-radius: 10px 10px 0 0;color:white;font-size: 20px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.8px;"
                                    >
                                        選擇配送方式
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
                                                onclick="${gvc.event(() => {
                                                    close();
                                                    this.leaveGuide(vm);
                                                })}"
                                            >
                                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        class="d-flex flex-column w-100"
                                        style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                                    >
                                        開啟您要使用的配送方式
                                        <div class="d-flex align-items-center justify-content-between" style="margin-top: 24px;height:52px;">
                                            <div
                                                style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                onclick="${gvc.event(() => {
                                                    vm.step--;
                                                    close();
                                                    gvc.notifyDataChange('shipInit');
                                                })}"
                                            >
                                                上一步
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center" style="width: 96px;height: 46px;">
                                                <div
                                                    class="breathing-light"
                                                    style="padding: 6px 18px;border-radius: 10px;${checked
                                                        ? `background: #FEAD20;`
                                                        : `background: #FFE9B2;opacity: 0.8;`};color: #FFF; ;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                    onclick="${gvc.event(() => {
                                                        if (!checked) {
                                                            return;
                                                        }
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
                        function close() {
                            BG.classList.remove(`guide3-4`);
                            that.findIframeDom('.innerGuide')!.remove();
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
                        const child_gvc: GVC = (document.querySelector(`iframe`)!.contentWindow as any).glitter.pageConfig[0].gvc;
                        $(target).append(
                            child_gvc.bindView({
                                bind: `guide3-4`,
                                view: () => {
                                    return html`
                                        <div
                                            class="d-flex flex-column"
                                            style="width: 332px;height: 209px;flex-shrink: 0;position: absolute;left: 50%;bottom:30px;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));transform: translate(-50%,0%);z-index: 1;"
                                        >
                                            <div class="w-100" style="padding-left: 155px;height:23px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                                    <path d="M11.002 0L21.3943 18L0.609648 18L11.002 0Z" fill="#FEAD20" />
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
                                                            <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                                            <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div
                                                    class="d-flex flex-column w-100"
                                                    style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                                                >
                                                    填寫詳細配送說明，將會出現在結帳頁供顧客閱讀
                                                    <div class="d-flex align-items-center justify-content-between" style="margin-top: 24px;height:52px;">
                                                        <div
                                                            style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                            onclick="${child_gvc.event(() => {
                                                                vm.step--;
                                                                close();
                                                                that.findIframeDom('.guide3-3').parentElement!.scrollIntoView({});
                                                                gvc.notifyDataChange('shipInit');
                                                            })}"
                                                        >
                                                            上一步
                                                        </div>
                                                        <div class="d-flex align-items-center justify-content-center" style="width: 96px;height: 46px;">
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
                            })
                        );
                        return ``;
                    }
                    case 5: {
                        return this.drawFinBG(BG, vm, 'guide3-5', 'shipInit', 5, 'shippment_setting');
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow1`, 'shipInit', 5);
                    }
                }
            },
            divCreate: {},
        });
    }

    //金流畫面設定
    public drawFinanceWayGuide() {
        let gvc = this.gvc;
        let vm = {
            guide: this.guide,
            step: this.step,
        };
        let viewID = 'financeInit';
        let tempHTML = ``;
        return gvc.bindView({
            bind: viewID,
            dataList: [],
            view: () => {
                const that = this;
                const BG = document.querySelector(`.guide-BG`) as HTMLElement;
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

                        if ((target.querySelector('input') as HTMLInputElement).checked) {
                            let body = document.querySelector('.editorContainer');
                            if (body && !document.querySelector('.clickInterface')) {
                                $(body).append(html`
                                    <div
                                        class="clickInterface"
                                        style="height: 100vh;width: 100vw;position: fixed;left: 0;top: 0;z-index: 1030;cursor: pointer;"
                                        onclick="${gvc.event(() => {
                                            if (document.querySelector('.breathing-light')) {
                                                (document.querySelector('.breathing-light') as HTMLElement).click();
                                            }
                                        })}"
                                    ></div>
                                `);
                            }
                        } else {
                            this.detectClickThrough(target, () => {
                                (target.querySelector('input') as HTMLInputElement).checked = true;
                                vm.step++;
                                gvc.notifyDataChange(`financeInit`);
                            });
                        }

                        return this.drawBGwithBelowWindow(
                            BG,
                            vm,
                            '.guide2-3',
                            'financeInit',
                            3,
                            6,
                            {
                                width: 332,
                                height: 199,
                                title: '付款方式',
                                content: '選擇ATM銀行轉帳',
                                next: true,
                            },
                            () => {
                                if (document.querySelector('.clickInterface')) {
                                    document!.querySelector('.clickInterface')!.remove();
                                }
                            }
                        );
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
                        this.detectClickThrough(target, () => {
                            BG.classList.remove('guide2-4');
                            vm.step++;
                            gvc.notifyDataChange(`financeInit`);
                        });
                        target.parentElement.parentElement.scrollIntoView();
                        let content = html`
                            <div class="d-flex align-items-center">
                                點擊
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="8" viewBox="0 0 13 8" fill="none" style="margin: 0 6px;">
                                    <path d="M12 1.5L6.5 6.5L1 1.5" stroke="#393939" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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

                            // that.enableScroll();
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
                            let bottom = iframeRect.bottom - 175;
                            // this.disableScroll();
                            BG.classList.add('guide2-5');
                            target.classList.add(`position-relative`);
                            const child_gvc: GVC = iframe.contentWindow.glitter.pageConfig[0].gvc;
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
                            $(target).append(
                                child_gvc.bindView({
                                    bind: `guide2-5`,
                                    view: () => {
                                        let inputGroup = target.querySelectorAll('input');
                                        let allCheck = true;
                                        inputGroup.forEach((el: HTMLInputElement) => {
                                            if (el.value.length == 0) {
                                                allCheck = false;
                                                this.detectOninputThrough(el, () => {
                                                    child_gvc.notifyDataChange(`guide2-5`);
                                                });
                                            }
                                        });
                                        return html`
                                            <div class="d-flex  " style="width: 457px;height: 191px;flex-shrink: 0;position: absolute;right: 32px;bottom:88px;z-index:1;">
                                                <div class="h-100 d-flex align-items-center justify-content-center" style="width: 24px;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="22" viewBox="0 0 18 22" fill="none">
                                                        <path d="M-5.24537e-07 11L18 0.607696L18 21.3923L-5.24537e-07 11Z" fill="white" />
                                                    </svg>
                                                </div>

                                                <div class="flex-fill " style="border-radius: 10px;filter: drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.15));">
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
                                                                    this.leaveGuide(vm);
                                                                })}"
                                                            >
                                                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="d-flex flex-column w-100 "
                                                        style="background: #FFF;width:100%;padding: 18px 24px;border-radius: 0 0 10px 10px;font-size: 16px;font-style: normal;font-weight: 400;line-height: 160%;letter-spacing: 0.64px;"
                                                    >
                                                        填寫銀行資訊及付款說明
                                                        <div class="d-flex align-items-center justify-content-between" style="margin-top: 24px;height:52px;">
                                                            <div
                                                                style="padding: 6px 18px;border-radius: 10px;border:solid 1px #FEAD20;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                                onclick="${child_gvc.event(() => {
                                                                    let iframe = this.findPageIframe();
                                                                    const openGroup = iframe?.contentWindow.document.querySelectorAll('.openIt');
                                                                    openGroup.forEach((el: any) => {
                                                                        el.classList.toggle('openIt');
                                                                    });
                                                                    close();
                                                                    setTimeout(() => {
                                                                        this.findIframeDom('.guide2-4').scrollIntoView({});
                                                                        vm.step--;

                                                                        gvc.notifyDataChange('financeInit');
                                                                    }, 400);
                                                                })}"
                                                            >
                                                                上一步
                                                            </div>
                                                            ${allCheck
                                                                ? html`
                                                                      <div class="d-flex align-items-center justify-content-center" style="width: 96px;height: 46px;">
                                                                          <div
                                                                              class="breathing-light"
                                                                              style="padding: 6px 18px;border-radius: 10px;background: #FEAD20;color: #FFF;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                                                              onclick="${child_gvc.event(() => {
                                                                                  vm.step++;
                                                                                  close();
                                                                                  gvc.notifyDataChange('financeInit');
                                                                              })}"
                                                                          >
                                                                              下一步
                                                                          </div>
                                                                      </div>
                                                                  `
                                                                : html`
                                                                      <div class="d-flex align-items-center justify-content-center" style="width: 96px;height: 46px;">
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
                                    onCreate: () => {
                                        const si = setInterval(() => {
                                            const ele: any = this.findPageIframe().contentWindow.document.getElementsByClassName('box-inside-guide2-4')[0];
                                            if (ele) {
                                                ele.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
                                                setTimeout(() => {
                                                    let ele2 = this.findIframeDom('.guide2-5');
                                                    ele2.parentElement.parentElement.scrollIntoView();
                                                }, 800);
                                                clearInterval(si);
                                            }
                                        }, 200);
                                    },
                                })
                            );
                        }, 400);
                        return ``;
                    }
                    case 6: {
                        return this.drawFinBG(BG, vm, 'guide2-6', 'financeInit', 6, 'setFinanceWay');
                    }
                    default: {
                        return this.drawMainRowBG(BG, vm, `.mainRow1`, 'financeInit', 6);
                    }
                }
            },
            divCreate: {},
        });
    }

    //初始
    public drawInitGuide() {
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
                        // if (!r.response.value.guideList){

                        // }
                        vm.progress = r.response.value;
                        if (vm.progress.length == 0) {
                            (vm.progress as any) = [
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
                            ApiShop.setGuide(vm.progress).then((r) => {});
                        }
                        gvc.notifyDataChange('init');
                    });
                }
                let count = vm.progress.filter((data: any) => {
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
                        const BG = document.querySelector(`.guide-BG`) as HTMLElement;
                        const rect = target!.getBoundingClientRect();
                        gvc.addStyle(`
                            .leave-guide-BG {
                                clip-path: polygon(0 0, ${rect.left}px 0, ${rect.left}px ${rect.bottom}px, ${rect.right}px ${rect.bottom}px, ${rect.right}px 0, 100% 0, 100% 100%, 0 100%);

                            }
                        `);
                        BG.classList.add('leave-guide-BG');
                        return html`
                            <div
                                class=""
                                style="width: 317px;height: 157px;position:absolute;top:${rect.bottom + window.scrollY + 12 + 'px'};left : ${rect.left +
                                window.scrollX +
                                'px'};gap:20px;padding-top: 22px;"
                            >
                                <div class="" style="position: absolute;top: 0;left: 20px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                        <path d="M11 0L21.3923 18H0.607696L11 0Z" fill="#FEAD20" />
                                    </svg>
                                </div>
                                <div
                                    style="display: flex;width: 317px;padding: 24px 32px;;flex-direction: column;justify-content: center;align-items: center;gap: 24px;border-radius: 10px;background: #FEAD20;"
                                >
                                    <div style="color: #FFF;font-size: 24px;font-style: normal;font-weight: 700;line-height: normal;letter-spacing: 0.96px;">這裡可以回顧開店導覽</div>
                                    <div
                                        class="border border-danger"
                                        style="display: flex;padding: 6px 18px;justify-content: center;align-items: center;border-radius: 10px;background: #FFF;color: #FEAD20;font-size: 16px;font-style: normal;font-weight: 700;line-height: normal;cursor: pointer;"
                                        onclick="${gvc.event(() => {
                                            document.querySelector(`.guide-BG`)!.remove();
                                            ApiShop.setGuideable({});
                                        })}"
                                    >
                                        我知道了
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    case 0: {
                        return html`
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
                                        <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                        <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                                    </svg>
                                </div>
                                <div style="color: #FFF;font-size: 24px;font-weight: 700;letter-spacing: 0.96px;margin-top:12px;">商店創建成功！</div>
                                <div style="color: #FFF;font-size: 16px;font-style: normal;font-weight: 500;line-height: 160%;letter-spacing: 0.64px;margin-top:6px;">跟著導覽教學，開張您的商店</div>
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
                    case 1: {
                        return html`
                            <div class="d-flex flex-column" style="width:588px;border-radius: 10px;background-color: white;">
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
                                        <path d="M1 1L13 13" stroke="white" stroke-linecap="round" />
                                        <path d="M13 1L1 13" stroke="white" stroke-linecap="round" />
                                    </svg>
                                </div>
                                <div class=" d-flex flex-column align-items-center justify-content-center" style="width: 100%;padding:24px;gap:24px;">
                                    <div class="g-container position-relative " style="">
                                        <div class="g-progress"></div>
                                        <div class="g-circle"></div>
                                        <div
                                            style="font-size: 25.92px;font-style: normal;font-weight: 700;line-height: normal;color:#393939;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%)"
                                        >
                                            ${vm.progress.filter((data: any) => {
                                                return data.finished;
                                            }).length}/${vm.progress.length}
                                        </div>
                                    </div>
                                    <div class="d-flex flex-column justify-content-start" style="gap:16px;">
                                        <div style="font-size: 18px;font-style: normal;font-weight: 700;line-height: normal;">完成以下設定，即可開張您的商店</div>
                                        ${gvc.bindView({
                                            bind: 'guideDirect',
                                            view: () => {
                                                return vm.progress
                                                    .map((data: any, index: number) => {
                                                        return html`
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
                                                                    <rect x="1" y="1" width="23" height="23" rx="11.5" fill="#FEAD20" />
                                                                    <rect x="1" y="1" width="23" height="23" rx="11.5" stroke="#393939" stroke-width="2" />
                                                                    <path d="M9 13.5L11.5 16L16 10" stroke="#393939" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
                                                return html`
                                                    <div style="font-size: 18px;font-style: normal;font-weight: 700;line-height: normal;">其他導覽</div>
                                                    ${dataList
                                                        .map((data) => {
                                                            return html`
                                                                <div class="w-100" style="display: flex;align-items: center;gap: 24px;">
                                                                    <div
                                                                        class="d-flex flex-column"
                                                                        style="gap:2px;font-size: 16px;font-style: normal;font-weight: 400;line-height: normal;color:#393939"
                                                                    >
                                                                        ${data.title}
                                                                        <div class="" style="font-size: 14px;font-style: normal;font-weight: 400;line-height: normal;color:#8D8D8D">${data.des}</div>
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
                return html`
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
                                <path d="M1 0.5L13 12.5" stroke="white" stroke-linecap="round" />
                                <path d="M13 0.5L1 12.5" stroke="white" stroke-linecap="round" />
                            </svg>
                        </div>
                        <div style="color: #FFF;font-size: 24px;font-weight: 700;letter-spacing: 0.96px;">商店創建成功！</div>
                        <div style="color: #FFF;font-size: 16px;font-style: normal;font-weight: 500;line-height: 160%;letter-spacing: 0.64px;margin-top:6px;">跟著導覽教學，開張您的商店</div>
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

    public drawBG() {
        let body = document.querySelector('.editorContainer');
        if (body && !document.querySelector('.guide-BG')) {
            let appendHTML = html`
                <div
                    class="guide-BG d-flex align-items-center justify-content-center"
                    style="width:100vw;height: 100vh;background: rgba(0, 0, 0, 0.60);position: absolute;left: 0;top: 0;z-index:1031;"
                    onclick="${this.gvc.event(() => {})}"
                ></div>
            `;
            $(body).append(appendHTML);
        }
        const innerHTML = this.guidePage[this.guide].innerHTML();
        document.querySelector('.guide-BG')!.innerHTML = innerHTML ?? ``;

        return html``;
    }

    public drawGuide() {
        const that = this;
        const timer = setInterval(function () {
            if (document.querySelector('iframe')) {
                that.drawBG();
                clearInterval(timer);
            }
        }, 500);
        return html``;
    }
}
