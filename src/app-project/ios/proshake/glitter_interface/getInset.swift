//
//  getInset.swift
//  proshake
//
//  Created by Jianzhi.wang on 2023/7/9.
//

import Foundation
import Glitter_IOS
import UIKit

class GetInset{
    public static func createShareInterface(){
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "getTopInset", function: {
            request in
            request.responseValue["data"]=request.glitterAct.safeAreaInsetsTop
            request.finish()
        }))
        //Get top safearea distance
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "getBottomInset", function: {
            request in
            request.responseValue["data"]=request.glitterAct.safeAreaInsetsBottom
            request.finish()
        }))
    }
}

extension UIViewController {
    func presentFullScreen(_ viewControllerToPresent: UIViewController, animated flag: Bool, completion: (() -> Void)? = nil) {
        viewControllerToPresent.modalPresentationStyle = .fullScreen
        present(viewControllerToPresent, animated: flag, completion: completion)
    }

    var topbarHeight: CGFloat {
        return safeAreaInsetsTop + (navigationController?.navigationBar.frame.height ?? 0.0)
    }
    var toolbarHeight: CGFloat {
        return  safeAreaInsetsBottom + (navigationController?.toolbar.frame.height ?? 0.0)
    }
    
    var safeAreaInsetsTop: CGFloat {
        return  (ViewController.vc?.view.safeAreaInsets.top ?? 0.0)
    }
    
    
    var safeAreaInsetsBottom: CGFloat {
        return  (ViewController.vc?.view.safeAreaInsets.bottom ?? 0.0)
    }
    
}
