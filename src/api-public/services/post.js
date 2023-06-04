"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const database_1 = __importStar(require("../../modules/database"));
const exception_1 = __importDefault(require("../../modules/exception"));
class Post {
    constructor(app) {
        this.app = app;
    }
    async postContent(content) {
        try {
            console.log(content);
            return await database_1.default.query(`INSERT INTO \`${this.app}\`.\`t_post\` SET ?`, [
                content
            ]);
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }
    async getContent(content) {
        try {
            return {
                data: await database_1.default.query(`select * from \`${this.app}\`.\`t_post\` order by id desc ${(0, database_1.limit)(content)}`, [
                    content
                ]),
                count: (await database_1.default.query(`select count(1) from \`${this.app}\`.\`t_post\``, [
                    content
                ]))[0]["count(1)"]
            };
        }
        catch (e) {
            throw exception_1.default.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }
}
exports.Post = Post;
function generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`;
    return userID;
}
