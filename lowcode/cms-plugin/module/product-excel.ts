import { GVC } from '../../glitterBundle/GVController.js';
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { CheckInput } from '../../modules/checkInput.js';
import { Variant } from '../../public-models/product.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { Language } from '../../glitter-base/global/language.js';

const html = String.raw;

type Range = 'search' | 'checked' | 'all';

type ProductCategory = 'course' | 'commodity' | 'kitchen';

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
  sub_title: string;
  product_general_tag: string;
  product_customize_tag: string;
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

  checkString(value: any): string {
    try {
      if (CheckInput.isEmpty(value)) {
        return '';
      }
      if (typeof value === 'string' || typeof value === 'number') {
        return `${value}`;
      }
      return '';
    } catch (error) {
      return '';
    }
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

  private setHeaderStyle(): void {
    this.worksheet.getRow(1).eachCell((cell: any) => {
      cell.font = { name: 'Microsoft JhengHei', bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE1E1E1' } };
    });
  }

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

  private getByteLength(str: string): number {
    try {
      // 嘗試使用 TextEncoder（現代瀏覽器支援）
      return new TextEncoder().encode(str).length;
    } catch (e) {
      // 降級方案：手動計算字節長度
      let byteLength = 0;
      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode <= 0x007f) {
          // ASCII 字符
          byteLength += 1;
        } else if (charCode <= 0x07ff) {
          // 擴展拉丁字符
          byteLength += 2;
        } else if (charCode <= 0xffff) {
          // 大部分語言字符
          byteLength += 3;
        } else {
          // 補充字符
          byteLength += 4;
        }
      }
      return byteLength;
    }
  }

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

  private async getProductDomains(): Promise<string[]> {
    try {
      const data = await ApiShop.getProductDomain({});
      return data.result && data.response.data
        ? data.response.data
            .map((item: any) => {
              const seo = typeof item.seo === 'string' ? JSON.parse(item.seo) : item.seo;
              return seo?.domain ?? '';
            })
            .filter((domain: string) => domain.length > 0)
        : [];
    } catch (error) {
      console.error('獲取產品網域失敗', error);
      return [];
    }
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
      '商品簡述',
      '商品標籤',
      '管理員標籤',
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
      '商品簡述',
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
        '簡述內容',
        '標籤A,標籤B',
        '標籤C,標籤D',
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

  static getInitData = () => {
    return {
      name: '',
      status: '',
      category: '',
      productType: '',
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
  };

  static getProductTypeString(product: any) {
    product.productType = product.productType ?? {
      product: true,
      addProduct: false,
      giveaway: false,
    };
    if (product.productType['product']) {
      if ((product.visible || 'true') === 'false') {
        return '隱形賣場';
      } else {
        return '前台商品';
      }
    } else if (product.productType['addProduct']) {
      return '加購品';
    } else if (product.productType['giveaway']) {
      return '贈品';
    }
    return '未知';
  }

  static getSupportProductCategory() {
    const productCategories = [
      { key: 'course', value: '課程販售', compare: 'teaching' },
      { key: 'commodity', value: '零售商品', compare: 'shop' },
      { key: 'kitchen', value: '餐飲組合', compare: 'kitchen' },
      { key: 'weighing', value: '秤重交易', compare: 'weighing' },
    ];

    const webType = (window.parent as any)?.store_info?.web_type || [];

    return productCategories.filter(product => webType.includes(product.compare));
  }

  // 匯出方法
  async export(data: any, name: string) {
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

  static rowDataKeys: (keyof RowInitData)[] = [
    'name',
    'status',
    'category',
    'productType',
    'img',
    'SEO_domain',
    'SEO_title',
    'SEO_desc',
    'spec1',
    'spec1Value',
    'spec2',
    'spec2Value',
    'spec3',
    'spec3Value',
    'sku',
    'cost',
    'sale_price',
    'compare_price',
    'benefit',
    'shipment_type',
    'length',
    'width',
    'height',
    'weight',
    'weightUnit',
    'stockPolicy',
    'stock',
    'save_stock',
    'barcode',
    'sub_title',
    'product_general_tag',
    'product_customize_tag',
  ];

  // 匯出零售商品
  static exportCommodity(gvc: GVC, getFormData: any) {
    const rowInitDataKeys = this.rowDataKeys;

    const dialog = new ShareDialog(gvc.glitter);
    dialog.dataLoading({ visible: true });

    ApiShop.getProduct(getFormData).then(response => {
      const products = response.response.data;
      const exporter = new ProductExcel(gvc, ProductExcel.exampleHeader(), rowInitDataKeys);

      const exportData = products.flatMap((productData: any) => {
        const product = productData.content;
        const lang = Language.getLanguage();

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

        const getProductStatus = (status: string) => {
          switch (status) {
            case 'draft':
              return '草稿';
            case 'schedule':
              return '期間限定';
            default:
              return '啟用';
          }
        };

        const getBaseRowData = (variant: any, index: number): RowInitData => {
          return {
            id: index === 0 ? product.id || '' : '',
            name: index === 0 ? product.title || '未命名商品' : '',
            status: index === 0 ? getProductStatus(product.status) : '',
            category: index === 0 ? exporter.checkString(product.collection?.filter(Boolean).join(', ')) : '',
            productType: index === 0 ? exporter.checkString(this.getProductTypeString(product)) : '',
            img: exporter.checkString(variant?.preview_image || product.preview_image?.[0]),
            SEO_domain: index === 0 ? exporter.checkString(product.seo?.domain) : '',
            SEO_title: index === 0 ? exporter.checkString(product.seo?.title) : '',
            SEO_desc: index === 0 ? exporter.checkString(product.seo?.content) : '',
            spec1: index === 0 ? exporter.checkString(product.specs?.[0]?.title) : '',
            spec1Value: exporter.checkString(variant?.spec?.[0]),
            spec2: index === 0 ? exporter.checkString(product.specs?.[1]?.title) : '',
            spec2Value: exporter.checkString(variant?.spec?.[1]),
            spec3: index === 0 ? exporter.checkString(product.specs?.[2]?.title) : '',
            spec3Value: exporter.checkString(variant?.spec?.[2]),
            sku: exporter.checkString(variant?.sku),
            cost: exporter.checkNumber(variant?.cost),
            sale_price: exporter.checkNumber(variant?.sale_price),
            compare_price: exporter.checkNumber(variant?.compare_price),
            benefit: exporter.checkNumber(variant?.profit),
            shipment_type: getShipmentType(variant?.shipment_type),
            length: exporter.checkNumber(variant?.v_length || 0),
            width: exporter.checkNumber(variant?.v_width || 0),
            height: exporter.checkNumber(variant?.v_height || 0),
            weight: exporter.checkNumber(variant?.weight || 0),
            weightUnit: exporter.checkString(variant?.weightUnit || 'KG'),
            stockPolicy: variant?.show_understocking === 'true' ? '追蹤' : '不追蹤',
            stock: exporter.checkNumber(variant?.stock),
            save_stock: exporter.checkNumber(variant?.save_stock),
            barcode: exporter.checkString(variant?.barcode),
            sub_title: index === 0 ? exporter.checkString(product.language_data?.[lang]?.sub_title || '') : '',
            product_general_tag:
              index === 0
                ? exporter.checkString(product.product_tag?.language?.[lang]?.filter(Boolean).join(', ') || '')
                : '',
            product_customize_tag:
              index === 0 ? exporter.checkString(product.product_customize_tag?.filter(Boolean).join(', ') || '') : '',
          };
        };

        return product.variants.map((variant: any, index: number) => getBaseRowData(variant, index));
      });

      exporter.export(exportData, `商品列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}`);
      dialog.dataLoading({ visible: false });
    });
  }

  // 匯出餐飲組合
  static exportKitchen(gvc: GVC, getFormData: any) {
    const rowInitData: RowInitKitchen = {
      name: '',
      status: '',
      category: '',
      productType: '',
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
            category: index === 0 ? expo.checkString(productData.content.collection.filter(Boolean).join(', ')) : '',
            productType: index === 0 ? expo.checkString(this.getProductTypeString(productData.content)) : '',
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
            category: index === 0 ? expo.checkString(productData.content.collection.filter(Boolean).join(', ')) : '',
            productType: index === 0 ? expo.checkString(this.getProductTypeString(productData.content)) : '',
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

      expo.export(exportData, `餐飲組合列表_${ProductExcel.getFileTime()}`);
      dialog.dataLoading({ visible: false });
    });
  }

  // 匯出檔案彈出視窗
  static exportDialog(gvc: GVC, pageType: string, apiJSON: any, dataArray: any[]) {
    const vm = {
      support: '',
      file: 'excel',
      select: 'all' as Range,
      column: [] as string[],
    };

    BgWidget.settingDialog({
      gvc,
      title: '匯出商品',
      width: 700,
      innerHTML: gvc2 => {
        try {
          return html`<div class="d-flex flex-column align-items-start gap-2">
            <div class="tx_700 mb-1">匯出為</div>
            ${BgWidget.multiCheckboxContainer(
              gvc2,
              [
                {
                  key: 'excel',
                  name: 'Excel檔案',
                },
              ],
              [vm.file],
              (res: any) => {
                vm.file = res[0];
              },
              { single: true }
            )}
            <div class="tx_700 mt-2 mb-1">匯出商品類型</div>
            ${BgWidget.multiCheckboxContainer(
              gvc2,
              this.getSupportProductCategory().map(dd => {
                if (vm.support === '') {
                  vm.support = dd.key;
                }
                return {
                  key: dd.key,
                  name: dd.value,
                };
              }),
              [vm.support],
              (res: any) => {
                vm.support = res[0];
              },
              { single: true }
            )}
            <div class="tx_700 mt-2 mb-1">匯出範圍</div>
            ${BgWidget.multiCheckboxContainer(
              gvc2,
              [
                { key: 'all', name: `全部商品` },
                { key: 'search', name: '目前搜尋與篩選的結果' },
                { key: 'checked', name: `勾選的 ${dataArray.length} 個商品` },
              ],
              [vm.select],
              (res: any) => {
                vm.select = res[0];
              },
              { single: true }
            )}
          </div>`;
        } catch (error) {
          console.error(error);
          return '';
        }
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
              const dialog = new ShareDialog(gvc2.glitter);

              // 檢查是否有選中商品
              if (vm.select === 'checked' && dataArray.length === 0) {
                dialog.infoMessage({ text: '請勾選至少一個以上的商品' });
                return;
              }

              // 根據不同選擇模式生成表單數據
              const getFormData = (() => {
                const baseFormData = {
                  page: 0,
                  limit: 250,
                  productType: pageType,
                  product_category: vm.support,
                };

                const { search, searchType, orderBy, status, collection, accurate_search_collection } = apiJSON;

                const formDataMap: Record<string, any> = {
                  search: {
                    ...baseFormData,
                    search,
                    searchType,
                    orderBy,
                    status,
                    collection,
                    accurate_search_collection,
                  },
                  checked: {
                    ...baseFormData,
                    id_list: dataArray
                      .map((item: { id: number }) => item.id)
                      .filter(Boolean)
                      .join(','),
                  },
                  all: baseFormData,
                };

                return formDataMap[vm.select] || baseFormData;
              })();

              // 根據產品類別匯出不同格式
              if (['course', 'commodity', 'weighing'].includes(vm.support)) {
                this.exportCommodity(gvc, getFormData);
              } else if (vm.support === 'kitchen') {
                this.exportKitchen(gvc, getFormData);
              }
            }),
            '匯出'
          ),
        ].join('');
      },
    });
  }

  // 匯入方法
  async import(files: any, product_category: ProductCategory, callback: () => void) {
    const dialog = new ShareDialog(this.gvc.glitter);

    if (!files.files?.length) {
      return dialog.errorMessage({ text: '檔案載入失敗' });
    }

    dialog.dataLoading({ visible: true, text: '資料處理中' });

    await this.loadScript();

    const allProductDomain = await this.getProductDomains();

    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const arrayBuffer = e.target!.result;
        const workbook = new this.ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.getWorksheet(1);
        const data: any = [];
        let id_list: string[] = [];
        worksheet.eachRow({ includeEmpty: true }, (row: any) => {
          const rowData: any = [];
          row.eachCell({ includeEmpty: true }, (cell: any) => rowData.push(cell.value));
          const isEmptyRow = rowData.every((cellValue: any) => cellValue === null || cellValue === '');
          if (!isEmptyRow) {
            data.push(rowData);
          }
        });
        if (data[0][0] === '商品ID') {
          data.map((dd: any, index: number) => {
            //帶入商品ID
            id_list.push(dd[0]);
            data[index] = dd.filter((_: any, index: number) => index > 0);
          });
        }
        id_list = id_list.filter((item: string) => !['商品ID', ''].includes(item));
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

            if (rowData) {
              if (rowData.richText) {
                rowData.richText.map((item: any) => {
                  text += item.text;
                });
              } else if (rowData.hyperlink) {
                text = rowData.text ?? rowData.hyperlink;
              } else {
                text = rowData;
              }
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
                let first = true;
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
                      stock: row[17] == '追蹤' ? this.checkNumber(row_data[18]) : '',
                      language_title: {},
                    });
                  if (first) {
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
                  first = false;
                  ind_++;
                }

                function updateVariants() {
                  productData.specs = productData.specs.filter((dd: any) => dd.option && dd.option.length);
                  const specs: any = {};
                  productData.specs.map((dd: any) => {
                    specs[dd.title] = dd.option.map((d1: any) => d1.title);
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
                  product_tag: {
                    language: {},
                  },
                };
                productData.id = id_list[postMD.length];
                productData.title = this.checkString(row[0]);
                productData.status = row[1] == '啟用' ? 'active' : 'draft';
                productData.collection = row[2].split(',') ?? [];
                // 去除多餘空白
                productData.collection = productData.collection.map((item: string) => item.trim().replace(/\s+/g, ''));
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
                appendCollection = appendCollection.concat(addCollection).filter((dd: any) => dd);
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
                productData.product_category = product_category;
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
                productData.sub_title = this.checkString(row[29]);
                productData.product_tag.language[Language.getLanguage()] = (() => {
                  try {
                    return row[30].split(',').map((item: string) => item.trim().replace(/\s+/g, '')) ?? [];
                  } catch (error) {
                    return [];
                  }
                })();
                productData.product_customize_tag = (() => {
                  try {
                    return row[31].split(',').map((item: string) => item.trim().replace(/\s+/g, '')) ?? [];
                  } catch (error) {
                    return [];
                  }
                })();
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
              variantData.cost = this.checkNumber(row[15]);
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
          dialog.dataLoading({ visible: true, text: '上傳資料中' });
          await ApiShop.postMultiProduct({
            data: passData,
            token: (window.parent as any).config.token,
          }).then(() => {
            dialog.dataLoading({ visible: false });
            dialog.successMessage({ text: '上傳成功' });
            this.gvc.glitter.closeDiaLog();
            callback();
          });
        }
      } catch (e) {
        console.error(e);
        dialog.dataLoading({ visible: false });
        dialog.errorMessage({ text: '資料錯誤' });
      }
    };

    const file = files.files[0];
    reader.readAsArrayBuffer(file);
  }

  // 匯入檔案彈出視窗
  static importDialog(gvc: GVC, callback: () => void) {
    const dialog = new ShareDialog(gvc.glitter);
    const vm = {
      id: 'importDialog',
      fileInput: {} as HTMLInputElement,
      type: '' as ProductCategory,
    };

    gvc.glitter.innerDialog((gvc: GVC) => {
      const excel = new ProductExcel(
        gvc,
        this.exampleHeader().filter(item => item !== '商品ID'),
        Object.keys(this.getInitData())
      );

      return gvc.bindView({
        bind: vm.id,
        view: () => {
          const viewData = {
            title: '匯入商品',
            category: {
              title: '匯入商品類型',
              options: this.getSupportProductCategory().map(dd => {
                if (!vm.type) {
                  vm.type = dd.key as ProductCategory;
                }
                return {
                  key: dd.key,
                  name: dd.value,
                };
              }),
            },
            example: {
              event: () => {
                excel.export(
                  ProductExcel.exampleSheet(),
                  `範例_商品列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}`
                );
              },
            },
            import: {
              event: () => {
                excel.import(vm.fileInput, vm.type, () => {
                  gvc.glitter.closeDiaLog();
                  callback();
                });
              },
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
                      vm.type = res[0] as ProductCategory;
                    },
                    { single: true }
                  )}
                </div>`
              : ''}
            <div class="d-flex flex-column w-100 align-items-start gap-3" style="padding: 20px">
              <div class="d-flex align-items-center gap-2">
                <div class="tx_700">透過XLSX檔案匯入商品</div>
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
