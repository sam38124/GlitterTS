package www.smilebio.io.glitter_interface


import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ImageView
import androidx.core.content.ContextCompat.startActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.common.api.ApiException
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.jianzhi.glitter.GlitterActivity
import com.jianzhi.glitter.GlitterActivity.ResultCallBack
import com.jianzhi.glitter.JavaScriptInterFace
import com.jianzhi.glitter.RequestFunction
import com.linecorp.linesdk.LineApiResponseCode
import com.linecorp.linesdk.auth.LineLoginApi
import www.smilebio.io.R


//import com.sunmi.scanner.IScanInterface
class BasicInterface {
    companion object {
        var requestFunction: RequestFunction? = null

        @SuppressLint("SetJavaScriptEnabled")
        fun createShareInterface() {

            val handler = Handler(Looper.getMainLooper())
            var tokenId: String? = null
            GlitterActivity.addActivityResult(object : ResultCallBack {
                override fun resultBack(requestCode: Int, resultCode: Int, data: Intent?) {
                    if (requestCode == 2012) {
                        requestFunction!!.responseValue["result"] = true
                        tokenId = data?.getStringExtra("tokenId")
                        requestFunction!!.finish()
                    } else if (requestCode == ThirdPartyCode.google) {
                        val extras = data!!.extras
                        if (extras != null) {
                            for (key in extras.keySet()) {
                                val value = extras.get(key)
                                Log.d("IntentExtra", "Key: $key, Value: $value")
                            }
                        } else {
                            Log.d("IntentExtra", "No extras found.")
                        }
                        val task = GoogleSignIn.getSignedInAccountFromIntent(data)
                        try {
                            val account = task.getResult(ApiException::class.java)!!
                            requestFunction!!.responseValue["code"] = account.idToken!!
                            requestFunction!!.responseValue["result"] = true
                            requestFunction!!.finish()
                        } catch (e: ApiException) {
                            Log.w("Login", "Google sign in failed", e)
                        }
                    } else if (requestCode == ThirdPartyCode.line) {
                        val result = LineLoginApi.getLoginResultFromIntent(data)

                        when (result.responseCode) {
                            LineApiResponseCode.SUCCESS -> {
                                // Login successful
                                val accessToken = result.lineIdToken;
                                requestFunction!!.responseValue["code"] = accessToken!!.rawString;
                                requestFunction!!.responseValue["result"] = true
                                requestFunction!!.finish()
                            }

                            LineApiResponseCode.CANCEL ->             // Login canceled by user
                                Log.e("ERROR", "LINE Login Canceled by user.")

                            else -> {
                                // Login canceled due to other error
                                Log.e("ERROR", "Login FAILED!")
                                Log.e("ERROR", result.errorData.toString())
                            }
                        }
                    }

                }
            })
            //信用卡付款
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("credit_card") {
                val intent = Intent()
                intent.setClassName("com.nccc.ncccsoftpos", "com.nccc.ncccsoftpos.base.MainActivity")
                intent.setAction("payment")
                intent.putExtra("passcode", it.receiveValue["pwd"].toString())
                intent.putExtra("memo", it.receiveValue["memo"].toString())
                intent.putExtra("amount", it.receiveValue["amount"].toString())
                if (tokenId != null) {
                    intent.putExtra("tokenId", tokenId.toString())
                }

                GlitterActivity.instance().startActivityForResult(intent, 2012)
                requestFunction = it
            })
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("pos-device") {
                it.responseValue["deviceType"] = Build.MANUFACTURER
                it.finish()
            })
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("intentWebview") {

                handler.post {
                    val bottomSheetDialog = BottomSheetDialog(GlitterActivity.instance())
                    val view: View = GlitterActivity.instance().layoutInflater.inflate(R.layout.web_view, null);
                    bottomSheetDialog.setContentView(view)
                    val webView = bottomSheetDialog.findViewById<WebView>(R.id.web_view)!!
                    webView.settings.javaScriptEnabled = true
                    webView.settings.domStorageEnabled = true;
                    webView.webViewClient = WebViewClient()
                    webView.loadUrl(it.receiveValue["url"].toString());
                    bottomSheetDialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED // 初始狀態
                    // 設置行為僅支持全開（STATE_EXPANDED）和隱藏（STATE_HIDDEN）
                    bottomSheetDialog.behavior.addBottomSheetCallback(object :
                        BottomSheetBehavior.BottomSheetCallback() {
                        override fun onStateChanged(bottomSheet: View, newState: Int) {
                            if (newState != BottomSheetBehavior.STATE_EXPANDED) {
                                // 強制隱藏狀態
                                bottomSheetDialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED
                            }
                        }

                        override fun onSlide(bottomSheet: View, slideOffset: Float) {
                            // 可選：在滑動時做其他事情
                        }
                    })
                    bottomSheetDialog.show()
                    bottomSheetDialog.findViewById<ImageView>(R.id.close)!!.setOnClickListener {
                        bottomSheetDialog.dismiss()
                    }
                }


            })
        }
    }
}