import { PageSplit } from './splitPage.js';
import { ApiShop } from '../glitter-base/route/shopping.js';
import { ApiPost } from '../glitter-base/route/post.js';
import { GVC } from '../glitterBundle/GVController.js';
import { BgWidget } from './bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';

const html = String.raw;

interface FilterItem {
    key: string;
    type: string;
    name: string;
    data: any;
}

export class BgListComponent {
    gvc: GVC;
    vm: any;

    constructor(gvc: GVC, vm: any) {
        this.gvc = gvc;
        this.vm = vm;
    }

    getFilterObject = (select?: string | string[]) => {
        const obj: any = this.vm.filterDefaultObject();
        if (!select) {
            return obj;
        }
        if (typeof select === 'string') {
            return obj[select];
        }
        const result: any = {};
        for (const key of select) {
            result[key] = obj[key];
        }
        return result;
    };
}

(window as any).glitter.setModule(import.meta.url, BgListComponent);
