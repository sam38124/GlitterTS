import { BaseApi } from '../../glitterBundle/api/base.js';

export class Article {
  public static get(json: {
    limit: number;
    page: number;
    search?: string;
    id?: string;
    tag?: string;
    label?: string;
    for_index?: string;
    status?: string;
    page_type?: string;
    app_name?: string;
    id_list?: string;
  }) {
    return BaseApi.create({
      url:
        getBaseUrl() +
        `/api-public/v1/article/manager?${(() => {
          let par = [`limit=${json.limit}`, `page=${json.page}`];
          json.search && par.push(`search=${json.search}`);
          json.id && par.push(`id=${json.id}`);
          json.tag && par.push(`tag=${json.tag}`);
          json.label && par.push(`label=${json.label}`);
          json.for_index && par.push(`for_index=${json.for_index}`);
          json.status && par.push(`status=${json.status}`);
          json.page_type && par.push(`page_type=${json.page_type}`);
          json.id_list && par.push(`id_list=${json.id_list}`);
          return par.join('&');
        })()}`,
      type: 'GET',
      headers: {
        'g-app': json.app_name || getConfig().config.appName,
        'Content-Type': 'application/json',
        Authorization: getConfig().config.token,
      },
    });
  }
  public static delete(json: { id: string }) {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/article`,
      type: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify(json),
    });
  }
  public static deleteV2(json: { id: string }) {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/article/manager`,
      type: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify(json),
    });
  }

  public static post(
    tData: {
      tag: string;
      name: string;
      copy: string;
    },
    status: number = 1
  ) {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/article/manager`,
      type: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify({
        status: status,
        data: tData,
      }),
    });
  }
  public static put(tData: any) {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/article/manager`,
      type: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify({
        data: tData,
      }),
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
