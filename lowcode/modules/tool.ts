export class Tool {
    static truncateString(str: string, maxLength: number = 25) {
        let length = 0;
        let truncated = '';

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            // 中文字符
            if (/[\u4e00-\u9fa5]/.test(char)) {
                length += 1;
            } else {
                // 英文字母和數字
                length += 0.5;
            }

            if (length <= maxLength) {
                truncated += char;
            } else {
                break;
            }
        }

        if (length > maxLength) {
            truncated += '...';
        }

        return truncated;
    }

    static randomString(max: number) {
        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    static isURL = (str_url: string) => {
        try {
            return Boolean(new URL(str_url));
        } catch (e) {
            return false;
        }
    };
}
