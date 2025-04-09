export class SaasOffer{
  public static get is_dealer(){
    return ['hd_saas'].includes(((window.parent as any).glitterBase))
}

public static get saas_logo(){
    switch ((window.parent as any).glitterBase) {
      case 'hd_saas':
        return 'https://d3jnmi1tfjgtti.cloudfront.net/file/341867843/smartSHOP（橘紅）.png'
      default:
        return 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/shopnex.svg'
    }
}
}