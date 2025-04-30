package www.smilebio.io.service


import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.jianzhi.glitter.GlitterActivity
import www.smilebio.io.MyAPP
import www.smilebio.io.R
import java.net.URL


class MyFirebaseMessagingService : FirebaseMessagingService() {
    private val TAG = "MyFirebaseMsgService"
    private val CHANNEL_ID = "shopnex_1"
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // Handle FCM messages here.
        // Not getting messages here? See why this may be: https://goo.gl/39bRNJ
        Log.d(TAG, "From: " + remoteMessage.from)

        // Check if message contains a data payload.
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: " + remoteMessage.data)
        }

        // Check if message contains a notification payload.
        if (remoteMessage.notification != null) {
            Log.d(
                TAG, "Message Notification Body: " + remoteMessage.notification!!
                    .body
            )
        }
        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification()!!.getBody());

            sendNotification(remoteMessage.getNotification()!!.title.toString(), remoteMessage.getNotification()!!
                .body.toString(),remoteMessage.data["link"] as String
            );
        }
        // Handle message within 10 seconds
    }

    override fun onNewToken(token: String) {
        Log.d(TAG, "Refreshed token: $token")

        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // Instance ID token to your app server.
        sendRegistrationToServer(token)
    }

    private fun sendRegistrationToServer(token: String) {
        // Implement this method to send token to your app server.
    }
    private fun sendNotification(title: String, messageBody: String,link:String) {
        val intent = Intent(this, GlitterActivity::class.java)
        intent.putExtra("link",link)
//        if(link.isNotEmpty()){
//            try {
//                GlitterActivity.instance().webRoot.evaluateJavascript("")
//            }catch (e:Exception){
//
//            }
//
//        }

        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE)

        val channelId: String = CHANNEL_ID
        val notificationBuilder: NotificationCompat.Builder =
            NotificationCompat.Builder(this, channelId)
                .setSmallIcon(R.mipmap.ic_launcher_png)
                .setContentTitle(title)
                .setContentText(messageBody)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(pendingIntent)

        val notificationManager =
            getSystemService(NOTIFICATION_SERVICE) as NotificationManager

        // Since Android Oreo, notification channels are needed
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Channel human readable title",
                NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager.createNotificationChannel(channel)
        }

        notificationManager.notify(0,  /* ID of notification */notificationBuilder.build())
    }

    companion object {
        private const val TAG = "MyFirebaseMsgService"
    }
}