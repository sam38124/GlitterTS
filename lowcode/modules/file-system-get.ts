import {ApiUser} from "../glitter-base/route/user.js";

const html = String.raw
export type FileItem = {
    title: string;
    data: any;
    items?: FileItem[];
    type: 'file' | 'folder',
    id: string
};

export class FileSystemGet {
    public static getFile(cf: {
        id: string[],
        key: string
    }) {
        return new Promise<FileItem[]>((resolve, reject) => {
            ApiUser.getPublicConfig(cf.key, 'manager').then((data: any) => {
                if (data.response.value) {
                    let find: FileItem[] = []
                    const links: FileItem[] = data.response.value
                    function loop(array: FileItem[]) {
                        array.map((dd) => {

                            if (dd.type === 'folder') {
                                loop(dd.items ?? [])
                            }else if (cf.id.includes(dd.id)) {
                                find.push(dd)

                            }
                        })
                    }
                    loop(links)
                    resolve(find)
                }else{
                    resolve([])
                }
            });
        })
    }
}