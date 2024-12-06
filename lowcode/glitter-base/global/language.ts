export class Language {
    public static getLanguage() {
        let last_select = localStorage.getItem('select_language') || navigator.language;
        if (!(window as any).store_info.language_setting.support.includes(last_select)) {
            last_select = (window as any).store_info.language_setting.def
        }
        return last_select
    }

    public static getLanguageLinkPrefix(pre:boolean=true) {
        const lan=(()=>{
            let last_select = localStorage.getItem('select_language') || navigator.language;
            if (!(window as any).store_info.language_setting.support.includes(last_select)) {
                last_select = (window as any).store_info.language_setting.def
            }
            if (last_select !== ((window as any).store_info.language_setting.def)) {
                switch (last_select){
                    case 'en-US':
                        return `en`
                    case 'zh-CN':
                        return `cn`
                    case 'zh-TW':
                        return `tw`
                }
            }
            return ''
        })();
        if(lan){
            if(pre){
                return `${lan}/`
            }else{
                return `/${lan}`
            }
        }else{
            return  ``
        }


    }

    public static getLanguageText(local:boolean=false) {

        const sup = [
            {
                key: 'en-US',
                value: local ? 'English':'英'
            },
            {
                key: 'zh-CN',
                value: local ? '简体中文':'简'
            },
            {
                key: 'zh-TW',
                value: local ? '繁體中文':'繁'
            }
        ];

        return sup.find((dd) => {
            return dd.key === Language.getLanguage()
        })?.value
    }

    public static setLanguage(value: any) {
        localStorage.setItem('select_language', value)
    }

    public static text(key:string){
        return (([
            {key:'switch_language',tw:'切換語言',cn:'切换语言',en:`Switch language`}
        ]).find((dd)=>{
            return dd.key===key
        }) as any)[(()=>{
            switch (Language.getLanguage()){
                case 'zh-TW':
                    return 'tw';
                case 'zh-CN':
                    return 'cn';
                case 'en-US':
                    return 'en';
                default:
                    return `en`
            }
        })()]
    }
}