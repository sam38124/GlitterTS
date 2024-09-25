import path from 'path';
import fs from 'fs';
import { initial } from './index';
import { ConfigSetting } from './config';

const wangPath = `/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/backend_default/environments/staging.env`;
const danielPath = `/Users/daniellin/Desktop/GlitterEnv/staging.env`;
const zackPath = `/Users/wangjianzhi/Desktop/CODENEX/staging.env`;

if (fs.existsSync(path.resolve(wangPath))) {
    console.log('使用 Wang 路徑環境');
    ConfigSetting.runSchedule = false;
    ConfigSetting.setConfig(wangPath);
}

if (fs.existsSync(path.resolve(danielPath))) {
    console.log('使用 Daniel 路徑環境');
    ConfigSetting.runSchedule = false;
    ConfigSetting.setConfig(danielPath);
}

if (fs.existsSync(path.resolve(zackPath))) {
    console.log('使用 Zack 路徑環境');
    ConfigSetting.runSchedule = false;
    ConfigSetting.setConfig(zackPath);
}

export function isDanielEnv() {
    return fs.existsSync(path.resolve(danielPath));
}

ConfigSetting.is_local = true;
initial(4000).then(async () => {
    // ReleaseIos.release()
    // createEC2Instance('')
});
