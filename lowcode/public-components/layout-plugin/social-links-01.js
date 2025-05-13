export class SocialLinks01 {
    static main(obj) {
        console.log(obj);
        console.log(`formData=>`, obj.widget.formData);
        return `<div>hello</div>`;
    }
}
window.glitter.setModule(import.meta.url, SocialLinks01);
