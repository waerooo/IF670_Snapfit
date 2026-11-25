package com.posedetectiongame

import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.pose.Pose
import com.google.mlkit.vision.pose.PoseDetection
import com.google.mlkit.vision.pose.PoseDetector
import com.google.mlkit.vision.pose.defaults.PoseDetectorOptions
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

class MLKitPoseDetectionModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var poseDetector: PoseDetector? = null

    private fun getDetector(): PoseDetector {
        if (poseDetector == null) {
            val options = PoseDetectorOptions.Builder()
                .setDetectorMode(PoseDetectorOptions.STREAM_MODE)
                .build()
            poseDetector = PoseDetection.getClient(options)
        }
        return poseDetector!!
    }

    override fun getName(): String = "MLKitPoseDetection"

    @ReactMethod
    fun detectPose(imageUriStr: String, promise: Promise) {
        try {
            val uri = if (imageUriStr.startsWith("file://") || imageUriStr.startsWith("content://")) {
                Uri.parse(imageUriStr)
            } else {
                Uri.fromFile(File(imageUriStr))
            }

            val inputImage = InputImage.fromFilePath(reactContext, uri)
            processImage(inputImage, promise)
        } catch (e: Exception) {
            promise.reject("INPUT_ERROR", e.message ?: "Failed to load image from URI", e)
        }
    }

    @ReactMethod
    fun detectPoseFromBase64(base64Str: String, promise: Promise) {
        try {
            val cleanBase64 = if (base64Str.contains(",")) {
                base64Str.substringAfter(",")
            } else {
                base64Str
            }
            val imageBytes = Base64.decode(cleanBase64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
                ?: return promise.reject("DECODE_ERROR", "Failed to decode base64 image")

            val inputImage = InputImage.fromBitmap(bitmap, 0)
            processImage(inputImage, promise)
        } catch (e: Exception) {
            promise.reject("INPUT_ERROR", e.message ?: "Failed to process base64", e)
        }
    }

    private fun processImage(inputImage: InputImage, promise: Promise) {
        val width = inputImage.width.toFloat().coerceAtLeast(1f)
        val height = inputImage.height.toFloat().coerceAtLeast(1f)

        getDetector().process(inputImage)
            .addOnSuccessListener { pose: Pose ->
                val landmarks = pose.allPoseLandmarks
                if (landmarks.isEmpty()) {
                    promise.resolve(null)
                    return@addOnSuccessListener
                }

                val jsonResult = JSONObject()
                val landmarksArray = JSONArray()

                for (landmark in landmarks) {
                    val lmObj = JSONObject()
                    lmObj.put("type", landmark.landmarkType)
                    lmObj.put("x", (landmark.position.x / width).toDouble())
                    lmObj.put("y", (landmark.position.y / height).toDouble())
                    lmObj.put("z", landmark.position3D.z.toDouble())
                    lmObj.put("likelihood", landmark.inFrameLikelihood.toDouble())
                    landmarksArray.put(lmObj)
                }

                jsonResult.put("landmarks", landmarksArray)
                jsonResult.put("timestamp", System.currentTimeMillis())

                promise.resolve(jsonResult.toString())
            }
            .addOnFailureListener { e ->
                promise.reject("DETECTION_ERROR", e.message ?: "Pose detection failed", e)
            }
    }

    @ReactMethod
    fun release(promise: Promise) {
        try {
            poseDetector?.close()
            poseDetector = null
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("RELEASE_ERROR", e.message ?: "Failed to release detector", e)
        }
    }
}
