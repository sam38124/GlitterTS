import { Plugin } from "../glitterBundle/plugins/plugin-creater.js";
Plugin.create(import.meta.url, (glitter, editMode) => {
    return {
        widget: {
            title: 'HTML元件',
            subContent: `<div class="flex-fill"></div>
<lottie-player src="lottie/animation_html_embeded.json"    class="mx-auto my-n4" speed="1"   style="max-width: 100%;width: 250px;height:300px;"  loop  autoplay></lottie-player>
<h3 class="mt-2 text-center" style="font-size:18px;">添加一個HTML標籤，自定義參數與內容。</h3>`,
            defaultData: {},
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return ``;
                    },
                    editor: (() => {
                        return ``;
                    })
                };
            },
        },
        container: {
            title: '容器',
            subContent: `<div class="flex-fill"></div>
<lottie-player src="lottie/animation_container.json"    class="mx-auto my-n4" speed="1"   style="max-width: 100%;width: 250px;height:300px;"  loop  autoplay></lottie-player>
<h3 class="mt-2 text-center" style="font-size:18px;">一個父容器可以包含多個HTML元件。</h3>`,
            defaultData: {
                setting: []
            },
            render: (gvc, widget, setting, hoverID) => {
                return {
                    view: () => {
                        return ``;
                    },
                    editor: (() => {
                        return ``;
                    })
                };
            }
        },
        component: {
            title: "嵌入模塊",
            subContent: `<div class="flex-fill"></div>
<lottie-player src="lottie/animation_embeded.json"    class="mx-auto my-n4" speed="1"   style="max-width: 100%;width: 250px;height:300px;"  loop  autoplay></lottie-player>
<h3 class="mt-2 text-center" style="font-size:18px;">將製作好的頁面，當作模塊進行嵌入。</h3>`,
            defaultData: {},
            render: Plugin.setComponent(import.meta.url, new URL('./official/component.js', import.meta.url)),
        },
        arrayItem: {
            title: '多項列表元件',
            subContent: `<div class="flex-fill"></div>
<img src="https://liondesign-prd.s3.amazonaws.com/file/guest/1695256644922-Screenshot 2023-09-21 at 8.37.16 AM.png"
class="my-1 mx-2" style="border-radius: 10px;">
<h3 class="mt-2 text-center" style="font-size:18px;">透過陣列資料產生多個同類型的元件。</h3>`,
            defaultData: {},
            render: Plugin.setComponent(import.meta.url, new URL('./official/array_item.js', import.meta.url)),
        },
        code: {
            title: "代碼區塊",
            subContent: "設定所需執行的代碼事件．",
            render: Plugin.setComponent(import.meta.url, new URL('./official/code.js', import.meta.url)),
        },
        form: {
            title: "FORM表單",
            subContent: "設定FORM表單與提交內容。",
            render: Plugin.setComponent(import.meta.url, new URL('./official/form.js', import.meta.url)),
        },
        glitter_article: {
            title: "內容顯示區塊",
            subContent: "內容顯示區塊。",
            render: Plugin.setComponent(import.meta.url, new URL('./official/article.js', import.meta.url)),
        },
        infinity_layout: {
            title: "無限列表",
            subContent: "無限列表顯示區塊。",
            render: Plugin.setComponent(import.meta.url, new URL('./official/infinity-layout.js', import.meta.url)),
        },
        view_module: {
            title: "頁面模塊",
            subContent: "將製作好的模塊進行嵌入。",
            render: Plugin.setViewComponent(new URL('./official/view-module.js', import.meta.url)),
        }
    };
});
