import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { GVC } from '../glitterBundle/GVController.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { BgProduct, OptionsItem } from '../backend-manager/bg-product.js';
import { FilterOptions } from './filter-options.js';
import { BgListComponent } from '../backend-manager/bg-list-component.js';
import { Tool } from '../modules/tool.js';
import { CheckInput } from '../modules/checkInput.js';
import { imageLibrary } from '../modules/image-library.js';
import { ProductAi } from './ai-generator/product-ai.js';

interface variant {
    save_stock?: string;
    sale_price: number;
    compare_price: number;
    cost: number;
    spec: string[];
    profit: number;
    v_length: number;
    v_width: number;
    v_height: number;
    weight: number;
    shipment_type: 'weight' | 'none' | 'volume';
    sku: string;
    barcode: string;
    stock: number;
    preview_image: string;
    show_understocking: string;
    type: string;
}

class Excel {
    private workbook: any;
    private worksheet: any;
    private ExcelJS: any;
    private gvc: GVC;
    public headers: string[];
    public lineName: string[];

    constructor(gvc: GVC, headers: string[], lineName: string[]) {
        this.gvc = gvc;
        this.headers = headers;
        this.lineName = lineName;
    }

    loadScript() {
        return new Promise((resolve) => {
            if ((window as any).ExcelJS) {
                this.initExcel();
                resolve(true);
            } else {
                this.gvc.addMtScript(
                    [{ src: 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js' }],
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

    // 匯入excel
    async importData(notifyId: string, file: any) {
        await this.loadScript();
        const reader = new FileReader();
        const dialog = new ShareDialog(this.gvc.glitter);
        dialog.dataLoading({ visible: true, text: '資料處理中' });

        reader.onload = async (e) => {
            const arrayBuffer = e.target!.result;
            const workbook = new this.ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);
            const worksheet = workbook.getWorksheet(1);

            const data: any = [];
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
            let error = false;
            let addCollection: any = [];
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
                variants: variant[];
                seo: {
                    title: string;
                    content: string;
                    keywords: string;
                };
                template: string;
            }[] = [];
            let productData: any = {};
            let variantData: variant = {
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
            data.forEach((row: any, index: number) => {
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
                        productData.title = row[0] ?? '';
                        productData.status = row[1] == '上架' ? 'active' : 'draft';
                        productData.collection = row[2].split(',') ?? [];
                        const regex = /[\s\/\\]+/g;
                        // 去除多餘空白
                        productData.collection = productData.collection.map((item: string) => item.replace(/\s+/g, ''));

                        productData.collection.forEach((row: any) => {
                            let collection = row.replace(/\s+/g, '');
                            if (regex.test(collection)) {
                                error = true;
                                const dialog = new ShareDialog(this.gvc.glitter);
                                dialog.infoMessage({ text: `第${index + 1}行的類別名稱不可包含空白格與以下符號：「 / 」「 \\ 」，並以「 , 」區分不同類別` });
                                return;
                            }

                            // 若帶有/，要自動加上父類
                            function splitStringIncrementally(input: string): string[] {
                                const parts = input.split('/');
                                const result: string[] = [];

                                // 使用 reduce 来构建每一部分的拼接字符串
                                parts.reduce((acc, part) => {
                                    const newAcc = acc ? `${acc}/${part}` : part;
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
                        productData.productType.addProduct = row[3].includes('加購品');
                        productData.productType.product = row[3].includes('商品');
                        productData.productType.giveaway = row[3].includes('贈品');
                        productData.preview_image = row[4] ? [row[4]] : ['商品圖片'];
                        productData.seo.title = row[5] ?? '';
                        productData.seo.content = row[6] ?? '';
                        productData.seo.keywords = row[7] ?? '';
                        // spec值 merge
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
                        if (row[rowindex] && productData.specs.length > key) {
                            productData.specs[key].option = productData.specs[key].option ?? [];
                            const exists = productData.specs[key].option.some((item: any) => item.title === row[rowindex]);
                            if (!exists) {
                                productData.specs[key].option.push({ title: row[rowindex], expand: true });
                            }
                            variantData.spec.push(row[rowindex]);
                        }
                    });
                    variantData.sku = row[14] ?? '';
                    variantData.cost = row[15] ?? '';
                    variantData.sale_price = row[16] ?? 0;
                    variantData.compare_price = row[17] ?? 0;
                    variantData.profit = row[18] ?? 0;

                    const shipmentTypeMap: { [key: string]: string } = {
                        依材積計算: 'volume',
                        不計算運費: 'none',
                    };
                    // @ts-ignore
                    variantData.shipment_type = shipmentTypeMap[row[19]] || 'weight';

                    variantData.v_length = row[20] ?? 0;
                    variantData.v_width = row[21] ?? 0;
                    variantData.v_height = row[22] ?? 0;
                    variantData.weight = row[23] ?? 0;
                    variantData.show_understocking = row[25] == '追蹤' ? 'true' : 'false';
                    variantData.stock = row[26] ?? 0;
                    variantData.save_stock = row[27] ?? 0;
                    variantData.barcode = row[28] ?? '';

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
        };
        reader.readAsArrayBuffer(file);
    }

    static getFileTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}`;
    }

    async exportData(data: any, name?: string) {
        await this.loadScript();
        this.setHeader();
        this.insertData(data);
        this.setHeaderStyle();
        this.setRowHeight();
        this.setFontAndAlignmentStyle();
        this.adjustColumnWidths(data);
        const buffer = await this.workbook.xlsx.writeBuffer();
        let fileName = name ?? `example_${new Date().toISOString()}`;
        this.saveAsExcelFile(buffer, `${fileName}.xlsx`);
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

    // 將內容匯出成excel檔
    public async exportToExcel(): Promise<void> {
        const buffer = await this.workbook.xlsx.writeBuffer();
        this.saveAsExcelFile(buffer, `example_${new Date().toISOString()}.xlsx`);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const saasConfig: { config: any; api: any } = (window as any).saasConfig;
        const dialog = new ShareDialog(this.gvc.glitter);
        saasConfig.api.uploadFile(fileName).then((data: any) => {
            const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const blobData: Blob = new Blob([buffer], { type: EXCEL_TYPE });
            const data1 = data.response;
            dialog.dataLoading({ visible: true });
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
                    dialog.errorMessage({ text: '上傳失敗' });
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
        const maxLengths = this.headers.map((header) => this.getByteLength(header));
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
}

export class ShoppingProductSetting {
    public static main(gvc: GVC, type: 'product' | 'addProduct' | 'giveaway' | 'hidden' = 'product') {
        const html = String.raw;
        const glitter = gvc.glitter;

        const vm: {
            id: string;
            tableId: string;
            type: 'list' | 'add' | 'replace' | 'editSpec' | 'ai-initial';
            dataList: any;
            query: string;
            last_scroll: number;
            queryType: string;
            orderString: string;
            filter?: any;
            replaceData: any;
            ai_initial: any;
        } = {
            id: glitter.getUUID(),
            tableId: glitter.getUUID(),
            type: 'list',
            dataList: undefined,
            query: '',
            last_scroll: 0,
            queryType: 'title',
            orderString: '',
            filter: {},
            replaceData: '',
            ai_initial: {},
        };
        const rowInitData: {
            name: string;
            status: string;
            category: string;
            productType: string;
            img: string;
            SEO_title: string;
            SEO_desc: string;
            SEO_keyword: string;
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
        } = {
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
        const excel = new Excel(
            gvc,
            [
                '商品ID',
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
                '原價',
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
            ],
            Object.keys(rowInitData)
        );
        let dialog = new ShareDialog(glitter);

        const ListComp = new BgListComponent(gvc, vm, FilterOptions.productFilterFrame);
        gvc.addMtScript(
            [{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }],
            () => {},
            () => {}
        );
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
                        case 'ai-initial':
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'add',
                                product_type: type,
                                initial_data: vm.ai_initial,
                            });
                        case 'add':
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'add',
                                product_type: type,
                            });
                        case 'list':
                            const filterID = gvc.glitter.getUUID();
                            vm.tableId = gvc.glitter.getUUID();
                            vm.dataList = [];
                            const vmlist = {
                                id: glitter.getUUID(),
                                loading: true,
                                collections: [] as OptionsItem[],
                            };
                            return gvc.bindView({
                                bind: vmlist.id,
                                view: () => {
                                    if (vmlist.loading) {
                                        return '';
                                    } else {
                                        let importInput: any = {};
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
                                        return BgWidget.container(
                                            html`
                                                <div class="title-container">
                                                    ${BgWidget.title(
                                                        (() => {
                                                            switch (type) {
                                                                case 'addProduct':
                                                                    return '加購品';
                                                                case 'giveaway':
                                                                    return '贈品';
                                                                case 'product':
                                                                    return '商品列表';
                                                                case 'hidden':
                                                                    return '隱形賣場商品';
                                                            }
                                                        })()
                                                    )}
                                                    <div class="flex-fill"></div>
                                                    <div style="display: flex; gap: 10px;">
                                                        ${[
                                                            BgWidget.grayButton(
                                                                '匯入',
                                                                gvc.event(() => {
                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                                                        return gvc.bindView({
                                                                            bind: 'importView',
                                                                            view: () => {
                                                                                return html`
                                                                                    <div
                                                                                        style="display: flex;width:100%;padding: 12px 0 12px 20px;align-items: center;border-radius: 10px 10px 0px 0px;background: #F2F2F2;color:#393939;font-size: 16px;font-weight: 700;"
                                                                                    >
                                                                                        匯入商品
                                                                                    </div>
                                                                                    <div style="display: flex;width: 100%;align-items: flex-start;gap: 16px;padding:20px;flex-direction: column">
                                                                                        <div style="display: flex;align-items: baseline;gap: 12px;align-self: stretch;">
                                                                                            <div style="color:#393939;font-size: 16px;font-weight: 400;">透過XLSX檔案匯入商品</div>
                                                                                            <div
                                                                                                class="cursor_pointer"
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
                                                                                                    excel.exportData(sample, '商品詳細列表_範例').then(() => {
                                                                                                        dialog.successMessage({ text: '匯出成功' });
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
                                                                                                gvc.notifyDataChange('importView');
                                                                                            })}"
                                                                                        />
                                                                                        <div
                                                                                            style="display: flex;justify-content: center;padding: 59px 0px 58px 0px;align-items: center;flex-direction: column;gap: 10px;width: 100%;border-radius: 10px;border: 1px solid #DDD;background: #FFF;"
                                                                                        >
                                                                                            ${(() => {
                                                                                                if (importInput.files && importInput.files.length > 0) {
                                                                                                    return html`
                                                                                                        <div
                                                                                                            class="cursor_pointer"
                                                                                                            style="display: flex;padding: 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);color: #393939;font-size: 16px;font-weight: 400;"
                                                                                                            onclick="${gvc.event(() => {
                                                                                                                (document.querySelector('#upload-excel') as HTMLInputElement)!.click();
                                                                                                            })}"
                                                                                                        >
                                                                                                            更換檔案
                                                                                                        </div>
                                                                                                        <div style="color:#8D8D8D;">${importInput.files[0].name}</div>
                                                                                                    `;
                                                                                                } else {
                                                                                                    return html`
                                                                                                        <div
                                                                                                            class="cursor_pointer"
                                                                                                            style="display: flex;padding: 10px;justify-content: center;align-items: center;gap: 10px;border-radius: 10px;background: #FFF;box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.10);color: #393939;font-size: 16px;font-weight: 400;"
                                                                                                            onclick="${gvc.event(() => {
                                                                                                                (document.querySelector('#upload-excel') as HTMLInputElement)!.click();
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
                                                                                        ${BgWidget.cancel(
                                                                                            gvc.event(() => {
                                                                                                gvc.glitter.closeDiaLog();
                                                                                            })
                                                                                        )}
                                                                                        ${BgWidget.save(
                                                                                            gvc.event(() => {
                                                                                                if (importInput.files && importInput.files.length > 0) {
                                                                                                    vm.dataList = undefined;
                                                                                                    excel.importData(vm.tableId, importInput.files[0]);
                                                                                                } else {
                                                                                                    dialog.infoMessage({ text: '尚未上傳檔案' });
                                                                                                }
                                                                                            }),
                                                                                            '匯入'
                                                                                        )}
                                                                                    </div>
                                                                                `;
                                                                            },
                                                                            divCreate: { style: `border-radius: 10px;background: #FFF;width: 569px;min-height: 368px;max-width: 90%;` },
                                                                        });
                                                                    }, 'import');
                                                                    return ``;
                                                                })
                                                            ),
                                                            BgWidget.grayButton(
                                                                '匯出',
                                                                gvc.event(() => {
                                                                    gvc.glitter.innerDialog((gvc) => {
                                                                        const check = {
                                                                            select: 'all',
                                                                            file: 'excel',
                                                                        };
                                                                        return html`
                                                                            <div
                                                                                style="width: 569px; max-width: calc(100% - 20px);height: 408px;border-radius: 10px;background: #FFF;display: flex;flex-direction: column;color: #393939;"
                                                                            >
                                                                                <div
                                                                                    class="w-100"
                                                                                    style="padding: 12px 20px;display: flex;align-items: center;font-size: 16px;font-weight: 700;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                >
                                                                                    匯出商品
                                                                                </div>
                                                                                <div class="w-100" style="display: flex;flex-direction: column;align-items: flex-start;gap: 24px;padding: 20px;">
                                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-items: flex-start">
                                                                                        <div>匯出</div>
                                                                                        ${BgWidget.multiCheckboxContainer(
                                                                                            gvc,
                                                                                            [
                                                                                                {
                                                                                                    key: 'all',
                                                                                                    name: '全部商品',
                                                                                                },
                                                                                                {
                                                                                                    key: 'search',
                                                                                                    name: '目前搜尋與篩選的結果',
                                                                                                },
                                                                                                {
                                                                                                    key: 'check',
                                                                                                    name: `勾選的 ${vm.dataList.filter((item: any) => item.checked).length} 件商品`,
                                                                                                },
                                                                                            ],
                                                                                            [check.select],
                                                                                            (res: any) => {
                                                                                                check.select = res[0];
                                                                                            },
                                                                                            { single: true }
                                                                                        )}
                                                                                    </div>
                                                                                    <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 16px;align-self: stretch;">
                                                                                        <div>匯出為</div>
                                                                                        ${BgWidget.multiCheckboxContainer(
                                                                                            gvc,
                                                                                            [
                                                                                                {
                                                                                                    key: 'excel',
                                                                                                    name: 'Excel檔案',
                                                                                                },
                                                                                            ],
                                                                                            [check.file],
                                                                                            (res: any) => {
                                                                                                check.file = res[0];
                                                                                            },
                                                                                            { single: true }
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div style="display: flex;justify-content: flex-end;align-items: flex-start;gap: 14px;padding: 20px">
                                                                                    ${BgWidget.cancel(
                                                                                        gvc.event(() => {
                                                                                            gvc.glitter.closeDiaLog();
                                                                                        })
                                                                                    )}
                                                                                    ${BgWidget.save(
                                                                                        gvc.event(() => {
                                                                                            if (check.select === 'check' && vm.dataList.filter((item: any) => item.checked).length === 0) {
                                                                                                dialog.infoMessage({ text: '請勾選至少一件以上的商品' });
                                                                                                return;
                                                                                            }
                                                                                            dialog.dataLoading({ visible: true });

                                                                                            const getFormData = (() => {
                                                                                                switch (check.select) {
                                                                                                    case 'search':
                                                                                                        return {
                                                                                                            page: 0,
                                                                                                            limit: 1000,
                                                                                                            search: vm.query ?? '',
                                                                                                            searchType: vm.queryType ?? '',
                                                                                                            orderBy: vm.orderString ?? '',
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
                                                                                                            productType: type,
                                                                                                        };
                                                                                                    case 'check':
                                                                                                        return {
                                                                                                            page: 0,
                                                                                                            limit: 1000,
                                                                                                            id_list: vm.dataList
                                                                                                                .filter((item: any) => item.checked)
                                                                                                                .map((item: { id: number }) => item.id),
                                                                                                            productType: type,
                                                                                                        };
                                                                                                    case 'all':
                                                                                                    default:
                                                                                                        return {
                                                                                                            page: 0,
                                                                                                            limit: 1000,
                                                                                                            productType: type,
                                                                                                        };
                                                                                                }
                                                                                            })();

                                                                                            ApiShop.getProduct(getFormData).then((response) => {
                                                                                                dialog.dataLoading({ visible: false });
                                                                                                let exportData: any = [];
                                                                                                response.response.data.map((productData: any) => {
                                                                                                    let rowData: {
                                                                                                        id: string;
                                                                                                        name: string;
                                                                                                        status: string;
                                                                                                        category: string;
                                                                                                        productType: string;
                                                                                                        img: string;
                                                                                                        SEO_title: string;
                                                                                                        SEO_desc: string;
                                                                                                        SEO_keyword: string;
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
                                                                                                    } = {
                                                                                                        id: '',
                                                                                                        name: productData.content.title ?? '未命名商品',
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

                                                                                                    productData.content.variants.map((variant: any, index: number) => {
                                                                                                        if (index == 0) {
                                                                                                            rowData.SEO_title = productData.content?.seo?.title ?? '';
                                                                                                            rowData.SEO_desc = productData.content?.seo?.content ?? '';
                                                                                                            rowData.SEO_keyword = productData.content?.seo?.keyword ?? '';
                                                                                                            rowData.category = productData.content.collection.join(' , ') ?? '';
                                                                                                            rowData.productType = `${productData.content?.productType?.product ? '商品' : ''} ${
                                                                                                                productData.content?.productType?.addProduct ? '加購品' : ''
                                                                                                            } ${productData.content?.productType?.giveaway ? '贈品' : ''}`;
                                                                                                            rowData.status = productData.content?.status == 'active' ? '上架' : '下架';
                                                                                                            rowData.spec1 = productData.content?.specs[0]?.title ?? '';
                                                                                                            rowData.spec2 = productData.content?.specs[1]?.title ?? '';
                                                                                                            rowData.spec3 = productData.content?.specs[2]?.title ?? '';
                                                                                                            rowData.img = productData.content.preview_image[0];
                                                                                                        } else {
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
                                                                                                        rowData.img = rowData.img ?? variant.preview_image ?? '';
                                                                                                        rowData.spec1Value = variant.spec[0] ?? '';
                                                                                                        rowData.spec2Value = variant.spec[1] ?? '';
                                                                                                        rowData.spec3Value = variant.spec[2] ?? '';
                                                                                                        rowData.sku = variant.sku ?? '';
                                                                                                        rowData.cost = variant.cost ?? '';
                                                                                                        rowData.sale_price = variant.sale_price ?? '';
                                                                                                        rowData.benefit = variant.profit ?? '';
                                                                                                        rowData.compare_price = variant.compare_price ?? '';
                                                                                                        rowData.width = variant?.v_width ?? '0';
                                                                                                        rowData.height = variant?.v_height ?? '0';
                                                                                                        rowData.length = variant?.v_length ?? '0';
                                                                                                        rowData.weight = variant.weight ?? '0';
                                                                                                        rowData.weightUnit = variant.weightUnit ?? 'KG';
                                                                                                        rowData.stockPolicy = variant.show_understocking ? '追蹤' : '不追蹤';
                                                                                                        rowData.stock = variant.stock ?? '0';
                                                                                                        rowData.save_stock = variant.save_stock ?? '0';
                                                                                                        rowData.barcode = variant.barcode ?? '';
                                                                                                        rowData.id = productData.content.id;
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
                                                                                                        } else {
                                                                                                            rowData.shipment_type = '依重量計算';
                                                                                                        }

                                                                                                        exportData.push(JSON.parse(JSON.stringify(rowData)));
                                                                                                    });
                                                                                                });
                                                                                                ``;

                                                                                                excel.exportData(exportData, `商品詳細列表_${Excel.getFileTime()}`).then(() => {
                                                                                                    dialog.successMessage({ text: '匯出成功' });
                                                                                                });
                                                                                            });
                                                                                        }),
                                                                                        '匯出'
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        `;
                                                                    }, 'export');
                                                                    return;
                                                                })
                                                            ),
                                                            // BgWidget.grayButton(
                                                            //         "AI 生成",
                                                            //         gvc.event(() => {
                                                            //             vm.ai_initial={
                                                            //                 title: '',
                                                            //                 productType: {
                                                            //                     product: true,
                                                            //                     addProduct: false,
                                                            //                     giveaway: false,
                                                            //                 },
                                                            //                 content: '',
                                                            //                 visible: 'true',
                                                            //                 status: 'active',
                                                            //                 collection: [],
                                                            //                 hideIndex: 'false',
                                                            //                 preview_image: [],
                                                            //                 specs: [],
                                                            //                 variants: [],
                                                            //                 seo: {
                                                            //                     title: '',
                                                            //                     content: '',
                                                            //                     keywords: '',
                                                            //                     domain: '',
                                                            //                 },
                                                            //                 relative_product: [],
                                                            //                 template: '',
                                                            //                 content_array: [],
                                                            //                 content_json: [],
                                                            //             }
                                                            //             ProductAi.setProduct(gvc,vm.ai_initial,()=>{
                                                            //                 vm.type='ai-initial'
                                                            //
                                                            //             })
                                                            //         }),
                                                            //         {  }
                                                            // ),
                                                            BgWidget.darkButton(
                                                                '新增',
                                                                gvc.event(() => {
                                                                    vm.type = 'add';
                                                                }),
                                                                {
                                                                    class: `guide5-3`,
                                                                }
                                                            ),
                                                        ].join('')}
                                                    </div>
                                                </div>
                                                ${BgWidget.container(
                                                    BgWidget.mainCard(
                                                        [
                                                            (() => {
                                                                const id = gvc.glitter.getUUID();
                                                                return gvc.bindView({
                                                                    bind: id,
                                                                    view: () => {
                                                                        const filterList = [
                                                                            BgWidget.selectFilter({
                                                                                gvc,
                                                                                callback: (value: any) => {
                                                                                    vm.queryType = value;
                                                                                    gvc.notifyDataChange(vm.tableId);
                                                                                    gvc.notifyDataChange(id);
                                                                                },
                                                                                default: vm.queryType || 'title',
                                                                                options: FilterOptions.productSelect,
                                                                                style: 'min-width: 160px;',
                                                                            }),
                                                                            BgWidget.searchFilter(
                                                                                gvc.event((e) => {
                                                                                    vm.query = e.value;
                                                                                    gvc.notifyDataChange(vm.tableId);
                                                                                    gvc.notifyDataChange(id);
                                                                                }),
                                                                                vm.query || '',
                                                                                '搜尋'
                                                                            ),
                                                                            BgWidget.funnelFilter({
                                                                                gvc,
                                                                                callback: () => ListComp.showRightMenu(FilterOptions.productFunnel),
                                                                            }),
                                                                            BgWidget.updownFilter({
                                                                                gvc,
                                                                                callback: (value: any) => {
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
                                                                            // 手機版
                                                                            return html` <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: space-between">
                                                                                    <div>${filterList[0]}</div>
                                                                                    <div style="display: flex;">
                                                                                        <div class="me-2">${filterList[2]}</div>
                                                                                        ${filterList[3]}
                                                                                    </div>
                                                                                </div>
                                                                                <div style="display: flex; margin-top: 8px;">${filterList[1]}</div>
                                                                                <div>${filterTags}</div>`;
                                                                        } else {
                                                                            // 電腦版
                                                                            return html` <div style="display: flex; align-items: center; gap: 10px;">${filterList.join('')}</div>
                                                                                <div>${filterTags}</div>`;
                                                                        }
                                                                    },
                                                                });
                                                            })(),
                                                            gvc.bindView({
                                                                bind: vm.tableId,
                                                                view: () => {
                                                                    const limit = 20;
                                                                    return BgWidget.tableV3({
                                                                        gvc: gvc,
                                                                        getData: (vmi) => {
                                                                            ApiShop.getProduct({
                                                                                page: vmi.page - 1,
                                                                                limit: limit,
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
                                                                                filter_visible: `${type !== 'hidden'}`,
                                                                                collection: vm.filter.collection,
                                                                                accurate_search_collection: true,
                                                                                productType: type === 'hidden' ? 'product' : type,
                                                                            }).then((data) => {
                                                                                function getDatalist() {
                                                                                    return data.response.data.map((dd: any) => {
                                                                                        return [
                                                                                            {
                                                                                                key: '商品',
                                                                                                value: html` <div class="d-flex">
                                                                                                    ${BgWidget.validImageBox({
                                                                                                        gvc: gvc,
                                                                                                        image: dd.content.preview_image[0],
                                                                                                        width: 40,
                                                                                                        class: 'rounded border me-4',
                                                                                                    })}${Tool.truncateString(dd.content.title)}
                                                                                                </div>`,
                                                                                            },
                                                                                            {
                                                                                                key: '售價',
                                                                                                value: (() => {
                                                                                                    const numArray = (dd.content.variants ?? [])
                                                                                                        .map((dd: any) => {
                                                                                                            return parseInt(`${dd.sale_price}`, 10);
                                                                                                        })
                                                                                                        .filter((dd: any) => {
                                                                                                            return !isNaN(dd);
                                                                                                        });
                                                                                                    if (numArray.length == 0) {
                                                                                                        return '尚未設定';
                                                                                                    }
                                                                                                    return `$ ${Math.min(...numArray).toLocaleString()}`;
                                                                                                })(),
                                                                                            },
                                                                                            {
                                                                                                key: '庫存',
                                                                                                value: (() => {
                                                                                                    if (!dd.content.variants || dd.content.variants.length === 0) {
                                                                                                        return 0;
                                                                                                    }
                                                                                                    return Math.min(
                                                                                                        ...dd.content.variants.map((dd: any) => {
                                                                                                            return dd.stock;
                                                                                                        })
                                                                                                    ).toLocaleString();
                                                                                                })(),
                                                                                            },
                                                                                            {
                                                                                                key: '已售出',
                                                                                                value: (dd.total_sales ?? '0').toLocaleString(),
                                                                                            },
                                                                                            {
                                                                                                key: '狀態',
                                                                                                value: gvc.bindView(() => {
                                                                                                    const id = gvc.glitter.getUUID();
                                                                                                    return {
                                                                                                        bind: id,
                                                                                                        view: () =>
                                                                                                            BgWidget.switchTextButton(
                                                                                                                gvc,
                                                                                                                dd.content.status === 'active',
                                                                                                                { left: dd.content.status === 'active' ? '上架' : '下架' },
                                                                                                                (bool) => {
                                                                                                                    dd.content.status = bool ? 'active' : 'draft';
                                                                                                                    ApiPost.put({
                                                                                                                        postData: dd.content,
                                                                                                                        token: (window.parent as any).config.token,
                                                                                                                        type: 'manager',
                                                                                                                    }).then((res) => {
                                                                                                                        res.result && gvc.notifyDataChange(id);
                                                                                                                    });
                                                                                                                }
                                                                                                            ),
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
                                                                                            dd.value = html` <div style="line-height:40px;">${dd.value}</div>`;
                                                                                            return dd;
                                                                                        });
                                                                                    });
                                                                                }

                                                                                vm.dataList = data.response.data;
                                                                                vmi.pageSize = Math.ceil(data.response.total / limit);
                                                                                vmi.originalData = vm.dataList;
                                                                                vmi.tableData = getDatalist();
                                                                                vmi.loading = false;
                                                                                vmi.callback();
                                                                            });
                                                                        },
                                                                        rowClick: (data, index) => {
                                                                            vm.replaceData = vm.dataList[index].content;
                                                                            vm.type = 'replace';
                                                                        },
                                                                        filter: [
                                                                            {
                                                                                name: '上架',
                                                                                event: (checkedData) => {
                                                                                    const selCount = checkedData.length;
                                                                                    dialog.dataLoading({ visible: true });
                                                                                    new Promise<void>((resolve) => {
                                                                                        let n = 0;
                                                                                        checkedData.map((dd: any) => {
                                                                                            dd.content.status = 'active';

                                                                                            async function run() {
                                                                                                return ApiPost.put({
                                                                                                    postData: dd.content,
                                                                                                    token: (window.parent as any).config.token,
                                                                                                    type: 'manager',
                                                                                                }).then((res) => {
                                                                                                    res.result ? n++ : run();
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
                                                                                },
                                                                                option: true,
                                                                            },
                                                                            {
                                                                                name: '下架',
                                                                                event: (checkedData) => {
                                                                                    const selCount = checkedData.length;
                                                                                    dialog.dataLoading({ visible: true });
                                                                                    new Promise<void>((resolve) => {
                                                                                        let n = 0;
                                                                                        checkedData.map((dd: any) => {
                                                                                            dd.content.status = 'draft';

                                                                                            async function run() {
                                                                                                return ApiPost.put({
                                                                                                    postData: dd.content,
                                                                                                    token: (window.parent as any).config.token,
                                                                                                    type: 'manager',
                                                                                                }).then((res) => {
                                                                                                    res.result ? n++ : run();
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
                                                                                },
                                                                                option: true,
                                                                            },
                                                                            {
                                                                                name: '刪除',
                                                                                event: (checkedData) => {
                                                                                    dialog.checkYesOrNot({
                                                                                        text: '是否確認刪除所選項目？',
                                                                                        callback: (response) => {
                                                                                            if (response) {
                                                                                                dialog.dataLoading({ visible: true });
                                                                                                ApiShop.delete({
                                                                                                    id: checkedData
                                                                                                        .map((dd: any) => {
                                                                                                            return dd.id;
                                                                                                        })
                                                                                                        .join(`,`),
                                                                                                }).then((res) => {
                                                                                                    dialog.dataLoading({ visible: false });
                                                                                                    if (res.result) {
                                                                                                        vm.dataList = undefined;
                                                                                                        gvc.notifyDataChange(vm.id);
                                                                                                    } else {
                                                                                                        dialog.errorMessage({
                                                                                                            text: '刪除失敗',
                                                                                                        });
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        },
                                                                                    });
                                                                                },
                                                                            },
                                                                        ],
                                                                    });
                                                                },
                                                            }),
                                                        ].join('')
                                                    )
                                                )}
                                                ${BgWidget.mbContainer(240)}
                                            `
                                        );
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
                                document.querySelector('.pd-w-c')!.scrollTop = vm.last_scroll;
                                vm.last_scroll = 0;
                            }, 200);
                            return ShoppingProductSetting.editProduct({
                                vm: vm,
                                gvc: gvc,
                                type: 'replace',
                                defData: vm.replaceData,
                            });
                        case 'editSpec':
                            vm.last_scroll = document.querySelector('.pd-w-c')!.scrollTop;
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

    public static editProductSpec(obj: {
        vm: any;
        gvc: GVC;
        defData: any;
        single?: boolean;
        goBackEvent?: {
            save: (data: any) => void;
            cancel: () => void;
        };
    }) {
        const html = String.raw;
        let postMD: any = obj.defData;

        let variant: any = {};
        let orignData: any = {};
        let index: number = 0;
        const gvc = obj.gvc;
        postMD.variants.map((data: any, ind: number) => {
            if (data.editable) {
                index = ind;
                variant = obj.single ? data : JSON.parse(JSON.stringify(data));
                orignData = data;
            }
        });

        function checkStore(next: () => void) {
            const dialog = new ShareDialog(gvc.glitter);
            if (JSON.stringify(orignData) !== JSON.stringify(variant)) {
                dialog.checkYesOrNot({
                    text: '內容已變更是否儲存?',
                    callback: (response) => {
                        if (response) {
                            (postMD.variants as any)[index] = variant;
                        }
                        obj && obj.goBackEvent ? obj.goBackEvent.save(postMD) : next();
                    },
                });
            } else {
                next();
            }
        }

        document.querySelector('.pd-w-c')!.scrollTop = 0;
        return html` <div class="d-flex" style="font-size: 16px;color:#393939;font-weight: 400;position: relative;padding:0;padding-bottom: ${obj.single ? `0px` : `80px`};">
            ${BgWidget.container(
                html`
                    <div class="title-container ${obj.single ? 'd-none' : ''}">
                        ${BgWidget.goBack(
                            obj.gvc.event(() => {
                                checkStore(
                                    obj && obj.goBackEvent
                                        ? obj.goBackEvent.cancel
                                        : () => {
                                              obj.vm.type = 'replace';
                                          }
                                );
                            })
                        )}
                        ${BgWidget.title(variant.spec.length > 0 ? variant.spec.join(' / ') : '單一規格')}
                        <div class="flex-fill"></div>
                    </div>
                    <div class="d-flex flex-column ${obj.single ? `flex-column-reverse` : `flex-sm-row mt-4`} w-100 p-0" style="gap: 24px;">
                        <div class="leftBigArea d-flex flex-column flex-fill" style="gap: 24px;">
                            ${!obj.single
                                ? BgWidget.mainCard(
                                      gvc.bindView(() => {
                                          const id = gvc.glitter.getUUID();
                                          return {
                                              bind: id,
                                              view: () => {
                                                  return html`
                                                      <div style="font-weight: 700;">規格</div>
                                                      <div>${variant.spec.length > 0 ? variant.spec.join(' / ') : '單一規格'}</div>
                                                      <div style="font-weight: 700;">規格圖片</div>
                                                      <div
                                                          class="d-flex align-items-center justify-content-center rounded-3 shadow"
                                                          style="min-width:135px;135px;height:135px;cursor:pointer;background: 50%/cover url('${variant.preview_image || BgWidget.noImageURL}');"
                                                      >
                                                          <div
                                                              class="w-100 h-100 d-flex align-items-center justify-content-center rounded-3 p-hover-image"
                                                              style="opacity:0;background: rgba(0,0,0,0.5);gap:20px;color:white;font-size:22px;"
                                                          >
                                                              <i
                                                                  class="fa-regular fa-eye"
                                                                  onclick="${obj.gvc.event(() => {
                                                                      obj.gvc.glitter.openDiaLog(
                                                                          new URL('../dialog/image-preview.js', import.meta.url).href,
                                                                          'preview',
                                                                          variant.preview_image || BgWidget.noImageURL
                                                                      );
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
                                      })
                                  )
                                : ''}
                            ${BgWidget.mainCard(html`
                                <div class="w-100" style="display: flex;gap: 18px;flex-direction: column;">
                                    <div style="font-weight: 700;">定價</div>
                                    <div class="d-flex w-100" style="gap:18px;">
                                        <div class="d-flex w-50 flex-column guide5-5" style="gap: 8px;">
                                            <div>售價*</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                placeholder="請輸入售價"
                                                onchange="${gvc.event((e) => {
                                                    variant.sale_price = e.value;
                                                })}"
                                                min="0"
                                                value="${variant.sale_price || '0'}"
                                                type="number"
                                            />
                                        </div>
                                        <div class="d-flex w-50 flex-column" style="gap: 8px;">
                                            <div>原價*</div>
                                            <input
                                                style="width: 100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                                placeholder="請輸入原價"
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
                            ${BgWidget.mainCard(
                                gvc.bindView(() => {
                                    const vm = {
                                        id: gvc.glitter.getUUID(),
                                    };
                                    return {
                                        bind: vm.id,
                                        view: () => {
                                            return html` <div style="font-weight: 700;margin-bottom: 6px;">運費計算</div>
                                                ${BgWidget.multiCheckboxContainer(
                                                    gvc,
                                                    [
                                                        {
                                                            key: 'volume',
                                                            name: '依材積計算',
                                                            customerClass: 'guide5-6',
                                                        },
                                                        {
                                                            key: 'weight',
                                                            name: '依重量計算',
                                                        },
                                                        {
                                                            key: 'none',
                                                            name: '不計算運費',
                                                        },
                                                    ],
                                                    [variant.shipment_type],
                                                    (data) => {
                                                        variant.shipment_type = data[0];
                                                        gvc.notifyDataChange(vm.id);
                                                    },
                                                    { single: true }
                                                )}`;
                                        },
                                        divCreate: {
                                            class: `d-flex flex-column `,
                                            style: `gap:12px;`,
                                        },
                                    };
                                })
                            )}
                            ${BgWidget.mainCard(html`
                                <div class="d-flex flex-column " style="gap:18px;">
                                    <div class="d-flex flex-column guide5-7" style="gap:18px;">
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
                                                    return html` <div style="display: flex;justify-content: center;align-items: center;gap: 10px;position: relative;" class=" col-12 col-sm-4 mb-2">
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
                                            <div style="white-space: nowrap;">單位</div>
                                            <select class="form-select d-flex align-items-center flex-fill" style="border-radius: 10px;border: 1px solid #DDD;padding-left: 18px;">
                                                <option value="kg">公斤</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            `)}
                            ${BgWidget.mainCard(html`
                                <div class="d-flex flex-column" style="gap: 18px;">
                                    <div style="font-weight: 700;">庫存政策</div>
                                    ${gvc.bindView(() => {
                                        const id = gvc.glitter.getUUID();
                                        return {
                                            bind: id,
                                            view: () => {
                                                return html`
                                                    <div class="d-flex flex-column w-100">
                                                        <div
                                                            class="d-flex align-items-center"
                                                            style="gap:6px;cursor: pointer;"
                                                            onclick="${gvc.event(() => {
                                                                variant.show_understocking = 'true';
                                                                gvc.notifyDataChange(id);
                                                            })}"
                                                        >
                                                            ${variant.show_understocking != 'false'
                                                                ? html` <div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                                : html` <div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                            追蹤商品庫存
                                                        </div>
                                                        ${variant.show_understocking != 'false'
                                                            ? html` <div
                                                                  class="w-100 align-items-center"
                                                                  style="display: flex;padding-left: 8px;align-items: flex-start;gap: 14px;align-self: stretch;margin-top: 8px;"
                                                              >
                                                                  <div style="background-color: #E5E5E5;height: 80px;width: 1px;"></div>
                                                                  <div class="flex-fill d-flex flex-column" style="gap: 8px">
                                                                      <div>庫存數量</div>
                                                                      <input
                                                                          class="w-100"
                                                                          value="${variant.stock ?? '0'}"
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
                                                                          value="${variant.save_stock ?? '0'}"
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
                                                            ? html` <div style="width: 16px;height: 16px;border-radius: 20px;border: 4px solid #393939;"></div>`
                                                            : html` <div style="width: 16px;height: 16px;border-radius: 20px;border: 1px solid #DDD;"></div>`}
                                                        不追蹤
                                                    </div>
                                                `;
                                            },
                                            divCreate: { style: `display: flex;flex-direction: column;align-items: flex-start;gap: 12px;align-self: stretch;` },
                                        };
                                    })}
                                </div>
                            `)}
                            ${BgWidget.mainCard(html`
                                <div style="display: flex;flex-direction: column;align-items: flex-start;gap: 18px;">
                                    <div class="title-container px-0">
                                        <div style="color:#393939;font-weight: 700;">商品管理</div>
                                        <div class="flex-fill"></div>
                                        ${BgWidget.grayButton(
                                            '商品條碼',
                                            gvc.event(() => {
                                                const dialog = new ShareDialog(gvc.glitter);
                                                if (!variant.barcode) {
                                                    dialog.errorMessage({ text: '請先設定商品條碼' });
                                                }
                                                (window.parent as any).glitter.addMtScript(
                                                    [
                                                        {
                                                            src: 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js',
                                                        },
                                                    ],
                                                    () => {
                                                        (window.parent as any).QRCode.toDataURL(
                                                            `variants-` + variant.barcode,
                                                            {
                                                                width: 200,
                                                                margin: 2,
                                                            },
                                                            function (err: any, url: any) {
                                                                if (err) {
                                                                    console.error(err);
                                                                    return;
                                                                }
                                                                (window.parent as any).glitter.openDiaLog(new URL('../dialog/image-preview.js', import.meta.url).href, 'preview', url);
                                                            }
                                                        );
                                                    },
                                                    () => {}
                                                );
                                            }),
                                            { icon: `fa-regular fa-eye` }
                                        )}
                                    </div>
                                    <div style="display: flex;width: 100%;height: 70px;flex-direction: column;justify-content: center;align-items: flex-start;gap: 8px;">
                                        <div style="font-weight: 400;font-size: 16px;">存貨單位 (SKU)</div>
                                        <input
                                            style="width:100%;border-radius: 10px;border: 1px solid #DDD;height: 40px;padding: 0px 18px;"
                                            placeholder="請輸入存貨單位"
                                            value="${variant.sku ?? ''}"
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
                                            value="${variant.barcode ?? ''}"
                                            onchange="${gvc.event((e) => {
                                                // 正则表达式检查是否只包含英文字母和数字
                                                const regex = /^[a-zA-Z0-9]+$/;
                                                // 测试字符串是否匹配正则表达式
                                                if (!regex.test(e.value)) {
                                                    e.value = '';
                                                    const dialog = new ShareDialog(gvc.glitter);
                                                    dialog.errorMessage({ text: '條碼僅能輸入英數字' });
                                                } else {
                                                    variant.barcode = e.value;
                                                }
                                            })}"
                                        />
                                    </div>
                                </div>
                            `)}
                            ${document.body.clientWidth > 768 && obj.single === undefined ? BgWidget.mbContainer(120) : ''}
                        </div>
                        <div class="${obj.single ? `d-none` : ``}" style="min-width:300px; max-width:100%;">
                            ${BgWidget.summaryCard(
                                gvc.bindView({
                                    bind: 'right',
                                    view: () => {
                                        let rightHTML = postMD.variants
                                            .map((data: any) => {
                                                if (!data.editable) {
                                                    return html`
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
                                                                    postMD.variants.map((dd: any) => {
                                                                        dd.editable = false;
                                                                    });
                                                                    data.editable = true;
                                                                    obj.vm.type = 'editSpec';
                                                                });
                                                            })}"
                                                        >
                                                            ${BgWidget.validImageBox({
                                                                gvc,
                                                                image: data.preview_image || BgWidget.noImageURL,
                                                                width: 40,
                                                                style: 'border-radius: 10px',
                                                            })}
                                                            <div>${data.spec.join(' / ')}</div>
                                                        </div>
                                                    `;
                                                } else {
                                                    return ``;
                                                }
                                            })
                                            .join('');

                                        return html`
                                            <div style="font-weight: 700;">其他規格</div>
                                            <div class="d-flex flex-column mt-3" style="gap:16px">${rightHTML}</div>
                                        `;
                                    },
                                })
                            )}
                        </div>
                        ${obj.single ? '' : BgWidget.mbContainer(240)}
                    </div>
                `
            )}
            <div class="update-bar-container ${obj.single ? `d-none` : ``}">
                ${BgWidget.cancel(
                    obj.gvc.event(() => {
                        checkStore(
                            obj && obj.goBackEvent
                                ? obj.goBackEvent.cancel
                                : () => {
                                      variant = orignData;
                                      obj.vm.type = 'replace';
                                  }
                        );
                    })
                )}
                ${BgWidget.save(
                    obj.gvc.event(() => {
                        function checkEmpty(variant: any, alert: boolean = false) {
                            const checkList = ['sale_price'];
                            for (const checkItem of checkList) {
                                if (!variant[checkItem]) {
                                    dialog.infoMessage({
                                        text: '價格輸入錯誤',
                                    });
                                    return false;
                                }
                            }
                            if (variant.shipment_type == 'weight') {
                                if (!variant.weight) {
                                    dialog.infoMessage({
                                        text: '商品重量未填',
                                    });
                                    return false;
                                }
                            }
                            if (variant.shipment_type == 'volume') {
                                if (!variant.v_height || !variant.v_length || !variant.v_width) {
                                    dialog.infoMessage({
                                        text: '商品材積未填',
                                    });
                                    return false;
                                }
                            }

                            return true;
                        }

                        const dialog = new ShareDialog(gvc.glitter);
                        let checkPass = true;
                        postMD.variants.map((data: any, index: number) => {
                            if (data.editable) {
                                postMD.variants[index] = variant;
                                if (!checkEmpty(data, true)) {
                                    checkPass = false;
                                }
                            } else {
                                if (!checkEmpty(data)) {
                                    checkPass = false;
                                    dialog.infoMessage({
                                        text: `規格 ${data.spec.join('')} 的欄位輸入錯誤`,
                                    });
                                }
                            }
                        });
                        if (checkPass) {
                            if (obj && obj.goBackEvent) {
                                obj.goBackEvent.save(postMD);
                            } else {
                                obj.vm.type = 'replace';
                            }
                        }
                    })
                )}
            </div>
        </div>`;
    }

    public static async editProduct(obj: { vm: any; gvc: GVC; type?: 'add' | 'replace'; defData?: any; initial_data?: any; product_type?: 'product' | 'addProduct' | 'giveaway' | 'hidden' }) {
        let postMD: {
            shipment_type?: string;
            id?: string;
            title: string;
            ai_description: string;
            productType: {
                product: boolean;
                addProduct: boolean;
                giveaway: boolean;
            };
            visible: 'true' | 'false';
            content: string;
            preview_image: string[];
            relative_product: string[];
            hideIndex: string;
            collection: string[];
            status: 'active' | 'draft';
            specs: { title: string; option: any }[];
            variants: variant[];
            seo: {
                domain: string;
                title: string;
                content: string;
                keywords: string;
            };
            template: string;
            content_array: string[];
            content_json: {
                id: string;
                list: { key: string; value: string }[];
            }[];
        } = obj.initial_data || {
            title: '',
            ai_description: '',
            productType: {
                product: true,
                addProduct: false,
                giveaway: false,
            },
            content: '',
            visible: 'true',
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
                domain: '',
            },
            relative_product: [],
            template: '',
            content_array: [],
            content_json: [],
        };
        switch (obj.product_type) {
            case 'product':
                postMD.visible = 'true';
                postMD.productType = { product: true, addProduct: false, giveaway: false };
                break;
            case 'addProduct':
                postMD.visible = 'true';
                postMD.productType = { product: false, addProduct: true, giveaway: false };
                break;
            case 'giveaway':
                postMD.visible = 'true';
                postMD.productType = { product: false, addProduct: false, giveaway: true };
                break;
            case 'hidden':
                postMD.visible = 'false';
                postMD.productType = { product: true, addProduct: false, giveaway: false };
                break;
        }
        postMD.content_array = postMD.content_array ?? [];
        postMD.content_json = postMD.content_json ?? [];
        if (obj.type === 'replace') {
            postMD = obj.defData;
        } else {
            obj.vm.replaceData = postMD;
        }
        const html = String.raw;
        const gvc = obj.gvc;
        const seoID = gvc.glitter.getUUID();
        const variantsViewID = gvc.glitter.getUUID();
        let createPage: any = {
            page: 'add',
        };
        let selectFunRow = false;

        const saasConfig: {
            config: any;
            api: any;
        } = (window.parent as any).saasConfig;
        let shipment_config: any = await saasConfig.api.getPrivateConfig(saasConfig.config.appName, `glitter_shipment`);
        if (shipment_config.response.result[0]) {
            shipment_config = shipment_config.response.result[0].value || {};
        } else {
            shipment_config = {};
        }

        function updateVariants() {
            const remove_indexs: number[] = [];
            let complexity = 1;
            postMD.specs = postMD.specs.filter((dd) => {
                return dd.option && dd.option.length !== 0;
            });
            postMD.specs.map((spec) => {
                complexity *= spec.option.length;
            });
            const cType: string[][] = [];

            function generateCombinations(specs: any, currentCombination: any, index = 0) {
                if (
                    index === specs.length &&
                    currentCombination.length > 0 &&
                    cType.findIndex((ct: string[]) => {
                        return JSON.stringify(ct) === JSON.stringify(currentCombination);
                    }) === -1
                ) {
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

            function checkSpecInclude(spec: string, index: number) {
                if (postMD.specs[index]) {
                    for (const { title } of postMD.specs[index].option) {
                        if (spec === title) return true;
                    }
                    return false;
                }
                return false;
            }

            for (let n = 0; n < complexity; n++) {
                let currentCombination: any = [];
                generateCombinations(
                    postMD.specs.map((dd) => {
                        return dd.option.map((dd: any) => {
                            return dd.title;
                        });
                    }),
                    currentCombination
                );

                const waitAdd = cType.find((dd: any) => {
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
                postMD.variants.map((variant: any, index1: number) => {
                    if (variant.spec.length !== postMD.specs.length) {
                        remove_indexs.push(index1);
                    }
                    variant.spec.map((sp: string, index2: number) => {
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
                    if (
                        !postMD.specs[index] ||
                        !postMD.specs[index].option.find((dd: any) => {
                            return dd.title === b;
                        })
                    ) {
                        pass = false;
                        break;
                    }
                    index++;
                }
                return pass && variant.spec.length === postMD.specs.length;
            });

            // 當規格為空時，需補一個進去
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
                // 使用 Map 來存儲唯一的 title 及其對應的 option
                const uniqueTitlesMap = new Map();

                postMD.specs.forEach((item: any) => {
                    if (!uniqueTitlesMap.has(item.title)) {
                        uniqueTitlesMap.set(item.title, item.option);
                    } else {
                        const existingOptions = uniqueTitlesMap.get(item.title);
                        item.option.forEach((option: any) => {
                            if (!existingOptions.find((existingOption: any) => existingOption.title === option.title)) {
                                existingOptions.push(option);
                            }
                        });
                    }
                });

                // 將 Map 轉換為包含唯一 title 及其對應的 option 的陣列
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
                    return [
                        BgWidget.container(
                            html`
                                <div class="title-container">
                                    ${BgWidget.goBack(
                                        obj.gvc.event(() => {
                                            obj.vm.type = 'list';
                                        })
                                    )}
                                    <h3 class="mb-0 me-3 tx_title">${obj.type === 'replace' ? postMD.title || '編輯商品' : `新增商品`}</h3>
                                    <div class="flex-fill"></div>
                                    ${BgWidget.grayButton(
                                        'AI 生成',
                                        gvc.event(() => {
                                            ProductAi.setProduct(gvc, postMD, () => {
                                                gvc.notifyDataChange(vm.id);
                                            });
                                        }),
                                        {}
                                    )}
                                    <div class="mx-1"></div>
                                    ${BgWidget.grayButton(
                                        document.body.clientWidth > 768 ? '預覽商品' : '預覽',
                                        gvc.event(() => {
                                            const href = `https://${(window.parent as any).glitter.share.editorViewModel.domain}/products/${postMD.seo.domain}`;
                                            (window.parent as any).glitter.openNewTab(href);
                                        }),
                                        { icon: document.body.clientWidth > 768 ? 'fa-regular fa-eye' : undefined }
                                    )}
                                </div>
                                ${BgWidget.container1x2(
                                    {
                                        html: [
                                            BgWidget.mainCard(html`
                                                <div class="d-flex flex-column guide5-4">
                                                    <div style="font-weight: 700;">商品名稱</div>
                                                    <input
                                                        class="w-100 mt-2"
                                                        value="${postMD.title ?? ''}"
                                                        style="border-radius: 10px;border: 1px solid #DDD;display: flex;padding: 9px 18px 9px 18px;align-items: center;align-self: stretch;"
                                                        onchange="${gvc.event((e) => {
                                                            if (postMD.seo.domain === postMD.title) {
                                                                postMD.seo.domain = e.value;
                                                            }
                                                            postMD.title = e.value;
                                                            gvc.notifyDataChange('seo');
                                                        })}"
                                                    />
                                                </div>
                                            `),
                                            BgWidget.mainCard(
                                                [
                                                    obj.gvc.bindView(() => {
                                                        const dialog = new ShareDialog(gvc.glitter);
                                                        const vm = {
                                                            id: obj.gvc.glitter.getUUID(),
                                                            type: 'product-detail',
                                                            loading: true,
                                                            documents: [],
                                                        };

                                                        postMD.content_array = postMD.content_array ?? [];
                                                        postMD.content_json = postMD.content_json ?? [];
                                                        return {
                                                            bind: vm.id,
                                                            view: async () => {
                                                                if (vm.loading) {
                                                                    return BgWidget.spinner();
                                                                }

                                                                function formatRichtext(
                                                                    text: string,
                                                                    tags: {
                                                                        key: string;
                                                                        title: string;
                                                                        font_size: string;
                                                                        font_color: string;
                                                                        font_bgr: string;
                                                                    }[],
                                                                    jsonData: {
                                                                        key: string;
                                                                        value: string;
                                                                    }[]
                                                                ) {
                                                                    let gText = `${text}`;
                                                                    if (tags && tags.length > 0) {
                                                                        for (const item of tags) {
                                                                            const data = jsonData.find((j) => j.key === item.key);
                                                                            const textImage =
                                                                                data && data.value
                                                                                    ? html`<span
                                                                                          style="font-size: ${item.font_size ?? '14'}px; color: ${item.font_color ??
                                                                                          '#393939'}; background: ${item.font_bgr ?? '#fff'}"
                                                                                          >${data.value}</span
                                                                                      >`
                                                                                    : html`#${item.title}#`;
                                                                            // : html`<img
                                                                            //       alt="${item.key}"
                                                                            //       class="rounded-2"
                                                                            //       src="https://assets.imgix.net/~text?bg=4d86db&txtclr=f2f2f2&w=${Tool.twenLength(item.title) *
                                                                            //       20}&h=40&txtsize=12&txt=${item.title}&txtfont=Helvetica&txtalign=middle,center"
                                                                            //   />`;

                                                                            const regex = new RegExp(`@{{${item.key}}}`, 'g');
                                                                            gText = gText.replace(regex, textImage);
                                                                        }
                                                                    }
                                                                    return gText;
                                                                }

                                                                return html` <div class="d-flex align-items-center justify-content-end mb-3">
                                                                        <div class="d-flex align-items-center gap-2">
                                                                            <div style="color: #393939; font-weight: 700;">商品描述</div>
                                                                            ${BgWidget.aiChatButton({
                                                                                gvc,
                                                                                select: 'writer',
                                                                            })}
                                                                        </div>
                                                                        <div class="flex-fill"></div>
                                                                        <div
                                                                            class="cursor_pointer"
                                                                            onclick="${gvc.event(() => {
                                                                                BgWidget.dialog({
                                                                                    gvc: gvc,
                                                                                    title: '設定',
                                                                                    xmark: () => {
                                                                                        return new Promise<boolean>((resolve) => {
                                                                                            gvc.notifyDataChange(vm.id);
                                                                                            resolve(true);
                                                                                        });
                                                                                    },
                                                                                    innerHTML: (gvc) => {
                                                                                        const id = gvc.glitter.getUUID();
                                                                                        return gvc.bindView(() => {
                                                                                            return {
                                                                                                bind: id,
                                                                                                view: () => {
                                                                                                    return vm.documents
                                                                                                        .map((dd: any) => {
                                                                                                            return html` <li class="w-100 px-2">
                                                                                                                <div class="w-100 d-flex justify-content-between">
                                                                                                                    <div class="d-flex justify-content-start align-items-center gap-3">
                                                                                                                        <i class="fa-solid fa-grip-dots-vertical dragItem cursor_pointer"></i>
                                                                                                                        <div class="tx_normal">${dd.title}</div>
                                                                                                                    </div>
                                                                                                                    ${gvc.bindView(
                                                                                                                        (() => {
                                                                                                                            const iconId = gvc.glitter.getUUID();
                                                                                                                            return {
                                                                                                                                bind: iconId,
                                                                                                                                view: () => {
                                                                                                                                    return html` <i
                                                                                                                                        class="${postMD.content_array.includes(dd.id)
                                                                                                                                            ? 'fa-solid fa-eye'
                                                                                                                                            : 'fa-sharp fa-solid fa-eye-slash'} d-flex align-items-center justify-content-center cursor_pointer"
                                                                                                                                        onclick="${gvc.event(() => {
                                                                                                                                            if (postMD.content_array.includes(dd.id)) {
                                                                                                                                                postMD.content_array = postMD.content_array.filter(
                                                                                                                                                    (d) => d !== dd.id
                                                                                                                                                );
                                                                                                                                            } else {
                                                                                                                                                postMD.content_array.push(dd.id);
                                                                                                                                            }
                                                                                                                                            gvc.notifyDataChange(iconId);
                                                                                                                                        })}"
                                                                                                                                    ></i>`;
                                                                                                                                },
                                                                                                                                divCreate: {
                                                                                                                                    class: 'd-flex',
                                                                                                                                },
                                                                                                                            };
                                                                                                                        })()
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </li>`;
                                                                                                        })
                                                                                                        .join('');
                                                                                                },
                                                                                                divCreate: {
                                                                                                    elem: 'ul',
                                                                                                    class: 'w-100 my-2 d-flex flex-column gap-4',
                                                                                                },
                                                                                                onCreate: () => {
                                                                                                    if (!vm.loading) {
                                                                                                        gvc.glitter.addMtScript(
                                                                                                            [
                                                                                                                {
                                                                                                                    src: `https://raw.githack.com/SortableJS/Sortable/master/Sortable.js`,
                                                                                                                },
                                                                                                            ],
                                                                                                            () => {},
                                                                                                            () => {}
                                                                                                        );
                                                                                                        const interval = setInterval(() => {
                                                                                                            if ((window as any).Sortable) {
                                                                                                                try {
                                                                                                                    gvc.addStyle(`
                                                                                                                        ul {
                                                                                                                            list-style: none;
                                                                                                                            padding: 0;
                                                                                                                        }
                                                                                                                    `);

                                                                                                                    function swapArr(arr: any, t1: number, t2: number) {
                                                                                                                        const data = arr[t1];
                                                                                                                        arr.splice(t1, 1);
                                                                                                                        arr.splice(t2, 0, data);
                                                                                                                    }

                                                                                                                    let startIndex = 0;
                                                                                                                    //@ts-ignore
                                                                                                                    Sortable.create(gvc.getBindViewElem(id).get(0), {
                                                                                                                        group: id,
                                                                                                                        animation: 100,
                                                                                                                        handle: '.dragItem',
                                                                                                                        onEnd: (evt: any) => {
                                                                                                                            swapArr(vm.documents, startIndex, evt.newIndex);
                                                                                                                            ApiUser.setPublicConfig({
                                                                                                                                key: 'text-manager',
                                                                                                                                user_id: 'manager',
                                                                                                                                value: vm.documents,
                                                                                                                            }).then((result) => {
                                                                                                                                if (!result.response.result) {
                                                                                                                                    dialog.errorMessage({ text: '設定失敗' });
                                                                                                                                }
                                                                                                                            });
                                                                                                                        },
                                                                                                                        onStart: (evt: any) => {
                                                                                                                            startIndex = evt.oldIndex;
                                                                                                                        },
                                                                                                                    });
                                                                                                                } catch (e) {}
                                                                                                                clearInterval(interval);
                                                                                                            }
                                                                                                        }, 100);
                                                                                                    }
                                                                                                },
                                                                                            };
                                                                                        });
                                                                                    },
                                                                                });
                                                                            })}"
                                                                        >
                                                                            設定<i class="fa-regular fa-gear ms-1"></i>
                                                                        </div>
                                                                    </div>
                                                                    <div class="my-3">
                                                                        ${gvc.bindView(
                                                                            (() => {
                                                                                const id = gvc.glitter.getUUID();
                                                                                return {
                                                                                    bind: id,
                                                                                    view: () => {
                                                                                        return html`<div
                                                                                            class="d-flex justify-content-between align-items-center gap-3 px-2 mb-1"
                                                                                            style="cursor: pointer;"
                                                                                            onclick="${gvc.event(() => {
                                                                                                const originContent = `${postMD.content}`;
                                                                                                BgWidget.fullDialog({
                                                                                                    gvc: gvc,
                                                                                                    title: '商品描述',
                                                                                                    innerHTML: (gvc2) => {
                                                                                                        return html` <div>
                                                                                                            ${EditorElem.richText({
                                                                                                                gvc: gvc2,
                                                                                                                def: postMD.content,
                                                                                                                setHeight: '100vh',
                                                                                                                hiddenBorder: true,
                                                                                                                insertImageEvent: (editor) => {
                                                                                                                    imageLibrary.selectImageLibrary(
                                                                                                                        gvc,
                                                                                                                        (urlArray) => {
                                                                                                                            if (urlArray.length > 0) {
                                                                                                                                for (const url of urlArray) {
                                                                                                                                    editor.html.insert(html`<img
                                                                                                                                        src="${url.data}"
                                                                                                                                        style="max-width: 25%;"
                                                                                                                                    />`);
                                                                                                                                }
                                                                                                                                editor.undo.saveStep();
                                                                                                                            } else {
                                                                                                                                const dialog = new ShareDialog(gvc.glitter);
                                                                                                                                dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                                                                                                            }
                                                                                                                        },
                                                                                                                        html` <div
                                                                                                                            class="d-flex flex-column"
                                                                                                                            style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                        >
                                                                                                                            圖片庫
                                                                                                                        </div>`,
                                                                                                                        { mul: true }
                                                                                                                    );
                                                                                                                },
                                                                                                                callback: (text) => {
                                                                                                                    postMD.content = text;
                                                                                                                },
                                                                                                            })}
                                                                                                        </div>`;
                                                                                                    },
                                                                                                    footer_html: (gvc2: GVC) => {
                                                                                                        return [
                                                                                                            BgWidget.cancel(
                                                                                                                gvc2.event(() => {
                                                                                                                    postMD.content = originContent;
                                                                                                                    gvc2.closeDialog();
                                                                                                                })
                                                                                                            ),
                                                                                                            BgWidget.save(
                                                                                                                gvc2.event(() => {
                                                                                                                    gvc2.closeDialog();
                                                                                                                    gvc.notifyDataChange(id);
                                                                                                                })
                                                                                                            ),
                                                                                                        ].join('');
                                                                                                    },
                                                                                                    closeCallback: () => {
                                                                                                        postMD.content = originContent;
                                                                                                    },
                                                                                                });
                                                                                            })}"
                                                                                        >
                                                                                            <div style="word-break: break-all;">
                                                                                                ${Tool.truncateString(
                                                                                                    (() => {
                                                                                                        const text = gvc.glitter.utText.removeTag(postMD.content);
                                                                                                        return text.length > 0 ? text : '點擊填寫商品描述';
                                                                                                    })(),
                                                                                                    40
                                                                                                )}
                                                                                            </div>
                                                                                            <i class="fa-solid fa-angle-right" style="font-size: 1.25rem; font-weight: 700;"></i>
                                                                                        </div>`;
                                                                                    },
                                                                                };
                                                                            })()
                                                                        )}
                                                                    </div>
                                                                    ${(vm.documents || [])
                                                                        .filter((item: any) => {
                                                                            return postMD.content_array.includes(item.id);
                                                                        })
                                                                        .map((item: any, index) => {
                                                                            return BgWidget.openBoxContainer({
                                                                                gvc,
                                                                                tag: 'content_array',
                                                                                title: item.title,
                                                                                insideHTML: (() => {
                                                                                    if (item.data.tags && item.data.tags.length > 0) {
                                                                                        const id = obj.gvc.glitter.getUUID();
                                                                                        return html` <div
                                                                                                class="cursor_pointer text-end me-1 mb-2"
                                                                                                onclick="${gvc.event(() => {
                                                                                                    const originJson = JSON.parse(JSON.stringify(postMD.content_json));
                                                                                                    BgWidget.settingDialog({
                                                                                                        gvc: gvc,
                                                                                                        title: '設定',
                                                                                                        innerHTML: (gvc) => {
                                                                                                            return html` <div>
                                                                                                                ${item.data.tags
                                                                                                                    .map((tag: { key: string; title: string }) => {
                                                                                                                        return html` <div>
                                                                                                                            ${BgWidget.editeInput({
                                                                                                                                gvc,
                                                                                                                                title: tag.title,
                                                                                                                                default: (() => {
                                                                                                                                    const docIndex = postMD.content_json.findIndex(
                                                                                                                                        (c) => c.id === item.id
                                                                                                                                    );
                                                                                                                                    if (docIndex === -1) {
                                                                                                                                        return '';
                                                                                                                                    }
                                                                                                                                    if (postMD.content_json[docIndex].list === undefined) {
                                                                                                                                        return '';
                                                                                                                                    }
                                                                                                                                    const keyIndex = postMD.content_json[docIndex].list.findIndex(
                                                                                                                                        (l) => l.key === tag.key
                                                                                                                                    );
                                                                                                                                    if (keyIndex === -1) {
                                                                                                                                        return '';
                                                                                                                                    }
                                                                                                                                    return postMD.content_json[docIndex].list[keyIndex].value;
                                                                                                                                })(),
                                                                                                                                callback: (text) => {
                                                                                                                                    const docIndex = postMD.content_json.findIndex(
                                                                                                                                        (c) => c.id === item.id
                                                                                                                                    );
                                                                                                                                    if (docIndex === -1) {
                                                                                                                                        postMD.content_json.push({
                                                                                                                                            id: item.id,
                                                                                                                                            list: [
                                                                                                                                                {
                                                                                                                                                    key: tag.key,
                                                                                                                                                    value: text,
                                                                                                                                                },
                                                                                                                                            ],
                                                                                                                                        });
                                                                                                                                        return;
                                                                                                                                    }
                                                                                                                                    if (postMD.content_json[docIndex].list === undefined) {
                                                                                                                                        postMD.content_json[docIndex].list = [
                                                                                                                                            {
                                                                                                                                                key: tag.key,
                                                                                                                                                value: text,
                                                                                                                                            },
                                                                                                                                        ];
                                                                                                                                        return;
                                                                                                                                    }
                                                                                                                                    const keyIndex = postMD.content_json[docIndex].list.findIndex(
                                                                                                                                        (l) => l.key === tag.key
                                                                                                                                    );
                                                                                                                                    if (keyIndex === -1) {
                                                                                                                                        postMD.content_json[docIndex].list.push({
                                                                                                                                            key: tag.key,
                                                                                                                                            value: text,
                                                                                                                                        });
                                                                                                                                        return;
                                                                                                                                    }
                                                                                                                                    postMD.content_json[docIndex].list[keyIndex].value = text;
                                                                                                                                },
                                                                                                                                placeHolder: '輸入文本標籤',
                                                                                                                            })}
                                                                                                                        </div>`;
                                                                                                                    })
                                                                                                                    .join(BgWidget.mbContainer(12))}
                                                                                                            </div>`;
                                                                                                        },
                                                                                                        footer_html: (gvc2: GVC) => {
                                                                                                            return [
                                                                                                                BgWidget.cancel(
                                                                                                                    gvc2.event(() => {
                                                                                                                        postMD.content_json = originJson;
                                                                                                                        gvc2.closeDialog();
                                                                                                                    })
                                                                                                                ),
                                                                                                                BgWidget.save(
                                                                                                                    gvc2.event(() => {
                                                                                                                        gvc2.closeDialog();
                                                                                                                        gvc.notifyDataChange(`${id}-${index}`);
                                                                                                                    })
                                                                                                                ),
                                                                                                            ].join('');
                                                                                                        },
                                                                                                        closeCallback: () => {
                                                                                                            postMD.content_json = originJson;
                                                                                                        },
                                                                                                    });
                                                                                                })}"
                                                                                            >
                                                                                                標籤設值
                                                                                            </div>
                                                                                            ${gvc.bindView(
                                                                                                (() => {
                                                                                                    return {
                                                                                                        bind: `${id}-${index}`,
                                                                                                        view: () => {
                                                                                                            const content = item.data.content || '';
                                                                                                            const tags = item.data.tags;
                                                                                                            const jsonData = postMD.content_json.find((c) => c.id === item.id);
                                                                                                            return html` <div style="border: 2px #DDDDDD solid; border-radius: 6px; padding: 12px;">
                                                                                                                ${tags ? formatRichtext(content, tags, jsonData ? jsonData.list : []) : content}
                                                                                                            </div>`;
                                                                                                        },
                                                                                                    };
                                                                                                })()
                                                                                            )}`;
                                                                                    }
                                                                                    return html` <div style="border: 1px #DDDDDD solid; border-radius: 6px; padding: 12px">
                                                                                        ${item.data.content || ''}
                                                                                    </div>`;
                                                                                })(),
                                                                            });
                                                                        })
                                                                        .join(BgWidget.mbContainer(8))}`;
                                                            },
                                                            divCreate: {},
                                                            onCreate: () => {
                                                                if (vm.loading) {
                                                                    ApiUser.getPublicConfig('text-manager', 'manager').then((data: any) => {
                                                                        vm.documents = data.response.value;
                                                                        postMD.content_array = postMD.content_array.filter((id) => {
                                                                            return vm.documents.some((item: any) => item.id === id);
                                                                        });
                                                                        postMD.content_json = postMD.content_json.filter((d) => {
                                                                            return vm.documents.some((item: any) => item.id === d.id);
                                                                        });
                                                                        vm.loading = false;
                                                                        gvc.notifyDataChange(vm.id);
                                                                    });
                                                                }
                                                            },
                                                        };
                                                    }),
                                                ].join(BgWidget.mbContainer(12))
                                            ),
                                            BgWidget.mainCard(
                                                html`
                                                    <div class="d-flex align-items-center justify-content-between" style="color: #393939;font-size: 16px;font-weight: 700;margin-bottom: 18px;">
                                                        圖片
                                                        ${BgWidget.customButton({
                                                            button: {
                                                                color: 'black',
                                                                size: 'sm',
                                                            },
                                                            text: {
                                                                name: '新增圖片',
                                                            },
                                                            event: gvc.event(() => {
                                                                imageLibrary.selectImageLibrary(
                                                                    gvc,
                                                                    (urlArray) => {
                                                                        if (urlArray.length > 0) {
                                                                            postMD.preview_image.push(
                                                                                ...urlArray.map((data: any) => {
                                                                                    return data.data;
                                                                                })
                                                                            );
                                                                            obj.gvc.notifyDataChange('image_view');
                                                                        } else {
                                                                            const dialog = new ShareDialog(gvc.glitter);
                                                                            dialog.errorMessage({ text: '請選擇至少一張圖片' });
                                                                        }
                                                                    },
                                                                    html` <div class="d-flex flex-column" style="border-radius: 10px 10px 0px 0px;background: #F2F2F2;">圖片庫</div>`,
                                                                    { mul: true }
                                                                );
                                                            }),
                                                        })}
                                                    </div>
                                                    ${obj.gvc.bindView(() => {
                                                        return {
                                                            bind: 'image_view',
                                                            view: () => {
                                                                return (
                                                                    html` <div class="my-2"></div>` +
                                                                    EditorElem.flexMediaManagerV2({
                                                                        gvc: obj.gvc,
                                                                        data: postMD.preview_image,
                                                                    })
                                                                );
                                                            },
                                                            divCreate: {
                                                                class: `d-flex w-100`,
                                                                style: `overflow-y:scroll`,
                                                            },
                                                        };
                                                    })}
                                                `
                                            ),
                                            (() => {
                                                if (postMD.variants.length === 1) {
                                                    try {
                                                        (postMD.variants[0] as any).editable = true;
                                                        return ShoppingProductSetting.editProductSpec({
                                                            vm: obj.vm,
                                                            defData: postMD,
                                                            gvc: gvc,
                                                            single: true,
                                                        });
                                                    } catch (e) {
                                                        console.error(e);
                                                        return '';
                                                    }
                                                }
                                                return '';
                                            })(),
                                            BgWidget.mainCard(
                                                obj.gvc.bindView(() => {
                                                    const specid = obj.gvc.glitter.getUUID();
                                                    let editIndex = -1;
                                                    return {
                                                        bind: specid,
                                                        dataList: [{ obj: createPage, key: 'page' }],
                                                        view: () => {
                                                            let returnHTML = ``;
                                                            let editSpectPage: any = [];
                                                            if (postMD.specs.length > 0) {
                                                                postMD.specs.map((d, index) => {
                                                                    editSpectPage.push({
                                                                        type: index === editIndex ? 'edit' : 'show',
                                                                    });
                                                                });
                                                                returnHTML += html`
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
                                                                        refreshComponent: (fromIndex, toIndex) => {
                                                                            postMD.variants.map((item) => {
                                                                                // 確保索引值在數組範圍內
                                                                                if (
                                                                                    fromIndex === undefined ||
                                                                                    toIndex === undefined ||
                                                                                    fromIndex < 0 ||
                                                                                    fromIndex >= item.spec.length ||
                                                                                    toIndex < 0 ||
                                                                                    toIndex >= item.spec.length
                                                                                ) {
                                                                                    throw new Error('索引超出範圍');
                                                                                }

                                                                                // 取出元素並插入元素到新位置
                                                                                let element = item.spec.splice(fromIndex, 1)[0];
                                                                                item.spec.splice(toIndex, 0, element);

                                                                                return item;
                                                                            });

                                                                            obj.gvc.notifyDataChange([specid, 'productInf']);
                                                                        },
                                                                        array: () => {
                                                                            return postMD.specs.map((dd, specIndex: number) => {
                                                                                let temp: any = {
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
                                                                                                return html` <div class="d-flex flex-column" style="gap:6px;align-items: flex-start;padding: 12px 0;">
                                                                                                    <div style="font-size: 16px;">${dd.title}</div>
                                                                                                    ${(() => {
                                                                                                        let returnHTML = ``;
                                                                                                        dd.option.map((opt: any) => {
                                                                                                            returnHTML += html`
                                                                                                                <div class="option" style="border-radius: 5px;;padding: 1px 9px;font-size: 14px;">
                                                                                                                    ${opt.title}
                                                                                                                </div>
                                                                                                            `;
                                                                                                        });
                                                                                                        return html`
                                                                                                            <div class="d-flex w-100 " style="gap:8px; flex-wrap: wrap">
                                                                                                                ${returnHTML}
                                                                                                                <div
                                                                                                                    class="position-absolute "
                                                                                                                    style="right:12px;top:50%;transform: translateY(-50%);"
                                                                                                                    onclick="${gvc.event(() => {
                                                                                                                        createPage.page = 'add';
                                                                                                                        editIndex = specIndex;
                                                                                                                        gvc.notifyDataChange(specid);
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

                                                                                            return html`
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
                                                                                                                    editIndex = -1;
                                                                                                                    gvc.notifyDataChange(specid);
                                                                                                                },
                                                                                                                save: () => {
                                                                                                                    editSpectPage[specIndex].type = 'show';
                                                                                                                    postMD.specs[specIndex] = temp;
                                                                                                                    checkSpecSingle();
                                                                                                                    updateVariants();
                                                                                                                    gvc.notifyDataChange(vm.id);
                                                                                                                },
                                                                                                            })}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            `;
                                                                                        },
                                                                                        divCreate: { class: `w-100 position-relative` },
                                                                                    }),
                                                                                    innerHtml: (gvc: GVC) => {
                                                                                        return ``;
                                                                                    },
                                                                                    editTitle: `編輯規格`,
                                                                                    draggable: editSpectPage[specIndex].type === 'show',
                                                                                };
                                                                            });
                                                                        },
                                                                    })}
                                                                `;
                                                            }
                                                            if (createPage.page == 'edit' && editIndex === -1) {
                                                                let temp: any = {
                                                                    title: '',
                                                                    option: [],
                                                                };
                                                                returnHTML += html`
                                                                    ${BgWidget.mainCard(html`
                                                                        <div style="display: flex;flex-direction: column;align-items: flex-end;gap: 18px;align-self: stretch;">
                                                                            <div style="width:100%;display: flex;flex-direction: column;align-items: flex-end;gap: 18px;">
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
                                                            } else {
                                                                returnHTML += html`
                                                                    <div
                                                                        style="width:100%;display:flex;align-items: center;justify-content: center;color: #36B;gap:6px;cursor: pointer;"
                                                                        onclick="${gvc.event(() => {
                                                                            editIndex = -1;
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

                                                            return returnHTML;
                                                        },
                                                        divCreate: {
                                                            class: `d-flex flex-column`,
                                                            style: `gap:18px;`,
                                                        },
                                                    };
                                                })
                                            ),
                                            postMD.specs.length == 0
                                                ? ''
                                                : BgWidget.mainCard(
                                                      html` <div style="font-size: 16px;font-weight: 700;color:#393939;margin-bottom: 18px;">規格設定</div>` +
                                                          obj.gvc.bindView(() => {
                                                              function getPreviewImage(img?: string) {
                                                                  return img || BgWidget.noImageURL;
                                                              }

                                                              postMD.specs[0].option = postMD.specs[0].option ?? [];
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
                                                                                                  return (dd as any).checked;
                                                                                              });

                                                                                              if (selected.length) {
                                                                                                  function saveQueue(key: string, value: any) {
                                                                                                      postMD.variants.filter((dd) => {
                                                                                                          if ((dd as any).checked) {
                                                                                                              if (key == 'volume') {
                                                                                                                  dd.v_length = value.v_length;
                                                                                                                  dd.v_width = value.v_width;
                                                                                                                  dd.v_height = value.v_height;
                                                                                                              }
                                                                                                              (dd as any)[key] = value;
                                                                                                          }
                                                                                                      });
                                                                                                      gvc.notifyDataChange('productInf');
                                                                                                      gvc.glitter.closeDiaLog();
                                                                                                  }

                                                                                                  function editDialog(type: string) {
                                                                                                      let inputTemp: any = {};
                                                                                                      switch (type) {
                                                                                                          case 'price': {
                                                                                                              inputTemp = 0;
                                                                                                              return html`
                                                                                                                  <div
                                                                                                                      style="cursor: pointer;display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;max-width: calc(100vw - 20px);"
                                                                                                                  >
                                                                                                                      <div
                                                                                                                          style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                      >
                                                                                                                          編輯售價
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
                                                                                                                          ${BgWidget.cancel(
                                                                                                                              gvc.event(() => {
                                                                                                                                  gvc.glitter.closeDiaLog();
                                                                                                                              })
                                                                                                                          )}
                                                                                                                          ${BgWidget.save(
                                                                                                                              gvc.event(() => {
                                                                                                                                  saveQueue('sale_price', inputTemp);
                                                                                                                              })
                                                                                                                          )}
                                                                                                                      </div>
                                                                                                                  </div>
                                                                                                              `;
                                                                                                          }
                                                                                                          case 'stock': {
                                                                                                              inputTemp = 0;
                                                                                                              return html` <div
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
                                                                                                                      ${BgWidget.cancel(
                                                                                                                          gvc.event(() => {
                                                                                                                              gvc.glitter.closeDiaLog();
                                                                                                                          })
                                                                                                                      )}
                                                                                                                      ${BgWidget.save(
                                                                                                                          gvc.event((e) => {
                                                                                                                              saveQueue('stock', inputTemp);
                                                                                                                          })
                                                                                                                      )}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                                          }

                                                                                                          case 'volume': {
                                                                                                              inputTemp = {
                                                                                                                  v_height: 0,
                                                                                                                  v_length: 0,
                                                                                                                  v_width: 0,
                                                                                                              };
                                                                                                              return html` <div
                                                                                                                  style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;cursor: pointer;max-width: calc(100vw - 20px);"
                                                                                                              >
                                                                                                                  <div
                                                                                                                      style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                                  >
                                                                                                                      編輯售價
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
                                                                                                                                  return html` <div
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
                                                                                                                      ${BgWidget.cancel(
                                                                                                                          gvc.event(() => {
                                                                                                                              gvc.glitter.closeDiaLog();
                                                                                                                          })
                                                                                                                      )}
                                                                                                                      ${BgWidget.save(
                                                                                                                          gvc.event(() => {
                                                                                                                              saveQueue('volume', inputTemp);
                                                                                                                          })
                                                                                                                      )}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                                          }
                                                                                                          case 'weight': {
                                                                                                              inputTemp = 0;
                                                                                                              return html` <div
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
                                                                                                                              <div style="white-space: nowrap;">單位</div>
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
                                                                                                                      ${BgWidget.cancel(
                                                                                                                          gvc.event(() => {
                                                                                                                              gvc.glitter.closeDiaLog();
                                                                                                                          })
                                                                                                                      )}
                                                                                                                      ${BgWidget.save(
                                                                                                                          gvc.event((e) => {
                                                                                                                              saveQueue('weight', inputTemp);
                                                                                                                          })
                                                                                                                      )}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                                          }
                                                                                                          case 'sku': {
                                                                                                              inputTemp = 0;
                                                                                                              return html` <div
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
                                                                                                                          let arrayHTML = ``;
                                                                                                                          postMD.specs[0].option.map((option: any) => {
                                                                                                                              option.sortQueue.map((data: any) => {
                                                                                                                                  if (data.select) {
                                                                                                                                      let name = data.spec.slice(1).join('/');
                                                                                                                                      arrayHTML += html`
                                                                                                                                          <div
                                                                                                                                              style="display: flex;padding: 0px 20px;align-items: center;align-self: stretch;width:100%"
                                                                                                                                          >
                                                                                                                                              <div style="width: 40%;">${name}</div>
                                                                                                                                              <input
                                                                                                                                                  value="${data.sku ?? ''}"
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
                                                                                                                      ${BgWidget.cancel(
                                                                                                                          gvc.event(() => {
                                                                                                                              gvc.glitter.closeDiaLog();
                                                                                                                          })
                                                                                                                      )}
                                                                                                                      ${BgWidget.save(
                                                                                                                          gvc.event((e) => {
                                                                                                                              saveQueue('weight', inputTemp);
                                                                                                                          })
                                                                                                                      )}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                                          }

                                                                                                          case 'delete': {
                                                                                                              return html` <div
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
                                                                                                                          ${BgWidget.cancel(
                                                                                                                              gvc.event(() => {
                                                                                                                                  gvc.glitter.closeDiaLog();
                                                                                                                              })
                                                                                                                          )}
                                                                                                                          ${BgWidget.save(
                                                                                                                              gvc.event(() => {
                                                                                                                                  postMD.specs[0].option.map((option: any) => {
                                                                                                                                      option.sortQueue = option.sortQueue.filter(
                                                                                                                                          (data: any) => !data.select
                                                                                                                                      );
                                                                                                                                  });
                                                                                                                                  saveQueue('delete', '');
                                                                                                                              })
                                                                                                                          )}
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
                                                                                                              return html` <div
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
                                                                                                                          return html`
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
                                                                                                                      ${BgWidget.cancel(
                                                                                                                          gvc.event(() => {
                                                                                                                              gvc.glitter.closeDiaLog();
                                                                                                                          })
                                                                                                                      )}
                                                                                                                      ${BgWidget.save(
                                                                                                                          gvc.event(() => {
                                                                                                                              saveQueue('shipment_type', inputTemp);
                                                                                                                          })
                                                                                                                      )}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                                          }
                                                                                                          case 'trace_stock_type': {
                                                                                                              inputTemp = 'volume';
                                                                                                              let windowsid = gvc.glitter.getUUID();
                                                                                                              return html` <div
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
                                                                                                                          return html`
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
                                                                                                                      ${BgWidget.cancel(
                                                                                                                          gvc.event(() => {
                                                                                                                              gvc.glitter.closeDiaLog();
                                                                                                                          })
                                                                                                                      )}
                                                                                                                      ${BgWidget.save(
                                                                                                                          gvc.event(() => {
                                                                                                                              saveQueue('trace_stock_type', inputTemp);
                                                                                                                          })
                                                                                                                      )}
                                                                                                                  </div>
                                                                                                              </div>`;
                                                                                                          }
                                                                                                      }
                                                                                                      return html` <div
                                                                                                          style="display: flex;width: 569px;padding-bottom: 20px;flex-direction: column;align-items: center;gap: 24px;border-radius: 10px;background: #FFF;"
                                                                                                      >
                                                                                                          <div
                                                                                                              style="font-size: 16px;font-weight: 700;display: flex;padding: 12px 0px 12px 20px;align-items: center;align-self: stretch;border-radius: 10px 10px 0px 0px;background: #F2F2F2;"
                                                                                                          >
                                                                                                              編輯售價
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
                                                                                                              ${BgWidget.cancel(
                                                                                                                  gvc.event(() => {
                                                                                                                      gvc.glitter.closeDiaLog();
                                                                                                                  })
                                                                                                              )}
                                                                                                              ${BgWidget.save(gvc.event(() => {}))}
                                                                                                          </div>
                                                                                                      </div>`;
                                                                                                  }

                                                                                                  return html`
                                                                                                      <div
                                                                                                          style="display: flex;height: 40px;padding: 8px 17px 8px 18px;align-items: center;justify-content: space-between;gap: 4px;align-self: stretch;border-radius: 10px;background: #F7F7F7;"
                                                                                                      >
                                                                                                          已選取 ${selected.length} 項
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
                                                                                                                  ? html`
                                                                                                                        <div
                                                                                                                            style="cursor: pointer;z-index:2;width:200px;gap:16px;color: #393939;font-size: 16px;font-weight: 400;position: absolute;right:-17px;top: calc(100% + 23px);display: flex;padding: 24px 24px 42px 24px;flex-direction: column;align-items: center;border-radius: 10px;border: 1px solid #DDD;background: #FFF;box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.15);"
                                                                                                                        >
                                                                                                                            <div
                                                                                                                                onclick="${gvc.event(() => {
                                                                                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                                                                                                                        return editDialog('price');
                                                                                                                                    }, 'edit');
                                                                                                                                })}"
                                                                                                                            >
                                                                                                                                編輯售價
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                                                                                                                        return editDialog('stock');
                                                                                                                                    }, '');
                                                                                                                                })}"
                                                                                                                            >
                                                                                                                                編輯存貨數量
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                                                                                                                        return editDialog('trace_stock_type');
                                                                                                                                    }, 'trace_stock_type');
                                                                                                                                })}"
                                                                                                                            >
                                                                                                                                編輯庫存政策
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                                                                                                                        return editDialog('shipment_type');
                                                                                                                                    }, 'shipment_type');
                                                                                                                                })}"
                                                                                                                            >
                                                                                                                                運費計算方式
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
                                                                                                                                        return editDialog('volume');
                                                                                                                                    }, 'volume');
                                                                                                                                })}"
                                                                                                                            >
                                                                                                                                編輯商品材積
                                                                                                                            </div>
                                                                                                                            <div
                                                                                                                                style="cursor: pointer;"
                                                                                                                                onclick="${gvc.event(() => {
                                                                                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
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
                                                                                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
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
                                                                                                                                    gvc.glitter.innerDialog((gvc: GVC) => {
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
                                                                                              return html`
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
                                                                                                                  (dd as any).checked = !selected.length;
                                                                                                              });
                                                                                                              gvc.notifyDataChange([variantsViewID]);
                                                                                                          })}"
                                                                                                      ></i>
                                                                                                      <div style="flex:1 0 0;font-size: 16px;font-weight: 400;">規格</div>
                                                                                                      ${document.body.clientWidth < 768
                                                                                                          ? html` <div style="color:#393939;font-size: 16px;font-weight: 400;" class="me-3">售價*</div>`
                                                                                                          : `${['售價*', '存貨數量*', '運費計算方式']
                                                                                                                .map((dd) => {
                                                                                                                    return html` <div
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
                                                                                                  function cartesianProductSort(arrays: string[][]): string[][] {
                                                                                                      const getCombinations = (arrays: string[][], index: number): string[][] => {
                                                                                                          if (index === arrays.length) {
                                                                                                              return [[]];
                                                                                                          }

                                                                                                          const currentArray = arrays[index];
                                                                                                          const nextCombinations = getCombinations(arrays, index + 1);

                                                                                                          const currentCombinations: string[][] = [];
                                                                                                          for (const value of currentArray) {
                                                                                                              for (const combination of nextCombinations) {
                                                                                                                  currentCombinations.push([value, ...combination]);
                                                                                                              }
                                                                                                          }

                                                                                                          return currentCombinations;
                                                                                                      };

                                                                                                      return getCombinations(arrays, 0);
                                                                                                  }

                                                                                                  function compareArrays(arr1: string[], arr2: string[]) {
                                                                                                      // 檢查陣列長度是否相同
                                                                                                      if (arr1.length !== arr2.length) {
                                                                                                          return false;
                                                                                                      }

                                                                                                      // 檢查每個位置上的元素是否相同
                                                                                                      for (let i = 0; i < arr1.length; i++) {
                                                                                                          if (arr1[i] !== arr2[i]) {
                                                                                                              return false;
                                                                                                          }
                                                                                                      }

                                                                                                      return true;
                                                                                                  }

                                                                                                  return postMD.specs[0].option
                                                                                                      .map((spec: any) => {
                                                                                                          const viewList = [];
                                                                                                          spec.expand = spec.expand ?? true;
                                                                                                          if (postMD.specs.length > 1) {
                                                                                                              let isCheck = !postMD.variants
                                                                                                                  .filter((dd) => {
                                                                                                                      return dd.spec[0] === spec.title;
                                                                                                                  })
                                                                                                                  .find((dd) => {
                                                                                                                      return !(dd as any).checked;
                                                                                                                  });
                                                                                                              viewList.push(html` <div
                                                                                                                  style="display: flex;padding: 8px 0px;align-items: center;border-radius: 10px;background: #FFF;width:100%;"
                                                                                                              >
                                                                                                                  <i
                                                                                                                      class="${isCheck ? `fa-solid fa-square-check` : `fa-regular fa-square`}"
                                                                                                                      style="width: 16px;height: 16px;margin-left:19px;margin-right:18px;cursor: pointer;color: ${isCheck
                                                                                                                          ? `#393939`
                                                                                                                          : `#DDD`};font-size: 18px;"
                                                                                                                      onclick="${gvc.event(() => {
                                                                                                                          postMD.variants
                                                                                                                              .filter((dd) => {
                                                                                                                                  return dd.spec[0] === spec.title;
                                                                                                                              })
                                                                                                                              .map((dd) => {
                                                                                                                                  (dd as any).checked = !isCheck;
                                                                                                                              });
                                                                                                                          gvc.notifyDataChange([vm.id, 'selectFunRow']);
                                                                                                                      })}"
                                                                                                                  ></i>
                                                                                                                  <div
                                                                                                                      style="flex:1 0 0;font-size: 16px;font-weight: 400;display: flex;align-items: center;
                                                                                                                              gap:${document.body.clientWidth < 800 ? 10 : 24}px;"
                                                                                                                  >
                                                                                                                      ${BgWidget.validImageBox({
                                                                                                                          gvc,
                                                                                                                          image: getPreviewImage(
                                                                                                                              postMD.variants.filter((dd) => dd.spec[0] === spec.title)[0].preview_image
                                                                                                                          ),
                                                                                                                          width: 50,
                                                                                                                          style: 'border-radius: 10px',
                                                                                                                      })}
                                                                                                                      <div
                                                                                                                          class="me-2"
                                                                                                                          style="display: flex;align-items: center;gap: 8px;cursor: pointer;overflow-wrap: anywhere;"
                                                                                                                          onclick="${gvc.event(() => {
                                                                                                                              spec.expand = !spec.expand;
                                                                                                                              gvc.notifyDataChange(vm.id);
                                                                                                                          })}"
                                                                                                                      >
                                                                                                                          ${spec.title}
                                                                                                                          ${spec.expand
                                                                                                                              ? html` <i class="fa-regular fa-chevron-up"></i>`
                                                                                                                              : html` <i class="fa-regular fa-chevron-down"></i>`}
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
                                                                                                                          return dd.key === 'sale_price' || document.body.clientWidth > 768;
                                                                                                                      })
                                                                                                                      .map((dd) => {
                                                                                                                          let minPrice = Infinity;
                                                                                                                          let maxPrice = 0;
                                                                                                                          let stock: number = 0;
                                                                                                                          postMD.variants
                                                                                                                              .filter((dd) => {
                                                                                                                                  return dd.spec[0] === spec.title;
                                                                                                                              })
                                                                                                                              .map((d1) => {
                                                                                                                                  minPrice = Math.min(d1.sale_price, minPrice);
                                                                                                                                  maxPrice = Math.max(d1.sale_price, maxPrice);
                                                                                                                                  stock = stock + parseInt(d1.stock as any, 10);
                                                                                                                              });
                                                                                                                          if (dd.key == 'sale_price') {
                                                                                                                              dd.title = `${minPrice} ~ ${maxPrice}`;
                                                                                                                          } else {
                                                                                                                              dd.title = `${stock}`;
                                                                                                                          }
                                                                                                                          return html` <div
                                                                                                                              style="color:#393939;font-size: 16px;font-weight: 400;width:  ${document
                                                                                                                                  .body.clientWidth > 800
                                                                                                                                  ? `20%;`
                                                                                                                                  : 'auto;max-width:140px;'}padding-right: ${document.body.clientWidth >
                                                                                                                              768
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
                                                                                                                                              (d1 as any)[dd.key] = e.value;
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
                                                                                                              (postMD.variants as any) = cartesianProductSort(
                                                                                                                  postMD.specs.map((item) => {
                                                                                                                      return item.option.map((item2: any) => item2.title);
                                                                                                                  })
                                                                                                              )
                                                                                                                  .map((item) => {
                                                                                                                      return postMD.variants.find((variant) => {
                                                                                                                          return compareArrays(variant.spec, item);
                                                                                                                      });
                                                                                                                  })
                                                                                                                  .filter((item) => item !== undefined) as variant[];

                                                                                                              viewList.push(
                                                                                                                  postMD.variants
                                                                                                                      .filter((dd) => {
                                                                                                                          return dd.spec[0] === spec.title;
                                                                                                                      })
                                                                                                                      .map((data, index) => {
                                                                                                                          const viewID = gvc.glitter.getUUID();
                                                                                                                          return gvc.bindView({
                                                                                                                              bind: viewID,
                                                                                                                              view: () => {
                                                                                                                                  return html`
                                                                                                                                      <div
                                                                                                                                          style="background-color: white;position:relative;display: flex;padding: 8px 0px;align-items: center;border-radius: 10px;width:100%;"
                                                                                                                                      >
                                                                                                                                          <div
                                                                                                                                              style="flex:1 0 0;font-size: 16px;font-weight: 400;gap:14px;display: flex;align-items: center;padding-left: ${postMD
                                                                                                                                                  .specs.length > 1 && document.body.clientWidth > 768
                                                                                                                                                  ? `32px`
                                                                                                                                                  : `12px`};"
                                                                                                                                              onclick="${gvc.event(() => {
                                                                                                                                                  postMD.variants.map((dd: any) => {
                                                                                                                                                      dd.editable = false;
                                                                                                                                                  });
                                                                                                                                                  (data as any).editable = true;
                                                                                                                                                  obj.vm.from = 'add';
                                                                                                                                                  obj.vm.type = 'editSpec';
                                                                                                                                              })}"
                                                                                                                                          >
                                                                                                                                              <i
                                                                                                                                                  class="${(data as any).checked
                                                                                                                                                      ? `fa-solid fa-square-check`
                                                                                                                                                      : `fa-regular fa-square`}"
                                                                                                                                                  style="width: 16px;height: 16px;margin-left:19px;margin-right:0px;cursor: pointer;color: ${(
                                                                                                                                                      data as any
                                                                                                                                                  ).checked
                                                                                                                                                      ? `#393939`
                                                                                                                                                      : `#DDD`};font-size: 18px;"
                                                                                                                                                  onclick="${gvc.event((e, event) => {
                                                                                                                                                      (data as any).checked = !(data as any).checked;
                                                                                                                                                      event.stopPropagation();
                                                                                                                                                      gvc.notifyDataChange([vm.id, 'selectFunRow']);
                                                                                                                                                  })}"
                                                                                                                                              ></i>
                                                                                                                                              ${BgWidget.validImageBox({
                                                                                                                                                  gvc,
                                                                                                                                                  image: getPreviewImage(data.preview_image),
                                                                                                                                                  width: 40,
                                                                                                                                                  style: 'border-radius: 10px',
                                                                                                                                              })}
                                                                                                                                              <div class="hover-underline">
                                                                                                                                                  <span>
                                                                                                                                                      ${Tool.truncateString(
                                                                                                                                                          data.spec.join(' / '),
                                                                                                                                                          14
                                                                                                                                                      )}</span
                                                                                                                                                  >
                                                                                                                                              </div>
                                                                                                                                          </div>
                                                                                                                                          ${['sale_price', 'stock']
                                                                                                                                              .filter((dd) => {
                                                                                                                                                  return (
                                                                                                                                                      dd === 'sale_price' ||
                                                                                                                                                      document.body.clientWidth > 768
                                                                                                                                                  );
                                                                                                                                              })
                                                                                                                                              .map((dd) => {
                                                                                                                                                  return html` <div
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
                                                                                                                                                          value="${(data as any)[dd] ?? 0}"
                                                                                                                                                          min="0"
                                                                                                                                                          oninput="${gvc.event((e) => {
                                                                                                                                                              const regex = /^[0-9]*$/;
                                                                                                                                                              if (!regex.test(e.value)) {
                                                                                                                                                                  e.value = e.value
                                                                                                                                                                      .replace(/[^0-9]/g, '')
                                                                                                                                                                      .replace(/e/gi, '');
                                                                                                                                                              }
                                                                                                                                                          })}"
                                                                                                                                                          onchange="${gvc.event((e) => {
                                                                                                                                                              (data as any)[dd] = e.value;
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
                                                                                                                                  class: `w-100 ${viewID} ${
                                                                                                                                      index === 0 && postMD.specs.length > 1 ? `border-top` : ``
                                                                                                                                  }`,
                                                                                                                              },
                                                                                                                          });
                                                                                                                      })
                                                                                                                      .join('<div class="border-bottom my-1 w-100"></div>')
                                                                                                              );
                                                                                                          }

                                                                                                          return viewList.join('');
                                                                                                      })
                                                                                                      .join('<div class="border-bottom mx-n2 my-1 w-100"></div>');
                                                                                              },
                                                                                              divCreate: {},
                                                                                          };
                                                                                      }),
                                                                                  ].join('');
                                                                              } catch (e) {
                                                                                  return `${e}`;
                                                                              }
                                                                          },
                                                                          divCreate: {},
                                                                      });
                                                                  },
                                                                  divCreate: {
                                                                      class: '',
                                                                      style: 'overflow: visible;',
                                                                  },
                                                              };
                                                          })
                                                  ),
                                            BgWidget.mainCard(
                                                obj.gvc.bindView(() => {
                                                    const id = gvc.glitter.getUUID();
                                                    return {
                                                        bind: id,
                                                        view: () => {
                                                            postMD.relative_product = postMD.relative_product ?? [];
                                                            try {
                                                                return html`
                                                                    <div style="font-weight: 700;" class="mb-3 d-flex flex-column">相關商品 ${BgWidget.grayNote('相關商品將會顯示於商品頁底部')}</div>
                                                                    <div class="d-flex align-items-center gray-bottom-line-18" style="gap: 24px; justify-content: space-between;">
                                                                        <div class="form-check-label c_updown_label">
                                                                            <div class="tx_normal">商品列表</div>
                                                                        </div>
                                                                        ${BgWidget.grayButton(
                                                                            '選擇商品',
                                                                            gvc.event(() => {
                                                                                BgProduct.productsDialog({
                                                                                    gvc: gvc,
                                                                                    default: postMD.relative_product,
                                                                                    callback: async (value) => {
                                                                                        postMD.relative_product = value;
                                                                                        gvc.notifyDataChange(id);
                                                                                    },
                                                                                    filter: (dd) => {
                                                                                        return dd.key !== postMD.id;
                                                                                    },
                                                                                });
                                                                            }),
                                                                            { textStyle: 'font-weight: 400;' }
                                                                        )}
                                                                    </div>
                                                                    ${gvc.bindView(() => {
                                                                        const vm: {
                                                                            id: string;
                                                                            loading: boolean;
                                                                            data: OptionsItem[];
                                                                        } = {
                                                                            id: gvc.glitter.getUUID(),
                                                                            loading: true,
                                                                            data: [],
                                                                        };
                                                                        BgProduct.getProductOpts(postMD.relative_product).then((res) => {
                                                                            vm.data = res;
                                                                            vm.loading = false;
                                                                            gvc.notifyDataChange(vm.id);
                                                                        });
                                                                        return {
                                                                            bind: vm.id,
                                                                            view: async () => {
                                                                                if (vm.loading) {
                                                                                    return BgWidget.spinner();
                                                                                }
                                                                                return vm.data
                                                                                    .map((opt: OptionsItem, index) => {
                                                                                        return html` <div class="d-flex align-items-center form-check-label c_updown_label gap-3">
                                                                                            <span class="tx_normal">${index + 1} .</span>
                                                                                            ${BgWidget.validImageBox({
                                                                                                gvc: gvc,
                                                                                                image: opt.image,
                                                                                                width: 40,
                                                                                            })}
                                                                                            <div class="tx_normal ${opt.note ? 'mb-1' : ''}">${opt.value}</div>
                                                                                            ${opt.note ? html` <div class="tx_gray_12">${opt.note}</div> ` : ''}
                                                                                        </div>`;
                                                                                    })
                                                                                    .join('');
                                                                            },
                                                                            divCreate: {
                                                                                class: `d-flex py-2 flex-column`,
                                                                                style: `gap:10px;`,
                                                                            },
                                                                        };
                                                                    })}
                                                                `;
                                                            } catch (e) {
                                                                console.error(e);
                                                                return '';
                                                            }
                                                        },
                                                        divCreate: {
                                                            class: `w-100`,
                                                        },
                                                    };
                                                })
                                            ),
                                            BgWidget.mainCard(
                                                obj.gvc.bindView(() => {
                                                    postMD.seo = postMD.seo ?? {
                                                        title: '',
                                                        content: '',
                                                    };

                                                    return {
                                                        bind: 'seo',
                                                        view: () => {
                                                            try {
                                                                postMD.seo.domain = postMD.seo.domain || postMD.title;
                                                                const href = `https://${(window.parent as any).glitter.share.editorViewModel.domain}/products`;
                                                                return html` <div style="font-weight: 700;" class="mb-3">搜尋引擎列表</div>
                                                                    ${[
                                                                        html` <div class="tx_normal fw-normal mb-2" style="">商品網址</div>`,
                                                                        html` <div
                                                                            style="  justify-content: flex-start; align-items: center; display: inline-flex;border:1px solid #EAEAEA;border-radius: 10px;overflow: hidden; ${document
                                                                                .body.clientWidth > 768
                                                                                ? 'gap: 18px; '
                                                                                : 'flex-direction: column; gap: 0px; '}"
                                                                            class="w-100"
                                                                        >
                                                                            <div
                                                                                style="padding: 9px 18px;background: #EAEAEA;  align-items: center; gap: 5px; display: flex;${document.body
                                                                                    .clientWidth < 800
                                                                                    ? `font-size:14px;width:100%;justify-content: start;`
                                                                                    : `font-size: 16px;justify-content: center;`}"
                                                                            >
                                                                                <div style="text-align: right; color: #393939;  font-family: Noto Sans; font-weight: 400; word-wrap: break-word">
                                                                                    ${href}/
                                                                                </div>
                                                                            </div>
                                                                            <input
                                                                                class="flex-fill"
                                                                                style="border:none;background:none;text-align: start; color: #393939; font-size: 16px; font-family: Noto Sans; font-weight: 400; word-wrap: break-word;${document
                                                                                    .body.clientWidth > 768
                                                                                    ? ''
                                                                                    : 'padding: 9px 18px;width:100%;'}"
                                                                                placeholder="請輸入商品連結"
                                                                                value="${postMD.seo.domain || ''}"
                                                                                onchange="${gvc.event((e) => {
                                                                                    let text = e.value;
                                                                                    if (!CheckInput.isChineseEnglishNumberHyphen(text)) {
                                                                                        const dialog = new ShareDialog(gvc.glitter);
                                                                                        dialog.infoMessage({ text: '連結僅限使用中英文數字與連接號' });
                                                                                    } else {
                                                                                        postMD.seo.domain = text;
                                                                                    }
                                                                                    gvc.notifyDataChange('seo');
                                                                                })}"
                                                                            />
                                                                        </div>`,
                                                                        html` <div class="mt-2 mb-1">
                                                                            <span class="tx_normal me-1">網址預覽</span>
                                                                            ${BgWidget.greenNote(
                                                                                href + `/${postMD.seo.domain}`,
                                                                                gvc.event(() => {
                                                                                    (window.parent as any).glitter.openNewTab(href + `/${postMD.seo.domain}`);
                                                                                })
                                                                            )}
                                                                        </div>`,
                                                                    ].join('')}
                                                                    <div class="w-100" style="margin: 18px 0 8px;">SEO標題</div>
                                                                    <input
                                                                        value="${postMD.seo.title ?? ''}"
                                                                        style="width: 100%;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        onchange="${gvc.event((e) => {
                                                                            postMD.seo.title = e.value;
                                                                            obj.gvc.notifyDataChange('seo');
                                                                        })}"
                                                                    />
                                                                    <div class="w-100" style="margin: 18px 0 8px;">SEO描述</div>
                                                                    <textarea
                                                                        rows="4"
                                                                        value="${postMD.seo.content ?? ''}"
                                                                        style="width: 100%;padding: 9px 18px;border-radius: 10px;border: 1px solid #DDD;"
                                                                        onchange="${gvc.event((e) => {
                                                                            postMD.seo.content = e.value;
                                                                            obj.gvc.notifyDataChange('seo');
                                                                        })}"
                                                                    >
${postMD.seo.content ?? ''}</textarea
                                                                    >`;
                                                            } catch (e) {
                                                                console.error(e);
                                                                return '';
                                                            }
                                                        },
                                                    };
                                                })
                                            ),
                                        ]
                                            .filter((str) => str.length > 0)
                                            .join(BgWidget.mbContainer(24)),
                                        ratio: 77,
                                    },
                                    {
                                        html: html` <div class="summary-card p-0">
                                            ${[
                                                BgWidget.mainCard(
                                                    html`
                                                        <div style="font-weight: 700;" class="mb-2">商品類型</div>
                                                        <div style="font-weight: 400;" class="mb-2">${this.getProductTypeString(postMD)}</div>
                                                    `
                                                ),
                                                BgWidget.mainCard(
                                                    html` <div style="font-weight: 700;" class="mb-2">商品狀態</div>` +
                                                        EditorElem.select({
                                                            gvc: obj.gvc,
                                                            title: '',
                                                            def: postMD.status,
                                                            array: [
                                                                { title: '啟用', value: 'active' },
                                                                { title: '草稿', value: 'draft' },
                                                            ],
                                                            callback: (text: any) => {
                                                                postMD.status = text;
                                                            },
                                                        })
                                                ),
                                                // BgWidget.mainCard(
                                                //     html` <div style="font-weight: 700;" class="mb-2">商品顯示</div>` +
                                                //         BgWidget.grayNote('當商品設定為隱藏時，僅能顯示於隱形賣場與一頁商店當中') +
                                                //         html` <div class="my-2"></div>` +
                                                //         EditorElem.select({
                                                //             gvc: obj.gvc,
                                                //             title: '',
                                                //             def: postMD.visible || 'true',
                                                //             array: [
                                                //                 { title: '顯示', value: 'true' },
                                                //                 { title: '隱藏', value: 'false' },
                                                //             ],
                                                //             callback: (text: any) => {
                                                //                 postMD.visible = text;
                                                //             },
                                                //         })
                                                // ),
                                                // BgWidget.mainCard(
                                                //     html` <div style="font-weight: 700;" class="mb-2">商品類型</div>` +
                                                //         gvc.bindView({
                                                //             bind: 'productType',
                                                //             view: () => {
                                                //                 postMD.productType = postMD.productType ?? {
                                                //                     product: true,
                                                //                     addProduct: false,
                                                //                     giveaway: false,
                                                //                 };
                                                //                 return ['product', 'addProduct', 'giveaway']
                                                //                     .map((dd, index) => {
                                                //                         return html` <div
                                                //                             class="d-flex align-items-center"
                                                //                             style="gap:6px;cursor: pointer;"
                                                //                             onclick="${gvc.event(() => {
                                                //                                 (postMD!.productType as any)[dd] = !(postMD!.productType as any)[dd];
                                                //                                 gvc.notifyDataChange('productType');
                                                //                             })}"
                                                //                         >
                                                //                             ${(postMD!.productType as any)[dd]
                                                //                                 ? html` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                //                                       <rect width="16" height="16" rx="3" fill="#393939" />
                                                //                                       <path d="M4.5 8.5L7 11L11.5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                //                                   </svg>`
                                                //                                 : html` <div style="width: 16px;height: 16px;border-radius: 3px;border: 1px solid #DDD;"></div> `}
                                                //                             ${['商品', '加購品', '贈品'][index]}
                                                //                         </div>`;
                                                //                     })
                                                //                     .join('');
                                                //             },
                                                //             divCreate: {
                                                //                 class: `d-flex flex-column `,
                                                //                 style: 'gap:12px;',
                                                //             },
                                                //         }),
                                                //     ''
                                                // ),
                                                BgWidget.mainCard(
                                                    obj.gvc.bindView(() => {
                                                        const id = obj.gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return [
                                                                    html` <div style="font-weight: 700;" class="mb-2">商品分類</div>`,
                                                                    postMD.collection
                                                                        .map((dd, index) => {
                                                                            return `<span style="font-size: 14px;">${dd}</span>`;
                                                                        })
                                                                        .join(`<div class="my-1"></div>`),
                                                                    html` <div class="w-100 mt-3">
                                                                        ${BgWidget.darkButton(
                                                                            `設定商品分類`,
                                                                            gvc.event(() => {
                                                                                BgProduct.collectionsDialog({
                                                                                    gvc: gvc,
                                                                                    default: postMD.collection.map((dd) => {
                                                                                        return dd;
                                                                                    }),
                                                                                    callback: async (value) => {
                                                                                        postMD.collection = value;
                                                                                        gvc.notifyDataChange(id);
                                                                                    },
                                                                                });
                                                                            }),
                                                                            {
                                                                                style: 'width:100%;',
                                                                            }
                                                                        )}
                                                                    </div>`,
                                                                ].join('');
                                                            },
                                                            divCreate: {},
                                                        };
                                                    })
                                                ),
                                                BgWidget.mainCard(
                                                    obj.gvc.bindView(() => {
                                                        const id = obj.gvc.glitter.getUUID();
                                                        return {
                                                            bind: id,
                                                            view: () => {
                                                                return [
                                                                    `<div style="font-weight: 700;" class="mb-2">AI 選品</div>`,
                                                                    BgWidget.grayNote(postMD.ai_description || '尚未設定描述語句，透過設定描述語句，可以幫助AI更準確的定位產品。'),
                                                                    `<div class="my-2"></div>`,
                                                                    BgWidget.darkButton(
                                                                        `設定描述語句`,
                                                                        gvc.event(() => {
                                                                            function refresh() {
                                                                                gvc.notifyDataChange(id);
                                                                            }

                                                                            let description = postMD.ai_description;
                                                                            BgWidget.settingDialog({
                                                                                gvc: gvc,
                                                                                title: '描述語句',
                                                                                innerHTML: (gvc) => {
                                                                                    return BgWidget.textArea({
                                                                                        gvc: gvc,
                                                                                        title: '',
                                                                                        default: postMD.ai_description || '',
                                                                                        placeHolder: `請告訴我這是什麼商品，範例:現代極簡風格的淺灰色布藝沙發，可以同時乘坐3個人，配金屬腳座，採用鈦合金製作十分的堅固。`,
                                                                                        callback: (text) => {
                                                                                            description = text;
                                                                                        },
                                                                                        style: `min-height:100px;`,
                                                                                    });
                                                                                },
                                                                                footer_html: (gvc) => {
                                                                                    return [
                                                                                        BgWidget.save(
                                                                                            gvc.event(() => {
                                                                                                postMD.ai_description = description;
                                                                                                refresh();
                                                                                                gvc.closeDialog();
                                                                                            })
                                                                                        ),
                                                                                    ].join('');
                                                                                },
                                                                            });
                                                                        }),
                                                                        {
                                                                            style: 'width:100%;',
                                                                        }
                                                                    ),
                                                                ].join('');
                                                            },
                                                        };
                                                    })
                                                ),
                                            ]
                                                .filter((str) => str.length > 0)
                                                .join(BgWidget.mbContainer(24))}
                                        </div>`,
                                        ratio: 23,
                                    }
                                )}
                            `
                        ),
                        html` <div class="update-bar-container">
                            ${obj.type === 'replace'
                                ? BgWidget.danger(
                                      obj.gvc.event(() => {
                                          const dialog = new ShareDialog(obj.gvc.glitter);
                                          dialog.checkYesOrNot({
                                              text: '是否確認刪除商品?',
                                              callback: (response) => {
                                                  if (response) {
                                                      dialog.dataLoading({ visible: true });
                                                      ApiShop.delete({
                                                          id: postMD.id!,
                                                      }).then((res) => {
                                                          dialog.dataLoading({ visible: false });
                                                          if (res.result) {
                                                              obj.vm.type = 'list';
                                                          } else {
                                                              dialog.errorMessage({ text: '刪除失敗' });
                                                          }
                                                      });
                                                  }
                                              },
                                          });
                                      }),
                                      '刪除商品'
                                  )
                                : ''}
                            ${BgWidget.cancel(
                                obj.gvc.event(() => {
                                    obj.vm.type = 'list';
                                })
                            )}
                            ${BgWidget.save(
                                obj.gvc.event(() => {
                                    setTimeout(() => {
                                        function checkEmpty() {
                                            const checkList = ['title'];
                                            const variantsCheckList = ['sale_price'];
                                            const dialog = new ShareDialog(gvc.glitter);

                                            const obj = checkList.find((checkItem) => {
                                                return (postMD as any)[checkItem] == undefined || (postMD as any)[checkItem].length == 0;
                                            });
                                            for (const checkItem of checkList) {
                                                if ((postMD as any)[checkItem] == undefined || (postMD as any)[checkItem].length == 0) {
                                                    dialog.infoMessage({
                                                        text: '商品名稱未填',
                                                    });
                                                    return false;
                                                }
                                            }
                                            for (const checkItem of variantsCheckList) {
                                                if ((postMD['variants'][0] as any)[checkItem] == undefined || (postMD['variants'][0] as any)[checkItem] == 0) {
                                                    dialog.infoMessage({
                                                        text: '售價未填',
                                                    });
                                                    return false;
                                                }
                                            }
                                            if (postMD['variants'][0]['shipment_type'] != 'none') {
                                                if (postMD['variants'][0]['shipment_type'] == 'weight') {
                                                    if (postMD['variants'][0]['weight'] == undefined || postMD['variants'][0]['weight'] == 0) {
                                                        dialog.infoMessage({
                                                            text: '商品重量未填',
                                                        });
                                                        return false;
                                                    }
                                                }
                                                if (postMD['variants'][0]['shipment_type'] == 'volume') {
                                                    if (
                                                        postMD['variants'][0]['v_height'] == undefined ||
                                                        postMD['variants'][0]['v_height'] == 0 ||
                                                        postMD['variants'][0]['v_width'] == undefined ||
                                                        postMD['variants'][0]['v_width'] == 0 ||
                                                        postMD['variants'][0]['v_length'] == undefined ||
                                                        postMD['variants'][0]['v_length'] == 0
                                                    ) {
                                                        dialog.infoMessage({
                                                            text: '商品材積資訊未填',
                                                        });
                                                        return false;
                                                    }
                                                }
                                            }
                                            return true;
                                        }

                                        if (checkEmpty()) {
                                            if (postMD.id) {
                                                ShoppingProductSetting.putEvent(postMD, obj.gvc, obj.vm);
                                            } else {
                                                ShoppingProductSetting.postEvent(postMD, obj.gvc, obj.vm);
                                            }
                                        } else {
                                            // const dialog = new ShareDialog(gvc.glitter)
                                        }
                                    }, 500);
                                }),
                                '儲存',
                                'guide5-8'
                            )}
                        </div>`,
                    ].join('');
                },
                divCreate: {
                    class: `d-flex`,
                    style: `font-size: 16px;color:#393939;position: relative;padding-bottom:240px;`,
                },
            };
        });
    }

    public static specInput(
        gvc: GVC,
        temp: any,
        cb: {
            cancel: () => void;
            save: () => void;
        }
    ) {
        const html = String.raw;
        const vm = {
            viewId: Tool.randomString(7),
            enterId: Tool.randomString(7),
        };
        let keyboard = '';
        return html` <div class="bg-white w-100">
            ${[
                html` <div class="w-100" style="display: flex;gap: 8px;flex-direction: column;">
                    <div style="width: 70px">規格種類</div>
                    <input
                        class="w-100"
                        style="height: 40px;padding: 0px 18px;border-radius: 10px;border: 1px solid #DDD;"
                        placeholder="例如 : 顏色、大小"
                        value="${temp.title}"
                        onchange="${gvc.event((e) => {
                            temp.title = e?.value ?? '';
                        })}"
                    />
                </div>`,
                gvc.bindView({
                    bind: vm.viewId,
                    view: () => {
                        return html`
                            <div class="w-100" style="margin-top: 8px;">選項 (輸入完請按enter)</div>
                            <div
                                class="w-100 d-flex align-items-center position-relative"
                                style="line-height: 40px;min-height: 40px;padding: 10px 18px;border-radius: 10px;border: 1px solid #DDD;gap: 10px; flex-wrap: wrap;"
                            >
                                <div class="d-flex align-items-center" style="gap: 10px; flex-wrap: wrap;">
                                    ${(() => {
                                        const tempHTML = [];
                                        temp.option.map((data: any, index: number) => {
                                            tempHTML.push(
                                                html`
                                                    <div
                                                        class="d-flex align-items-center"
                                                        style="height: 24px;border-radius: 5px;background: #F2F2F2;display: flex;padding: 1px 6px;justify-content: center;align-items: center;gap: 4px;"
                                                    >
                                                        ${data.title}<i
                                                            class="fa-solid fa-xmark ms-1 fs-5"
                                                            style="font-size: 12px;cursor: pointer;"
                                                            onclick="${gvc.event(() => {
                                                                temp.option.splice(index, 1);
                                                                gvc.notifyDataChange(vm.viewId);
                                                            })}"
                                                        ></i>
                                                    </div>
                                                `
                                            );
                                        });
                                        tempHTML.push(html`<input
                                            id="${vm.enterId}"
                                            class="flex-fill d-flex align-items-center border-0 specInput-${vm.enterId} h-100"
                                            value=""
                                            placeholder="${temp.option.length > 0 ? '請繼續輸入' : ''}"
                                        />`);
                                        return tempHTML.join('');
                                    })()}
                                </div>
                                <div
                                    class="d-flex align-items-center ${temp.option.length > 0 ? 'd-none' : ''}"
                                    style="color: #8D8D8D;width: 100%;height:100%;position: absolute;left: 18px;top: 0"
                                    onclick="${gvc.event((e) => {
                                        e.classList.add('d-none');
                                        setTimeout(() => {
                                            (document.querySelector('.specInput-${vm.enterId}') as HTMLButtonElement)!.focus();
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
                        let enterPass = true;
                        const inputElement = document.getElementById(vm.enterId) as any;
                        gvc.glitter.share.keyDownEvent = gvc.glitter.share.keyDownEvent ?? {};

                        keyboard === 'Enter' && inputElement && inputElement.focus();

                        inputElement.addEventListener('compositionupdate', function () {
                            enterPass = false;
                        });

                        inputElement.addEventListener('compositionend', function () {
                            enterPass = true;
                        });

                        document.removeEventListener('keydown', gvc.glitter.share.keyDownEvent[vm.enterId]);

                        gvc.glitter.share.keyDownEvent[vm.enterId] = (event: any) => {
                            keyboard = event.key;
                            if (enterPass && inputElement && inputElement.value.length > 0 && event.key === 'Enter') {
                                setTimeout(() => {
                                    temp.option.push({
                                        title: inputElement.value,
                                    });
                                    inputElement.value = '';
                                    temp.option = temp.option.reduce(
                                        (
                                            acc: { title: string }[],
                                            current: {
                                                title: string;
                                            }
                                        ) => {
                                            const isTitleExist = acc.find((item) => item.title === current.title);
                                            if (!isTitleExist) {
                                                acc.push(current);
                                            }
                                            return acc;
                                        },
                                        []
                                    );
                                    gvc.notifyDataChange(vm.viewId);
                                }, 30);
                            }
                        };

                        document.addEventListener('keydown', gvc.glitter.share.keyDownEvent[vm.enterId]);
                    },
                }),
                html` <div class="d-flex w-100 justify-content-end align-items-center w-100 bg-white" style="gap:14px; margin-top: 12px;">
                    ${BgWidget.cancel(
                        gvc.event(() => {
                            cb.cancel();
                        })
                    )}
                    ${BgWidget.save(
                        gvc.event(() => {
                            cb.save();
                        }),
                        '完成'
                    )}
                </div>`,
            ].join('')}
        </div>`;
    }

    public static putEvent(postMD: any, gvc: GVC, vm: any) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ text: '商品上傳中...', visible: true });
        postMD.type = 'product';
        ApiShop.putProduct({
            data: postMD,
            token: (window.parent as any).config.token,
        }).then((re) => {
            dialog.dataLoading({ visible: false });
            if (re.result) {
                dialog.successMessage({ text: `更改成功` });
                vm.type = 'list';
            } else if (re.response.data.code === '733') {
                dialog.errorMessage({ text: `此網域已被使用` });
            } else {
                dialog.errorMessage({ text: `上傳失敗` });
            }
        });
    }

    public static postEvent(postMD: any, gvc: GVC, vm: any) {
        const dialog = new ShareDialog(gvc.glitter);
        dialog.dataLoading({ text: '商品上傳中...', visible: true });
        postMD.type = 'product';
        ApiShop.postProduct({
            data: postMD,
            token: (window.parent as any).config.token,
        }).then((re) => {
            dialog.dataLoading({ visible: false });
            if (re.result) {
                dialog.successMessage({ text: `上傳成功` });
                vm.type = 'list';
            } else if (re.response.data.code === '733') {
                dialog.errorMessage({ text: `此網域已被使用` });
            } else {
                dialog.errorMessage({ text: `上傳失敗` });
            }
        });
    }

    public static getProductTypeString(product: any) {
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
}

(window as any).glitter.setModule(import.meta.url, ShoppingProductSetting);
