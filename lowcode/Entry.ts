'use strict';
import {Glitter} from './glitterBundle/Glitter.js' ;
import {ApiUser} from "./api/user.js";
import {Plugin} from './glitterBundle/plugins/plugin-creater.js';
import {config} from "./config.js";
import {ApiPageConfig} from "./api/pageConfig.js";

export class Entry {
    public static onCreate(glitter: Glitter) {
        glitter.debugMode=false
        glitter.setHome('jspage/index.js',glitter.getUrlParameter('page'),{});
`min-width: 100vw; min-height: 100vh; z-index: 9999; overflow: hidden; width: 100vw; background: white; position: absolute; top: 0px; left: 0px; opacity: 1;
 min-width: 100vw; min-height: 100vh; z-index: 9999; overflow: hidden; width: 100vw; background: white;  left: 0px; top: 0px;   `
    }
}
