export const config = {
    url: (window as any).glitterBackend ?? location.origin,
    token: '',
    appName: (window as any).appName,
    //判斷是否為線上或線下整合方案
    is_omo:true,
    //商店類型，零售或食品
    shop_type:'retail'
};
