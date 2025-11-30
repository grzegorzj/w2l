/**
 * Global context for tracking the current artboard.
 * This allows elements to automatically add themselves to the active artboard.
 */

let currentArtboard: any = null;

/**
 * Sets the current artboard that elements will automatically be added to.
 * @internal
 */
export function setCurrentArtboard(artboard: any): void {
  currentArtboard = artboard;
}

/**
 * Gets the current artboard.
 * @internal
 */
export function getCurrentArtboard(): any {
  return currentArtboard;
}

/**
 * Clears the current artboard reference.
 * @internal
 */
export function clearCurrentArtboard(): void {
  currentArtboard = null;
}
