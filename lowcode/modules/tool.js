export class Tool {
    static truncateString(str, maxLength = 25) {
        let length = 0;
        let truncated = '';
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (/[\u4e00-\u9fa5]/.test(char)) {
                length += 1;
            }
            else {
                length += 0.5;
            }
            if (length <= maxLength) {
                truncated += char;
            }
            else {
                break;
            }
        }
        if (length > maxLength) {
            truncated += '...';
        }
        return truncated;
    }
    static twenLength(str) {
        let length = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (/[\u4e00-\u9fa5]/.test(char)) {
                length += 1;
            }
            else {
                length += 0.5;
            }
        }
        return length;
    }
    static randomString(max) {
        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}
Tool.convertDateTimeFormat = (dateTimeStr) => {
    const dateTime = new Date(dateTimeStr);
    const year = dateTime.getFullYear();
    const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
    const day = ('0' + dateTime.getDate()).slice(-2);
    const hours = ('0' + dateTime.getHours()).slice(-2);
    const minutes = ('0' + dateTime.getMinutes()).slice(-2);
    const seconds = ('0' + dateTime.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
