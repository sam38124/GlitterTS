export const Storage:{
    //編輯模式
    editor_mode:'user'|'dev',
    //選擇的頁面類型
    select_page_type:'page'|'article'|'module'|'blog'
}={
    get editor_mode(){
        return localStorage.getItem('editor_mode') as any
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
}