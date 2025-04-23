import UIKit
import AppTrackingTransparency
import Glitter_IOS
import Firebase
import UserNotifications
import FirebaseMessaging
import FacebookCore
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate,UNUserNotificationCenterDelegate {
    public static var fireBaseToken=""
    

    func application(_ app: UIApplication,
                     open url: URL,
                     options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {

        // 解析參數
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        let queryItems = components?.queryItems
        print(queryItems);
        if let path = queryItems?.first(where: { $0.name == "path" })?.value {
            ViewController.redirect=path
            if((ViewController.vc != nil) && (ViewController.vc?.webView != nil) && (ViewController.vc?.webView.webView != nil)){
                ViewController.vc!.webView.webView!.evaluateJavaScript("""
    location.href=new URL("\(ViewController.redirect)",location.href)
    """)
                ViewController.redirect=""
            }
        }

        return true
    }
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        Notification.createShareInterface()
        GetInset.createShareInterface()
        BasicUtil.createShareInterface()
        FirebaseApp.configure();
        Ecommerce.createShareInterface()
        
        
        //註冊推播
        Messaging.messaging().delegate = self
        if #available(iOS 10.0, *) {
            // For iOS 10 display notification (sent via APNS)
            UNUserNotificationCenter.current().delegate = self
            
            let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
            UNUserNotificationCenter.current().requestAuthorization(
                options: authOptions,
                completionHandler: {_, _ in
                    DispatchQueue.main.asyncAfter(deadline: .now()+1.0, execute: {
                        if #available(iOS 14, *) {
                            ATTrackingManager.requestTrackingAuthorization { status in
                                switch status {
                                case .authorized:
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
                    })
                    
                })
        } else {
            let settings: UIUserNotificationSettings =
            UIUserNotificationSettings(types: [.alert, .badge, .sound], categories: nil)
            application.registerUserNotificationSettings(settings)
        }
        application.registerForRemoteNotifications()
        let settings = UIUserNotificationSettings(types: [.sound, .alert, .badge], categories: nil)
        application.registerUserNotificationSettings(settings)
        ApplicationDelegate.shared.application(
            application,
            didFinishLaunchingWithOptions: launchOptions
        )
        
    

        return true
    }
    
    // 接收設備的推播註冊碼
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        print("Device Token:", token)
        // 將 deviceToken 上傳到您的伺服器，以便將來向該設備發送推播
        Messaging.messaging().apnsToken = deviceToken
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        Messaging.messaging().appDidReceiveMessage(userInfo)
        print("收到推送通知（前台）：\(userInfo)")
        // 自訂處理推播通知的內容和操作
        completionHandler(UIBackgroundFetchResult.newData)
    }
    
}
extension AppDelegate {
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        let userInfo = notification.request.content.userInfo
        
        // 自訂推播通知的顯示方式
        completionHandler([.alert, .badge, .sound])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        print("點擊推播通知：\(userInfo["link"] )")
        ViewController.redirect=userInfo["link"] as! String
        if(userInfo["link"] != nil){
            if((ViewController.vc != nil) && ViewController.vc!.webView.webView != nil){
                ViewController.vc!.webView.webView!.evaluateJavaScript("""
glitter.href="\(ViewController.redirect)";
""")
            }
        }
        completionHandler()
    }
}
extension AppDelegate : MessagingDelegate {
    // [START refresh_token]
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("Firebase registration token: \(fcmToken)")
        AppDelegate.fireBaseToken=fcmToken ?? ""
    }
    
}
