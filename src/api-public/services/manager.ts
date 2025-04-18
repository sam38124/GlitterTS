import { IToken } from '../../models/Auth.js';
import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import { LanguageLocation } from '../../Language.js';

export class Manager {
  public token: IToken;

  public async setConfig(config: { appName: string; key: string; value: any }) {
    try {
      await db.execute(
        `replace
            into \`${config.appName}\`.public_config (\`key\`,\`value\`,updated_at)
            values (?,?,?)
            `,
        [config.key, config.value, new Date()]
      );
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('ERROR', 'setConfig ERROR: ' + e, null);
    }
  }

  public static async getConfig(config: { appName: string; key: string; language: LanguageLocation }) {
    try {
      return await this.checkData(
        await db.execute(
          `select *
            from \`${config.appName}\`.public_config
            where \`key\` = ${db.escape(config.key)}
            `,
          []
        ),
        config.language
      );
    } catch (e) {
      console.error(e);
      throw exception.BadRequestError('ERROR', 'getConfig ERROR: ' + e, null);
    }
  }

  public static async checkData(data: any[], language: LanguageLocation) {
    if (data[0]) {
      let data_ = data[0];
      switch (data_.key) {
        case 'collection':
          function loop(array: any[]) {
            array.map(dd => {
              if (dd.language_data && dd.language_data[language]) {
                dd.code = dd.language_data[language].seo.domain || dd.code;
                dd.seo_content = dd.language_data[language].seo.content || dd.seo_content;
                dd.seo_title = dd.language_data[language].seo.title || dd.seo_title;
                if (dd.array) {
                  loop(dd.array);
                }
              }
            });
          }
          loop(data_.value);
          break;
      }
    }
    return data;
  }

  constructor(token: IToken) {
    this.token = token;
  }
}
