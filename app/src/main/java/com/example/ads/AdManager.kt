package com.example.ads

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

/**
 * Thin wrapper around the Google Mobile Ads SDK for all three ad formats
 * this game uses:
 *  - Banner: a persistent AdView, shown in MainActivity's Compose layout
 *    alongside the game WebView (docked at the bottom, hidden during active
 *    gameplay so it doesn't sit on top of the HUD).
 *  - Interstitial: full-screen ad, auto-shown on Game Over and Level
 *    Complete, triggered from the web game via MainActivity's JS bridge.
 *  - Rewarded: full-screen ad the player opts into for a bonus (extra
 *    coins), also triggered from the web game via the JS bridge.
 *
 * IMPORTANT -- ad unit IDs below are Google's PUBLIC TEST IDs. They only
 * ever serve clearly-labeled test ads and are safe to ship during
 * development, but they earn no real revenue. Before a real release,
 * replace every ID below (and the AndroidManifest's APPLICATION_ID) with
 * your own from https://apps.admob.com.
 */
object AdManager {
  private const val TAG = "AdManager"

  const val BANNER_AD_UNIT_ID = "ca-app-pub-3940256099942544/6300978111"
  const val INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712"
  const val REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917"

  private var initialized = false
  private var interstitialAd: InterstitialAd? = null
  private var rewardedAd: RewardedAd? = null

  fun initialize(context: Context) {
    if (initialized) return
    initialized = true
    MobileAds.initialize(context) {
      Log.d(TAG, "Mobile Ads SDK initialized")
    }
    loadInterstitial(context)
    loadRewarded(context)
  }

  fun createBannerAdView(context: Context): AdView {
    val adView = AdView(context)
    adView.adUnitId = BANNER_AD_UNIT_ID
    adView.setAdSize(com.google.android.gms.ads.AdSize.BANNER)
    adView.loadAd(AdRequest.Builder().build())
    return adView
  }

  fun loadInterstitial(context: Context) {
    InterstitialAd.load(
      context,
      INTERSTITIAL_AD_UNIT_ID,
      AdRequest.Builder().build(),
      object : InterstitialAdLoadCallback() {
        override fun onAdLoaded(ad: InterstitialAd) {
          interstitialAd = ad
        }

        override fun onAdFailedToLoad(error: LoadAdError) {
          Log.d(TAG, "Interstitial failed to load: ${error.message}")
          interstitialAd = null
        }
      }
    )
  }

  /** Shows the interstitial if one is ready; silently does nothing
   * otherwise (never blocks gameplay waiting on an ad network). Always
   * queues up the next interstitial after this one closes or fails. */
  fun showInterstitial(activity: Activity, onDismissed: () -> Unit = {}) {
    val ad = interstitialAd
    if (ad == null) {
      onDismissed()
      loadInterstitial(activity)
      return
    }
    ad.fullScreenContentCallback = object : FullScreenContentCallback() {
      override fun onAdDismissedFullScreenContent() {
        interstitialAd = null
        loadInterstitial(activity)
        onDismissed()
      }

      override fun onAdFailedToShowFullScreenContent(error: AdError) {
        interstitialAd = null
        loadInterstitial(activity)
        onDismissed()
      }
    }
    ad.show(activity)
  }

  fun loadRewarded(context: Context) {
    RewardedAd.load(
      context,
      REWARDED_AD_UNIT_ID,
      AdRequest.Builder().build(),
      object : RewardedAdLoadCallback() {
        override fun onAdLoaded(ad: RewardedAd) {
          rewardedAd = ad
        }

        override fun onAdFailedToLoad(error: LoadAdError) {
          Log.d(TAG, "Rewarded ad failed to load: ${error.message}")
          rewardedAd = null
        }
      }
    )
  }

  /** Shows the rewarded ad if one is ready. `onReward` fires only if the
   * player actually watches to completion (per the SDK's own reward
   * callback) -- `onDismissed` always fires afterward regardless, so the
   * caller can re-enable its UI either way. If no ad is loaded yet,
   * `onDismissed` fires immediately and nothing is granted -- callers
   * should treat that as "ad not available right now", not an error. */
  fun showRewarded(activity: Activity, onReward: () -> Unit, onDismissed: () -> Unit = {}) {
    val ad = rewardedAd
    if (ad == null) {
      onDismissed()
      loadRewarded(activity)
      return
    }
    ad.fullScreenContentCallback = object : FullScreenContentCallback() {
      override fun onAdDismissedFullScreenContent() {
        rewardedAd = null
        loadRewarded(activity)
        onDismissed()
      }

      override fun onAdFailedToShowFullScreenContent(error: AdError) {
        rewardedAd = null
        loadRewarded(activity)
        onDismissed()
      }
    }
    ad.show(activity) { onReward() }
  }
}
