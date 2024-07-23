
export class DynamicCode{
    public static fun(gvc:any, widget:any, object:any, subData:any, element:any){
        try {
            const queryWhere = `
                            /*
      ->Tag->${(widget as any).tag}
      ->Label->${widget.label}
      ->ID->${widget.id}
      */
                            `;
            const evalString = `
                        return {
                        execute:(gvc,widget,object,subData,element,window,document,glitter,$)=>{
                         return (() => {
                                                
                                                    ${object.code}
                                                })()
                        }
                        }
                    `;

            const checkSum =  getCheckSum(object.code) as any
            const a = (() => {
                const preload_code = (window as any).preloadData.eval_code_hash[checkSum]
                if (preload_code) {
                    return preload_code(
                        gvc, widget, object, subData, element, gvc.glitter.window,gvc.glitter.document, gvc.glitter, gvc.glitter.$
                    )
                } else {
                    const myFunction = new Function(evalString);
                    (window as any).preloadData.eval_code_hash[checkSum]=myFunction().execute;
                    return ((myFunction().execute(
                        gvc, widget, object, subData, element, gvc.glitter.window,gvc.glitter.document, gvc.glitter, gvc.glitter.$
                    )))
                }
            })();
            return a
            // if (a.then) {
            //     a.then((data: any) => {
            //         console.log(`eval-end-wait`, new Date().getTime())
            //         resolve(data);
            //     });
            // } else {
            //     setTimeout(()=>{
            //         resolve(a);
            //     })
            //
            //     console.log(`eval-end-now-${new Date().getTime()}`,a)
            //     // resolve(a);
            // }

        } catch (e) {
            console.log(`eval-end-catch`, new Date().getTime())
            return object.errorCode ?? false
        }
    }
}
function getCheckSum(message: string) {
    return  window.CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}
