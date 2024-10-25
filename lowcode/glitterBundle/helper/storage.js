import { EditorConfig } from "../../editor-config.js";
export const Storage = {
    get editor_mode() {
        return 'dev';
    },
    set editor_mode(value) {
        localStorage.setItem('editor_mode', value);
    },
    get select_page_type() {
        return localStorage.getItem('select_page_type') || 'page';
    },
    set select_page_type(value) {
        localStorage.setItem('select_page_type', value);
    },
    get lastSelect() {
        return localStorage.getItem('lastSelect');
    },
    set lastSelect(value) {
        localStorage.setItem('lastSelect', value);
    },
    get view_type() {
        let response = localStorage.getItem('ViewType');
        if (response === 'col3' && Storage.select_function === 'user-editor') {
            response = 'desktop';
        }
        return response;
    },
    set view_type(value) {
        localStorage.setItem('ViewType', value);
    },
    get select_add_btn() {
        return localStorage.getItem('select_add_btn') || 'official';
    },
    set select_add_btn(value) {
        localStorage.setItem('select_add_btn', value);
    },
    get select_function() {
        return EditorConfig.backend_page();
    },
    set select_function(value) {
        window.glitter.setUrlParameter('router', ``);
        window.glitter.setUrlParameter('function', ``);
        localStorage.setItem('select_function', value);
    },
    get page_set_select() {
        return (localStorage.getItem('page_set_select') || 'normal');
    },
    set page_set_select(value) {
        localStorage.setItem('page_set_select', value);
    },
    get develop_mode() {
        return (localStorage.getItem('develop_mode') || 'false');
    },
    set develop_mode(value) {
        localStorage.setItem('develop_mode', value);
    },
    get global_select() {
        return (localStorage.getItem('global_select') || 'resource');
    },
    set global_select(value) {
        localStorage.setItem('global_select', value);
    },
    get select_global_editor_tab() {
        return (localStorage.getItem('select_global_editor_tab') || 'view');
    },
    set select_global_editor_tab(value) {
        localStorage.setItem('select_global_editor_tab', value);
    },
    get code_set_select() {
        return (localStorage.getItem('code_set_select') || 'style');
    },
    set code_set_select(value) {
        localStorage.setItem('code_set_select', value);
    },
    get select_bg_btn() {
        return (localStorage.getItem('select_bg_btn') || 'official');
    },
    set select_bg_btn(value) {
        localStorage.setItem('select_bg_btn', value);
    },
    get select_item() {
        return (localStorage.getItem('select_item') || '0');
    },
    set select_item(value) {
        localStorage.setItem('select_item', value);
    },
    get page_setting_item() {
        return (localStorage.getItem('page_setting_item') || 'layout');
    },
    set page_setting_item(value) {
        localStorage.setItem('page_setting_item', value);
    },
    get page_setting_global() {
        return (localStorage.getItem('page_setting_global') || 'layout');
    },
    set page_setting_global(value) {
        (localStorage.setItem('page_setting_global', value));
    }
};
