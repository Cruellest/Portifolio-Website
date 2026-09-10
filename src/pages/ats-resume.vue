<template>
  <div class="ats-page" data-theme="light-custom">
    <div
      v-if="overlayVisible"
      class="fixed inset-0 z-50 grid place-items-center bg-base-100/60 backdrop-blur-sm"
    >
      <div
        class="w-[min(90vw,28rem)] rounded-box bg-base-100/90 p-6 text-center shadow-xl backdrop-blur-md sm:p-8"
      >
        <div class="flex flex-col items-center gap-3">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="text-base-content/80">{{ ui.print.preparing }}</p>
        </div>
      </div>
    </div>

    <!--
      ATS-friendly layout: single column, semantic headings, plain text,
      no photo, no icons, no tables — optimized for automated resume parsers.
    -->
    <article ref="resumeContent" class="ats-resume">
      <header>
        <h1>{{ personal.fullName }}</h1>
        <p class="ats-title">{{ personal.title }}</p>
        <p class="ats-contact">
          {{ personal.location }} · {{ personal.phone }} · {{ personal.email }}
        </p>
        <p class="ats-contact">
          {{ githubDisplay }} · {{ linkedinDisplay }}
          <template v-if="websiteDisplay"> · {{ websiteDisplay }}</template>
        </p>
      </header>

      <section>
        <h2>{{ sectionTitles.summary }}</h2>
        <p>{{ store.summary }}</p>
      </section>

      <section>
        <h2>{{ sectionTitles.skills }}</h2>
        <div v-for="(category, index) in store.skills" :key="index" class="ats-skill-category">
          <h3>{{ category.category }}</h3>
          <p>{{ category.skill_list.map((skill) => skill.name).join(', ') }}</p>
        </div>
      </section>

      <section>
        <h2>{{ sectionTitles.experience }}</h2>
        <div v-for="(job, index) in store.experience.jobs" :key="index" class="ats-entry">
          <h3>{{ job.title }}</h3>
          <p class="ats-entry-meta">
            {{ job.company }} — {{ job.location }} ({{ job.startDate }} – {{ job.endDate }})
          </p>
          <ul>
            <li v-for="(highlight, highlightIndex) in job.highlights" :key="highlightIndex">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>{{ sectionTitles.projects }}</h2>
        <div v-for="(project, index) in store.experience.projects" :key="index" class="ats-entry">
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
          <p class="ats-entry-meta">{{ displayUrl(project.link) }}</p>
        </div>
      </section>

      <section>
        <h2>{{ sectionTitles.education }}</h2>
        <div v-for="(entry, index) in store.education" :key="index" class="ats-entry">
          <h3>{{ entry.degree }}</h3>
          <p class="ats-entry-meta">
            {{ entry.institution }} — {{ entry.location }} ({{ entry.startDate }} –
            {{ entry.endDate }})
          </p>
        </div>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { usePrintFlow } from '../composables/usePrintFlow'
import { usePortfolioStore } from '../stores/portfolio'
import { displayUrl } from '../utils/url'

const store = usePortfolioStore()
const personal = computed(() => store.personal)
const sectionTitles = computed(() => store.sectionTitles)
const ui = computed(() => store.ui)

const githubDisplay = computed(() => displayUrl(personal.value.github))
const linkedinDisplay = computed(() => displayUrl(personal.value.linkedin))
const websiteDisplay = computed(() => displayUrl(personal.value.website ?? ''))

const { overlayVisible, triggerPrint } = usePrintFlow()

const resumeContent = ref<HTMLElement | null>(null)

// A4 content area (210x297mm minus the 15mm @page margin)
const MM_TO_PX = 3.7795
const A4_CONTENT_WIDTH_MM = 180
const A4_CONTENT_HEIGHT_PX = 267 * MM_TO_PX

/**
 * Scales the resume down so it always prints on a single A4 page.
 *
 * The article is laid out wider than the page (180mm / scale) so that scaling
 * it back down lands exactly on the page width. Widening reflows the text and
 * changes its height, so the scale is solved by iteration instead of a single
 * division. The layout height is then pinned to one page: `transform` only
 * affects painting, and the printer paginates on the layout box.
 */
const fitToPage = () => {
  const el = resumeContent.value
  if (!el) return
  el.style.transform = ''
  el.style.width = ''
  el.style.height = ''

  let scale = 1
  for (let pass = 0; pass < 5; pass++) {
    el.style.width = `${A4_CONTENT_WIDTH_MM / scale}mm`
    const next = Math.min(1, A4_CONTENT_HEIGHT_PX / el.scrollHeight)
    if (Math.abs(next - scale) < 0.002) break
    scale = next
  }

  if (scale < 1) {
    el.style.transform = `scale(${scale})`
    el.style.height = `${Math.floor(A4_CONTENT_HEIGHT_PX)}px`
  } else {
    el.style.width = ''
  }
}

onMounted(async () => {
  await nextTick()
  await triggerPrint(fitToPage)
})
</script>

<style scoped>
.ats-page {
  min-height: 100dvh;
  background: white;
  padding: 15mm 0;
  /* The article is laid out wider than the page before being scaled down */
  overflow-x: auto;
}

/*
 * Same 180mm content width on screen and on paper, so the fit-to-page
 * measurement taken on screen matches what the printer lays out.
 */
.ats-resume {
  width: 180mm;
  margin: 0 auto;
  padding: 0;
  transform-origin: top left;
  font-family:
    'Inter Variable',
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-size: 9.6pt;
  line-height: 1.34;
  color: #111;
  background: white;
}

.ats-resume h1 {
  font-size: 17pt;
  font-weight: 700;
  margin: 0 0 1pt;
}

.ats-title {
  font-size: 10.5pt;
  font-weight: 600;
  margin: 0 0 4pt;
}

.ats-contact {
  font-size: 9pt;
  margin: 0 0 1pt;
}

.ats-resume section {
  margin-top: 9pt;
}

.ats-resume h2 {
  font-size: 10.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #333;
  padding-bottom: 2pt;
  margin: 0 0 5pt;
  break-after: avoid;
}

.ats-resume h3 {
  font-size: 9.8pt;
  font-weight: 700;
  margin: 0 0 0.5pt;
  break-after: avoid;
}

.ats-resume p {
  margin: 0 0 2pt;
}

.ats-entry,
.ats-skill-category {
  margin-bottom: 5pt;
  break-inside: avoid;
}

.ats-entry-meta {
  font-size: 9pt;
  color: #333;
}

.ats-resume ul {
  margin: 1pt 0 0 12pt;
  padding: 0;
  list-style: disc outside;
}

.ats-resume li {
  margin-bottom: 1.5pt;
}

@media print {
  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
  }

  .ats-page {
    background: white !important;
    padding: 0 !important;
    overflow: hidden !important;
  }

  .ats-resume {
    margin: 0 !important;
    padding: 0;
  }

  p,
  li {
    orphans: 2;
    widows: 2;
  }
}

@page {
  size: A4;
  margin: 15mm;
}
</style>
