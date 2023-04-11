'use strict';
import { Swal } from '../modules/sweetAlert.js';
export class Api {
    constructor(gvc) {
        const $ = window.$;
        const glitter = gvc.glitter;
        const swal = new Swal(gvc);
        this.encodeImageFileAsURL = (element, callback) => {
            var file = element.files[0];
            $.ajax({
                url: '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({ file_name: `${new Date().getTime()}.` + file.name.split('.').pop() }),
                contentType: 'application/json; charset=utf-8',
                headers: { Authorization: glitter.getCookieByName('token') },
                success: (data1) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: file,
                        processData: false,
                        crossDomain: true,
                        success: (data2) => {
                            callback(data1.fullUrl);
                        },
                        error: (err) => {
                        },
                    });
                },
                error: (err) => {
                },
            });
        };
    }
}
