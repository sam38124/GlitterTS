export class Items {
    constructor(selectItem, gvc) {
        this.items = [
            {
                title: 'Getting started',
                option: [
                    {
                        text: 'Introduction',
                        click: () => {
                            location.href = 'index.html?page=getting-started/introduction';
                        },
                    },
                    {
                        text: 'Create',
                        click: () => {
                            location.href = 'index.html?page=getting-started/import';
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
                        text: 'BindView',
                        click: () => {
                            location.href = 'index.html?page=basics/bindview';
                        },
                    },
                    {
                        text: 'Event',
                        click: () => {
                            location.href = 'index.html?page=basics/event';
                        },
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
