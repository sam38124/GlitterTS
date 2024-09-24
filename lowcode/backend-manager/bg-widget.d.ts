import { GVC } from '../glitterBundle/GVController.js';
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
    static cancel(event: string, text?: string): string;
    static danger(event: string, text?: string): string;
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
        gvc: GVC;
        title: string;
        options: {
            title: string;
            icon: string;
            callback: () => void;
        }[];
    }): string;
    static switchButton(gvc: GVC, def: boolean, callback: (value: boolean) => void): string;
    static switchTextButton(gvc: GVC, def: boolean, text: {
        left?: string;
        right?: string;
    }, callback: (value: boolean) => void): string;
    static goBack(event: string): string;
    static primaryInsignia(text: string): string;
    static successInsignia(text: string): string;
    static dangerInsignia(text: string): string;
    static infoInsignia(text: string): string;
    static warningInsignia(text: string): string;
    static notifyInsignia(text: string): string;
    static secondaryInsignia(text: string): string;
    static leftLineBar(): string;
    static horizontalLine(css?: {
        color?: string;
        size?: number;
        margin?: number;
    }): string;
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
    static searchPlace(event: string, vale: string, placeholder: string, margin?: string): string;
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
        tableHeader?: string[];
        hiddenPageSplit?: boolean;
    }): string;
    static getContainerWidth: (obj?: {
        rate?: {
            web?: number;
            pad?: number;
            phone?: number;
        };
    }) => number;
    static container(htmlString: string, width?: number, style?: string): string;
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
    static inlineCheckBox(obj: {
        title: string;
        gvc: any;
        def: string | string[];
        array: string[] | {
            title: string;
            value: string;
            innerHtml?: string;
        }[];
        callback: (text: string) => void;
        type?: 'single' | 'multiple';
    }): string;
    static mbContainer(margin_bottom_px: number): string;
    static card(htmlString: string, classStyle?: string): string;
    static mainCard(htmlString: string, classString?: string, styleString?: string): string;
    static tab(data: {
        title: string;
        key: string;
    }[], gvc: GVC, select: string, callback: (key: string) => void, style?: string): string;
    static alertInfo(title: string, messageList?: string[], css?: {
        class: string;
        style: string;
    }): string;
    static selNavbar(data: {
        count: number;
        buttonList: string[];
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
        openHeight?: number;
        autoClose?: boolean;
        guideClass?: string;
    }): string;
    static selectFilter(obj: {
        gvc: GVC;
        callback: (value: any) => void;
        default: string;
        options: OptionsItem[];
        style?: string;
    }): string;
    static searchFilter(event: string, vale: string, placeholder: string, margin?: string): string;
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
        callback: (value: any) => void;
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
    static settingDialog(obj: {
        gvc: GVC;
        title: string;
        innerHTML: (gvc: GVC) => string;
        footer_html: (gvc: GVC) => string;
        closeCallback?: () => void;
    }): any;
    static dialog(obj: {
        gvc: GVC;
        title: string;
        innerHTML: string;
        width?: number;
        height?: number;
        save?: {
            text?: string;
            event: () => Promise<boolean>;
        };
        cancel?: {
            text?: string;
            event?: () => Promise<boolean>;
        };
    }): void;
    static noImageURL: string;
    static arrowDownDataImage(color: string): string;
    static checkedDataImage(color: string): string;
    static darkDotDataImage(color: string): string;
    static whiteDotDataImage(color: string): string;
    static getCheckedClass(gvc: GVC, color?: string): string;
    static getDarkDotClass(gvc: GVC, color?: string): string;
    static getWhiteDotClass(gvc: GVC, color?: string): string;
    static isImageUrlValid(url: string): Promise<boolean>;
    static validImageBox(obj: {
        gvc: GVC;
        image: string;
        width: number;
        height?: number;
        class?: string;
        style?: string;
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
}
