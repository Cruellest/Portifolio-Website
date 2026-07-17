/** Closes daisyUI focus-based dropdowns by blurring the active element. */
export function blurActiveElement() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

/** Smooth-scrolls to a section anchor by id. */
export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  blurActiveElement()
}
