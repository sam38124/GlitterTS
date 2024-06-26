import db from '../../modules/database.js';

export class UtDatabase {
    public app: string;
    public table: string;

    constructor(app: string, table: string) {
        this.app = app;
        this.table = table;
    }

    public async querySql(querySql: string[], query: { page: number; limit: number; id?: string; order_string?: string }, select?: string) {
        if (querySql.length === 0) {
            querySql.push(`1=1`);
        }
        let sql = `SELECT ${select || '*'}
                   FROM \`${this.app}\`.\`${this.table}\`
                   where ${querySql.map((dd)=>{
                       return `(${dd})`
                   }).join(' and ')}
                   ${query.order_string ? query.order_string : `order by id desc`}`;
        if (query.id) {
            const data = (
                await db.query(
                    `SELECT  ${select || '*'}
                                          FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
                    []
                )
            )[0];
            return {
                data: data,
                result: !!data,
            };
        } else {
            return {
                data: await db.query(
                    `SELECT  ${select || '*'}
                                       FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`,
                    []
                ),
                total: (
                    await db.query(
                        `SELECT count(1)
                                        FROM (${sql}) as subqyery`,
                        []
                    )
                )[0]['count(1)'],
            };
        }
    }
}
