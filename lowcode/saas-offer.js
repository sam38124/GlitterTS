export class SaasOffer {
    static get is_dealer() {
        return ['hd_saas'].includes((window.parent.glitterBase));
    }
    static get saas_logo() {
        switch (window.parent.glitterBase) {
            case 'hd_saas':
                return 'https://d3jnmi1tfjgtti.cloudfront.net/file/341867843/smartSHOP（橘紅）.png';
            default:
                return 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/shopnex.svg';
        }
    }
}
