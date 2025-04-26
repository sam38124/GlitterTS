"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidProject = void 0;
class AndroidProject {
    static appKt(package_name, domain) {
        return `package ${package_name}

import android.annotation.SuppressLint
import android.app.Application
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.KeyEvent
import android.view.Window
import android.view.WindowManager
import android.webkit.WebView
import android.widget.Toast
import com.google.firebase.FirebaseApp
import com.google.firebase.messaging.FirebaseMessaging
import com.jianzhi.glitter.GlitterActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import www.smilebio.io.glitter_interface.BasicInterface
import www.smilebio.io.glitter_interface.Ecommerce
import www.smilebio.io.glitter_interface.GetInset
import www.smilebio.io.glitter_interface.Notification


class MyAPP : Application() {
    companion object {
        val handler = Handler(Looper.getMainLooper())
        fun getWebViewVersion(): String {
            return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                WebView.getCurrentWebViewPackage()?.versionName ?: "Unknown"
            } else {
                "API level too low to retrieve WebView version"
            }
        }

        @SuppressLint("ClickableViewAccessibility")
        fun setGlitterView(url: String = "https://${domain}") {
            Log.e("getWebViewVersion", getWebViewVersion())
            GlitterActivity.setUp(url, appName = "appData").onCreate { it ->
                //退播通知跳轉
                val data = it.intent.extras
                data?.keySet()?.forEach { key ->
                    val value = data.getString(key)
                    if (key == "link") {
                        Ecommerce.redirect = value!!;
                    }
                    Log.d("FCM_CLICK", "key=$key, value=$value")
                }
                //站內購深度連結
                val data2: Uri? = it.intent?.data
                data2?.let {
                    val path = it.getQueryParameter("path")
                    if (path != null) {
                        Ecommerce.redirect = path;
                        Log.d("DEEP_LINK", "path = $path")
                    }
                }
                FirebaseApp.initializeApp(it)
                val apps = FirebaseApp.getApps(it)
                apps.map {
                    Log.e("firease_apps", it.name)
                }
                // 设置自定义的按键事件回调
                val originalCallback = it.window.callback
                var inputBuffer = StringBuilder() // 用于存储用户输入的内容
                val scope = CoroutineScope(Job())
                var job: Job? = null
                it.window.callback = object : Window.Callback by originalCallback {
                    override fun dispatchKeyEvent(event: KeyEvent?): Boolean {
                        if (event?.action == KeyEvent.ACTION_DOWN) {
                            val inputChar = event.getUnicodeChar(event.metaState).toChar() // 获取对应的字符
                            if (inputChar != '\u0000') { // 如果是有效字符
                                inputBuffer.append(inputChar) // 将字符添加到缓冲区中
                                if (job != null) {
                                    job?.cancel()
                                }
                                job = scope.launch {

                                    delay(500)
                                    handler.post {
                                        it.webRoot.evaluateJavascript(
                                            """
                                    glitter.share._scanBack("\${inputBuffer.toString().replace("\\n", "")}");
                                """, null
                                        );
                                        inputBuffer = StringBuilder()
                                    }
                                }
                            }

                            // 处理删除键（Backspace）
                            if (event.keyCode == KeyEvent.KEYCODE_DEL && inputBuffer.isNotEmpty()) {
                                inputBuffer.deleteCharAt(inputBuffer.length - 1)
                            }

                            // 返回输入内容作为字符串
                            return true // 表示事件已处理，不继续往下分发

                        }
                        return originalCallback.dispatchKeyEvent(event)
                    }
                }
                //SUNMI的POS機器
                Log.e("Build.MANUFACTURER", Build.MANUFACTURER)
                it.webRoot.loadUrl(url)
                it.getPermission(
                    arrayOf(
                        "android.permission.POST_NOTIFICATIONS",
                    ), object : GlitterActivity.permission_C {
                        override fun requestFalse(a: String) {

                        }

                        override fun requestSuccess(a: String) {
                            try {
                                FirebaseMessaging.getInstance().token
                                    .addOnCompleteListener { task ->
                                        if (!task.isSuccessful) {
                                            Log.w(
                                                "MainActivity",
                                                "Fetching FCM registration token failed",
                                                task.exception
                                            )
                                            return@addOnCompleteListener
                                        }

                                        // Get new FCM registration token
                                        val token: String = task.result
                                        Log.e("firebaseToken", token)
                                    }

                            } catch (e: Exception) {

                            }

                        }
                    }
                )


                it.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        }

        private fun extractWebViewVersion(userAgentString: String): String? {
            val versionRegex = "Version/([0-9\\.]+)".toRegex()
            val matchResult = versionRegex.find(userAgentString)
            return matchResult?.groupValues?.get(1)
        }
    }

    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
        WebView.setWebContentsDebuggingEnabled(true);
        GlitterActivity.setUp("https://www.smilebio.com", appName = "appData").onCreate {
            it.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
        setGlitterView()
        //加載底層API
        Ecommerce.createShareInterface()
        GetInset.createShareInterface();
        Notification.createShareInterface()
        BasicInterface.createShareInterface()

    }
}`;
    }
}
exports.AndroidProject = AndroidProject;
//# sourceMappingURL=android-project.js.map