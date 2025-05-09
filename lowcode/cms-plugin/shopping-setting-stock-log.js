var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { Tool } from '../modules/tool.js';
const html = String.raw;
export class ShoppingSettingStockLog {
    static main(obj) {
        const gvc = obj.gvc;
        const postMD = obj.postMD;
        const vm2 = obj.vm2;
        const vm = {
            id: gvc.glitter.getUUID(),
            loading: true,
            memberList: new Map(),
        };
        return BgWidget.container(gvc.bindView({
            bind: vm.id,
            view: () => {
                if (vm.loading) {
                    return BgWidget.spinner();
                }
                postMD.records.map(log => {
                    console.log(log);
                    console.log(Tool.formatDateTime(log.changed_at, true));
                    if (vm.memberList.has(`${log.changed_by}`)) {
                        console.log(vm.memberList.get(`${log.changed_by}`));
                    }
                    console.log('-----');
                });
                return [BgWidget.mainCard('')].join('');
            },
            divCreate: {
                class: 'w-100',
            },
            onCreate: () => __awaiter(this, void 0, void 0, function* () {
                if (vm.loading) {
                    const memberResp = yield ApiUser.getPermission({ page: 0, limit: 100 });
                    if (memberResp.result && Array.isArray(memberResp.response.data)) {
                        vm.memberList = new Map(memberResp.response.data.map((member) => {
                            return [member.user, member];
                        }));
                    }
                    vm.loading = false;
                    gvc.notifyDataChange(vm.id);
                }
            }),
        }));
    }
}
