import {ShareDialog} from "../glitterBundle/dialog/ShareDialog.js";
import {LanguageData, ShoppingProductSetting} from "./shopping-product-setting.js";
import {Language} from "../glitter-base/global/language.js";

    export class ProductService{
    public static checkData(postMD:any,obj:any,vm:any,refresh:()=>void){
        const gvc=obj.gvc
        const dialog = new ShareDialog(gvc.glitter);
        function checkEmpty() {

            const variantsCheckList = ['sale_price'];



            for (const checkItem of variantsCheckList) {
                if ((postMD['variants'][0] as any)[checkItem] == undefined || (postMD['variants'][0] as any)[checkItem] == 0) {
                    dialog.infoMessage({
                        text: '售價未填',
                    });
                    return false;
                }
            }

            for (const index in postMD['variants']) {
                const variant: any = postMD['variants'][index];
                if (variant['shipment_type'] == 'volume') {
                    if (
                        variant['v_height'] == undefined ||
                        Number(variant['v_height']) == 0 ||
                        variant['v_width'] == undefined ||
                        Number(variant['v_width']) == 0 ||
                        variant['v_length'] == undefined ||
                        Number(variant['v_length']) == 0
                    ) {
                        dialog.infoMessage({
                            text: `規格 ${variant.spec.join(',')} 材積資訊未填`,
                        });
                        return false;
                    }
                }
                if (variant['shipment_type'] == 'weight') {
                    if (variant['weight'] == undefined || Number(variant['weight']) == 0) {
                        dialog.infoMessage({
                            text: `${variant.spec.length > 1 ? variant.spec.join(',') : ''}重量未填`,
                        });
                        return false;
                    }
                }
            }
            return true;
        }

        for (const b of (window.parent as any).store_info.language_setting.support){
            const language_data: LanguageData = ((postMD.language_data as any))[b]
            if(!language_data.title){
                vm.language=b
                refresh()
                dialog.errorMessage({text:`未輸入商品名稱`})
                return
            }else if(!language_data.seo.domain){
                vm.language=b
                refresh()
                dialog.errorMessage({text:`未設定商品連結`})
                return
            }
        }

        if (postMD.id && postMD.status !== 'draft' && Object.keys(postMD.active_schedule).length === 0) {
            postMD.active_schedule = ShoppingProductSetting.getActiveDatetime();
        }

        postMD.active_schedule.start_ISO_Date = (() => {
            try {
                return new Date(`${postMD.active_schedule.startDate} ${postMD.active_schedule.startTime}`).toISOString();
            } catch (error) {
                return undefined;
            }
        })();

        postMD.active_schedule.end_ISO_Date = (() => {
            try {
                return new Date(`${postMD.active_schedule.endDate} ${postMD.active_schedule.endTime}`).toISOString();
            } catch (error) {
                return undefined;
            }
        })();

        if (checkEmpty()) {
            if (postMD.id) {
                ShoppingProductSetting.putEvent(postMD, obj.gvc, obj.vm);
            } else {
                ShoppingProductSetting.postEvent(postMD, obj.gvc, obj.vm);
            }
        }
    }
}