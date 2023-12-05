const testMode=false
export function getInitialData(par: {
    obj: any,
    key: string,
    def: any
}) {
    par.obj[par.key]=par.obj[par.key]?? par.def
    const returnValue = (testMode) ? par.def:par.obj[par.key]
    function checkData(obj: any, compare: any) {
        try {
            Object.keys(compare).map((dd) => {
                if (obj[dd]===undefined) {
                    obj[dd] = compare[dd]
                } else if (Array.isArray(compare[dd])) {
                    if (!Array.isArray(obj[dd])) {
                        obj[dd] = compare[dd]
                    } else {
                        obj[dd].map((d2: any) => {
                            checkData(d2, compare[dd][0])
                        })
                    }
                } else if (typeof obj[dd] === 'object') {
                    checkData(obj[dd], compare[dd])
                }
            })
        } catch (e) {

        }
    }

    checkData(returnValue, par.def)
    return returnValue;
}