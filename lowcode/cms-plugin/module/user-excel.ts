import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { ApiUser } from '../../glitter-base/route/user.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { Tool } from '../../modules/tool.js';

const html = String.raw;

type Range = 'search' | 'checked' | 'all';

interface UserData {
  name: string;
  tags: string[];
  email: string;
  phone: string;
  managerNote: string;
  birth: string;
  address: string;
  gender: string;
  company: string;
  gui_number: string;
  carrier_number: string;
  consignee_name: string;
  consignee_address: string;
  consignee_email: string;
  consignee_phone: string;
  lineID: string;
  'fb-id': string;
}

interface User {
  email: string;
  order_count: number;
  total_amount: string;
  id: number;
  userID: number;
  account: string;
  userData: UserData;
  created_time: string; // 使用 ISO 8601 格式的時間
  role: number;
  company: string | null;
  status: number;
  online_time: string; // 使用 ISO 8601 格式的時間
  static_info: any | null; // 根據需求可以替換成具體類型
  tag_name: string;
  checkout_total: number;
  checkout_count: number;
  latest_order_date: number;
  latest_order_total: number;
  rebate: number;
  member_deadline: string;
  firstShipment: any;
}

export class UserExcel {
  static async loadXLSX(gvc: GVC) {
    const XLSX = await new Promise<any>((resolve, reject) => {
      gvc.addMtScript(
        [{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }],
        () => {
          resolve((window as any).XLSX);
        },
        reject
      );
    });
    return XLSX;
  }

  static userColumns = {
    基本資料: [
      'ID',
      '會員編號',
      '顧客名稱',
      '電子信箱',
      '電話',
      '生日',
      '地址',
      '性別',
      '手機載具',
      '統一編號',
      '公司',
      '收貨人',
      '收貨人地址',
      '收貨人電子郵件',
      '收貨人手機',
      '顧客備註',
    ],
    個人紀錄: ['黑名單', '會員等級', '會員有效期', '會員標籤', '註冊時間', '現有購物金', 'LINE UID', 'FB UID'],
    訂單相關: ['最後購買日期', '最後消費金額', '最後出貨日期', '累積消費金額', '累積消費次數'],
  };

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

    return checkboxContainer(this.userColumns);
  }

  static exportDialog(gvc: GVC, apiJSON: any, dataArray: any[]) {
    const vm = {
      select: 'all' as Range,
      column: [] as string[],
    };

    BgWidget.settingDialog({
      gvc,
      title: '匯出顧客',
      width: 700,
      innerHTML: gvc2 => {
        return html`<div class="d-flex flex-column align-items-start gap-2">
          <div class="tx_700 mb-2">匯出範圍</div>
          ${BgWidget.multiCheckboxContainer(
            gvc2,
            [
              { key: 'all', name: `全部顧客` },
              { key: 'search', name: '目前搜尋與篩選的結果' },
              { key: 'checked', name: `勾選的 ${dataArray.length} 位顧客` },
            ],
            [vm.select],
            (res: any) => {
              vm.select = res[0];
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
              const dialog = new ShareDialog(gvc.glitter);
              if (vm.select === 'checked' && dataArray.length === 0) {
                dialog.infoMessage({ text: '請勾選至少一位以上的顧客' });
                return;
              }

              const dataMap: Record<Range, any> = {
                search: apiJSON,
                checked: {
                  ...apiJSON,
                  id: dataArray.map(data => data.userID).join(','),
                },
                all: {},
              };

              this.export(gvc, dataMap[vm.select], vm.column);
            }),
            '匯出'
          ),
        ].join('');
      },
    });
  }

  static async export(gvc: GVC, apiJSON: any, column: string[]) {
    const dialog = new ShareDialog(gvc.glitter);

    if (column.length === 0) {
      dialog.infoMessage({ text: '請至少勾選一個匯出欄位' });
      return;
    }

    const XLSX = await this.loadXLSX(gvc);

    // 格式化資料時間
    const formatDate = (date?: string | number) =>
      date ? gvc.glitter.ut.dateFormat(new Date(date), 'yyyy-MM-dd hh:mm') : '';

    // 處理 JSON, 判斷欄位是否顯示
    const formatJSON = (obj: Record<string, any>) =>
      Object.fromEntries(Object.entries(obj).filter(([key]) => column.includes(key)));

    // 顧客欄位物件
    const getUserJSON = (user: any) =>
      formatJSON({
        ID: user.id,
        會員編號: user.userID,
        顧客名稱: user.userData.name,
        電子信箱: user.userData.email,
        電話: user.userData.phone,
        生日: user.userData.birth,
        地址: user.userData.address,
        性別: user.userData.gender,
        手機載具: user.userData.carrier_number,
        統一編號: user.userData.gui_number,
        公司: user.company || user.userData.company,
        收貨人: user.userData.consignee_name,
        收貨人地址: user.userData.consignee_address,
        收貨人電子郵件: user.userData.consignee_email,
        收貨人手機: user.userData.consignee_phone,
        顧客備註: user.userData.managerNote,
      });

    // 紀錄欄位物件
    const getRecordJSON = (user: any) => {
      return formatJSON({
        黑名單: user.status === 1 ? '否' : '是',
        會員等級: user.tag_name,
        會員有效期: formatDate(user.member_deadline),
        會員標籤: (user.userData.tags ?? []).join(','),
        註冊時間: formatDate(user.created_time),
        現有購物金: user.rebate,
        'LINE UID': user.userData.lineID,
        'FB UID': user.userData['fb-id'],
      });
    };

    // 訂單欄位物件
    const getOrderJSON = (user: any) => {
      return formatJSON({
        最後購買日期: formatDate(user.latest_order_date),
        最後消費金額: user.latest_order_total,
        最後出貨日期: user.firstShipment ? formatDate(user.firstShipment.orderData.user_info.shipment_date) : '無',
        累積消費金額: user.checkout_total,
        累積消費次數: user.checkout_count,
      });
    };

    function exportUsersToExcel(dataArray: User[]) {
      if (dataArray.length === 0) {
        dialog.errorMessage({ text: '無會員資料可以匯出' });
        return;
      }

      const printArray = dataArray.flatMap(user => {
        return [{ ...getUserJSON(user), ...getRecordJSON(user), ...getOrderJSON(user) }];
      });

      // 將 JSON 轉換為工作表
      const worksheet = XLSX.utils.json_to_sheet(printArray);

      // 建立工作簿
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '顧客列表');

      // 生成 Excel 檔案並下載
      const fileName = `顧客列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    }

    // 透過 API, 取得顧客資料
    async function fetchUsers(limit: number) {
      dialog.dataLoading({ visible: true });
      try {
        const response = await ApiUser.getUserListOrders({
          ...apiJSON,
          page: 0,
          limit: limit,
          filter_type: 'excel',
        });
        dialog.dataLoading({ visible: false });

        if (response?.response?.total > 0) {
          exportUsersToExcel(response.response.data);
        } else {
          dialog.errorMessage({ text: '匯出檔案發生錯誤' });
        }
      } catch (error) {
        dialog.dataLoading({ visible: false });
        dialog.errorMessage({ text: '無法取得顧客資料' });
      }
    }

    const limit = 250;
    dialog.checkYesOrNot({
      text: `系統將會依條件匯出資料，最多匯出${limit}筆<br/>確定要匯出嗎？`,
      callback: bool => bool && fetchUsers(limit),
    });
  }

  static import(gvc: GVC, callback: () => void) {
    const dialog = new ShareDialog(gvc.glitter);
    const id = 'import-user-excel';
    const fileInput = document.createElement('input'); // 動態建立 input
    fileInput.id = id;
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.style.display = 'none'; // 確保它不會顯示
    document.body.appendChild(fileInput);

    // 監聽變更事件
    fileInput.addEventListener('change', async function (event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files?.length) {
        try {
          const jsonData = await UserExcel.parseExcelToJson(gvc, target.files[0]);

          const setUserEmails = [...new Set(jsonData.map(user => user['電子信箱']))];
          if (jsonData.length > setUserEmails.length) {
            dialog.errorMessage({ text: '會員電子信箱不可重複' });
            return;
          }

          const setUserPhones = [...new Set(jsonData.map(user => user['電話']))];
          if (jsonData.length > setUserPhones.length) {
            dialog.errorMessage({ text: '會員電話不可重複' });
            return;
          }

          for (let i = 0; i < jsonData.length; i++) {
            const user = jsonData[i];

            if (!user['電子信箱']) {
              dialog.errorMessage({ text: '會員電子信箱不可為空' });
              return;
            }

            const userData = {
              name: user['顧客名稱'],
              email: user['電子信箱'],
              phone: user['電話'],
              birth: user['生日'],
              address: user['地址'],
              gender: user['性別'],
              carrier_number: user['手機載具'],
              gui_number: user['統一編號'],
              company: user['公司'],
              consignee_name: user['收貨人'],
              consignee_address: user['收貨人地址'],
              consignee_email: user['收貨人電子郵件'],
              consignee_phone: user['收貨人手機'],
              managerNote: user['顧客備註'],
              status: user['黑名單'] === '否' ? 1 : 0,
              lineID: user['LINE UID'],
              'fb-id': user['FB UID'],
              tags: (user['會員標籤'] ?? []).split(','),
            };

            jsonData[i] = {
              account: userData.email,
              pwd: gvc.glitter.getUUID(),
              userData: userData,
            };
          }

          dialog.dataLoading({ visible: true });
          ApiUser.quickRegister({ userArray: jsonData }).then(r => {
            dialog.dataLoading({ visible: false });

            if (r.result) {
              dialog.successMessage({ text: '匯入成功' });
              callback();
              return;
            }

            const errorData = r.response.data?.data;
            if (errorData?.emailExists) {
              dialog.errorMessage({ text: `匯入失敗，會員信箱已存在<br/>(${errorData.email})` });
              return;
            }
            if (errorData?.phoneExists) {
              dialog.errorMessage({ text: `匯入失敗，會員電話已存在<br/>(${errorData.phone})` });
              return;
            }
          });
        } catch (error) {
          console.error('解析失敗:', error);
        }
      }
    });

    // 觸發點擊事件
    fileInput.click();
  }

  static async parseExcelToJson(gvc: GVC, file: File): Promise<any[]> {
    const XLSX = await this.loadXLSX(gvc);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // 取得第一個工作表名稱
          const sheetName = workbook.SheetNames[0];

          // 取得工作表內容並轉換為 JSON
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = error => reject(error);

      reader.readAsArrayBuffer(file);
    });
  }
}
