import { BaseApi } from '../../glitterBundle/api/base.js';

export class ApiShopee {
  public static generateAuth(redirect: string) {
    BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/shopee/getAuth`,
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify({
        redirect: redirect,
      }),
    }).then(r => {
      localStorage.setItem('shopee', window.parent.location.href);
      window.parent.location.href = r.response.result;
    });
  }

  public static generateOrderAuth(redirect: string) {
    BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/shopee/getOrderAuth`,
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify({
        redirect: redirect,
      }),
    }).then(r => {
      localStorage.setItem('shopee', window.parent.location.href);
      window.parent.location.href = r.response.result;
    });
  }

  public static getToken(code: string, shop_id: number) {
    BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/shopee/getToken`,
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify({
        code: code,
        shop_id: shop_id,
      }),
    }).then(r => {
      console.log('r -- ', r);
    });
  }

  public static getItemList(start: number, end: number, callback: (response: any) => void) {
    BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/shopee/getItemList`,
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify({
        start: start,
        end: end,
      }),
    }).then(r => {
      console.log('r -- ', r);
      callback(r.response);
    });
  }

  public static syncProduct(callback: (response: any) => void) {
    BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/shopee/syncStock`,
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
    }).then(r => {
      callback(r.response);
    });
  }

  public static syncStatus() {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/shopee/sync-status`,
      type: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
    });
  }

  public static getOrderList(start: number, end: number, callback: (response: any) => void) {
    BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/shopee/getOrderList`,
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify({
        start: start,
        end: end,
      }),
    }).then(r => {
      console.log('r -- ', r);
      callback(r.response);
    });
  }
}

function getConfig() {
  const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
  return saasConfig;
}

function getBaseUrl() {
  return getConfig().config.url;
}
