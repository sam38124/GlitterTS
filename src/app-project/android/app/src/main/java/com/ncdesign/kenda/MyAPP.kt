package proshake.com

import android.R
import android.app.Application
import android.util.Log
import android.view.WindowManager
import android.webkit.WebView
import android.widget.Toast
import com.google.firebase.FirebaseApp
import com.google.firebase.messaging.FirebaseMessaging
import com.jianzhi.glitter.GlitterActivity
import proshake.com.glitter_interface.GetInset


class MyAPP : Application() {
    override fun onCreate() {
        WebView.setWebContentsDebuggingEnabled(true);
        FirebaseApp.initializeApp(this)
        GlitterActivity.setUp("https://proshake.tw", appName = "appData").onCreate {
            it.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

            Thread{
                Thread.sleep(5000)
                FirebaseMessaging.getInstance().token
                    .addOnCompleteListener { task ->
                        if (!task.isSuccessful) {
                            Log.w("MainActivity", "Fetching FCM registration token failed", task.exception)
                            return@addOnCompleteListener
                        }

                        // Get new FCM registration token
                        val token: String = task.result
                        Log.e("firebaseToken", token)
                    }
            }.start()
        }
        GetInset.createShareInterface();

        super.onCreate()
    }
}