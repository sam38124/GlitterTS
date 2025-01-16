const html = String.raw;
export class AppIntro {
    static main(gvc) {
        return html `<div class="d-flex align-items-center justify-content-center vw-100" style="${(document.body.clientWidth > 1100 ? `padding-top:48px;padding-bottom: 48px;` : ``)};position: relative;">
            <div class="position-absolute d-none d-lg-block" style="right: 0px;z-index: 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="718" height="631" viewBox="0 0 718 631" fill="none">
                    <path d="M259 630.5L0 0H956V630.5H259Z" fill="url(#paint0_linear_5941_6121)"/>
                    <defs>
                        <linearGradient id="paint0_linear_5941_6121" x1="-30.2532" y1="-236.437" x2="577.906" y2="980.892" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FFB400"/>
                            <stop offset="1" stop-color="#FF6C02"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="d-flex align-items-center justify-content-center flex-column flex-lg-row" style="max-width: 100%;min-height: 421px;width: 1100px;z-index: 1;position: relative;">
                <div class="d-flex flex-column justify-content-center position-relative" style="${(document.body.clientWidth < 800) ? `width:calc(100vw - 50px);gap:24px;margin-top:32px;` : `gap:24px;width: 468px;min-height: 421px;`}z-index:1;">
           <img src="${new URL('./icon/logo.svg', import.meta.url).href}" style="width:80%;"></img>        
<span style="color: #6A6A6A;
font-family: 'Noto Sans';
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 160%;">SHOPNEX後台APP讓你只需通過手機，就能輕鬆掌握商店的運營狀況。無論是商品上架、訂單管理還是顧客互動，所有操作都變得簡單而高效。</span>
                <div class="d-flex align-items-center" style="gap:16px;">
                    <img onclick="${gvc.event(() => {
            gvc.glitter.openNewTab(' https://apps.apple.com/us/app/shopnex-%E5%85%A8%E9%80%9A%E8%B7%AF%E6%95%B4%E5%90%88%E9%96%8B%E5%BA%97%E5%B9%B3%E5%8F%B0/id6736935325');
        })}" src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1720335027962-c7732fe761f745b2382cbce1fa4239ba.png" style="width:151px;cursor: pointer;"></img>
                    <img src="https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/1720335033287-cc2571282c541a15df727d64cd88a57f.png" style="width:151px;cursor: pointer;" onclick="${gvc.event(() => {
            gvc.glitter.openNewTab('https://play.google.com/store/apps/details?id=shopnex.tw');
        })}"></img>
                </div>
                </div>
                <img class="position-absolute d-lg-none w-100" src="${new URL('./icon/linear.svg', import.meta.url).href}" style="bottom: 0px;left: 0px;z-index: 0;">
                <img  src="${new URL('./icon/mobile.png', import.meta.url).href}" class="d-lg-none vw-100" style="z-index: 1;">
                <div class="d-none d-lg-block" style="position: relative;height: 568px;width: calc(300px + 10vw);">
                </div>
            </div>
            <img  src="${new URL('./icon/mobile.png', import.meta.url).href}" class="d-none d-lg-block" style="height: 568px;width: 758px;position: absolute;top:10px;right: 10vw;">
           
        </div>
       
        `;
    }
}
window.glitter.setModule(import.meta.url, AppIntro);
