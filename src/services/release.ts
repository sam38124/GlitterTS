import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import AWS from 'aws-sdk';
import config from '../config.js';
import exception from '../modules/exception.js';
import { Firebase } from '../modules/firebase.js';
import { IosProject } from './ios-project.js';
import { AndroidProject } from './android-project.js';
import sharp from 'sharp';
import axios from 'axios';
import { IosRelease } from './ios-release.js';

export interface AppReleaseConfig {
  logo: string;
  name: string;
  status: string;
  keywords: string;
  copy_right: string;
  store_name: string;
  description: string;
  privacy_url: string;
  promote_img: string;
  support_url: string;
  landing_page: string;
  contact_email: string;
  contact_phone: string;
  store_sub_title: string;
  app_store_promote: string;
  google_play_promote: string;
}

export class Release {
  public static async android(cf: {
    appName: string;
    bundleID: string;
    appDomain: string;
    project_router: string;
    glitter_domain: string;
    domain_url: string;
    config: AppReleaseConfig;
  }) {
    try {
      console.log(`cf=>`, cf);

      await Firebase.appRegister({
        appName: cf.appDomain,
        appID: cf.bundleID,
        type: 'android',
      });

      fs.writeFileSync(
        path.resolve(cf.project_router, './app/google-services.json'),
        (await Firebase.getConfig({
          appID: cf.bundleID,
          type: 'android',
          appDomain: cf.appDomain,
        })) as string
      );
      await this.resetProjectRouter({
        project_router: cf.project_router,
        targetString: 'www.smilebio.io',
        replacementString: cf.bundleID,
      });

      function replaceInFile(filePath: string, targetString: string, replacementString: string) {
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error(`Error reading file ${filePath}:`, err);
              return;
            }
            if (data.includes(targetString)) {
              const result = data.replace(new RegExp(targetString, 'g'), replacementString);
              fs.writeFile(filePath, result, 'utf8', err => {
                if (err) {
                  console.error(`Error writing file ${filePath}:`, err);
                } else {
                  console.log(`Replaced in file: ${filePath}`);
                }
                setTimeout(() => {resolve(true);},100)
              });
            }
          });
        });
      }
      //更換網址
      await replaceInFile(path.resolve(cf.project_router, './app/src/main/java/www/smilebio/io/MyAPP.kt'),'https://www.smilebio.com',`https://${cf.domain_url}`)
      //更換包名
      await replaceInFile(path.resolve(cf.project_router, './app/src/main/java/www/smilebio/io/MyAPP.kt'),'www.smilebio.io',cf.bundleID)
      //更換APP名
      await this.resetProjectRouter({
        project_router: cf.project_router,
        targetString: `<string name="app_name">Kenda</string>`,
        replacementString: `<string name="app_name">${cf.config.name}</string>`,
      });

      fs.renameSync(
        path.resolve(cf.project_router, './app/src/main/java/www/smilebio/io'),
        path.resolve(cf.project_router, 'temp_file')
      );
      Release.deleteFolder(path.resolve(cf.project_router, './app/src/main/java/com'));
      fs.mkdirSync(path.resolve(cf.project_router, `./app/src/main/java/${cf.bundleID.split('.').join('/')}`), {
        recursive: true,
      });
      fs.renameSync(
        path.resolve(cf.project_router, 'temp_file'),
        path.resolve(cf.project_router, `./app/src/main/java/${cf.bundleID.split('.').join('/')}`)
      );
      //下載IOS APP LOGO
      await this.downloadImage(cf.config.logo, path.resolve(cf.project_router, `./app/src/main/res/autogen.png`));
      await new Promise(resolve => setTimeout(resolve, 1000));
      //產生Android APP ICON
      await Release.generateAndroidIcon(
        path.resolve(cf.project_router, `./app/src/main/res/autogen.png`),
        path.resolve(cf.project_router, `./app/src/main/res`)
      );
    } catch (e) {
      console.log(e);
    }
  }

  public static async downloadImage(url: string, outputPath: string) {
    try {
      const response = await axios({
        url, // 圖片的 URL
        method: 'GET',
        responseType: 'stream', // 請求以流的方式返回數據
      });

      // 將圖片存儲到本地檔案
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      writer.on('finish', () => console.log('Image downloaded successfully:', outputPath));
      writer.on('error', err => {
        console.error('Error writing the image to disk:', err);
      });
    } catch (error: any) {
      console.error(`Error while downloading image:${error}`);
    }
  }

  public static async generateAndroidIcon(sourceIcon: string, outputDir: string) {
    try {
      // 原始圖示的 base 尺寸（以 mdpi 為基準）
      const baseSize = 48;
      // Android 各密度對應比例（相對於 mdpi）
      const densities = {
        mdpi: 1,
        hdpi: 1.5,
        xhdpi: 2,
        xxhdpi: 3,
        xxxhdpi: 4,
      };
      // 建立每個 mipmap 資料夾並輸出對應尺寸的圖示
      for (const [density, scale] of Object.entries(densities)) {
        const size = Math.round(baseSize * scale);
        const folderPath = path.join(outputDir, `mipmap-${density}`);
        const outputPath = path.join(folderPath, 'ic_launcher_png.png');

        await sharp(sourceIcon).resize(size, size).toFile(outputPath);

        console.log(`✅ Created: ${outputPath}`);
      }

      console.log('🎉 所有 mipmap 圖示已建立完畢。');
    } catch (err) {
      console.error('❌ 發生錯誤:', err);
    }
  }

  public static async resetProjectRouter(cf: {
    project_router: string;
    targetString: string;
    replacementString: string;
  }) {
    const replaceInFile = (filePath: string) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${filePath}:`, err);
          return;
        }

        if (data.includes(cf.targetString)) {
          const result = data.replace(new RegExp(cf.targetString, 'g'), cf.replacementString);

          fs.writeFile(filePath, result, 'utf8', err => {
            if (err) {
              console.error(`Error writing file ${filePath}:`, err);
            } else {
              console.log(`Replaced in file: ${filePath}`);
            }
          });
        }
      });
    };
    const traverseDirectory = (dir: string) => {
      fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error(`Error reading directory ${dir}:`, err);
          return;
        }

        files.forEach(file => {
          const fullPath = path.join(dir, file.name);

          if (file.isDirectory()) {
            traverseDirectory(fullPath);
          } else if (file.isFile()) {
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

  public static getHtml(cf: {
    appName: string;
    bundleID: string;
    appDomain: string;
    project_router: string;
    glitter_domain: string;
  }) {
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
${
  '<script>\n' +
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
  '</script>'
}
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

  public static copyFolderSync(source: string, target: string) {
    // 確保目標資料夾存在，如果不存在則建立
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }

    // 讀取源資料夾中的所有檔案/資料夾
    const files = fs.readdirSync(source);

    // 遍歷所有檔案/資料夾
    files.forEach(file => {
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

  public static removeAllFilesInFolder(folderPath: string) {
    // 读取目标文件夹内所有文件和子文件夹
    const files = fs.readdirSync(folderPath);
    // 遍历所有文件和子文件夹
    files.forEach(file => {
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

  public static compressFiles(inputFolder: string, outputZip: string) {
    return new Promise((resolve, reject) => {
      // 建立壓縮器實例
      const archive = archiver('zip', { zlib: { level: 9 } });

      // 建立壓縮檔案
      const output = fs.createWriteStream(outputZip);

      // 將壓縮器與輸出流相連
      archive.pipe(output);

      // 將指定目錄的所有內容添加到壓縮器中
      archive.directory(inputFolder, false);

      // 完成壓縮
      archive.finalize();

      // 監聽壓縮完成事件
      output.on('close', function () {
        resolve(true);
      });

      // 監聽壓縮出錯事件
      archive.on('error', function (err: any) {
        resolve(false);
      });
    });
  }

  public static uploadFile(filePath: string, fileName: string) {
    return new Promise((resolve, reject) => {
      const s3 = new AWS.S3();
      const bucketName = config.AWS_S3_NAME; // 替换为你的S3存储桶名称

      const params: any = {
        Bucket: bucketName,
        Key: fileName,
        Body: fs.createReadStream(filePath),
      };

      s3.upload(params, (err: any, data: any) => {
        if (err) {
          console.error('Error uploading file:', err);
          throw exception.BadRequestError('S3 ERROR', 'upload file error.', null);
        } else {
          resolve(data.Location);
          console.log('File uploaded successfully. S3 URL:', data.Location);
        }
      });
    });
  }

  public static deleteFolder(folderPath: string) {
    try {
      // 删除目标文件夹
      fs.rmdirSync(folderPath, { recursive: true });
      console.log(`成功删除文件夹：${folderPath}`);
    } catch (err) {
      console.error(`删除文件夹时发生错误：${err}`);
    }
  }

  public static deleteFile(filePath: string) {
    try {
      // 删除目标文件夹
      fs.rmSync(filePath, { recursive: true });
      console.log(`成功删除文件：${filePath}`);
    } catch (err) {
      console.error(`删除文件时发生错误：${err}`);
    }
  }
}
