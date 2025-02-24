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
import { ShoppingProductSetting } from "../shopping-product-setting.js";
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
                }, () => {
                });
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
    importData(notifyId, file, product_category) {
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
                try {
                    const arrayBuffer = e.target.result;
                    const workbook = new this.ExcelJS.Workbook();
                    yield workbook.xlsx.load(arrayBuffer);
                    const worksheet = workbook.getWorksheet(1);
                    const data = [];
                    let id_list = [];
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
                    if (data[0][0] === "商品ID") {
                        data.map((dd, index) => {
                            id_list.push(dd[0]);
                            data[index] = dd.filter((d1, index) => {
                                return index > 0;
                            });
                        });
                    }
                    id_list = id_list.filter((item) => {
                        return !['商品ID', ''].includes(item);
                    });
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
                                text, callback: () => {
                                }
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
                                    const regex = /[\s\/\\]+/g;
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
                                    if (data[index + 1] && (!data[index + 1][1])) {
                                        let ind_ = index + 1;
                                        while (data[ind_] && (!data[ind_][1])) {
                                            const row_data = data[ind_];
                                            const spec_title = this.checkString(row_data[8]);
                                            const spec_value = this.checkString(row_data[9]);
                                            if (!productData.specs.find((dd) => {
                                                return dd.title === spec_title;
                                            })) {
                                                productData.specs.push({
                                                    language_title: {},
                                                    title: spec_title,
                                                    option: []
                                                });
                                            }
                                            productData.specs.find((dd) => {
                                                return dd.title === spec_title;
                                            }).option.push({
                                                "title": spec_value,
                                                "price": parseInt(this.checkNumber(row_data[10]), 10),
                                                "stock": this.checkNumber(row_data[18]),
                                                "language_title": {}
                                            });
                                            ind_++;
                                        }
                                        const shipmentTypeMap = {
                                            依重量計算: 'weight',
                                            依材積計算: 'volume',
                                        };
                                        productData.shipment_type = shipmentTypeMap[row[11]] || 'none';
                                        productData.v_length = this.checkNumber(row[12]);
                                        productData.v_width = this.checkNumber(row[13]);
                                        productData.v_height = this.checkNumber(row[14]);
                                        productData.weight = this.checkNumber(row[15]);
                                        function updateVariants() {
                                            productData.specs = productData.specs.filter((dd) => {
                                                return dd.option && dd.option.length;
                                            });
                                            const specs = {};
                                            function getCombinations(specs) {
                                                const keys = Object.keys(specs);
                                                const result = [];
                                                function combine(index, current) {
                                                    if (index === keys.length) {
                                                        result.push(Object.assign({}, current));
                                                        return;
                                                    }
                                                    const key = keys[index];
                                                    for (const value of specs[key]) {
                                                        current[key] = value;
                                                        combine(index + 1, current);
                                                    }
                                                }
                                                combine(0, {});
                                                return result;
                                            }
                                            productData.specs.map((dd) => {
                                                specs[dd.title] = dd.option.map((d1) => {
                                                    return d1.title;
                                                });
                                            });
                                            const combinations = getCombinations(specs);
                                            combinations.map((d1) => {
                                                const spec = productData.specs.map((dd) => {
                                                    return d1[dd.title];
                                                });
                                                if (!productData.variants.find((d2) => {
                                                    return d2.spec.join('') === spec.join('');
                                                })) {
                                                    productData.variants.push({
                                                        show_understocking: 'true',
                                                        type: 'variants',
                                                        sale_price: 0,
                                                        compare_price: 0,
                                                        cost: 0,
                                                        spec: JSON.parse(JSON.stringify(spec)),
                                                        profit: 0,
                                                        v_length: 0,
                                                        v_width: 0,
                                                        v_height: 0,
                                                        weight: 0,
                                                        shipment_type: shipmentTypeMap[row[11]] || 'none',
                                                        sku: '',
                                                        barcode: '',
                                                        stock: 0,
                                                        stockList: {},
                                                        preview_image: '',
                                                    });
                                                }
                                            });
                                            productData.variants = productData.variants.filter((variant) => {
                                                let pass = true;
                                                let index = 0;
                                                for (const b of variant.spec) {
                                                    if (!productData.specs[index] ||
                                                        !productData.specs[index].option.find((dd) => {
                                                            return dd.title === b;
                                                        })) {
                                                        pass = false;
                                                        break;
                                                    }
                                                    index++;
                                                }
                                                return pass && variant.spec.length === productData.specs.length;
                                            });
                                            if (productData.variants.length === 0) {
                                                productData.variants.push({
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
                                                    shipment_type: shipmentTypeMap[row[11]] || 'none',
                                                    sku: '',
                                                    barcode: '',
                                                    stock: 0,
                                                    stockList: {},
                                                    preview_image: '',
                                                });
                                            }
                                            if (productData.product_category === 'kitchen') {
                                                if (productData.variants.length > 1) {
                                                    productData.variants.map((dd) => {
                                                        var _a, _b, _c, _d;
                                                        dd.compare_price = 0;
                                                        dd.sale_price = dd.spec.map((d1, index) => {
                                                            var _a;
                                                            return parseInt((_a = productData.specs[index].option.find((d2) => {
                                                                return d2.title === d1;
                                                            }).price) !== null && _a !== void 0 ? _a : "0", 10);
                                                        }).reduce((acc, cur) => acc + cur, 0);
                                                        dd.weight = parseFloat((_a = productData.weight) !== null && _a !== void 0 ? _a : '0');
                                                        dd.v_height = parseFloat((_b = productData.v_height) !== null && _b !== void 0 ? _b : '0');
                                                        dd.v_width = parseFloat((_c = productData.v_width) !== null && _c !== void 0 ? _c : '0');
                                                        dd.v_length = parseFloat((_d = productData.v_length) !== null && _d !== void 0 ? _d : '0');
                                                        dd.shipment_type = productData.shipment_type;
                                                    });
                                                }
                                                else {
                                                    productData.variants.map((dd) => {
                                                        var _a, _b, _c, _d;
                                                        dd.weight = parseFloat((_a = productData.weight) !== null && _a !== void 0 ? _a : '0');
                                                        dd.v_height = parseFloat((_b = productData.v_height) !== null && _b !== void 0 ? _b : '0');
                                                        dd.v_width = parseFloat((_c = productData.v_width) !== null && _c !== void 0 ? _c : '0');
                                                        dd.v_length = parseFloat((_d = productData.v_length) !== null && _d !== void 0 ? _d : '0');
                                                        dd.shipment_type = productData.shipment_type;
                                                    });
                                                }
                                            }
                                            productData.variants.map((dd) => {
                                                dd.checked = undefined;
                                                return dd;
                                            });
                                        }
                                        updateVariants();
                                    }
                                    else {
                                        variantData.preview_image = row[4];
                                        variantData.sale_price = this.checkNumber(row[10]);
                                        const shipmentTypeMap = {
                                            依重量計算: 'weight',
                                            依材積計算: 'volume',
                                        };
                                        variantData.shipment_type = shipmentTypeMap[row[11]] || 'none';
                                        variantData.v_length = this.checkNumber(row[12]);
                                        variantData.v_width = this.checkNumber(row[13]);
                                        variantData.v_height = this.checkNumber(row[14]);
                                        variantData.weight = this.checkNumber(row[15]);
                                        variantData.show_understocking = row[18] == '追蹤' ? 'true' : 'false';
                                        variantData.stock = this.checkNumber(row[18]);
                                        productData.variants.push(JSON.parse(JSON.stringify(variantData)));
                                        productData.specs = [];
                                    }
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
                                    const regex = /[\s\/\\]+/g;
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
                        return (!(id_list)[index]);
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
                            this.gvc.notifyDataChange(notifyId);
                        });
                    }
                }
                catch (e) {
                    console.error(e);
                    dialog.dataLoading({ visible: false });
                    dialog.errorMessage({ text: '資料錯誤' });
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
            '庫存數量'
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
    static exportCommodity(getFormData, gvc) {
        const rowInitData = {
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
        ApiShop.getProduct(getFormData).then((response) => {
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
                        productType: index === 0 ? expo.checkString(ShoppingProductSetting.getProductTypeString(productData.content)) : '',
                        img: expo.checkString((productData.content.variants[index] && productData.content.variants[index].preview_image) || productData.content.preview_image[0]),
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
            expo.exportData(exportData, `商品詳細列表_${ProductExcel.getFileTime()}`);
            dialog.dataLoading({ visible: false });
        });
    }
    static exportKitchen(getFormData, gvc) {
        const rowInitData = {
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
        ApiShop.getProduct(getFormData).then((response) => {
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
                            productType: index === 0 ? expo.checkString(ShoppingProductSetting.getProductTypeString(productData.content)) : '',
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
                            stock: expo.checkNumber((_j = productData.content.variants[index]) === null || _j === void 0 ? void 0 : _j.stock)
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
                            productType: index === 0 ? expo.checkString(ShoppingProductSetting.getProductTypeString(productData.content)) : '',
                            img: expo.checkString((productData.content.variants[index] && productData.content.variants[index].preview_image) || productData.content.preview_image[0]),
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
                            stock: expo.checkNumber((_t = productData.content.variants[index]) === null || _t === void 0 ? void 0 : _t.stock)
                        });
                    };
                    const rowData = baseRowData(0);
                    exportData.push(rowData);
                }
            });
            expo.exportData(exportData, `餐飲組合列表_${ProductExcel.getFileTime()}`);
            dialog.dataLoading({ visible: false });
        });
    }
}
