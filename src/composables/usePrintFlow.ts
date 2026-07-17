import { nextTick, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Shared flow for the print routes (/print-resume and /resume-ats):
 * show a preparing overlay, open the browser print dialog, then navigate
 * back to the homepage once the dialog closes.
 */
export function usePrintFlow() {
  const router = useRouter()
  const overlayVisible = ref(true)
  let visibilityHandler: (() => void) | null = null

  const goBack = () => {
    void router.push('/')
  }

  const removeVisibilityHandler = () => {
    if (visibilityHandler) {
      document.removeEventListener('visibilitychange', visibilityHandler)
      visibilityHandler = null
    }
  }

  /**
   * @param beforePrint runs after the overlay is removed and before the
   * dialog opens — use it for layout fixups such as fit-to-page scaling.
   */
  const triggerPrint = async (beforePrint?: () => void) => {
    overlayVisible.value = false
    await nextTick()

    beforePrint?.()
    await nextTick()

    // Wait for the browser to paint the final layout before printing
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    try {
      const before = Date.now()
      window.print()
      const elapsed = Date.now() - before

      if (elapsed > 300) {
        // Desktop: window.print() is synchronous — dialog already closed
        goBack()
      } else {
        // Android/mobile: window.print() returns immediately and the print UI
        // opens as a separate activity; detect its close via visibilitychange.
        visibilityHandler = () => {
          if (document.visibilityState === 'visible') {
            removeVisibilityHandler()
            goBack()
          }
        }
        document.addEventListener('visibilitychange', visibilityHandler)
      }
    } catch {
      goBack()
    }
  }

  onBeforeUnmount(removeVisibilityHandler)

  return { overlayVisible, triggerPrint, goBack }
}

/** Resolves when the image is loaded (or errored), so print isn't blank. */
export function waitForImage(img: HTMLImageElement | null): Promise<void> {
  return new Promise((resolve) => {
    if (!img || img.complete) {
      resolve()
      return
    }
    const done = () => resolve()
    img.addEventListener('load', done, { once: true })
    img.addEventListener('error', done, { once: true })
  })
}
