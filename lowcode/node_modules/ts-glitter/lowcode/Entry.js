'use strict';
import { ApiUser } from "./api/user.js";
import { Plugin } from './glitterBundle/plugins/plugin-creater.js';
import { config } from "./config.js";
import { ApiPageConfig } from "./api/pageConfig.js";
export class Entry {
    static onCreate(glitter) {
        window.saasConfig = {
            config: window.config = config,
            api: ApiPageConfig
        };
        ApiPageConfig.getPlugin(config.appName).then((data) => {
            var _a;
            const plugin = Plugin;
            try {
                eval(data.response.data.initialCode);
            }
            catch (e) {
                console.log(e);
            }
            if (glitter.getUrlParameter("type") === 'editor') {
                toBackendEditor(glitter);
            }
            else if (glitter.getUrlParameter("type") === 'htmlEditor') {
                glitter.addStyleLink('glitterBundle/bootstrap.css');
                glitter.htmlGenerate.setHome({
                    page_config: (_a = window.parent.page_config) !== null && _a !== void 0 ? _a : {},
                    config: window.parent.editerData.setting,
                    editMode: window.parent.editerData,
                    data: {},
                    tag: 'htmlEditor'
                });
            }
            else {
                async function render() {
                    let data = await ApiPageConfig.getPage(config.appName, glitter.getUrlParameter('page'));
                    if (data.response.result.length === 0) {
                        const url = new URL("./", location.href);
                        url.searchParams.set('page', 'home');
                        location.href = url.href;
                        return;
                    }
                    glitter.htmlGenerate.setHome({
                        page_config: data.response.result[0].page_config,
                        config: data.response.result[0].config,
                        data: {},
                        tag: glitter.getUrlParameter('page')
                    });
                }
                render().then();
            }
        });
    }
}
function toBackendEditor(glitter) {
    async function running() {
        const data = await ApiUser.login({
            "account": "rdtest",
            "pwd": "12345"
        });
        config.token = data.response.userData.token;
        glitter.addStyleLink([
            'assets/vendor/boxicons/css/boxicons.min.css',
            'assets/css/theme.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/androidstudio.min.css',
            'https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css',
        ]);
        await new Promise((resolve, reject) => {
            glitter.addMtScript([
                'assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
                'assets/vendor/smooth-scroll/dist/smooth-scroll.polyfills.min.js',
                'assets/vendor/swiper/swiper-bundle.min.js',
                'assets/js/theme.min.js',
                'https://kit.fontawesome.com/02e2dc09e3.js',
                'https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js',
            ], () => {
                resolve(true);
            }, () => {
                resolve(true);
            });
        });
        return;
    }
    window.mode = 'dark';
    window.root = document.getElementsByTagName('html')[0];
    window.root.classList.add('dark-mode');
    running().then(r => {
        glitter.setHome('jspage/main.js', glitter.getUrlParameter('page'), {
            appName: config.appName
        }, {
            backGroundColor: `transparent;`
        });
    });
}
