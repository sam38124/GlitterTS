import path from "path";
import {initial} from "./index";
import {ConfigSetting} from "./config";

ConfigSetting.setConfig(path.resolve(`/Users/jianzhi.wang/Desktop/square_studio/APP檔案/合宜家居/erp-ordersystem/erp-ordersystem/environments/staging.env`))
 initial(4000).then(()=>{

 });
