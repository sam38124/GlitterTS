//
//  Ecommerce.swift
//  proshake
//
//  Created by Jianzhi.wang on 2024/10/16.
//

import Foundation
import Glitter_IOS
import GoogleSignIn
import FacebookLogin
import LineSDKObjC
class Ecommerce{
    public static var checkOutInstance:RequestFunction? = nil
    
    public static func createShareInterface(){
        
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "toCheckout", function: {
            request in
            checkOutInstance=request
            let htmlContent = """
            <!DOCTYPE html>
            <html lang="zh-TW">
            <head>
             <meta charset="UTF-8">
                <title>My HTML Page</title>
            </head>
            <body>
               <div id="ddd" style="display: none;">\(request.receiveValue["form"] as! String)</div>
            <script>
            document.querySelector(`#ddd #submit`).click();
            </script>
            </body>
            </html>
            """
            // 函数：创建HTML文件
            func createHTMLFile() -> URL? {
                // 获取用户的文档目录
                let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
                // 创建文件路径
                let fileURL = documentsDirectory.appendingPathComponent("checkout.html")
                
                do {
                    // 将HTML内容写入磁盘
                    try htmlContent.write(to: fileURL, atomically: true, encoding: .utf8)
                    return fileURL
                } catch {
                    print("Error writing HTML to file: \(error)")
                    return nil
                }
            }
            // 创建HTML文件并在浏览器中打开
            if let fileURL = createHTMLFile() {
                request.glitterAct.openWeb(string: fileURL.absoluteString)
            } else {
                print("Failed to create HTML file.")
            }
            
        }))
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "check_out_finish", function: {
            request in
            request.glitterAct.dismiss(animated: true)
            Ecommerce.checkOutInstance?.finish()
        }))
        
        
        //Google登入
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "google_login", function: {
            request in
            
            // 配置 Google Sign-In
            let config = GIDConfiguration(clientID: request.receiveValue["app_id"] as! String)
            GIDSignIn.sharedInstance.configuration=config
            // 調用 Google Sign-In 頁面
            GIDSignIn.sharedInstance.signIn(withPresenting: ViewController.vc!) { user, error in
                if(error == nil ){
                    // 取得 Google 使用者的資訊
                    let idToken=user?.user.idToken?.tokenString
                    request.responseValue["code"]=idToken
                    request.responseValue["result"]=true
                    request.finish()
                    // 使用者成功登入，這裡可以處理登入後的邏輯
                    print("ID Token: \(idToken!)")
                }
            }
        }))
        
        //Facebook登入
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "facebook_login", function: {
            request in
            let loginManager = LoginManager()
            loginManager.logIn(permissions: ["public_profile", "email"], from: request.glitterAct) { result, error in
                if let error = error {
                    print("Error during login: \(error.localizedDescription)")
                    return
                }
                
                // 檢查登入結果
                guard let result = result, !result.isCancelled else {
                    print("User cancelled login.")
                    return
                }
                
                // 登入成功，並且 token 已生成
                if let token = AccessToken.current {
                    print("Access Token: \(token.tokenString)")
                    // 調用取得用戶資料的方法
                    request.responseValue["accessToken"]=token.tokenString
                    request.responseValue["result"]=true
                    request.finish()
                }
            }
        }))
        
        //Line登入
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "line_login", function: {
            request in
            LoginManager.shared.setup(channelID: request.receiveValue["id"] as! String, universalLinkURL: nil)
            LoginManager.shared.login(permissions: [.profile , .email , .openID], in: request.glitterAct) {
                result in
                print("channelID==>\(request.receiveValue["id"])")
                switch result {
                case .success(let loginResult):
                    request.responseValue["code"]=loginResult.accessToken.IDTokenRaw
                    request.responseValue["result"]=true
                    request.finish()
                    break
                case .failure(let error):
                    print(error)
                    break
                }
                
            }
        }))
        
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "intent_url", function: {
            request in
            if let url = URL(string: request.receiveValue["url"] as! String) {
                if UIApplication.shared.canOpenURL(url) {
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                } else {
                    print("無法開啟此 URL，請確認 LINE 是否已安裝")
                }
            }
        }))
    }
}
