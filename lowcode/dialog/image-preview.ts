import {init} from "../glitterBundle/GVController.js";

init((gvc, glitter, gBundle)=>{
    glitter.addMtScript([{src:`https://kit.fontawesome.com/02e2dc09e3.js`}],()=>{},()=>{})
    return {

        onCreateView:()=>{
            const id=glitter.getUUID()
            const hd=glitter.getUUID()
            return `<div class="vw-100 vh-100 d-flex align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.5);">
<div id="${hd}" style="height:50px;right:0;top:0;background-color: rgba(0,0,0,0.8);" class="position-absolute d-flex align-items-center justify-content-center" >
<button class="btn-dark btn ms-2" onclick="${gvc.event((e, event)=>{
                $('#'+hd).addClass('d-none')
                window.print();
                $('#'+hd).removeClass('d-none')

                // var myWindow:any = window.open('', 'PRINT', 'height=400,width=600');
                // myWindow.document.write('<html><head><title>' + document.title + '</title>');
                // myWindow.document.write('</head><body>');
                // myWindow.document.write(myImage.outerHTML);
                // myWindow.document.write('</body></html>');
                // myWindow.document.close(); // necessary for IE >= 10
                // myWindow.focus(); // necessary for IE >= 10
                // myWindow.print();
                // myWindow.close();
                
            })}">列印</button>
<div class="btn d-flex align-items-center justify-content-center" style="width:50px;height:50px;background-color: rgba(0,0,0,0.8);" onclick="${gvc.event(() => {
                gvc.closeDialog()
            })}">
<i class="fa-solid fa-xmark " style="color:white;"></i>
</div>
</div>
<div id="${id}"><img style="max-width: 100%;max-height: 100%;" src="${gBundle}" ></div>
</div>`
        }
    }
})