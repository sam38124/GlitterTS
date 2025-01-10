import {GVC} from "../../glitterBundle/GVController.js";
import {ShoppingShipmentSetting} from "../shopping-shipment-setting.js";
import {BgWidget} from "../../backend-manager/bg-widget.js";

export class GlobalExpress {

    public static settingMain(obj: {
        gvc: GVC, key: string, save_event: () => void
    }) {
        const gvc = obj.gvc
        const vm = {
            select: 'country'
        }
        return gvc.bindView(() => {
            const id = gvc.glitter.getUUID()
            return {
                bind: id,
                view: () => {
                    const array = [
                        `<div class="px-2">${BgWidget.tab(
                            [
                                {title: '國家設定', key: 'country'},
                                {title: '運費設定', key: 'shipment'}
                            ],
                            gvc,
                            vm.select,
                            (text) => {
                                vm.select = text as any;
                                gvc.notifyDataChange(id);
                            }
                        )}</div>`,

                    ]
                    if (vm.select === 'shipment') {
                        array.push(ShoppingShipmentSetting.main(obj))
                    } else {

                        array.push(`<div style="height:400px;">
<select id="countries" multiple>
    <option value="US">United States</option>
    <option value="CA">Canada</option>
    <option value="FR">France</option>
    <option value="CN">China</option>
</select>
</div>`)
                    }
                    return array.join('')
                },
                divCreate: {
                    class: `mt-n3 `
                },
                onCreate: () => {
                    if (vm.select === 'country') {
                        gvc.glitter.addStyleLink('https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
                        gvc.glitter.addMtScript([{
                            src: 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js'
                        }], () => {
                        }, () => {
                        })

                        function loop() {
                            try {
                                (gvc.glitter.$('.js-example-basic-multiple') as any).select2();
                            } catch (e) {
                                console.log(e)
                                setTimeout(()=>{  loop()},2000)

                            }
                        }
                        loop()
                    }
                }
            }
        })
    }
}