'use strict';
import { GVC } from '../glitterBundle/GVController.js';
import { Swal } from '../modules/sweetAlert.js';

export class Api {
    public encodeImageFileAsURL: (element: { files: File[] }, callback: (resp: string) => void) => void;
    constructor(gvc: GVC) {
        const $ = (window as any).$;
        const glitter = gvc.glitter;
        const swal = new Swal(gvc);

        this.encodeImageFileAsURL = (element: { files: File[] }, callback: (resp: string) => void) => {
            var file = element.files[0];
            $.ajax({
                url:  '/api/v1/scene/getSignedUrl',
                type: 'post',
                data: JSON.stringify({file_name: `${new Date().getTime()}.` + file.name.split('.').pop()}),
                contentType: 'application/json; charset=utf-8',
                headers: {Authorization: glitter.getCookieByName('token')},
                success: (data1: { url: string; fullUrl: string }) => {
                    $.ajax({
                        url: data1.url,
                        type: 'put',
                        data: file,
                        processData: false,
                        crossDomain: true,
                        success: (data2: any) => {
                            callback(data1.fullUrl)
                        },
                        error: (err: any) => {
                        },
                    });
                },
                error: (err: any) => {
                },
            });
        };
    }
}
