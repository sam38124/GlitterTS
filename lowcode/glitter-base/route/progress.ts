import { BaseApi } from '../../glitterBundle/api/base.js';

export class ApiProgress {
  public static getAllProgress() {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/progress`,
      type: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
    });
  }

  public static getOneProgress(taskId: string) {
    return BaseApi.create({
      url: getBaseUrl() + `/api-public/v1/progress/${taskId}`,
      type: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'g-app': getConfig().config.appName,
        Authorization: getConfig().config.token,
      },
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
