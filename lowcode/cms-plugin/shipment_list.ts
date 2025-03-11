import { GVC } from '../glitterBundle/GVController.js';

export class Shipment_list{
  public static main(gvc:GVC){
    return `<h3></h3>`
  }
}

(window as any).glitter.setModule(import.meta.url,Shipment_list)