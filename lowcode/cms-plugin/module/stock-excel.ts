import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { Excel } from './excel.js';
import { ContentProduct } from '../../glitter-base/route/stock.js';

const html = String.raw;

export class StockExcel {
  // 盤點單匯入方法
  static async checkingImport(
    gvc: GVC,
    dataList: ContentProduct[],
    target: HTMLInputElement,
    callback: (updateList: ContentProduct[]) => void
  ) {
    const dialog = new ShareDialog(gvc.glitter);

    if (target.files?.length) {
      try {
        const jsonData = await Excel.parseExcelToJson(gvc, target.files[0]);

        for (let i = 0; i < jsonData.length; i++) {
          const content = jsonData[i];

          const contentData = {
            title: content['商品'],
            spec: content['規格'],
            sku: content['SKU'] ?? '',
            barcode: content['商品條碼'],
            transfer_count: content['庫存數量'] ?? '',
            recent_count: content['盤點數量'] ?? '',
            note: content['備註'] ?? '',
          };

          jsonData[i] = contentData;
        }

        dialog.checkYesOrNot({
          text: '確定要匯入嗎？',
          callback: bool => {
            if (bool) {
              const jsonDataMap: Map<string, ContentProduct> = new Map(
                jsonData.map(data => [`${data.title}-${data.spec}`, data])
              );

              for (const data of dataList) {
                const titleSpec = `${data.title}-${data.spec}`;
                const replaceData = jsonDataMap.get(titleSpec);

                if (replaceData) {
                  data.recent_count = replaceData.recent_count;
                  data.note = replaceData.note;
                } else {
                  dialog.errorMessage({ text: html`有遺失商品名稱與規格<br />（${titleSpec}）` });
                  return;
                }
              }

              callback(dataList);
            }
          },
        });
      } catch (error) {
        console.error('Stock Excel 解析失敗:', error);
      }
    }
  }

  // 匯入檔案彈出視窗
  static importDialog(gvc: GVC, dataList: ContentProduct[], callback: (updateList: ContentProduct[]) => void) {
    const dialog = new ShareDialog(gvc.glitter);
    const vm = {
      id: 'importDialog',
      fileInput: {} as HTMLInputElement,
      type: '',
    };

    gvc.glitter.innerDialog((gvc: GVC) => {
      return gvc.bindView({
        bind: vm.id,
        view: () => {
          const viewData = {
            title: '匯入盤點單',
            category: {
              title: '匯入盤點單類型',
              options: [],
            },
            example: {
              event: () => {},
            },
            import: {
              event: () =>
                this.checkingImport(gvc, structuredClone(dataList), vm.fileInput, (updateList: ContentProduct[]) => {
                  gvc.glitter.closeDiaLog();
                  callback(updateList);
                }),
            },
          };

          return html`
            <div
              class="d-flex align-items-center w-100 tx_700"
              style="padding: 12px 0 12px 20px; align-items: center; border-radius: 10px 10px 0px 0px; background: #F2F2F2;"
            >
              ${viewData.title}
            </div>
            <div style="padding: 20px 20px 0px;">
              <div class="d-flex flex-column align-items-start gap-1">
                ${BgWidget.warningInsignia('・匯入的資料僅修正「盤點數量」與「備註」欄位')}
                ${BgWidget.warningInsignia('・若匯入失敗，請再次確認「商品名稱」與「規格」是否與匯出的欄位相同')}
              </div>
            </div>
            <div class="d-flex flex-column w-100 align-items-start gap-3" style="padding: 20px">
              <input
                class="d-none"
                type="file"
                id="upload-excel"
                onchange="${gvc.event((_, event) => {
                  vm.fileInput = event.target;
                  gvc.notifyDataChange(vm.id);
                })}"
              />
              <div
                class="d-flex flex-column w-100 justify-content-center align-items-center gap-3"
                style="border: 1px solid #DDD; border-radius: 10px; min-height: 180px;"
              >
                ${(() => {
                  if (vm.fileInput.files && vm.fileInput.files.length > 0) {
                    return html`
                      ${BgWidget.customButton({
                        button: { color: 'snow', size: 'md' },
                        text: { name: '更換檔案' },
                        event: gvc.event(() => {
                          (document.querySelector('#upload-excel') as HTMLInputElement)!.click();
                        }),
                      })}
                      ${BgWidget.grayNote(vm.fileInput.files[0].name)}
                    `;
                  } else {
                    return BgWidget.customButton({
                      button: { color: 'snow', size: 'md' },
                      text: { name: '新增檔案' },
                      event: gvc.event(() => {
                        (document.querySelector('#upload-excel') as HTMLInputElement)!.click();
                      }),
                    });
                  }
                })()}
              </div>
            </div>
            <div class="d-flex justify-content-end gap-3" style="padding-right: 20px; padding-bottom: 20px;">
              ${BgWidget.cancel(
                gvc.event(() => {
                  gvc.glitter.closeDiaLog();
                })
              )}
              ${BgWidget.save(
                gvc.event(() => {
                  if (vm.fileInput.files && vm.fileInput.files.length > 0) {
                    viewData.import.event();
                  } else {
                    dialog.infoMessage({ text: '尚未上傳檔案' });
                  }
                }),
                '匯入'
              )}
            </div>
          `;
        },
        divCreate: {
          style: 'border-radius: 10px; background: #FFF; width: 570px; min-height: 360px; max-width: 90%;',
        },
      });
    }, vm.id);
  }

  static exportChecking(gvc: GVC, order_id: string, dataList: ContentProduct[]) {
    // 處理 JSON, 判斷欄位是否顯示
    const formatJSON = (obj: Record<string, any>) => Object.fromEntries(Object.entries(obj));

    // 供應商基本欄位物件
    const getBasicJSON = (product: ContentProduct) => {
      return formatJSON({
        商品: product.title,
        規格: product.spec,
        SKU: product.sku || '-',
        商品條碼: product.barcode || '-',
        庫存數量: product.transfer_count,
        盤點數量: product.recent_count,
        備註: product.note,
      });
    };

    function exportDataToExcel(dataArray: ContentProduct[]) {
      const printArray = dataArray.flatMap(product => {
        return [getBasicJSON(product)];
      });

      Excel.downloadExcel(gvc, printArray, `盤點單_${order_id}.xlsx`, `盤點單編號-${order_id}`);
    }

    exportDataToExcel(dataList);
  }
}
