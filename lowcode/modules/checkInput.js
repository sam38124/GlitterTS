export class CheckInput {
    static isEmpty(input) {
        return input === undefined || typeof input === 'undefined' || input === null || input.length === 0;
    }
    static isURL(input) {
        try {
            return Boolean(new URL(input));
        }
        catch (e) {
            return false;
        }
    }
    static isEmail(input) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(input);
    }
    static isTaiwanPhone(input) {
        const landlineRegex = /^0\d{1,2}-\d{6,8}(#\d{1,5})?$/;
        const mobileRegex = /^09\d{8}$/;
        return landlineRegex.test(input) || mobileRegex.test(input);
    }
    static isNumberString(input) {
        const num = parseFloat(input);
        return !isNaN(num);
    }
    static isEnglishNumberHyphen(input) {
        const regex = /^[a-zA-Z0-9-]+$/;
        return regex.test(input);
    }
    static isChineseEnglishNumberHyphen(input) {
        const regex = /^[\u4e00-\u9fa5a-zA-Z0-9-]+$/;
        return regex.test(input);
    }
    static isBirthString(input) {
        if (!input || input.length !== 8) {
            return false;
        }
        const year = parseInt(input.substring(0, 4), 10);
        const month = parseInt(input.substring(4, 6), 10);
        const day = parseInt(input.substring(6, 8), 10);
        if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) {
            return false;
        }
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
    }
}
