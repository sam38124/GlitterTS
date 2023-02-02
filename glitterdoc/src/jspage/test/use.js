import { init } from '../../glitterBundle/GVController.js';
import { Funnel } from '../../glitterBundle/funnel.js';
init((gvc) => {
    const funnel = new Funnel(gvc);
    return {
        onCreateView: () => {
            return `funnel.formatDatetime();`;
        },
    };
});
