'use strict';
export class Entry {
    static onCreate(glitter) {
        glitter.setHome('jspage/index.js', glitter.getUrlParameter('page'), {});
    }
}
