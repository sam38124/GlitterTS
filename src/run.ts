import path from "path";
import {initial} from "./index";
import {ConfigSetting} from "./config";

ConfigSetting.setConfig(path.resolve(__dirname,`../environments/staging.env`))
 initial(3090).then(()=>{

 });
