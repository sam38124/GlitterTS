!(function (n) {
    'use strict';
    function t() {
        this.$body = n('body');
    }
    (t.prototype.init = function () {
        (window.Dropzone.autoDiscover = !1),
            n('[data-plugin="dropzone"]').each(function () {
                var t = n(this).attr('action'),
                    i = n(this).data('previewsContainer'),
                    e = {
                        url: t,
                        init: function () {
                            var title = this.element.name;
                            this.on('thumbnail', function (file, fileurl) {
                                glitter.share.uploadFile(file.dataURL, (response) => {
                                    if (response && response.result) {
                                        file.googleURL = response.url[0];
                                        glitter.share.addFileData(title, response.url[0]);
                                        // toast.fire({ icon: 'success', title: `${file.name} 上傳成功` });
                                    } else {
                                        // toast.fire({ icon: 'danger', title: `${file.name} 上傳失敗` });
                                    }
                                });
                            });
                            this.on('removedfile', function (file) {
                                glitter.share.rmFileData(title, file.googleURL);
                            });
                            // this.on("addedfile", function (file) {});
                            // this.on("totaluploadprogress", function (progress) {});
                            // this.on("queuecomplete", function () {});
                            // this.on("processing", function (file) {});
                        },
                    };
                i && (e.previewsContainer = i);
                var o = n(this).data('uploadPreviewTemplate');
                o && (e.previewTemplate = n(o).html());
                n(this).dropzone(e);
            });
    }),
        (n.FileUpload = new t()),
        (n.FileUpload.Constructor = t);
})(window.jQuery);

glitter.share.fileUploadMethod = () => window.jQuery.FileUpload.init();
