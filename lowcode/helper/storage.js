export const Storage = {
    get editor_mode() {
        return localStorage.getItem('editor_mode');
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
};
