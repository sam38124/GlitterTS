"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductInitial = void 0;
var ProductInitial = /** @class */ (function () {
    function ProductInitial() {
    }
    ProductInitial.initial = function (content) {
        var _a;
        //補上language-data
        content.language_data = (_a = content.language_data) !== null && _a !== void 0 ? _a : {};
        ['en-US', 'zh-CN', 'zh-TW'].map(function (dd) {
            if (!content.language_data[dd]) {
                content.language_data[dd] = {
                    "seo": content.seo,
                    "title": content.title,
                    "content": content.content,
                    "sub_title": content.sub_title,
                    "content_json": content.content_json,
                    "content_array": content.content_array,
                    "preview_image": content.preview_image
                };
            }
        });
    };
    return ProductInitial;
}());
exports.ProductInitial = ProductInitial;
