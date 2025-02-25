import { ApiUser } from '../../glitter-base/route/user.js';

interface UserData {
    name: string;
    tags: string[];
    email: string;
    phone: string;
    managerNote: string;
    birth: string;
    address: string;
    gender: string;
    company: string;
    gui_number: string;
    carrier_number: string;
}

interface User {
    email: string;
    order_count: number;
    total_amount: string;
    id: number;
    userID: number;
    account: string;
    userData: UserData;
    created_time: string; // 使用 ISO 8601 格式的時間
    role: number;
    company: string | null;
    status: number;
    online_time: string; // 使用 ISO 8601 格式的時間
    static_info: any | null; // 根據需求可以替換成具體類型
    tag_name: string;
    checkout_total: number;
    checkout_count: number;
    latest_order_date: number;
    latest_order_total: number;
}

export class UserExcel {
    static export(vm: { query?: string; queryType?: string; orderString?: string; filter_type: string; filter?: any; group?: { type: string; title: string } }) {
        console.log('user list export');

        function userDataToJSON(user: User) {
            const a = {
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
                收貨人: 1,
                收貨人地址: 1,
                收貨人電子郵件: 1,
                收貨人手機: 1,
                顧客備註: user.userData.managerNote,
                黑名單: user.status,
                會員等級: user.tag_name,
                會員有效期: 1,
                註冊時間: user.created_time,
                現有購物金: 1,
                'LINE 綁定 Email': '',
                'LINE UID': '',
                'FB UID': '',
                最後購買日期: user.latest_order_date,
                最後消費金額: user.latest_order_total,
                累積消費金額: user.checkout_total,
                累積消費次數: user.checkout_count,
                會員標籤: user.userData.tags,
            };
        }

        ApiUser.getUserListOrders({
            page: 0,
            limit: 99999,
            search: vm.query || undefined,
            searchType: vm.queryType || 'name',
            orderString: vm.orderString || '',
            filter: vm.filter,
            filter_type: vm.filter_type,
            group: vm.group,
        }).then((d) => {
            if (d.response) {
                console.log(d.response);
            } else {
                console.log('getUserListOrders error');
            }
        });
    }
}
