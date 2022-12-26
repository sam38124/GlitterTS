import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';

init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    return {
        onCreateView: () => {
            const sessions: { id: string; title: string; html: string }[] = [
                {
                    id: `Step1`,
                    title: 'Step. 1',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2">Add glitter JavaScriptInterFace for native code.</h2>
            ${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>Android`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>IOS`,
                            ],
                            tab: [
                                doc.codePlace(
                                    `GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("sample"){
            request ->
            //Get data from javascript
            val message=request.receiveValue["message"]
            //Will response i am glitter
            Log.e("message",message.toString())
            //Response value to javascript
            request.responseValue["data"]="Android"
            //Execute Callback
            request.finish()
})
        `,
                                    'language-swift'
                                ),
                                doc.codePlace(
                                    `glitterAct.addJavacScriptInterFace(interface: JavaScriptInterFace(functionName: "sample", function: {
            request in
            //Get data from javascript
            let message=request.receiveValue["message"]
            //Will response i am glitter
            print(message as! String)
            //Response value to javascript
            request.responseValue["data"]="IOS"
            //Execute Callback
            request.finish()
}))`,
                                    'language-swift'
                                )
                            ],
                        })}
</section>`;
                    },
                },
                {
                    id: `Step2`,
                    title: 'Step. 2',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg  fw-normal fw-500">Run glitter JavaScriptInterFace on website.</h2>
${  doc.codePlace(
                            ` glitter.runJsInterFace("sample", {
            message: 'I am Glitter'
        }, function (response) {
            alert(\`Device type is \${response.data}\`)
        }, {
            webFunction(data, callback: (data: any) => void): any {
                //Will print I am Glitter
                console.log(data.message);
                callback({
                    data: 'WEB'
                })
            }
        })`,
                            'language-typescript'
                        )}
</section>`;
                    },
                }
            ];

            return doc.create(
                `
                 <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
        <div class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2">
          <div class="me-4">
             <h1 class="pb-1">JsInterface</h1>
           <h2 class="fs-lg mb-2 fw-normal fw-500">You can develop plugin by youself and use jsInterface to bridge native code．</h2>
          </div>
        </div>
        ${(() => {
            let html = '';
            sessions.map((dd) => {
                html += dd.html;
            });
            return html;
        })()}
      </div>
  
            `,
                doc.asideScroller(sessions),
                new Items('Develop own plugin', gvc)
            );
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});
