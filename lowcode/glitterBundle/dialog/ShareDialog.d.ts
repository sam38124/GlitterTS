import { Glitter } from '../Glitter.js';
export declare class ShareDialog {
    dataLoading: (obj: {
        text?: string;
        visible: boolean;
    }) => void;
    infoMessage: (obj: {
        text?: string;
    }) => void;
    errorMessage: (obj: {
        text?: string;
    }) => void;
    successMessage: (obj: {
        text?: string;
    }) => void;
    warningMessage: (obj: {
        callback: (response: boolean) => void;
        text: string;
    }) => void;
    checkYesOrNot: (obj: {
        callback: (response: boolean) => void;
        text: string;
        icon?: string;
    }) => void;
    policy: () => void;
    constructor(glitter: Glitter);
}
