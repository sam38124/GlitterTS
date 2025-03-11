import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Variant } from '../../public-models/product.js';
import { ActiveSchedule, Product, ProductInitial } from '../../public-models/product.js';
import { ShoppingProductSetting } from '../shopping-product-setting.js';

export interface RowInitData {
  id?: string;
  name: string;
  status: string;
  category: string;
  productType: string;
  img: string;
  SEO_domain: string;
  SEO_title: string;
  SEO_desc: string;
  spec1: string;
  spec1Value: string;
  spec2: string;
  spec2Value: string;
  spec3: string;
  spec3Value: string;
  sku: string;
  cost: string;
  sale_price: string;
  compare_price: string;
  benefit: string;
  shipment_type: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  weightUnit: string;
  stockPolicy: string;
  stock: string;
  save_stock: string;
  barcode: string;
}

export interface RowInitKitchen {
  id?: string;
  name: string;
  status: string;
  category: string;
  productType: string;
  img: string;
  SEO_domain: string;
  SEO_title: string;
  SEO_desc: string;
  spec1: string;
  spec1Value: string;
  sale_price: string;
  shipment_type: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  weightUnit: string;
  stockPolicy: string;
  stock: string;
}

export class ProductExcel {
  private workbook: any;
  private worksheet: any;
  private ExcelJS: any;
  private gvc: GVC;
  headers: string[];
  lineName: string[];

  constructor(gvc: GVC, headers: string[], lineName: string[]) {
    this.gvc = gvc;
    this.headers = headers;
    this.lineName = lineName;
  }

  checkString(value: any) {
    return CheckInput.isEmpty(value) ? '' : value;
  }

  checkNumber(value: any) {
    return CheckInput.isEmpty(value) || !CheckInput.isNumberString(`${value}`) ? 0 : value;
  }

  loadScript() {
    return new Promise(resolve => {
      if ((window as any).ExcelJS) {
        this.initExcel();
        resolve(true);
      } else {
        this.gvc.addMtScript(
          [
            {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js',
            },
            {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
            },
          ],
          () => {
            if ((window as any).XLSX) {
              this.initExcel();
              resolve(true);
            }
          },
          () => {}
        );
      }
    });
  }

  private initExcel() {
    this.ExcelJS = (window as any).ExcelJS;
    this.workbook = new this.ExcelJS.Workbook();
    this.worksheet = this.workbook.addWorksheet('Sheet1');
  }

  private insertData(data: any): void {
    data.forEach((row: any) => {
      this.worksheet.addRow(Object.values(row));
    });
  }

  private setHeader(): void {
    this.worksheet.addRow(this.headers);
  }

  // 設定標頭粗體
  private setHeaderStyle(): void {
    this.worksheet.getRow(1).eachCell((cell: any) => {
      cell.font = { name: 'Microsoft JhengHei', bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE1E1E1' } };
    });
  }

  // 設定行高1.2
  private setRowHeight(): void {
    this.worksheet.eachRow((row: any) => {
      row.height = 18;
    });
  }

  private setFontAndAlignmentStyle(): void {
    this.worksheet.eachRow((row: any) => {
      row.eachCell((cell: any) => {
        cell.font = { name: 'Microsoft JhengHei' };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const saasConfig: { config: any; api: any } = (window as any).saasConfig;
    const dialog = new ShareDialog(this.gvc.glitter);
    saasConfig.api.uploadFile(fileName).then((data: any) => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const blobData: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      const data1 = data.response;
      dialog.dataLoading({ visible: true, text: '資料處理中' });
      $.ajax({
        url: data1.url,
        type: 'put',
        data: blobData,
        processData: false,
        headers: {
          'Content-Type': data1.type,
        },
        crossDomain: true,
        success: () => {
          dialog.dataLoading({ visible: false });
          const link = document.createElement('a');
          link.href = data1.fullUrl;
          link.download = fileName;
          link.click();
        },
        error: () => {
          dialog.dataLoading({ visible: false });
          dialog.errorMessage({ text: '發生錯誤' });
        },
      });
    });
  }

  // 透過位元組的大小，判斷內容文字的適合寬度計算
  private getByteLength(str: string): number {
    let byteLength = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode <= 0x007f) {
        // ASCII 字符
        byteLength += 1;
      } else if (charCode <= 0x07ff) {
        // 扩展拉丁字符
        byteLength += 2;
      } else if (charCode <= 0xffff) {
        // 大部分语言字符
        byteLength += 3;
      } else {
        // 补充字符
        byteLength += 4;
      }
    }
    return byteLength;
  }

  // 調整excel內容的寬度
  private adjustColumnWidths(sheetData: any): void {
    const maxLengths = this.headers.map(header => this.getByteLength(header));
    sheetData.forEach((row: any) => {
      Object.values(row).forEach((value, index) => {
        const valueLength = this.getByteLength(value as string);
        if (valueLength > maxLengths[index]) {
          maxLengths[index] = valueLength;
        }
      });
    });
    this.worksheet.columns = this.headers.map((header, index) => {
      return { header, width: maxLengths[index] + 2 };
    });
  }

  // 匯入excel
  async importData(notifyId: string, file: any, product_category: 'course' | 'commodity' | 'kitchen') {
    const dialog = new ShareDialog(this.gvc.glitter);
    dialog.dataLoading({ visible: true, text: '資料處理中' });

    await this.loadScript();
    const reader = new FileReader();
    const allProductDomain: string[] = await new Promise<string[]>((resolve, reject) => {
      ApiShop.getProductDomain({}).then(data => {
        if (data.result && data.response.data) {
          const list = data.response.data.map((item: any) => {
            if (item.seo) {
              const seo = JSON.parse(item.seo);
              return seo.domain ? `${seo.domain}` : '';
            }
            return '';
          });
          resolve(list.filter((domain: string) => domain.length > 0));
        } else {
          resolve([]);
        }
      });
    });

    reader.onload = async e => {
      try {
        const arrayBuffer = e.target!.result;
        const workbook = new this.ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.getWorksheet(1);
        const data: any = [];
        let id_list: string[] = [];
        worksheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: any) => {
          const rowData: any = [];
          row.eachCell({ includeEmpty: true }, (cell: any, colNumber: any) => {
            rowData.push(cell.value);
          });
          const isEmptyRow = rowData.every((cellValue: any) => cellValue === null || cellValue === '');
          if (!isEmptyRow) {
            data.push(rowData);
          }
        });
        if (data[0][0] === '商品ID') {
          data.map((dd: any, index: number) => {
            //帶入商品ID
            id_list.push(dd[0]);
            data[index] = dd.filter((d1: any, index: number) => {
              return index > 0;
            });
          });
        }
        id_list = id_list.filter((item: string) => {
          return !['商品ID', ''].includes(item);
        });
        let error = false;
        let addCollection: any = [];
        let appendCollection: any = [];
        let postMD: {
          title: string;
          productType: {
            product: boolean;
            addProduct: boolean;
            giveaway: boolean;
          };
          content: string;
          preview_image: string;
          hideIndex: string;
          collection: string[];
          status: 'active' | 'draft';
          specs: { title: string; option: any }[];
          variants: Variant[];
          seo: {
            title: string;
            content: string;
            keywords: string;
          };
          template: string;
        }[] = [];
        let productData: any = {};
        const getVariantData: () => Variant = () => {
          return {
            barcode: '',
            compare_price: 0,
            origin_price: 0,
            cost: 0,
            preview_image: '',
            profit: 0,
            sale_price: 0,
            shipment_type: 'weight',
            show_understocking: '',
            sku: '',
            spec: [],
            stock: 0,
            stockList: {},
            type: '',
            v_height: 0,
            v_length: 0,
            v_width: 0,
            weight: 0,
          };
        };

        function errorCallback(
          text: string,
          obj?: {
            warningMessageView?: boolean;
          }
        ) {
          error = true;
          dialog.dataLoading({ visible: false });
          if (obj && obj.warningMessageView) {
            dialog.warningMessage({
              text,
              callback: () => {},
            });
          } else {
            dialog.infoMessage({ text });
          }
        }

        data.forEach((row: any, index: number) => {
          row.forEach((rowData: any, i: number) => {
            let text = '';
            if (rowData && rowData.richText) {
              rowData.richText.map((item: any) => {
                text += item.text;
              });
            } else {
              text = rowData ?? '';
            }
            row[i] = text;
          });
          const variantData = getVariantData();
          if (index != 0) {
            //判斷是餐飲組合且有多組合
            if (product_category === 'kitchen') {
              if (row[1]) {
                if (Object.keys(productData).length != 0) {
                  postMD.push(productData);
                }
                addCollection = [];
                productData = {
                  title: '',
                  productType: {
                    product: false,
                    addProduct: false,
                    giveaway: false,
                  },
                  visible: 'true',
                  content: '',
                  status: 'active',
                  collection: [],
                  hideIndex: 'false',
                  preview_image: '',
                  specs: [],
                  variants: [],
                  seo: {
                    domain: '',
                    title: '',
                    content: '',
                    keywords: '',
                  },
                  template: '',
                };
                productData.id = id_list[postMD.length];
                productData.title = this.checkString(row[0]);
                productData.status = row[1] == '啟用' ? 'active' : 'draft';
                productData.collection = row[2].split(',') ?? [];
                const regex = /[\s\/\\]+/g;
                // 去除多餘空白
                productData.collection = productData.collection.map((item: string) => item.replace(/\s+/g, ''));
                productData.collection.forEach((row: any) => {
                  let collection = row.replace(/\s+/g, '');
                  // if (regex.test(collection)) {
                  //     errorCallback(`第${index + 1}行的類別名稱不可包含空白格與以下符號：「 / 」「 \\ 」，並以「 , 」區分不同類別`);
                  //     return;
                  // }

                  // 若帶有/，要自動加上父類
                  function splitStringIncrementally(input: string): string[] {
                    const parts = input.split('/');
                    const result: string[] = [];

                    // 使用 reduce 来构建每一部分的拼接字符串
                    parts.reduce((acc, part) => {
                      const newAcc = acc ? `${acc} / ${part}` : part;
                      result.push(newAcc);
                      return newAcc;
                    }, '');

                    return result;
                  }

                  if (collection.split('/').length > 1) {
                    // 會進來代表有/的內容 需要檢查放進去的collection有沒有父類
                    // 先取得目前分層 例如 貓/貓用品/貓砂/A品牌 會拆分成 貓/貓用品/貓砂 , 貓/貓用品, 貓
                    // 然後把父層自動推進去
                    let check = splitStringIncrementally(collection);
                    const newItems = check.filter((item: string) => !productData.collection.includes(item));
                    addCollection.push(...newItems);
                  }
                  addCollection.push(collection);
                });
                productData.collection = addCollection;
                appendCollection = appendCollection.concat(addCollection).filter((dd: any) => {
                  return dd;
                });
                switch (row[3]) {
                  case '贈品':
                    productData.productType.giveaway = true;
                    break;
                  case '加購品':
                    productData.productType.addProduct = true;
                    break;
                  case '隱形賣場':
                    productData.productType.product = true;
                    productData.visible = 'false';
                    break;
                  default:
                    productData.productType.product = true;
                    break;
                }
                productData.preview_image = row[4] ? [row[4]] : ['商品圖片'];
                productData.seo.domain = this.checkString(row[5]);
                productData.seo.title = this.checkString(row[6]);
                productData.seo.content = this.checkString(row[7]);
                productData.product_category = 'kitchen';
                productData.specs = [];
                let first=true
                // spec值 merge
                  let ind_ = index;
                  while (first || (data[ind_] && !data[ind_][1])) {
                      const row_data = data[ind_];
                      const spec_title = this.checkString(row_data[8]);
                      const spec_value = this.checkString(row_data[9]);
                      if (
                        !productData.specs.find((dd: any) => {
                            return dd.title === spec_title;
                        })
                      ) {
                          productData.specs.push({
                              language_title: {},
                              title: spec_title,
                              option: [],
                          });
                      }
                      productData.specs
                        .find((dd: any) => {
                            return dd.title === spec_title;
                        })
                        .option.push({
                          title: spec_value,
                          price: parseInt(this.checkNumber(row_data[10]), 10),
                          stock: (row[17] == '追蹤') ? this.checkNumber(row_data[18]):'',
                          language_title: {},
                      });
                      if(first){
                          const shipmentTypeMap: { [key: string]: 'weight' | 'volume' } = {
                              依重量計算: 'weight',
                              依材積計算: 'volume',
                          };
                          productData.shipment_type = shipmentTypeMap[row[11]] || 'none';
                          productData.v_length = this.checkNumber(row[12]);
                          productData.v_width = this.checkNumber(row[13]);
                          productData.v_height = this.checkNumber(row[14]);
                          productData.weight = this.checkNumber(row[15]);
                        productData.stock = row[17] == '追蹤' ? this.checkNumber(row_data[18]) : 'false';
                      }
                      first=false
                      ind_++;
                  }

                  function updateVariants() {
                      productData.specs = productData.specs.filter((dd: any) => {
                          return dd.option && dd.option.length;
                      });
                      const specs: any = {};
                      productData.specs.map((dd: any) => {
                          specs[dd.title] = dd.option.map((d1: any) => {
                              return d1.title;
                          });
                      });
                  }

                  updateVariants();
              }
            } else {
              if (row[1]) {
                if (Object.keys(productData).length != 0) {
                  postMD.push(productData);
                }
                addCollection = [];
                productData = {
                  title: '',
                  productType: {
                    product: false,
                    addProduct: false,
                    giveaway: false,
                  },
                  visible: 'true',
                  content: '',
                  status: 'active',
                  collection: [],
                  hideIndex: 'false',
                  preview_image: '',
                  specs: [],
                  variants: [],
                  seo: {
                    domain: '',
                    title: '',
                    content: '',
                    keywords: '',
                  },
                  template: '',
                };
                productData.id = id_list[postMD.length];
                productData.title = this.checkString(row[0]);
                productData.status = row[1] == '啟用' ? 'active' : 'draft';
                productData.collection = row[2].split(',') ?? [];
                const regex = /[\s\/\\]+/g;
                // 去除多餘空白
                productData.collection = productData.collection.map((item: string) => item.replace(/\s+/g, ''));
                productData.collection.forEach((row: any) => {
                  let collection = row.replace(/\s+/g, '');
                  // if (regex.test(collection)) {
                  //     errorCallback(`第${index + 1}行的類別名稱不可包含空白格與以下符號：「 / 」「 \\ 」，並以「 , 」區分不同類別`);
                  //     return;
                  // }

                  // 若帶有/，要自動加上父類
                  function splitStringIncrementally(input: string): string[] {
                    const parts = input.split('/');
                    const result: string[] = [];

                    // 使用 reduce 来构建每一部分的拼接字符串
                    parts.reduce((acc, part) => {
                      const newAcc = acc ? `${acc} / ${part}` : part;
                      result.push(newAcc);
                      return newAcc;
                    }, '');

                    return result;
                  }

                  if (collection.split('/').length > 1) {
                    // 會進來代表有/的內容 需要檢查放進去的collection有沒有父類
                    // 先取得目前分層 例如 貓/貓用品/貓砂/A品牌 會拆分成 貓/貓用品/貓砂 , 貓/貓用品, 貓
                    // 然後把父層自動推進去
                    let check = splitStringIncrementally(collection);
                    const newItems = check.filter((item: string) => !productData.collection.includes(item));
                    addCollection.push(...newItems);
                  }
                  addCollection.push(collection);
                });
                productData.collection = addCollection;
                appendCollection = appendCollection.concat(addCollection).filter((dd: any) => {
                  return dd;
                });
                switch (row[3]) {
                  case '贈品':
                    productData.productType.giveaway = true;
                    break;
                  case '加購品':
                    productData.productType.addProduct = true;
                    break;
                  case '隱形賣場':
                    productData.productType.product = true;
                    productData.visible = 'false';
                    break;
                  default:
                    productData.productType.product = true;
                    break;
                }
                productData.preview_image = row[4] ? [row[4]] : ['商品圖片'];
                productData.seo.domain = this.checkString(row[5]);
                productData.seo.title = this.checkString(row[6]);
                productData.seo.content = this.checkString(row[7]);
                // spec值 merge
                let indices = [8, 10, 12];
                indices.forEach(index => {
                  if (row[index]) {
                    productData.specs.push({
                      title: row[index],
                      option: [],
                    });
                  }
                });
              }
              let indices = [9, 11, 13];
              indices.forEach((rowindex, key) => {
                if (row[rowindex] && productData.specs.length > key) {
                  productData.specs[key].option = productData.specs[key].option ?? [];
                  const exists = productData.specs[key].option.some((item: any) => item.title === row[rowindex]);
                  if (!exists) {
                    productData.specs[key].option.push({ title: row[rowindex], expand: true });
                  }
                  variantData.spec.push(row[rowindex]);
                }
              });
              variantData.preview_image = row[4];
              variantData.sku = this.checkString(row[14]);
              variantData.cost = this.checkString(row[15]);
              variantData.sale_price = this.checkNumber(row[16]);
              variantData.compare_price = this.checkNumber(row[17]);
              variantData.profit = this.checkNumber(row[18]);
              const shipmentTypeMap: { [key: string]: 'weight' | 'volume' } = {
                依重量計算: 'weight',
                依材積計算: 'volume',
              };
              variantData.shipment_type = shipmentTypeMap[row[19]] || 'none';
              variantData.v_length = this.checkNumber(row[20]);
              variantData.v_width = this.checkNumber(row[21]);
              variantData.v_height = this.checkNumber(row[22]);
              variantData.weight = this.checkNumber(row[23]);
              variantData.show_understocking = row[25] == '追蹤' ? 'true' : 'false';
              variantData.stock = this.checkNumber(row[26]);
              variantData.save_stock = this.checkNumber(row[27]);
              variantData.barcode = this.checkString(row[28]);
              productData.variants.push(JSON.parse(JSON.stringify(variantData)));
            }
          }
        });
        postMD.push(productData);

        //商品連結若為空，則預設值為商品名稱
        postMD.map((dd: any) => {
          dd.seo.domain = dd.seo.domain || dd.title;
        });
        const domainList = postMD
          .filter((item: any, index: number) => {
            return !id_list[index];
          })
          .map((item: any) => {
            return item.seo.domain;
          });
        // 判斷excel中是否有重複的domain
        const filteredArr = domainList.filter((item: string) => {
          return item && item.length > 0 && item.trim().length > 0;
        });
        // 過濾掉空白字串
        const hasDuplicates = new Set(filteredArr).size !== filteredArr.length;
        if (hasDuplicates) {
          errorCallback(
            '「商品連結」的值不可重複<br/>如果「商品連結」為空，預設值為該商品的「商品名稱」<br/>則該「商品名稱」不可與其它「商品連結」重複',
            {
              warningMessageView: true,
            }
          );
          return;
        }

        //判斷已建立產品中是否有重複存在的domain
        const productDomainSet = new Set(allProductDomain);
        const duplicateDomain = domainList.find((domain: string) => domain.length > 0 && productDomainSet.has(domain));
        if (duplicateDomain) {
          errorCallback(`商品連結「${duplicateDomain}」已有產品使用，請更換該欄位的值`);
          return;
        }

        let passData = {
          data: postMD,
          collection: appendCollection,
        };
        dialog.dataLoading({ visible: false });
        if (!error) {
          // return
          dialog.dataLoading({ visible: true, text: '上傳資料中' });
          console.log(`passData=>`,passData);
          await ApiShop.postMultiProduct({
            data: passData,
            token: (window.parent as any).config.token,
          }).then(() => {
            dialog.dataLoading({ visible: false });
            dialog.successMessage({ text: '上傳成功' });
            this.gvc.glitter.closeDiaLog();
            this.gvc.notifyDataChange(notifyId);
          });
        }
      } catch (e) {
        console.error(e);
        dialog.dataLoading({ visible: false });
        dialog.errorMessage({ text: '資料錯誤' });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async exportData(data: any, name: string) {
    await this.loadScript();
    this.setHeader();
    this.insertData(data);
    this.setHeaderStyle();
    this.setRowHeight();
    this.setFontAndAlignmentStyle();
    this.adjustColumnWidths(data);
    const buffer = await this.workbook.xlsx.writeBuffer();
    this.saveAsExcelFile(buffer, `${name}.xlsx`);
  }

  static getFileTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  static exampleHeader() {
    return [
      '商品ID',
      '商品名稱',
      '使用狀態（啟用/草稿）',
      '商品類別',
      '上架類型（前台商品/加購品/贈品/隱形賣場）',
      '規格圖網址',
      '商品連結',
      'SEO標題',
      'SEO描述',
      '規格1',
      '規格詳細',
      '規格2',
      '規格詳細',
      '規格3',
      '規格詳細',
      'SKU',
      '成本',
      '售價',
      '原價',
      '利潤',
      '運費計算方式',
      '長度',
      '寬度',
      '高度',
      '商品重量',
      '重量單位',
      '庫存政策',
      '庫存數量',
      '安全庫存數量',
      '商品條碼',
    ];
  }

  static exampleKitchen() {
    return [
      '商品ID',
      '商品名稱',
      '使用狀態（啟用/草稿）',
      '商品類別',
      '上架類型（前台商品/加購品/贈品/隱形賣場）',
      '規格圖網址',
      '商品連結',
      'SEO標題',
      'SEO描述',
      '規格1',
      '規格詳細',
      '售價',
      '運費計算方式',
      '長度',
      '寬度',
      '高度',
      '商品重量',
      '重量單位',
      '庫存政策',
      '庫存數量',
    ];
  }

  static exampleHeaderKitchen() {
    return [
      '商品ID',
      '商品名稱',
      '使用狀態（啟用/草稿）',
      '商品類別',
      '上架類型（前台商品/加購品/贈品/隱形賣場）',
      '規格圖網址',
      '商品連結',
      'SEO標題',
      'SEO描述',
      '規格1',
      '規格詳細',
      '規格2',
      '規格詳細',
      '規格3',
      '規格詳細',
      'SKU',
      '成本',
      '售價',
      '原價',
      '利潤',
      '運費計算方式',
      '長度',
      '寬度',
      '高度',
      '商品重量',
      '重量單位',
      '庫存政策',
      '庫存數量',
      '安全庫存數量',
      '商品條碼',
    ];
  }

  static exampleSheet() {
    return [
      [
        '商品測試A',
        '啟用',
        '工具,把手',
        '商品',
        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
        '商品連結A',
        'SEO標題A',
        'SEO描述A',
        '顏色',
        '黑色',
        '尺寸',
        '小型',
        '',
        '',
        'A00100230',
        '15000',
        '25000',
        '30000',
        '0',
        '依重量計算',
        '',
        '',
        '',
        '100',
        'KG',
        '追蹤',
        '100',
        '10',
        'CODE1230',
      ],
      [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '黑色',
        '',
        '大型',
        '',
        '',
        'A00100231',
        '24000',
        '35000',
        '40000',
        '0',
        '依重量計算',
        '',
        '',
        '',
        '110',
        'KG',
        '追蹤',
        '100',
        '10',
        'CODE1231',
      ],
      [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '棕色',
        '',
        '小型',
        '',
        '',
        'A00100232',
        '15000',
        '25000',
        '30000',
        '0',
        '依重量計算',
        '',
        '',
        '',
        '120',
        'KG',
        '追蹤',
        '100',
        '10',
        'CODE1232',
      ],
      [
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '棕色',
        '',
        '大型',
        '',
        '',
        'A00100233',
        '24000',
        '35000',
        '40000',
        '0',
        '依重量計算',
        '',
        '',
        '',
        '130',
        'KG',
        '追蹤',
        '100',
        '10',
        'CODE1233',
      ],
      [
        '商品測試B',
        '草稿',
        '工具',
        '加購品',
        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
        '商品連結B',
        'SEO標題B',
        'SEO描述B',
        '顏色',
        '白色',
        '尺寸',
        '小型',
        '',
        '',
        'A00100567',
        '12500',
        '22000',
        '28000',
        '0',
        '依材積計算',
        '10',
        '10',
        '10',
        '',
        '',
        '不追蹤',
        '',
        '',
        'CODE5678',
      ],
      [
        '商品測試C',
        '啟用',
        '收納用品',
        '贈品',
        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
        '商品連結C',
        'SEO標題C',
        'SEO描述C',
        '顏色',
        '紅色',
        '',
        '',
        '',
        '',
        'A00100890',
        '13500',
        '24000',
        '32000',
        '0',
        '依材積計算',
        '20',
        '20',
        '20',
        '',
        '',
        '追蹤',
        '200',
        '20',
        'CODE9900',
      ],
      [
        '商品測試D',
        '草稿',
        '衛生用品',
        '隱形賣場',
        'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg',
        '商品連結D',
        'SEO標題D',
        'SEO描述D',
        '顏色',
        '藍色',
        '尺寸',
        '大型',
        '版型',
        '窄版',
        'A00200234',
        '8000',
        '12000',
        '15000',
        '0',
        '依重量計算',
        '',
        '',
        '',
        '50',
        'KG',
        '不追蹤',
        '',
        '',
        'CODE1357',
      ],
    ];
  }

  //匯出零售商品資料
  static exportCommodity(getFormData: any, gvc: GVC) {
    const rowInitData: RowInitData = {
      name: '',
      status: '',
      category: '',
      productType: ``,
      img: '',
      SEO_domain: '',
      SEO_title: '',
      SEO_desc: '',
      spec1: '',
      spec1Value: '',
      spec2: '',
      spec2Value: '',
      spec3: '',
      spec3Value: '',
      sku: '',
      cost: '',
      sale_price: '',
      compare_price: '',
      benefit: '',
      shipment_type: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      weightUnit: '',
      stockPolicy: '',
      stock: '',
      save_stock: '',
      barcode: '',
    };
    const dialog = new ShareDialog(gvc.glitter);
    dialog.dataLoading({ visible: true });
    ApiShop.getProduct(getFormData).then(response => {
      const expo = new ProductExcel(gvc, ProductExcel.exampleHeader(), Object.keys(rowInitData));
      let exportData: any[] = [];
      // todo stocklist還沒放
      response.response.data.forEach((productData: any) => {
        const baseRowData = (index: number): RowInitData => ({
          id: index === 0 ? productData.content.id || '' : '',
          name: index === 0 ? productData.content.title || '未命名商品' : '',
          status:
            index === 0
              ? (() => {
                  switch (productData.content?.status) {
                    case 'draft':
                      return '草稿';
                    case 'schedule':
                      return '期間限定';
                    default:
                      return '啟用';
                  }
                })()
              : '',
          category: index === 0 ? expo.checkString(productData.content.collection.join(' , ')) : '',
          productType:
            index === 0 ? expo.checkString(ShoppingProductSetting.getProductTypeString(productData.content)) : '',
          img: expo.checkString(
            (productData.content.variants[index] && productData.content.variants[index].preview_image) ||
              productData.content.preview_image[0]
          ),
          SEO_domain: index === 0 ? expo.checkString(productData.content?.seo?.domain) : '',
          SEO_title: index === 0 ? expo.checkString(productData.content?.seo?.title) : '',
          SEO_desc: index === 0 ? expo.checkString(productData.content?.seo?.content) : '',
          spec1: index === 0 ? expo.checkString(productData.content?.specs[0]?.title) : '',
          spec1Value: expo.checkString(productData.content.variants[index]?.spec[0]),
          spec2: index === 0 ? expo.checkString(productData.content?.specs[1]?.title) : '',
          spec2Value: expo.checkString(productData.content.variants[index]?.spec[1]),
          spec3: index === 0 ? expo.checkString(productData.content?.specs[2]?.title) : '',
          spec3Value: expo.checkString(productData.content.variants[index]?.spec[2]),
          sku: expo.checkString(productData.content.variants[index]?.sku),
          cost: expo.checkNumber(productData.content.variants[index]?.cost),
          sale_price: expo.checkNumber(productData.content.variants[index]?.sale_price),
          compare_price: expo.checkNumber(productData.content.variants[index]?.compare_price),
          benefit: expo.checkNumber(productData.content.variants[index]?.profit),
          shipment_type: getShipmentType(productData.content.variants[index]?.shipment_type),
          length: expo.checkNumber(productData.content.variants[index]?.v_length || 0),
          width: expo.checkNumber(productData.content.variants[index]?.v_width || 0),
          height: expo.checkNumber(productData.content.variants[index]?.v_height || 0),
          weight: expo.checkNumber(productData.content.variants[index]?.weight || 0),
          weightUnit: expo.checkString(productData.content.variants[index]?.weightUnit || 'KG'),
          stockPolicy: productData.content.variants[index]?.show_understocking === 'true' ? '追蹤' : '不追蹤',
          stock: expo.checkNumber(productData.content.variants[index]?.stock),
          save_stock: expo.checkNumber(productData.content.variants[index]?.save_stock),
          barcode: expo.checkString(productData.content.variants[index]?.barcode),
        });

        const getShipmentType = (type: string) => {
          switch (type) {
            case 'volume':
              return '依材積計算';
            case 'none':
              return '不計算運費';
            default:
              return '依重量計算';
          }
        };

        productData.content.variants.forEach((variant: any, index: number) => {
          const rowData = baseRowData(index);
          exportData.push(rowData);
        });
      });

      expo.exportData(exportData, `商品詳細列表_${ProductExcel.getFileTime()}`);
      dialog.dataLoading({ visible: false });
    });
  }

  //匯出餐飲組合
  static exportKitchen(getFormData: any, gvc: GVC) {
    const rowInitData: RowInitKitchen = {
      name: '',
      status: '',
      category: '',
      productType: ``,
      img: '',
      SEO_domain: '',
      SEO_title: '',
      SEO_desc: '',
      spec1: '',
      spec1Value: '',
      sale_price: '',
      shipment_type: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      weightUnit: '',
      stockPolicy: '',
      stock: '',
    };
    const dialog = new ShareDialog(gvc.glitter);
    dialog.dataLoading({ visible: true });
    ApiShop.getProduct(getFormData).then(response => {
      const expo = new ProductExcel(gvc, ProductExcel.exampleKitchen(), Object.keys(rowInitData));
      let exportData: any[] = [];
      // todo stocklist還沒放
      response.response.data.forEach((productData: any) => {
        const getShipmentType = (type: string) => {
          switch (type) {
            case 'volume':
              return '依材積計算';
            case 'none':
              return '不計算運費';
            default:
              return '依重量計算';
          }
        };

        if (productData.content.specs.length) {
          const baseRowData = (specs: any, option: any, index: number): RowInitKitchen => ({
            id: index === 0 ? productData.content.id || '' : '',
            name: index === 0 ? productData.content.title || '未命名商品' : '',
            status:
              index === 0
                ? (() => {
                    switch (productData.content?.status) {
                      case 'draft':
                        return '草稿';
                      case 'schedule':
                        return '期間限定';
                      default:
                        return '啟用';
                    }
                  })()
                : '',
            category: index === 0 ? expo.checkString(productData.content.collection.join(' , ')) : '',
            productType:
              index === 0 ? expo.checkString(ShoppingProductSetting.getProductTypeString(productData.content)) : '',
            img: expo.checkString(productData.content.preview_image[0]),
            SEO_domain: index === 0 ? expo.checkString(productData.content?.seo?.domain) : '',
            SEO_title: index === 0 ? expo.checkString(productData.content?.seo?.title) : '',
            SEO_desc: index === 0 ? expo.checkString(productData.content?.seo?.content) : '',
            spec1: expo.checkString(specs?.title),
            spec1Value: expo.checkString(option.title),
            sale_price: expo.checkNumber(option.price),
            shipment_type: getShipmentType(productData.shipment_type),
            length: expo.checkNumber(productData.v_length || 0),
            width: expo.checkNumber(productData.v_width || 0),
            height: expo.checkNumber(productData.v_height || 0),
            weight: expo.checkNumber(productData.weight || 0),
            weightUnit: expo.checkString(productData.weightUnit || 'KG'),
            stockPolicy: `${productData.content.variants[index]?.stock ?? ''}` ? '追蹤' : '不追蹤',
            stock: expo.checkNumber(productData.content.variants[index]?.stock),
          });
          productData.content.specs.map((dd: any, index: number) => {
            dd.option.map((d3: any, index1: number) => {
              const rowData = baseRowData(dd, d3, index + index1);
              exportData.push(rowData);
            });
          });
        } else {
          const baseRowData = (index: number): RowInitKitchen => ({
            id: index === 0 ? productData.content.id || '' : '',
            name: index === 0 ? productData.content.title || '未命名商品' : '',
            status:
              index === 0
                ? (() => {
                    switch (productData.content?.status) {
                      case 'draft':
                        return '草稿';
                      case 'schedule':
                        return '期間限定';
                      default:
                        return '啟用';
                    }
                  })()
                : '',
            category: index === 0 ? expo.checkString(productData.content.collection.join(' , ')) : '',
            productType:
              index === 0 ? expo.checkString(ShoppingProductSetting.getProductTypeString(productData.content)) : '',
            img: expo.checkString(
              (productData.content.variants[index] && productData.content.variants[index].preview_image) ||
                productData.content.preview_image[0]
            ),
            SEO_domain: index === 0 ? expo.checkString(productData.content?.seo?.domain) : '',
            SEO_title: index === 0 ? expo.checkString(productData.content?.seo?.title) : '',
            SEO_desc: index === 0 ? expo.checkString(productData.content?.seo?.content) : '',
            spec1: index === 0 ? expo.checkString(productData.content?.specs[0]?.title) : '',
            spec1Value: expo.checkString(productData.content.variants[index]?.spec[0]),
            sale_price: expo.checkNumber(productData.content.variants[index]?.sale_price),
            shipment_type: getShipmentType(productData.content.variants[index]?.shipment_type),
            length: expo.checkNumber(productData.content.variants[index]?.v_length || 0),
            width: expo.checkNumber(productData.content.variants[index]?.v_width || 0),
            height: expo.checkNumber(productData.content.variants[index]?.v_height || 0),
            weight: expo.checkNumber(productData.content.variants[index]?.weight || 0),
            weightUnit: expo.checkString(productData.content.variants[index]?.weightUnit || 'KG'),
            stockPolicy: productData.content.variants[index]?.show_understocking === 'true' ? '追蹤' : '不追蹤',
            stock: expo.checkNumber(productData.content.variants[index]?.stock),
          });
          const rowData = baseRowData(0);
          exportData.push(rowData);
        }
      });

      expo.exportData(exportData, `餐飲組合列表_${ProductExcel.getFileTime()}`);
      dialog.dataLoading({ visible: false });
    });
  }
}
