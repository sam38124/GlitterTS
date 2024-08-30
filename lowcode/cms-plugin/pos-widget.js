export class PosWidget {
    static bigTitle(text, style) {
        return ` <div style="font-size: 32px;font-style: normal;font-weight: 700;letter-spacing: 3.2px;color:#393939;${style || ''}">
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
}
