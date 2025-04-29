import db from '../../../modules/database.js';
import tool from '../../../modules/tool.js';
import { User } from '../user.js';

export class MigratePublicUserConfig {
  app_name: string;

  constructor(app_name: string) {
    this.app_name = app_name;
  }

  async setLogisticsGroup() {
    const app_name = this.app_name;
    if (app_name !== 't_1725992531001') {
      return;
    }

    function compareArray(arr1: string[], arr2: string[]) {
      const slice1 = arr1.slice().sort();
      const slice2 = arr2.slice().sort();
      if (slice1.length !== slice2.length) return false;

      for (let i = 0; i < slice1.length; i++) {
        if (slice1[i] !== slice2[i]) return false;
      }

      return true;
    }

    const publicConfigResult = await db.query(
      `SELECT * FROM \`${app_name}\`.t_user_public_config WHERE \`key\` = 'logistics_group'
      `,
      []
    );

    if (publicConfigResult.length > 0) {
      return;
    }

    const getData = await db.query(
      `
        SELECT GROUP_CONCAT(DISTINCT JSON_UNQUOTE(JSON_EXTRACT(content, '$.designated_logistics.list')) SEPARATOR ',') 
          AS unique_tags
        FROM \`${app_name}\`.t_manager_post
        WHERE JSON_UNQUOTE(JSON_EXTRACT(content, '$.designated_logistics')) IS NOT NULL;
      `,
      []
    );

    if (getData.length === 0) {
      return;
    }

    const unique_tags_string = getData[0].unique_tags ?? '';
    const unique_tags_json = JSON.parse(`[${unique_tags_string}]`);
    const unique_tags_array: string[][] = Array.isArray(unique_tags_json) ? unique_tags_json : [];
    const groupArray: { key: string; name: string; list: string[] }[] = [];

    unique_tags_array.map(list => {
      if (list.length > 0) {
        const isUnique = groupArray.every(group => !compareArray(group.list, list));

        if (isUnique) {
          groupArray.push({
            key: tool.randomString(8),
            name: `物流組合${groupArray.length + 1}`,
            list: list,
          });
        }
      }
    });

    await new User(app_name).setConfig({
      key: 'logistics_group',
      user_id: 'manager',
      value: groupArray,
    });

    const getProductList = await db.query(
      `
        SELECT * FROM \`${app_name}\`.t_manager_post
        WHERE JSON_UNQUOTE(JSON_EXTRACT(content, '$.designated_logistics')) IS NOT NULL;
      `,
      []
    );

    for (const product of getProductList) {
      const data = product.content.designated_logistics;

      if (!data.group && data.type === 'designated') {
        const findGroup = groupArray.find(group => compareArray(group.list, data.list));

        if (findGroup) {
          data.group = [findGroup.key];

          const updateResult = await db.query(
            `UPDATE \`${app_name}\`.t_manager_post SET ? WHERE id = ?
            `,
            [{ content: JSON.stringify(product.content) }, product.id]
          );

          if (updateResult.affectedRows === 0) {
            console.error(`Product with ID ${product.id} not found.`);
          }
        }
      }
    }
  }
}
