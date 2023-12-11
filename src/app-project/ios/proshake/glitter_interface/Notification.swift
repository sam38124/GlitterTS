//
//  notification.swift
//  proshake
//
//  Created by Jianzhi.wang on 2023/7/9.
//

import Foundation
import Glitter_IOS
import FirebaseMessaging
class Notification{
    
    public static func createShareInterface(){
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "regNotification", function: {
            request in
            print("註冊推播主題")
            // 註冊推播主題
            Messaging.messaging().subscribe(toTopic: "\(request.receiveValue["topic"] ?? "")") { error in
                if let error = error {
                    print("無法註冊推播主題: \(error.localizedDescription)")
                } else {
                    print("成功註冊推播主題:\(request.receiveValue["topic"] ?? "")")
                }
            }
        }))
       
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "getFireBaseToken", function: {
            request in
            request.responseValue["token"]=AppDelegate.fireBaseToken
            request.finish()
        }))
        
        //
        
        GlitterActivity.sharedInterFace.append(JavaScriptInterFace(functionName: "deleteFireBaseToken", function: {
            request in
            Messaging.messaging().deleteData(completion: {
                error in
            })
            request.finish()
        }))

    }
    
}
