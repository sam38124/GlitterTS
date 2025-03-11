import {GVC} from "../../glitterBundle/GVController.js";

export class Input {
    static main(gvc: GVC, widget: any, subData: any){
        return `<h1>TEST</h1>`
    }
}

(window as any).glitter.setModule(import.meta.url, Input)