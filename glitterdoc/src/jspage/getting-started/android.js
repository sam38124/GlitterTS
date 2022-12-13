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
                    title: 'Support jitpack.io',
                    get html() {
                        return `
<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
<h2 class="h4">${this.title}</h2>
<a href="https://github.com/sam38124/Glitter_Android" class="btn btn-icon btn-secondary btn-github">
  <i class="bx bxl-github"></i>
</a>
<a class="ms-2" href="https://jitpack.io/#sam38124/Glitter_Android">https://jitpack.io/#sam38124/Glitter_Android</a>
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
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2">Run npm release to get dist and copy your glitter dist dir to asset route.</h2>
            <img src="img/android_asset.png" class="rounded-3 mt-2" style="max-width: 100%;width: 500px;">
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
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2"> Add into your build.gradle file.</h2>
${doc.codePlace(` allprojects {
\t\trepositories {
\t\t\t...
\t\t\tmaven { url 'https://jitpack.io' }
\t\t}
\t}
`, 'language-kotlin')}
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
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2">Add into your dependencies.</h2>
${doc.codePlace(`dependencies {
    implementation 'com.github.sam38124:Glitter_Android:2.7.8'
}`, 'language-kotlin')}
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
<h2 class="fs-lg mb-2 fw-normal fw-500 mb-2 ">Two ways to display glitter page.</h2>
${doc.previewCode({
                            previewString: [
                                `<i class='bx bx-code fs-base opacity-70 me-2'></i>MainActivity`,
                                `<i class="bx bx-code fs-base opacity-70 me-2"></i>Intent`,
                            ],
                            tab: [
                                doc.codePlace(`// Manifest
// Set Glitter Activity as MainActivity
<activity
   android:name="com.jianzhi.glitter.GlitterActivity"
   android:exported="true">
    <intent-filter>
      <action android:name="android.intent.action.MAIN"/>
      <category android:name="android.intent.category.LAUNCHER"/>
    </intent-filter>
</activity>
        `, 'language-java') +
                                    doc.codePlace(`// Application
// In your application
class MyApp :Application(){
    override fun onCreate() {
        super.onCreate()
        // Set up your glitter dir
        GlitterActivity.setUp("file:///android_asset/appData", appName = "appData", parameter="?mydata=data") 
    }
 }`, 'language-kotlin'),
                                doc.codePlace(`GlitterActivity.setUp("file:///android_asset/sample",appName = "sample").open(activity)`, 'language-java'),
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
             <h1 class="pb-1">Android</h1>
           <h2 class="fs-lg mb-2 fw-normal fw-500">Add glitter to your android project.</h2>
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
  
            `, doc.asideScroller(sessions), new Items('Android', gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});
