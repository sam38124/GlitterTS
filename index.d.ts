import express from 'express';
import cors from 'cors';
import * as core from "express-serve-static-core";
import * as fs from "fs";

export function setUP(express: core.Express, rout: { rout: string, path: string }[]):any;

/*test*/
// const app = express();
// const corsOptions = {
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));
// app.use(express.json({limit: '50MB'}));
// (async () => {
//     await app.listen('3080');
// })();

// Glitter.setUP(app, [{
//     rout: '/test',
//     path: '/Users/jianzhi.wang/Desktop/square_studio/npm_library/Glitter/lib'
// }])
