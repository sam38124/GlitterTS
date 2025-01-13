export class PosWidget {
    public static bigTitle(text: string, style?: string) {
        return ` <div style="font-size: ${((document.body.offsetWidth < 800)) ? `24px` : `28px`};font-style: normal;font-weight: 700;letter-spacing: 3.2px;color:#393939;${style || ''}">
                        ${text}
                    </div>`
    }

    public static bigTextItem(text: string, style?: string) {
        return ` <div style="
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: 2.16px;${style || ''}">
                        ${text}
                    </div>`
    }

    public static fontBold(text: string) {
        return `<div style="
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;">
                        ${text}
                    </div>`
    }
    public static fontLight(text: string) {
        return `<div style="
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;">
                        ${text}
                    </div>`
    }

    public static buttonSnow(text: string, event: string) {
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
align-self: stretch;" onclick="${event}">${text}</div>`
    }

    public static buttonBlack(text: string, event: string) {
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
align-self: stretch;" onclick="${event}">${text}</div>`
    }
}