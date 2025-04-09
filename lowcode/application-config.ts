export class ApplicationConfig{
  public static is_application = false;
  public static device_type:"web"|'ios'|'android'='web'
  public static bundle_id=''

  public static initial(glitter:any){
    //判斷是手機版IOS APP選完地圖，通知底層關閉彈跳視窗並跳轉回結帳頁面
    if(glitter.getUrlParameter('select_map_finish')==='true'){
      const redi=new URL(location.href);
      redi.searchParams.delete('select_map_finish');
      glitter.runJsInterFace("execute_main_js",{"js":`location.href="${redi.href}"`},()=>{})
      glitter.runJsInterFace("closeWebView",{},()=>{})

      return  ``
    }
  }
}