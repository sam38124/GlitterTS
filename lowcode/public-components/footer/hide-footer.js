export class HideFooter {
    static check() {
        if (window.glitter.getUrlParameter('page').startsWith('products/') && document.body.clientWidth < 800) {
            return true;
        }
        else
            return window.glitter.getUrlParameter('page') === 'checkout';
    }
}
