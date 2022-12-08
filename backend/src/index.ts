import express from 'express';
import cors from 'cors';
import httpStatus from "http-status-codes";
import path from "path";

const app = express();
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50MB' }));
app.use('/doc', express.static(path.resolve(__dirname, '../../glitterdoc/src')));

(async () => {
    await app.listen('3080');
})();

app.post('/test', async (req: express.Request, resp: express.Response) => {
    return  resp.status(httpStatus.OK).json({test:'1334'});;
});
