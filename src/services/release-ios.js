"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseIos = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const archiver_1 = __importDefault(require("archiver"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_js_1 = __importDefault(require("../config.js"));
const exception_js_1 = __importDefault(require("../modules/exception.js"));
class ReleaseIos {
    static release(cf) {
        try {
            let data = fs_1.default.readFileSync(cf.project_router, 'utf8');
            data = data.replace(/PRODUCT_BUNDLE_IDENTIFIER([\s\S]*?);/g, `PRODUCT_BUNDLE_IDENTIFIER = ${cf.bundleID};`)
                .replace(/INFOPLIST_KEY_CFBundleDisplayName([\s\S]*?);/g, `INFOPLIST_KEY_CFBundleDisplayName = "${cf.appName}";`);
            const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>UIApplicationSceneManifest</key>
	<dict>
		<key>UIApplicationSupportsMultipleScenes</key>
		<false/>
		<key>UISceneConfigurations</key>
		<dict>
			<key>UIWindowSceneSessionRoleApplication</key>
			<array>
				<dict>
					<key>UISceneConfigurationName</key>
					<string>Default Configuration</string>
					<key>UISceneDelegateClassName</key>
					<string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
					<key>UISceneStoryboardFile</key>
					<string>Main</string>
				</dict>
			</array>
		</dict>
	</dict>
</dict>
</plist>
`;
            fs_1.default.writeFileSync(cf.project_router, data);
            fs_1.default.writeFileSync(path_1.default.resolve(cf.project_router, '../../proshake/Info.plist'), infoPlist);
            fs_1.default.writeFileSync(path_1.default.resolve(cf.project_router, '../../proshake/GlitterUI/index.html'), (() => {
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
            })());
        }
        catch (e) {
            console.log(e);
        }
    }
    static copyFolderSync(source, target) {
        if (!fs_1.default.existsSync(target)) {
            fs_1.default.mkdirSync(target);
        }
        const files = fs_1.default.readdirSync(source);
        files.forEach((file) => {
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
        files.forEach((file) => {
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
                Body: fs_1.default.createReadStream(filePath)
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
exports.ReleaseIos = ReleaseIos;
//# sourceMappingURL=release-ios.js.map