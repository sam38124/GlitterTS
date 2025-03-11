import { GVC } from '../glitterBundle/GVController.js';
export type FileItem = {
    title: string;
    data: any;
    items?: FileItem[];
    type: 'file' | 'folder';
    tag: string[];
    id: string;
};
export declare class imageLibrary {
    static fileSystem(cf: {
        getSelect: (id: FileItem[]) => void;
        gvc: GVC;
        key: string;
        title: string;
        mul?: boolean;
        tag: string;
        plus: (gvc: GVC, callback: (file: FileItem[]) => void, fileType?: string) => void;
        edit: (file: FileItem, callback: (file?: FileItem) => void) => void;
        cancelEvent?: () => void;
        edit_only?: boolean;
    }): any;
    static selectImageFromArray(imageArray: string[], cf: {
        gvc: GVC;
        title: string;
        getSelect: (id: string) => void;
        cancelEvent?: () => void;
    }): void;
    static selectImageLibrary(gvc: GVC, callback: (id: FileItem[]) => void, title: string, opt?: {
        key?: string;
        mul?: boolean;
        tag?: string;
        cancelEvent?: () => void;
    }, edit_only?: boolean): Promise<void>;
}
