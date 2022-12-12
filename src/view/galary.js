export class Galary {
    constructor(gvc) {
        gvc.addStyleLink(`assets/vendor/lightgallery/css/lightgallery-bundle.min.css`);
        this.imagePreview = (rout) => {
            return `<div class="gallery">
                <a href="${rout}" class="gallery-item rounded-3" data-sub-html='<h6 class="text-light">Gallery image caption</h6>'>
                    <img src="${rout}" alt="Gallery thumbnail" />
                    <div class="gallery-item-caption fs-sm fw-medium">顯示預覽圖</div>
                </a>
            </div>`;
        };
        this.addScript = () => {
            gvc.addMtScript([
                './assets/vendor/lightgallery/lightgallery.min.js',
                './assets/vendor/lightgallery/plugins/fullscreen/lg-fullscreen.min.js',
                './assets/vendor/lightgallery/plugins/zoom/lg-zoom.min.js',
                './assets/vendor/lightgallery/plugins/video/lg-video.min.js',
                './assets/vendor/lightgallery/plugins/thumbnail/lg-thumbnail.min.js',
            ].map((url) => ({ src: url })), () => { }, () => { });
            return ``;
        };
    }
}
