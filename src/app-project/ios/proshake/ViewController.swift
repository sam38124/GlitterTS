//
//  ViewController.swift
//  proshake
//
//  Created by Jianzhi.wang on 2023/7/9.
//
import SnapKit
import UIKit
import Glitter_IOS
import FirebaseMessaging
class ViewController: UIViewController {
    
    public static var vc:ViewController? = nil
    public static var redirect:String = ""
    public let webView = GlitterActivity.create(glitterConfig: GlitterActivity.GlitterConfig(parameters:"?page=index",projectRout: URL(string: "https://proshake.tw/index")! )).initWkWebView()
//    public let webView = GlitterActivity.create(glitterConfig: GlitterActivity.GlitterConfig(parameters:"?page=index",projectRout: Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "GlitterUI")! )).initWkWebView()
    override func viewDidLoad() {
        webView.webView!.allowsBackForwardNavigationGestures = true;
        NotificationCenter.default.addObserver(self, selector: #selector(keyBoardWillShow(notification:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyBoardWillHide(notification:)), name: UIResponder.keyboardWillHideNotification, object: nil)
        ViewController.vc=self
        if(ViewController.redirect != ""){
            webView.webView!.evaluateJavaScript("""
location.href=new URL("\(ViewController.redirect)",location.href)
""")
        }
        super.viewDidLoad()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        self.view.addSubview(self.webView.view)
    }
    
    @objc func keyBoardWillShow(notification: NSNotification) {
        print("keyBoardWillShow")
    }
    
    @objc func keyBoardWillHide(notification: NSNotification) {
        print("keyBoardWillHide")
        self.addChild(viewController: webView,to: view)
    }
    
}

extension UIViewController {
    func addChild(viewController: UIViewController, to view: UIView) {
        addChild(viewController)
        view.addSubview(viewController.view)
        viewController.view.snp.makeConstraints { make in
            make.edges.equalToSuperview()
        }
        viewController.didMove(toParent: self)
    }
    
    func addChild_noconstraints(viewController: UIViewController, to view: UIView) {
        addChild(viewController)
        view.addSubview(viewController.view)
        viewController.didMove(toParent: self)
    }
    
    func removeChild(child: UIViewController) {
        child.willMove(toParent: nil)
        child.view.removeFromSuperview()
        child.removeFromParent()
    }
}
