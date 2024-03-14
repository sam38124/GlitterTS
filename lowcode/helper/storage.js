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
        return localStorage.getItem('ViewType');
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
        return (localStorage.getItem('select_function') || 'page-editor');
    },
    set select_function(value) {
        window.glitter.setUrlParameter('router', ``);
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
    }
};
