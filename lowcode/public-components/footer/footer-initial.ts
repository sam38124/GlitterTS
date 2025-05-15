import { GVC } from '../../glitterBundle/GVController.js';

export class FooterInitial {
  public static initial(cf: { browser: () => string; mobile: () => string; gvc: GVC }) {
    const gvc = cf.gvc;
    if (gvc.glitter.share.is_application) {
      if ((window as any).glitter.getUrlParameter('page').startsWith('products/')) {
        return ``;
      }

      return cf.mobile();
    } else {
      const res_ = (() => {
        if (
          ((window as any).glitter.getUrlParameter('page').startsWith('products/') ||
            [
              'account_userinfo',
              'recipient_info',
              'account_edit',
              'order_list',
              'voucher-list',
              'rebate',
              'wishlist',
            ].includes((window as any).glitter.getUrlParameter('page'))) &&
          document.body.clientWidth < 800
        ) {
          return true;
        } else return (window as any).glitter.getUrlParameter('page') === 'checkout';
      })();
      if (res_) {
        return ``;
      } else {
        return cf.browser();
      }
    }
  }
}
