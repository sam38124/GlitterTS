import { init } from '../../glitterBundle/GVController.js';
import { Hello } from './hello.js';

init((gvc, glitter, gBundle) => {
    return {
        onCreateView: () => {
            const hello = new Hello(gvc);
            const info = {
                name: 'Jackson Lee',
                birthday: '1998-07-15',
                age: 24,
                license: true,
                text: 'This is my info!',
            };
            return hello.introduction(info);
        },
    };
});
