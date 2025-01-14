import { BgWidget } from "../../backend-manager/bg-widget.js";
const html = String.raw;
export class PosSummary {
    static main(obj) {
        return BgWidget.container(html `
            <div class="title-container">
                ${BgWidget.title('小結紀錄')}
                <div class="flex-fill"></div>
                ${BgWidget.darkButton('新增小結單', obj.gvc.event(() => {
        }))}
                <button
                        class="btn hoverBtn me-2 px-3 d-none"
                        style="height:35px !important;font-size: 14px;color:black;border:1px solid black;"
                        onclick="${obj.gvc.event(() => {
        })}"
                >
                    <i class="fa-regular fa-gear me-2 "></i>
                    自訂資料
                </button>
            </div>
        `);
    }
}
