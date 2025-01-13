export class PosWidget {
    static bigTitle(text, style) {
        return ` <div style="font-size: ${((document.body.offsetWidth < 800)) ? `24px` : `28px`};font-style: normal;font-weight: 700;letter-spacing: 3.2px;color:#393939;${style || ''}">
                        ${text}
                    </div>`;
    }
    static bigTextItem(text, style) {
        return ` <div style="
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: 2.16px;${style || ''}">
                        ${text}
                    </div>`;
    }
    static fontBold(text) {
        return `<div style="
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;">
                        ${text}
                    </div>`;
    }
    static fontLight(text) {
        return `<div style="
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;">
                        ${text}
                    </div>`;
    }
    static buttonSnow(text, event) {
        return `<div style="display: flex;
border-radius: 10px;
background: #F6F6F6;
height: 44px;
padding: 12px 24px;
justify-content: center;
width:100%;
cursor:pointer;;
align-items: center;
gap: 8px;
align-self: stretch;" onclick="${event}">${text}</div>`;
    }
    static buttonBlack(text, event) {
        return `<div style="display: flex;
border-radius: 10px;
background: #393939;
color:white;
height: 44px;
padding: 12px 24px;
justify-content: center;
width:100%;
cursor:pointer;;
align-items: center;
gap: 8px;
align-self: stretch;" onclick="${event}">${text}</div>`;
    }
}
