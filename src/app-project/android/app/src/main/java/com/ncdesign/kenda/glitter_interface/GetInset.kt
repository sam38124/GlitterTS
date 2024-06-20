package com.ncdesign.kenda.glitter_interface

import com.jianzhi.glitter.GlitterActivity
import com.jianzhi.glitter.JavaScriptInterFace

class GetInset {
    companion object{
        fun createShareInterface(){
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("getTopInset") {
                it.responseValue["data"]=0
                it.fin()
            })
            GlitterActivity.addJavacScriptInterFace(JavaScriptInterFace("getBottomInset") {
                it.responseValue["data"]=0
                it.fin()
            })
        }
    }
}