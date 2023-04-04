import * as Glitter from 'ts-glitter';
import path from "path";
import express from 'express';
import cors from 'cors';
//Glitter FrontEnd Rout
const app = express();
(async () => {
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    app.use(cors(corsOptions));
    await app.listen(4000);
})();
Glitter.set_frontend(app, [
    {
        rout: '/test',
        path: path.resolve(__dirname, '../../src'),
        seoManager:(req,resp)=>{
            return new Promise((resolve, reject)=>{
                resolve('')
            })
        }
    },
]);