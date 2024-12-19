import {BgWidget} from "../../backend-manager/bg-widget.js";
import {GVC} from "../../glitterBundle/GVController.js";

const html=String.raw
export class QuestionInfo{
    static promoteLabel(gvc:GVC){
        BgWidget.quesDialog({
            gvc,
            innerHTML: () => {
                return html`
                    <div
                            style="width:100%;border-radius: 10px;background: #393939;display: flex;padding: 10px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 16px;"
                    >
                        <div class="tx_normal text-wrap text-white">
                            顯示於商品卡片上方，用於突出推廣特定商品，例如「熱賣中」、「特價」等，以便消費者快速識別商品狀態，提升購物吸引力。
                        </div>
                        <div class="w-100" style="width: 182.681px;height: 225.135px;flex-shrink: 0;">
                            <img
                                    style="width: 182.681px;height: 225.135px;flex-shrink: 0;"
                                    src="https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/size1440_s*px$_s4s0sbs5s5sbs6se_messageImage_1730260643019.jpg"
                            />
                        </div>
                    </div>
                `;
            },
        });
    }
}