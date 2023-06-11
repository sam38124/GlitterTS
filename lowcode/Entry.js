'use strict';
export class Entry {
    static onCreate(glitter) {
        glitter.debugMode = false;
        glitter.setHome('jspage/index.js', glitter.getUrlParameter('page'), {});
    }
}
