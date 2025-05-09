import exception from '../../modules/exception.js';
import db from '../../modules/database.js';
import Tool from '../../modules/tool.js';
import { IToken } from '../models/Auth.js';
import { User } from './user.js';

type StockListRecordData = {
  store_name: string;
  before_count: number;
  after_count: number;
};

export class DiffRecord {
  app: string;

  token?: IToken;

  constructor(app: string, token?: IToken) {
    this.app = app;
    this.token = token;
  }

  async createChangedLog(json: {
    entity_table: string;
    entity_id: number;
    type?: string;
    note: string;
    changed_json: any;
    changed_source: 'client' | 'management';
    changed_by: string;
  }) {
    try {
      const { entity_table, entity_id, type, note, changed_json, changed_source, changed_by } = json;
      await db.execute(
        `
          INSERT INTO \`${this.app}\`.t_changed_logs 
          (entity_table, entity_id, type, note, changed_json, changed_source, changed_by)
          values (?, ?, ?, ?, ?, ?, ?)
        `,
        [entity_table, entity_id, type || null, note, JSON.stringify(changed_json), changed_source, changed_by]
      );
    } catch (error) {
      console.error(error);
      throw exception.BadRequestError('BAD_REQUEST', 'createChangedLog Error:' + error, null);
    }
  }

  async getProdcutRecord(product_id: number) {
    try {
      const records = await db.query(
        `SELECT * FROM \`${this.app}\`.t_changed_logs WHERE entity_table = 't_manager_post' AND entity_id = ?;
        `,
        [product_id]
      );

      return records;
    } catch (error) {
      console.error(error);
      throw exception.BadRequestError('BAD_REQUEST', 'getProdcutRecord Error:' + error, null);
    }
  }

  async postProdcutRecord(updater_id: string, product_id: number, update_content: any) {
    try {
      const originProduct = (
        await db.query(
          `SELECT * FROM \`${this.app}\`.\`t_manager_post\` WHERE id = ?
          `,
          [product_id]
        )
      )[0];

      if (!originProduct) {
        throw exception.BadRequestError('BAD_REQUEST', 'PRODUCT IS NOT EXISTS:', {
          message: '商品不存在',
          code: '400',
        });
      }

      const userClass = new User(this.app);
      const diff = Tool.deepDiff(originProduct.content, update_content);

      if (diff.variants) {
        const variantsEntries = Object.entries(diff.variants) as [string, any];

        const store_config = await userClass.getConfigV2({
          key: 'store_manager',
          user_id: 'manager',
        });

        for (const [diffIndex, diffData] of variantsEntries) {
          const update_variant = update_content?.variants?.[Number(diffIndex)];

          if (update_variant) {
            const spec = update_variant.spec;

            // 改變規格追蹤庫存模式
            if (diffData.show_understocking) {
              await this.createChangedLog({
                entity_table: 't_manager_post',
                entity_id: product_id,
                note: '更新追蹤庫存模式',
                changed_json: {
                  spec,
                  ...diffData.show_understocking,
                },
                changed_source: 'management',
                changed_by: `${updater_id}`,
              });
            }

            // 改變規格庫存之紀錄
            if (diffData.stockList) {
              const changeDataArray = DiffRecord.changedStockListLog(diffData.stockList, store_config);
              for (const changeData of changeDataArray) {
                await this.createChangedLog({
                  entity_table: 't_manager_post',
                  entity_id: product_id,
                  note: '更新庫存',
                  changed_json: {
                    spec,
                    ...changeData,
                  },
                  changed_source: 'management',
                  changed_by: `${updater_id}`,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      throw exception.BadRequestError('BAD_REQUEST', 'postProdcutRecord Error:' + error, null);
    }
  }

  async postProdcutVariantRecord(updater_id: string, variant_id: number, update_variant: any) {
    try {
      const originVariant = (
        await db.query(
          `SELECT * FROM \`${this.app}\`.\`t_variants\` WHERE id = ?
          `,
          [variant_id]
        )
      )[0];

      if (!originVariant) {
        throw exception.BadRequestError('BAD_REQUEST', 'Variant IS NOT EXISTS:', {
          message: '商品規格不存在',
          code: '400',
        });
      }

      const userClass = new User(this.app);
      const diff = Tool.deepDiff(originVariant.content, update_variant);

      // 改變規格庫存之紀錄
      if (diff.stockList) {
        const store_config = await userClass.getConfigV2({
          key: 'store_manager',
          user_id: 'manager',
        });

        const changeData = DiffRecord.changedStockListLog(diff.stockList, store_config)[0];
        if (changeData) {
          this.createChangedLog({
            entity_table: 't_manager_post',
            entity_id: originVariant.product_id,
            note: '更新庫存',
            changed_json: {
              spec: update_variant.spec,
              ...changeData,
            },
            changed_source: 'management',
            changed_by: `${updater_id}`,
          });
        }
      }
    } catch (error) {
      console.error(error);
      throw exception.BadRequestError('BAD_REQUEST', 'postProdcutVariantRecord Error:' + error, null);
    }
  }

  static changedStockListLog(stock_list: any, store_config: any): StockListRecordData[] {
    const logDataArray: StockListRecordData[] = [];

    Object.entries(stock_list).map(([store_id, data]: [string, any]) => {
      const store = store_config.list.find((s: any) => s.id === store_id);

      if (data.count) {
        // 「追蹤庫存」不變，判斷是否改變庫存
        const { before: before_count = 0, after: after_count = 0 } = data?.count ?? {};

        if (Number(before_count) !== Number(after_count)) {
          logDataArray.push({
            store_name: store.name,
            before_count: Number(before_count),
            after_count: Number(after_count),
          });
        }
      }

      if (data.after?.count && data.after.count > 0) {
        // 從「不追蹤庫存」改成「追蹤庫存」
        logDataArray.push({
          store_name: store.name,
          before_count: 0,
          after_count: Number(data.after.count),
        });
      }
    });

    return logDataArray;
  }
}
