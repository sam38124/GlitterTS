export const seoManager = [
    {
        title: "網頁標題", key: "title", callback: (text) => {
            return `<title>${text}</title>`;
        },
        editor: (def) => {
            const glitter = window.glitter;
            return glitter.htmlGenerate.editeInput({
                gvc: def.gvc,
                title: "網頁標題",
                default: def.def,
                placeHolder: "請輸入網頁標題",
                callback: (text) => {
                    def.callback(text);
                }
            });
        }
    }
];
