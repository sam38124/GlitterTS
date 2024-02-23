import express from "express";
import exception from "../modules/exception.js";
import db from "../modules/database.js";
import {saasConfig} from "../config.js";
import moment from "moment";
import {IToken} from "../models/Auth.js";

export class GlobalEvent {
    public appName: string;
    public token: IToken

    constructor(appName: string, token: IToken) {
        this.appName = appName
        this.token = token
    }

    public async addEvent(data: {
        tag: string,
        name: string,
        json: any
    }) {
        try {
            if (!((await db.checkExists(`\`${this.appName}\`.t_global_event where tag=${db.escape(data.tag)}`)))) {
                await db.execute(`insert into \`${this.appName}\`.t_global_event (\`tag\`, \`name\`, \`json\`) value (?,?,?)`, [
                    data.tag,
                    data.name,
                    JSON.stringify(data.json)
                ]);
                return {
                    result: true
                }
            } else {
                throw exception.BadRequestError("ERROR", "ERROR.THIS TAG ALREADY USE.", null);
            }

        } catch (e) {
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
    public async putEvent(data: {
        tag: string,
        name: string,
        json: any
    }) {
        try {
            await db.execute(`replace into \`${this.appName}\`.t_global_event (\`tag\`, \`name\`, \`json\`) value (?,?,?)`, [
                data.tag,
                data.name,
                JSON.stringify(data.json)
            ]);
            return {
                result: true
            }
        } catch (e) {
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async deleteEvent(data: {
        tag: string
    }) {
        try {
            await db.execute(`delete from \`${this.appName}\`.t_global_event where tag=?`, [
                data.tag
            ]);
            return {
                result: true
            }
        } catch (e) {
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }

    public async getEvent(query: {
        tag?: string
    }) {
        try {
            if (query.tag) {
                return {
                    result: await db.execute(`select *
                                              from \`${this.appName}\`.t_global_event
                                              where \`tag\` = ${db.escape(query.tag)}
                    `, [])
                }
            } else {
                return {
                    result: await db.execute(`select \`tag\`, \`name\`, \`json\`->'$.group' AS \`group\`
                                              from \`${this.appName}\`.t_global_event`, [])
                }
            }

        } catch (e) {
            throw exception.BadRequestError("ERROR", "ERROR." + e, null);
        }
    }
}