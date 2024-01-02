import { TriggerEvent } from '../../glitterBundle/plugins/trigger-event.js';
TriggerEvent.createSingleEvent(import.meta.url, () => {
    return {
        fun: (gvc, widget, object, subData, element) => {
            return {
                editor: () => {
                    return [
                        gvc.glitter.htmlGenerate.styleEditor(object, gvc, widget, subData).editor(gvc, () => {
                            widget.refreshComponent();
                        }, '設定樣式')
                    ].join('');
                },
                event: () => {
                    return new Promise((resolve, reject) => {
                        gvc.glitter.renderView.replaceAttributeValue({
                            key: 'style',
                            value: gvc.glitter.htmlGenerate.styleEditor(object, gvc, widget, subData).style()
                        }, element.e);
                        resolve(true);
                    });
                }
            };
        }
    };
});
