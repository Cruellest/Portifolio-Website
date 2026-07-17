import { nextTick, ref, watch } from 'vue'

/**
 * Full-page text search with <mark> highlighting.
 *
 * Walks the DOM, wraps matches in `mark[data-search-highlight]` elements and
 * lets the user cycle through them. Elements marked `data-search-ignore`
 * (and form controls, scripts, etc.) are skipped. Styling lives in
 * `src/style.css` under the same attribute selectors.
 */

const EXCLUDED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'IFRAME',
  'CANVAS',
  'SVG',
  'INPUT',
  'TEXTAREA',
  'SELECT',
  'MARK',
])

// Module-level singleton: the overlay and its state exist once per page.
const isOpen = ref(false)
const query = ref('')
const currentIndex = ref(-1)
const totalMatches = ref(0)
let watcherInstalled = false

const getHighlights = () =>
  Array.from(document.querySelectorAll<HTMLElement>('mark[data-search-highlight="true"]'))

function clearHighlights() {
  for (const mark of getHighlights()) {
    const parent = mark.parentNode
    if (!parent) continue
    parent.replaceChild(document.createTextNode(mark.textContent ?? ''), mark)
    parent.normalize()
  }
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function shouldSkipElement(el: Element) {
  return el.hasAttribute('data-search-ignore') || EXCLUDED_TAGS.has(el.tagName)
}

function highlightTextNode(text: string, re: RegExp): DocumentFragment | null {
  re.lastIndex = 0
  if (!re.test(text)) return null
  re.lastIndex = 0

  const fragment = document.createDocumentFragment()
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    const start = match.index
    const end = start + match[0].length
    if (start > lastIndex)
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)))

    const mark = document.createElement('mark')
    mark.setAttribute('data-search-highlight', 'true')
    mark.textContent = text.slice(start, end)
    fragment.appendChild(mark)

    lastIndex = end
  }

  if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
  return fragment
}

function walkAndHighlight(node: Node, re: RegExp) {
  if (node.nodeType !== Node.ELEMENT_NODE) return
  const el = node as Element
  if (shouldSkipElement(el)) return

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i]
    if (!child) continue
    if (child.nodeType === Node.ELEMENT_NODE) {
      walkAndHighlight(child, re)
    } else if (child.nodeType === Node.TEXT_NODE) {
      const fragment = highlightTextNode(child.nodeValue ?? '', re)
      if (fragment) {
        node.replaceChild(fragment, child)
        i--
      }
    }
  }
}

function focusMatch(index: number) {
  const marks = getHighlights()
  totalMatches.value = marks.length
  if (marks.length === 0) {
    currentIndex.value = -1
    return
  }
  const clamped = ((index % marks.length) + marks.length) % marks.length
  marks.forEach((mark) => mark.removeAttribute('data-search-active'))
  const target = marks[clamped]
  if (!target) return
  target.setAttribute('data-search-active', 'true')
  currentIndex.value = clamped
  target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
}

function highlightQuery(rawQuery: string) {
  clearHighlights()
  const trimmed = rawQuery.trim()
  if (!trimmed) {
    totalMatches.value = 0
    currentIndex.value = -1
    return
  }

  walkAndHighlight(document.body, new RegExp(escapeRegExp(trimmed), 'gi'))

  const marks = getHighlights()
  totalMatches.value = marks.length
  if (marks.length > 0) focusMatch(0)
  else currentIndex.value = -1
}

export function useSiteSearch() {
  if (!watcherInstalled) {
    watcherInstalled = true
    watch(query, (value) => highlightQuery(value))
  }

  const open = async () => {
    isOpen.value = true
    await nextTick()
  }

  const close = () => {
    isOpen.value = false
    query.value = ''
    clearHighlights()
    totalMatches.value = 0
    currentIndex.value = -1
  }

  const toggle = async () => {
    if (isOpen.value) close()
    else await open()
  }

  const nextMatch = () => {
    if (totalMatches.value > 0) focusMatch(currentIndex.value + 1)
  }

  const prevMatch = () => {
    if (totalMatches.value > 0) focusMatch(currentIndex.value - 1)
  }

  return { isOpen, query, currentIndex, totalMatches, open, close, toggle, nextMatch, prevMatch }
}
