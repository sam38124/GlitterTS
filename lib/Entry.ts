'use strict';
import {Glitter} from './glitterBundle/Glitter.js' ;


export class Entry {
    public static onCreate(glitter: Glitter) {
        glitter.setHome('jspage/helloworld.ts', 'helloworld', {},{})
    }
}





