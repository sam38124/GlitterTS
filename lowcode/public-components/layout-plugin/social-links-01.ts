import { GVC } from '../../glitterBundle/GVController.js';

export class SocialLinks01{
  public static main(obj:{
    gvc:GVC,
    widget:any,
    subData:any
  }){
    console.log(obj)
    console.log(`formData=>`,obj.widget.formData)
    return `<div>hello</div>`
  }
}

(window as any).glitter.setModule(import.meta.url,SocialLinks01)