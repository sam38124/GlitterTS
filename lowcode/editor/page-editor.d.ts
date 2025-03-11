import { GVC } from "../glitterBundle/GVController.js";
export declare class PageEditor {
    static openDialog: {
        plugin_setting: (gvc: GVC) => void;
        event_config: (gvc: GVC, eventSelect: (data: any) => void) => void;
        event_trigger_list: (gvc: GVC, left: string, right: string, title: string) => void;
        seo_with_domain: (gvc: GVC) => void;
    };
    gvc: GVC;
    vid: string;
    editorID: string;
    constructor(gvc: GVC, vid: string, editorID?: string);
    renderLineItem(array: any, child: boolean, original: any, option?: {
        addComponentView?: (gvc: GVC, callback?: (data: any) => void) => string;
        copyType?: 'directly';
        readonly?: boolean;
        selectEvent?: (dd: any) => void;
        selectEv?: (dd: any) => boolean;
        justFolder?: boolean;
        refreshEvent?: () => void;
    }): string;
    static styleRenderEditor(obj: {
        gvc: GVC;
        vid: string;
        viewModel: {
            selectItem: any;
            data: any;
            globalStyle: any;
        };
        docID: string;
        editFinish: () => void;
    }): string;
    static styleRenderSelector(obj: {
        gvc: GVC;
        vid: string;
        viewModel: {
            selectContainer: any;
            globalStyle: any;
            data: any;
        };
        docID: string;
        selectBack: (dd: any) => void;
    }): string;
    static scriptRenderEditor(obj: {
        gvc: GVC;
        vid: string;
        viewModel: {
            selectItem: any;
            data: any;
            globalScript: any;
        };
        docID: string;
        editFinish: () => void;
    }): string;
    static scriptRenderSelector(obj: {
        gvc: GVC;
        vid: string;
        viewModel: {
            selectContainer: any;
            globalScript: any;
            data: any;
        };
        docID: string;
        selectBack: (dd: any) => void;
    }): string;
    static eventRender(gvc: GVC): Promise<{
        left: string;
        right: string;
    }>;
    static resourceInitial(gvc: GVC): Promise<{
        left: string;
        right: string;
    }>;
    static eventEditor(gvc: GVC, callback: (event: any) => void, from?: string): Promise<{
        left: string;
        right: string;
    }>;
    static seoRender(gvc: GVC): Promise<{
        left: string;
        right: string;
    }>;
    static pageEditorView(obj: {
        gvc: GVC;
        id: string;
        vid: string;
        viewModel: any;
        style?: {
            style?: string;
            class?: string;
        };
        hiddenDelete?: boolean;
    }): string;
    static formSetting(obj: {
        gvc: GVC;
        id: string;
        vid: string;
        viewModel: any;
    }): string;
    static pageSelctor(gvc: GVC, callBack: (page: any) => void, option?: {
        checkSelect?: (data: any) => boolean;
        filter?: (data: any) => boolean;
    }): Promise<{
        left: string;
        right: string;
    }>;
    static domainRender(gvc: GVC): Promise<{
        left: string;
        right: string;
    }>;
}
