import exception from "../../modules/exception.js";
import db from "../../modules/database.js";

export class GraphApi {
    public appName: string

    constructor(appName: string) {
        this.appName = appName
    }

    public async insert(data: {
        route: 'string',
        method: 'get' | 'post' | 'put' | 'delete' | 'patch',
        info: any
    }) {
        try {
            data.info = JSON.stringify(data.info);
            if ((await db.query(`
                select count(1)
                from \`${this.appName}\`.t_graph_api
                where route = ?
                  and method = ?
            `, [data.route, data.method]))[0]['count(1)'] === 1) {
                throw exception.BadRequestError('ALREADY_EXISTS', "THIS API ALREADY EXISTS.", null);
            }
            const result = await db.query(`insert into \`${this.appName}\`.t_graph_api
                                           set ?`, [data])
            return {
                result: true,
                inertID: result.insertId
            }
        } catch (e: any) {
            throw exception.BadRequestError(e.code || 'BAD_REQUEST', e.message, null);
        }
    }

    public async update(data: {
        route: 'string',
        method: 'get' | 'post' | 'put' | 'delete' | 'patch',
        info: any,
        id: string
    }) {
        try {
            data.info = JSON.stringify(data.info);
            if ((await db.query(`
                select count(1)
                from \`${this.appName}\`.t_graph_api
                where id = ?
            `, [data.id]))[0]['count(1)'] === 0) {
                throw exception.BadRequestError('NOT_EXISTS', "THIS API NOT EXISTS.", null);
            }
            await db.query(`update \`${this.appName}\`.t_graph_api
                            set ?
                            where id = ?`, [data, data.id])
            return {
                result: true
            }
        } catch (e: any) {
            throw exception.BadRequestError(e.code || 'BAD_REQUEST', e.message, null);
        }
    }
}