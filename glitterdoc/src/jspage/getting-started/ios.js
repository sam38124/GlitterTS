import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';
init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    return {
        onCreateView: () => {
            const sessions = [
                {
                    id: `Support`,
                    title: 'Support Swift Package',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<a href="https://github.com/sam38124/Glitter_IOS" class="btn btn-icon btn-secondary btn-github">
  <i class="bx bxl-github"></i>
</a>
<a class="ms-2" href="https://github.com/sam38124/Glitter_IOS">https://github.com/sam38124/Glitter_IOS</a>
</section>`;
                    },
                },
                {
                    id: `Step1`,
                    title: 'Step. 1',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2">Run npm release.js to get dist and copy your glitter dist dir to project root.</h2>
            <img src="img/addFilesIos.png" class="rounded-3 mt-2" style="max-width: 100%;width: 500px;">
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
<h2 class="fs-lg  fw-normal fw-500"> Add swift package in your xcode.</h2>
<a class="fs-lg  fw-normal fw-500 ">https://github.com/sam38124/Glitter_IOS</a><br>
  <img src="img/iosswiftpackage.png" class="rounded-3 mt-2" style="max-width: 100%;width: 500px;">
</section>`;
                    },
                },
                {
                    id: `Step3`,
                    title: 'Step. 3',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2"> Create glitter viewController.</h2>
${doc.codePlace(`var glitterAct:GlitterActivity = GlitterActivity.create(
    glitterConfig: GlitterActivity.GlitterConfig(parameters:"?page=main",
    projectRout: Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "appData")))`, 'language-swift')}
</section>`;
                    },
                },
                {
                    id: `Step4`,
                    title: 'Step. 4',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Three ways to display glitter page.</h2>
${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>Add subview`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Push navigation`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Present`,
                            ],
                            tab: [
                                doc.codePlace(`var glitterAct:GlitterActivity = GlitterActivity.create(
  glitterConfig: GlitterActivity.GlitterConfig(parameters:"?page=main",
  projectRout: Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "appData")))
  
  addChild(glitterAct)
  view.addSubview(glitterAct.view)
  glitterAct.view.frame=view.safeAreaLayoutGuide.layoutFrame
  glitterAct.didMove(toParent: self)
        `, 'language-swift'),
                                doc.codePlace(`var glitterAct:GlitterActivity = GlitterActivity.create(
  glitterConfig: GlitterActivity.GlitterConfig(parameters:"?page=main",
  projectRout: Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "appData")))
  
  self.navigationController?.pushViewController(glitterAct, animated: true)`, 'language-swift'),
                                doc.codePlace(`var glitterAct:GlitterActivity = GlitterActivity.create(
  glitterConfig: GlitterActivity.GlitterConfig(parameters:"?page=main",
  projectRout: Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "appData")))
  
  present(viewControllerToPresent:glitterAct, animated:true)                               
                                `, 'language-swift'),
                            ],
                        })}
</section>`;
                    },
                },
            ];
            return doc.create(`
                 <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="">
        <div class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2">
          <div class="me-4">
             <h1 class="pb-1">IOS</h1>
           <h2 class="fs-lg mb-2 fw-normal fw-500">Add glitter to your ios project.</h2>
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
  
            `, doc.asideScroller(sessions), new Items('IOS', gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});
