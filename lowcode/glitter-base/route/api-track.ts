import {BaseApi} from "../../glitterBundle/api/base.js";

export class ApiTrack{
    public static track(json:any){
        json.event_source_url=location.href;
        return BaseApi.create({
            url: getBaseUrl() + `/api-public/v1/track`,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'g-app': (window.parent as any).appName,
                Authorization: getConfig().config.token,
            },
            data: JSON.stringify({
                data:json
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
