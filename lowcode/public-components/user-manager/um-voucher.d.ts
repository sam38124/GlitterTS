import { GVC } from '../../glitterBundle/GVController.js';
export interface VoucherContent {
    id: number;
    for: string;
    code: string;
    rule: string;
    type: string;
    title: string;
    value: string;
    device: string[];
    forKey: any[];
    method: string;
    status: number;
    target: string;
    userID: number;
    endDate: string;
    endTime: string;
    overlay: boolean;
    trigger: string;
    counting: string;
    ruleValue: number;
    startDate: string;
    startTime: string;
    reBackType: string;
    targetList: any[];
    end_ISO_Date: string;
    macroLimited: number;
    microLimited: number;
    rebateEndDay: string;
    conditionType: string;
    start_ISO_Date: string;
    language: 'en-US' | 'zh-CN' | 'zh-TW';
}
export interface Voucher {
    id: number;
    userID: number;
    content: VoucherContent;
    created_time: string;
    updated_time: string;
    status: number;
}
export declare class UMVoucher {
    static main(gvc: GVC, widget: any, subData: any): string;
    static getVoucherTextList(gvc: GVC, voucherData: VoucherContent): any;
    static isNowBetweenDates(startIso: string, endIso: string): boolean;
}
