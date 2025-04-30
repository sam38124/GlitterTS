package www.smilebio.io.glitter_interface

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.app.ActivityCompat.startActivityForResult
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.jianzhi.glitter.GlitterActivity
import com.jianzhi.glitter.JavaScriptInterFace
import com.linecorp.linesdk.Scope
import com.linecorp.linesdk.auth.LineAuthenticationParams
import com.linecorp.linesdk.auth.LineLoginApi
import www.smilebio.io.glitter_interface.BasicInterface.Companion.requestFunction
import java.util.*


class ThirdPartyCode{
    companion object{
        val google=2;
        val facebook=3;
        val apple=4;
        val line=5;
    }
}
class Ecommerce {
    companion object {
        public var redirect=""
        @SuppressLint("SetJavaScriptEnabled")
        fun createShareInterface() {
            val handler = Handler(Looper.getMainLooper())
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("is_application") {
                handler.post {
                    it.responseValue["is_application"] = true
                    it.responseValue["redirect"] = true
                    it.responseValue["device_type"] = "android"
//                    request.responseValue["redirect"] = ViewController.redirect
                    it.responseValue["redirect"]= redirect
                    it.responseValue["bundle_id"] = GlitterActivity.instance().packageName;
                    redirect =""
                    it.finish();
                }
            })

            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("intent_url") {

                handler.post {
                    val url = it.receiveValue["url"].toString()
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    GlitterActivity.instance().startActivity(intent)
                }
            })



            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("google_login") {
                handler.post {
                    Log.e("google_login_id",it.receiveValue["app_id"].toString())
                    val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                        .requestIdToken(it.receiveValue["app_id"].toString())
                        .requestEmail()
                        .build()
                    BasicInterface.requestFunction=it
                    val googleSignInClient = GoogleSignIn.getClient(GlitterActivity.instance(), gso)
                    GlitterActivity.instance().startActivityForResult(googleSignInClient.signInIntent, ThirdPartyCode.google)
                }
            })
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("line_login") {
                handler.post {
                    try {
                        // App-to-app login
                        val loginIntent: Intent = LineLoginApi.getLoginIntent(
                            GlitterActivity.instance(),
                            it.receiveValue["id"].toString(),
                            LineAuthenticationParams.Builder()
                                .scopes(Arrays.asList(Scope.PROFILE,Scope.OC_EMAIL,Scope.OPENID_CONNECT)) // .nonce("<a randomly-generated string>") // nonce can be used to improve security
                                .build()
                        )
                        requestFunction = it
                        GlitterActivity.instance().startActivityForResult(loginIntent, ThirdPartyCode.line)
                    } catch (e: Exception) {
                        Log.e("ERROR", e.toString())
                    }
                }
            })
        }
    }
}