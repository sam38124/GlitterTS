import db, {limit} from '../../modules/database';
import exception from "../../modules/exception";
import tool from "../../services/tool";
import UserUtil from "../../utils/UserUtil";

export class Post {
    public app: string

    public async postContent(content: any) {
        try {
            console.log(content)
            return  await db.query(`INSERT INTO \`${this.app}\`.\`t_post\` SET ?`, [
                content
            ])
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }
    public async getContent(content: any) {
        try {
            return  {
                data:await db.query(`select * from \`${this.app}\`.\`t_post\` order by id desc ${limit(content)}`, [
                    content
                ]),
                count:(await db.query(`select count(1) from \`${this.app}\`.\`t_post\``, [
                    content
                ]))[0]["count(1)"]
            }
        } catch (e) {
            throw exception.BadRequestError('BAD_REQUEST', 'PostContent Error:' + e, null);
        }
    }

    constructor(app: string) {
        this.app = app
    }
}

function generateUserID() {
    let userID = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
        userID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    userID = `${'123456789'.charAt(Math.floor(Math.random() * charactersLength))}${userID}`
    return userID;
}