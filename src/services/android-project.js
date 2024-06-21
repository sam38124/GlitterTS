"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidProject = void 0;
class AndroidProject {
    static appKt(domain) {
        return `package com.ncdesign.kenda

import android.R
import android.app.Application
import android.util.Log
import android.view.WindowManager
import android.webkit.WebView
import android.widget.Toast
import com.google.firebase.messaging.FirebaseMessaging
import com.jianzhi.glitter.GlitterActivity
import com.ncdesign.kenda.glitter_interface.GetInset


class MyAPP : Application() {
    override fun onCreate() {
        WebView.setWebContentsDebuggingEnabled(true);
        GlitterActivity.setUp("https://${domain}", appName = "appData").onCreate {
            it.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
        GetInset.createShareInterface()
        FirebaseMessaging.getInstance().getToken()
            .addOnCompleteListener { task ->
                if (!task.isSuccessful) {
                    Log.w("MainActivity", "Fetching FCM registration token failed", task.getException())
                    return@addOnCompleteListener
                }

                // Get new FCM registration token
                val token: String = task.result
                Log.e("firebaseToken", token)
            }
        super.onCreate()
    }
}`;
    }
}
exports.AndroidProject = AndroidProject;
//# sourceMappingURL=android-project.js.map