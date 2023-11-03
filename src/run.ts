import path from "path";
import {initial} from "./index";
import {ConfigSetting} from "./config";
import fs from "fs";


ConfigSetting.setConfig(path.resolve(`/Users/jianzhi.wang/Desktop/square_studio/APP檔案/合宜家居/front-editor/backend_default/environments/local.env`))
initial(4000).then(async () => {});

// window.scrollY;
// window.scrollTo(0, 0);
window.scrollTo({
    top: 0,
    behavior: 'smooth' // 'auto' 表示无滚动动画
  });
