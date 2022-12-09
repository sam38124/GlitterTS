import { GVC } from '../../glitterBundle/GVController.js';

export class Hello {
    public introduction: (data: { name: string; birthday: string; age: number; text: string; license: boolean }) => string;
    public someDetail: (birthday: string, age: number) => string;
    public drivingLicence = (licence: boolean) => {};
    constructor(gvc: GVC) {
        const self = this;

        this.introduction = (data: { name: string; birthday: string; age: number; text: string; license: boolean }) => {
            return /*html*/ `
            <div>
                <h1>${data.name}</h1>
                ${self.someDetail(data.birthday, data.age)}
                <div>${self.drivingLicence(data.license)}</div>
                <h4>${data.text}</h4>
            </div>
            `;
        };

        this.someDetail = (birthday: string, age: number) => {
            return /*html*/ `
            <div>
                <h2>${birthday}</h2>
                <span>${age}</span>
            </div>`;
        };

        this.drivingLicence = (licence: boolean) => {
            return /*html*/ `
            <div>
                ${(() => {
                    if (licence) {
                        return `<a class="ok">PASS</a>`;
                    } else {
                        return `<a class="notOk">NOT PASS</a>`;
                    }
                })()}
            </div>`;
        };
    }
}
