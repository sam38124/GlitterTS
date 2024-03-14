import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import {v4 as uuidv4} from 'uuid';
import {asyncHooks as asyncHook} from './modules/hooks';
import database from "./modules/database.js";
import redis from "./modules/redis.js";
import path from "path";
import {ConfigSetting} from "./config.js";
import response from "./modules/response.js";
import * as process from "process";
const router: express.Router = express.Router();
export const app = express();
app.options('/*', (req, res) => {
    // 处理 OPTIONS 请求，返回允许的方法和头信息
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,g-app');
    res.status(200).send();
});
// 添加路由和其他中间件
app.use(cors());
app.use(express.raw());
app.use(express.json({limit: '50MB'}));
app.use(createContext);
app.use(bodyParser.raw({type: '*/*'}));
app.use(router);
app.use(require('./controllers/index'));
(async () => {
    ConfigSetting.setConfig(path.resolve(`./env/server.env`))
    const serverPort=parseInt(process.env.PORT as any,10)
    await database.createPool();
    await redis.connect();
    await app.listen(serverPort);
    console.log('[Init]', `Server is listening on port: ${serverPort}`);
    console.log('Starting up the server now.');
})()
function createContext(req: express.Request, res: express.Response, next: express.NextFunction) {
    const uuid = uuidv4();
    const ip = req.ip;
    const requestInfo = {uuid: `${uuid}`, method: `${req.method}`, url: `${req.url}`, ip: `${ip}`};
    asyncHook.getInstance().createRequestContext(requestInfo);
    next();
}


