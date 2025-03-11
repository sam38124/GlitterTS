import { Glitter } from '../Glitter.js';
interface DataLoadingOptions {
    text?: string;
    visible: boolean;
    BG?: string;
}
interface MessageOptions {
    text?: string;
}
interface ErrorMessageOptions extends MessageOptions {
    tag?: string;
    callback?: () => void;
}
interface ConfirmDialogOptions {
    text: string;
    callback: (response: boolean) => void;
    icon?: string;
}
export declare class ShareDialog {
    private glitter;
    dataLoading: (obj: DataLoadingOptions) => void;
    infoMessage: (obj: MessageOptions) => void;
    errorMessage: (obj: ErrorMessageOptions) => void;
    successMessage: (obj: MessageOptions) => void;
    warningMessage: (obj: ConfirmDialogOptions) => void;
    checkYesOrNot: (obj: ConfirmDialogOptions) => void;
    customCheck: (obj: ConfirmDialogOptions) => void;
    constructor(glitter: Glitter);
    private openConfirmDialog;
}
export {};
