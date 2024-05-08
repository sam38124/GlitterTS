import path from 'path';
import { initial } from './index';
import { ConfigSetting } from './config';

ConfigSetting.setConfig(path.resolve(`/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/backend_default/environments/staging.env`));
// ConfigSetting.setConfig(path.resolve(`/Users/daniellin/Desktop/GlitterEnv/staging.env`));

initial(4000).then(async () => {
    // ReleaseIos.release()
    // createEC2Instance('')
});
