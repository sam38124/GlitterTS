import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { Tool } from '../../modules/tool.js';
import { Excel } from './excel.js';
import { CheckInput } from '../../modules/checkInput.js';

const html = String.raw;

type Range = 'search' | 'checked' | 'all';

interface VendorData {
  id: string;
  name: string;
  note: string;
  address: string;
  is_shop: boolean;
  manager_name: string;
  manager_phone: string;
}

export class VendorExcel {
  // 取得新的ID
  static getNewID(list: VendorData[]) {
    let newId: string;
    do {
      newId = `vendor_${Tool.randomString(6)}`;
    } while (list.some((item: VendorData) => item.id === newId));
    return newId;
  }

  // 範例檔資料
  static importExampleData = [
    {
      供應商名稱: '範例供應商',
      供應商地址: '台北市信義區中山路一號',
      聯絡人姓名: '黃先生',
      電話: '0919334556',
      備註: '',
    },
  ];

  // 匯出可選欄位
  static headerColumn = {
    基本資料: ['供應商名稱', '供應商地址', '聯絡人姓名', '電話', '備註'],
  };

  // 選項元素
  static optionsView(gvc: GVC, callback: (dataArray: string[]) => void) {
    let columnList = new Set<string>();
    const randomString = BgWidget.getCheckedClass(gvc);

    const checkbox = (checked: boolean, name: string, toggle: () => void) => html`
      <div class="form-check">
        <input
          class="form-check-input cursor_pointer ${randomString}"
          type="checkbox"
          id="${name}"
          style="margin-top: 0.35rem;"
          ${checked ? 'checked' : ''}
          onclick="${gvc.event(toggle)}"
        />
        <label
          class="form-check-label cursor_pointer"
          for="${name}"
          style="padding-top: 2px; font-size: 16px; color: #393939;"
        >
          ${name}
        </label>
      </div>
    `;

    const checkboxContainer = (items: Record<string, string[]>) => html`
      <div class="row w-100">
        ${Object.entries(items)
          .map(([category, fields]) => {
            const bindId = Tool.randomString(5);

            return gvc.bindView({
              bind: bindId,
              view: () => {
                const allChecked = fields.every(item => columnList.has(item));

                return html`
                  ${checkbox(allChecked, category, () => {
                    if (allChecked) {
                      fields.forEach(item => columnList.delete(item));
                    } else {
                      fields.forEach(item => columnList.add(item));
                    }
                    callback(Array.from(columnList));
                    gvc.notifyDataChange(bindId);
                  })}
                  <div class="d-flex position-relative my-2">
                    ${BgWidget.leftLineBar()}
                    <div class="ms-4 w-100 flex-fill">
                      ${fields
                        .map(item =>
                          checkbox(columnList.has(item), item, () => {
                            columnList.has(item) ? columnList.delete(item) : columnList.add(item);
                            callback(Array.from(columnList));
                            gvc.notifyDataChange(bindId);
                          })
                        )
                        .join('')}
                    </div>
                  </div>
                `;
              },
              divCreate: { class: 'col-12 col-md-4 mb-3' },
            });
          })
          .join('')}
      </div>
    `;

    return checkboxContainer(this.headerColumn);
  }

  // 匯出方法
  static async export(gvc: GVC, apiJSON: any, column: string[]) {
    const dialog = new ShareDialog(gvc.glitter);

    if (column.length === 0) {
      dialog.infoMessage({ text: '請至少勾選一個匯出欄位' });
      return;
    }

    // 處理 JSON, 判斷欄位是否顯示
    const formatJSON = (obj: Record<string, any>) =>
      Object.fromEntries(Object.entries(obj).filter(([key]) => column.includes(key)));

    // 供應商基本欄位物件
    const getBasicJSON = (vendor: VendorData) => {
      return formatJSON({
        供應商名稱: vendor.name,
        供應商地址: vendor.address,
        聯絡人姓名: vendor.manager_name,
        電話: vendor.manager_phone,
        備註: vendor.note,
      });
    };

    function exportDataToExcel(dataArray: VendorData[]) {
      if (dataArray.length === 0) {
        dialog.errorMessage({ text: '無供應商資料可以匯出' });
        return;
      }

      const printArray = dataArray.flatMap(vendor => {
        return [getBasicJSON(vendor)];
      });

      Excel.downloadExcel(
        gvc,
        printArray,
        `供應商列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`,
        '供應商列表'
      );
    }

    // 透過 API, 取得供應商資料
    async function fetchVendors() {
      dialog.dataLoading({ visible: true });
      try {
        const vendors = await ApiUser.getPublicConfig('vendor_manager', 'manager').then((dd: any) => {
          if (dd.result && dd.response.value) {
            return dd.response.value?.list ?? [];
          } else {
            return [];
          }
        });
        dialog.dataLoading({ visible: false });

        if (vendors.length > 0) {
          exportDataToExcel(vendors);
        } else {
          dialog.errorMessage({ text: '目前無供應商資料' });
        }
      } catch (error) {
        dialog.dataLoading({ visible: false });
        dialog.errorMessage({ text: '匯出檔案發生錯誤' });
      }
    }

    dialog.checkYesOrNot({
      text: '系統將會依條件匯出資料，確定要匯出嗎？',
      callback: bool => bool && fetchVendors(),
    });
  }

  // 匯出檔案彈出視窗
  static exportDialog(gvc: GVC) {
    const vm = {
      select: 'all' as Range,
      column: [] as string[],
    };

    BgWidget.settingDialog({
      gvc,
      title: '匯出供應商',
      width: 700,
      innerHTML: gvc2 => {
        return html`<div class="d-flex flex-column align-items-start gap-2">
          <div class="tx_700 mb-2">匯出範圍</div>
          ${BgWidget.multiCheckboxContainer(
            gvc2,
            [{ key: 'all', name: '全部供應商' }],
            [vm.select],
            res => {
              vm.select = res[0] as Range;
            },
            { single: true }
          )}
          <div class="tx_700 mb-2">匯出欄位</div>
          ${this.optionsView(gvc2, cols => {
            vm.column = cols;
          })}
        </div>`;
      },
      footer_html: gvc2 => {
        return [
          BgWidget.cancel(
            gvc2.event(() => {
              gvc2.glitter.closeDiaLog();
            })
          ),
          BgWidget.save(
            gvc2.event(() => {
              this.export(gvc, {}, vm.column);
            }),
            '匯出'
          ),
        ].join('');
      },
    });
  }

  // 匯入方法
  static async import(gvc: GVC, target: HTMLInputElement, callback: () => void) {
    const dialog = new ShareDialog(gvc.glitter);

    if (target.files?.length) {
      try {
        dialog.dataLoading({ visible: true, text: '上傳檔案中' });
        const jsonData = await Excel.parseExcelToJson(gvc, target.files[0]);
        dialog.dataLoading({ visible: false });

        const vendors: VendorData[] = await ApiUser.getPublicConfig('vendor_manager', 'manager').then((dd: any) => {
          if (dd.result && dd.response.value) {
            return dd.response.value?.list ?? [];
          } else {
            return [];
          }
        });

        for (let i = 0; i < jsonData.length; i++) {
          const vendor = jsonData[i];

          const vendorData = {
            id: this.getNewID(vendors),
            name: vendor['供應商名稱'],
            address: vendor['供應商地址'],
            manager_name: vendor['聯絡人姓名'] ?? '',
            manager_phone: vendor['電話'],
            note: vendor['備註'] ?? '',
            is_shop: false,
          };

          // 名稱未填寫驗證
          if (CheckInput.isEmpty(vendorData.name)) {
            dialog.infoMessage({ text: `供應商名稱不得為空白（資料列第 ${i + 1} 筆）` });
            return;
          }

          // 地址未填寫驗證
          if (CheckInput.isEmpty(vendorData.address)) {
            dialog.infoMessage({ text: `地址不得為空白（資料列第 ${i + 1} 筆）` });
            return;
          }

          // 正則表達式來驗證台灣行動電話號碼格式
          if (!CheckInput.isTaiwanPhone(vendorData.manager_phone)) {
            dialog.infoMessage({ text: BgWidget.taiwanPhoneAlert() + `（資料列第 ${i + 1} 筆）` });
            return;
          }

          jsonData[i] = vendorData;
        }

        const vendorMap = new Map(vendors.map((vendor: VendorData) => [vendor.name, vendor]));

        jsonData.map((new_vendor: VendorData) => {
          vendorMap.set(new_vendor.name, new_vendor);
        });

        dialog.checkYesOrNot({
          text: '若有相同名稱的供應商，將會覆蓋並更新其資料，<br/>確定要匯入嗎？',
          callback: bool => {
            if (bool) {
              dialog.dataLoading({ visible: true });

              ApiUser.setPublicConfig({
                key: 'vendor_manager',
                value: {
                  list: [...vendorMap.values()],
                },
                user_id: 'manager',
              }).then(() => {
                dialog.dataLoading({ visible: false });
                dialog.successMessage({ text: '匯入成功' });
                callback();
              });
            }
          },
        });
      } catch (error) {
        console.error('Vendor Excel 解析失敗:', error);
      }
    }
  }

  // 匯入檔案彈出視窗
  static importDialog(gvc: GVC, callback: () => void) {
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
            title: '匯入供應商',
            category: {
              title: '匯入供應商類型',
              options: [],
            },
            example: {
              event: () => {
                Excel.downloadExcel(
                  gvc,
                  VendorExcel.importExampleData,
                  `範例_供應商列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`,
                  '範例供應商列表'
                );
              },
            },
            import: {
              event: () =>
                this.import(gvc, vm.fileInput, () => {
                  gvc.glitter.closeDiaLog();
                  callback();
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
            ${viewData.category.options.length > 0
              ? html`<div class="d-flex flex-column align-items-start gap-2" style="padding: 20px 20px 0px;">
                  <div class="tx_700">${viewData.category.title}</div>
                  ${BgWidget.multiCheckboxContainer(
                    gvc,
                    viewData.category.options,
                    [vm.type],
                    res => {
                      vm.type = res[0];
                    },
                    { single: true }
                  )}
                </div>`
              : ''}
            <div class="d-flex flex-column w-100 align-items-start gap-3" style="padding: 20px">
              <div class="d-flex align-items-center gap-2">
                <div class="tx_700">透過XLSX檔案匯入供應商</div>
                ${BgWidget.blueNote('下載範例', gvc.event(viewData.example.event))}
              </div>
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
}
