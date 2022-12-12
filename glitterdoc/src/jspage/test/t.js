export class Tfn {
    constructor(gvc) {
        const glitter = gvc.glitter;
        const HTML = `
            <div
                class="${gvc.event(() => {
            glitter.ut.frSize({ me: 'm-1' }, 'm-3');
        })}"
            ></div>
        `;
    }
}
