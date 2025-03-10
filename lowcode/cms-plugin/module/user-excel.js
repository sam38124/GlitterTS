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
                const jsonArray = users.map(user => {
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
                        最後出貨日期: user.firstShipment
                            ? dateFormat(new Date(user.firstShipment.orderData.user_info.shipment_date), 'yyyy-MM-dd hh:mm')
                            : '無',
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
                callback: bool => {
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
                        }).then(d => {
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
    static import(gvc, callback) {
        const dialog = new ShareDialog(gvc.glitter);
        const id = 'import-user-excel';
        const fileInput = document.createElement('input');
        fileInput.id = id;
        fileInput.type = 'file';
        fileInput.accept = '.xlsx, .xls';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        fileInput.addEventListener('change', function (event) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const target = event.target;
                if ((_a = target.files) === null || _a === void 0 ? void 0 : _a.length) {
                    try {
                        const jsonData = yield UserExcel.parseExcelToJson(gvc, target.files[0]);
                        const setUserEmails = [...new Set(jsonData.map(user => user['電子信箱']))];
                        if (jsonData.length > setUserEmails.length) {
                            dialog.errorMessage({ text: '會員電子信箱不可重複' });
                            return;
                        }
                        const setUserPhones = [...new Set(jsonData.map(user => user['電話']))];
                        if (jsonData.length > setUserPhones.length) {
                            dialog.errorMessage({ text: '會員電話不可重複' });
                            return;
                        }
                        for (let i = 0; i < jsonData.length; i++) {
                            const user = jsonData[i];
                            if (!user['電子信箱']) {
                                dialog.errorMessage({ text: '會員電子信箱不可為空' });
                                return;
                            }
                            const userData = {
                                name: user['顧客名稱'],
                                email: user['電子信箱'],
                                phone: user['電話'],
                                birth: user['生日'],
                                address: user['地址'],
                                gender: user['性別'],
                                carrier_number: user['手機載具'],
                                gui_number: user['統一編號'],
                                company: user['公司'],
                                consignee_name: user['收貨人'],
                                consignee_address: user['收貨人地址'],
                                consignee_email: user['收貨人電子郵件'],
                                consignee_phone: user['收貨人手機'],
                                managerNote: user['顧客備註'],
                                status: user['黑名單'] === '否' ? 1 : 0,
                                lineID: user['LINE UID'],
                                'fb-id': user['FB UID'],
                                tags: ((_b = user['會員標籤']) !== null && _b !== void 0 ? _b : []).split(','),
                            };
                            jsonData[i] = {
                                account: userData.email,
                                pwd: gvc.glitter.getUUID(),
                                userData: userData,
                            };
                        }
                        dialog.dataLoading({ visible: true });
                        ApiUser.quickRegister({ userArray: jsonData }).then(r => {
                            var _a;
                            dialog.dataLoading({ visible: false });
                            if (r.result) {
                                dialog.successMessage({ text: '匯入成功' });
                                callback();
                                return;
                            }
                            const errorData = (_a = r.response.data) === null || _a === void 0 ? void 0 : _a.data;
                            if (errorData === null || errorData === void 0 ? void 0 : errorData.emailExists) {
                                dialog.errorMessage({ text: `匯入失敗，會員信箱已存在<br/>(${errorData.email})` });
                                return;
                            }
                            if (errorData === null || errorData === void 0 ? void 0 : errorData.phoneExists) {
                                dialog.errorMessage({ text: `匯入失敗，會員電話已存在<br/>(${errorData.phone})` });
                                return;
                            }
                        });
                    }
                    catch (error) {
                        console.error('解析失敗:', error);
                    }
                }
            });
        });
        fileInput.click();
    }
    static parseExcelToJson(gvc, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const XLSX = yield this.loadXLSX(gvc);
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
