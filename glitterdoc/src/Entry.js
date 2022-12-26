'use strict';
export class Entry {
    static onCreate(glitter) {
        var _a, _b;
        window.mode = 'dark';
        window.root = document.getElementsByTagName('html')[0];
        window.root.classList.add('dark-mode');
        glitter.addMtScript(['https://kit.fontawesome.com/02e2dc09e3.js'], () => { }, () => { });
        glitter.setHome(`jspage/${(_a = glitter.getUrlParameter('page')) !== null && _a !== void 0 ? _a : 'getting-started/introduction'}.js`, (_b = glitter.getUrlParameter('page')) !== null && _b !== void 0 ? _b : 'getting-started/introduction', {});
    }
}
