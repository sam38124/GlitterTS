export class CodeEditor {
    static getComponent(obj) {
        const html = String.raw;
        return obj.gvc.bindView(() => {
            const id = obj.gvc.glitter.getUUID();
            return {
                bind: id,
                view: () => {
                    return html `
                        <iframe class="w-100 h-100 border rounded-3"
                                src="http://127.0.0.1:3999/test/browser-amd-editor/component.html?height=${obj.height}"></iframe>
                    `;
                },
                divCreate: { class: `w-100 `, style: `height:${obj.height}px;` },
                onDestroy: () => {
                    window.addEventListener('message', function (event) {
                    });
                }
            };
        });
    }
}
