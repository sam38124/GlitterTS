"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeProduct = void 0;
exports.fakeProduct = ((function () {
    var data = [];
    for (var a = 0; a < 20; a++) {
        data.push({
            "sku": [
                "CCT-001",
                "EED-002",
                "CDJ-003",
                "BMS-004",
                "SSH-005",
                "SFL-006",
                "VFD-007",
                "WWS-008",
                "MLS-009",
                "COS-010",
                "HSJ-011",
                "FLJ-012",
                "PFS-013",
                "AZJ-014",
                "ELB-015",
                "LPV-016",
                "LCC-017",
                "KBN-018",
                "MRS-019",
                "RPS-020"
            ][a],
            "spec": "",
            "count": Math.floor(Math.random() * 10) + 1,
            "preview_image": [
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/sssa.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/2121.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/212132.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/2ewe.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/sdnj.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/sssa.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/2121.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/212132.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/2ewe.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/sdnj.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/sssa.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/2121.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/212132.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/2ewe.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/sdnj.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/sssa.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/2121.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/212132.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/2ewe.webp",
                "https://d3jnmi1tfjgtti.cloudfront.net/file/122538856/sdnj.webp"
            ][a],
            "title": [
                "休閒舒適純棉T恤",
                "優雅絲質晚禮服",
                "經典牛仔外套",
                "波西米亞風長裙",
                "都市街頭風連帽衫",
                "修身運動緊身褲",
                "復古碎花夏日連衣裙",
                "柔軟羊毛冬季圍巾",
                "極簡亞麻襯衫",
                "舒適寬鬆毛衣",
                "高腰緊身牛仔褲",
                "時尚人造皮革夾克",
                "格紋法蘭絨襯衫",
                "運動休閒拉鍊外套",
                "優雅蕾絲襯衫",
                "輕量羽絨背心",
                "奢華羊絨開衫",
                "休閒針織毛線帽",
                "運動網眼跑步短褲",
                "復古條紋Polo衫"
            ][a],
            "rebate": 0,
            "collection": [
                [
                    "上衣",
                    "外套",
                    "連衣裙",
                    "襯衫",
                    "T恤",
                    "褲子",
                    "牛仔褲",
                    "短褲",
                    "裙子",
                    "毛衣",
                    "背心",
                    "運動服",
                    "休閒服",
                    "正裝",
                    "配飾",
                    "鞋類",
                    "帽子",
                    "圍巾",
                    "睡衣",
                    "泳裝"
                ][a]
            ],
            "sale_price": Math.floor(Math.random() * (1000 - 200 + 1)) + 200,
            "discount_price": 0
        });
    }
    return data;
})()).map(function (dd) {
    dd.shipment_obj = {
        "type": "volume",
        "value": 1000
    };
    return dd;
});
