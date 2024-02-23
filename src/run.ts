import path from "path";
import {initial} from "./index";
import {config, ConfigSetting} from "./config";
import fs from "fs";
import {Release} from "./services/release.js";

ConfigSetting.setConfig(path.resolve(`/Users/jianzhi.wang/Desktop/square_studio/APP檔案/Glitter星澄基地/backend_default/environments/staging.env`))

initial(4000).then(async () => {
    // ReleaseIos.release()
});