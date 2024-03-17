"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlitterUtil = void 0;
const fs_1 = __importDefault(require("fs"));
class GlitterUtil {
    static async set_frontend(express, rout) {
        for (const dd of rout) {
            express.use(dd.rout, async (req, resp, next) => {
                let path = req.path;
                if (path === '/') {
                    path = "/index.html";
                }
                if ((dd.path + path).indexOf('index.html') !== -1) {
                    const seo = await dd.seoManager(req, resp);
                    let fullPath = dd.path + "/index.html";
                    const data = fs_1.default.readFileSync(fullPath, 'utf8');
                    resp.header('Content-Type', 'text/html; charset=UTF-8');
                    return resp.send(data.replace(data.substring(data.indexOf(`<head>`) + 6, data.indexOf(`</head>`)), seo));
                }
                else {
                    return resp.sendFile(decodeURI((dd.path + path)));
                }
            });
        }
    }
}
exports.GlitterUtil = GlitterUtil;
//# sourceMappingURL=glitter-util.js.map