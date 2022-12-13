import { init } from '../../glitterBundle/GVController.js';
import { Funnel } from '../../glitterBundle/funnel.js';
init((gvc) => {
    const funnel = new Funnel(gvc);
    return {
        onCreateView: () => {
            return funnel.optionSreach({
                path: '127.0.0.1/api/order?title=',
                key: 'name',
                def: '001-205-ORDER',
                height: 15,
                setTime: 500,
                multi: true,
            }, (res) => {
                const clickOption = res;
            });
        },
    };
});
