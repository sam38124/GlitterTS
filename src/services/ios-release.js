"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IosRelease = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const firebase_js_1 = require("../modules/firebase.js");
const ios_project_js_1 = require("./ios-project.js");
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
class IosRelease {
    static async generateIcon(url, inputImage, outputDir) {
        await downloadImage(url, inputImage);
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
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir);
        }
        async function generateIcons(inputImage) {
            for (let icon of iosIconSizes) {
                if (icon.filename) {
                    const iconSize = parseInt(icon.size.split('x')[0], 10) * parseInt(icon.scale.replace('x', ''), 10);
                    const outputFile = path_1.default.join(outputDir, icon.filename);
                    let try_c = 0;
                    let pass = false;
                    while (try_c < 3 && !pass) {
                        try {
                            await (0, sharp_1.default)(inputImage)
                                .resize(iconSize, iconSize)
                                .toFile(outputFile);
                            console.log(`Generated: ${outputFile}`);
                            pass = true;
                        }
                        catch (error) {
                            try_c++;
                            console.error(`Failed to generate icon ${outputFile}:`, error);
                        }
                    }
                }
            }
        }
        await generateIcons(inputImage);
    }
    static async generateAppLanding(url, inputImage, outputDir) {
        await downloadImage(url, inputImage);
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
        for (const b of ['封面.png', '封面 1.png', '封面 2.png']) {
            fs_1.default.copyFileSync(inputImage, `${outputDir}/${b}`);
        }
    }
    static changePackageName(project_router, bundleID, config) {
        let data = fs_1.default.readFileSync(project_router, 'utf8');
        data = data
            .replace(/PRODUCT_BUNDLE_IDENTIFIER([\s\S]*?);/g, `PRODUCT_BUNDLE_IDENTIFIER = ${bundleID};`)
            .replace(/INFOPLIST_KEY_CFBundleDisplayName([\s\S]*?);/g, `INFOPLIST_KEY_CFBundleDisplayName = "${config.name}";`);
        fs_1.default.writeFileSync(path_1.default.resolve(project_router), data);
    }
    static changeInfo(project_router, bundleID, config) {
        const pat_ = path_1.default.resolve(project_router, '../../proshake/Info.plist');
        let data = fs_1.default.readFileSync(pat_, 'utf8');
        data = data
            .replace('com.shopnex.t-1725992531001', bundleID)
            .replace('com.shopnex.t-1725992531001', bundleID);
        fs_1.default.writeFileSync(pat_, data);
    }
    static async start(cf) {
        try {
            await firebase_js_1.Firebase.appRegister({
                appName: cf.appDomain,
                appID: cf.bundleID,
                type: 'ios',
            });
            await IosRelease.generateIcon(cf.config.logo, path_1.default.resolve(cf.project_router, '../../proshake/Assets.xcassets/AppIcon.appiconset/original.png'), path_1.default.resolve(cf.project_router, '../../proshake/Assets.xcassets/AppIcon.appiconset'));
            await IosRelease.generateAppLanding(cf.config.landing_page, path_1.default.resolve(cf.project_router, '../../proshake/Assets.xcassets/preview.imageset/original.png'), path_1.default.resolve(cf.project_router, '../../proshake/Assets.xcassets/preview.imageset'));
            this.changePackageName(cf.project_router, cf.bundleID, cf.config);
            this.changeInfo(cf.project_router, cf.bundleID, cf.config);
            fs_1.default.writeFileSync(path_1.default.resolve(cf.project_router, '../../proshake/ViewController.swift'), ios_project_js_1.IosProject.getViewController(`https://${cf.domain_url}`));
            fs_1.default.writeFileSync(path_1.default.resolve(cf.project_router, '../../proshake/GoogleService-Info.plist'), (await firebase_js_1.Firebase.getConfig({
                appID: cf.bundleID,
                type: 'ios',
                appDomain: cf.appDomain,
            })));
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.IosRelease = IosRelease;
async function downloadImage(url, outputPath) {
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
//# sourceMappingURL=ios-release.js.map