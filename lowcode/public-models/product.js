export class ProductInitial {
    static initial(postMD) {
        var _a;
        postMD.product_tag = (_a = postMD.product_tag) !== null && _a !== void 0 ? _a : {};
        postMD.product_tag = {
            language: Object.assign({ 'en-US': [], 'zh-CN': [], 'zh-TW': [] }, postMD.product_tag.language),
        };
        postMD.unit = Object.assign({ 'en-US': '', 'zh-CN': '', 'zh-TW': '' }, postMD.unit);
    }
}
