import { Glitter } from '../glitterBundle/Glitter.js';
export declare class ShareDialog {
    dataLoading: (obj: {
        text?: string;
        visible: boolean;
    }) => void;
    errorMessage: (obj: {
        text?: string;
    }) => void;
    successMessage: (obj: {
        text?: string;
    }) => void;
    checkYesOrNot: (obj: {
        callback: (response: boolean) => void;
        text: string;
    }) => void;
    constructor(glitter: Glitter);
}
