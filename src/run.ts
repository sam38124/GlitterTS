import path from "path";
import {initial} from "./index";
import {ConfigSetting} from "./config";

ConfigSetting.setConfig(path.resolve(`/Users/jianzhi.wang/Desktop/square_studio/APP檔案/合宜家居/front-editor/backend_default/environments/local.env`))
initial(4000).then(async () => {});

