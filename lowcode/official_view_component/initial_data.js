const testMode = false;
export function getInitialData(par) {
    var _a;
    par.obj[par.key] = (_a = par.obj[par.key]) !== null && _a !== void 0 ? _a : par.def;
    const returnValue = (testMode) ? par.def : par.obj[par.key];
    function checkData(obj, compare) {
        try {
            Object.keys(compare).map((dd) => {
                if (obj[dd] === undefined) {
                    obj[dd] = compare[dd];
                }
                else if (Array.isArray(compare[dd])) {
                    if (!Array.isArray(obj[dd])) {
                        obj[dd] = compare[dd];
                    }
                    else {
                        obj[dd].map((d2) => {
                            checkData(d2, compare[dd][0]);
                        });
                    }
                }
                else if (typeof obj[dd] === 'object') {
                    checkData(obj[dd], compare[dd]);
                }
            });
        }
        catch (e) {
        }
    }
    checkData(returnValue, par.def);
    return returnValue;
}
