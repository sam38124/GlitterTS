const html = String.raw;
export class BgListComponent {
    constructor(gvc, vm) {
        this.getFilterObject = (select) => {
            const obj = this.vm.filterDefaultObject();
            if (!select) {
                return obj;
            }
            if (typeof select === 'string') {
                return obj[select];
            }
            const result = {};
            for (const key of select) {
                result[key] = obj[key];
            }
            return result;
        };
        this.gvc = gvc;
        this.vm = vm;
    }
}
window.glitter.setModule(import.meta.url, BgListComponent);
