"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidProject = void 0;
var AndroidProject = /** @class */ (function () {
    function AndroidProject() {
    }
    AndroidProject.appKt = function (domain) {
        return "package com.ncdesign.kenda\n\nimport android.R\nimport android.app.Application\nimport android.util.Log\nimport android.view.WindowManager\nimport android.webkit.WebView\nimport android.widget.Toast\nimport com.google.firebase.messaging.FirebaseMessaging\nimport com.jianzhi.glitter.GlitterActivity\nimport com.ncdesign.kenda.glitter_interface.GetInset\n\n\nclass MyAPP : Application() {\n    override fun onCreate() {\n        WebView.setWebContentsDebuggingEnabled(true);\n        GlitterActivity.setUp(\"https://".concat(domain, "\", appName = \"appData\").onCreate {\n            it.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)\n        }\n        GetInset.createShareInterface()\n        FirebaseMessaging.getInstance().getToken()\n            .addOnCompleteListener { task ->\n                if (!task.isSuccessful) {\n                    Log.w(\"MainActivity\", \"Fetching FCM registration token failed\", task.getException())\n                    return@addOnCompleteListener\n                }\n\n                // Get new FCM registration token\n                val token: String = task.result\n                Log.e(\"firebaseToken\", token)\n            }\n        super.onCreate()\n    }\n}");
    };
    return AndroidProject;
}());
exports.AndroidProject = AndroidProject;
