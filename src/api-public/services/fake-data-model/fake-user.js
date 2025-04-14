"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeUser = void 0;
const faker_1 = require("@faker-js/faker");
const tool_1 = __importDefault(require("../../../modules/tool"));
class FakeUser {
    generateUser(num = 100) {
        const FakeDataGenerator = require('fake-data-generator-taiwan');
        const twGenerator = new FakeDataGenerator();
        const dataList = [];
        const idSet = new Set();
        const emailSet = new Set();
        for (let i = 0; i < num; i++) {
            let id = 0;
            do {
                id = Number(faker_1.faker.string.numeric({ length: 9, allowLeadingZeros: false }));
            } while (idSet.has(id));
            idSet.add(id);
            let email = '';
            do {
                email = faker_1.faker.internet.email({ lastName: tool_1.default.randomNumber(5) });
            } while (emailSet.has(email));
            emailSet.add(email);
            const password = faker_1.faker.internet.password();
            const name = twGenerator.Name.generate();
            const phone = twGenerator.Mobile.generate(0, 10);
            const address = twGenerator.Address.generate();
            const birthdate = faker_1.faker.date.birthdate().toISOString().slice(0, 10);
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
exports.FakeUser = FakeUser;
function getDateInRange(years = 0, months = 0, days = 0, isRandom = true, referenceDate = new Date()) {
    const startDate = new Date(referenceDate);
    startDate.setFullYear(startDate.getFullYear() + years);
    startDate.setMonth(startDate.getMonth() + months);
    startDate.setDate(startDate.getDate() + days);
    const earlierDate = startDate < referenceDate ? startDate : referenceDate;
    const laterDate = startDate < referenceDate ? referenceDate : startDate;
    let resultDate;
    if (isRandom) {
        resultDate = new Date(earlierDate.getTime() + Math.random() * (laterDate.getTime() - earlierDate.getTime()));
    }
    else {
        resultDate = startDate;
    }
    return formatDate(resultDate);
}
function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
//# sourceMappingURL=fake-user.js.map