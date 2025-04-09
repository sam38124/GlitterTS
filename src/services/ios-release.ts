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
import { AppReleaseConfig } from './release.js';

export class IosRelease {
  //產生APP的圖標
  public static async generateIcon(url: string, inputImage: string, outputDir: string) {
    //下載IOS APP LOGO
    await downloadImage(url, inputImage);
    // 定義 iOS App Icon 尺寸
    const iosIconSizes = [
      {
        filename: '40.png',
        idiom: 'iphone',
        scale: '2x',
        size: '20x20',
      },
      {
        filename: '60.png',
        idiom: 'iphone',
        scale: '3x',
        size: '20x20',
      },
      {
        filename: '29.png',
        idiom: 'iphone',
        scale: '1x',
        size: '29x29',
      },
      {
        filename: '58.png',
        idiom: 'iphone',
        scale: '2x',
        size: '29x29',
      },
      {
        filename: '87.png',
        idiom: 'iphone',
        scale: '3x',
        size: '29x29',
      },
      {
        filename: '80.png',
        idiom: 'iphone',
        scale: '2x',
        size: '40x40',
      },
      {
        filename: '120.png',
        idiom: 'iphone',
        scale: '3x',
        size: '40x40',
      },
      {
        filename: '57.png',
        idiom: 'iphone',
        scale: '1x',
        size: '57x57',
      },
      {
        filename: '114.png',
        idiom: 'iphone',
        scale: '2x',
        size: '57x57',
      },
      {
        filename: '120.png',
        idiom: 'iphone',
        scale: '2x',
        size: '60x60',
      },
      {
        filename: '180.png',
        idiom: 'iphone',
        scale: '3x',
        size: '60x60',
      },
      {
        filename: '20.png',
        idiom: 'ipad',
        scale: '1x',
        size: '20x20',
      },
      {
        filename: '40.png',
        idiom: 'ipad',
        scale: '2x',
        size: '20x20',
      },
      {
        filename: '29.png',
        idiom: 'ipad',
        scale: '1x',
        size: '29x29',
      },
      {
        filename: '58.png',
        idiom: 'ipad',
        scale: '2x',
        size: '29x29',
      },
      {
        filename: '40.png',
        idiom: 'ipad',
        scale: '1x',
        size: '40x40',
      },
      {
        filename: '80.png',
        idiom: 'ipad',
        scale: '2x',
        size: '40x40',
      },
      {
        filename: '50.png',
        idiom: 'ipad',
        scale: '1x',
        size: '50x50',
      },
      {
        filename: '100.png',
        idiom: 'ipad',
        scale: '2x',
        size: '50x50',
      },
      {
        filename: '72.png',
        idiom: 'ipad',
        scale: '1x',
        size: '72x72',
      },
      {
        filename: '144.png',
        idiom: 'ipad',
        scale: '2x',
        size: '72x72',
      },
      {
        filename: '76.png',
        idiom: 'ipad',
        scale: '1x',
        size: '76x76',
      },
      {
        filename: '152.png',
        idiom: 'ipad',
        scale: '2x',
        size: '76x76',
      },
      {
        filename: '167.png',
        idiom: 'ipad',
        scale: '2x',
        size: '83.5x83.5',
      },
      {
        filename: '1024.png',
        idiom: 'ios-marketing',
        scale: '1x',
        size: '1024x1024',
      },
      {
        filename: '16.png',
        idiom: 'mac',
        scale: '1x',
        size: '16x16',
      },
      {
        filename: '32.png',
        idiom: 'mac',
        scale: '2x',
        size: '16x16',
      },
      {
        filename: '32.png',
        idiom: 'mac',
        scale: '1x',
        size: '32x32',
      },
      {
        filename: '64.png',
        idiom: 'mac',
        scale: '2x',
        size: '32x32',
      },
      {
        filename: '128.png',
        idiom: 'mac',
        scale: '1x',
        size: '128x128',
      },
      {
        filename: '256.png',
        idiom: 'mac',
        scale: '2x',
        size: '128x128',
      },
      {
        filename: '256.png',
        idiom: 'mac',
        scale: '1x',
        size: '256x256',
      },
      {
        filename: '512.png',
        idiom: 'mac',
        scale: '2x',
        size: '256x256',
      },
      {
        filename: '512.png',
        idiom: 'mac',
        scale: '1x',
        size: '512x512',
      },
      {
        filename: '1024.png',
        idiom: 'mac',
        scale: '2x',
        size: '512x512',
      },
      {
        filename: '48.png',
        idiom: 'watch',
        role: 'notificationCenter',
        scale: '2x',
        size: '24x24',
        subtype: '38mm',
      },
      {
        filename: '55.png',
        idiom: 'watch',
        role: 'notificationCenter',
        scale: '2x',
        size: '27.5x27.5',
        subtype: '42mm',
      },
      {
        filename: '58.png',
        idiom: 'watch',
        role: 'companionSettings',
        scale: '2x',
        size: '29x29',
      },
      {
        filename: '87.png',
        idiom: 'watch',
        role: 'companionSettings',
        scale: '3x',
        size: '29x29',
      },
      {
        filename: '66.png',
        idiom: 'watch',
        role: 'notificationCenter',
        scale: '2x',
        size: '33x33',
        subtype: '45mm',
      },
      {
        filename: '80.png',
        idiom: 'watch',
        role: 'appLauncher',
        scale: '2x',
        size: '40x40',
        subtype: '38mm',
      },
      {
        filename: '88.png',
        idiom: 'watch',
        role: 'appLauncher',
        scale: '2x',
        size: '44x44',
        subtype: '40mm',
      },
      {
        filename: '92.png',
        idiom: 'watch',
        role: 'appLauncher',
        scale: '2x',
        size: '46x46',
        subtype: '41mm',
      },
      {
        filename: '100.png',
        idiom: 'watch',
        role: 'appLauncher',
        scale: '2x',
        size: '50x50',
        subtype: '44mm',
      },
      {
        idiom: 'watch',
        role: 'appLauncher',
        scale: '2x',
        size: '51x51',
        subtype: '45mm',
      },
      {
        idiom: 'watch',
        role: 'appLauncher',
        scale: '2x',
        size: '54x54',
        subtype: '49mm',
      },
      {
        filename: '172.png',
        idiom: 'watch',
        role: 'quickLook',
        scale: '2x',
        size: '86x86',
        subtype: '38mm',
      },
      {
        filename: '196.png',
        idiom: 'watch',
        role: 'quickLook',
        scale: '2x',
        size: '98x98',
        subtype: '42mm',
      },
      {
        filename: '216.png',
        idiom: 'watch',
        role: 'quickLook',
        scale: '2x',
        size: '108x108',
        subtype: '44mm',
      },
      {
        idiom: 'watch',
        role: 'quickLook',
        scale: '2x',
        size: '117x117',
        subtype: '45mm',
      },
      {
        idiom: 'watch',
        role: 'quickLook',
        scale: '2x',
        size: '129x129',
        subtype: '49mm',
      },
      {
        filename: '1024.png',
        idiom: 'watch-marketing',
        scale: '1x',
        size: '1024x1024',
      },
      {
        filename: '102.png',
        idiom: 'watch',
        role: 'appLauncher',
        scale: '2x',
        size: '45x45',
        subtype: '41mm',
      },
    ];

    // 確保輸出資料夾存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // 生成圖標函數
    async function generateIcons(inputImage: string) {
      for (let icon of iosIconSizes) {
        if (icon.filename) {
          const iconSize = parseInt(icon.size.split('x')[0], 10) * parseInt(icon.scale.replace('x', ''), 10); // 計算實際尺寸（px）
          const outputFile = path.join(outputDir, icon.filename);
          let try_c = 0;
          let pass = false;
          while (try_c < 3 && !pass) {
            // 使用 sharp 生成指定尺寸圖片
            try {
              await sharp(inputImage)
                .resize(iconSize, iconSize) // 調整寬高
                .toFile(outputFile); // 輸出到檔案
              console.log(`Generated: ${outputFile}`);
              pass = true;
            } catch (error) {
              try_c++;
              console.error(`Failed to generate icon ${outputFile}:`, error);
            }
          }
        }
      }
    }

    // 開始生成圖標
    await generateIcons(inputImage);
  }

  //產生APP的封面圖片
  public static async generateAppLanding(url: string, inputImage: string, outputDir: string) {
    //下載Landing Page
    await downloadImage(url, inputImage);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
    //覆蓋封面圖片
    for (const b of ['封面.png', '封面 1.png', '封面 2.png']) {
      fs.copyFileSync(inputImage, `${outputDir}/${b}`);
    }
  }

  //更改包名
  public static changePackageName(project_router: string, bundleID: string, config: AppReleaseConfig) {
    let data = fs.readFileSync(project_router, 'utf8');
    data = data
      .replace(/PRODUCT_BUNDLE_IDENTIFIER([\s\S]*?);/g, `PRODUCT_BUNDLE_IDENTIFIER = ${bundleID};`)
      .replace(
        /INFOPLIST_KEY_CFBundleDisplayName([\s\S]*?);/g,
        `INFOPLIST_KEY_CFBundleDisplayName = "${config.name}";`
      );
    fs.writeFileSync(path.resolve(project_router), data);
  }

  //更改InfoPlist
  public static changeInfo(project_router: string, bundleID: string, config: AppReleaseConfig) {
    const pat_=path.resolve(project_router, '../../proshake/Info.plist')
    let data = fs.readFileSync(pat_, 'utf8');
    data = data
      .replace('com.shopnex.t-1725992531001', bundleID)
      .replace('com.shopnex.t-1725992531001', bundleID)
    fs.writeFileSync(pat_, data);
  }

  //
  public static async start(cf: {
    appName: string;
    bundleID: string;
    appDomain: string;
    project_router: string;
    glitter_domain: string;
    domain_url: string;
    config: AppReleaseConfig;
  }) {
    try {
      //註冊FCM推播通知
      await Firebase.appRegister({
        appName: cf.appDomain,
        appID: cf.bundleID,
        type: 'ios',
      });
      //產生APP的ICON
      await IosRelease.generateIcon(
        cf.config.logo,
        path.resolve(cf.project_router, '../../proshake/Assets.xcassets/AppIcon.appiconset/original.png'),
        path.resolve(cf.project_router, '../../proshake/Assets.xcassets/AppIcon.appiconset')
      );
      //產生封面圖片
      await IosRelease.generateAppLanding(
        cf.config.landing_page,
        path.resolve(cf.project_router, '../../proshake/Assets.xcassets/preview.imageset/original.png'),
        path.resolve(cf.project_router, '../../proshake/Assets.xcassets/preview.imageset')
      );
      //更改APP包名
      this.changePackageName(cf.project_router, cf.bundleID, cf.config);
      //更改Info
      this.changeInfo(cf.project_router, cf.bundleID, cf.config);

      fs.writeFileSync(
        path.resolve(cf.project_router, '../../proshake/ViewController.swift'),
        IosProject.getViewController(`https://${cf.domain_url}`)
      );
      fs.writeFileSync(
        path.resolve(cf.project_router, '../../proshake/GoogleService-Info.plist'),
        (await Firebase.getConfig({
          appID: cf.bundleID,
          type: 'ios',
          appDomain: cf.appDomain,
        })) as string
      );
    } catch (e) {
      console.log(e);
    }
  }
}

async function downloadImage(url: string, outputPath: string) {
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
