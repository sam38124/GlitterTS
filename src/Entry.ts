'use strict';
import { Glitter } from './glitterBundle/Glitter.js';

export class Entry {
    public static onCreate(glitter: Glitter) {
        (window as any).mode = 'dark';
        (window as any).root = document.getElementsByTagName('html')[0];
        (window as any).root.classList.add('dark-mode');
        glitter.addMtScript(['https://kit.fontawesome.com/02e2dc09e3.js'],()=>{},()=>{})
        glitter.setHome(
            `jspage/${glitter.getUrlParameter('page') ?? 'getting-started/introduction'}.js`,
            glitter.getUrlParameter('page') ?? 'getting-started/introduction',
            {}
        );
        // $.ajax({
        //     url: `https://api.github.com/repos/sam38124/Glitter_Plugin_Bluetooth/releases/latest`,
        //     type: 'GET',
        //     contentType: 'application/json; charset=utf-8',
        //     success: (resposnse: any) => {
        //         resposnse.tag_name
        //     },
        //     error: () => {
        //     },
        // });
        //
    }
}
