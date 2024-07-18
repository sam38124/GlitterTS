export const Storage:{
    //編輯模式
    editor_mode:'user'|'dev',
    //選擇的頁面類型
    select_page_type:'page'|'article'|'module'|'blog' | 'backend',
    //上次選擇的區段
    lastSelect:string,
    //編輯器顯示範圍
    view_type:'mobile'|'desktop'|'col3'|'fullScreen',
    //上次選擇的頁面添加按鈕,
    select_add_btn:'me' | 'official' | "view" | 'code' | 'ai' | "template" | 'copy',
    //左側的選擇功能
    select_function:'page-editor' | 'backend-manger' | 'server-manager' | 'user-editor'
    //選擇的頁面編輯功能
    page_set_select:'normal' | 'seo' | 'module' | 'code' | 'form'
    //開發者模式
    develop_mode:'false' | 'true'
    //全域設定選項
    global_select:"domain" | 'plugin' | 'resource' | 'event' | 'style' | 'code'
    //選擇的模塊編輯選項
    select_global_editor_tab:'view'|'event',
    //選擇的編輯開發功能
    code_set_select:'style' | 'script' | 'code' | 'form',
    //後台點擊按鈕
    select_bg_btn:'official'|'custom',
    //後台點擊選項
    select_item:any,
    //頁面編輯選項
    page_setting_item:'layout' | 'color' | 'widget'
}={
    get editor_mode(){
        return 'dev' as any
    },
    set editor_mode(value){
        localStorage.setItem('editor_mode',value)
    },
    get select_page_type(){
        return (localStorage.getItem('select_page_type') as any) || 'page'
    },
    set select_page_type(value){
        localStorage.setItem('select_page_type',value)
    },
    get lastSelect(){
        return localStorage.getItem('lastSelect') as any
    },
    set lastSelect(value){
        localStorage.setItem('lastSelect',value)
    },
    get view_type(){
        let response=localStorage.getItem('ViewType') as any
        if(response==='col3' && Storage.select_function==='user-editor'){
            response='desktop'
        }
        return response;
    },
    set view_type(value){
        localStorage.setItem('ViewType',value)
    },
    get select_add_btn(){
        return (localStorage.getItem('select_add_btn') as any) || 'official'
    },
    set select_add_btn(value){
        localStorage.setItem('select_add_btn',value)
    },
    get select_function(){
        return (window as any).glitter.getUrlParameter('function')
        // if((window as any).glitter.getUrlParameter('function')){
        //
        // }else{
        //     return (localStorage.getItem('select_function') || 'page-editor') as any
        // }

    },
    set select_function(value){
        (window as any).glitter.setUrlParameter('router', ``);
        (window as any).glitter.setUrlParameter('function', ``);
        localStorage.setItem('select_function',value)
    },
    get page_set_select(){
        return (localStorage.getItem('page_set_select') || 'normal') as any
    },
    set page_set_select(value){
        localStorage.setItem('page_set_select',value)
    },
    get develop_mode(){
        return (localStorage.getItem('develop_mode') || 'false') as any
    },
    set develop_mode(value){
        localStorage.setItem('develop_mode',value)
    },
    get global_select(){
        return (localStorage.getItem('global_select') || 'resource') as any
    },
    set global_select(value){
        localStorage.setItem('global_select',value)
    },
    get select_global_editor_tab(){
        return (localStorage.getItem('select_global_editor_tab') || 'view') as any
    },
    set select_global_editor_tab(value){
        localStorage.setItem('select_global_editor_tab',value)
    },
    get code_set_select(){
        return (localStorage.getItem('code_set_select') || 'style') as any
    },
    set code_set_select(value){
        localStorage.setItem('code_set_select',value)
    },
    get select_bg_btn(){
        return (localStorage.getItem('select_bg_btn') || 'official') as any
    },
    set select_bg_btn(value){
        localStorage.setItem('select_bg_btn',value)
    },
    get select_item(){

        return (localStorage.getItem('select_item') || '0') as any
    },
    set select_item(value){
        localStorage.setItem('select_item',value)
    },

    get page_setting_item(){
        return (localStorage.getItem('page_setting_item') || 'layout') as any
    },
    set page_setting_item(value){
        localStorage.setItem('page_setting_item',value)
    },
}

