import * as Glitter from '@jianzhi.wang/glitter';
import path from "path";
import express from 'express';
//Glitter FrontEnd Rout
const app = express();
(async () => {
    await app.listen(3080);
})();
/*
*
* */
Glitter.setUP(app, [
    {
        rout: '/test',
        path: path.resolve(__dirname, '../../src'),
        seoManager:()=>{
            return ''
        }
    },
]);