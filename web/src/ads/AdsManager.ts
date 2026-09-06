// Bridges the web game to the native AdMob integration in the Android
// wrapper (see app/src/main/java/com/example/ads/AdManager.kt and
// MainActivity's WebAppInterface). Ads themselves are rendered natively —
// this module only decides WHEN to ask for one and reacts to the result.
//
// window.AndroidAds only exists when running inside the Android WebView
// wrapper. In a plain browser (e.g. `npm run dev`, or the web build hosted
// standalone) every method here safely no-ops instead of throwing, so the
// game is fully playable without the Android shell.

declare global {
  interface Window {
    AndroidAds?: {
      showInterstitial: () => void;
      showRewardedAd: () => void;
      setBannerVisible: (visible: boolean) => void;
    };
    onRewardedAdEarned?: () => void;
    onRewardedAdClosed?: () => void;
  }
}

class AdsManagerImpl {
  private pendingRewardCallback: (() => void) | null = null;

  private get bridge() {
    return typeof window !== 'undefined' ? window.AndroidAds : undefined;
  }

  public isAvailable(): boolean {
    return !!this.bridge;
  }

  /** Fire-and-forget: shows an interstitial if the native side has one
   * ready. Never blocks or delays gameplay/UI flow waiting on it — this is
   * meant to be called right after showing the Game Over / Level Complete
   * screen, not awaited before showing it. */
  public showInterstitial(): void {
    this.bridge?.showInterstitial();
  }

  /** Shows a rewarded ad. `onReward` is called only if the player actually
   * watches to completion (the native side only invokes
   * window.onRewardedAdEarned when the SDK's own reward callback fires).
   * If no ad is available (not running inside the Android wrapper, or none
   * loaded yet), `onUnavailable` fires immediately instead. */
  public showRewardedAd(onReward: () => void, onUnavailable: () => void = () => {}): void {
    if (!this.bridge) {
      onUnavailable();
      return;
    }
    this.pendingRewardCallback = onReward;
    this.bridge.showRewardedAd();
  }

  /** Called by the native bridge (window.onRewardedAdEarned) when a
   * rewarded ad is watched to completion. */
  public handleRewardEarned(): void {
    this.pendingRewardCallback?.();
    this.pendingRewardCallback = null;
  }

  /** Called by the native bridge (window.onRewardedAdClosed) whenever the
   * rewarded ad flow ends, whether or not the reward was earned — clears
   * any stale pending callback so it can't fire twice. */
  public handleRewardedClosed(): void {
    this.pendingRewardCallback = null;
  }

  /** Hide the persistent banner during active gameplay so it never sits
   * over the HUD or touch controls; show it everywhere else (menus,
   * results screens, pause). */
  public setBannerVisible(visible: boolean): void {
    this.bridge?.setBannerVisible(visible);
  }
}

export const AdsManager = new AdsManagerImpl();

if (typeof window !== 'undefined') {
  window.onRewardedAdEarned = () => AdsManager.handleRewardEarned();
  window.onRewardedAdClosed = () => AdsManager.handleRewardedClosed();
}
