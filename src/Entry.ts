'use strict';
import { Glitter } from './glitterBundle/Glitter.js';

export class Entry {
    public static onCreate(glitter: Glitter) {
        (window as any).mode = 'dark';
        (window as any).root = document.getElementsByTagName('html')[0];
        (window as any).root.classList.add('dark-mode');
        glitter.setHome(
            `jspage/${glitter.getUrlParameter('page') ?? 'getting-started/introduction'}.js`,
            glitter.getUrlParameter('page') ?? 'getting-started/introduction',
            {}
        );

    }
}
