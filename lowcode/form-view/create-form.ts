import {GVC} from "../glitterBundle/GVController.js";

export class CreateForm{
    public static setFormModule(url:string,formView:(bundle:{
        gvc:GVC,
        formData:any,
        key:string
    })=>string){
        (window as any).glitter.setModule(url,formView)
    }
}