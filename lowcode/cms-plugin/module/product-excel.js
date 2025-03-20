var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from '../../glitterBundle/dialog/ShareDialog.js';
import { ApiShop } from '../../glitter-base/route/shopping.js';
import { CheckInput } from '../../modules/checkInput.js';
import { BgWidget } from '../../backend-manager/bg-widget.js';
import { Language } from '../../glitter-base/global/language.js';
const html = String.raw;
export class ProductExcel {
    constructor(gvc, headers, lineName) {
        this.gvc = gvc;
        this.headers = headers;
        this.lineName = lineName;
    }
    checkString(value) {
        return CheckInput.isEmpty(value) ? '' : value;
    }
    checkNumber(value) {
        return CheckInput.isEmpty(value) || !CheckInput.isNumberString(`${value}`) ? 0 : value;
    }
    loadScript() {
        return new Promise(resolve => {
            if (window.ExcelJS) {
                this.initExcel();
                resolve(true);
            }
            else {
                this.gvc.addMtScript([
                    {
                        src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js',
                    },
                    {
                        src: 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js',
                    },
                ], () => {
                    if (window.XLSX) {
                        this.initExcel();
                        resolve(true);
                    }
                }, () => { });
            }
        });
    }
    initExcel() {
        this.ExcelJS = window.ExcelJS;
        this.workbook = new this.ExcelJS.Workbook();
        this.worksheet = this.workbook.addWorksheet('Sheet1');
    }
    insertData(data) {
        data.forEach((row) => {
            this.worksheet.addRow(Object.values(row));
        });
    }
    setHeader() {
        this.worksheet.addRow(this.headers);
    }
    setHeaderStyle() {
        this.worksheet.getRow(1).eachCell((cell) => {
            cell.font = { name: 'Microsoft JhengHei', bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE1E1E1' } };
        });
    }
    setRowHeight() {
        this.worksheet.eachRow((row) => {
            row.height = 18;
        });
    }
    setFontAndAlignmentStyle() {
        this.worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.font = { name: 'Microsoft JhengHei' };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });
    }
    saveAsExcelFile(buffer, fileName) {
        const saasConfig = window.saasConfig;
        const dialog = new ShareDialog(this.gvc.glitter);
        saasConfig.api.uploadFile(fileName).then((data) => {
            const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const blobData = new Blob([buffer], { type: EXCEL_TYPE });
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
    getByteLength(str) {
        try {
            return new TextEncoder().encode(str).length;
        }
        catch (e) {
            let byteLength = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                if (charCode <= 0x007f) {
                    byteLength += 1;
                }
                else if (charCode <= 0x07ff) {
                    byteLength += 2;
                }
                else if (charCode <= 0xffff) {
                    byteLength += 3;
                }
                else {
                    byteLength += 4;
                }
            }
            return byteLength;
        }
    }
    adjustColumnWidths(sheetData) {
        const maxLengths = this.headers.map(header => this.getByteLength(header));
        sheetData.forEach((row) => {
            Object.values(row).forEach((value, index) => {
                const valueLength = this.getByteLength(value);
                if (valueLength > maxLengths[index]) {
                    maxLengths[index] = valueLength;
                }
            });
        });
        this.worksheet.columns = this.headers.map((header, index) => {
            return { header, width: maxLengths[index] + 2 };
        });
    }
    getProductDomains() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ApiShop.getProductDomain({});
                return data.result && data.response.data
                    ? data.response.data
                        .map((item) => {
                        var _a;
                        const seo = typeof item.seo === 'string' ? JSON.parse(item.seo) : item.seo;
                        return (_a = seo === null || seo === void 0 ? void 0 : seo.domain) !== null && _a !== void 0 ? _a : '';
                    })
                        .filter((domain) => domain.length > 0)
                    : [];
            }
            catch (error) {
                console.error('獲取產品網域失敗', error);
                return [];
            }
        });
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
    static getProductTypeString(product) {
        var _a;
        product.productType = (_a = product.productType) !== null && _a !== void 0 ? _a : {
            product: true,
            addProduct: false,
            giveaway: false,
        };
        if (product.productType['product']) {
            if ((product.visible || 'true') === 'false') {
                return '隱形賣場';
            }
            else {
                return '前台商品';
            }
        }
        else if (product.productType['addProduct']) {
            return '加購品';
        }
        else if (product.productType['giveaway']) {
            return '贈品';
        }
        return '未知';
    }
    static getSupportProductCategory() {
        var _a, _b;
        const productCategories = [
            { key: 'course', value: '課程販售', compare: 'teaching' },
            { key: 'commodity', value: '零售商品', compare: 'shop' },
            { key: 'kitchen', value: '餐飲組合', compare: 'kitchen' },
        ];
        const webType = ((_b = (_a = window.parent) === null || _a === void 0 ? void 0 : _a.store_info) === null || _b === void 0 ? void 0 : _b.web_type) || [];
        return productCategories.filter(product => webType.includes(product.compare));
    }
    export(data, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadScript();
            this.setHeader();
            this.insertData(data);
            this.setHeaderStyle();
            this.setRowHeight();
            this.setFontAndAlignmentStyle();
            this.adjustColumnWidths(data);
            const buffer = yield this.workbook.xlsx.writeBuffer();
            this.saveAsExcelFile(buffer, `${name}.xlsx`);
        });
    }
    static exportCommodity(gvc, getFormData) {
        const rowInitData = {
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
            sub_title: '',
        };
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ visible: true });
        ApiShop.getProduct(getFormData).then(response => {
            const expo = new ProductExcel(gvc, ProductExcel.exampleHeader(), Object.keys(rowInitData));
            let exportData = [];
            response.response.data.forEach((productData) => {
                const baseRowData = (index) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
                    return ({
                        id: index === 0 ? productData.content.id || '' : '',
                        name: index === 0 ? productData.content.title || '未命名商品' : '',
                        status: index === 0
                            ? (() => {
                                var _a;
                                switch ((_a = productData.content) === null || _a === void 0 ? void 0 : _a.status) {
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
                        productType: index === 0 ? expo.checkString(this.getProductTypeString(productData.content)) : '',
                        img: expo.checkString((productData.content.variants[index] && productData.content.variants[index].preview_image) ||
                            productData.content.preview_image[0]),
                        SEO_domain: index === 0 ? expo.checkString((_b = (_a = productData.content) === null || _a === void 0 ? void 0 : _a.seo) === null || _b === void 0 ? void 0 : _b.domain) : '',
                        SEO_title: index === 0 ? expo.checkString((_d = (_c = productData.content) === null || _c === void 0 ? void 0 : _c.seo) === null || _d === void 0 ? void 0 : _d.title) : '',
                        SEO_desc: index === 0 ? expo.checkString((_f = (_e = productData.content) === null || _e === void 0 ? void 0 : _e.seo) === null || _f === void 0 ? void 0 : _f.content) : '',
                        spec1: index === 0 ? expo.checkString((_h = (_g = productData.content) === null || _g === void 0 ? void 0 : _g.specs[0]) === null || _h === void 0 ? void 0 : _h.title) : '',
                        spec1Value: expo.checkString((_j = productData.content.variants[index]) === null || _j === void 0 ? void 0 : _j.spec[0]),
                        spec2: index === 0 ? expo.checkString((_l = (_k = productData.content) === null || _k === void 0 ? void 0 : _k.specs[1]) === null || _l === void 0 ? void 0 : _l.title) : '',
                        spec2Value: expo.checkString((_m = productData.content.variants[index]) === null || _m === void 0 ? void 0 : _m.spec[1]),
                        spec3: index === 0 ? expo.checkString((_p = (_o = productData.content) === null || _o === void 0 ? void 0 : _o.specs[2]) === null || _p === void 0 ? void 0 : _p.title) : '',
                        spec3Value: expo.checkString((_q = productData.content.variants[index]) === null || _q === void 0 ? void 0 : _q.spec[2]),
                        sku: expo.checkString((_r = productData.content.variants[index]) === null || _r === void 0 ? void 0 : _r.sku),
                        cost: expo.checkNumber((_s = productData.content.variants[index]) === null || _s === void 0 ? void 0 : _s.cost),
                        sale_price: expo.checkNumber((_t = productData.content.variants[index]) === null || _t === void 0 ? void 0 : _t.sale_price),
                        compare_price: expo.checkNumber((_u = productData.content.variants[index]) === null || _u === void 0 ? void 0 : _u.compare_price),
                        benefit: expo.checkNumber((_v = productData.content.variants[index]) === null || _v === void 0 ? void 0 : _v.profit),
                        shipment_type: getShipmentType((_w = productData.content.variants[index]) === null || _w === void 0 ? void 0 : _w.shipment_type),
                        length: expo.checkNumber(((_x = productData.content.variants[index]) === null || _x === void 0 ? void 0 : _x.v_length) || 0),
                        width: expo.checkNumber(((_y = productData.content.variants[index]) === null || _y === void 0 ? void 0 : _y.v_width) || 0),
                        height: expo.checkNumber(((_z = productData.content.variants[index]) === null || _z === void 0 ? void 0 : _z.v_height) || 0),
                        weight: expo.checkNumber(((_0 = productData.content.variants[index]) === null || _0 === void 0 ? void 0 : _0.weight) || 0),
                        weightUnit: expo.checkString(((_1 = productData.content.variants[index]) === null || _1 === void 0 ? void 0 : _1.weightUnit) || 'KG'),
                        stockPolicy: ((_2 = productData.content.variants[index]) === null || _2 === void 0 ? void 0 : _2.show_understocking) === 'true' ? '追蹤' : '不追蹤',
                        stock: expo.checkNumber((_3 = productData.content.variants[index]) === null || _3 === void 0 ? void 0 : _3.stock),
                        save_stock: expo.checkNumber((_4 = productData.content.variants[index]) === null || _4 === void 0 ? void 0 : _4.save_stock),
                        barcode: expo.checkString((_5 = productData.content.variants[index]) === null || _5 === void 0 ? void 0 : _5.barcode),
                        sub_title: expo.checkString(productData.content.language_data[Language.getLanguage()].sub_title),
                    });
                };
                const getShipmentType = (type) => {
                    switch (type) {
                        case 'volume':
                            return '依材積計算';
                        case 'none':
                            return '不計算運費';
                        default:
                            return '依重量計算';
                    }
                };
                productData.content.variants.forEach((variant, index) => {
                    const rowData = baseRowData(index);
                    exportData.push(rowData);
                });
            });
            expo.export(exportData, `商品列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}`);
            dialog.dataLoading({ visible: false });
        });
    }
    static exportKitchen(gvc, getFormData) {
        const rowInitData = {
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
            let exportData = [];
            response.response.data.forEach((productData) => {
                const getShipmentType = (type) => {
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
                    const baseRowData = (specs, option, index) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        return ({
                            id: index === 0 ? productData.content.id || '' : '',
                            name: index === 0 ? productData.content.title || '未命名商品' : '',
                            status: index === 0
                                ? (() => {
                                    var _a;
                                    switch ((_a = productData.content) === null || _a === void 0 ? void 0 : _a.status) {
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
                            productType: index === 0 ? expo.checkString(this.getProductTypeString(productData.content)) : '',
                            img: expo.checkString(productData.content.preview_image[0]),
                            SEO_domain: index === 0 ? expo.checkString((_b = (_a = productData.content) === null || _a === void 0 ? void 0 : _a.seo) === null || _b === void 0 ? void 0 : _b.domain) : '',
                            SEO_title: index === 0 ? expo.checkString((_d = (_c = productData.content) === null || _c === void 0 ? void 0 : _c.seo) === null || _d === void 0 ? void 0 : _d.title) : '',
                            SEO_desc: index === 0 ? expo.checkString((_f = (_e = productData.content) === null || _e === void 0 ? void 0 : _e.seo) === null || _f === void 0 ? void 0 : _f.content) : '',
                            spec1: expo.checkString(specs === null || specs === void 0 ? void 0 : specs.title),
                            spec1Value: expo.checkString(option.title),
                            sale_price: expo.checkNumber(option.price),
                            shipment_type: getShipmentType(productData.shipment_type),
                            length: expo.checkNumber(productData.v_length || 0),
                            width: expo.checkNumber(productData.v_width || 0),
                            height: expo.checkNumber(productData.v_height || 0),
                            weight: expo.checkNumber(productData.weight || 0),
                            weightUnit: expo.checkString(productData.weightUnit || 'KG'),
                            stockPolicy: `${(_h = (_g = productData.content.variants[index]) === null || _g === void 0 ? void 0 : _g.stock) !== null && _h !== void 0 ? _h : ''}` ? '追蹤' : '不追蹤',
                            stock: expo.checkNumber((_j = productData.content.variants[index]) === null || _j === void 0 ? void 0 : _j.stock),
                        });
                    };
                    productData.content.specs.map((dd, index) => {
                        dd.option.map((d3, index1) => {
                            const rowData = baseRowData(dd, d3, index + index1);
                            exportData.push(rowData);
                        });
                    });
                }
                else {
                    const baseRowData = (index) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
                        return ({
                            id: index === 0 ? productData.content.id || '' : '',
                            name: index === 0 ? productData.content.title || '未命名商品' : '',
                            status: index === 0
                                ? (() => {
                                    var _a;
                                    switch ((_a = productData.content) === null || _a === void 0 ? void 0 : _a.status) {
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
                            productType: index === 0 ? expo.checkString(this.getProductTypeString(productData.content)) : '',
                            img: expo.checkString((productData.content.variants[index] && productData.content.variants[index].preview_image) ||
                                productData.content.preview_image[0]),
                            SEO_domain: index === 0 ? expo.checkString((_b = (_a = productData.content) === null || _a === void 0 ? void 0 : _a.seo) === null || _b === void 0 ? void 0 : _b.domain) : '',
                            SEO_title: index === 0 ? expo.checkString((_d = (_c = productData.content) === null || _c === void 0 ? void 0 : _c.seo) === null || _d === void 0 ? void 0 : _d.title) : '',
                            SEO_desc: index === 0 ? expo.checkString((_f = (_e = productData.content) === null || _e === void 0 ? void 0 : _e.seo) === null || _f === void 0 ? void 0 : _f.content) : '',
                            spec1: index === 0 ? expo.checkString((_h = (_g = productData.content) === null || _g === void 0 ? void 0 : _g.specs[0]) === null || _h === void 0 ? void 0 : _h.title) : '',
                            spec1Value: expo.checkString((_j = productData.content.variants[index]) === null || _j === void 0 ? void 0 : _j.spec[0]),
                            sale_price: expo.checkNumber((_k = productData.content.variants[index]) === null || _k === void 0 ? void 0 : _k.sale_price),
                            shipment_type: getShipmentType((_l = productData.content.variants[index]) === null || _l === void 0 ? void 0 : _l.shipment_type),
                            length: expo.checkNumber(((_m = productData.content.variants[index]) === null || _m === void 0 ? void 0 : _m.v_length) || 0),
                            width: expo.checkNumber(((_o = productData.content.variants[index]) === null || _o === void 0 ? void 0 : _o.v_width) || 0),
                            height: expo.checkNumber(((_p = productData.content.variants[index]) === null || _p === void 0 ? void 0 : _p.v_height) || 0),
                            weight: expo.checkNumber(((_q = productData.content.variants[index]) === null || _q === void 0 ? void 0 : _q.weight) || 0),
                            weightUnit: expo.checkString(((_r = productData.content.variants[index]) === null || _r === void 0 ? void 0 : _r.weightUnit) || 'KG'),
                            stockPolicy: ((_s = productData.content.variants[index]) === null || _s === void 0 ? void 0 : _s.show_understocking) === 'true' ? '追蹤' : '不追蹤',
                            stock: expo.checkNumber((_t = productData.content.variants[index]) === null || _t === void 0 ? void 0 : _t.stock),
                        });
                    };
                    const rowData = baseRowData(0);
                    exportData.push(rowData);
                }
            });
            expo.export(exportData, `餐飲組合列表_${ProductExcel.getFileTime()}`);
            dialog.dataLoading({ visible: false });
        });
    }
    static exportDialog(gvc, pageType, apiJSON, dataArray) {
        const vm = {
            support: '',
            file: 'excel',
            select: 'all',
            column: [],
        };
        BgWidget.settingDialog({
            gvc,
            title: '匯出商品',
            width: 700,
            innerHTML: gvc2 => {
                try {
                    return html `<div class="d-flex flex-column align-items-start gap-2">
            <div class="tx_700 mb-1">匯出為</div>
            ${BgWidget.multiCheckboxContainer(gvc2, [
                        {
                            key: 'excel',
                            name: 'Excel檔案',
                        },
                    ], [vm.file], (res) => {
                        vm.file = res[0];
                    }, { single: true })}
            <div class="tx_700 mt-2 mb-1">匯出商品類型</div>
            ${BgWidget.multiCheckboxContainer(gvc2, this.getSupportProductCategory().map(dd => {
                        if (vm.support === '') {
                            vm.support = dd.key;
                        }
                        return {
                            key: dd.key,
                            name: dd.value,
                        };
                    }), [vm.support], (res) => {
                        vm.support = res[0];
                    }, { single: true })}
            <div class="tx_700 mt-2 mb-1">匯出範圍</div>
            ${BgWidget.multiCheckboxContainer(gvc2, [
                        { key: 'all', name: `全部商品` },
                        { key: 'search', name: '目前搜尋與篩選的結果' },
                        { key: 'checked', name: `勾選的 ${dataArray.length} 個商品` },
                    ], [vm.select], (res) => {
                        vm.select = res[0];
                    }, { single: true })}
          </div>`;
                }
                catch (error) {
                    console.error(error);
                    return '';
                }
            },
            footer_html: gvc2 => {
                return [
                    BgWidget.cancel(gvc2.event(() => {
                        gvc2.glitter.closeDiaLog();
                    })),
                    BgWidget.save(gvc2.event(() => {
                        const dialog = new ShareDialog(gvc2.glitter);
                        if (vm.select === 'checked' && dataArray.length === 0) {
                            dialog.infoMessage({ text: '請勾選至少一個以上的商品' });
                            return;
                        }
                        const getFormData = (() => {
                            const baseFormData = {
                                page: 0,
                                limit: 250,
                                productType: pageType,
                                product_category: vm.support,
                            };
                            const { search, searchType, orderBy, status, collection, accurate_search_collection } = apiJSON;
                            const formDataMap = {
                                search: Object.assign(Object.assign({}, baseFormData), { search,
                                    searchType,
                                    orderBy,
                                    status,
                                    collection,
                                    accurate_search_collection }),
                                checked: Object.assign(Object.assign({}, baseFormData), { id_list: dataArray.map((item) => item.id).join(',') }),
                                all: baseFormData,
                            };
                            return formDataMap[vm.select] || baseFormData;
                        })();
                        if (['course', 'commodity'].includes(vm.support)) {
                            this.exportCommodity(gvc, getFormData);
                        }
                        else if (vm.support === 'kitchen') {
                            this.exportKitchen(gvc, getFormData);
                        }
                    }), '匯出'),
                ].join('');
            },
        });
    }
    import(files, product_category, callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new ShareDialog(this.gvc.glitter);
            if (!((_a = files.files) === null || _a === void 0 ? void 0 : _a.length)) {
                return dialog.errorMessage({ text: '檔案載入失敗' });
            }
            dialog.dataLoading({ visible: true, text: '資料處理中' });
            yield this.loadScript();
            const allProductDomain = yield this.getProductDomains();
            const reader = new FileReader();
            reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const arrayBuffer = e.target.result;
                    const workbook = new this.ExcelJS.Workbook();
                    yield workbook.xlsx.load(arrayBuffer);
                    const worksheet = workbook.getWorksheet(1);
                    const data = [];
                    let id_list = [];
                    worksheet.eachRow({ includeEmpty: true }, (row) => {
                        const rowData = [];
                        row.eachCell({ includeEmpty: true }, (cell) => rowData.push(cell.value));
                        const isEmptyRow = rowData.every((cellValue) => cellValue === null || cellValue === '');
                        if (!isEmptyRow) {
                            data.push(rowData);
                        }
                    });
                    if (data[0][0] === '商品ID') {
                        data.map((dd, index) => {
                            id_list.push(dd[0]);
                            data[index] = dd.filter((_, index) => index > 0);
                        });
                    }
                    id_list = id_list.filter((item) => !['商品ID', ''].includes(item));
                    let error = false;
                    let addCollection = [];
                    let appendCollection = [];
                    let postMD = [];
                    let productData = {};
                    const getVariantData = () => {
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
                    function errorCallback(text, obj) {
                        error = true;
                        dialog.dataLoading({ visible: false });
                        if (obj && obj.warningMessageView) {
                            dialog.warningMessage({
                                text,
                                callback: () => { },
                            });
                        }
                        else {
                            dialog.infoMessage({ text });
                        }
                    }
                    data.forEach((row, index) => {
                        var _a, _b;
                        row.forEach((rowData, i) => {
                            let text = '';
                            if (rowData && rowData.richText) {
                                rowData.richText.map((item) => {
                                    text += item.text;
                                });
                            }
                            else {
                                text = rowData !== null && rowData !== void 0 ? rowData : '';
                            }
                            row[i] = text;
                        });
                        const variantData = getVariantData();
                        if (index != 0) {
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
                                    productData.collection = (_a = row[2].split(',')) !== null && _a !== void 0 ? _a : [];
                                    productData.collection = productData.collection.map((item) => item.replace(/\s+/g, ''));
                                    productData.collection.forEach((row) => {
                                        let collection = row.replace(/\s+/g, '');
                                        function splitStringIncrementally(input) {
                                            const parts = input.split('/');
                                            const result = [];
                                            parts.reduce((acc, part) => {
                                                const newAcc = acc ? `${acc} / ${part}` : part;
                                                result.push(newAcc);
                                                return newAcc;
                                            }, '');
                                            return result;
                                        }
                                        if (collection.split('/').length > 1) {
                                            let check = splitStringIncrementally(collection);
                                            const newItems = check.filter((item) => !productData.collection.includes(item));
                                            addCollection.push(...newItems);
                                        }
                                        addCollection.push(collection);
                                    });
                                    productData.collection = addCollection;
                                    appendCollection = appendCollection.concat(addCollection).filter((dd) => {
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
                                    let ind_ = index;
                                    while (first || (data[ind_] && !data[ind_][1])) {
                                        const row_data = data[ind_];
                                        const spec_title = this.checkString(row_data[8]);
                                        const spec_value = this.checkString(row_data[9]);
                                        if (!productData.specs.find((dd) => {
                                            return dd.title === spec_title;
                                        })) {
                                            productData.specs.push({
                                                language_title: {},
                                                title: spec_title,
                                                option: [],
                                            });
                                        }
                                        productData.specs
                                            .find((dd) => {
                                            return dd.title === spec_title;
                                        })
                                            .option.push({
                                            title: spec_value,
                                            price: parseInt(this.checkNumber(row_data[10]), 10),
                                            stock: row[17] == '追蹤' ? this.checkNumber(row_data[18]) : '',
                                            language_title: {},
                                        });
                                        if (first) {
                                            const shipmentTypeMap = {
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
                                        productData.specs = productData.specs.filter((dd) => dd.option && dd.option.length);
                                        const specs = {};
                                        productData.specs.map((dd) => {
                                            specs[dd.title] = dd.option.map((d1) => d1.title);
                                        });
                                    }
                                    updateVariants();
                                }
                            }
                            else {
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
                                    productData.collection = (_b = row[2].split(',')) !== null && _b !== void 0 ? _b : [];
                                    productData.collection = productData.collection.map((item) => item.replace(/\s+/g, ''));
                                    productData.collection.forEach((row) => {
                                        let collection = row.replace(/\s+/g, '');
                                        function splitStringIncrementally(input) {
                                            const parts = input.split('/');
                                            const result = [];
                                            parts.reduce((acc, part) => {
                                                const newAcc = acc ? `${acc} / ${part}` : part;
                                                result.push(newAcc);
                                                return newAcc;
                                            }, '');
                                            return result;
                                        }
                                        if (collection.split('/').length > 1) {
                                            let check = splitStringIncrementally(collection);
                                            const newItems = check.filter((item) => !productData.collection.includes(item));
                                            addCollection.push(...newItems);
                                        }
                                        addCollection.push(collection);
                                    });
                                    productData.collection = addCollection;
                                    appendCollection = appendCollection.concat(addCollection).filter((dd) => dd);
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
                                    var _a;
                                    if (row[rowindex] && productData.specs.length > key) {
                                        productData.specs[key].option = (_a = productData.specs[key].option) !== null && _a !== void 0 ? _a : [];
                                        const exists = productData.specs[key].option.some((item) => item.title === row[rowindex]);
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
                                const shipmentTypeMap = {
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
                                productData.sub_title = this.checkString(row[29]);
                                productData.variants.push(JSON.parse(JSON.stringify(variantData)));
                            }
                        }
                    });
                    postMD.push(productData);
                    postMD.map((dd) => {
                        dd.seo.domain = dd.seo.domain || dd.title;
                    });
                    const domainList = postMD
                        .filter((item, index) => {
                        return !id_list[index];
                    })
                        .map((item) => {
                        return item.seo.domain;
                    });
                    const filteredArr = domainList.filter((item) => {
                        return item && item.length > 0 && item.trim().length > 0;
                    });
                    const hasDuplicates = new Set(filteredArr).size !== filteredArr.length;
                    if (hasDuplicates) {
                        errorCallback('「商品連結」的值不可重複<br/>如果「商品連結」為空，預設值為該商品的「商品名稱」<br/>則該「商品名稱」不可與其它「商品連結」重複', {
                            warningMessageView: true,
                        });
                        return;
                    }
                    const productDomainSet = new Set(allProductDomain);
                    const duplicateDomain = domainList.find((domain) => domain.length > 0 && productDomainSet.has(domain));
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
                        yield ApiShop.postMultiProduct({
                            data: passData,
                            token: window.parent.config.token,
                        }).then(() => {
                            dialog.dataLoading({ visible: false });
                            dialog.successMessage({ text: '上傳成功' });
                            this.gvc.glitter.closeDiaLog();
                            callback();
                        });
                    }
                }
                catch (e) {
                    console.error(e);
                    dialog.dataLoading({ visible: false });
                    dialog.errorMessage({ text: '資料錯誤' });
                }
            });
            const file = files.files[0];
            reader.readAsArrayBuffer(file);
        });
    }
    static importDialog(gvc, callback) {
        const dialog = new ShareDialog(gvc.glitter);
        const vm = {
            id: 'importDialog',
            fileInput: {},
            type: '',
        };
        gvc.glitter.innerDialog((gvc) => {
            const excel = new ProductExcel(gvc, this.exampleHeader().filter(item => item !== '商品ID'), Object.keys(this.getInitData()));
            return gvc.bindView({
                bind: vm.id,
                view: () => {
                    const viewData = {
                        title: '匯入商品',
                        category: {
                            title: '匯入商品類型',
                            options: this.getSupportProductCategory().map(dd => {
                                if (!vm.type) {
                                    vm.type = dd.key;
                                }
                                return {
                                    key: dd.key,
                                    name: dd.value,
                                };
                            }),
                        },
                        example: {
                            event: () => {
                                excel.export(ProductExcel.exampleSheet(), `範例_商品列表_${gvc.glitter.ut.dateFormat(new Date(), 'yyyyMMddhhmmss')}`);
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
                    return html `
            <div
              class="d-flex align-items-center w-100 tx_700"
              style="padding: 12px 0 12px 20px; align-items: center; border-radius: 10px 10px 0px 0px; background: #F2F2F2;"
            >
              ${viewData.title}
            </div>
            ${viewData.category.options.length > 0
                        ? html `<div class="d-flex flex-column align-items-start gap-2" style="padding: 20px 20px 0px;">
                  <div class="tx_700">${viewData.category.title}</div>
                  ${BgWidget.multiCheckboxContainer(gvc, viewData.category.options, [vm.type], res => {
                            vm.type = res[0];
                        }, { single: true })}
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
                            return html `
                      ${BgWidget.customButton({
                                button: { color: 'snow', size: 'md' },
                                text: { name: '更換檔案' },
                                event: gvc.event(() => {
                                    document.querySelector('#upload-excel').click();
                                }),
                            })}
                      ${BgWidget.grayNote(vm.fileInput.files[0].name)}
                    `;
                        }
                        else {
                            return BgWidget.customButton({
                                button: { color: 'snow', size: 'md' },
                                text: { name: '新增檔案' },
                                event: gvc.event(() => {
                                    document.querySelector('#upload-excel').click();
                                }),
                            });
                        }
                    })()}
              </div>
            </div>
            <div class="d-flex justify-content-end gap-3" style="padding-right: 20px; padding-bottom: 20px;">
              ${BgWidget.cancel(gvc.event(() => {
                        gvc.glitter.closeDiaLog();
                    }))}
              ${BgWidget.save(gvc.event(() => {
                        if (vm.fileInput.files && vm.fileInput.files.length > 0) {
                            viewData.import.event();
                        }
                        else {
                            dialog.infoMessage({ text: '尚未上傳檔案' });
                        }
                    }), '匯入')}
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
ProductExcel.getInitData = () => ({
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
});
