/**
 * Shared video cache module.
 * The Loader downloads hero-video.mp4 via XHR and stores the blob URL here.
 * HeroSection reads it instead of re-fetching from the network.
 */

let cachedBlobUrl = '';

export function setCachedVideoUrl(url) {
  cachedBlobUrl = url;
}

export function getCachedVideoUrl() {
  return cachedBlobUrl;
}
