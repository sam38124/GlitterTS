import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ShoppingProductSetting } from './shopping-product-setting.js';
import { LanguageData } from '../public-models/product.js';
import { CheckInput } from '../modules/checkInput.js';

export class ProductService {
  public static checkData(postMD: any, obj: any, vm: any, refresh: () => void) {
    const gvc = obj.gvc;
    const dialog = new ShareDialog(gvc.glitter);

    function checkEmpty() {
      const variantsCheckList = ['sale_price'];

      if (postMD.product_category !== 'kitchen') {
        for (const checkItem of variantsCheckList) {
          if (
            (postMD['variants'][0] as any)[checkItem] == undefined ||
            (postMD['variants'][0] as any)[checkItem] == 0
          ) {
            dialog.infoMessage({
              text: '售價未填',
            });
            return false;
          }
        }
      }

      for (const index in postMD['variants']) {
        const variant: any = postMD['variants'][index];
        if (postMD.product_category === 'kitchen' && postMD.specs.length) {
          variant['v_height'] = postMD['v_height'];
          variant['v_width'] = postMD['v_width'];
          variant['v_length'] = postMD['v_length'];
          variant['weight'] = postMD['weight'];
        }
        if (postMD.product_category === 'course') {
          variant['shipment_type'] = 'none';
        }
        if (postMD.product_category !== 'weighing' && variant['shipment_type'] == 'volume') {
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
        if (postMD.product_category !== 'weighing' && variant['shipment_type'] == 'weight') {
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

    function validateLanguageSettings(): boolean {
      const supportedLanguages = (window.parent as any).store_info.language_setting.support;
      const languageData = postMD.language_data as Record<string, LanguageData>;

      // 驗證規則映射
      const validationRules = [
        {
          check: (data: LanguageData) => !data.title,
          errorMessage: '未輸入商品名稱',
        },
        {
          check: (data: LanguageData) => !data.seo.domain,
          errorMessage: '未設定商品連結',
        },
        // {
        //   check: (data: LanguageData) => !CheckInput.isChineseEnglishNumberHyphen(data.seo.domain),
        //   errorMessage: '連結僅限使用中英文數字與連接號',
        // },
      ];

      // 遍歷支持的語言並進行驗證
      for (const languageCode of supportedLanguages) {
        const currentLanguageData = languageData[languageCode];

        for (const rule of validationRules) {
          if (rule.check(currentLanguageData)) {
            vm.language = languageCode;
            refresh();
            dialog.errorMessage({ text: rule.errorMessage });

            return false;
          }
        }
      }

      return true;
    }

    if (!validateLanguageSettings()) return;

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
