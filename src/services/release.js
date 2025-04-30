"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Release = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const archiver_1 = __importDefault(require("archiver"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_js_1 = __importDefault(require("../config.js"));
const exception_js_1 = __importDefault(require("../modules/exception.js"));
const firebase_js_1 = require("../modules/firebase.js");
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
class Release {
    static async android(cf) {
        try {
            console.log(`cf=>`, cf);
            await firebase_js_1.Firebase.appRegister({
                appName: cf.appDomain,
                appID: cf.bundleID,
                type: 'android',
            });
            fs_1.default.writeFileSync(path_1.default.resolve(cf.project_router, './app/google-services.json'), (await firebase_js_1.Firebase.getConfig({
                appID: cf.bundleID,
                type: 'android',
                appDomain: cf.appDomain,
            })));
            await this.resetProjectRouter({
                project_router: cf.project_router,
                targetString: 'www.smilebio.io',
                replacementString: cf.bundleID,
            });
            function replaceInFile(filePath, targetString, replacementString) {
                return new Promise((resolve, reject) => {
                    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error(`Error reading file ${filePath}:`, err);
                            return;
                        }
                        if (data.includes(targetString)) {
                            const result = data.replace(new RegExp(targetString, 'g'), replacementString);
                            fs_1.default.writeFile(filePath, result, 'utf8', err => {
                                if (err) {
                                    console.error(`Error writing file ${filePath}:`, err);
                                }
                                else {
                                    console.log(`Replaced in file: ${filePath}`);
                                }
                                setTimeout(() => { resolve(true); }, 100);
                            });
                        }
                    });
                });
            }
            await replaceInFile(path_1.default.resolve(cf.project_router, './app/src/main/java/www/smilebio/io/MyAPP.kt'), 'https://www.smilebio.com', `https://${cf.domain_url}`);
            await replaceInFile(path_1.default.resolve(cf.project_router, './app/src/main/java/www/smilebio/io/MyAPP.kt'), 'www.smilebio.io', cf.bundleID);
            await this.resetProjectRouter({
                project_router: cf.project_router,
                targetString: `<string name="app_name">Kenda</string>`,
                replacementString: `<string name="app_name">${cf.config.name}</string>`,
            });
            fs_1.default.renameSync(path_1.default.resolve(cf.project_router, './app/src/main/java/www/smilebio/io'), path_1.default.resolve(cf.project_router, 'temp_file'));
            Release.deleteFolder(path_1.default.resolve(cf.project_router, './app/src/main/java/com'));
            fs_1.default.mkdirSync(path_1.default.resolve(cf.project_router, `./app/src/main/java/${cf.bundleID.split('.').join('/')}`), {
                recursive: true,
            });
            fs_1.default.renameSync(path_1.default.resolve(cf.project_router, 'temp_file'), path_1.default.resolve(cf.project_router, `./app/src/main/java/${cf.bundleID.split('.').join('/')}`));
            await this.downloadImage(cf.config.logo, path_1.default.resolve(cf.project_router, `./app/src/main/res/autogen.png`));
            await new Promise(resolve => setTimeout(resolve, 1000));
            await Release.generateAndroidIcon(path_1.default.resolve(cf.project_router, `./app/src/main/res/autogen.png`), path_1.default.resolve(cf.project_router, `./app/src/main/res`));
        }
        catch (e) {
            console.log(e);
        }
    }
    static async downloadImage(url, outputPath) {
        try {
            const response = await (0, axios_1.default)({
                url,
                method: 'GET',
                responseType: 'stream',
            });
            const writer = fs_1.default.createWriteStream(outputPath);
            response.data.pipe(writer);
            writer.on('finish', () => console.log('Image downloaded successfully:', outputPath));
            writer.on('error', err => {
                console.error('Error writing the image to disk:', err);
            });
        }
        catch (error) {
            console.error(`Error while downloading image:${error}`);
        }
    }
    static async generateAndroidIcon(sourceIcon, outputDir) {
        try {
            const baseSize = 48;
            const densities = {
                mdpi: 1,
                hdpi: 1.5,
                xhdpi: 2,
                xxhdpi: 3,
                xxxhdpi: 4,
            };
            for (const [density, scale] of Object.entries(densities)) {
                const size = Math.round(baseSize * scale);
                const folderPath = path_1.default.join(outputDir, `mipmap-${density}`);
                const outputPath = path_1.default.join(folderPath, 'ic_launcher_png.png');
                await (0, sharp_1.default)(sourceIcon).resize(size, size).toFile(outputPath);
                console.log(`✅ Created: ${outputPath}`);
            }
            console.log('🎉 所有 mipmap 圖示已建立完畢。');
        }
        catch (err) {
            console.error('❌ 發生錯誤:', err);
        }
    }
    static async resetProjectRouter(cf) {
        const replaceInFile = (filePath) => {
            fs_1.default.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${filePath}:`, err);
                    return;
                }
                if (data.includes(cf.targetString)) {
                    const result = data.replace(new RegExp(cf.targetString, 'g'), cf.replacementString);
                    fs_1.default.writeFile(filePath, result, 'utf8', err => {
                        if (err) {
                            console.error(`Error writing file ${filePath}:`, err);
                        }
                        else {
                            console.log(`Replaced in file: ${filePath}`);
                        }
                    });
                }
            });
        };
        const traverseDirectory = (dir) => {
            fs_1.default.readdir(dir, { withFileTypes: true }, (err, files) => {
                if (err) {
                    console.error(`Error reading directory ${dir}:`, err);
                    return;
                }
                files.forEach(file => {
                    const fullPath = path_1.default.join(dir, file.name);
                    if (file.isDirectory()) {
                        traverseDirectory(fullPath);
                    }
                    else if (file.isFile()) {
                        replaceInFile(fullPath);
                    }
                });
            });
        };
        return new Promise(async (resolve, reject) => {
            traverseDirectory(cf.project_router);
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    }
    static getHtml(cf) {
        let html = `<!DOCTYPE html>
<meta name="viewport" content="width=device-width,height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1,user-scalable=no,initial-scale=1.0001,maximum-scale=1.0001,viewport-fit=cover">
<html lang="en">
<head>
</head>

<style>
    .selectComponentHover{
        border: 4px solid dodgerblue !important;
        border-radius: 5px !important;
        box-sizing: border-box !important;
    }
  #toast {
    position: absolute;
    z-index: 2147483646;
    background-color: black;
    opacity: .8;
    color: white;
    bottom: 100px;
    max-width: calc(100% - 20px);
    transform: translateX(-50%);
    left: 50%;
    font-size: 14px;
    border-radius: 10px;
    padding: 10px;
    display: none;
  }

  body{
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    white-space: normal;
      overflow-y:auto !important;
  }
  iframe{
    width: 100%;
    height: 100%;
    border-width: 0;
    padding: 0;
    margin: 0;
    white-space: normal;
    position: relative;
  }
  html{
    white-space: normal;
    margin: 0;
    padding: 0;
  }
  .toggleInner h3{
      color:white !important;
  }
  .alert-success h3{
      color: #d0b9b9 !important;
  }
  .page-loading {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-transition: all .4s .2s ease-in-out;
    transition: all .4s .2s ease-in-out;
    background-color: #fff;
    opacity: 0;
    visibility: hidden;
    z-index: 99;
  }

  .dark-mode .page-loading {
    background-color: #131022;
  }

  .page-loading.active {
    opacity: 1;
    visibility: visible;
  }

  .page-loading-inner {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    -webkit-transition: opacity .2s ease-in-out;
    transition: opacity .2s ease-in-out;
    opacity: 0;
  }

  .page-loading.active > .page-loading-inner {
    opacity: 1;
  }

  .page-loading-inner > span {
    display: block;
    font-size: 1rem;
    font-weight: normal;
    color: #9397ad;
  }

  .dark-mode .page-loading-inner > span {
    color: #fff;
    opacity: .6;
  }

  .page-spinner {
    display: inline-block;
    width: 2.75rem;
    height: 2.75rem;
    margin-bottom: .75rem;
    vertical-align: text-bottom;
    border: .15em solid #b4b7c9;
    border-right-color: transparent;
    border-radius: 50%;
    -webkit-animation: spinner .75s linear infinite;
    animation: spinner .75s linear infinite;
  }

  .dark-mode .page-spinner {
    border-color: rgba(255, 255, 255, .4);
    border-right-color: transparent;
  }

  @-webkit-keyframes spinner {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes spinner {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
<script>
    (window).appName=\`${cf.appDomain}\`;
    (window).glitterBackend=\`${cf.glitter_domain}\`;
</script>
${'<script>\n' +
            '    function preload(data){\n' +
            "        let joinArray=['__']\n" +
            '        function loop(array) {\n' +
            '            array.map((dd) => {\n' +
            "                if (dd.type === 'container') {\n" +
            '                    loop(dd.data.setting)\n' +
            "                } else if (dd.type === 'component') {\n" +
            '                    joinArray.push(dd.data.tag)\n' +
            '                }\n' +
            '            })\n' +
            '        }\n' +
            '        data.response.result.map((d2) => {\n' +
            '            loop(d2.config)\n' +
            '        })\n' +
            '        joinArray=joinArray.filter((value, index, self)=>{\n' +
            '            return value\n' +
            '        })\n' +
            '        joinArray.map((tag)=>{\n' +
            '            window.glitterInitialHelper.setQueue(`getPageData-${tag}`, (callback) => {\n' +
            "                glitterInitialHelper.getPageData(joinArray.join(','),(dd)=>{\n" +
            '                    const data=JSON.parse(JSON.stringify(dd))\n' +
            '                    data.response.result=data.response.result.filter((d2)=>{\n' +
            '                        return d2.tag===tag\n' +
            '                    })\n' +
            '                    callback({\n' +
            '                        response: data.response, result: true\n' +
            '                    })\n' +
            '                    preload(data)\n' +
            '                })\n' +
            '            })\n' +
            '        })\n' +
            '    }\n' +
            '    window.glitterInitialHelper = {\n' +
            '        share: {},\n' +
            '        setQueue: (tag, fun, callback) => {\n' +
            '\n' +
            '            window.glitterInitialHelper.share[tag] = window.glitterInitialHelper.share[tag] ?? {\n' +
            '                callback: [],\n' +
            '                data: undefined,\n' +
            '                isRunning: false\n' +
            '            }\n' +
            '            if (window.glitterInitialHelper.share[tag].data) {\n' +
            '                callback && callback((()=>{\n' +
            '                    try {\n' +
            '                        return JSON.parse(JSON.stringify(window.glitterInitialHelper.share[tag].data))\n' +
            '                    }catch (e) {\n' +
            '                        console.log(`parseError`,window.glitterInitialHelper.share[tag].data)\n' +
            '                    }\n' +
            '                })())\n' +
            '            } else {\n' +
            '                window.glitterInitialHelper.share[tag].callback.push(callback)\n' +
            '\n' +
            '                if (!window.glitterInitialHelper.share[tag].isRunning) {\n' +
            '                    window.glitterInitialHelper.share[tag].isRunning = true\n' +
            '                    fun((response) => {\n' +
            '                        window.glitterInitialHelper.share[tag].callback.map((callback) => {\n' +
            '                            callback && callback((()=>{\n' +
            '                                try {\n' +
            '                                    return JSON.parse(JSON.stringify(response))\n' +
            '                                }catch (e) {\n' +
            '                                    console.log(`parseError`,window.glitterInitialHelper.share[tag].data)\n' +
            '                                }\n' +
            '                            })())\n' +
            '                        })\n' +
            '                        window.glitterInitialHelper.share[tag].data = response\n' +
            '                        window.glitterInitialHelper.share[tag].callback = []\n' +
            '                    })\n' +
            '                }\n' +
            '            }\n' +
            '\n' +
            '        },\n' +
            '        getPlugin: (callback) => {\n' +
            "            window.glitterInitialHelper.setQueue('getPlugin', (callback) => {\n" +
            '                const myHeaders = new Headers();\n' +
            '                const requestOptions = {\n' +
            "                    method: 'GET',\n" +
            '                    headers: myHeaders\n' +
            '                };\n' +
            '\n' +
            '                function execute() {\n' +
            '                    fetch(`${window.glitterBackend}/api/v1/app/plugin?appName=${window.appName}`, requestOptions)\n' +
            '                        .then(response => response.json())\n' +
            '                        .then(result => {\n' +
            '                            callback({\n' +
            '                                response: result, result: true\n' +
            '                            })\n' +
            '                        })\n' +
            '                        .catch(error => {\n' +
            '                            console.log(error)\n' +
            '                            setTimeout(() => {\n' +
            '                                execute()\n' +
            '                            }, 100)\n' +
            '                        });\n' +
            '                }\n' +
            '\n' +
            '                execute()\n' +
            '            }, callback)\n' +
            '        },\n' +
            '        preloadComponent: {\n' +
            '            data: {}\n' +
            '        },\n' +
            '        getPageData: (tag, callback) => {\n' +
            '\n' +
            '            window.glitterInitialHelper.setQueue(`getPageData-${tag}`, (callback) => {\n' +
            '                const myHeaders = new Headers();\n' +
            '                const requestOptions = {\n' +
            "                    method: 'GET',\n" +
            '                    headers: myHeaders\n' +
            '                };\n' +
            '\n' +
            '                function execute() {\n' +
            '                    fetch(window.glitterBackend + `/api/v1/template?appName=${window.appName}&tag=${encodeURIComponent(tag)}`, requestOptions)\n' +
            '                        .then(response => response.json())\n' +
            '                        .then(response => {\n' +
            '                            for(const b of response.result){\n' +
            "                                if(b.group==='glitter-article'){\n" +
            '                                    glitterInitialHelper.getPageData(b.page_config.template, (data) => { preload(data) })\n' +
            '                                }\n' +
            '                            }\n' +
            '                            callback({\n' +
            '                                response: response, result: true\n' +
            '                            })\n' +
            '                        }).catch(error => {\n' +
            '                        console.log(error)\n' +
            '                        setTimeout(() => {\n' +
            '                            execute()\n' +
            '                        }, 100)\n' +
            '                    });\n' +
            '                }\n' +
            '\n' +
            '                execute()\n' +
            '            }, callback)\n' +
            '        }\n' +
            '    }\n' +
            '    let clockF = () => {\n' +
            '        return {\n' +
            '            start: new Date(),\n' +
            '            stop: function () {\n' +
            '                return ((new Date()).getTime() - (this.start).getTime())\n' +
            '            },\n' +
            '            zeroing: function () {\n' +
            '                this.start = new Date()\n' +
            '            }\n' +
            '        }\n' +
            '    }\n' +
            '    let renderClock = clockF();\n' +
            '    (window.renderClock) = renderClock;\n' +
            '    if (location.pathname.slice(-1) !== \'/\' && !location.pathname.endsWith("html")) {\n' +
            '        location.pathname = location.pathname + "/"\n' +
            '    }\n' +
            '    glitterInitialHelper.getPlugin()\n' +
            '    const url = new URL(location.href)\n' +
            "    glitterInitialHelper.getPageData(url.searchParams.get('page'), (data) => { preload(data) })\n" +
            '</script>'}
<script src="${cf.glitter_domain}/${cf.appDomain}/glitterBundle/jquery.js"></script>
<script src="${cf.glitter_domain}/${cf.appDomain}/glitterBundle/GlitterInitial.js" type="module"></script>
<link href="${cf.glitter_domain}/${cf.appDomain}/glitterBundle/Glitter.css" rel="stylesheet">
<body>
 <div id="glitterPage" class="flex-fill h-100">
   <div class="page-loading active">
    <div class="page-loading-inner">
      <div class="page-spinner"></div>
    </div>
  </div>
 </div>
 <aside id="drawerEl" style="z-index:99999;">
     <div id='Navigation' style="width: 100%;height: 100%;z-index:99999;"></div>
 </aside>
</body>
</html>`;
        return html;
    }
    static copyFolderSync(source, target) {
        if (!fs_1.default.existsSync(target)) {
            fs_1.default.mkdirSync(target);
        }
        const files = fs_1.default.readdirSync(source);
        files.forEach(file => {
            const sourcePath = path_1.default.join(source, file);
            const targetPath = path_1.default.join(target, file);
            if (fs_1.default.statSync(sourcePath).isDirectory()) {
                this.copyFolderSync(sourcePath, targetPath);
            }
            else {
                fs_1.default.copyFileSync(sourcePath, targetPath);
            }
        });
    }
    static removeAllFilesInFolder(folderPath) {
        const files = fs_1.default.readdirSync(folderPath);
        files.forEach(file => {
            const filePath = path_1.default.join(folderPath, file);
            if (fs_1.default.statSync(filePath).isFile()) {
                fs_1.default.unlinkSync(filePath);
            }
            else {
                this.removeAllFilesInFolder(filePath);
                fs_1.default.rmdirSync(filePath);
            }
        });
    }
    static compressFiles(inputFolder, outputZip) {
        return new Promise((resolve, reject) => {
            const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
            const output = fs_1.default.createWriteStream(outputZip);
            archive.pipe(output);
            archive.directory(inputFolder, false);
            archive.finalize();
            output.on('close', function () {
                resolve(true);
            });
            archive.on('error', function (err) {
                resolve(false);
            });
        });
    }
    static uploadFile(filePath, fileName) {
        return new Promise((resolve, reject) => {
            const s3 = new aws_sdk_1.default.S3();
            const bucketName = config_js_1.default.AWS_S3_NAME;
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: fs_1.default.createReadStream(filePath),
            };
            s3.upload(params, (err, data) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    throw exception_js_1.default.BadRequestError('S3 ERROR', 'upload file error.', null);
                }
                else {
                    resolve(data.Location);
                    console.log('File uploaded successfully. S3 URL:', data.Location);
                }
            });
        });
    }
    static deleteFolder(folderPath) {
        try {
            fs_1.default.rmdirSync(folderPath, { recursive: true });
            console.log(`成功删除文件夹：${folderPath}`);
        }
        catch (err) {
            console.error(`删除文件夹时发生错误：${err}`);
        }
    }
    static deleteFile(filePath) {
        try {
            fs_1.default.rmSync(filePath, { recursive: true });
            console.log(`成功删除文件：${filePath}`);
        }
        catch (err) {
            console.error(`删除文件时发生错误：${err}`);
        }
    }
}
exports.Release = Release;
//# sourceMappingURL=release.js.map