import { GVC } from '../glitterBundle/GVController';

export class Items {
    public items: {
        title: string;
        option: { text: string; click: () => void; select?: boolean,option?:any[] }[];
    }[];

    public constructor(selectItem: string, gvc: GVC) {
        this.items = [
            {
                title: 'Getting started',
                option: [
                    {
                        text: 'Introduction',
                        click: () => {
                            location.href = 'index.html?page=getting-started/introduction';
                        }
                    },
                    {
                        text: 'Create',
                        click: () => {
                            location.href = 'index.html?page=getting-started/import';
                        },
                    },
                    {
                        text: 'Backend Server',
                        click: () => {
                            location.href = 'index.html?page=getting-started/backend';
                        },
                    },
                    {
                        text: 'Android',
                        click: () => {
                            location.href = 'index.html?page=getting-started/android';
                        },
                    },
                    {
                        text: 'IOS',
                        click: () => {
                            location.href = 'index.html?page=getting-started/ios';
                        },
                    },
                    {
                        text: 'LowCode',
                        click: () => {
                            location.href = 'index.html?page=lowcode/main';
                        },
                    },
                ],
            },
            {
                title: '<span class="text-danger me-1">★</span>Mobile Plugin',
                option: [
                    {
                        text: 'Develop own plugin',
                        click: () => {
                            location.href = 'index.html?page=getting-started/jsinterface';
                        },
                    },
                    {
                        text: 'Official plugin',
                        click: () => {
                            location.href = 'index.html?page=plugin/official';
                        },
                    },
                ],
            },
            {
                title: '<span class="text-danger me-1">★</span> Basics',
                option: [
                    {
                        text: 'Entry',
                        click: () => {
                            location.href = 'index.html?page=basics/entry';
                        },
                    },
                    {
                        text: 'GVController',
                        click: () => {
                            location.href = 'index.html?page=basics/gvcontroller';
                        },
                    },
                    {
                        text: 'Page Manager',
                        click: () => {
                            location.href = 'index.html?page=basics/pageManager';
                        },
                    },
                    {
                        text: 'Dialog',
                        click: () => {
                            location.href = 'index.html?page=basics/dialog';
                        },
                    },
                    {
                        text: 'TransitionManager',
                        click: () => {
                            location.href = 'index.html?page=basics/transitionManager';
                        },
                    },
                    {
                        text: 'DrawerLayout',
                        click:()=>{
                            location.href = 'index.html?page=basics/drawer';
                        }
                    },
                    {
                        text: 'Components',
                        click: () => {
                            location.href = 'index.html?page=basics/components';
                        },
                    },
                    {
                        text: 'Method',
                        click: () => {
                            location.href = 'index.html?page=basics/method';
                        },
                    },
                    {
                        text: 'Funnel',
                        click: () => {
                            location.href = 'index.html?page=basics/funnel';
                        },
                    },
                ],
            },
        ];
        this.items.map((dd) => {
            dd.option.map((d2) => {
                d2.select = d2.text === selectItem;
            });
        });
    }
}
