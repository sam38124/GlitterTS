import { GVC } from '../../glitterBundle/GVController.js';

export class Color {
    static getTheme(gvc: GVC, formData: any) {
        const glitter = gvc.glitter;
        const theme = formData.theme_color;
        const mainColorNum = theme.background.includes('#') ? -1 : theme.background.split('.')[1];
        return {
            bgr: mainColorNum < 0 ? theme.background : glitter.share.globalValue[`theme_color.${mainColorNum}.background`],
            title: mainColorNum < 0 ? theme.title : glitter.share.globalValue[`theme_color.${mainColorNum}.title`],
            content: mainColorNum < 0 ? theme.content : glitter.share.globalValue[`theme_color.${mainColorNum}.content`],
            soild: mainColorNum < 0 ? theme['solid-button-bg'] : glitter.share.globalValue[`theme_color.${mainColorNum}.solid-button-bg`],
            soild_text: mainColorNum < 0 ? theme['solid-button-text'] : glitter.share.globalValue[`theme_color.${mainColorNum}.solid-button-text`],
        };
    }
}
