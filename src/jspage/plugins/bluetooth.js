import { init } from '../../glitterBundle/GVController.js';
import { Doc } from '../../view/doc.js';
import { Items } from '../page-config.js';
import { Galary } from '../../view/galary.js';
import { PluginManager, Type } from '../plugin/pluginManager.js';
init((gvc, glitter, gBundle) => {
    const doc = new Doc(gvc);
    const gallary = new Galary(gvc);
    const plugin = new PluginManager(gvc);
    return {
        onCreateView: () => {
            const topTitle = {
                title: 'Bluetooth',
                subTitle: 'Easy way to discover,connect or send message to your bluetooth device by glitter library.',
            };
            const sessions = [
                {
                    id: 'Android Config',
                    title: 'Android Config',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4 text-success">${this.title}</h2>
                            <h2 class="fs-lg mb-3 fw-normal fw-500"><span class="text-danger">Step 1.</span> Add into your build.gradle</h2>
                            ${doc.codePlace(`allprojects {
repositories {
maven { url 'https://jitpack.io' }
 }
}`, 'language-kotlin')}
                             <h2 class="fs-lg mb-2 fw-normal fw-500 mt-3"><span class="text-danger">Step 2.</span> Set up your dependency</h2>
                            ${doc.jitPackVersion(`Glitter_Plugin_Bluetooth`)}
                             <h2 class="fs-lg mb-2 fw-normal fw-500 mt-3"><span class="text-danger">Step 3.</span> Add into your application</h2>
                               ${doc.codePlace(`Glitter_BLE(applicationContext).create()`, 'language-kotlin')}
                        </section>`;
                    },
                },
                {
                    id: 'IOS Config',
                    title: 'IOS Config',
                    get html() {
                        return ` <section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4 text-success">${this.title}</h2>
                            <h2 class="fs-lg mb-3 fw-normal fw-500"><span class="text-danger">Step 1.</span> Add into your swift package.</h2>
                            <div class="alert-success alert">
                             <a href="https://github.com/sam38124/Glitter_IOS " class="btn btn-icon btn-secondary btn-github">
  <i class="bx bxl-github"></i>
</a>
<a class="ms-2" href="https://github.com/sam38124/Glitter_IOS_Plugin_Bluetooth">https://github.com/sam38124/Glitter_IOS_Plugin_Bluetooth</a>   </div>  
                             <h2 class="fs-lg mb-2 fw-normal fw-500 mt-3"><span class="text-danger">Step 2.</span> Add into your glitter activity.</h2>${doc.codePlace(`Glitter_BLE(act:glitterAct).create()`, 'language-swift')}
                        </section>`;
                    },
                },
                {
                    id: 'Use in typescript',
                    title: 'Use in typescript',
                    get html() {
                        return `<section id="${this.id}" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                            <h2 class="h4 text-warning">${this.title}</h2>
                            <h2 class="fs-lg mb-3 fw-normal fw-500"><span class="text-danger">Step 1.</span> Set up your dependencies in glitterDeps.json.</h2>
                            ${doc.codePlace(`{
    "dependencies": [
        {
            "name": "GlitterBLE.js",
            "path": "https://raw.githubusercontent.com/sam38124/GlitterTS/main/plugin/bluetooth/interface.ts"
        }
    ]
}`, 'language-json')}
                             <h2 class="fs-lg mb-2 fw-normal fw-500 mt-3"><span class="text-danger">Step 2.</span>Add import to your script.</h2>
                               ${doc.codePlace(`import {BLEHelper} from "../glitterLib/GlitterBLE.js";
                               `, 'language-typescript')}
                               <h2 class="fs-lg mb-2 fw-normal fw-500 mt-3"><span class="text-danger">Step 3.</span> Set callback for BleHelper.</h2>
                               ${doc.codePlace(`const bleHelper = new BLEHelper(glitter)

   bleHelper.setBleCallback({
                //Android 6.0 - 9.0 need open gps to scan bluetooth
                needGPS: () => {
                },
                //Bluetooth connect false
                onConnectFalse: () => {
                },
                //Bluetooth connect success
                onConnectSuccess: () => {
                },
                //Bluetooth onConnecting
                onConnecting: () => {
                },
                //Bluetooth onDisconnect
                onDisconnect: () => {
                },
                //In android, you need request permission to use bluetooth
                requestPermission: (permission: [string]) => {
                },
                //The message from bluetooth
                rx: (data: {
                    readHEX: string
                    readBytes: [number]
                    readUTF: string
                }) => {
                },
                //The message what you transfer to bluetooth
                tx: (data: {
                    readHEX: string
                    readBytes: [number]
                    readUTF: string
                }) => {
                },
                //The bluetooth scan callback
                scanBack:(device:{
                    name: string
                    address: string
                    readHEX: string
                    readBytes: number[]
                    readUTF: string
                }[])=>{
                    
                }
            })
                               `, 'language-javascript')}
                                 <h2 class="fs-lg mb-2 fw-normal fw-500 mt-3"><span class="text-danger">Step 4.</span> Run function about BleHelper.</h2>
                               ${doc.codePlace(`            //RequestPermission and callback with result
            bleHelper.requestPermission((response:boolean)=>{})
            
            //Check ble is open or not
            bleHelper.bleIsOpen((response:boolean)=>{})
            
            //Start scan with bluetooth
            bleHelper.startScan((response:boolean)=>{})
            
            //Stop scan with bluetooth
            bleHelper.stopScan((result:boolean)=>{})
            
            //Check is scanning or not
            bleHelper.isDiscovering((result:boolean)=>{})
            
            //Connect to bluetooth
            bleHelper.connect({address:device.address,timeOut:15},(response)=>{})
            
            //Disconnect to bluetooth
            bleHelper.disconnect((result:boolean)=>{})
            
            //Check ble is connect or not
            bleHelper.isConnect((result)=>{})
            
            //Set notify channel
            bleHelper.setNotify('',(result: boolean)=>{})
            
            //writeHex to bluetooth
            bleHelper.writeHex({
                data: data,
                rxChannel: rxChannel,
                txChannel: txChannel
            },(response)=>{})
            
            //writeByteArray to bluetooth
            bleHelper.writeByteArray({
                data: data,
                rxChannel: rxChannel,
                txChannel: txChannel
            },(response)=>{})
            
            //writeUTF to bluetooth
            bleHelper.writeUTF({
                data: data,
                rxChannel: rxChannel,
                txChannel: txChannel
            },(response)=>{})
                               `, 'language-javascript')}
                        </section>`;
                    },
                }
            ];
            return doc.create(`
                    <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4">
                        <div class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3 border-bottom pb-2">
                            <div class="me-4">
                                <h1 class="pb-1">${topTitle.title}</h1>
                                <h2 class="fs-lg mb-2 fw-normal fw-500">${topTitle.subTitle}</h2>
                                ${plugin.support([Type.Android, Type.IOS])}
                            </div>
                        </div>
                        ${(() => {
                let html = '';
                sessions.map((dd) => (html += dd.html));
                return html;
            })()}
                    </div>
                `, doc.asideScroller(sessions), new Items(`Official plugin`, gvc));
        },
        onCreate: () => {
            gallary.addScript();
            doc.addScript();
        },
    };
});
