import { GVC } from "../glitterBundle/GVController.js";
export declare class AiMessage {
    static config: any;
    static vm: {
        type: 'list' | 'detail';
        chat_user: any;
        select_bt: 'writer' | 'order-analysis' | 'operation-guide';
    };
    static id: string;
    static toggle: (visible: boolean) => void;
    static aiRobot(cf: {
        gvc: GVC;
        userID: string;
        toUser?: string;
        viewType?: string;
        open?: boolean;
        type?: 'preview' | 'def';
    }): string;
    static detail(cf: {
        gvc: GVC;
        user_id: string;
        containerHeight: string;
        document: any;
        goBack: () => void;
        close?: () => void;
        hideBar?: boolean;
    }): string;
    static robotMessage(gvc: GVC, goToChat: (text: string) => void): string;
}
