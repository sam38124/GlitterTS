import { GVC } from '../glitterBundle/GVController.js';
type TableV3 = {
    loading: boolean;
    page: number;
    pageSize: number;
    tableData: {
        key: string;
        title?: string;
        value: string;
        stopClick?: boolean;
    }[][];
    originalData: any;
    callback: () => void;
    checkedArray: any[];
};
type TableV3Filter = {
    name: string;
    option?: boolean;
    event: (data: any) => void;
};
export interface OptionsItem {
    key: string;
    value: string;
    note?: string;
    image?: string;
}
export interface SelEventItem {
    name: string;
    event: string;
}
export declare class BgWidget {
    static title(title: string, style?: string): string;
    static grayNote(text: string, style?: string): string;
    static blueNote(text: string, event?: string, style?: string): string;
    static greenNote(text: string, event?: string, style?: string): string;
    static dangerNote(text: string, event?: string, style?: string): string;
    static taiwanPhoneAlert(str?: string): string;
    static customButton(setValue: {
        button: {
            color: 'black' | 'gray' | 'snow';
            size: 'sm' | 'md' | 'lg';
            class?: string;
            style?: string;
        };
        text: {
            name: string;
            class?: string;
            style?: string;
        };
        event: string;
        icon?: {
            name: string;
        };
    }): string;
    static save(event: string, text?: string, customClass?: string): string;
    static ai_generator(gvc: GVC, format: any, callback: (data: any) => void): string;
    static cancel(event: string, text?: string): string;
    static danger(event: string, text?: string): string;
    static disableButton(text: string, obj?: {
        icon?: string;
        textStyle?: string;
    }): string;
    static grayButton(text: string, event: string, obj?: {
        icon?: string;
        textStyle?: string;
    }): string;
    static darkButton(text: string, event: string, obj?: {
        icon?: string;
        textStyle?: string;
        class?: string;
        style?: string;
    }): string;
    static redButton(text: string, event: string, obj?: {
        icon?: string;
        textStyle?: string;
    }): string;
    static plusButton(obj: {
        title: string;
        event: string;
    }): string;
    static dropPlusButton(obj: {
        gvc: GVC;
        title: string;
        options: {
            title: string;
            icon: string;
            callback: () => void;
        }[];
    }): string;
    static questionButton(event: string, obj?: {
        size?: number;
    }): string;
    static generateTooltipButton(gvc: GVC, innerHTML: string, obj?: {
        size?: number;
    }): string;
    static iconButton(obj: {
        icon: 'info' | 'question';
        event: string;
        size?: number;
    }): string;
    static switchButton(gvc: GVC, def: boolean, callback: (value: boolean) => void): string;
    static switchTextButton(gvc: GVC, def: boolean, text: {
        left?: string;
        right?: string;
    }, callback: (value: boolean) => void): string;
    static goBack(event: string): string;
    static aiChatButton(obj: {
        gvc: GVC;
        select: 'writer' | 'order_analysis' | 'operation_guide';
        title?: string;
        click?: () => void;
    }): string;
    static primaryInsignia(text: string): string;
    static successInsignia(text: string): string;
    static dangerInsignia(text: string): string;
    static infoInsignia(text: string): string;
    static warningInsignia(text: string): string;
    static normalInsignia(text: string): string;
    static notifyInsignia(text: string): string;
    static secondaryInsignia(text: string): string;
    static leftLineBar(): string;
    static languageInsignia(language: 'en-US' | 'zh-CN' | 'zh-TW', style?: string): string;
    static horizontalLine(css?: {
        color?: string;
        size?: number;
        margin?: number | string;
    }): string;
    static isValidEmail(email: string): boolean;
    static isValidNumbers(str: string): boolean;
    static selectLanguage(obj: {
        selectable?: boolean;
        callback?: (tag: string) => void;
    }): void;
    static editeInput(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
        divStyle?: string;
        titleStyle?: string;
        style?: string;
        type?: string;
        readonly?: boolean;
        pattern?: string;
        startText?: string;
        endText?: string;
        oninput?: (text: string) => void;
        global_language?: boolean;
    }): string;
    static textArea(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
        style?: string;
        type?: string;
        readonly?: boolean;
        pattern?: string;
    }): string;
    static searchPlace(event: string, vale: string, placeholder: string, margin?: string, padding?: string): string;
    static linkList(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (path: string) => void;
        style?: string;
        readonly?: boolean;
        pattern?: string;
        filter?: {
            page?: string[];
        };
    }): string;
    static select(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string;
        options: OptionsItem[];
        style?: string;
        readonly?: boolean;
        place_holder?: string;
    }): string;
    static dotlottieJS: string;
    static maintenance(): string;
    static noPermission(): string;
    static spinner(obj?: {
        container?: {
            class?: string;
            style?: string;
        };
        circle?: {
            visible?: boolean;
            width?: number;
            borderSize?: number;
        };
        text?: {
            value?: string;
            visible?: boolean;
            fontSize?: number;
        };
    }): string;
    static table(obj: {
        gvc: GVC;
        getData: (vm: {
            page: number;
            loading: boolean;
            callback: () => void;
            pageSize: number;
            data: any;
        }) => void;
        rowClick?: (data: any, index: number) => void;
        filter?: string;
        style?: string[];
        table_style?: string;
    }): string;
    static tableV2(obj: {
        gvc: GVC;
        getData: (vm: {
            page: number;
            loading: boolean;
            callback: () => void;
            pageSize: number;
            data: any;
        }) => void;
        rowClick?: (data: any, index: number) => void;
        filter?: string;
        style?: string[];
        table_style?: string;
        hiddenPageSplit?: boolean;
    }): string;
    static tableV3(obj: {
        gvc: GVC;
        filter: TableV3Filter[];
        getData: (vm: TableV3) => void;
        rowClick: (data: any, index: number) => void;
        hiddenPageSplit?: boolean;
        defPage?: number;
        itemSelect?: () => void;
        tabClick?: (vm: TableV3) => void;
    }): string;
    static getContainerWidth: (obj?: {
        rate?: {
            web?: number;
            pad?: number;
            phone?: number;
        };
    }) => number;
    static container(htmlString: string, obj?: {
        style?: string;
    }): string;
    static container1x2(cont1: {
        html: string;
        ratio: number;
    }, cont2: {
        html: string;
        ratio: number;
    }): string;
    static duringInputContainer(gvc: GVC, obj: {
        centerText: string;
        list: {
            key: string;
            type: string;
            placeHolder: string;
        }[];
    }, def: string[], callback: (value: string[]) => void): string;
    static radioInputContainer(gvc: GVC, data: {
        key: string;
        name: string;
        type: string;
        placeHolder: string;
        unit?: string;
    }[], def: {
        key: string;
        value: string;
    }, callback: (value: {
        key: string;
        value: string;
    }) => void): string;
    static multiCheckboxContainer(gvc: GVC, data: {
        key: string;
        name: string;
        innerHtml?: string;
        hiddenLeftLine?: boolean;
        customerClass?: string;
    }[], def: string[], callback: (value: string[]) => void, obj?: {
        readonly?: boolean;
        single?: boolean;
        zeroOption?: boolean;
    }): string;
    static tripletCheckboxContainer(gvc: GVC, name: string, def: -1 | 0 | 1, callback: (value: number) => void, obj?: {
        readonly?: boolean;
    }): string;
    static inlineCheckBox(obj: {
        title: string;
        gvc: any;
        def: string | string[];
        array: string[] | {
            title: string;
            value: string;
            innerHtml?: string;
        }[];
        callback: (text: string | string[]) => void;
        type?: 'single' | 'multiple';
    }): string;
    static mbContainer(margin_bottom_px: number): string;
    static minHeightContainer(min_height: number): string;
    static card(htmlString: string, classStyle?: string): string;
    static mainCard(htmlString: string, customerClass?: string): string;
    static summaryCard(htmlString: string): string;
    static tab(data: {
        title: string;
        key: string;
    }[], gvc: GVC, select: string, callback: (key: string) => void, style?: string): string;
    static alertInfo(title: string, messageList?: string[], css?: {
        class: string;
        style: string;
    }): string;
    static selNavbar(data: {
        checkbox?: string;
        count: number;
        buttonList: string[];
        cancelCallback?: {
            gvc: GVC;
            event: () => void;
        };
    }): string;
    static selEventButton(text: string, event: string): string;
    static selEventDropmenu(obj: {
        gvc: GVC;
        options: SelEventItem[];
        text: string;
    }): string;
    static summaryHTML(stringArray: string[][]): string;
    static openBoxContainer(obj: {
        gvc: GVC;
        tag: string;
        title: string;
        insideHTML: string;
        height?: number;
        autoClose?: boolean;
        guideClass?: string;
        openOnInit?: boolean;
    }): string;
    static richTextView(text: string): string;
    static selectFilter(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string;
        options: OptionsItem[];
        style?: string;
    }): string;
    static searchFilter(event: string, value: string, placeholder: string, margin?: string): string;
    static columnFilter(obj: {
        gvc: GVC;
        callback: (value: any) => void;
    }): string;
    static funnelFilter(obj: {
        gvc: GVC;
        callback: (value: any) => void;
    }): string;
    static updownFilter(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string;
        options: OptionsItem[];
    }): string;
    static selectDropList(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string[];
        options: OptionsItem[];
        style?: string;
        placeholder?: string;
    }): string;
    static selectOptionAndClickEvent(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string;
        options: OptionsItem[];
        showNote?: string;
        style?: string;
        placeholder?: string;
        clickElement?: {
            html: string;
            event: (gvc: GVC) => void;
        };
    }): string;
    static selectDropDialog(obj: {
        gvc: GVC;
        title: string;
        tag: string;
        single?: boolean;
        default: string[];
        updownOptions?: OptionsItem[];
        api: (obj: {
            query: string;
            orderString: string;
        }) => Promise<OptionsItem[]>;
        callback: (value: any, status?: number) => void;
        style?: string;
        readonly?: boolean;
        custom_line_items?: (data: any) => string;
    }): void;
    static infoDialog(obj: {
        gvc: GVC;
        title: string;
        innerHTML: string;
        closeCallback?: () => void;
    }): void;
    static variantDialog(obj: {
        gvc: GVC;
        default: string[];
        title: string;
        callback: (value: any, status?: number) => void;
    }): void;
    static storeStockDialog(obj: {
        gvc: GVC;
        store_id: string;
        default: string[];
        title: string;
        callback: (value: any, status?: number) => void;
    }): void;
    static settingDialog(obj: {
        gvc: GVC;
        title: string;
        d_main_style?: string;
        width?: number;
        height?: number;
        innerHTML: (gvc: GVC) => string;
        footer_html: (gvc: GVC) => string;
        closeCallback?: () => void;
    }): any;
    static dialog(obj: {
        gvc: GVC;
        title: string;
        innerHTML: (gvc: GVC) => string;
        width?: number;
        height?: number;
        style?: string;
        save?: {
            text?: string;
            event: (gvc: GVC) => Promise<boolean>;
        };
        cancel?: {
            text?: string;
            event?: (gvc: GVC) => Promise<boolean>;
        };
        xmark?: (gvc: GVC) => Promise<boolean>;
    }): void;
    static quesDialog(obj: {
        gvc: GVC;
        innerHTML: (gvc: GVC) => string;
        width?: number;
        height?: number;
        style?: string;
        save?: {
            text?: string;
            event: (gvc: GVC) => Promise<boolean>;
        };
        cancel?: {
            text?: string;
            event?: (gvc: GVC) => Promise<boolean>;
        };
        xmark?: (gvc: GVC) => Promise<boolean>;
    }): void;
    static appPreview(obj: {
        gvc: GVC;
        title: string;
        width?: number;
        height?: number;
        src: string;
        save?: {
            text?: string;
            event: (gvc: GVC) => Promise<boolean>;
        };
        cancel?: {
            text?: string;
            event?: (gvc: GVC) => Promise<boolean>;
        };
        style?: string;
    }): void;
    static jumpAlert(obj: {
        gvc: GVC;
        text: string;
        justify: 'top' | 'bottom';
        align: 'left' | 'center' | 'right';
        timeout?: number;
        width?: number;
    }): void;
    static fullDialog(obj: {
        gvc: GVC;
        title: string | ((data: GVC) => string);
        width?: number;
        height?: number;
        innerHTML: (gvc: GVC) => string;
        footer_html: (gvc: GVC) => string;
        closeCallback?: () => void;
    }): any;
    static noImageURL: string;
    static arrowDownDataImage(color: string): string;
    static checkedDataImage(color: string): string;
    static squareDataImage(color: string): string;
    static darkDotDataImage(color: string): string;
    static whiteDotDataImage(color: string): string;
    static getCheckedClass(gvc: GVC, color?: string): string;
    static getSquareClass(gvc: GVC, color?: string): string;
    static getDarkDotClass(gvc: GVC): string;
    static getWhiteDotClass(gvc: GVC, color?: string): string;
    static isImageUrlValid(url: string): Promise<boolean>;
    static validImageBox(obj: {
        gvc: GVC;
        image: string;
        width: number;
        height?: number;
        class?: string;
        style?: string;
        events?: {
            key: string;
            value: string;
        }[];
    }): string;
    static imageSelector(gvc: GVC, image: string, callback: (src: string) => void): string;
    static imageDialog(obj: {
        gvc: GVC;
        image: string;
        width: number;
        height?: number;
        create?: () => void;
        read?: () => void;
        update?: () => void;
        delete?: () => void;
    }): string;
    static imageLibraryDialog(obj: {
        gvc: GVC;
        title: string;
        innerHTML: (gvc: GVC) => string;
        footer_html: (gvc: GVC) => string;
        closeCallback?: () => void;
        closeTarget?: string;
    }): any;
    static richTextEditor(obj: {
        gvc: GVC;
        content: string;
        callback: (content: string) => void;
        title: string;
        quick_insert?: {
            title: string;
            value: string;
        }[];
    }): string;
    static customForm(gvc: GVC, key: {
        title: string;
        key: string;
        no_padding?: boolean;
    }[]): {
        view: string;
        save: () => Promise<void>;
    };
    static multipleInput(gvc: GVC, def: string[], cb: {
        save: (def: string[]) => void;
    }, openNewSet?: boolean): string;
}
export {};
