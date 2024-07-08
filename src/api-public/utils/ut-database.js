var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from '../../modules/database.js';
export class UtDatabase {
    constructor(app, table) {
        this.app = app;
        this.table = table;
    }
    querySql(querySql, query, select) {
        return __awaiter(this, void 0, void 0, function* () {
            if (querySql.length === 0) {
                querySql.push(`1=1`);
            }
            let sql = `SELECT ${select || '*'}
                   FROM \`${this.app}\`.\`${this.table}\`
                   where ${querySql.map((dd) => {
                return `(${dd})`;
            }).join(' and ')}
                   ${query.order_string ? query.order_string : `order by id desc`}`;
            if (query.id) {
                const data = (yield db.query(`SELECT  ${select || '*'}
                                          FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []))[0];
                return {
                    data: data,
                    result: !!data,
                };
            }
            else {
                return {
                    data: yield db.query(`SELECT  ${select || '*'}
                                       FROM (${sql}) as subqyery limit ${query.page * query.limit}, ${query.limit}`, []),
                    total: (yield db.query(`SELECT count(1)
                                        FROM (${sql}) as subqyery`, []))[0]['count(1)'],
                };
            }
        });
    }
}
