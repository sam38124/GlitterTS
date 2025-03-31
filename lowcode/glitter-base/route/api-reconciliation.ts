import { BaseApi } from '../../glitterBundle/api/base.js';

export class ApiReconciliation {
  public static getSummary(filter_date:string='week',start_date?:string,end_date?:string) {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/reconciliation?${(()=>{
        let query=[]
        filter_date && query.push(`filter_date=${filter_date}`);
        start_date && query.push(`start_date=${new Date(start_date).toISOString()}`);
        end_date && query.push(`end_date=${new Date(end_date).toISOString()}`);
        return query.join('&')
      })()}`,
      type: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'g-app': (window.parent as any).appName,
        Authorization: getConfig().config.token,
      }
    })
  }
  public static putReconciliation(data:any) {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/reconciliation`,
      type: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'g-app': (window.parent as any).appName,
        Authorization: getConfig().config.token,
      },
      data: JSON.stringify(data),
    })
  }
}

function getConfig() {
  const saasConfig: { config: any; api: any } = (window.parent as any).saasConfig;
  return saasConfig;
}

function getBaseUrl() {
  return getConfig().config.url;
}
