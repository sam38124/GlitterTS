package www.smilebio.io.glitter_interface

import android.util.Log
import com.google.firebase.messaging.FirebaseMessaging
import com.jianzhi.glitter.GlitterActivity
import com.jianzhi.glitter.JavaScriptInterFace

class Notification {
    companion object{
        fun createShareInterface(){
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("regNotification") {
                FirebaseMessaging.getInstance().subscribeToTopic(it.receiveValue["topic"] as String)
                it.fin()
            })
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("getFireBaseToken") {
                try {
                    Log.e("getFireBaseToken","start")
                    FirebaseMessaging.getInstance().token
                        .addOnCompleteListener { task ->

                            if (!task.isSuccessful) {
                                Log.w("MainActivity", "Fetching FCM registration token failed", task.exception)
                                it.responseValue["token"]=""
                                it.fin()
                                return@addOnCompleteListener
                            }

                            // Get new FCM registration token
                            val token: String = task.result
                            Log.e("token","token->${token}")
                            it.responseValue["token"]=token
                            it.fin()
                        }

                }catch (e:Exception){
Log.e("getFireBaseToken",e.toString())
                }

            })
        }
    }
}