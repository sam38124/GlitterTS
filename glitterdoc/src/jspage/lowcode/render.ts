import {init} from '../../glitterBundle/GVController.js';

init((gvc, glitter, gBundle) => {
    return {
        onCreateView:()=>{
            return gBundle.data.render(gvc)
        }
    }
})