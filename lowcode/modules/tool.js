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
    static randomString(max) {
        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}
Tool.isURL = (str_url) => {
    try {
        return Boolean(new URL(str_url));
    }
    catch (e) {
        return false;
    }
};
