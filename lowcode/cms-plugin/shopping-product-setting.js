var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { BgProduct } from '../backend-manager/bg-product.js';
import { FilterOptions } from './filter-options.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
class Excel {
    constructor(gvc, headers, lineName) {
        this.gvc = gvc;
        this.headers = headers;
        this.lineName = lineName;
    }
    loadScript() {
        return new Promise((resolve, reject) => {
            if (window.ExcelJS) {
                this.initExcel();
                resolve(true);
            }
            else {
                this.gvc.addMtScript([{ src: 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js' }], () => {
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
    importData(file) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadScript();
            const reader = new FileReader();
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
                let variantData = {
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
                data.forEach((row, index) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                    variantData = {
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
                    if (index != 0) {
                        if (row[1]) {
                            if (Object.keys(productData).length != 0) {
                                postMD.push(productData);
                            }
                            addCollection = [];
                            productData = {
                                title: '',
                                productType: {
                                    product: true,
                                    addProduct: false,
                                    giveaway: false,
                                },
                                content: '',
                                status: 'active',
                                collection: [],
                                hideIndex: 'false',
                                preview_image: '',
                                specs: [],
                                variants: [],
                                seo: {
                                    title: '',
                                    content: '',
                                    keywords: '',
                                },
                                template: '',
                            };
                            productData.title = (_a = row[0]) !== null && _a !== void 0 ? _a : '';
                            productData.status = row[1] == '上架' ? 'active' : 'draft';
                            productData.collection = (_b = row[2].split(',')) !== null && _b !== void 0 ? _b : [];
                            const regex = /[\s,\\]+/g;
                            productData.collection = productData.collection.map((item) => item.replace(/\s+/g, ''));
                            productData.collection.forEach((row) => {
                                let collection = row.replace(/\s+/g, '');
                                if (regex.test(collection)) {
                                    error = true;
                                    alert(`第${index + 1}行的類別名稱不可包含空白格與以下符號：「 , 」「 / 」「 \\ 」，並以,區分不同類別`);
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
                            productData.productType.addProduct = row[3].includes('加購品');
                            productData.productType.product = row[3].includes('商品');
                            productData.productType.giveaway = row[3].includes('贈品');
                            productData.preview_image = row[4] ? [row[4]] : ['商品圖片'];
                            productData.seo.title = (_c = row[5]) !== null && _c !== void 0 ? _c : '';
                            productData.seo.content = (_d = row[6]) !== null && _d !== void 0 ? _d : '';
                            productData.seo.keywords = (_e = row[7]) !== null && _e !== void 0 ? _e : '';
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
                            if (row[rowindex]) {
                                productData.specs[key].option = (_a = productData.specs[key].option) !== null && _a !== void 0 ? _a : [];
                                const exists = productData.specs[key].option.some((item) => item.title === row[rowindex]);
                                if (!exists) {
                                    productData.specs[key].option.push({ title: row[rowindex], expand: true });
                                }
                                variantData.spec.push(row[rowindex]);
                            }
                        });
                        variantData.sku = (_f = row[14]) !== null && _f !== void 0 ? _f : '';
                        variantData.cost = (_g = row[15]) !== null && _g !== void 0 ? _g : '';
                        variantData.sale_price = (_h = row[16]) !== null && _h !== void 0 ? _h : 0;
                        variantData.compare_price = (_j = row[17]) !== null && _j !== void 0 ? _j : 0;
                        variantData.profit = (_k = row[18]) !== null && _k !== void 0 ? _k : 0;
                        const shipmentTypeMap = {
                            依材積計算: 'volume',
                            不計算運費: 'none',
                        };
                        variantData.shipment_type = shipmentTypeMap[row[19]] || 'weight';
                        variantData.v_length = (_l = row[20]) !== null && _l !== void 0 ? _l : 0;
                        variantData.v_width = (_m = row[21]) !== null && _m !== void 0 ? _m : 0;
                        variantData.v_height = (_o = row[22]) !== null && _o !== void 0 ? _o : 0;
                        variantData.weight = (_p = row[23]) !== null && _p !== void 0 ? _p : 0;
                        variantData.show_understocking = row[25] == '追蹤' ? 'true' : 'false';
                        variantData.stock = (_q = row[26]) !== null && _q !== void 0 ? _q : 0;
                        variantData.save_stock = (_r = row[27]) !== null && _r !== void 0 ? _r : 0;
                        variantData.barcode = (_s = row[28]) !== null && _s !== void 0 ? _s : '';
                        productData.variants.push(JSON.parse(JSON.stringify(variantData)));
                    }
                });
                postMD.push(productData);
                productData.reverse;
                let passData = {
                    data: postMD,
                    collection: addCollection,
                };
                if (!error) {
                    yield ApiShop.postMultiProduct({
                        data: passData,
                        token: window.parent.config.token,
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
            let fileName = name !== null && name !== void 0 ? name : `example_${new Date().toISOString()}`;
            this.saveAsExcelFile(buffer, `${fileName}.xlsx`);
        });
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
        this.worksheet.eachRow((row, rowNumber) => {
            row.height = 18;
        });
    }
    setFontAndAlignmentStyle() {
        this.worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.font = { name: 'Microsoft JhengHei' };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });
    }
    exportToExcel() {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.workbook.xlsx.writeBuffer();
            this.saveAsExcelFile(buffer, `example_${new Date().toISOString()}.xlsx`);
        });
    }
    saveAsExcelFile(buffer, fileName) {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = fileName;
        link.click();
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
}
export class ShoppingProductSetting {
    static main(gvc) {
        const html = String.raw;
        const glitter = gvc.glitter;
        const vm = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: 'list',
            dataList: undefined,
            query: '',
            last_scroll: 0,
            queryType: '',
            orderString: '',
            filter: {},
            replaceData: '',
        };
        const rowInitData = {
            name: '',
            status: '',
            category: '',
            productType: ``,
            img: '',
            SEO_title: '',
            SEO_desc: '',
            SEO_keyword: '',
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
        const excel = new Excel(gvc, [
            '商品名稱',
            '啟用狀態',
            '商品類別',
            '商品類型',
            '商品圖片',
            'SEO標題',
            'SEO內文',
            'SEO關鍵字',
            '規格1',
            '規格詳細',
            '規格2',
            '規格詳細',
            '規格3',
            '規格詳細',
            'sku',
            '成本',
            '售價',
            '比較價格',
            '利潤',
            '運費計算方式',
            '長度',
            '寬度',
            '高度',
            '商品重量',
            '重量單位',
            '庫存政策',
            '庫存',
            '安全庫存',
            '商品條碼',
        ], Object.keys(rowInitData));
        let dialog = new ShareDialog(glitter);
        let replaceData = '';
        const ListComp = new BgListComponent(gvc, vm, FilterOptions.productFilterFrame);
        gvc.addMtScript([{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }], () => { }, () => { });
        vm.filter = ListComp.getFilterObject();
        return gvc.bindView(() => {
            return {
                dataList: [{ obj: vm, key: 'type' }],
                bind: vm.id,
                view: () => {
                    gvc.addStyle(`
                        input[type='number']::-webkit-outer-spin-button,
                        input[type='number']::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                        }
                        input[type='number'] {
                            -moz-appearance: textfield;
                        }
                    `);
                    switch (vm.type) {
                        case 'add':
                            return ShoppingProductSetting.editProduct({ vm: vm, gvc: gvc, type: 'add' });
                        case 'list':
                            const filterID = gvc.glitter.getUUID();
                            vm.tableId = gvc.glitter.getUUID();
                            vm.dataList = [];
                            const vmlist = {
                                id: glitter.getUUID(),
                                loading: true,
                                collections: [],
                            };
                            return gvc.bindView({
                                bind: vmlist.id,
                                view: () => {
                                    if (vmlist.loading) {
                                        return '';
                                    }
                                    else {
                                        let importInput = {};
                                        if (FilterOptions.productFunnel.findIndex((item) => item.key === 'collection') === -1) {
                                            FilterOptions.productFunnel.push({
                                                key: 'collection',
                                                type: 'multi_checkbox',
                                                name: '商品分類',
                                                data: vmlist.collections.map((item) => {
                                                    return { key: `${item.key}`, name: item.value };
                                                }),
                                            });
                                        }
                                        return BgWidget.container(html `
                                                <div class="d-flex w-100 align-items-center" style="margin-bottom: 24px;">
                                                    ${BgWidget.title('商品列表')}
                                                    <div class="flex-fill"></div>
                                                    <div style="display: flex; gap: 14px;">
                                                        ${[
                                            BgWidget.grayButton('匯入', gvc.event((e) => {
                                                gvc.glitter.innerDialog((gvc) => {
                                                    return gvc.bindView({
                                                        bind: 'importView',
                                                        view: () => {
                                                            return html `
                                                                                    <div
                                                                                        style="display: flex;width:100%;padding: 12px 485px 12px 20px;align-items: center;border-radius: 10px 10px 0px 0px;background: #F2F2F2;color:#393939;font-size: 16px;font-weight: 700;"
                                                                                    >
                                                                                        匯入商品
                                                                                    </div>
                                                                                    <div style="display: flex;width: 100%;align-items: flex-start;gap: 16px;padding:20px;flex-direction: column">
                                                                                        <div style="display: flex;align-items: baseline;gap: 12px;align-self: stretch;">
                                                                                            <div style="color:#393939;font-size: 16px;font-weight: 400;">透過XLSX檔案匯入商品</div>
                                                                                            <div
                                                                                                style="color: #36B; font-size: 14px; font-style: normal; font-weight: 400; line-height: normal; text-decoration-line: underline;"
                                                                                                onclick="${gvc.event(() => {
                                                                let sample = [
                                                                    [
                                                                        '產品1',
                                                                        '啟用',
                                                                        '商品',
                                                                        '精品/手套',
                                                                        'image1',
                                                                        'SEO標題',
                                                                        'SEO內文',
                                                                        'SEO關鍵字',
                                                                        '大小',
                                                                        'S',
                                                                        '形狀',
                                                                        '長方形',
                                                                        '顏色',
                                                                        '白色',
                                                                        'product-1-variant-1',
                                                                        '5000',
                                                                        '13000',
                                                                        '12000',
                                                                        '7000',
                                                                        '依重量計算',
                                                                        '10',
                                                                        '15',
                                                                        '10',
                                                                        '7',
                                                                        'KG',
                                                                        '追蹤商品庫存',
                                                                        '13',
                                                                        '35',
                                                                        '001001001',
                                                                    ],
                                                                    [
                                                                        '產品1',
                                                                        '',
                                                                        '',
                                                                        '',
                                                                        'image2',
                                                                        '',
                                                                        'S',
                                                                        '',
                                                                        '長方形',
                                                                        '',
                                                                        '黑色',
                                                                        'product-1-variant-2',
                                                                        '5000',
                                                                        '13000',
                                                                        '12000',
                                                                        '7000',
                                                                        '依重量計算',
                                                                        '10',
                                                                        '15',
                                                                        '10',
                                                                        '7',
                                                                        'KG',
                                                                        '追蹤商品庫存',
                                                                        '13',
                                                                        '35',
                                                                        '001001002',
                                                                    ],
                                                                    [
                                                                        '產品1',
                                                                        '',
                                                                        '',
                                                                        '',
                                                                        'image3',
                                                                        '',
                                                                        'L',
                                                                        '',
                                                                        '正方形',
                                                                        '',
                                                                        '黑色',
                                                                        'product-1-variant-3',
                                                                        '4300',
                                                                        '12000',
                                                                        '11000',
                                                                        '7000',
                                                                        '依重量計算',
                                                                        '10',
                                                                        '10',
                                                                        '10',
                                                                        '6',
                                                                        'KG',
                                                                        '追蹤商品庫存',
                                                                        '13',
                                                                        '35',
                                                                        '001001003',
                                                                    ],
                                                                    [
                                                                        '產品2',
                                                                        '啟用',
                                                                        '商品',
                                                                        '工具/餐具',
                                                                        'image1-1',
                                                                        'SEO標題',
                                                                        'SEO內文',
                                                                        'SEO關鍵字',
                                                                        '材質',
                                                                        '木頭',
                                                                        '形狀',
                                                                        '長方形',
                                                                        '',
                                                                        '',
                                                                        'product-2-variant-1',
                                                                        '700',
                                                                        '1300',
                                                                        '1200',
                                                                        '700',
                                                                        '依體積計算',
                                                                        '5',
                                                                        '5',
                                                                        '6',
                                                                        '2',
                                                                        'KG',
                                                                        '不追蹤',
                                                                        '5',
                                                                        '35',
                                                                        '001002001',
                                                                    ],
                                                                    [
                                                                        '產品2',
                                                                        '',
                                                                        '',
                                                                        '工具/',
                                                                        'image1-2',
                                                                        '',
                                                                        '金屬',
                                                                        '',
                                                                        '長方形',
                                                                        '',
                                                                        '',
                                                                        'product-2-variant-2',
                                                                        '700',
                                                                        '1300',
                                                                        '1200',
                                                                        '700',
                                                                        '依體積計算',
                                                                        '5',
                                                                        '5',
                                                                        '6',
                                                                        '3',
                                                                        'KG',
                                                                        '不追蹤',
                                                                        '5',
                                                                        '35',
                                                                        '001002002',
                                                                    ],
                                                                ];
                                                                excel.exportData(sample).then((r) => {
                                                                    alert('匯出成功');
                                                                });
                                                            })}"
                                                                                            >
                                                                                                下載範例
                                                                                            </div>
                                                                                        </div>
                                                                                        <input
                                                                                            class="d-none"
                                                                                            type="file"
                                                                                            id="upload-excel"
                                                                                            onchange="${gvc.event((e, event) => {
                                                                importInput = event.target;
                                                                dialog.dataLoading({ visible: false });
                                                                gvc.notifyDataChange('importView');
                                                            })}"
                                                                                        />
                                                                                        <div
                                                                                            style="display: flex;justify-content: center;padding: 59px 0px 58px 0px;align-items: center;flex-direction: column;gap: 10px;width: 100%;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                        >
                                                                                            ${(() => {
                                                                if (importInput.files && importInput.files.length > 0) {
                                                                    return html `
                                                                                                        <div
                                                                                                            style="display: flex;padding: 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);color: #393939;font-size: 16px;font-weight: 400;"
                                                                                                            onclick="${gvc.event(() => {
                                                                        dialog.dataLoading({ visible: true });
                                                                        document.querySelector('#upload-excel').click();
                                                                    })}"
                                                                                                        >
                                                                                                            更換檔案
                                                                                                        </div>
                                                                                                        <div style="color:#8D8D8D;">${importInput.files[0].name}</div>
                                                                                                    `;
                                                                }
                                                                else {
                                                                    return html `
                                                                                                        <div
                                                                                                            style="display: flex;padding: 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);color: #393939;font-size: 16px;font-weight: 400;"
                                                                                                            onclick="${gvc.event(() => {
                                                                        dialog.dataLoading({ visible: true });
                                                                        document.querySelector('#upload-excel').click();
                                                                    })}"
                                                                                                        >
                                                                                                            新增檔案
                                                                                                        </div>
                                                                                                        <div style="color:#8D8D8D;"></div>
                                                                                                    `;
                                                                }
                                                            })()}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style="display: flex;justify-content: end;padding-right: 20px;padding-bottom: 20px;gap: 14px;">
                                                                                        ${BgWidget.cancel(gvc.event(() => {
                                                                gvc.glitter.closeDiaLog();
                                                            }))}
                                                                                        ${BgWidget.save(gvc.event(() => {
                                                                if (importInput.files && importInput.files.length > 0) {
                                                                    excel.importData(importInput.files[0]).then((r) => {
                                                                        vm.dataList = undefined;
                                                                        gvc.notifyDataChange(vm.id);
                                                                    });
                                                                }
                                                                gvc.glitter.closeDiaLog();
                                                            }), '匯入')}
                                                                                    </div>
                                                                                `;
                                                        },
                                                        divCreate: { style: `border-radius: 10px;background: #FFF;width: 569px;height: 391px;` },
                                                    });
                                                }, 'import');
                                                return ``;
                                            })),
                                            BgWidget.grayButton('匯出', gvc.event(() => {
                                                gvc.glitter.innerDialog((gvc) => {
                                                    return html `
                                                                            <div
                                                                                style="width: 569px;height: 408px;border-radius: 10px;background: #FFF;display: flex;flex-direction: column;color: #393939;"
                                                                            >
                                                                                <div
                                                                                    class="w-100"
                                                                                    style="padding: 12px 20px;display: flex;align-items: center;font-size: 16px;font-weight: 700;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                >
                                                                                    匯出商品
                                                                                </div>
                                                                                <div class="w-100" style="display: flex;flex-direction: column;align-items: flex-start;gap: 24px;padding: 20px;">
                                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-self: stretch;">
                                                                                        <div style="">匯出</div>
                                                                                        ${gvc.bindView({
                                                        bind: 'exportSelect',
                                                        view: () => {
                                                            let selectCircle = html ` <div
                                                                                                    style="background-color: white;border: solid 4px #393939;border-radius: 20px;width: 16px;height: 16px;"
                                                                                                ></div>`;
                                                            let unselectCircle = html ` <div
                                                                                                    style="background-color: white;border-radius: 20px;border: 1px solid #DDD;width: 16px;height: 16px;"
                                                                                                ></div>`;
                                                            let disableCircle = html ` <div
                                                                                                    style="border-radius: 20px;border: 1px solid #DDD;background: #DDD;width: 16px;height: 16px;"
                                                                                                ></div>`;
                                                            return html `
                                                                                                    <div style="display: flex;align-items: center;gap: 6px;align-self: stretch;">
                                                                                                        ${selectCircle} 全部商品
                                                                                                    </div>
                                                                                                    <div style="display: flex;align-items: center;gap: 6px;align-self: stretch;">
                                                                                                        ${unselectCircle} 目前篩選結果
                                                                                                    </div>
                                                                                                    <div
                                                                                                        style="display: flex;align-items: center;gap: 6px;align-self: stretch;color:#BABABA;font-size: 16px;font-weight: 400;"
                                                                                                    >
                                                                                                        ${disableCircle} 目前選擇: 0份商品
                                                                                                    </div>
                                                                                                `;
                                                        },
                                                        divCreate: {
                                                            style: `display: flex;flex-direction: column;align-items: center;gap: 12px;align-self: stretch;`,
                                                        },
                                                    })}
                                                                                    </div>
                                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-self: stretch;">
                                                                                        <div style="">匯出為</div>
                                                                                        ${gvc.bindView({
                                                        bind: 'exportFile',
                                                        view: () => {
                                                            let selectCircle = html ` <div
                                                                                                    style="background-color: white;border: solid 4px #393939;border-radius: 20px;width: 16px;height: 16px;"
                                                                                                ></div>`;
                                                            let unselectCircle = html ` <div
                                                                                                    style="background-color: white;border-radius: 20px;border: 1px solid #DDD;width: 16px;height: 16px;"
                                                                                                ></div>`;
                                                            return html `
                                                                                                    <div style="display: flex;align-items: center;gap: 6px;align-self: stretch;">
                                                                                                        ${selectCircle} Excel檔案
                                                                                                    </div>
                                                                                                `;
                                                        },
                                                        divCreate: {
                                                            style: `display: flex;flex-direction: column;align-items: center;gap: 12px;align-self: stretch;`,
                                                        },
                                                    })}
                                                                                    </div>
                                                                                </div>
                                                                                <div style="display: flex;justify-content: flex-end;align-items: flex-start;gap: 14px;padding: 20px">
                                                                                    ${BgWidget.cancel(gvc.event(() => {
                                                        gvc.glitter.closeDiaLog();
                                                    }))}
                                                                                    ${BgWidget.save(gvc.event(() => {
                                                        dialog.dataLoading({ visible: true });
                                                        ApiShop.getProduct({
                                                            page: 0,
                                                            limit: 100,
                                                            search: undefined,
                                                            searchType: undefined,
                                                            orderBy: undefined,
                                                            status: (() => {
                                                                if (vm.filter.status && vm.filter.status.length === 1) {
                                                                    switch (vm.filter.status[0]) {
                                                                        case 'active':
                                                                            return 'active';
                                                                        case 'draft':
                                                                            return 'draft';
                                                                    }
                                                                }
                                                                return undefined;
                                                            })(),
                                                            collection: vm.filter.collection,
                                                            accurate_search_collection: true,
                                                        }).then((response) => {
                                                            dialog.dataLoading({ visible: false });
                                                            let exportData = [];
                                                            response.response.data.map((productData) => {
                                                                var _a;
                                                                let rowData = {
                                                                    name: (_a = productData.content.title) !== null && _a !== void 0 ? _a : '未命名商品',
                                                                    status: '',
                                                                    category: '',
                                                                    productType: ``,
                                                                    img: '',
                                                                    SEO_title: '',
                                                                    SEO_desc: '',
                                                                    SEO_keyword: '',
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
                                                                productData.content.variants.map((variant, index) => {
                                                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19;
                                                                    if (index == 0) {
                                                                        rowData.SEO_title = (_c = (_b = (_a = productData.content) === null || _a === void 0 ? void 0 : _a.seo) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : '';
                                                                        rowData.SEO_desc = (_f = (_e = (_d = productData.content) === null || _d === void 0 ? void 0 : _d.seo) === null || _e === void 0 ? void 0 : _e.content) !== null && _f !== void 0 ? _f : '';
                                                                        rowData.SEO_keyword = (_j = (_h = (_g = productData.content) === null || _g === void 0 ? void 0 : _g.seo) === null || _h === void 0 ? void 0 : _h.keyword) !== null && _j !== void 0 ? _j : '';
                                                                        rowData.category = (_k = productData.content.collection.join(' , ')) !== null && _k !== void 0 ? _k : '';
                                                                        rowData.productType = `${((_m = (_l = productData.content) === null || _l === void 0 ? void 0 : _l.productType) === null || _m === void 0 ? void 0 : _m.product) ? '商品' : ''} ${((_p = (_o = productData.content) === null || _o === void 0 ? void 0 : _o.productType) === null || _p === void 0 ? void 0 : _p.addProduct) ? '加購品' : ''} ${((_r = (_q = productData.content) === null || _q === void 0 ? void 0 : _q.productType) === null || _r === void 0 ? void 0 : _r.giveaway) ? '贈品' : ''}`;
                                                                        rowData.status = ((_s = productData.content) === null || _s === void 0 ? void 0 : _s.status) == 'active' ? '上架' : '下架';
                                                                        rowData.spec1 = (_v = (_u = (_t = productData.content) === null || _t === void 0 ? void 0 : _t.specs[0]) === null || _u === void 0 ? void 0 : _u.title) !== null && _v !== void 0 ? _v : '';
                                                                        rowData.spec2 = (_y = (_x = (_w = productData.content) === null || _w === void 0 ? void 0 : _w.specs[1]) === null || _x === void 0 ? void 0 : _x.title) !== null && _y !== void 0 ? _y : '';
                                                                        rowData.spec3 = (_1 = (_0 = (_z = productData.content) === null || _z === void 0 ? void 0 : _z.specs[2]) === null || _0 === void 0 ? void 0 : _0.title) !== null && _1 !== void 0 ? _1 : '';
                                                                        rowData.img = productData.content.preview_image[0];
                                                                    }
                                                                    else {
                                                                        rowData.category = ``;
                                                                        rowData.productType = ``;
                                                                        rowData.status = ``;
                                                                        rowData.spec1 = '';
                                                                        rowData.spec2 = '';
                                                                        rowData.spec3 = '';
                                                                        rowData.img = '';
                                                                        rowData.SEO_title = '';
                                                                        rowData.SEO_desc = '';
                                                                        rowData.SEO_keyword = '';
                                                                    }
                                                                    rowData.img = (_3 = (_2 = rowData.img) !== null && _2 !== void 0 ? _2 : variant.preview_image) !== null && _3 !== void 0 ? _3 : '';
                                                                    rowData.spec1Value = (_4 = variant.spec[0]) !== null && _4 !== void 0 ? _4 : '';
                                                                    rowData.spec2Value = (_5 = variant.spec[1]) !== null && _5 !== void 0 ? _5 : '';
                                                                    rowData.spec3Value = (_6 = variant.spec[2]) !== null && _6 !== void 0 ? _6 : '';
                                                                    rowData.sku = (_7 = variant.sku) !== null && _7 !== void 0 ? _7 : '';
                                                                    rowData.cost = (_8 = variant.cost) !== null && _8 !== void 0 ? _8 : '';
                                                                    rowData.sale_price = (_9 = variant.sale_price) !== null && _9 !== void 0 ? _9 : '';
                                                                    rowData.benefit = (_10 = variant.profit) !== null && _10 !== void 0 ? _10 : '';
                                                                    rowData.compare_price = (_11 = variant.compare_price) !== null && _11 !== void 0 ? _11 : '';
                                                                    rowData.width = (_12 = variant === null || variant === void 0 ? void 0 : variant.v_width) !== null && _12 !== void 0 ? _12 : '0';
                                                                    rowData.height = (_13 = variant === null || variant === void 0 ? void 0 : variant.v_height) !== null && _13 !== void 0 ? _13 : '0';
                                                                    rowData.length = (_14 = variant === null || variant === void 0 ? void 0 : variant.v_length) !== null && _14 !== void 0 ? _14 : '0';
                                                                    rowData.weight = (_15 = variant.weight) !== null && _15 !== void 0 ? _15 : '0';
                                                                    rowData.weightUnit = (_16 = variant.weightUnit) !== null && _16 !== void 0 ? _16 : 'KG';
                                                                    rowData.stockPolicy = variant.show_understocking ? '追蹤' : '不追蹤';
                                                                    rowData.stock = (_17 = variant.stock) !== null && _17 !== void 0 ? _17 : '0';
                                                                    rowData.save_stock = (_18 = variant.save_stock) !== null && _18 !== void 0 ? _18 : '0';
                                                                    rowData.barcode = (_19 = variant.barcode) !== null && _19 !== void 0 ? _19 : '';
                                                                    if (variant.shipment_type) {
                                                                        switch (variant.shipment_type) {
                                                                            case 'volume': {
                                                                                rowData.shipment_type = '依材積計算';
                                                                                break;
                                                                            }
                                                                            case 'none': {
                                                                                rowData.shipment_type = '不計算運費';
                                                                                break;
                                                                            }
                                                                            default: {
                                                                                rowData.shipment_type = '依重量計算';
                                                                            }
                                                                        }
                                                                    }
                                                                    else {
                                                                        rowData.shipment_type = '依重量計算';
                                                                    }
                                                                    exportData.push(JSON.parse(JSON.stringify(rowData)));
                                                                });
                                                            });
                                                            excel.exportData(exportData, 'product_export').then((r) => { });
                                                        });
                                                    }), '匯出')}
                                                                                </div>
                                                                            </div>
                                                                        `;
                                                }, 'export');
                                                return;
                                            })),
                                            BgWidget.darkButton('新增', gvc.event(() => {
                                                vm.type = 'add';
                                            })),
                                        ].join('')}
                                                    </div>
                                                </div>
                                                ${BgWidget.mainCardMbp0([
                                            (() => {
                                                const id = gvc.glitter.getUUID();
                                                return gvc.bindView({
                                                    bind: id,
                                                    view: () => {
                                                        const filterList = [
                                                            BgWidget.selectFilter({
                                                                gvc,
                                                                callback: (value) => {
                                                                    vm.queryType = value;
                                                                    gvc.notifyDataChange(vm.tableId);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                default: vm.queryType || 'title',
                                                                options: FilterOptions.productSelect,
                                                                style: 'min-width: 160px;',
                                                            }),
                                                            BgWidget.searchFilter(gvc.event((e) => {
                                                                vm.query = e.value;
                                                                gvc.notifyDataChange(vm.tableId);
                                                                gvc.notifyDataChange(id);
                                                            }), vm.query || '', '搜尋'),
                                                            BgWidget.funnelFilter({
                                                                gvc,
                                                                callback: () => ListComp.showRightMenu(FilterOptions.productFunnel),
                                                            }),
                                                            BgWidget.updownFilter({
                                                                gvc,
                                                                callback: (value) => {
                                                                    vm.orderString = value;
                                                                    gvc.notifyDataChange(vm.tableId);
                                                                    gvc.notifyDataChange(id);
                                                                },
                                                                default: vm.orderString || 'default',
                                                                options: FilterOptions.productListOrderBy,
                                                            }),
                                                        ];
                                                        const filterTags = ListComp.getFilterTags(FilterOptions.productFunnel);
                                                        if (document.body.clientWidth < 768) {
                                                            return html ` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                                <div>${filterList[0]}</div>
                                                                                <div style="display: flex;">
                                                                                    <div class="me-2">${filterList[2]}</div>
                                                                                    ${filterList[3]}
                                                                                </div>
                                                                            </div>
                                                                            <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                                            <div>${filterTags}</div>`;
                                                        }
                                                        else {
                                                            return html ` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                                                            <div>${filterTags}</div>`;
                                                        }
                                                    },
                                                });
                                            })(),
                                            gvc.bindView({
                                                bind: vm.tableId,
                                                view: () => BgWidget.tableV2({
                                                    gvc: gvc,
                                                    getData: (vmi) => {
                                                        ApiShop.getProduct({
                                                            page: vmi.page - 1,
                                                            limit: 50,
                                                            search: vm.query || undefined,
                                                            searchType: vm.queryType || undefined,
                                                            orderBy: vm.orderString || undefined,
                                                            status: (() => {
                                                                if (vm.filter.status && vm.filter.status.length === 1) {
                                                                    switch (vm.filter.status[0]) {
                                                                        case 'active':
                                                                            return 'active';
                                                                        case 'draft':
                                                                            return 'draft';
                                                                    }
                                                                }
                                                                return undefined;
                                                            })(),
                                                            collection: vm.filter.collection,
                                                            accurate_search_collection: true,
                                                        }).then((data) => {
                                                            vmi.pageSize = Math.ceil(data.response.total / 50);
                                                            vm.dataList = data.response.data;
                                                            function getDatalist() {
                                                                return data.response.data.map((dd, index) => {
                                                                    var _a;
                                                                    return [
                                                                        {
                                                                            key: EditorElem.checkBoxOnly({
                                                                                gvc: gvc,
                                                                                def: !data.response.data.find((dd) => {
                                                                                    return !dd.checked;
                                                                                }),
                                                                                callback: (result) => {
                                                                                    data.response.data.map((dd) => {
                                                                                        dd.checked = result;
                                                                                    });
                                                                                    vmi.data = getDatalist();
                                                                                    vmi.callback();
                                                                                    gvc.notifyDataChange(filterID);
                                                                                },
                                                                            }),
                                                                            value: EditorElem.checkBoxOnly({
                                                                                gvc: gvc,
                                                                                def: dd.checked,
                                                                                callback: (result) => {
                                                                                    dd.checked = result;
                                                                                    vmi.data = getDatalist();
                                                                                    vmi.callback();
                                                                                    gvc.notifyDataChange(filterID);
                                                                                },
                                                                                style: 'height:40px;',
                                                                            }),
                                                                        },
                                                                        {
                                                                            key: '商品',
                                                                            value: html `<img
                                                                                                    class="rounded border me-4"
                                                                                                    src="${dd.content.preview_image[0] || 'https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png'}"
                                                                                                    style="width:40px;height:40px;"
                                                                                                />` + dd.content.title,
                                                                        },
                                                                        {
                                                                            key: '售價',
                                                                            value: (() => {
                                                                                if (!dd.content.variants || dd.content.variants.length === 0) {
                                                                                    return '尚未設定';
                                                                                }
                                                                                return ('$ ' +
                                                                                    Math.min(...dd.content.variants.map((dd) => {
                                                                                        return parseInt(dd.sale_price, 10);
                                                                                    })).toLocaleString());
                                                                            })(),
                                                                        },
                                                                        {
                                                                            key: '庫存',
                                                                            value: (() => {
                                                                                if (!dd.content.variants || dd.content.variants.length === 0) {
                                                                                    return 0;
                                                                                }
                                                                                return Math.min(...dd.content.variants.map((dd) => {
                                                                                    return dd.stock;
                                                                                })).toLocaleString();
                                                                            })(),
                                                                        },
                                                                        {
                                                                            key: '已售出',
                                                                            value: ((_a = dd.total_sales) !== null && _a !== void 0 ? _a : '0').toLocaleString(),
                                                                        },
                                                                        {
                                                                            key: '狀態',
                                                                            value: gvc.bindView(() => {
                                                                                const id = gvc.glitter.getUUID();
                                                                                return {
                                                                                    bind: id,
                                                                                    view: () => BgWidget.switchTextButton(gvc, dd.content.status === 'active', { left: dd.content.status === 'active' ? '上架' : '下架' }, (bool) => {
                                                                                        dd.content.status = bool ? 'active' : 'draft';
                                                                                        ApiPost.put({
                                                                                            postData: dd.content,
                                                                                            token: window.parent.config.token,
                                                                                            type: 'manager',
                                                                                        }).then((res) => {
                                                                                            res.result && gvc.notifyDataChange(id);
                                                                                        });
                                                                                    }),
                                                                                    divCreate: {
                                                                                        option: [
                                                                                            {
                                                                                                key: 'onclick',
                                                                                                value: gvc.event((e, event) => {
                                                                                                    event.stopPropagation();
                                                                                                }),
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                };
                                                                            }),
                                                                        },
                                                                    ].map((dd) => {
                                                                        dd.value = html `<div style="line-height:40px;">${dd.value}</div>`;
                                                                        return dd;
                                                                    });
                                                                });
                                                            }
                                                            vmi.data = getDatalist();
                                                            vmi.loading = false;
                                                            vmi.callback();
                                                        });
                                                    },
                                                    rowClick: (data, index) => {
                                                        vm.replaceData = vm.dataList[index].content;
                                                        vm.type = 'replace';
                                                    },
                                                    filter: html `
                                                                        ${gvc.bindView(() => {
                                                        return {
                                                            bind: filterID,
                                                            view: () => {
                                                                if (!vm.dataList || !vm.dataList.find((dd) => dd.checked)) {
                                                                    return '';
                                                                }
                                                                else {
                                                                    const dialog = new ShareDialog(gvc.glitter);
                                                                    const selCount = vm.dataList.filter((dd) => dd.checked).length;
                                                                    return BgWidget.selNavbar({
                                                                        count: selCount,
                                                                        buttonList: [
                                                                            BgWidget.selEventDropmenu({
                                                                                gvc: gvc,
                                                                                options: [
                                                                                    {
                                                                                        name: '上架',
                                                                                        event: gvc.event(() => {
                                                                                            dialog.dataLoading({ visible: true });
                                                                                            new Promise((resolve) => {
                                                                                                let n = 0;
                                                                                                vm.dataList
                                                                                                    .filter((dd) => {
                                                                                                    return dd.checked;
                                                                                                })
                                                                                                    .map((dd) => {
                                                                                                    dd.content.status = 'active';
                                                                                                    function run() {
                                                                                                        return __awaiter(this, void 0, void 0, function* () {
                                                                                                            return ApiPost.put({
                                                                                                                postData: dd.content,
                                                                                                                token: window.parent.config.token,
                                                                                                                type: 'manager',
                                                                                                            }).then((res) => {
                                                                                                                res.result ? n++ : run();
                                                                                                            });
                                                                                                        });
                                                                                                    }
                                                                                                    run();
                                                                                                });
                                                                                                setInterval(() => {
                                                                                                    n === selCount && setTimeout(() => resolve(), 200);
                                                                                                }, 500);
                                                                                            }).then(() => {
                                                                                                dialog.dataLoading({ visible: false });
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            });
                                                                                        }),
                                                                                    },
                                                                                    {
                                                                                        name: '下架',
                                                                                        event: gvc.event(() => {
                                                                                            dialog.dataLoading({ visible: true });
                                                                                            new Promise((resolve) => {
                                                                                                let n = 0;
                                                                                                vm.dataList
                                                                                                    .filter((dd) => {
                                                                                                    return dd.checked;
                                                                                                })
                                                                                                    .map((dd) => {
                                                                                                    dd.content.status = 'draft';
                                                                                                    function run() {
                                                                                                        return __awaiter(this, void 0, void 0, function* () {
                                                                                                            return ApiPost.put({
                                                                                                                postData: dd.content,
                                                                                                                token: window.parent.config.token,
                                                                                                                type: 'manager',
                                                                                                            }).then((res) => {
                                                                                                                res.result ? n++ : run();
                                                                                                            });
                                                                                                        });
                                                                                                    }
                                                                                                    run();
                                                                                                });
                                                                                                setInterval(() => {
                                                                                                    n === selCount && setTimeout(() => resolve(), 200);
                                                                                                }, 500);
                                                                                            }).then(() => {
                                                                                                dialog.dataLoading({ visible: false });
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            });
                                                                                        }),
                                                                                    },
                                                                                ],
                                                                                text: '更多操作',
                                                                            }),
                                                                            BgWidget.selEventButton('刪除', gvc.event(() => {
                                                                                dialog.checkYesOrNot({
                                                                                    text: '是否確認刪除所選項目？',
                                                                                    callback: (response) => {
                                                                                        if (response) {
                                                                                            dialog.dataLoading({ visible: true });
                                                                                            ApiShop.delete({
                                                                                                id: vm.dataList
                                                                                                    .filter((dd) => {
                                                                                                    return dd.checked;
                                                                                                })
                                                                                                    .map((dd) => {
                                                                                                    return dd.id;
                                                                                                })
                                                                                                    .join(`,`),
                                                                                            }).then((res) => {
                                                                                                dialog.dataLoading({ visible: false });
                                                                                                if (res.result) {
                                                                                                    vm.dataList = undefined;
                                                                                                    gvc.notifyDataChange(vm.id);
                                                                                                }
                                                                                                else {
                                                                                                    dialog.errorMessage({
                                                                                                        text: '刪除失敗',
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    },
                                                                                });
                                                                            })),
                                                                        ],
                                                                    });
                                                                }
                                                            },
                                                            divCreate: () => {
                                                                return {
                                                                    class: `d-flex align-items-center p-2 py-3 ${!vm.dataList ||
                                                                        !vm.dataList.find((dd) => {
                                                                            return dd.checked;
                                                                        })
                                                                        ? `d-none`
                                                                        : ``}`,
                                                                    style: `height:40px; gap:10px;`,
                                                                };
                                                            },
                                                        };
                                                    })}
                                                                    `,
                                                    style: ['', document.body.clientWidth < 800 ? 'min-width: 120vw' : ''],
                                                }),
                                            }),
                                        ].join(''))}
                                                ${BgWidget.mbContainer(240)}
                                            `, BgWidget.getContainerWidth());
                                    }
                                },
                                divCreate: {},
                                onCreate: () => {
                                    if (vmlist.loading) {
                                        BgProduct.getCollectionAllOpts(vmlist.collections, () => {
                                            vmlist.loading = false;
                                            gvc.notifyDataChange(vmlist.id);
                                        });
                                    }
                                },
                            });
                        case 'replace':
                            setTimeout(() => {
                                document.querySelector('.pd-w-c').scrollTop = vm.last_scroll;
                                vm.last_scroll = 0;
                            }, 200);
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'replace',
                                defData: vm.replaceData,
                            });
                        case 'editSpec':
                            vm.last_scroll = document.querySelector('.pd-w-c').scrollTop;
                            return ShoppingProductSetting.editProductSpec({
                                vm: vm,
                                gvc: gvc,
                                defData: vm.replaceData,
                            });
                    }
                },
                divCreate: {
                    class: `w-100 h-100`,
                },
            };
        });
    }
    static editProductSpec(obj) {
        var _a, _b;
        const html = String.raw;
        let postMD = obj.defData;
        let variant = {};
        let orignData = {};
        let index = 0;
        const gvc = obj.gvc;
        postMD.variants.map((data, ind) => {
            if (data.editable) {
                index = ind;
                variant = obj.single ? data : JSON.parse(JSON.stringify(data));
                orignData = data;
            }
        });
        function checkStore(next) {
            const dialog = new ShareDialog(gvc.glitter);
            if (JSON.stringify(orignData) !== JSON.stringify(variant)) {
                dialog.checkYesOrNot({
                    text: '內容已變更是否儲存?',
                    callback: (response) => {
                        if (response) {
                            postMD.variants[index] = variant;
                        }
                        obj && obj.goBackEvent ? obj.goBackEvent.save(postMD) : next();
                    },
                });
            }
            else {
                next();
            }
        }
        document.querySelector('.pd-w-c').scrollTop = 0;
        return html ` <div class="d-flex" style="font-size: 16px;color:#393939;font-weight: 400;position: relative;padding:0;padding-bottom: ${obj.single ? `0px` : `80px`};">
            ${BgWidget.container(html `
                    <div class="d-flex w-100 align-items-center mb-3 ${obj.single ? `d-none` : ``}">
                        ${BgWidget.goBack(obj.gvc.event(() => {
            checkStore(obj && obj.goBackEvent
                ? obj.goBackEvent.cancel
                : () => {
                    obj.vm.type = 'replace';
                });
        }))}
                        ${BgWidget.title(variant.spec.length > 0 ? variant.spec.join(' / ') : '單一規格')}
                    </div>
                    <div class="d-flex flex-column flex-column-reverse  ${obj.single ? `flex-column-reverse` : `flex-sm-row`} w-100 p-0" style="gap: 24px;">
                        <div class="leftBigArea d-flex flex-column flex-fill" style="gap: 24px;">
                            ${!obj.single
            ? BgWidget.mainCardMbp0(gvc.bindView(() => {
                const id = gvc.glitter.getUUID();
                gvc.addStyle(`
                                              .p-hover-image:hover {
                                                  opacity: 1 !important; /* 在父元素悬停时，底层元素可见 */
                                              }
                                          `);
                return {
                    bind: id,
                    view: () => {
                        return html `
                                                      <div style="font-weight: 700;">規格</div>
                                                      <div>${variant.spec.length > 0 ? variant.spec.join(' / ') : '單一規格'}</div>
                                                      <div style="font-weight: 700;">圖片</div>
                                                      <div
                                                          class="d-flex align-items-center justify-content-center rounded-3 shadow"
                                                          style="min-width:135px;135px;height:135px;cursor:pointer;background: 50%/cover url('${variant.preview_image ||
                            'https://nationalityforall.org/wp-content/themes/nfa/dist/images/default_image.jpg'}');"
                                                      >
                                                          <div
                                                              class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image"
                                                              style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;"
                                                          >
                                                              <i
                                                                  class="fa-regular fa-eye"
                                                                  onclick="${obj.gvc.event(() => {
                            obj.gvc.glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', variant.preview_image || 'https://nationalityforall.org/wp-content/themes/nfa/dist/images/default_image.jpg');
                        })}"
                                                              ></i>
                                                          </div>
                                                      </div>
                                                      <div
                                                          style="width: 136px;text-align: center;color: #36B;cursor: pointer;"
                                                          onclick="${obj.gvc.event(() => {
                            EditorElem.uploadFileFunction({
                                gvc: obj.gvc,
                                callback: (text) => {
                                    variant.preview_image = text;
                                    gvc.notifyDataChange(id);
                                },
                                type: `image/*, video/*`,
                            });
                        })}"
                                                      >
                                                          變更
                                                      </div>
                                                  `;
                    },
                    divCreate: {
                        style: `display: flex;flex-direction: column;align-items: flex-start;gap: 18px;align-self: stretch;`,
                    },
                };
            }))
            : ''}
                            ${BgWidget.mainCardMbp0(html `
                                <div class="w-100" style="display: flex;gap: 18px;flex-direction: column;">
                                    <div style="font-weight: 700;">定價</div>
                                    <div class="d-flex w-100" style="gap:18px;">
                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                            <div>販售價格*</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                placeholder="請輸入販售價格"
                                                onchange="${gvc.event((e) => {
            variant.sale_price = e.value;
        })}"
                                                min="0"
                                                value="${variant.sale_price || '0'}"
                                                type="number"
                                            />
                                        </div>
                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                            <div>比較價格*</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                placeholder="請輸入比較價格"
                                                min="0"
                                                onchange="${gvc.event((e) => {
            variant.compare_price = e.value;
        })}"
                                                value="${variant.compare_price || '0'}"
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                    <div class="d-flex w-100" style="gap:18px;">
                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                            <div>成本</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                placeholder="請輸入成本"
                                                min="0"
                                                onchange="${gvc.event((e) => {
            variant.stock = e.value;
        })}"
                                                value="${variant.stock || 0}"
                                                type="number"
                                            />
                                        </div>
                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                            <div>利潤</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                min="0"
                                                onchange="${gvc.event((e) => {
            variant.profit = e.value;
        })}"
                                                placeholder="-"
                                                value="${variant.profit}"
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            `)}
                            ${BgWidget.mainCardMbp0(html `
                                ${gvc.bindView(() => {
            const vm = {
                id: gvc.glitter.getUUID(),
            };
            return {
                bind: vm.id,
                view: () => {
                    return html ` <div style="font-weight: 700;margin-bottom: 6px;">運費計算</div>
                                                ${BgWidget.multiCheckboxContainer(gvc, [
                        {
                            key: 'volume',
                            name: '依材積計算',
                        },
                        {
                            key: 'weight',
                            name: '依重量計算',
                        },
                        {
                            key: 'none',
                            name: '不計算運費',
                        },
                    ], [variant.shipment_type], (data) => {
                        variant.shipment_type = data[0];
                        gvc.notifyDataChange(vm.id);
                    }, false, true)}`;
                },
                divCreate: {
                    class: `d-flex flex-column`,
                    style: `gap:12px;`,
                },
            };
        })}
                            `)}
                            ${BgWidget.mainCardMbp0(html `
                                <div class="d-flex flex-column" style="gap:18px;">
                                    <div style="font-weight: 700;">商品材積</div>
                                    <div class="row">
                                        ${[
            {
                title: '長度',
                value: 'v_length',
                unit: '公分',
            },
            {
                title: '寬度',
                value: 'v_width',
                unit: '公分',
            },
            {
                title: '高度',
                value: 'v_height',
                unit: '公分',
            },
        ]
            .map((dd) => {
            return html ` <div style="display: flex;justify-content: center;align-items: center;gap: 10px;position: relative;" class=" col-12 col-sm-4 mb-2">
                                                    <div style="white-space: nowrap;">${dd.title}</div>
                                                    <input
                                                        class="ps-3"
                                                        style="border-radius: 10px;border: 1px solid #DDD;height: 40px;width: calc(100% - 50px);"
                                                        type="number"
                                                        onchange="${gvc.event((e) => {
                variant[dd.value] = e.value;
            })}"
                                                        value="${variant[dd.value]}"
                                                    />
                                                    <div style="color: #8D8D8D;position: absolute;right: 25px;top: 7px;">${dd.unit}</div>
                                                </div>`;
        })
            .join('')}
                                    </div>
                                    <div style="font-weight: 700;">商品重量</div>
                                    <div class="w-100 row m-0" style="color:#393939;">
                                        <input
                                            class="col-6"
                                            style="display: flex;height: 40px;padding: 10px 18px;align-items: center;gap: 10px;border-radius: 10px;border: 1px solid #DDD;"
                                            placeholder="請輸入商品重量"
                                            value="${variant.weight || 0}"
                                            onchange="${gvc.event((e) => {
            variant.weight = e.value;
        })}"
                                        />
                                        <div class="col-6" style="display: flex;align-items: center;gap: 10px;">
                                            <div class="" style="white-space: nowrap;">單位</div>
                                            <select class="form-select d-flex align-items-center flex-fill" style="border-radius: 10px;border: 1px solid #DDD;padding-left: 18px;">
                                                <option value="kg">公斤</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            `)}
                            ${BgWidget.mainCardMbp0(html `
                                <div class="d-flex flex-column" style="gap: 18px;">
                                    <div style="font-weight: 700;">庫存政策</div>
                                    ${gvc.bindView(() => {
            const id = gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    var _a, _b;
                    return html `
                                                    <div class="d-flex flex-column w-100" style="">
                                                        <div
                                                            class="d-flex align-items-center"
                                                            style="gap:6px;cursor: pointer;"
                                                            onclick="${gvc.event(() => {
                        variant.show_understocking = 'true';
                        gvc.notifyDataChange(id);
                    })}"
                                                        >
                                                            ${variant.show_understocking != 'false'
                        ? html `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                        : html `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                            追蹤商品庫存
                                                        </div>
                                                        ${variant.show_understocking != 'false'
                        ? html `<div
                                                                  class="w-100 align-items-center"
                                                                  style="display: flex;padding-left: 8px;align-items: flex-start;gap: 14px;align-self: stretch;margin-top: 8px;"
                                                              >
                                                                  <div style="background-color: #E5E5E5;height: 80px;width: 1px;"></div>
                                                                  <div class="flex-fill d-flex flex-column" style="gap: 8px">
                                                                      <div>庫存數量</div>
                                                                      <input
                                                                          class="w-100"
                                                                          value="${(_a = variant.stock) !== null && _a !== void 0 ? _a : '0'}"
                                                                          style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                          placeholder="請輸入庫存數量"
                                                                          onchange="${gvc.event((e) => {
                            variant.stock = e.value;
                        })}"
                                                                      />
                                                                  </div>
                                                                  <div class="flex-fill d-flex flex-column" style="gap: 8px">
                                                                      <div>安全庫存</div>
                                                                      <input
                                                                          class="w-100"
                                                                          value="${(_b = variant.save_stock) !== null && _b !== void 0 ? _b : '0'}"
                                                                          style="padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                          placeholder="請輸入安全庫存"
                                                                          onchange="${gvc.event((e) => {
                            variant.save_stock = e.value;
                        })}"
                                                                      />
                                                                  </div>
                                                              </div>`
                        : ``}
                                                    </div>
                                                    <div
                                                        class="d-flex align-items-center"
                                                        style="gap:6px;cursor: pointer;"
                                                        onclick="${gvc.event(() => {
                        variant.show_understocking = 'false';
                        gvc.notifyDataChange(id);
                    })}"
                                                    >
                                                        ${variant.show_understocking == 'false'
                        ? html `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                        : html `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                        不追蹤
                                                    </div>
                                                `;
                },
                divCreate: { style: `display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;` },
            };
        })}
                                </div>
                            `)}
                            ${BgWidget.mainCardMbp0(html `
                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                    <div style="font-size: 16px;font-weight: 700;">商品管理</div>
                                    <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                        <div style="font-weight: 400;font-size: 16px;">存貨單位 (SKU)</div>
                                        <input
                                            style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                            placeholder="請輸入存貨單位"
                                            value="${(_a = variant.sku) !== null && _a !== void 0 ? _a : ''}"
                                            onchange="${gvc.event((e) => {
            variant.sku = e.value;
        })}"
                                        />
                                    </div>
                                    <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                        <div style="font-weight: 400;font-size: 16px;">商品條碼 (ISBN、UPC、GTIN等)</div>
                                        <input
                                            style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                            placeholder="請輸入商品條碼"
                                            value="${(_b = variant.barcode) !== null && _b !== void 0 ? _b : ''}"
                                            onchange="${gvc.event((e) => {
            variant.barcode = e.value;
        })}"
                                        />
                                    </div>
                                </div>
                            `)}
                        </div>
                        <div class="${obj.single ? `d-none` : ``}" style="min-width:300px; max-width:100%;">
                            ${BgWidget.mainCardMbp0(html `
                                ${gvc.bindView({
            bind: 'right',
            view: () => {
                let rightHTML = postMD.variants
                    .map((data) => {
                    if (!data.editable) {
                        return html `
                                                        <div
                                                            class="d-flex align-items-center"
                                                            style="gap: 10px;cursor: pointer"
                                                            onmouseover="${gvc.event((e) => {
                            e.style.background = '#F7F7F7';
                        })}"
                                                            onmouseout="${gvc.event((e) => {
                            e.style.background = '#FFFFFF';
                        })}"
                                                            onclick="${gvc.event(() => {
                            checkStore(() => {
                                postMD.variants.map((dd) => {
                                    dd.editable = false;
                                });
                                data.editable = true;
                                obj.vm.type = 'editSpec';
                            });
                        })}"
                                                        >
                                                            <div
                                                                class="rounded-3"
                                                                style="width: 30px;height: 30px;background:50%/cover url('${data.preview_image ||
                            'https://nationalityforall.org/wp-content/themes/nfa/dist/images/default_image.jpg'}')"
                                                            ></div>
                                                            <div>${data.spec.join(' / ')}</div>
                                                        </div>
                                                    `;
                    }
                    else {
                        return ``;
                    }
                })
                    .join('');
                return html `
                                            <div style="font-weight: 700;">其他規格</div>
                                            <div class="d-flex flex-column" style="gap:16px">${rightHTML}</div>
                                        `;
            },
            divCreate: { style: 'gap:18px', class: `d-flex flex-column` },
        })}
                            `)}
                        </div>
                    </div>
                `, obj.single ? 674 : 944, obj.single ? `padding:0px;margin:0px;` : ``)}
            <div class="update-bar-container ${obj.single ? `d-none` : ``}">
                ${BgWidget.cancel(obj.gvc.event(() => {
            checkStore(obj && obj.goBackEvent
                ? obj.goBackEvent.cancel
                : () => {
                    variant = orignData;
                    obj.vm.type = 'replace';
                });
        }), '11')}
                ${BgWidget.save(obj.gvc.event(() => {
            postMD.variants.map((data, index) => {
                if (data.editable) {
                    postMD.variants[index] = variant;
                }
            });
            if (obj && obj.goBackEvent) {
                obj.goBackEvent.save(postMD);
            }
            else {
                obj.vm.type = 'replace';
            }
        }))}
            </div>
        </div>`;
    }
    static editProduct(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let postMD = {
                title: '',
                productType: {
                    product: true,
                    addProduct: false,
                    giveaway: false,
                },
                content: '',
                status: 'active',
                collection: [],
                hideIndex: 'false',
                preview_image: [],
                specs: [],
                variants: [],
                seo: {
                    title: '',
                    content: '',
                    keywords: '',
                },
                template: '',
            };
            if (obj.type === 'replace') {
                postMD = obj.defData;
            }
            else {
                obj.vm.replaceData = postMD;
            }
            const html = String.raw;
            const gvc = obj.gvc;
            const seoID = gvc.glitter.getUUID();
            const variantsViewID = gvc.glitter.getUUID();
            let createPage = {
                page: 'add',
            };
            let selectFunRow = false;
            const saasConfig = window.parent.saasConfig;
            let shipment_config = yield saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`);
            if (shipment_config.response.result[0]) {
                shipment_config = shipment_config.response.result[0].value || {};
            }
            else {
                shipment_config = {};
            }
            function updateVariants() {
                const remove_indexs = [];
                let complexity = 1;
                postMD.specs = postMD.specs.filter((dd) => {
                    return dd.option && dd.option.length !== 0;
                });
                postMD.specs.map((spec) => {
                    complexity *= spec.option.length;
                });
                const cType = [];
                function generateCombinations(specs, currentCombination, index = 0) {
                    if (index === specs.length &&
                        currentCombination.length > 0 &&
                        cType.findIndex((ct) => {
                            return JSON.stringify(ct) === JSON.stringify(currentCombination);
                        }) === -1) {
                        cType.push(JSON.parse(JSON.stringify(currentCombination)));
                        return;
                    }
                    const currentSpecOptions = specs[index];
                    if (currentSpecOptions) {
                        for (const option of currentSpecOptions) {
                            currentCombination[index] = option;
                            generateCombinations(specs, currentCombination, index + 1);
                        }
                    }
                }
                function checkSpecInclude(spec, index) {
                    if (postMD.specs[index]) {
                        for (const { title } of postMD.specs[index].option) {
                            if (spec === title)
                                return true;
                        }
                        return false;
                    }
                    return false;
                }
                for (let n = 0; n < complexity; n++) {
                    let currentCombination = [];
                    generateCombinations(postMD.specs.map((dd) => {
                        return dd.option.map((dd) => {
                            return dd.title;
                        });
                    }), currentCombination);
                    const waitAdd = cType.find((dd) => {
                        return !postMD.variants.find((d2) => {
                            return JSON.stringify(d2.spec) === JSON.stringify(dd);
                        });
                    });
                    if (waitAdd) {
                        postMD.variants.push({
                            show_understocking: 'true',
                            type: 'variants',
                            sale_price: 0,
                            compare_price: 0,
                            cost: 0,
                            spec: waitAdd,
                            profit: 0,
                            v_length: 0,
                            v_width: 0,
                            v_height: 0,
                            weight: 0,
                            shipment_type: shipment_config.selectCalc || 'weight',
                            sku: '',
                            barcode: '',
                            stock: 0,
                            preview_image: '',
                        });
                    }
                }
                if (postMD.variants && postMD.variants.length > 0) {
                    postMD.variants.map((variant, index1) => {
                        if (variant.spec.length !== postMD.specs.length) {
                            remove_indexs.push(index1);
                        }
                        variant.spec.map((sp, index2) => {
                            if (!checkSpecInclude(sp, index2)) {
                                remove_indexs.push(index1);
                            }
                        });
                    });
                }
                postMD.variants = postMD.variants.filter((variant) => {
                    let pass = true;
                    let index = 0;
                    for (const b of variant.spec) {
                        if (!postMD.specs[index] ||
                            !postMD.specs[index].option.find((dd) => {
                                return dd.title === b;
                            })) {
                            pass = false;
                            break;
                        }
                        index++;
                    }
                    return pass && variant.spec.length === postMD.specs.length;
                });
                if (postMD.variants.length === 0) {
                    postMD.variants.push({
                        show_understocking: 'true',
                        type: 'variants',
                        sale_price: 0,
                        compare_price: 0,
                        cost: 0,
                        spec: [],
                        profit: 0,
                        v_length: 0,
                        v_width: 0,
                        v_height: 0,
                        weight: 0,
                        shipment_type: shipment_config.selectCalc || 'weight',
                        sku: '',
                        barcode: '',
                        stock: 0,
                        preview_image: '',
                    });
                }
                obj.gvc.notifyDataChange(variantsViewID);
            }
            function checkSpecSingle() {
                if (postMD.specs.length > 0) {
                    const uniqueTitlesMap = new Map();
                    postMD.specs.forEach((item) => {
                        if (!uniqueTitlesMap.has(item.title)) {
                            uniqueTitlesMap.set(item.title, item.option);
                        }
                        else {
                            const existingOptions = uniqueTitlesMap.get(item.title);
                            item.option.forEach((option) => {
                                if (!existingOptions.find((existingOption) => existingOption.title === option.title)) {
                                    existingOptions.push(option);
                                }
                            });
                        }
                    });
                    postMD.specs = Array.from(uniqueTitlesMap, ([title, option]) => ({ title, option }));
                }
            }
            gvc.addStyle(`
            .specInput:focus {
                outline: none;
            }
        `);
            const vm = {
                id: gvc.glitter.getUUID(),
            };
            updateVariants();
            return gvc.bindView(() => {
                return {
                    bind: vm.id,
                    view: () => {
                        var _a;
                        return [
                            BgWidget.container(html `
                                <div class="d-flex w-100 align-items-center mb-3" style="font-size: 16px; font-weight: 400;">
                                    ${BgWidget.goBack(obj.gvc.event(() => {
                                obj.vm.type = 'list';
                            }))}
                                    <h3 class="mb-0 me-2 tx_title">${obj.type === 'replace' ? postMD.title || '編輯商品' : `新增商品`}</h3>
                                    <div class="flex-fill"></div>
                                    ${BgWidget.grayButton(document.body.clientWidth > 768 ? '預覽商品' : '預覽', gvc.event(() => {
                                window.open(`https://${window.parent.glitter.share.editorViewModel.domain}/products?product_id=${postMD.id}`, '_blank');
                            }), { icon: document.body.clientWidth > 768 ? 'fa-regular fa-eye' : undefined })}
                                </div>
                                <div class="d-flex justify-content-center p-0 ${document.body.clientWidth < 768 ? 'flex-column' : ''}" style="${document.body.clientWidth < 768 ? '' : 'gap: 24px'}">
                                    ${BgWidget.container([
                                BgWidget.mainCardMbp0(html `
                                                <div class="d-flex flex-column">
                                                    <div style="font-weight: 700;">商品名稱</div>
                                                    <input
                                                        class="w-100 mt-2"
                                                        value="${(_a = postMD.title) !== null && _a !== void 0 ? _a : ''}"
                                                        style="border-radius: 10px;border: 1px solid #DDD;display: flex;padding: 9px 18px 9px 18px;align-items: center;align-self: stretch;"
                                                        onchange="${gvc.event((e) => {
                                    postMD.title = e.value;
                                })}"
                                                    />
                                                </div>
                                            `),
                                BgWidget.mainCardMbp0([
                                    obj.gvc.bindView(() => {
                                        const bi = obj.gvc.glitter.getUUID();
                                        return {
                                            bind: bi,
                                            view: () => {
                                                return [
                                                    html ` <div style="font-weight: 700;" class="mb-2">商品說明</div>`,
                                                    EditorElem.richText({
                                                        gvc: obj.gvc,
                                                        def: postMD.content,
                                                        callback: (text) => {
                                                            postMD.content = text;
                                                        },
                                                        style: 'overflow-y: auto;max-height:80vh;',
                                                    }),
                                                ].join('');
                                            },
                                            divCreate: {},
                                        };
                                    }),
                                ].join('<div class="my-2"></div>')),
                                BgWidget.mainCardMbp0(html `
                                                    <div style="color: #393939;font-size: 16px;font-weight: 700;margin-bottom: 18px;">圖片</div>
                                                    ${obj.gvc.bindView(() => {
                                    const id = obj.gvc.glitter.getUUID();
                                    return {
                                        bind: id,
                                        view: () => {
                                            return (html ` <div class="my-2"></div>` +
                                                EditorElem.flexMediaManagerV2({
                                                    gvc: obj.gvc,
                                                    data: postMD.preview_image,
                                                }) +
                                                html `
                                                                        <div
                                                                            style="cursor:pointer;display: flex;width: 136px;height: 136px;padding: 0px 35px 0px 34px;justify-content: center;align-items: center;border-radius: 10px;border: 1px solid #DDD;margin-left: 14px;"
                                                                            onclick="${obj.gvc.event(() => {
                                                    EditorElem.uploadFileFunction({
                                                        gvc: obj.gvc,
                                                        callback: (text) => {
                                                            postMD.preview_image.push(text);
                                                            obj.gvc.notifyDataChange(id);
                                                        },
                                                        type: `image/*, video/*`,
                                                    });
                                                })}"
                                                                        >
                                                                            <div
                                                                                style="display: flex;width: 67px;height: 40px;justify-content: center;align-items: center;gap: 10px;flex-shrink: 0;border-radius: 10px;border: 1px solid #393939;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);"
                                                                            >
                                                                                新增
                                                                            </div>
                                                                        </div>
                                                                    `);
                                        },
                                        divCreate: {
                                            class: `d-flex w-100`,
                                            style: `overflow-y:scroll`,
                                        },
                                    };
                                })}
                                                `),
                                postMD.variants.length === 1
                                    ? (() => {
                                        try {
                                            postMD.variants[0].editable = true;
                                            return ShoppingProductSetting.editProductSpec({
                                                vm: obj.vm,
                                                defData: postMD,
                                                gvc: gvc,
                                                single: true,
                                            });
                                        }
                                        catch (e) {
                                            console.error(e);
                                            return '';
                                        }
                                    })()
                                    : ``,
                                BgWidget.mainCardMbp0(obj.gvc.bindView(() => {
                                    const specid = obj.gvc.glitter.getUUID();
                                    return {
                                        bind: specid,
                                        dataList: [{ obj: createPage, key: 'page' }],
                                        view: () => {
                                            let returnHTML = ``;
                                            let editSpectPage = [];
                                            if (postMD.specs.length > 0) {
                                                postMD.specs.map(() => {
                                                    editSpectPage.push({
                                                        type: 'show',
                                                    });
                                                });
                                                returnHTML += html `
                                                                    <div style="color:#393939;font-weight: 700;">商品規格</div>
                                                                    ${EditorElem.arrayItem({
                                                    customEditor: true,
                                                    gvc: obj.gvc,
                                                    title: '',
                                                    hoverGray: true,
                                                    position: 'front',
                                                    height: 100,
                                                    originalArray: postMD.specs,
                                                    expand: true,
                                                    copyable: false,
                                                    hr: true,
                                                    minus: false,
                                                    refreshComponent: () => {
                                                        obj.gvc.notifyDataChange([specid, 'productInf']);
                                                    },
                                                    array: () => {
                                                        return postMD.specs.map((dd, specIndex) => {
                                                            let temp = {
                                                                title: '',
                                                                option: [],
                                                            };
                                                            return {
                                                                title: gvc.bindView({
                                                                    bind: `editSpec${specIndex}`,
                                                                    dataList: [
                                                                        {
                                                                            obj: editSpectPage[specIndex],
                                                                            key: 'type',
                                                                        },
                                                                    ],
                                                                    view: () => {
                                                                        if (editSpectPage[specIndex].type == 'show') {
                                                                            gvc.addStyle(`
                                                                                                    .option {
                                                                                                        background-color: #f7f7f7;
                                                                                                    }
                                                                                                    .pen {
                                                                                                        display: none;
                                                                                                    }
                                                                                                `);
                                                                            return html ` <div class="d-flex flex-column" style="gap:6px;align-items: flex-start;padding: 12px 0;">
                                                                                                    <div style="font-size: 16px;">${dd.title}</div>
                                                                                                    ${(() => {
                                                                                let returnHTML = ``;
                                                                                let selectBTN = undefined;
                                                                                dd.option.map((opt) => {
                                                                                    returnHTML += html `
                                                                                                                <div class="option" style="border-radius: 5px;;padding: 1px 9px;font-size: 14px;">
                                                                                                                    ${opt.title}
                                                                                                                </div>
                                                                                                            `;
                                                                                });
                                                                                return html `
                                                                                                            <div class="d-flex w-100 " style="gap:8px; flex-wrap: wrap">
                                                                                                                ${returnHTML}
                                                                                                                <div
                                                                                                                    class="position-absolute "
                                                                                                                    style="right:12px;top:50%;transform: translateY(-50%);"
                                                                                                                    onclick="${gvc.event((e) => {
                                                                                    selectBTN = e.parentElement.parentElement.parentElement.previousElementSibling;
                                                                                    selectBTN.classList.toggle('d-none');
                                                                                    editSpectPage[specIndex].type = 'edit';
                                                                                })}"
                                                                                                                >
                                                                                                                    <svg
                                                                                                                        class="pen"
                                                                                                                        style="cursor:pointer"
                                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                                        width="16"
                                                                                                                        height="17"
                                                                                                                        viewBox="0 0 16 17"
                                                                                                                        fill="none"
                                                                                                                    >
                                                                                                                        <g clip-path="url(#clip0_8114_2928)">
                                                                                                                            <path
                                                                                                                                d="M1.13728 11.7785L0.418533 14.2191L0.0310334 15.5379C-0.0470916 15.8035 0.0247834 16.0879 0.218533 16.2816C0.412283 16.4754 0.696658 16.5473 0.959158 16.4723L2.28103 16.0816L4.72166 15.3629C5.04666 15.2691 5.34978 15.1129 5.61541 14.9098L5.62478 14.916L5.64041 14.891C5.68416 14.8566 5.72478 14.8223 5.76541 14.7879C5.80916 14.7504 5.84978 14.7098 5.89041 14.6691L15.3967 5.16602C16.081 4.48164 16.1654 3.42852 15.6529 2.65039C15.581 2.54102 15.4935 2.43477 15.3967 2.33789L14.1654 1.10352C13.3842 0.322266 12.1185 0.322266 11.3373 1.10352L1.83103 10.6098C1.75291 10.6879 1.67791 10.7723 1.60916 10.8598L1.58416 10.8754L1.59041 10.8848C1.38728 11.1504 1.23416 11.4535 1.13728 11.7785ZM11.9685 6.46914L6.16853 12.2691L4.61853 11.8816L4.23103 10.3316L10.031 4.53164L11.9685 6.46914ZM3.03103 11.716L3.27166 12.6848C3.33728 12.9535 3.54978 13.1629 3.81853 13.2316L4.78728 13.4723L4.55603 13.8223C4.47478 13.866 4.39041 13.9035 4.30291 13.9285L3.57166 14.1441L1.85603 14.6441L2.35916 12.9316L2.57478 12.2004C2.59978 12.1129 2.63728 12.0254 2.68103 11.9473L3.03103 11.716ZM9.85291 7.33477C10.0467 7.14102 10.0467 6.82227 9.85291 6.62852C9.65916 6.43477 9.34041 6.43477 9.14666 6.62852L6.14666 9.62852C5.95291 9.82227 5.95291 10.141 6.14666 10.3348C6.34041 10.5285 6.65916 10.5285 6.85291 10.3348L9.85291 7.33477Z"
                                                                                                                                fill="#393939"
                                                                                                                            />
                                                                                                                        </g>
                                                                                                                        <defs>
                                                                                                                            <clipPath id="clip0_8114_2928">
                                                                                                                                <rect
                                                                                                                                    width="16"
                                                                                                                                    height="16"
                                                                                                                                    fill="white"
                                                                                                                                    transform="translate(0 0.5)"
                                                                                                                                />
                                                                                                                            </clipPath>
                                                                                                                        </defs>
                                                                                                                    </svg>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        `;
                                                                            })()}
                                                                                                </div>`;
                                                                        }
                                                                        temp = JSON.parse(JSON.stringify(dd));
                                                                        return html `
                                                                                                <div
                                                                                                    style="background-color:white;display: flex;padding: 20px;flex-direction: column;align-items: flex-end;gap: 24px;align-self: stretch;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                >
                                                                                                    <div
                                                                                                        style="display: flex;flex-direction: column;align-items: flex-end;gap: 18px;align-self: stretch;"
                                                                                                    >
                                                                                                        <div style="width:100%;display: flex;flex-direction: column;align-items: flex-end;gap: 18px;">
                                                                                                            ${ShoppingProductSetting.specInput(gvc, temp, {
                                                                            cancel: () => {
                                                                                editSpectPage[specIndex].type = 'show';
                                                                                gvc.notifyDataChange(specid);
                                                                            },
                                                                            save: () => {
                                                                                editSpectPage[specIndex].type = 'show';
                                                                                postMD.specs[specIndex] = temp;
                                                                                checkSpecSingle();
                                                                                updateVariants();
                                                                                gvc.notifyDataChange([specid]);
                                                                            },
                                                                        })}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            `;
                                                                    },
                                                                    divCreate: { class: `w-100 position-relative` },
                                                                }),
                                                                innerHtml: (gvc) => {
                                                                    return ``;
                                                                },
                                                                editTitle: `編輯規格`,
                                                            };
                                                        });
                                                    },
                                                })}
                                                                `;
                                            }
                                            if (createPage.page == 'add') {
                                                returnHTML += html `
                                                                    <div
                                                                        style="width:100%;display:flex;align-items: center;justify-content: center;color: #36B;gap:6px;cursor: pointer;"
                                                                        onclick="${gvc.event(() => {
                                                    createPage.page = 'edit';
                                                })}"
                                                                    >
                                                                        新增規格
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                            <path d="M1.5 7.23926H12.5" stroke="#3366BB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                            <path d="M6.76172 1.5L6.76172 12.5" stroke="#3366BB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                        </svg>
                                                                    </div>
                                                                `;
                                            }
                                            else if (createPage.page == 'edit') {
                                                let temp = {
                                                    title: '',
                                                    option: [],
                                                };
                                                returnHTML += html `
                                                                    ${BgWidget.mainCardMbp0(html `
                                                                        <div style="display: flex;flex-direction: column;align-items: flex-end;gap: 18px;align-self: stretch;" class="">
                                                                            <div style="width:100%;display: flex;flex-direction: column;align-items: flex-end;gap: 18px;" class="">
                                                                                ${ShoppingProductSetting.specInput(gvc, temp, {
                                                    cancel: () => {
                                                        createPage.page = 'add';
                                                    },
                                                    save: () => {
                                                        postMD.specs.push(temp);
                                                        createPage.page = 'add';
                                                        checkSpecSingle();
                                                        updateVariants();
                                                        gvc.notifyDataChange([vm.id]);
                                                    },
                                                })}
                                                                            </div>
                                                                        </div>
                                                                    `)}
                                                                `;
                                            }
                                            return returnHTML;
                                        },
                                        divCreate: { class: `d-flex flex-column`, style: `gap:18px;` },
                                    };
                                })),
                                postMD.specs.length == 0
                                    ? ``
                                    : BgWidget.mainCardMbp0(html ` <div style="font-size: 16px;font-weight: 700;color:#393939;margin-bottom: 18px;">規格設定</div>` +
                                        obj.gvc.bindView(() => {
                                            var _a;
                                            function getPreviewImage(img) {
                                                return img || 'https://nationalityforall.org/wp-content/themes/nfa/dist/images/default_image.jpg';
                                            }
                                            postMD.specs[0].option = (_a = postMD.specs[0].option) !== null && _a !== void 0 ? _a : [];
                                            return {
                                                bind: variantsViewID,
                                                view: () => {
                                                    return gvc.bindView({
                                                        bind: 'productInf',
                                                        view: () => {
                                                            try {
                                                                return [
                                                                    gvc.bindView({
                                                                        bind: 'selectFunRow',
                                                                        view: () => {
                                                                            let selected = postMD.variants.filter((dd) => {
                                                                                return dd.checked;
                                                                            });
                                                                            if (selected.length) {
                                                                                function saveQueue(key, value) {
                                                                                    postMD.variants.filter((dd) => {
                                                                                        if (dd.checked) {
                                                                                            if (key == 'volume') {
                                                                                                dd.v_length = value.v_length;
                                                                                                dd.v_width = value.v_width;
                                                                                                dd.v_height = value.v_height;
                                                                                            }
                                                                                            dd[key] = value;
                                                                                        }
                                                                                    });
                                                                                    gvc.notifyDataChange('productInf');
                                                                                    gvc.glitter.closeDiaLog();
                                                                                }
                                                                                function editDialog(type) {
                                                                                    let inputTemp = {};
                                                                                    switch (type) {
                                                                                        case 'price': {
                                                                                            inputTemp = 0;
                                                                                            return html `
                                                                                                                  <div
                                                                                                                      style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;max-width: calc(100vw - 20px);"
                                                                                                                  >
                                                                                                                      <div
                                                                                                                          style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                      >
                                                                                                                          編輯販售價格
                                                                                                                      </div>
                                                                                                                      <div
                                                                                                                          class="w-100 d-flex flex-column"
                                                                                                                          style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                      >
                                                                                                                          將價格套用到所有選取的規格中
                                                                                                                          <input
                                                                                                                              class="w-100"
                                                                                                                              style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px 9px 18px;"
                                                                                                                              placeholder="請輸入金額"
                                                                                                                              onchange="${gvc.event((e) => {
                                                                                                inputTemp = e.value;
                                                                                            })}"
                                                                                                                          />
                                                                                                                      </div>
                                                                                                                      <div
                                                                                                                          class="w-100 justify-content-end d-flex"
                                                                                                                          style="padding-right: 20px;gap: 14px;"
                                                                                                                      >
                                                                                                                          ${BgWidget.cancel(gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            }))}
                                                                                                                          ${BgWidget.save(gvc.event(() => {
                                                                                                saveQueue('sale_price', inputTemp);
                                                                                            }))}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                              `;
                                                                                        }
                                                                                        case 'stock': {
                                                                                            inputTemp = 0;
                                                                                            return html ` <div
                                                                                                                  style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯存貨數量
                                                                                                                  </div>
                                                                                                                  <div
                                                                                                                      class="w-100 d-flex flex-column"
                                                                                                                      style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                  >
                                                                                                                      將存貨數量套用到所有選取的規格中
                                                                                                                      <input
                                                                                                                          class="w-100"
                                                                                                                          style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px 9px 18px;"
                                                                                                                          placeholder="請輸入數量"
                                                                                                                          onchange="${gvc.event((e) => {
                                                                                                inputTemp = e.value;
                                                                                            })}"
                                                                                                                      />
                                                                                                                  </div>
                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            }))}
                                                                                                                      ${BgWidget.save(gvc.event((e) => {
                                                                                                saveQueue('stock', inputTemp);
                                                                                            }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                        }
                                                                                        case 'volume': {
                                                                                            inputTemp = {
                                                                                                v_height: 0,
                                                                                                v_length: 0,
                                                                                                v_width: 0,
                                                                                            };
                                                                                            return html ` <div
                                                                                                                  style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;cursor: pointer;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯販售價格
                                                                                                                  </div>
                                                                                                                  <div
                                                                                                                      class="w-100 d-flex flex-column"
                                                                                                                      style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                  >
                                                                                                                      將商品材積套用到所有選取的規格中
                                                                                                                      <div class="row">
                                                                                                                          ${[
                                                                                                {
                                                                                                    title: '長度',
                                                                                                    value: 'v_length',
                                                                                                    unit: '公分',
                                                                                                },
                                                                                                {
                                                                                                    title: '寬度',
                                                                                                    value: 'v_width',
                                                                                                    unit: '公分',
                                                                                                },
                                                                                                {
                                                                                                    title: '高度',
                                                                                                    value: 'v_height',
                                                                                                    unit: '公分',
                                                                                                },
                                                                                            ]
                                                                                                .map((dd) => {
                                                                                                return html ` <div
                                                                                                                                      style="display: flex;justify-content: center;align-items: center;gap: 10px;position: relative;"
                                                                                                                                      class=" col-12 col-sm-4 mb-2"
                                                                                                                                  >
                                                                                                                                      <div style="white-space: nowrap;">${dd.title}</div>
                                                                                                                                      <input
                                                                                                                                          class="ps-3"
                                                                                                                                          style="border-radius: 10px;border: 1px solid #DDD;height: 40px;width: calc(100% - 50px);"
                                                                                                                                          type="number"
                                                                                                                                          onchange="${gvc.event((e) => {
                                                                                                    inputTemp[dd.value] = e.value;
                                                                                                })}"
                                                                                                                                          value="${inputTemp[dd.value]}"
                                                                                                                                      />
                                                                                                                                      <div
                                                                                                                                          style="color: #8D8D8D;position: absolute;right: 25px;top: 7px;"
                                                                                                                                      >
                                                                                                                                          ${dd.unit}
                                                                                                                                      </div>
                                                                                                                                  </div>`;
                                                                                            })
                                                                                                .join('')}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            }))}
                                                                                                                      ${BgWidget.save(gvc.event(() => {
                                                                                                saveQueue('volume', inputTemp);
                                                                                            }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                        }
                                                                                        case 'weight': {
                                                                                            inputTemp = 0;
                                                                                            return html ` <div
                                                                                                                  style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯商品重量
                                                                                                                  </div>
                                                                                                                  <div
                                                                                                                      class="w-100 d-flex flex-column"
                                                                                                                      style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                                  >
                                                                                                                      將商品重量套用到所有選取的規格中
                                                                                                                      <div class="w-100 row m-0" style="color:#393939;">
                                                                                                                          <input
                                                                                                                              class="col-6"
                                                                                                                              style="display: flex;height: 40px;padding: 10px 18px;align-items: center;gap: 10px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                                              placeholder="請輸入商品重量"
                                                                                                                              onchange="${gvc.event((e) => {
                                                                                                inputTemp = e.value;
                                                                                            })}"
                                                                                                                          />
                                                                                                                          <div class="col-6" style="display: flex;align-items: center;gap: 10px;">
                                                                                                                              <div class="" style="white-space: nowrap;">單位</div>
                                                                                                                              <select
                                                                                                                                  class="form-select d-flex align-items-center flex-fill"
                                                                                                                                  style="border-radius: 10px;border: 1px solid #DDD;padding-left: 18px;"
                                                                                                                              >
                                                                                                                                  <option value="kg">公斤</option>
                                                                                                                              </select>
                                                                                                                          </div>
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            }))}
                                                                                                                      ${BgWidget.save(gvc.event((e) => {
                                                                                                saveQueue('weight', inputTemp);
                                                                                            }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                        }
                                                                                        case 'sku': {
                                                                                            inputTemp = 0;
                                                                                            return html ` <div
                                                                                                                  style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF; max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯存貨單位(SKU)
                                                                                                                  </div>
                                                                                                                  <div
                                                                                                                      class="w-100 d-flex flex-column"
                                                                                                                      style="margin-bottom:18px;padding: 0px 20px;gap:18px;color:#393939;"
                                                                                                                  >
                                                                                                                      ${(() => {
                                                                                                let editArray = [];
                                                                                                let arrayHTML = ``;
                                                                                                postMD.specs[0].option.map((option) => {
                                                                                                    option.sortQueue.map((data) => {
                                                                                                        var _a;
                                                                                                        if (data.select) {
                                                                                                            let name = data.spec.slice(1).join('/');
                                                                                                            arrayHTML += html `
                                                                                                                                          <div
                                                                                                                                              style="display: flex;padding: 0px 20px;align-items: center;align-self: stretch;width:100%"
                                                                                                                                          >
                                                                                                                                              <div style="width: 40%;">${name}</div>
                                                                                                                                              <input
                                                                                                                                                  value="${(_a = data.sku) !== null && _a !== void 0 ? _a : ''}"
                                                                                                                                                  style="height:22px;border-radius: 10px;border: 1px solid #DDD;width:60%;padding: 18px;"
                                                                                                                                                  placeholder="請輸入存貨單位"
                                                                                                                                                  onchange="${gvc.event((e) => {
                                                                                                                data.sku = e.value;
                                                                                                            })}"
                                                                                                                                              />
                                                                                                                                          </div>
                                                                                                                                      `;
                                                                                                        }
                                                                                                    });
                                                                                                });
                                                                                                return arrayHTML;
                                                                                            })()}
                                                                                                                  </div>
                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            }))}
                                                                                                                      ${BgWidget.save(gvc.event((e) => {
                                                                                                saveQueue('weight', inputTemp);
                                                                                            }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                        }
                                                                                        case 'delete': {
                                                                                            return html ` <div
                                                                                                                  style="cursor: pointer;position:relative;display: flex;width: 432px;height: 255px;border-radius: 10px;background: #FFF;background: #FFF;align-items: center;justify-content: center;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="display: inline-flex;flex-direction: column;align-items: center;gap: 24px;"
                                                                                                                  >
                                                                                                                      <svg
                                                                                                                          xmlns="http://www.w3.org/2000/svg"
                                                                                                                          width="76"
                                                                                                                          height="75"
                                                                                                                          viewBox="0 0 76 75"
                                                                                                                          fill="none"
                                                                                                                      >
                                                                                                                          <g clip-path="url(#clip0_8482_116881)">
                                                                                                                              <path
                                                                                                                                  d="M38 7.03125C46.0808 7.03125 53.8307 10.2413 59.5447 15.9553C65.2587 21.6693 68.4688 29.4192 68.4688 37.5C68.4688 45.5808 65.2587 53.3307 59.5447 59.0447C53.8307 64.7587 46.0808 67.9688 38 67.9688C29.9192 67.9688 22.1693 64.7587 16.4553 59.0447C10.7413 53.3307 7.53125 45.5808 7.53125 37.5C7.53125 29.4192 10.7413 21.6693 16.4553 15.9553C22.1693 10.2413 29.9192 7.03125 38 7.03125ZM38 75C47.9456 75 57.4839 71.0491 64.5165 64.0165C71.5491 56.9839 75.5 47.4456 75.5 37.5C75.5 27.5544 71.5491 18.0161 64.5165 10.9835C57.4839 3.95088 47.9456 0 38 0C28.0544 0 18.5161 3.95088 11.4835 10.9835C4.45088 18.0161 0.5 27.5544 0.5 37.5C0.5 47.4456 4.45088 56.9839 11.4835 64.0165C18.5161 71.0491 28.0544 75 38 75ZM38 18.75C36.0518 18.75 34.4844 20.3174 34.4844 22.2656V38.6719C34.4844 40.6201 36.0518 42.1875 38 42.1875C39.9482 42.1875 41.5156 40.6201 41.5156 38.6719V22.2656C41.5156 20.3174 39.9482 18.75 38 18.75ZM42.6875 51.5625C42.6875 50.3193 42.1936 49.127 41.3146 48.2479C40.4355 47.3689 39.2432 46.875 38 46.875C36.7568 46.875 35.5645 47.3689 34.6854 48.2479C33.8064 49.127 33.3125 50.3193 33.3125 51.5625C33.3125 52.8057 33.8064 53.998 34.6854 54.8771C35.5645 55.7561 36.7568 56.25 38 56.25C39.2432 56.25 40.4355 55.7561 41.3146 54.8771C42.1936 53.998 42.6875 52.8057 42.6875 51.5625Z"
                                                                                                                                  fill="#393939"
                                                                                                                              />
                                                                                                                          </g>
                                                                                                                          <defs>
                                                                                                                              <clipPath id="clip0_8482_116881">
                                                                                                                                  <rect
                                                                                                                                      width="75"
                                                                                                                                      height="75"
                                                                                                                                      fill="white"
                                                                                                                                      transform="translate(0.5)"
                                                                                                                                  />
                                                                                                                              </clipPath>
                                                                                                                          </defs>
                                                                                                                      </svg>
                                                                                                                      <div
                                                                                                                          style="color: #393939;text-align: center;font-size: 16px;font-weight: 400;line-height: 160%;"
                                                                                                                      >
                                                                                                                          確定要刪除這個商品規格嗎？此操作將無法復原
                                                                                                                      </div>
                                                                                                                      <div
                                                                                                                          class="w-100 justify-content-center d-flex"
                                                                                                                          style="padding-right: 20px;gap: 14px;"
                                                                                                                      >
                                                                                                                          ${BgWidget.cancel(gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            }))}
                                                                                                                          ${BgWidget.save(gvc.event(() => {
                                                                                                postMD.specs[0].option.map((option) => {
                                                                                                    option.sortQueue = option.sortQueue.filter((data) => !data.select);
                                                                                                });
                                                                                                saveQueue('delete', '');
                                                                                            }))}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                                  <svg
                                                                                                                      xmlns="http://www.w3.org/2000/svg"
                                                                                                                      width="14"
                                                                                                                      height="14"
                                                                                                                      viewBox="0 0 14 14"
                                                                                                                      fill="none"
                                                                                                                      style="position: absolute;top:12px;right:12px;"
                                                                                                                      onclick="${gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            })}"
                                                                                                                  >
                                                                                                                      <path d="M1 1L13 13" stroke="#393939" stroke-linecap="round" />
                                                                                                                      <path d="M13 1L1 13" stroke="#393939" stroke-linecap="round" />
                                                                                                                  </svg>
                                                                                                              </div>`;
                                                                                        }
                                                                                        case 'shipment_type': {
                                                                                            inputTemp = 'volume';
                                                                                            let windowsid = gvc.glitter.getUUID();
                                                                                            return html ` <div
                                                                                                                  style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;font-size: 16px;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      更改運費計算方式
                                                                                                                  </div>
                                                                                                                  ${gvc.bindView({
                                                                                                bind: windowsid,
                                                                                                view: () => {
                                                                                                    return html `
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                        inputTemp = 'volume';
                                                                                                        gvc.notifyDataChange(windowsid);
                                                                                                    })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'volume'
                                                                                                        ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                        : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  依材積計算
                                                                                                                              </div>
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                        inputTemp = 'weight';
                                                                                                        gvc.notifyDataChange(windowsid);
                                                                                                    })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'weight'
                                                                                                        ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                        : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  依重量計算
                                                                                                                              </div>
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                        inputTemp = 'none';
                                                                                                        gvc.notifyDataChange(windowsid);
                                                                                                    })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'none'
                                                                                                        ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                        : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  不計算
                                                                                                                              </div>
                                                                                                                          `;
                                                                                                },
                                                                                                divCreate: {
                                                                                                    class: `w-100 d-flex flex-column`,
                                                                                                    style: `padding: 0px 20px;gap:8px;color:#393939;`,
                                                                                                },
                                                                                            })}

                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            }))}
                                                                                                                      ${BgWidget.save(gvc.event(() => {
                                                                                                saveQueue('shipment_type', inputTemp);
                                                                                            }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                        }
                                                                                        case 'trace_stock_type': {
                                                                                            inputTemp = 'volume';
                                                                                            let windowsid = gvc.glitter.getUUID();
                                                                                            return html ` <div
                                                                                                                  style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;font-size: 16px;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯庫存政策
                                                                                                                  </div>

                                                                                                                  ${gvc.bindView({
                                                                                                bind: windowsid,
                                                                                                view: () => {
                                                                                                    return html `
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                        inputTemp = 'product';
                                                                                                        gvc.notifyDataChange(windowsid);
                                                                                                    })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'product'
                                                                                                        ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                        : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  不追蹤庫存
                                                                                                                              </div>
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                        inputTemp = 'store';
                                                                                                        gvc.notifyDataChange(windowsid);
                                                                                                    })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'store'
                                                                                                        ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                        : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  追蹤商品庫存
                                                                                                                              </div>
                                                                                                                              <div
                                                                                                                                  class="d-flex align-items-center"
                                                                                                                                  style="gap:6px;cursor: pointer;"
                                                                                                                                  onclick="${gvc.event(() => {
                                                                                                        inputTemp = 'none';
                                                                                                        gvc.notifyDataChange(windowsid);
                                                                                                    })}"
                                                                                                                              >
                                                                                                                                  ${inputTemp == 'none'
                                                                                                        ? `<div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                                                        : `<div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                                                                                                  追蹤門市庫存
                                                                                                                              </div>
                                                                                                                          `;
                                                                                                },
                                                                                                divCreate: {
                                                                                                    class: `w-100 d-flex flex-column`,
                                                                                                    style: `padding: 0px 20px;gap:8px;color:#393939;`,
                                                                                                },
                                                                                            })}

                                                                                                                  <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;gap: 14px;">
                                                                                                                      ${BgWidget.cancel(gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            }))}
                                                                                                                      ${BgWidget.save(gvc.event(() => {
                                                                                                saveQueue('trace_stock_type', inputTemp);
                                                                                            }))}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                        }
                                                                                    }
                                                                                    return html ` <div
                                                                                                          style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;"
                                                                                                      >
                                                                                                          <div
                                                                                                              style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                          >
                                                                                                              編輯販售價格
                                                                                                          </div>
                                                                                                          <div
                                                                                                              class="w-100 d-flex flex-column"
                                                                                                              style="margin-bottom:18px;padding: 0px 20px;gap:8px;color:#393939;"
                                                                                                          >
                                                                                                              將價格套用到所有選取的規格中
                                                                                                              <input
                                                                                                                  class="w-100"
                                                                                                                  style="border-radius: 10px;border: 1px solid #DDD;padding: 9px 18px 9px 18px;"
                                                                                                                  placeholder="請輸入金額"
                                                                                                              />
                                                                                                          </div>
                                                                                                          <div class="w-100 justify-content-end d-flex" style="padding-right: 20px;">
                                                                                                              ${BgWidget.cancel(gvc.event(() => {
                                                                                        gvc.glitter.closeDiaLog();
                                                                                    }))}
                                                                                                              ${BgWidget.save(gvc.event(() => {
                                                                                        console.log('將價格套用到所有選取的規格中 的儲存');
                                                                                    }))}
                                                                                                          </div>
                                                                                                      </div>`;
                                                                                }
                                                                                return html `
                                                                                                      <div
                                                                                                          style="display: flex;height: 40px;padding: 8px 17px 8px 18px;align-items: center;justify-content: space-between;gap: 4px;align-self: stretch;border-radius: 10px;background: #F7F7F7;"
                                                                                                      >
                                                                                                          已選取${selected.length} 項
                                                                                                          <div
                                                                                                              style="position: relative"
                                                                                                              onclick="${gvc.event(() => {
                                                                                    selectFunRow = !selectFunRow;
                                                                                    gvc.notifyDataChange('selectFunRow');
                                                                                })}"
                                                                                                          >
                                                                                                              <svg
                                                                                                                  style="cursor: pointer;"
                                                                                                                  width="19"
                                                                                                                  height="20"
                                                                                                                  viewBox="0 0 19 20"
                                                                                                                  fill="none"
                                                                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                                                              >
                                                                                                                  <rect x="0.5" y="8" width="4" height="4" rx="2" fill="#393939" />
                                                                                                                  <rect x="7.5" y="8" width="4" height="4" rx="2" fill="#393939" />
                                                                                                                  <rect x="14.5" y="8" width="4" height="4" rx="2" fill="#393939" />
                                                                                                              </svg>
                                                                                                              ${selectFunRow
                                                                                    ? html `
                                                                                                                        <div
                                                                                                                            style="cursor: pointer;z-index:2;width:200px;gap:16px;color: #393939;font-size: 16px;font-weight: 400;position: absolute;right:-17px;top: calc(100% + 23px);display: flex;padding: 24px 24px 42px 24px;flex-direction: column;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);"
                                                                                                                        >
                                                                                                                            <div
                                                                                                                                onclick="${gvc.event(() => {
                                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                                            return editDialog('price');
                                                                                        }, 'edit');
                                                                                    })}"
                                                                                                                            >
                                                                                                                                編輯販售價格
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                                            return editDialog('stock');
                                                                                        }, '');
                                                                                    })}"
                                                                                                                            >
                                                                                                                                編輯存貨數量
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                                            return editDialog('trace_stock_type');
                                                                                        }, 'trace_stock_type');
                                                                                    })}"
                                                                                                                            >
                                                                                                                                編輯庫存政策
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                                            return editDialog('shipment_type');
                                                                                        }, 'shipment_type');
                                                                                    })}"
                                                                                                                            >
                                                                                                                                運費計算方式
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                                            return editDialog('volume');
                                                                                        }, 'volume');
                                                                                    })}"
                                                                                                                            >
                                                                                                                                編輯商品材積
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                                            return editDialog('weight');
                                                                                        }, 'weight');
                                                                                    })}"
                                                                                                                            >
                                                                                                                                編輯商品重量
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                class="d-none"
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                                            return editDialog('sku');
                                                                                        }, 'sku');
                                                                                    })}"
                                                                                                                            >
                                                                                                                                編輯存貨單位(SKU)
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                class="d-none"
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                        gvc.glitter.innerDialog((gvc) => {
                                                                                            return editDialog('delete');
                                                                                        }, 'delete');
                                                                                    })}"
                                                                                                                            >
                                                                                                                                刪除規格
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    `
                                                                                    : ``}
                                                                                                          </div>
                                                                                                      </div>
                                                                                                  `;
                                                                            }
                                                                            return html `
                                                                                                  <div
                                                                                                      style="border-radius: 10px;border: 1px solid #DDD;width: 100%;display: flex;height: 40px;padding: 8px 0px 8px 18px;align-items: center;"
                                                                                                  >
                                                                                                      <i
                                                                                                          class="${selected.length ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                                          style="width: 16px;height: 16px;margin-left:2px;margin-right:18px;cursor: pointer;
color: ${selected.length ? `#393939` : `#DDD`};font-size: 18px;
"
                                                                                                          onclick="${gvc.event(() => {
                                                                                postMD.variants.map((dd) => {
                                                                                    dd.checked = !selected.length;
                                                                                });
                                                                                gvc.notifyDataChange([variantsViewID]);
                                                                            })}"
                                                                                                      ></i>
                                                                                                      <div style="flex:1 0 0;font-size: 16px;font-weight: 400;">規格</div>
                                                                                                      ${document.body.clientWidth < 800
                                                                                ? html ` <div style="color:#393939;font-size: 16px;font-weight: 400;" class="me-3">
                                                                                                                販售價格*
                                                                                                            </div>`
                                                                                : `${['販售價格*', '存貨數量*', '運費計算方式']
                                                                                    .map((dd) => {
                                                                                    return html ` <div
                                                                                                                        style="color:#393939;font-size: 16px;font-weight: 400;width: 20%; "
                                                                                                                    >
                                                                                                                        ${dd}
                                                                                                                    </div>`;
                                                                                })
                                                                                    .join('')}`}
                                                                                                  </div>
                                                                                              `;
                                                                        },
                                                                        divCreate: { style: `` },
                                                                    }),
                                                                    gvc.bindView(() => {
                                                                        const vm = {
                                                                            id: gvc.glitter.getUUID(),
                                                                        };
                                                                        return {
                                                                            bind: vm.id,
                                                                            view: () => {
                                                                                return postMD.specs[0].option
                                                                                    .map((spec) => {
                                                                                    var _a;
                                                                                    const viewList = [];
                                                                                    spec.expand = (_a = spec.expand) !== null && _a !== void 0 ? _a : true;
                                                                                    if (postMD.specs.length > 1) {
                                                                                        let isCheck = !postMD.variants
                                                                                            .filter((dd) => {
                                                                                            return dd.spec[0] === spec.title;
                                                                                        })
                                                                                            .find((dd) => {
                                                                                            return !dd.checked;
                                                                                        });
                                                                                        viewList.push(html ` <div
                                                                                                                  style="display: flex;padding: 8px 0px;align-items: center;border-radius: 10px;background: #FFF;width:100%;"
                                                                                                              >
                                                                                                                  <i
                                                                                                                      class="${isCheck ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                                                      style="width: 16px;height: 16px;margin-left:19px;margin-right:18px;cursor: pointer;
color: ${isCheck ? `#393939` : `#DDD`};font-size: 18px;
"
                                                                                                                      onclick="${gvc.event(() => {
                                                                                            postMD.variants
                                                                                                .filter((dd) => {
                                                                                                return dd.spec[0] === spec.title;
                                                                                            })
                                                                                                .map((dd) => {
                                                                                                dd.checked = !isCheck;
                                                                                            });
                                                                                            gvc.notifyDataChange([vm.id, 'selectFunRow']);
                                                                                        })}"
                                                                                                                  ></i>
                                                                                                                  <div
                                                                                                                      style="flex:1 0 0;font-size: 16px;font-weight: 400;gap:${document.body
                                                                                            .clientWidth < 800
                                                                                            ? 10
                                                                                            : 24}px;display: flex;"
                                                                                                                  >
                                                                                                                      <div
                                                                                                                          style="background:50%/cover url('${getPreviewImage(postMD.variants.filter((dd) => {
                                                                                            return dd.spec[0] === spec.title;
                                                                                        })[0].preview_image)}');height: 60px;width: 60px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                                      ></div>
                                                                                                                      <div
                                                                                                                          style="display: flex;align-items: center;gap: 8px;cursor: pointer;white-space: nowrap;"
                                                                                                                          onclick="${gvc.event(() => {
                                                                                            spec.expand = !spec.expand;
                                                                                            gvc.notifyDataChange(vm.id);
                                                                                        })}"
                                                                                                                      >
                                                                                                                          ${spec.title}
                                                                                                                          ${spec.expand
                                                                                            ? html `<i class="fa-regular fa-chevron-up"></i>`
                                                                                            : html `<i class="fa-regular fa-chevron-down"></i>`}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                                  ${[
                                                                                            {
                                                                                                title: '統一設定價格',
                                                                                                key: 'sale_price',
                                                                                            },
                                                                                            {
                                                                                                title: '統一設定存貨',
                                                                                                key: 'stock',
                                                                                            },
                                                                                        ]
                                                                                            .filter((dd) => {
                                                                                            return dd.key === 'sale_price' || document.body.clientWidth > 800;
                                                                                        })
                                                                                            .map((dd) => {
                                                                                            let minPrice = Infinity;
                                                                                            let maxPrice = 0;
                                                                                            let stock = 0;
                                                                                            postMD.variants
                                                                                                .filter((dd) => {
                                                                                                return dd.spec[0] === spec.title;
                                                                                            })
                                                                                                .map((d1) => {
                                                                                                minPrice = Math.min(d1.sale_price, minPrice);
                                                                                                maxPrice = Math.max(d1.sale_price, maxPrice);
                                                                                                stock = stock + parseInt(d1.stock, 10);
                                                                                            });
                                                                                            if (dd.key == 'sale_price') {
                                                                                                dd.title = `${minPrice} ~ ${maxPrice}`;
                                                                                            }
                                                                                            else {
                                                                                                dd.title = `${stock}`;
                                                                                            }
                                                                                            return html ` <div
                                                                                                                              style="color:#393939;font-size: 16px;font-weight: 400;width:  ${document
                                                                                                .body.clientWidth > 800
                                                                                                ? `20%;`
                                                                                                : 'auto;max-width:140px;'}padding-right: ${document.body.clientWidth >
                                                                                                800
                                                                                                ? `10px`
                                                                                                : '0px'};"
                                                                                                                          >
                                                                                                                              <input
                                                                                                                                  style="height: 40px;width:100%;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;font-size: 13px;"
                                                                                                                                  placeholder="${dd.title}"
                                                                                                                                  type="number"
                                                                                                                                  min="0"
                                                                                                                                  onchange="${gvc.event((e) => {
                                                                                                postMD.variants
                                                                                                    .filter((dd) => {
                                                                                                    return dd.spec[0] === spec.title;
                                                                                                })
                                                                                                    .map((d1) => {
                                                                                                    d1[dd.key] = e.value;
                                                                                                });
                                                                                                gvc.notifyDataChange(vm.id);
                                                                                            })}"
                                                                                                                              />
                                                                                                                          </div>`;
                                                                                        })
                                                                                            .join('')}
                                                                                                                  <div
                                                                                                                      class="d-none d-sm-block"
                                                                                                                      style="color:#393939;font-size: 16px;font-weight: 400;width: 20%;"
                                                                                                                  >
                                                                                                                      <select
                                                                                                                          class="form-select"
                                                                                                                          style="height: 40px;width: 100%;padding: 0 18px;border-radius: 10px;"
                                                                                                                          onchange="${gvc.event((e) => {
                                                                                            postMD.variants
                                                                                                .filter((dd) => {
                                                                                                return dd.spec[0] === spec.title;
                                                                                            })
                                                                                                .map((dd) => {
                                                                                                dd.shipment_type = e.value;
                                                                                            });
                                                                                            gvc.notifyDataChange(vm.id);
                                                                                        })}"
                                                                                                                      >
                                                                                                                          <option class="d-none">統一設定</option>
                                                                                                                          <option value="none">無運費</option>
                                                                                                                          <option value="volume">依材積</option>
                                                                                                                          <option value="weight">依重量</option>
                                                                                                                      </select>
                                                                                                                  </div>
                                                                                                              </div>`);
                                                                                    }
                                                                                    if (spec.expand || postMD.specs.length === 1) {
                                                                                        viewList.push(postMD.variants
                                                                                            .filter((dd) => {
                                                                                            return dd.spec[0] === spec.title;
                                                                                        })
                                                                                            .map((data, index) => {
                                                                                            const viewID = gvc.glitter.getUUID();
                                                                                            return gvc.bindView({
                                                                                                bind: viewID,
                                                                                                view: () => {
                                                                                                    return html `
                                                                                                                                      <div
                                                                                                                                          style="background-color: white;position:relative;display: flex;padding: 8px 0px;align-items: center;border-radius: 10px;width:100%;"
                                                                                                                                      >
                                                                                                                                          <div
                                                                                                                                              style="flex:1 0 0;font-size: 16px;font-weight: 400;gap:14px;display: flex;align-items: center;padding-left: ${postMD
                                                                                                        .specs.length > 1 && document.body.clientWidth > 800
                                                                                                        ? `32px`
                                                                                                        : `12px`};"
                                                                                                                                              onclick="${gvc.event(() => {
                                                                                                        postMD.variants.map((dd) => {
                                                                                                            dd.editable = false;
                                                                                                        });
                                                                                                        data.editable = true;
                                                                                                        obj.vm.type = 'editSpec';
                                                                                                    })}"
                                                                                                                                          >
                                                                                                                                              <i
                                                                                                                                                  class="${data.checked
                                                                                                        ? `fa-solid fa-square-check`
                                                                                                        : `fa-regular fa-square`}"
                                                                                                                                                  style="width: 16px;height: 16px;margin-left:19px;margin-right:0px;cursor: pointer;
color: ${data.checked ? `#393939` : `#DDD`};font-size: 18px;"
                                                                                                                                                  onclick="${gvc.event((e, event) => {
                                                                                                        data.checked = !data.checked;
                                                                                                        event.stopPropagation();
                                                                                                        gvc.notifyDataChange([vm.id, 'selectFunRow']);
                                                                                                    })}"
                                                                                                                                              ></i>
                                                                                                                                              <div
                                                                                                                                                  style="background:50%/cover url('${getPreviewImage(data.preview_image)}');height: 50px;width: 50px;border-radius: 10px;border: 1px solid #DDD;"
                                                                                                                                              ></div>
                                                                                                                                              <div style="cursor: pointer;" class="hover-underline">
                                                                                                                                                  ${data.spec.join(' / ')}
                                                                                                                                              </div>
                                                                                                                                          </div>
                                                                                                                                          ${['sale_price', 'stock']
                                                                                                        .filter((dd) => {
                                                                                                        return (dd === 'sale_price' ||
                                                                                                            document.body.clientWidth > 800);
                                                                                                    })
                                                                                                        .map((dd) => {
                                                                                                        var _a;
                                                                                                        return html ` <div
                                                                                                                                                      style="color:#393939;font-size: 16px;font-weight: 400;width:   ${document
                                                                                                            .body.clientWidth > 800
                                                                                                            ? `20%;`
                                                                                                            : 'auto;max-width:140px;'}padding-right: ${document
                                                                                                            .body.clientWidth > 800
                                                                                                            ? `12px`
                                                                                                            : '0px'};"
                                                                                                                                                  >
                                                                                                                                                      <input
                                                                                                                                                          style="width: 100%;height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                                                                                          value="${(_a = data[dd]) !== null && _a !== void 0 ? _a : 0}"
                                                                                                                                                          min="0"
                                                                                                                                                          onchange="${gvc.event((e) => {
                                                                                                            data[dd] = e.value;
                                                                                                            gvc.notifyDataChange(vm.id);
                                                                                                        })}"
                                                                                                                                                      />
                                                                                                                                                  </div>`;
                                                                                                    })
                                                                                                        .join('')}
                                                                                                                                          <div
                                                                                                                                              class="d-none d-sm-block"
                                                                                                                                              style="color:#393939;font-size: 16px;font-weight: 400;width: 20%;"
                                                                                                                                          >
                                                                                                                                              <select
                                                                                                                                                  class="form-select"
                                                                                                                                                  style="height: 40px;width: 100%;padding: 0 18px;border-radius: 10px;"
                                                                                                                                                  onchange="${gvc.event((e) => {
                                                                                                        data.shipment_type = e.value;
                                                                                                    })}"
                                                                                                                                              >
                                                                                                                                                  <option
                                                                                                                                                      value="none"
                                                                                                                                                      ${data.shipment_type == 'none' ? `selected` : ``}
                                                                                                                                                  >
                                                                                                                                                      無運費
                                                                                                                                                  </option>
                                                                                                                                                  <option
                                                                                                                                                      value="volume"
                                                                                                                                                      ${data.shipment_type == 'volume'
                                                                                                        ? `selected`
                                                                                                        : ``}
                                                                                                                                                  >
                                                                                                                                                      依材積
                                                                                                                                                  </option>
                                                                                                                                                  <option
                                                                                                                                                      value="weight"
                                                                                                                                                      ${data.shipment_type == 'weight'
                                                                                                        ? `selected`
                                                                                                        : ``}
                                                                                                                                                  >
                                                                                                                                                      依重量
                                                                                                                                                  </option>
                                                                                                                                              </select>
                                                                                                                                          </div>
                                                                                                                                      </div>
                                                                                                                                  `;
                                                                                                },
                                                                                                divCreate: {
                                                                                                    class: `w-100 ${viewID} ${index === 0 && postMD.specs.length > 1 ? `border-top` : ``}`,
                                                                                                },
                                                                                            });
                                                                                        })
                                                                                            .join('<div class="border-bottom my-1 w-100"></div>'));
                                                                                    }
                                                                                    return viewList.join('');
                                                                                })
                                                                                    .join('<div class="border-bottom mx-n2 my-1 w-100"></div>');
                                                                            },
                                                                            divCreate: {},
                                                                        };
                                                                    }),
                                                                ].join('');
                                                            }
                                                            catch (e) {
                                                                return `${e}`;
                                                            }
                                                        },
                                                        divCreate: {},
                                                    });
                                                },
                                                divCreate: {
                                                    class: '',
                                                    style: 'overflow: auto',
                                                },
                                            };
                                        })),
                                BgWidget.mainCardMbp0(obj.gvc.bindView(() => {
                                    var _a;
                                    postMD.seo = (_a = postMD.seo) !== null && _a !== void 0 ? _a : {
                                        title: '',
                                        content: '',
                                    };
                                    const id = seoID;
                                    let toggle = false;
                                    return {
                                        bind: id,
                                        view: () => {
                                            var _a, _b, _c;
                                            try {
                                                const href = `https://${window.parent.glitter.share.editorViewModel.domain}/products?product_id=${postMD.id}`;
                                                return html ` <div style="font-weight: 700;" class="mb-3">搜尋引擎列表</div>
                                                                    <div class="fs-6 fw-500" style="color:#1a0dab;">${postMD.seo.title || '尚未設定'}</div>
                                                                    <a
                                                                        class="fs-sm fw-500"
                                                                        style="color:#006621;cursor: pointer;"
                                                                        onclick="${gvc.event(() => {
                                                    window.parent.glitter.openNewTab(href);
                                                })}"
                                                                        >${href}</a
                                                                    >
                                                                    <div class="fs-sm fw-500" style="color:#545454;white-space: normal;">${postMD.seo.content || '尚未設定'}</div>
                                                                    <div class="w-100" style="margin: 18px 0 8px;">SEO標題</div>
                                                                    <input
                                                                        value="${(_a = postMD.seo.title) !== null && _a !== void 0 ? _a : ''}"
                                                                        style="width: 100%;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        onchange="${gvc.event((e) => {
                                                    postMD.seo.title = e.value;
                                                    obj.gvc.notifyDataChange(id);
                                                })}"
                                                                    />
                                                                    <div class="w-100" style="margin: 18px 0 8px;">SEO描述</div>
                                                                    <textarea
                                                                        rows="4"
                                                                        value="${(_b = postMD.seo.content) !== null && _b !== void 0 ? _b : ''}"
                                                                        style="width: 100%;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        onchange="${gvc.event((e) => {
                                                    postMD.seo.content = e.value;
                                                    obj.gvc.notifyDataChange(id);
                                                })}"
                                                                    >
${(_c = postMD.seo.content) !== null && _c !== void 0 ? _c : ''}</textarea
                                                                    >`;
                                            }
                                            catch (e) {
                                                console.error(e);
                                                return '';
                                            }
                                        },
                                    };
                                })),
                            ]
                                .filter((str) => str.length > 0)
                                .join(BgWidget.mbContainer(24)), undefined, `width: 73.5%; ${document.body.clientWidth > 768 ? 'padding-top: 0 !important; ' : ''}`)}
                                    ${BgWidget.container(html `<div class="summary-card p-0">
                                            ${[
                                BgWidget.mainCardMbp0(html ` <div style="font-weight: 700;" class="mb-2">商品狀態</div>` +
                                    EditorElem.select({
                                        gvc: obj.gvc,
                                        title: '',
                                        def: postMD.status,
                                        array: [
                                            { title: '啟用', value: 'active' },
                                            { title: '草稿', value: 'draft' },
                                        ],
                                        callback: (text) => {
                                            postMD.status = text;
                                        },
                                    })),
                                BgWidget.mainCardMbp0(gvc.bindView({
                                    bind: 'productType',
                                    view: () => {
                                        var _a;
                                        postMD.productType = (_a = postMD.productType) !== null && _a !== void 0 ? _a : {
                                            product: true,
                                            addProduct: false,
                                            giveaway: false,
                                        };
                                        return ['product', 'addProduct', 'giveaway']
                                            .map((dd, index) => {
                                            return html ` <div
                                                                        class="d-flex align-items-center"
                                                                        style="gap:6px;cursor: pointer;"
                                                                        onclick="${gvc.event(() => {
                                                postMD.productType[dd] = !postMD.productType[dd];
                                                gvc.notifyDataChange('productType');
                                            })}"
                                                                    >
                                                                        ${postMD.productType[dd]
                                                ? html ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                                  <rect width="16" height="16" rx="3" fill="#393939" />
                                                                                  <path d="M4.5 8.5L7 11L11.5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                                              </svg>`
                                                : html ` <div style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;"></div> `}
                                                                        ${['商品', '加購品', '贈品'][index]}
                                                                    </div>`;
                                        })
                                            .join('');
                                    },
                                    divCreate: { class: `d-flex flex-column `, style: 'gap:12px;' },
                                }), ''),
                                BgWidget.mainCardMbp0(obj.gvc.bindView(() => {
                                    const id = obj.gvc.glitter.getUUID();
                                    function refresh() {
                                        obj.gvc.notifyDataChange(id);
                                    }
                                    function selectCollection(callback) {
                                        ApiShop.getCollection().then((res) => {
                                            EditorElem.openEditorDialog(obj.gvc, (gvc) => {
                                                function convertF(x, ind) {
                                                    return x
                                                        .map((dd) => {
                                                        const indt = ind ? `${ind} / ${dd.title}` : dd.title;
                                                        if (dd.array && dd.array.length > 0) {
                                                            return html ` <li class="btn-group d-flex flex-column" style="margin-top:1px;margin-bottom:1px;">
                                                                                            <div
                                                                                                class="editor_item d-flex pe-2 my-0 hi me-n1 "
                                                                                                style=""
                                                                                                onclick="${gvc.event(() => {
                                                                dd.toogle = !dd.toogle;
                                                                gvc.recreateView();
                                                            })}"
                                                                                            >
                                                                                                <div class="subBt ps-0 ms-n2">
                                                                                                    ${dd.toogle
                                                                ? html ` <i class="fa-sharp fa-regular fa-chevron-down"></i>`
                                                                : html ` <i class="fa-regular fa-angle-right hoverBtn "></i>`}
                                                                                                </div>
                                                                                                ${dd.title}
                                                                                                <div class="flex-fill"></div>
                                                                                            </div>
                                                                                            <ul class="ps-2 ${dd.toogle ? `` : `d-none`}">
                                                                                                ${convertF(dd.array, indt)}
                                                                                            </ul>
                                                                                        </li>`;
                                                        }
                                                        else {
                                                            return html ` <li class="btn-group d-flex flex-column" style="margin-top:1px;margin-bottom:1px;">
                                                                                            <div
                                                                                                class="editor_item d-flex   pe-2 my-0 hi  "
                                                                                                style=""
                                                                                                onclick="${gvc.event(() => {
                                                                if (postMD.collection.find((dd) => {
                                                                    return dd === indt;
                                                                })) {
                                                                    alert('已有此標籤。');
                                                                    return;
                                                                }
                                                                callback({
                                                                    select: indt,
                                                                    gvc: gvc,
                                                                });
                                                            })}"
                                                                                            >
                                                                                                ${dd.title}
                                                                                                <div class="flex-fill"></div>

                                                                                                <div class="subBt ">
                                                                                                    <i
                                                                                                        class="fa-duotone fa-check d-flex align-items-center justify-content-center subBt "
                                                                                                        style="width:15px;height:15px;"
                                                                                                    ></i>
                                                                                                </div>
                                                                                            </div>
                                                                                        </li>`;
                                                        }
                                                    })
                                                        .join('');
                                                }
                                                return gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            return convertF(res.response.value, '');
                                                        },
                                                        divCreate: {
                                                            class: `ms-n3 me-1`,
                                                        },
                                                    };
                                                });
                                            }, () => { }, 400, '設定商品分類');
                                        });
                                    }
                                    return {
                                        bind: id,
                                        view: () => {
                                            return [
                                                html ` <div style="font-weight: 700;" class="mb-2">商品分類</div>`,
                                                postMD.collection
                                                    .map((dd, index) => {
                                                    return `<span style="font-size: 14px;">${dd}</span>`;
                                                })
                                                    .join(`<div class="my-1"></div>`),
                                                html ` <div class="w-100 mt-3">
                                                                        ${BgWidget.darkButton(`設定商品分類`, gvc.event(() => {
                                                    BgProduct.collectionsDialog({
                                                        gvc: gvc,
                                                        default: postMD.collection.map((dd) => {
                                                            return dd;
                                                        }),
                                                        callback: (value) => __awaiter(this, void 0, void 0, function* () {
                                                            postMD.collection = value;
                                                            gvc.notifyDataChange(id);
                                                        }),
                                                    });
                                                }), {
                                                    style: 'width:100%;',
                                                })}
                                                                    </div>`,
                                            ].join('');
                                        },
                                        divCreate: {},
                                    };
                                })),
                            ]
                                .filter((str) => str.length > 0)
                                .join(BgWidget.mbContainer(24))}
                                        </div>`, undefined, `width: 26.5%; padding-top: 0 !important;`)}
                                </div>
                            `, 944),
                            html ` <div class="update-bar-container">
                            ${obj.type === 'replace'
                                ? BgWidget.danger(obj.gvc.event(() => {
                                    const dialog = new ShareDialog(obj.gvc.glitter);
                                    dialog.checkYesOrNot({
                                        text: '是否確認刪除商品?',
                                        callback: (response) => {
                                            if (response) {
                                                dialog.dataLoading({ visible: true });
                                                ApiShop.delete({
                                                    id: postMD.id,
                                                }).then((res) => {
                                                    dialog.dataLoading({ visible: false });
                                                    if (res.result) {
                                                        obj.vm.type = 'list';
                                                    }
                                                    else {
                                                        dialog.errorMessage({ text: '刪除失敗' });
                                                    }
                                                });
                                            }
                                        },
                                    });
                                }), '刪除商品')
                                : ''}
                            ${BgWidget.cancel(obj.gvc.event(() => {
                                obj.vm.type = 'list';
                            }))}
                            ${BgWidget.save(obj.gvc.event(() => {
                                setTimeout(() => {
                                    if (postMD.id) {
                                        ShoppingProductSetting.putEvent(postMD, obj.gvc, obj.vm);
                                    }
                                    else {
                                        ShoppingProductSetting.postEvent(postMD, obj.gvc, obj.vm);
                                    }
                                }, 500);
                            }))}
                        </div>`,
                        ].join('');
                    },
                    divCreate: {
                        class: `d-flex`,
                        style: `font-size: 16px;color:#393939;position: relative;padding-bottom:240px;`,
                    },
                };
            });
        });
    }
    static specInput(gvc, temp, cb) {
        const html = String.raw;
        let keyboard = '';
        return html ` <div class="bg-white w-100">
            ${[
            html ` <div class="w-100 " style="display: flex;gap: 8px;flex-direction: column;">
                    <div style="width: 70px">規格種類</div>
                    <input
                        class="w-100"
                        style="height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;"
                        placeholder="例如 : 顏色、大小"
                        value="${temp.title}"
                        onchange="${gvc.event((e) => {
                var _a;
                temp.title = (_a = e === null || e === void 0 ? void 0 : e.value) !== null && _a !== void 0 ? _a : '';
            })}"
                    />
                </div>`,
            gvc.bindView({
                bind: 'specInput',
                view: () => {
                    return html `
                            <div class="w-100" style="margin-top: 8px;">選項 (輸入完請按enter)</div>
                            <div
                                class="w-100 d-flex align-items-center position-relative"
                                style="line-height: 40px;min-height: 40px;padding: 10px 18px;border-radius: 10px;border: 1px solid #DDD;gap: 10px; flex-wrap: wrap;"
                            >
                                <div class="d-flex align-items-center" style="gap: 10px; flex-wrap: wrap;">
                                    ${(() => {
                        const tempHTML = [];
                        temp.option.map((data, index) => {
                            tempHTML.push(html `
                                                    <div
                                                        class="d-flex align-items-center"
                                                        style="height: 22px;border-radius: 5px;background: #F2F2F2;display: flex;padding: 1px 6px;justify-content: center;align-items: center;gap: 4px;"
                                                    >
                                                        ${data.title}<i
                                                            class="fa-solid fa-xmark"
                                                            style="font-size: 12px;cursor: pointer;"
                                                            onclick="${gvc.event(() => {
                                temp.option.splice(index, 1);
                                gvc.notifyDataChange('specInput');
                            })}"
                                                        ></i>
                                                    </div>
                                                `);
                        });
                        tempHTML.push(html `<input
                                            id="keep-enter"
                                            class="flex-fill d-flex align-items-center border-0 specInput h-100"
                                            placeholder="${temp.option.length > 0 ? '請繼續輸入' : ''}"
                                        />`);
                        return tempHTML.join('');
                    })()}
                                </div>
                                <div
                                    class="d-flex align-items-center ${(() => {
                        return temp.option.length > 0 ? 'd-none' : '';
                    })()}"
                                    style="color: #8D8D8D;width: 100%;height:100%;position: absolute;left: 18px;top: 0"
                                    onclick="${gvc.event((e) => {
                        e.classList.add('d-none');
                        setTimeout(() => {
                            document.querySelector('.specInput').focus();
                        }, 100);
                    })}"
                                >
                                    例如 : 黑色、S號
                                </div>
                            </div>
                        `;
                },
                divCreate: {
                    class: 'w-100 bg-white',
                    style: 'display: flex;gap: 8px;flex-direction: column;',
                },
                onCreate: () => {
                    if (keyboard === 'Enter') {
                        const input = document.getElementById('keep-enter');
                        input && input.focus();
                    }
                    document.removeEventListener('keydown', gvc.glitter.share.keyDownEvent);
                    gvc.glitter.share.keyDownEvent = function (event) {
                        const input = document.getElementById('keep-enter');
                        keyboard = event.key;
                        if (input && input.value.length > 0 && event.key === 'Enter') {
                            temp.option.push({
                                title: input.value,
                            });
                            temp.option = temp.option.reduce((acc, current) => {
                                const isTitleExist = acc.find((item) => item.title === current.title);
                                if (!isTitleExist) {
                                    acc.push(current);
                                }
                                return acc;
                            }, []);
                            gvc.notifyDataChange('specInput');
                        }
                    };
                    document.addEventListener('keydown', gvc.glitter.share.keyDownEvent);
                },
            }),
            html ` <div class="d-flex w-100 justify-content-end align-items-center w-100 bg-white" style="gap:14px; margin-top: 12px;">
                    ${BgWidget.cancel(gvc.event(() => {
                cb.cancel();
            }))}
                    ${BgWidget.save(gvc.event(() => {
                cb.save();
            }), '完成')}
                </div>`,
        ].join('')}
        </div>`;
    }
    static putEvent(postMD, gvc, vm) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ text: '商品上傳中...', visible: true });
        postMD.type = 'product';
        ApiShop.putProduct({
            data: postMD,
            token: window.parent.config.token,
        }).then((re) => {
            dialog.dataLoading({ visible: false });
            if (re.result) {
                dialog.successMessage({ text: `更改成功` });
                vm.type = 'list';
            }
            else {
                dialog.errorMessage({ text: `上傳失敗` });
            }
        });
    }
    static postEvent(postMD, gvc, vm) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ text: '商品上傳中...', visible: true });
        postMD.type = 'product';
        ApiShop.postProduct({
            data: postMD,
            token: window.parent.config.token,
        }).then((re) => {
            dialog.dataLoading({ visible: false });
            if (re.result) {
                dialog.successMessage({ text: `上傳成功` });
                vm.type = 'list';
            }
            else {
                dialog.errorMessage({ text: `上傳失敗` });
            }
        });
    }
}
window.glitter.setModule(import.meta.url, ShoppingProductSetting);
