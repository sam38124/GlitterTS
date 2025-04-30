"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IosProject = void 0;
class IosProject {
    static getViewController(domain) {
        return `//
//  ViewController.swift
//  proshake
//
//  Created by Jianzhi.wang on 2023/7/9.
//
import SnapKit
import UIKit
import Glitter_IOS
import FirebaseMessaging
import WebKit


class ViewController: UIViewController {
    
    public static var vc:ViewController? = nil
    public static var redirect:String = ""
    public static var agent="iosGlitter Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1"
    public let webView = GlitterActivity.create(glitterConfig: GlitterActivity.GlitterConfig(parameters:"?a=1",projectRout: URL(string: "${domain}/index-app")! )).initWkWebView()
    override func viewDidLoad() {
        webView.webView!.allowsBackForwardNavigationGestures = true;
        NotificationCenter.default.addObserver(self, selector: #selector(keyBoardWillShow(notification:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyBoardWillHide(notification:)), name: UIResponder.keyboardWillHideNotification, object: nil)
        ViewController.vc=self
      
        self.view.backgroundColor = .white
        
        webView.webView!.customUserAgent=ViewController.agent
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



`;
    }
}
exports.IosProject = IosProject;
//# sourceMappingURL=ios-project.js.map