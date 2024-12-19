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
        return new Promise((resolve) => {
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
    adjustColumnWidths(sheetData) {
        const maxLengths = this.headers.map((header) => this.getByteLength(header));
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
    importData(notifyId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new ShareDialog(this.gvc.glitter);
            dialog.dataLoading({ visible: true, text: '資料處理中' });
            yield this.loadScript();
            const reader = new FileReader();
            const allProductDomain = yield new Promise((resolve, reject) => {
                ApiShop.getProductDomain({}).then((data) => {
                    if (data.result && data.response.data) {
                        const list = data.response.data.map((item) => {
                            if (item.seo) {
                                const seo = JSON.parse(item.seo);
                                return seo.domain ? `${seo.domain}` : '';
                            }
                            return '';
                        });
                        resolve(list.filter((domain) => domain.length > 0));
                    }
                    else {
                        resolve([]);
                    }
                });
            });
            reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
                const arrayBuffer = e.target.result;
                const workbook = new this.ExcelJS.Workbook();
                yield workbook.xlsx.load(arrayBuffer);
                const worksheet = workbook.getWorksheet(1);
                const data = [];
                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    const rowData = [];
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        rowData.push(cell.value);
                    });
                    const isEmptyRow = rowData.every((cellValue) => cellValue === null || cellValue === '');
                    if (!isEmptyRow) {
                        data.push(rowData);
                    }
                });
                let error = false;
                let addCollection = [];
                let postMD = [];
                let productData = {};
                const getVariantData = () => {
                    return {
                        barcode: '',
                        compare_price: 0,
                        cost: 0,
                        preview_image: '',
                        profit: 0,
                        sale_price: 0,
                        shipment_type: 'weight',
                        show_understocking: '',
                        sku: '',
                        spec: [],
                        stock: 0,
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
                        dialog.warningMessage({ text, callback: () => { } });
                    }
                    else {
                        dialog.infoMessage({ text });
                    }
                }
                const domainList = data.map((item) => {
                    if (CheckInput.isEmpty(item[5])) {
                        item[5] = item[0];
                    }
                    return item[5];
                });
                const filteredArr = domainList.filter((item) => {
                    return item && item.length > 0 && item.trim().length > 0;
                });
                const hasDuplicates = new Set(filteredArr).size !== filteredArr.length;
                if (hasDuplicates) {
                    errorCallback('「商品連結」的值不可重複<br/>如果「商品連結」為空，預設值為該商品的「商品名稱」<br/>則該「商品名稱」不可與其它「商品連結」重複', {
                        warningMessageView: true,
                    });
                }
                const productDomainSet = new Set(allProductDomain);
                const duplicateDomain = domainList.find((domain) => domain.length > 0 && productDomainSet.has(domain));
                if (duplicateDomain) {
                    errorCallback(`商品連結「${duplicateDomain}」已有產品使用，請更換該欄位的值`);
                }
                data.forEach((row, index) => {
                    var _a;
                    const variantData = getVariantData();
                    if (index != 0) {
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
                            productData.title = this.checkString(row[0]);
                            productData.status = row[1] == '啟用' ? 'active' : 'draft';
                            productData.collection = (_a = row[2].split(',')) !== null && _a !== void 0 ? _a : [];
                            const regex = /[\s\/\\]+/g;
                            productData.collection = productData.collection.map((item) => item.replace(/\s+/g, ''));
                            productData.collection.forEach((row) => {
                                let collection = row.replace(/\s+/g, '');
                                if (regex.test(collection)) {
                                    errorCallback(`第${index + 1}行的類別名稱不可包含空白格與以下符號：「 / 」「 \\ 」，並以「 , 」區分不同類別`);
                                    return;
                                }
                                function splitStringIncrementally(input) {
                                    const parts = input.split('/');
                                    const result = [];
                                    parts.reduce((acc, part) => {
                                        const newAcc = acc ? `${acc}/${part}` : part;
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
                            indices.forEach((index) => {
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
                        productData.variants.push(JSON.parse(JSON.stringify(variantData)));
                    }
                });
                postMD.push(productData);
                productData.reverse;
                let passData = {
                    data: postMD,
                    collection: addCollection,
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
                        this.gvc.notifyDataChange(notifyId);
                    });
                }
            });
            reader.readAsArrayBuffer(file);
        });
    }
    exportData(data, name) {
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
            '圖片網址',
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
            ['', '', '', '', '', '', '', '', '', '黑色', '', '大型', '', '', 'A00100231', '24000', '35000', '40000', '0', '依重量計算', '', '', '', '110', 'KG', '追蹤', '100', '10', 'CODE1231'],
            ['', '', '', '', '', '', '', '', '', '棕色', '', '小型', '', '', 'A00100232', '15000', '25000', '30000', '0', '依重量計算', '', '', '', '120', 'KG', '追蹤', '100', '10', 'CODE1232'],
            ['', '', '', '', '', '', '', '', '', '棕色', '', '大型', '', '', 'A00100233', '24000', '35000', '40000', '0', '依重量計算', '', '', '', '130', 'KG', '追蹤', '100', '10', 'CODE1233'],
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
}
