export class ApplicationConfig {
    static initial(glitter) {
        if (glitter.getUrlParameter('select_map_finish') === 'true') {
            const redi = new URL(location.href);
            redi.searchParams.delete('select_map_finish');
            glitter.runJsInterFace("execute_main_js", { "js": `location.href="${redi.href}"` }, () => { });
            glitter.runJsInterFace("closeWebView", {}, () => { });
            return ``;
        }
    }
}
ApplicationConfig.is_application = false;
ApplicationConfig.device_type = 'web';
ApplicationConfig.bundle_id = '';
