import { GVC } from '../../glitterBundle/GVController';

export class Tfn {
    constructor(gvc: GVC) {
        const glitter = gvc.glitter;

        const HTML = /*html*/ `
            <div
                class="${gvc.event(() => {
                    glitter.ut.frSize({ me: 'm-1' }, 'm-3');
                })}"
            ></div>
        `;
    }
}
