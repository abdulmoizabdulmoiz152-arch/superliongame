package com.example

import android.annotation.SuppressLint
import android.content.pm.ActivityInfo
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.weight
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ads.AdManager

class MainActivity : ComponentActivity() {

  private var webView: WebView? = null
  private val bannerVisible: MutableState<Boolean> = mutableStateOf(true)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // Belt-and-suspenders alongside the manifest's android:screenOrientation
    // (which is the primary, reliable lock and takes effect before this
    // even runs) — setting it here too means the lock still holds even if
    // something ever calls setRequestedOrientation elsewhere.
    requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
    enableEdgeToEdge()
    hideSystemUI()

    AdManager.initialize(this)

    setContent {
      Column(
        modifier = Modifier
          .fillMaxSize()
          .background(Color(0xFF060910))
      ) {
        Box(modifier = Modifier.weight(1f)) {
          GameWebView(
            onWebViewCreated = { webView = it },
            activity = this@MainActivity
          )
        }
        // Persistent banner, docked below the game area. Hidden during
        // active gameplay (see WebAppInterface.setBannerVisible, called
        // from the web game's UIManager on screen transitions) so it never
        // sits on top of the HUD or touch controls.
        if (bannerVisible.value) {
          AndroidView(
            factory = { ctx -> AdManager.createBannerAdView(ctx) },
            modifier = Modifier.fillMaxWidth()
          )
        }
      }
    }
  }

  override fun onResume() {
    super.onResume()
    hideSystemUI()
    webView?.onResume()
  }

  override fun onPause() {
    super.onPause()
    webView?.onPause()
  }

  override fun onDestroy() {
    webView?.destroy()
    webView = null
    super.onDestroy()
  }

  @Deprecated("Deprecated in Java")
  override fun onBackPressed() {
    if (webView?.canGoBack() == true) {
      webView?.goBack()
    } else {
      @Suppress("DEPRECATION")
      super.onBackPressed()
    }
  }

  private fun hideSystemUI() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      window.insetsController?.let { controller ->
        controller.hide(WindowInsets.Type.systemBars())
        controller.systemBarsBehavior =
          WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
      }
    } else {
      @Suppress("DEPRECATION")
      window.decorView.systemUiVisibility = (
        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
          or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
          or View.SYSTEM_UI_FLAG_FULLSCREEN
      )
    }
  }

  /**
   * Exposed to the web game as `window.AndroidAds` (see index.html /
   * ads/AdsManager.ts). Every method here can be called from JavaScript
   * inside the WebView; every method that touches UI or Compose state
   * hops back onto the UI thread first, since JS bridge calls arrive on a
   * background thread.
   */
  inner class WebAppInterface {
    @JavascriptInterface
    fun showInterstitial() {
      runOnUiThread {
        AdManager.showInterstitial(this@MainActivity)
      }
    }

    @JavascriptInterface
    fun showRewardedAd() {
      runOnUiThread {
        AdManager.showRewarded(
          this@MainActivity,
          onReward = {
            runOnUiThread {
              webView?.evaluateJavascript(
                "window.onRewardedAdEarned && window.onRewardedAdEarned();",
                null
              )
            }
          },
          onDismissed = {
            runOnUiThread {
              webView?.evaluateJavascript(
                "window.onRewardedAdClosed && window.onRewardedAdClosed();",
                null
              )
            }
          }
        )
      }
    }

    @JavascriptInterface
    fun setBannerVisible(visible: Boolean) {
      runOnUiThread {
        bannerVisible.value = visible
      }
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun GameWebView(
  onWebViewCreated: (WebView) -> Unit,
  activity: MainActivity
) {
  val context = LocalContext.current

  val webView = remember {
    WebView(context).apply {
      settings.apply {
        javaScriptEnabled = true
        domStorageEnabled = true
        databaseEnabled = true
        mediaPlaybackRequiresUserGesture = false
        allowFileAccess = true
        allowContentAccess = true
        loadWithOverviewMode = true
        useWideViewPort = true
        builtInZoomControls = false
        displayZoomControls = false
        cacheMode = WebSettings.LOAD_DEFAULT
      }

      webViewClient = object : WebViewClient() {}
      webChromeClient = object : WebChromeClient() {}

      addJavascriptInterface(activity.WebAppInterface(), "AndroidAds")

      setBackgroundColor(android.graphics.Color.parseColor("#060910"))
      isVerticalScrollBarEnabled = false
      isHorizontalScrollBarEnabled = false

      loadUrl("file:///android_asset/game/index.html")
    }
  }

  DisposableEffect(webView) {
    onWebViewCreated(webView)
    onDispose {
      // Clean up if needed
    }
  }

  AndroidView(
    factory = { webView },
    modifier = Modifier.fillMaxSize()
  )
}
