var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Excel {
    static loadXLSX(gvc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (window.XLSX)
                return window.XLSX;
            const XLSX = yield new Promise((resolve, reject) => {
                gvc.addMtScript([{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }], () => {
                    resolve(window.XLSX);
                }, reject);
            });
            return XLSX;
        });
    }
    static downloadExcel(gvc, printArray, fileName, tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const XLSX = yield this.loadXLSX(gvc);
            const worksheet = XLSX.utils.json_to_sheet(printArray);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, tableName);
            XLSX.writeFile(workbook, fileName);
        });
    }
    static parseExcelToJson(gvc, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const XLSX = yield Excel.loadXLSX(gvc);
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = event => {
                    var _a;
                    try {
                        const data = new Uint8Array((_a = event.target) === null || _a === void 0 ? void 0 : _a.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(sheet);
                        resolve(jsonData);
                    }
                    catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = error => reject(error);
                reader.readAsArrayBuffer(file);
            });
        });
    }
}
