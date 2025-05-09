import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { LanguageLocation } from '../glitter-base/global/language.js';
import { Tool } from '../modules/tool.js';
import { Product } from '../public-models/product.js';

const html = String.raw;

interface ManagementMemberConfig {
  pin: string;
  auth: string[];
  name: string;
  phone: string;
  title: string;
  member_id: string;
  is_manager: boolean;
  support_shop: string[];
}

interface ManagementMember {
  id: number;
  user: string;
  appName: string;
  config: ManagementMemberConfig;
  email: string;
  invited: number;
  status: number;
  online_time: string;
}

interface ViewModel {
  id: string;
  loading: boolean;
  memberList: Map<string, ManagementMember>;
}

export class ShoppingSettingStockLog {
  public static main(obj: {
    gvc: GVC;
    vm: any;
    vm2: {
      id: string;
      language: LanguageLocation;
      content_detail: any;
    };
    reload: () => void;
    language_data: any;
    postMD: Product;
    shipment_config: any;
  }) {
    const gvc = obj.gvc;
    const postMD = obj.postMD;
    const vm2 = obj.vm2;

    const vm: ViewModel = {
      id: gvc.glitter.getUUID(),
      loading: true,
      memberList: new Map(),
    };

    return BgWidget.container(
      gvc.bindView({
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
        onCreate: async () => {
          if (vm.loading) {
            const memberResp = await ApiUser.getPermission({ page: 0, limit: 100 });
            if (memberResp.result && Array.isArray(memberResp.response.data)) {
              vm.memberList = new Map(
                memberResp.response.data.map((member: ManagementMember) => {
                  return [member.user, member];
                })
              );
            }
            vm.loading = false;
            gvc.notifyDataChange(vm.id);
          }
        },
      })
    );
  }
}
