var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from "../config.js";
import { BaseApi } from "../glitterBundle/api/base.js";
import { GlobalUser } from "../glitter-base/global/global-user.js";
import { ShareDialog } from "../glitterBundle/dialog/ShareDialog.js";
export class ApiPageConfig {
    constructor() {
    }
    static getAppList(theme, token) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app?` + (() => {
                let search = [];
                theme && search.push(`theme=${theme}`);
                return search.join('&');
            })(),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": token || GlobalUser.saas_token
            }
        });
    }
    static getGlitterVersion() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/version?library=ts-glitter`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        });
    }
    static getTemplateList() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/template?template_from=all`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.token
            }
        });
    }
    static getAppConfig() {
        return BaseApi.create({
            "url": config.url + `/api/v1/app?appName=${config.appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static deleteApp(appName) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": GlobalUser.saas_token
            },
            data: JSON.stringify({
                appName: appName
            })
        });
    }
    static setSubDomain(cf) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/sub_domain`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": cf.token || config.token
            },
            data: JSON.stringify(cf)
        });
    }
    static setDomain(cf) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/domain`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": cf.token || config.token
            },
            data: JSON.stringify({
                app_name: cf.app_name || config.appName,
                domain: cf.domain
            })
        });
    }
    static getPage(request) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template?` +
                (() => {
                    const query = [];
                    (request.appName) && (query.push(`appName=${request.appName}`));
                    (request.tag) && (query.push(`tag=${request.tag}`));
                    (request.group) && (query.push(`group=${request.group}`));
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.page_type) && (query.push(`page_type=${request.page_type}`));
                    (request.me) && (query.push(`me=${request.me}`));
                    (request.favorite) && (query.push(`favorite=${request.favorite}`));
                    return query.join('&');
                })(),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": request.token || config.token
            }
        });
    }
    static getPageTemplate(request) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/template?` +
                (() => {
                    const query = [];
                    (request.template_from) && (query.push(`template_from=${request.template_from}`));
                    (request.page) && (query.push(`page=${request.page}`));
                    (request.limit) && (query.push(`limit=${request.limit}`));
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.tag) && (query.push(`tag=${request.tag}`));
                    (request.search) && (query.push(`search=${request.search}`));
                    return query.join('&');
                })(),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static getTagList(request) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/tag_list?` +
                (() => {
                    const query = [];
                    (request.type) && (query.push(`type=${request.type}`));
                    (request.template_from) && (query.push(`template_from=${request.template_from}`));
                    return query.join('&');
                })(),
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static setPage(data) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "PUT",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        });
    }
    static addPage(data) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        });
    }
    static getPlugin(appName) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/plugin?appName=${appName}`,
            "type": "GET",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            }
        });
    }
    static deletePage(data) {
        return BaseApi.create({
            "url": config.url + `/api/v1/template`,
            "type": "DELETE",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify(data)
        });
    }
    static setPlugin(appName, obj) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/plugin`,
            "type": "PUT",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: appName,
                config: obj
            })
        });
    }
    static createTemplate(appName, obj, token) {
        return BaseApi.create({
            "url": config.url + `/api/v1/app/create_template`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": token || config.token
            },
            data: JSON.stringify({
                appName: appName,
                config: obj
            })
        });
    }
    static createPageTemplate(appName, obj, tag) {
        return BaseApi.create({
            "url": config.url + `/api/v1/page/template`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: appName,
                config: obj,
                tag: tag
            })
        });
    }
    static setPrivateConfig(appName, key, value) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": window.parent.saasConfig.config.token
            },
            data: JSON.stringify({
                appName: appName,
                key: key,
                value: value
            })
        });
    }
    static setPrivateConfigV2(cf) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                appName: cf.appName || config.appName,
                key: cf.key,
                value: cf.value
            })
        });
    }
    static getPrivateConfig(appName, key) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private?appName=${appName}&key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": window.parent.saasConfig.config.token
            }
        });
    }
    static getPrivateConfigV2(key) {
        return BaseApi.create({
            "url": config.url + `/api/v1/private?appName=${config.appName}&key=${key}`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static getEditorToken() {
        return BaseApi.create({
            "url": config.url + `/api/v1/user/editorToken`,
            "type": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            }
        });
    }
    static uploadFile(fileName) {
        return BaseApi.create({
            "url": config.url + `/api/v1/fileManager/upload`,
            "type": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": config.token
            },
            data: JSON.stringify({
                "fileName": fileName
            })
        });
    }
    static uploadFileAll(files, type = 'file') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(files)) {
                files = [files];
            }
            const dialog = new ShareDialog(window.glitter);
            let result = true;
            let links = [];
            for (const file of files) {
                const fileSizeKB = file.size / 1024;
                if (file.name.endsWith('png') || file.name.endsWith('jpg') || file.name.endsWith('jpeg')) {
                    if (fileSizeKB > 500) {
                        const result = yield new Promise((resolve, reject) => {
                            dialog.checkYesOrNot({
                                text: '圖片上傳大小不得超過 500 KB，避免網頁加載速度緩慢，是否透過系統自動壓縮畫質?',
                                callback: (response) => {
                                    if (response) {
                                        resolve(true);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                }
                            });
                        });
                        if (!result) {
                            dialog.dataLoading({ visible: false });
                            return;
                        }
                    }
                }
                const file_id = window.glitter.getUUID();
                function getFileName(size) {
                    let file_name = (file.name ||
                        `${file_id}.${(() => {
                            if (file.type === 'image/jpeg') {
                                return `jpg`;
                            }
                            else if (file.type === 'image/png') {
                                return `png`;
                            }
                            else {
                                return `png`;
                            }
                        })()}`).replace(/ /g, '').replace(/'/g, '').replace(/"/g, '');
                    if (file.type.startsWith('image')) {
                        file_name = `${size ? `size${size}_` : ``}s*px$_${file_id}_${file_name}`;
                    }
                    return file_name;
                }
                if (file.name.endsWith('png') || file.name.endsWith('jpg') || file.name.endsWith('jpeg')) {
                    function loopSize(size) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    const img = new Image();
                                    img.src = URL.createObjectURL(file);
                                    img.onload = function () {
                                        let quality = 0.9;
                                        const og_width = img.width;
                                        const og_height = img.height;
                                        const canvas = document.createElement('canvas');
                                        const maxWidth = size;
                                        const maxHeight = size / og_width * og_height;
                                        let width = img.width;
                                        let height = img.height;
                                        if (width > height) {
                                            if (width > maxWidth) {
                                                height *= maxWidth / width;
                                                width = maxWidth;
                                            }
                                        }
                                        else {
                                            if (height > maxHeight) {
                                                width *= maxHeight / height;
                                                height = maxHeight;
                                            }
                                        }
                                        canvas.width = width;
                                        canvas.height = height;
                                        const ctx = canvas.getContext('2d');
                                        ctx.drawImage(img, 0, 0, width, height);
                                        function tryCompression() {
                                            canvas.toBlob((blob) => __awaiter(this, void 0, void 0, function* () {
                                                console.log(`嘗試壓縮品質: ${quality}, 檔案大小: ${(blob.size / 1024).toFixed(2)} KB`);
                                                if (blob.size > 500 * 1024 && quality > 0.1) {
                                                    quality -= 0.1;
                                                    tryCompression();
                                                }
                                                else {
                                                    const s3res = (yield ApiPageConfig.uploadFile(getFileName(size))).response;
                                                    const res = yield BaseApi.create({
                                                        url: s3res.url,
                                                        type: 'put',
                                                        data: blob,
                                                        headers: {
                                                            'Content-Type': s3res.type,
                                                        }
                                                    });
                                                    resolve(s3res.fullUrl);
                                                }
                                            }), 'image/jpeg', quality);
                                        }
                                        tryCompression();
                                    };
                                };
                                reader.readAsDataURL(file);
                            });
                        });
                    }
                    let chunk_size = [150, 600, 1200, 1440, 1920];
                    if (fileSizeKB > 500) {
                        links.push(yield loopSize(chunk_size[1200]));
                    }
                    else {
                        const s3res = (yield ApiPageConfig.uploadFile(getFileName('original'))).response;
                        const res = yield BaseApi.create({
                            url: s3res.url,
                            type: 'put',
                            data: file,
                            headers: {
                                'Content-Type': s3res.type,
                            }
                        });
                        links.push(s3res.fullUrl);
                    }
                    result = true;
                    if (!result) {
                        return {
                            result: false
                        };
                    }
                }
                else {
                    const s3res = (yield ApiPageConfig.uploadFile(file.name.replace(/ /g, '').replace(/'/g, '').replace(/"/g, ''))).response;
                    const res = yield BaseApi.create({
                        url: s3res.url,
                        type: 'put',
                        data: file,
                        headers: {
                            'Content-Type': s3res.type,
                        }
                    });
                    links.push(s3res.fullUrl);
                }
            }
            return {
                result: result,
                links: links
            };
        });
    }
}
const interval = setInterval(() => {
    if (window.glitter) {
        clearInterval(interval);
        window.glitter.setModule(import.meta.url, ApiPageConfig);
    }
}, 100);
