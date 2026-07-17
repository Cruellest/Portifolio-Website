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
    <article class="ats-resume">
      <header>
        <h1>{{ personal.fullName }}</h1>
        <p class="ats-title">{{ personal.title }}</p>
        <p class="ats-contact">
          {{ personal.location }} · {{ personal.phone }} · {{ personal.email }}
        </p>
        <p class="ats-contact">{{ githubDisplay }} · {{ linkedinDisplay }}</p>
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
import { computed, nextTick, onMounted } from 'vue'
import { usePrintFlow } from '../composables/usePrintFlow'
import { usePortfolioStore } from '../stores/portfolio'
import { displayUrl } from '../utils/url'

const store = usePortfolioStore()
const personal = computed(() => store.personal)
const sectionTitles = computed(() => store.sectionTitles)
const ui = computed(() => store.ui)

const githubDisplay = computed(() => displayUrl(personal.value.github))
const linkedinDisplay = computed(() => displayUrl(personal.value.linkedin))

const { overlayVisible, triggerPrint } = usePrintFlow()

onMounted(async () => {
  await nextTick()
  await triggerPrint()
})
</script>

<style scoped>
.ats-page {
  min-height: 100dvh;
  background: white;
}

.ats-resume {
  max-width: 180mm;
  margin: 0 auto;
  padding: 15mm 10mm;
  font-family:
    'Inter Variable',
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-size: 11.5pt;
  line-height: 1.5;
  color: #111;
  background: white;
}

.ats-resume h1 {
  font-size: 20pt;
  font-weight: 700;
  margin: 0 0 2pt;
}

.ats-title {
  font-size: 12pt;
  font-weight: 600;
  margin: 0 0 6pt;
}

.ats-contact {
  font-size: 10.5pt;
  margin: 0 0 2pt;
}

.ats-resume section {
  margin-top: 14pt;
}

.ats-resume h2 {
  font-size: 13pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #333;
  padding-bottom: 3pt;
  margin: 0 0 8pt;
  break-after: avoid;
}

.ats-resume h3 {
  font-size: 11.5pt;
  font-weight: 700;
  margin: 0 0 1pt;
  break-after: avoid;
}

.ats-resume p {
  margin: 0 0 4pt;
}

.ats-entry,
.ats-skill-category {
  margin-bottom: 8pt;
  break-inside: avoid;
}

.ats-entry-meta {
  font-size: 10.5pt;
  color: #333;
}

.ats-resume ul {
  margin: 2pt 0 0 14pt;
  padding: 0;
  list-style: disc outside;
}

.ats-resume li {
  margin-bottom: 3pt;
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
  }

  .ats-resume {
    max-width: none;
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
