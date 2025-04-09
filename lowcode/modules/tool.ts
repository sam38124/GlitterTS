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

  static twenLength(str: string) {
    let length = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      // 中文字符
      if (/[\u4e00-\u9fa5]/.test(char)) {
        length += 1;
      } else {
        // 英文字母和數字
        length += 0.5;
      }
    }

    return length;
  }

  static randomString(max: number) {
    let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let text = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < max; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  static formatDateTime(dateTimeStr?: string, includeSeconds: boolean = false): string {
    const date = dateTimeStr ? new Date(dateTimeStr) : new Date();

    if (isNaN(date.getTime())) return ''; // 避免無效日期

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return includeSeconds
      ? `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      : `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  static ObjCompare(obj1: { [k: string]: any }, obj2: { [k: string]: any }) {
    const Obj1_keys = Object.keys(obj1);
    const Obj2_keys = Object.keys(obj2);
    if (Obj1_keys.length !== Obj2_keys.length) {
      return false;
    }
    for (let k of Obj1_keys) {
      if (obj1[k] !== obj2[k]) {
        return false;
      }
    }
    return true;
  }

  static floatAdd(a: number, b: number) {
    // 檢查 a 和 b 是否為數字
    if (typeof a !== 'number' || typeof b !== 'number') {
      return NaN; // 如果其中一個不是數字，則返回 NaN（Not a Number）
    }

    // 檢查 a 和 b 是否為浮點數
    if (a % 1 !== 0 || b % 1 !== 0) {
      // 如果是浮點數，則進行精確計算
      const multiplier = Math.pow(10, 10); // 假設需要精確到小數點後 10 位
      return (Math.round(a * multiplier) + Math.round(b * multiplier)) / multiplier;
    } else {
      // 如果是整數，則直接相加
      return a + b;
    }
  }
}
