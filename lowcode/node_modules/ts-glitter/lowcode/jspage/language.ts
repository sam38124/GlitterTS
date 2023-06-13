export class Lan{
    public static getLan=(id:number)=>{
        let language:{
            "id": number,
            "tw": string,
            "en": string
        }[]=[
            {
                "id": 1,
                "tw": "向上新增元件",
                "en": ""
            },
            {
                "id": 2,
                "tw": "向下新增元件",
                "en": ""
            },
            {
                "id": 3,
                "tw": "畫面編輯",
                "en": ""
            },
            {
                "id": 7,
                "tw": "頁面參數設定",
                "en": ""
            },
            {
                "id": 4,
                "tw": "設計模塊",
                "en": ""
            },
            {
                "id": 5,
                "tw": "程式插件",
                "en": ""
            },
            {
                "id": 6,
                "tw": "APP初始代碼",
                "en": ""
            }
        ]
        const item=language.find((dd)=>{return dd.id==id})
        return (item) ? item.tw:`X${id}X`
    }
}