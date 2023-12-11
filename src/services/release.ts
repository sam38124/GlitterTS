import fs from "fs";
import path from "path";
import archiver from "archiver";
import AWS from "aws-sdk";
import config from "../config.js";
import exception from "../modules/exception.js";

export class Release {
    public static ios(cf: {
        appName: string, bundleID: string, appDomain: string, project_router: string, glitter_domain: string
    }) {
        try {

            let data = fs.readFileSync(cf.project_router, 'utf8');
            data = data.replace(/PRODUCT_BUNDLE_IDENTIFIER([\s\S]*?);/g, `PRODUCT_BUNDLE_IDENTIFIER = ${cf.bundleID};`)
                .replace(/INFOPLIST_KEY_CFBundleDisplayName([\s\S]*?);/g, `INFOPLIST_KEY_CFBundleDisplayName = "${cf.appName}";`)
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
`
            fs.writeFileSync(cf.project_router, data);
            fs.writeFileSync(path.resolve(cf.project_router, '../../proshake/Info.plist'), infoPlist);
            fs.writeFileSync(path.resolve(cf.project_router, '../../proshake/GlitterUI/index.html'), (() => {
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

</html>`
                return html
            })());
        } catch (e) {
            console.log(e)
        }

    }

    public static android(cf: {
        appName: string, bundleID: string, appDomain: string, project_router: string, glitter_domain: string
    }) {
        try {
            fs.writeFileSync(path.resolve(cf.project_router, './app/src/main/assets/src/home.html'), (() => {
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
</html>`
                return html
            })());
        } catch (e) {
            console.log(e)
        }

    }

    public static  copyFolderSync(source:string, target:string) {
        // 確保目標資料夾存在，如果不存在則建立
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target);
        }

        // 讀取源資料夾中的所有檔案/資料夾
        const files = fs.readdirSync(source);

        // 遍歷所有檔案/資料夾
        files.forEach((file) => {
            const sourcePath = path.join(source, file);
            const targetPath = path.join(target, file);

            // 檢查是否為資料夾
            if (fs.statSync(sourcePath).isDirectory()) {
                // 如果是資料夾，遞迴地複製資料夾
                this.copyFolderSync(sourcePath, targetPath);
            } else {
                // 如果是檔案，直接複製檔案
                fs.copyFileSync(sourcePath, targetPath);
            }
        });
    }

    public static removeAllFilesInFolder(folderPath:string) {
        // 读取目标文件夹内所有文件和子文件夹
        const files = fs.readdirSync(folderPath);

        // 遍历所有文件和子文件夹
        files.forEach((file) => {
            const filePath = path.join(folderPath, file);

            // 检查是否为文件
            if (fs.statSync(filePath).isFile()) {
                // 如果是文件，删除文件
                fs.unlinkSync(filePath);
            } else {
                // 如果是子文件夹，递归地删除子文件夹内所有文件
                this.removeAllFilesInFolder(filePath);

                // 删除空的子文件夹
                fs.rmdirSync(filePath);
            }
        });
    }

    public static  compressFiles(inputFolder:string, outputZip:string) {
       return new Promise((resolve, reject)=>{
           // 創建壓縮器實例
           const archive = archiver('zip', { zlib: { level: 9 } });

           // 創建壓縮檔案
           const output = fs.createWriteStream(outputZip);

           // 將壓縮器與輸出流相連
           archive.pipe(output);

           // 將指定目錄的所有內容添加到壓縮器中
           archive.directory(inputFolder, false);

           // 完成壓縮
           archive.finalize();

           // 監聽壓縮完成事件
           output.on('close', function () {
               resolve(true)
           });

           // 監聽壓縮出錯事件
           archive.on('error', function (err:any) {
               resolve(false)
           });
       })
    }
    public static  uploadFile(filePath:string,fileName:string){
        return new Promise((resolve, reject)=>{
            const s3 = new AWS.S3();
            const bucketName = config.AWS_S3_NAME; // 替换为你的S3存储桶名称

            const params :any= {
                Bucket: bucketName,
                Key: fileName,
                Body: fs.createReadStream(filePath)
            };

            s3.upload(params, (err:any, data:any) => {
                if (err) {
                    console.error('Error uploading file:', err);
                    throw exception.BadRequestError('S3 ERROR','upload file error.',null)
                } else {
                    resolve(data.Location)
                    console.log('File uploaded successfully. S3 URL:', data.Location);
                }
            });
        })

    }

    public static deleteFolder(folderPath:string) {
        try {
            // 删除目标文件夹
            fs.rmdirSync(folderPath, { recursive: true });
            console.log(`成功删除文件夹：${folderPath}`);
        } catch (err) {
            console.error(`删除文件夹时发生错误：${err}`);
        }
    }
    public static deleteFile(filePath:string) {
        try {
            // 删除目标文件夹
            fs.rmSync(filePath, { recursive: true });
            console.log(`成功删除文件：${filePath}`);
        } catch (err) {
            console.error(`删除文件时发生错误：${err}`);
        }
    }
}