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
import { ApiUser } from '../../glitter-base/route/user.js';
export class UserExcel {
    static loadXLSX(gvc) {
        return __awaiter(this, void 0, void 0, function* () {
            const XLSX = yield new Promise((resolve, reject) => {
                gvc.addMtScript([{ src: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js' }], () => {
                    resolve(window.XLSX);
                }, reject);
            });
            return XLSX;
        });
    }
    static export(gvc, vm) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = new ShareDialog(gvc.glitter);
            const dateFormat = gvc.glitter.ut.dateFormat;
            const XLSX = yield this.loadXLSX(gvc);
            function exportUsersToExcel(users) {
                if (users.length === 0) {
                    dialog.errorMessage({ text: '無會員資料可以匯出' });
                    return;
                }
                const jsonArray = users.map((user) => {
                    var _a;
                    return {
                        ID: user.id,
                        會員編號: user.userID,
                        顧客名稱: user.userData.name,
                        電子信箱: user.userData.email,
                        電話: user.userData.phone,
                        生日: user.userData.birth,
                        地址: user.userData.address,
                        性別: user.userData.gender,
                        手機載具: user.userData.carrier_number,
                        統一編號: user.userData.gui_number,
                        公司: user.company || user.userData.company,
                        收貨人: user.userData.consignee_name,
                        收貨人地址: user.userData.consignee_address,
                        收貨人電子郵件: user.userData.consignee_email,
                        收貨人手機: user.userData.consignee_phone,
                        顧客備註: user.userData.managerNote,
                        黑名單: user.status === 1 ? '否' : '是',
                        會員等級: user.tag_name,
                        會員有效期: user.member_deadline ? dateFormat(new Date(user.member_deadline), 'yyyy-MM-dd hh:mm') : '',
                        註冊時間: dateFormat(new Date(user.created_time), 'yyyy-MM-dd hh:mm:ss'),
                        現有購物金: user.rebate,
                        'LINE UID': user.userData.lineID,
                        'FB UID': user.userData['fb-id'],
                        最後購買日期: dateFormat(new Date(user.latest_order_date), 'yyyy-MM-dd hh:mm:ss'),
                        最後消費金額: user.latest_order_total,
                        累積消費金額: user.checkout_total,
                        累積消費次數: user.checkout_count,
                        會員標籤: ((_a = user.userData.tags) !== null && _a !== void 0 ? _a : []).join(','),
                    };
                });
                const worksheet = XLSX.utils.json_to_sheet(jsonArray);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, '顧客列表');
                const fileName = `顧客列表_${dateFormat(new Date(), 'yyyyMMddhhmmss')}.xlsx`;
                XLSX.writeFile(workbook, fileName);
            }
            dialog.checkYesOrNot({
                text: '系統將會依當前篩選條件匯出會員資料<br/>確定要匯出嗎？',
                callback: (bool) => {
                    if (bool) {
                        dialog.dataLoading({ visible: true });
                        ApiUser.getUserListOrders({
                            page: 0,
                            limit: 99999,
                            search: vm.query || undefined,
                            searchType: vm.queryType || 'name',
                            orderString: vm.orderString || '',
                            filter: vm.filter,
                            filter_type: 'excel',
                            group: vm.group,
                        }).then((d) => {
                            dialog.dataLoading({ visible: false });
                            if (d.response && d.response.total > 0) {
                                exportUsersToExcel(d.response.data);
                            }
                            else {
                                dialog.errorMessage({ text: '匯出檔案發生錯誤' });
                            }
                        });
                    }
                },
            });
        });
    }
}
