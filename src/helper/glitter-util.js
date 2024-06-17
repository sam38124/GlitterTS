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
    static async set_frontend_v2(express, rout) {
        for (const dd of rout) {
            express.use(dd.rout, async (req, resp, next) => {
                console.log(`req.baseUrl->`, req.baseUrl);
                console.log(`dd.root_path->`, dd.root_path);
                const fileURL = (() => {
                    if (req.baseUrl.startsWith(dd.root_path)) {
                        return dd.path + '/' + req.baseUrl.replace(dd.root_path, '');
                    }
                    else {
                        return dd.path + '/' + req.baseUrl.replace(`/${dd.app_name}/`, '');
                    }
                })();
                if (req.baseUrl.replace(`/${dd.app_name}/`, '') === 'robots.txt') {
                    resp.set('Content-Type', 'plan/text');
                    return resp.send(await dd.robots(req, resp));
                }
                else if (req.baseUrl.replace(`/${dd.app_name}/`, '') === 'sitemap.xml') {
                    resp.set('Content-Type', 'application/xml');
                    return resp.send(await dd.sitemap(req, resp));
                }
                else if (req.baseUrl.replace(`/${dd.app_name}/`, '') === 'sitemap_detail.xml') {
                    resp.set('Content-Type', 'application/xml');
                    return resp.send(await dd.sitemap(req, resp));
                }
                else if (!fs_1.default.existsSync(fileURL)) {
                    if (req.baseUrl.startsWith(dd.root_path)) {
                        req.query.page = req.baseUrl.replace(dd.root_path, '');
                    }
                    const seo = await dd.seoManager(req, resp);
                    let fullPath = dd.path + "/index.html";
                    const data = fs_1.default.readFileSync(fullPath, 'utf8');
                    resp.header('Content-Type', 'text/html; charset=UTF-8');
                    return resp.send(data.replace(data.substring(data.indexOf(`<head>`), data.indexOf(`</head>`) + 7), seo));
                }
                else {
                    return resp.sendFile(decodeURI(fileURL));
                }
            });
        }
    }
}
exports.GlitterUtil = GlitterUtil;
//# sourceMappingURL=glitter-util.js.map