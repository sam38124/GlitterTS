package com.ncdesign.kenda

import android.app.Application
import android.view.WindowManager
import android.webkit.WebView
import com.jianzhi.glitter.GlitterActivity


class MyAPP : Application() {
    override fun onCreate() {
        WebView.setWebContentsDebuggingEnabled(true);
        GlitterActivity.setUp("file:///android_asset/src", appName = "appData").onCreate {
            it.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
        super.onCreate()
    }
}