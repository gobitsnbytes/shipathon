export const sequenceCache = [];
const TOTAL_FRAMES = 241;

export const preloadSequenceFrames = (onProgress) => {
  return new Promise((resolve) => {
    let loaded = 0;
    let initialResolveTriggered = false;
    
    // We only block the loader until the first 30 frames are ready 
    // so the initial render is perfectly smooth. The rest load lazily.
    const CRITICAL_FRAMES = Math.min(30, TOTAL_FRAMES);
    
    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const frameNumber = String(i + 1).padStart(4, '0');
        img.src = `/hero-sequence/frame_${frameNumber}.webp`;
        
        img.onload = () => {
            loaded++;
            if (onProgress) {
                onProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
            }
            if (loaded >= CRITICAL_FRAMES && !initialResolveTriggered) {
                initialResolveTriggered = true;
                resolve();
            }
        };
        sequenceCache[i] = img;
    }
  });
};

export const getFrameImage = (index) => {
    return sequenceCache[index];
};
