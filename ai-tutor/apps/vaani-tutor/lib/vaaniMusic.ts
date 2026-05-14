/**
 * Vaani Background Music Controller
 * Manages ambient background music for the learning session.
 */

export interface MusicController {
  stop: () => void;
  duck: () => void;
  unduck: () => void;
  /** Toggle music on/off. Returns true if music is now on. */
  toggle: () => boolean;
}

/**
 * Start background music for the Vaani session.
 * @param enabled - Whether music should play at all
 * @returns A MusicController with stop/duck/unduck methods
 */
export function startVaaniMusic(enabled: boolean): MusicController {
  let isOn = enabled;

  if (typeof window === 'undefined' || !enabled) {
    return {
      stop: () => {},
      duck: () => {},
      unduck: () => {},
      toggle: () => { isOn = !isOn; return isOn; },
    };
  }

  // No-op implementation — music files can be added later
  return {
    stop: () => {},
    duck: () => {},
    unduck: () => {},
    toggle: () => { isOn = !isOn; return isOn; },
  };
}
