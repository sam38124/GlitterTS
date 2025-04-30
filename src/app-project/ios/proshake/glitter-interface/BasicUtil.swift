//
//  Interface.swift
//  proshake
//
//  Created by Jianzhi.wang on 2024/6/10.
//

import Foundation
import Glitter_IOS
import AppTrackingTransparency
import SafariServices
class BasicUtil{
    public static func createShareInterface(){
        //Show web view
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "intentWebview", function: {
            request in
            let result=request.receiveValue["url"]
            request.glitterAct.openWeb(string: result as! String)
            request.finish()
        }))
        //SetWebView Home
        GlitterActivity.sharedInterFace.append( JavaScriptInterFace(functionName: "setHome", function: {
            request in
            ViewController.vc?.webView.setParameters("?page=\(request.receiveValue["page"]!)&tag=\(request.receiveValue["page"]!)")
            request.finish()
        }))
        //Close WebView
        GlitterActivity.sharedInterFace.append(
            JavaScriptInterFace(functionName: "closeWebView", function: {
                request in
                request.glitterAct.dismiss(animated: true)
            })
        )
        //SetWebView JS
        GlitterActivity.sharedInterFace.append(
            JavaScriptInterFace(functionName: "execute_main_js", function: {
                request in
                ViewController.vc?.webView.webView?.evaluateJavaScript("""
\(request.receiveValue["js"] as! String)
""")
                request.finish()
            })
        )
        
        GlitterActivity.sharedInterFace.append(
            JavaScriptInterFace(functionName: "is_application", function: {
                request in
                request.responseValue["is_application"]=true;
                request.responseValue["redirect"]=ViewController.redirect
                request.responseValue["device_type"]="ios"
                request.responseValue["bundle_id"]=Bundle.main.bundleIdentifier;
                request.glitterAct.webView!.customUserAgent=ViewController.agent;
                ViewController.redirect="";
                DispatchQueue.main.asyncAfter(deadline: .now()+1.0, execute: {
                    requestTrackingAuthorization();
                })
               
                request.finish();
            })
        )
        
    }
}
func requestTrackingAuthorization() {
    if #available(iOS 14, *) {
        ATTrackingManager.requestTrackingAuthorization { status in
            switch status {
            case .authorized:
                print("✅ 使用者已允許追蹤")
                if((ViewController.vc?.webView.webView) != nil && (!(ViewController.agent).contains("allow_track"))){
                    ViewController.agent+=" allow_track"
                    DispatchQueue.main.async {
                        ViewController.vc!.webView.webView?.customUserAgent=ViewController.agent
                        ViewController.vc!.webView.webView?.reload()
                    }
                }
            case .denied, .restricted, .notDetermined:
                print("🚫 使用者拒絕或尚未決定")
            @unknown default:
                break
            }
        }
    }
}

protocol WebOpenable {
    func openWeb(url: URL)
    func openWeb(string: String?)
}
extension GlitterActivity:WebOpenable{}
extension WebOpenable where Self: UIViewController {
    func openWeb(url: URL) {
        var nav:UINavigationController? = nil
        var par = "?tab"
        if(url.absoluteString.contains("?")){
            par=url.absoluteString.sub(url.absoluteString.distance(of: "?")!..<url.absoluteString.count)
        }
        print("link:\(url.absoluteString)")
        nav = UINavigationController(rootViewController:  GlitterActivity.create(glitterConfig: GlitterActivity.GlitterConfig(parameters:par,projectRout: url ,resourceHook: {webView,navigationAction,decisionHandler in
            decisionHandler(.allow)
        })).also{
            it in
            it.addJavacScriptInterFace(interface: JavaScriptInterFace(functionName: "closeWebView", function: {
                request in
                print("closeWebView:\(url.absoluteString)")
                request.glitterAct.dismiss(animated: true)
            }))
            
            it.glitterConfig.lifeCycle.viewWillAppear={
                //Remove shopify header and footer
            
            }
            it.glitterConfig.lifeCycle.viewWillDisappear={
           
            }
        })
        nav!.modalPresentationStyle = .pageSheet
       if #available(iOS 15.0, *) {
           if let sheet = nav!.sheetPresentationController {
               sheet.detents = [.large()]
               sheet.prefersGrabberVisible = true
//               sheet.prefersScrollingExpandsWhenScrolledToEdge=true
//               sheet.view.superview?.subviews.first(where: { $0 is _UIContextMenuActionsOnlyViewController }) {
//                   grabberView.removeFromSuperview()
//               }

           }
       }
       present(nav!, animated: true, completion: nil)
    }
    func openWeb(string: String?) {
        guard let string = string, let url = URL(string: string) else { return }
        print("webURL:\(url)")
        openWeb(url: url)
    }
}

extension HasApply {
    func also(closure:(Self) -> ()) -> Self {
           closure(self)
           return self
       }
}
protocol HasApply { }

extension NSObject: HasApply { }
