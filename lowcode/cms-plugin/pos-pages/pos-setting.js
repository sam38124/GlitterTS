import { BgWidget } from "../../backend-manager/bg-widget.js";
export class PosSetting {
    static main(obj) {
        const gvc = obj.gvc;
        return gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID()
            };
            return {
                bind: vm.id,
                view: () => {
                    return BgWidget.mainCard([
                        {
                            title: '員工列表'
                        }
                    ].map(() => {
                        return `<div style="width:100% height: 39px; padding: 6px 12px; border-radius: 10px; justify-content: flex-start; align-items: center; gap: 24px; display: inline-flex">
  <div style="flex: 1 1 0; color: #393939; font-size: 20px;  font-weight: 700; text-transform: uppercase; letter-spacing: 2px; word-wrap: break-word">員工列表</div>
  <div style="width: 5px; height: 11px; transform: rotate(180deg); transform-origin: 0 0; border: 2px #393939 solid"></div>
</div>`;
                    }).join(''));
                },
                divCreate: {
                    class: `mx-auto`
                }
            };
        });
    }
}
