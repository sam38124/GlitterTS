import { faker } from '@faker-js/faker';
import tool from '../../../modules/tool';

export type TypeFakeUser = {
  userID: number;
  account: string;
  pwd: string;
  userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    birth: string;
  };
  created_time: string;
  online_time: string;
};

export class FakeUser {
  generateUser(num = 100): TypeFakeUser[] {
    const FakeDataGenerator = require('fake-data-generator-taiwan');
    const twGenerator = new FakeDataGenerator();
    const dataList = [];
    const idSet = new Set();
    const emailSet = new Set();

    for (let i = 0; i < num; i++) {
      let id = 0;
      do {
        id = Number(faker.string.numeric({ length: 9, allowLeadingZeros: false }));
      } while (idSet.has(id));
      idSet.add(id);

      let email = '';
      do {
        email = faker.internet.email({ lastName: tool.randomNumber(5) });
      } while (emailSet.has(email));
      emailSet.add(email);

      const password = faker.internet.password();
      const name = twGenerator.Name.generate();
      const phone = twGenerator.Mobile.generate(0, 10);
      const address = twGenerator.Address.generate();
      const birthdate = faker.date.birthdate().toISOString().slice(0, 10);

      const dateTimeArray = [
        getDateInRange(-2, 0, 0, true),
        getDateInRange(0, -6, 0, true),
        getDateInRange(0, 0, -30, true),
      ];
      const randomIndex = Math.floor(Math.random() * dateTimeArray.length);
      const dateTime = dateTimeArray[randomIndex];

      const record = {
        userID: id,
        account: email,
        pwd: password,
        userData: {
          name: name,
          email: email,
          phone: phone,
          address: address,
          birth: birthdate,
        },
        created_time: dateTime,
        online_time: dateTime,
      };

      dataList.push(record);
    }

    return dataList;
  }
}

/**
 * 取得指定時間範圍內的日期，可隨機或準確指定
 * @param years 年數 (負數表示過去幾年)
 * @param months 月數 (負數表示過去幾個月)
 * @param days 天數 (負數表示過去幾天)
 * @param isRandom 是否產生隨機時間，false 則返回準確的起始時間
 * @param referenceDate 參考日期，預設為現在
 * @returns 格式化後的日期字串
 */
function getDateInRange(years = 0, months = 0, days = 0, isRandom = true, referenceDate: Date = new Date()): string {
  // 複製參考日期以避免修改原始日期
  const startDate = new Date(referenceDate);

  // 設定開始日期
  startDate.setFullYear(startDate.getFullYear() + years);
  startDate.setMonth(startDate.getMonth() + months);
  startDate.setDate(startDate.getDate() + days);

  // 確保開始日期和參考日期的順序正確
  const earlierDate = startDate < referenceDate ? startDate : referenceDate;
  const laterDate = startDate < referenceDate ? referenceDate : startDate;

  // 依據 isRandom 決定回傳隨機日期或準確日期
  let resultDate: Date;
  if (isRandom) {
    // 生成隨機時間
    resultDate = new Date(earlierDate.getTime() + Math.random() * (laterDate.getTime() - earlierDate.getTime()));
  } else {
    // 返回準確的時間 (起始點)
    resultDate = startDate;
  }

  return formatDate(resultDate);
}

/**
 * 格式化日期為 YYYY-MM-DD HH:MM:SS 格式
 * @param date 日期物件
 * @returns 格式化後的日期字串
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
