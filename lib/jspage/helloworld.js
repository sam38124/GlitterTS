import { init } from '../glitterBundle/GVController.js';
init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            return `<h3>Hello world</h3>`;
        }
    };
});
