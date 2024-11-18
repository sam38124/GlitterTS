const html = String.raw;
export class AboutUs {
    static main(gvc) {
        const css = String.raw;
        gvc.addStyle(css `
            .f_40 {
                color: #393939;
                text-align: center;
                font-size: 40px;
                font-style: normal;
                font-weight: 900;
                line-height: normal;
                letter-spacing: 3.2px;
                margin: 0;
                padding: 0;
            }
            .f_20 {
                color: #393939;
                font-size: 20px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: 0.8px;
                margin: 0;
                padding: 0;
            }
            @media (max-width: 768px) {
                .f_40 {
                    font-size: 28px;
                }
                .f_20 {
                    font-size: 16px;
                }
                .t_m {
                    color: #000;
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 140%; /* 25.2px */
                } 
            }
            .t_m {
                color: #000;
                font-size: 20px;
                font-style: normal;
                font-weight: 500;
                line-height: 140%; /* 25.2px */
            }
            .c_container {
                width: 1440px;
            }
            .gradint {
                background: linear-gradient(138deg, #FFB400 -7.89%, #FF6C02 107.55%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        `);
        return html `
            <img src="${gvc.glitter.root_path}/landing-page/about-src/${(document.body.clientWidth < 800) ? `mobile-bg` : `bg1`}.png" class="position-absolute  left-0 w-100" style="z-index:0;top:60px;">
            
            <div class="w-100 d-flex align-items-center justify-content-center position-relative" style="z-index: 2;padding-bottom: 20px;">
                <div class="c_container" style="max-width: 1100px;z-index:3;${((document.body.clientWidth < 800)) ? `padding-left:30px;padding-right:30px;padding-top: 44px;` : `padding-top: 88px;`}">
                   <div class="d-flex flex-column align-items-center justify-content-center mx-auto" style="gap:${(((document.body.clientWidth < 800))) ? `16` : `24`}px;">
                       <h1 class="f_40">關於我們</h1>
                       <h2 class="f_20">從<span class="gradint fw-bold f_20">零</span>開始出發，打造<span class="gradint fw-bold f_20">完美系統</span></h2>
                   </div>
                    <div style="${(document.body.clientWidth < 800) ? `gap:18px;margin-top: 32px;` : `margin-top: 64px;`}" class="d-flex flex-column flex-sm-row justify-content-between">
                        <img src="${gvc.glitter.root_path}/landing-page/about-src/team_work_1.png" class="" style="max-width: 100%;width: 743px;">
                        <div class="d-flex flex-lg-column" style="${(document.body.clientWidth < 800) ? `width:100%;` : `width: calc(100% - 773px);`}">
                            <img src="${gvc.glitter.root_path}/landing-page/about-src/team_work_3.png" class="" style="${(document.body.clientWidth < 800) ? `width: calc(50% - 10px);` : `width: 100%;`}">
                            <div class="flex-fill"></div>
                            <img src="${gvc.glitter.root_path}/landing-page/about-src/team_work_2.png" class="" style="${(document.body.clientWidth < 800) ? `width: calc(50% - 10px);` : `width: 100%;`}">
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-center justify-content-center mx-auto" style="${(((document.body.clientWidth < 800))) ? `gap:8;margin-top:132px;` : `gap:16px;margin-top:200px;`}">
                        <h1 class="f_20 gradint fw-bold">一路走來</h1>
                        <h2 class="f_40 fw-bold">回顧過去的足跡<br>
                            展望更加輝煌的未來</h2>
                    </div>
                    ${(document.body.clientWidth > 800) ? `
                     <img src="${gvc.glitter.root_path}/landing-page/about-src/time_line.png" class="" style="width: 100%;margin-bottom:293px;margin-top:59px;">
                    ` : `
                     <img src="${gvc.glitter.root_path}/landing-page/about-src/mobile_time_line.png" class="" style="width: calc(100% + 30px);margin-left:-15px;margin-top:17px;">
                    `}
                    <div class="d-flex flex-column align-items-center justify-content-center mx-auto" style="${(((document.body.clientWidth < 800))) ? `gap:8;margin-top:132px;` : ``}">
                        <h1 class="f_20 gradint fw-bold">團隊介紹</h1>
                        <h2 class="f_40 fw-bold">熱愛突破的專家團隊<br>
                            塑造未來電商格局</h2>
                    </div>
                    <div class="row" style="${document.body.clientWidth < 800 ? `margin-top:47px;margin-bottom:47px;` : `margin-top:97px;margin-bottom:47px;`}">
                        ${[
            {
                title: 'Sam',
                carer: 'CEO',
                desc: `曾任上櫃公司軟體架構規劃師，精通多種程式開發領域，是把萬能瑞士刀，可以解決各種技術難題。`,
                src: `ceo`
            },
            {
                title: 'Daniel',
                carer: 'CTO',
                desc: `精通多種編程語言與技術框架，能獨立設計高效且可擴展的系統架構。`,
                src: `cto`
            },
            `empty`,
            `empty`,
            `empty`,
            {
                title: 'Zack',
                carer: 'Senior Engineer',
                desc: `經驗豐富的軟體開發專家，擅長前後端分離及模組化JS渲染工程，提升開發效率並降低錯誤率。`,
                src: `soe`
            },
            {
                title: 'Lily',
                carer: 'Product Manager',
                desc: `負責將創新設計與功能需求融合，推動產品從構想到實現的全過程。`,
                src: `lily`
            },
            {
                title: 'Juno',
                carer: 'Marketing Specialist',
                desc: `擅長制定並執行有效的行銷策略，提升品牌知名度和銷售量。`,
                src: `mkt`
            }
        ].map((dd) => {
            if (dd === 'empty') {
                if (document.body.clientWidth > 800) {
                    return `<div class="col-3"></div>`;
                }
                else {
                    return ``;
                }
            }
            return `<div class="col-6 col-sm-3 mb-4 mb-lg-5">
<img src="${gvc.glitter.root_path}/landing-page/about-src/${dd.src}.png" class="w-100 rounded-3" >
<div class="d-flex flex-column">
<h3 class="t_m mt-2 m-0 p-0">${dd.title}</h3>
<div class="fs-base fw-500 " style="color:#ADADAD;margin-top:0px !important;">${dd.carer}</div>
<span class="fs-6" style="color: #393939;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: 0.64px;">${dd.desc}</span>
</div>
</div>`;
        }).join('')}
                    </div>
                    
                </div>
                ${document.body.clientWidth < 1100 ? `<img src="${gvc.glitter.root_path}/landing-page/about-src/foot-right.png" class="position-absolute  " style="z-index:0;bottom: 50px;width:400px;right:-30%;">` :
            [
                `<img src="${gvc.glitter.root_path}/landing-page/about-src/bg2_desktop.png" class="position-absolute" style="z-index:0;bottom: -43vw;width:100%;">`,
                `<img src="${gvc.glitter.root_path}/landing-page/about-src/desk_gp.png" class="position-absolute" style="z-index:0;right:calc((100vw - 1400px) / 2);width:600px;bottom: 500px;">`
            ].join('')}
            </div>
      
        `;
    }
}
window.glitter.setModule(import.meta.url, AboutUs);
