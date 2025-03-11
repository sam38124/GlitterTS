export class HideFooter {
    public static check() {
        if ((window as any).glitter.getUrlParameter('page').startsWith('products/') && document.body.clientWidth < 800) {
            return true;
        } else return (window as any).glitter.getUrlParameter('page') === 'checkout';
    }
}