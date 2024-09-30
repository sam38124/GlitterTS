export class AppInitial{
    public static main(appName:string){
        return [ {
            sql:`
                                insert into \`${appName}\`.t_user_public_config
                                SET ?;
                            `,
            obj:{
                key:'robot_auto_reply',
                user_id:'manager',
                updated_at:new Date(),
                value:JSON.stringify({
                    "question": [
                        {
                            "ask": "什麼是快時尚？",
                            "response": " 快時尚（Fast Fashion）是指服裝品牌以快速生產和推出新款服飾的模式，通常模仿最新的設計潮流，並以相對低廉的價格售賣。品牌如Zara、H&M便是快時尚的代表。這類服飾的生產周期較短，通常在幾週內推出新產品，以滿足消費者的即時需求。"
                        },
                        {
                            "ask": "服飾產業中「可持續時尚」的概念是什麼？",
                            "response": "可持續時尚是指在服裝的設計、生產和消費過程中考慮到環境和社會影響。這包括使用環保材料、減少碳足跡、促進公平貿易及改善工人權益。可持續時尚的品牌通常專注於減少浪費、延長產品的使用壽命，並提倡循環經濟。"
                        },
                        {
                            "ask": "電子商務如何影響服飾產業的運營模式？",
                            "response": "電子商務徹底改變了服飾產業的運營模式，讓品牌能夠直接觸達全球消費者。它促進了無實體店鋪的服飾品牌發展，並推動了個性化購物體驗和數據驅動的市場行銷策略。此外，電子商務平台為消費者提供了更便捷的比較與購買體驗，改變了傳統的零售結構。"
                        },
                        {
                            "ask": "服飾產業中的供應鏈管理有何挑戰？",
                            "response": "服飾產業的供應鏈管理涉及設計、生產、運輸和分銷的各個階段。其主要挑戰包括生產速度要求高、成本控制、品質維持以及應對季節性需求變化。此外，越來越多的品牌需要考慮可持續供應鏈管理，確保供應商遵守環保標準和工人權益保護。"
                        },
                        {
                            "ask": "服飾產業如何應用人工智能技術？",
                            "response": "人工智能在服飾產業的應用主要表現在以下幾個方面：預測時尚趨勢、個性化推薦、智能客服和虛擬試穿技術。AI能夠分析大量消費者數據來預測流行趨勢，並根據個人喜好提供推薦，從而提升購物體驗。同時，虛擬試穿和3D建模技術讓消費者能在線上試穿服裝，促進購買決策。\n\n"
                        }
                    ]
                })
            }
        },{
            sql:`
                                insert into \`${appName}\`.t_user_public_config
                                SET ?;
                            `,
            obj:{
                key:'message_setting',
                user_id:'manager',
                updated_at:new Date(),
                value:JSON.stringify({
                    "head": "https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/DALL·E 2024-09-29 01.55.29 - A cozy living room furniture setup featuring a modern minimalist sofa with light grey fabric, a wooden coffee table with a natural finish, and a soft .webp",
                    "name": "示範商店客服",
                    "color": "#FE5541",
                    "title": "歡迎光臨服飾選品",
                    "toggle": true,
                    "content": "👋 歡迎來到 『示範商店』\n\n您好，有什麼我們可以幫您服務的呢？ 😊\n\n想了解訂單進度嗎？您可以隨時登入帳號，查看「訂單配送進度」以掌握最新狀況。\n\n感謝您對 『示範商店』的支持與喜愛，期待為您帶來更多時尚與驚喜！\n\n客服營業時間：\n週一至週五 10:00 - 18:00（國定假日除外）\n\n祝您購物愉快，隨時聯繫我們！"
                })
            }
        }]
    }
}