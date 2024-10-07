import { ApiUser } from "../glitter-base/route/user.js";
const html = String.raw;
export class FileSystemGet {
    static getFile(cf) {
        return new Promise((resolve, reject) => {
            ApiUser.getPublicConfig(cf.key, 'manager').then((data) => {
                if (data.response.value) {
                    let find = [];
                    const links = data.response.value;
                    function loop(array) {
                        array.map((dd) => {
                            var _a, _b;
                            if (dd.type === 'folder') {
                                loop((_a = dd.items) !== null && _a !== void 0 ? _a : []);
                            }
                            else if (((_b = cf.id) !== null && _b !== void 0 ? _b : []).includes(dd.id)) {
                                find.push(dd);
                            }
                        });
                    }
                    loop(links);
                    resolve(find);
                }
                else {
                    resolve([]);
                }
            });
        });
    }
}
