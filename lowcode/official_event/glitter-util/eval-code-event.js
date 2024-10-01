export class DynamicCode {
    static fun(gvc, widget, object, subData, element) {
        var _a;
        const queryWhere = `
                            /*
      ->Tag->${widget.tag}
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
        try {
            const checkSum = getCheckSum(object.code);
            const a = (() => {
                const preload_code = window.preloadData.eval_code_hash[checkSum];
                if (preload_code) {
                    return preload_code(gvc, widget, object, subData, element, gvc.glitter.window, gvc.glitter.document, gvc.glitter, gvc.glitter.$);
                }
                else {
                    const myFunction = new Function(evalString);
                    window.preloadData.eval_code_hash[checkSum] = myFunction().execute;
                    return ((myFunction().execute(gvc, widget, object, subData, element, gvc.glitter.window, gvc.glitter.document, gvc.glitter, gvc.glitter.$)));
                }
            })();
            return a;
        }
        catch (e) {
            console.log(`eval-end-catch`, new Date().getTime());
            console.log(e);
            console.log(`object.code=>`, object.code);
            return (_a = object.errorCode) !== null && _a !== void 0 ? _a : false;
        }
    }
}
function getCheckSum(message) {
    return window.CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}
