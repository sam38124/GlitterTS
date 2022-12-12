export class Hello {
    constructor(gvc) {
        this.drivingLicence = (licence) => { };
        const self = this;
        this.introduction = (data) => {
            return `
            <div>
                <h1>${data.name}</h1>
                ${self.someDetail(data.birthday, data.age)}
                <div>${self.drivingLicence(data.license)}</div>
                <h4>${data.text}</h4>
            </div>
            `;
        };
        this.someDetail = (birthday, age) => {
            return `
            <div>
                <h2>${birthday}</h2>
                <span>${age}</span>
            </div>`;
        };
        this.drivingLicence = (licence) => {
            return `
            <div>
                ${(() => {
                if (licence) {
                    return `<a class="ok">PASS</a>`;
                }
                else {
                    return `<a class="notOk">NOT PASS</a>`;
                }
            })()}
            </div>`;
        };
    }
}
