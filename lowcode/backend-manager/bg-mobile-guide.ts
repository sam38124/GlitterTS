import {GVC} from '../glitterBundle/GVController.js';

const html = String.raw;

export class BgMobileGuide {
    public guide: number;
    public step: number;
    public type: string;
    public gvc: GVC;
    private stepInf: {
        title: string,
        img: string,
        description: string,
    }[] = [
        {
            title:`https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s8sds2s0s2s6s0s8_%E5%AE%98%E7%B6%B2%E8%A8%AD%E8%A8%88.png`,
            img: "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s7s9s8s9s5s7sbs5_Frame1368228026.png",
            description: "在首頁點擊「品牌官網」後，系統將導向佈景主題頁面，您可以在此編輯與管理官網樣式。",
        }, {
            title: `https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_sfs0s0s4s5s7sds6_AI%E5%8A%A9%E6%89%8B.png`,
            img: "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_sesds2s9s4s1s8sf_Frame1368228028.png",
            description: "點擊上方「AI助手」即開啟對話視窗，享訂單分析、操作引導等功能，助您高效經營！",
        }, {
            title: `https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s0s4sbs2sfsdses2_%E5%95%86%E5%93%81%E4%B8%8A%E6%9E%B6.png`,

            img: "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_sbs9s4sas2s6sese_Frame1368228024.png",
            description: "展開左側導覽，點擊「商品管理」下的「商品列表」，即可前往上架商品的頁面。",
        }, {
            title: `https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s8s3s7s8s6sds4s0_%E8%A8%82%E5%96%AE%E7%AE%A1%E7%90%86.png`,
            img: "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_sas6sds5s2scs7s4_Frame1368228025.png",
            description: "展開左側導覽，點擊「訂單管理」下的「訂單列表」，即可輕鬆查看並處理訂單。",
        },
    ]
    private eventSet: any = [];

    public static disableFunction: any = () => {
    }


    constructor(gvc: GVC, guide: number, type: string = 'backend-manger', step: number = 0) {
        this.guide = guide;
        this.gvc = gvc;
        this.type = type;
        this.step = step;
    }

    private closeBG(){
        const element = document.querySelector('.guide-BG');
        element!.remove();
    }
    public drawBG() {
        this.gvc.addStyle(`
            .swiper-pagination-bullet{
                width: 10px!important;
                height: 10px;
                border-radius: 20px;
                background: #DDD;
            }
            .swiper-pagination-bullet,.swiper-pagination-bullet-active{
                background: #393939!important;
            }
        `)
        let body = document.querySelector('.editorContainer');
        if (body && !document.querySelector('.guide-BG')) {
            let appendHTML = html`
                <div
                        class="guide-BG d-flex align-items-center justify-content-center"
                        style="width:100vw;height: 100vh; background: rgba(0, 0, 0, 0.60);position: absolute;left: 0;top: 0;z-index:1031;"
                        onclick="${this.gvc.event(() => {
                        })}"
                >
                    <div class="d-flex flex-column align-items-center justify-content-center" style="position: relative;height: 100vh;width: 100%;background-color: white;padding-bottom: 70px;">
                        <div class="swiper d-flex " style="width: 100vw;background-color: white;padding-bottom: 20px;position: relative">
                            <div class="swiper-wrapper flex-fill w-100" style="padding-bottom: 35px">
                                ${(() => {
                                    return this.stepInf.map((inf) => {
                                        return html`
                                        <div class="swiper-slide w-100" style="">
                                            <div class="w-100 d-flex align-items-center justify-content-center">
                                                <img style="width:209px;height: 62px;" src="${inf.title}" alt="">
                                            </div>
                                            
                                            <div class="w-100 align-items-center justify-content-center" style="margin-top: 25px;">
                                                <img src="${inf.img}" alt="">
                                            </div>
                                            <div class="d-flex align-items-center justify-content-center w-100" style="margin-top: 26px;white-space:normal;padding: 0 30px;">
                                                ${inf.description}
                                            </div>
                                        </div>`
                                    }).join('');
                                })()}
                            </div>
                            <!-- If we need pagination -->
                            <div class="swiper-pagination" style=""></div>
                        </div>
                        <div class="d-flex w-100" style="padding: 0 30px;position: absolute;left:0;bottom: 30px;">
                            <div class="d-flex align-items-center justify-content-center w-100" style="padding: 10px 20px;;z-index: 2;border-radius: 6px;border: 1px solid #DDD;" onclick="${this.gvc.event(()=>{
                                this.closeBG();
                            })}">
                                直接開始
                            </div>
                        </div>
                        
                    </div>
                </div>
            `;
            $(body).append(appendHTML);

        }
        const swiper = new (window as any).Swiper('.swiper', {
            // Optional parameters
            loop: true,
            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },
            on: {
                slideChange: function () {
                    // @ts-ignore
                    console.log('當前頁面索引:', this.activeIndex);
                },
            },

        });

        return html``;
    }

    public drawGuide() {
        if (document.body.clientWidth >= 922) {
            return
        }

        const that = this;
        const timer = setInterval(function () {
            if (document.querySelector('iframe')) {
                // running().then(r => {
                //
                // })
                that.gvc.glitter.addStyleLink([
                    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
                ]);
                that.drawBG();
                clearInterval(timer);
            }
        }, 500);
        return html``;
    }
}
