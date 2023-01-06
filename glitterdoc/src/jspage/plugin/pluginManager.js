export var Type;
(function (Type) {
    Type[Type["Android"] = 0] = "Android";
    Type[Type["IOS"] = 1] = "IOS";
    Type[Type["WEB"] = 2] = "WEB";
})(Type || (Type = {}));
export class PluginManager {
    constructor(gvc) {
        const plugin = [
            {
                title: "Bluetooth",
                content: "Easy way to discover connect or send message to your bluetooth device.",
                type: [Type.IOS, Type.Android]
            }
        ];
        this.getFrameWork = (type) => {
            return `
            <div class="row w-100">
            ${gvc.map(plugin.filter((dd) => {
                return dd.type.find((d2) => {
                    return d2 === type;
                }) != undefined;
            }).map((data) => {
                return `
<div class="card card-hover col-3">
  <div class="card-body">
    <h5 class="card-title">${data.title}</h5>
    <p class="card-text fs-sm" style="white-space: normal;word-break: break-word;overflow-x: hidden;">${data.content}</p>
    <a onclick="${gvc.event(() => {
                    location.href = 'index.html?page=plugins/bluetooth';
                })}" class="btn btn-sm btn-primary w-100">Read More</a>
  </div>
</div>`;
            }))}
</div>
`;
        };
        this.support = (type) => {
            return `
<h3 class=" fw-500 fw-normal fs-lg d-flex align-items-center p-2 alert d-flex alert-primary"><i class="fa-regular fa-hammer me-2 bg-danger p-2 rounded"></i> 
FOR -
<div class="d-flex ms-2">   
${gvc.map(type.map((dd) => {
                switch (dd) {
                    case Type.Android:
                        return `<img class="rounded rounded-circle me-2 bg-white p-1" src="img/android.png" style="width: 30px;height: 30px;"/>`;
                    case Type.WEB:
                        return `<i class="fa-regular fa-globe text-primary p-1 bg-white rounded-circle me-2" style="width: 23px;height: 23px;"></i>`;
                    case Type.IOS:
                        return `<img class="rounded rounded-circle me-2 bg-white p-1" src="img/ios.png" style="width: 30px;height: 30px;"/>`;
                }
            }))}
</div>
</h3>
`;
        };
    }
}
