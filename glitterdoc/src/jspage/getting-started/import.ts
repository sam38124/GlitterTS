import {init} from '../../glitterBundle/GVController.js'
import {Doc} from "../../view/doc.js";
import {Items} from "../page-config.js"
import {Galary} from "../../view/galary.js"

init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc)
    const gallary = new Galary(gvc)
    return {
        onCreateView: () => {
            const sessions: { id: string, title: string, html: string }[] = [
                {
                    id: `Step1`,
                    title: 'Step.1',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2"> Add glitter plugin by npm</h2>
${doc.codePlace('npm install @jianzhi.wang/glitter', 'language-kotlin')}
</section>`
                    }
                },
                {
                    id: `Step2`,
                    title: 'Step.2',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Create an empty glitter project</h2>
${doc.previewCode({
                            previewString: [
                                `<i class="bx bx-show-alt fs-base opacity-70 me-2"></i> result`, 
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>script`],
                            tab: [
                                `<img src="img/create/emptydir.png" class="rounded-3 " style="max-width: 100%;width: 500px;">`,
                                doc.codePlace('node node_modules/@jianzhi.wang/glitter/create.js"', 'language-kotlin')
                            ]
                        })}
</section>`
                    }
                },
                {
                    id: `Step3`,
                    title: 'Step.3',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Auto build your Glitter project</h2>
${doc.codePlace('tsc --project tsconfig.json && tsc -w', 'language-kotlin')}
</section>`
                    }
                },
                {
                    id: `Finish`,
                    title: 'Finish',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Open the index.html</h2>
<img src="img/create/index.png" class="rounded-3 " style="max-width: 100%;width: 500px;">
<h2 class="fs-lg  fw-normal fw-500 mb-2 mt-4">👍<span class="me-2"></span>Great job! Now you can start your coding</h2>
</section>`
                    }
                },
                {
                    id: `Optional`,
                    title: 'Optional. dependencies',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Set up your dependencies in glitterDeps.json.</h2>
${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>glitterDeps.json`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i> script`,
                                `<i class="bx bx-show-alt fs-base opacity-70 me-2"></i> result`
                            ],
                            tab: [
                                doc.codePlace(`"dependencies": [
    {
      "name": "slick.js",
      "path": "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"
    }
  ]`, 'language-kotlin'),
                                doc.codePlace(`"install": "node node_modules/@jianzhi.wang/glitter/install.js"`, 'language-kotlin'),
                                `<img src="img/glitterdeps.png" class="rounded-3 " style="max-width: 100%;width: 500px;">`,
                            ]
                        })}
</section>`
                    }
                },
                {
                    id: `Optional1`,
                    title: 'Optional. Release',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Build your project to other dir and ignore ts file.</h2>
${doc.previewCode({
                            previewString: [
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i> script`
                            ],
                            tab: [
                                doc.codePlace(`"release": "node node_modules/@jianzhi.wang/glitter/release.js path=mypath"`, 'language-kotlin')
                            ]
                        })}
</section>`
                    }
                }
            ]

            return doc.create(`
                 <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
        <div class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2">
          <div class="me-4">
             <h1 class="pb-1">Create</h1>
           <h2 class="fs-lg mb-2 fw-normal fw-500">Create glitter project with node.js and npm</h2>
         
            <img src="img/npm.png" class="rounded-3 " style="max-width: 100%;width: 500px;">
          </div>
        </div>
        ${(() => {
                let html = ''
                sessions.map((dd) => {
                    html += dd.html
                })
                return html
            })()}
      </div>
            `, doc.asideScroller(sessions), new Items("Create", gvc))
        },
        onCreate: () => {
            gallary.addScript()
            doc.addScript()
        }
    }
})