import { GVC } from '../../glitterBundle/GVController.js';

export class Excel {
  // 載入 XLSX 方法
  static async loadXLSX(gvc: GVC) {
    if ((window as any).XLSX) return (window as any).XLSX;

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

  // 輸出 Excel
  static async downloadExcel(gvc: GVC, printArray: any[], fileName: string, tableName: string) {
    const XLSX = await this.loadXLSX(gvc);

    // 將 JSON 轉換為工作表
    const worksheet = XLSX.utils.json_to_sheet(printArray);

    // 建立工作簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tableName);

    // 生成 Excel 檔案並下載
    XLSX.writeFile(workbook, fileName);
  }
}
