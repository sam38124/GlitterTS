'use strict';
import {Glitter} from './glitterBundle/Glitter.js' ;
import {ApiUser} from "./api/user.js";
import {Plugin} from './glitterBundle/plugins/plugin-creater.js';
import {config} from "./config.js";
import {ApiPageConfig} from "./api/pageConfig.js";

export class Entry {
    public static onCreate(glitter: Glitter) {
        glitter.setHome('jspage/index.js',glitter.getUrlParameter('page'),{});
    }
}
