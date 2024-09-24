import { GVC } from '../GVController.js';
export declare class EditorElem {
    static noImageURL: string;
    static uploadImage(obj: {
        title: string;
        gvc: GVC;
        def: string;
        callback: (data: string) => void;
    }): string;
    static uploadImageContainer(obj: {
        title: string;
        gvc: GVC;
        def: string;
        callback: (data: string) => void;
    }): string;
    static fileUploadEvent(file: string, callback: (link: string) => void): void;
    static flexMediaManager(obj: {
        gvc: GVC;
        data: string[];
    }): string;
    static flexMediaManagerV2(obj: {
        gvc: GVC;
        data: string[];
    }): string;
    static editeText(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
        readonly?: boolean;
    }): string;
    static styleEditor(obj: {
        gvc: GVC;
        height: number;
        initial: string;
        title: string;
        dontRefactor?: boolean;
        callback: (data: string) => void;
    }): string;
    static htmlEditor(obj: {
        gvc: GVC;
        height: number;
        initial: string;
        title: string;
        dontRefactor?: boolean;
        callback: (data: string) => void;
    }): string;
    static pageEditor(cf: {
        page: string;
        width: number;
        height: number;
        par: {
            key: string;
            value: string;
        }[];
    }): string;
    static iframeComponent(cf: {
        page: string;
        width: number;
        height: number;
        par: {
            key: string;
            value: string;
        }[];
    }): string;
    static codeEditor(obj: {
        gvc: GVC;
        height: number;
        initial: string;
        title: string;
        callback: (data: string) => void;
        structStart?: string;
        structEnd?: string;
    }): string;
    static customCodeEditor(obj: {
        gvc: GVC;
        height: number;
        initial: string;
        language: string;
        title: string;
        callback: (data: string) => void;
    }): string;
    static richText(obj: {
        gvc: GVC;
        def: string;
        callback: (text: string) => void;
        style?: string;
        readonly?: boolean;
    }): string;
    static richTextBtn(obj: {
        gvc: GVC;
        def: string;
        title: string;
        callback: (text: string) => void;
        style?: string;
    }): string;
    static pageSelect(gvc: GVC, title: string, def: any, callback: (tag: string) => void, filter?: (data: any) => boolean): string;
    static uploadFile(obj: {
        title: string;
        gvc: any;
        def: string;
        callback: (data: string) => void;
        readonly?: boolean;
    }): string;
    static uploadFileFunction(obj: {
        gvc: GVC;
        callback: (text: string) => void;
        type?: string;
        file?: File;
        multiple?: boolean;
    }): void;
    static uploadVideo(obj: {
        title: string;
        gvc: any;
        def: string;
        callback: (data: string) => void;
    }): string;
    static uploadLottie(obj: {
        title: string;
        gvc: any;
        def: string;
        callback: (data: string) => void;
    }): string;
    static h3(title: string): string;
    static plusBtn(title: string, event: any): string;
    static fontawesome(obj: {
        title: string;
        gvc: any;
        def: string;
        callback: (text: string) => void;
    }): string;
    static toggleExpand(obj: {
        gvc: any;
        title: string;
        data: any;
        innerText: string | (() => string);
        color?: string;
    }): string;
    static minusTitle(title: string, event: string): string;
    static searchInput(obj: {
        title: string;
        gvc: any;
        def: string;
        array: string[];
        callback: (text: string) => void;
        placeHolder: string;
    }): string;
    static searchInputDynamic(obj: {
        title: string;
        gvc: any;
        def: string;
        callback: (text: string) => void;
        placeHolder: string;
        search: (text: string, callback: (data: string[]) => void) => void;
    }): string;
    static searchInputDynamicV2(obj: {
        title: string;
        gvc: any;
        def: string;
        callback: (text: string) => void;
        placeHolder: string;
        search: (text: string, callback: (data: string[]) => void) => void;
    }): string;
    static editeInput(obj: {
        gvc: GVC;
        title: string;
        default: string;
        placeHolder: string;
        callback: (text: string) => void;
        style?: string;
        type?: string;
        readonly?: boolean;
        pattern?: string;
        unit?: string;
    }): string;
    static container(array: string[]): string;
    static numberInput(obj: {
        gvc: GVC;
        title: string;
        default: number;
        placeHolder: string;
        callback: (text: number) => void;
        style?: string;
        min?: number;
        max?: number;
        unit?: string;
        readonly?: boolean;
    }): string;
    static numberInterval(obj: {
        num: number | string;
        min?: number;
        max?: number;
    }): number;
    static checkNumberMinMax(obj: {
        num: number | string;
        min?: number;
        max?: number;
    }): boolean;
    static colorSelect(obj: {
        title: string;
        gvc: GVC;
        def: string;
        callback: (text: string) => void;
        style?: string;
        class?: string;
        readonly?: boolean;
    }): string;
    static select(obj: {
        title: string;
        gvc: GVC;
        def: string;
        array: string[] | {
            title: string;
            value: string;
        }[];
        callback: (text: string) => void;
        style?: string;
        class?: string;
        readonly?: boolean;
        place_holger?: string;
    }): string;
    static checkBox(obj: {
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
    static checkBoxOnly(obj: {
        gvc: GVC;
        def: boolean;
        callback: (result: boolean) => void;
        style?: string;
    }): string;
    static radio(obj: {
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
        oneLine?: boolean;
        readonly?: boolean;
    }): string;
    static editerDialog(par: {
        gvc: GVC;
        dialog: (gvc: GVC) => string;
        width?: string;
        editTitle?: string;
        callback?: () => void;
    }): string;
    static folderLineItems(obj: {
        gvc: GVC;
        viewArray: {
            type: 'container' | 'items';
            dataList?: any[];
        }[];
        originalArray: any;
        isOptionSelected: (dd: any) => boolean;
        onOptionSelected: (dd: any) => void;
    }): string;
    static arrayItem(obj: {
        gvc: GVC;
        title: string;
        position?: string;
        array: () => {
            title: string;
            innerHtml?: string | ((gvc: GVC) => string);
            editTitle?: string;
            saveEvent?: () => void;
            width?: string;
            saveAble?: boolean;
            isSelect?: boolean;
        }[];
        originalArray: any;
        expand: any;
        height?: number;
        plus?: {
            title: string;
            event: string;
        };
        hr?: boolean;
        refreshComponent: (oldIndex?: number, newIndex?: number) => void;
        minus?: boolean;
        draggable?: boolean;
        copyable?: boolean;
        customEditor?: boolean;
        hoverGray?: boolean;
        minusEvent?: (data: any, index: number) => void;
    }): string;
    static fileFolder(obj: {
        gvc: GVC;
        title: string;
        position?: string;
        array: () => {
            title: string;
            innerHtml?: string | ((gvc: GVC) => string);
            editTitle?: string;
            saveEvent?: () => void;
            width?: string;
            saveAble?: boolean;
            isSelect?: boolean;
        }[];
        originalArray: any;
        expand: any;
        height?: number;
        plus?: {
            title: string;
            event: string;
        };
        hr?: boolean;
        refreshComponent: (oldIndex?: number, newIndex?: number) => void;
        minus?: boolean;
        draggable?: boolean;
        copyable?: boolean;
        customEditor?: boolean;
        hoverGray?: boolean;
        minusEvent?: (data: any, index: number) => void;
    }): string;
    static buttonPrimary(title: string, event: string): string;
    static buttonNormal(title: string, event: string): string;
    static openEditorDialog(gvc: GVC, inner: (gvc: GVC) => string, close: () => any, width?: number, title?: string, tag?: string): void;
    static btnGroup(obj: {
        gvc: GVC;
        inner: string;
        style?: string;
        classS?: string;
        dropDownStyle?: string;
        top?: number;
        fontawesome: string;
    }): string;
}
