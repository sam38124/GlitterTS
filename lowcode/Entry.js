'use strict';
export class Entry {
    static onCreate(glitter) {
        glitter.debugMode = true;
        glitter.setHome('jspage/index.js', glitter.getUrlParameter('page'), {});
    }
}
