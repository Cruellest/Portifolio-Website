<template>
  <div class="resume-container" data-theme="light-custom">
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

    <div ref="resumeContent" class="resume-content">
      <header class="header">
        <div class="profile-section">
          <img
            :src="personal.profileImage"
            :alt="`${ui.print.profilePictureAlt} ${personal.fullName}`"
            class="profile-photo"
          />
          <div class="header-text">
            <h1>{{ personal.fullName }}</h1>
            <p class="title">{{ personal.title }}</p>
            <div class="contact-info">
              <p>
                <i class="bi bi-telephone-fill contact-icon" aria-hidden="true"></i>
                <span class="sr-only">{{ ui.print.phoneLabel }}</span>
                {{ personal.phone }}
              </p>
              <p>
                <i class="bi bi-envelope-fill contact-icon" aria-hidden="true"></i>
                <span class="sr-only">{{ ui.print.emailLabel }}</span>
                {{ personal.email }}
              </p>
              <p>
                <i class="bi bi-github contact-icon" aria-hidden="true"></i>
                <a :href="personal.github" target="_blank" rel="noopener" :title="personal.github">
                  {{ githubDisplay }}
                </a>
              </p>
              <p>
                <i class="bi bi-linkedin contact-icon" aria-hidden="true"></i>
                <a
                  :href="personal.linkedin"
                  target="_blank"
                  rel="noopener"
                  :title="personal.linkedin"
                >
                  {{ linkedinDisplay }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>

      <!-- Two-column body -->
      <div class="content-grid">
        <div class="left-column">
          <section class="section">
            <h2>{{ sectionTitles.summary }}</h2>
            <p>{{ store.summary }}</p>
          </section>

          <section class="section">
            <h2>{{ sectionTitles.skills }}</h2>
            <div class="skills-grid">
              <div v-for="(category, index) in store.skills" :key="index" class="skill-item">
                <h4>{{ category.category }}</h4>
                <p>
                  <span
                    v-for="(skill, skillIndex) in category.skill_list"
                    :key="skillIndex"
                    :class="{ primary: skill.level === 'primary' }"
                  >
                    {{ skill.name }}
                  </span>
                </p>
              </div>
            </div>
          </section>
        </div>

        <div class="right-column">
          <section class="section">
            <h2>{{ sectionTitles.experience }}</h2>
            <div v-for="(job, index) in store.experience.jobs" :key="index" class="job">
              <div class="entry-header">
                <h3>{{ job.title }}</h3>
                <span class="date-badge">{{ job.startDate }} – {{ job.endDate }}</span>
              </div>
              <p class="company">{{ job.company }}</p>
              <p class="location">{{ job.location }}</p>
              <ul>
                <li v-for="(highlight, highlightIndex) in job.highlights" :key="highlightIndex">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </section>

          <section class="section">
            <h2>{{ sectionTitles.education }}</h2>
            <div v-for="(entry, index) in store.education" :key="index" class="education">
              <div class="entry-header">
                <h3>{{ entry.degree }}</h3>
                <span class="date-badge">{{ entry.startDate }} – {{ entry.endDate }}</span>
              </div>
              <p class="company">{{ entry.institution }}</p>
              <p class="location">{{ entry.location }}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { usePrintFlow, waitForImage } from '../composables/usePrintFlow'
import { usePortfolioStore } from '../stores/portfolio'
import { displayUrl } from '../utils/url'

const store = usePortfolioStore()
const personal = computed(() => store.personal)
const sectionTitles = computed(() => store.sectionTitles)
const ui = computed(() => store.ui)

const githubDisplay = computed(() => displayUrl(personal.value.github))
const linkedinDisplay = computed(() => displayUrl(personal.value.linkedin))

const { overlayVisible, triggerPrint } = usePrintFlow()

const resumeContent = ref<HTMLDivElement | null>(null)

// A4 content area (210×297mm minus 15mm padding) in CSS px
const MM_TO_PX = 3.7795
const A4_CONTENT_WIDTH_PX = 180 * MM_TO_PX
const A4_CONTENT_HEIGHT_PX = 267 * MM_TO_PX

/** Scales the content down so it always fits a single A4 page. */
const fitToPage = () => {
  const el = resumeContent.value
  if (!el) return
  el.style.transform = ''
  el.style.transformOrigin = 'top left'
  el.style.width = ''
  const scaleY = el.scrollHeight > A4_CONTENT_HEIGHT_PX ? A4_CONTENT_HEIGHT_PX / el.scrollHeight : 1
  const scaleX = el.scrollWidth > A4_CONTENT_WIDTH_PX ? A4_CONTENT_WIDTH_PX / el.scrollWidth : 1
  const scale = Math.min(scaleX, scaleY, 1)
  if (scale < 1) {
    el.style.transform = `scale(${scale})`
    el.style.width = `${100 / scale}%`
  }
}

onMounted(async () => {
  await nextTick()
  await waitForImage(document.querySelector<HTMLImageElement>('.profile-photo'))
  await triggerPrint(fitToPage)
})
</script>

<style scoped>
.resume-container {
  width: 210mm;
  min-width: 210mm;
  height: 297mm;
  max-height: 297mm;
  margin: 0 auto;
  background: white;
  padding: 15mm;
  font-family:
    'Inter Variable',
    ui-sans-serif,
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #2b2733;
  overflow: hidden;
}

.resume-content {
  display: flex;
  flex-direction: column;
  gap: 5mm;
  transform-origin: top left;
}

/* Header */
.header {
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 6mm;
  page-break-inside: avoid;
  page-break-after: avoid;
  flex-shrink: 0;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 10mm;
}

.profile-photo {
  width: 42mm;
  height: 42mm;
  border-radius: 22%;
  object-fit: cover;
  border: 2px solid var(--color-primary);
  flex-shrink: 0;
}

.header-text h1 {
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #1d1826;
  margin-bottom: 1mm;
}

.title {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 3mm;
}

.contact-info {
  font-size: 11.5px;
  color: #55505e;
}

.contact-info p {
  margin: 1.5px 0;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 6px;
}

.contact-info a {
  color: inherit;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.contact-icon {
  color: var(--color-primary);
  font-size: 12px;
  line-height: 1;
}

.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Body */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8mm;
  flex: 1;
  min-height: 0;
}

.section {
  margin-bottom: 5mm;
  page-break-inside: avoid;
}

.section h2 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary);
  margin-bottom: 3mm;
  border-bottom: 1px solid #e8e4ee;
  padding-bottom: 2mm;
  page-break-after: avoid;
}

.section p {
  font-size: 11.5px;
  line-height: 1.55;
  margin-bottom: 2mm;
}

/* Skills */
.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3mm;
}

.skill-item {
  padding: 3mm 4mm;
  border-radius: 2mm;
  border: 1px solid #eceaf1;
  border-left: 2px solid var(--color-primary);
  page-break-inside: avoid;
}

.skill-item h4 {
  font-size: 10.5px;
  font-weight: 700;
  color: #1d1826;
  margin-bottom: 2mm;
}

.skill-item p {
  font-size: 10px;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5mm;
}

.skill-item span {
  display: inline-block;
  background: #f3f1f7;
  color: #55505e;
  padding: 1mm 2.5mm;
  border-radius: 3mm;
  font-size: 9.5px;
  font-weight: 500;
}

.skill-item span.primary {
  background: color-mix(in oklch, var(--color-primary) 12%, white);
  color: var(--color-primary);
  font-weight: 600;
}

/* Experience & education entries */
.job,
.education {
  margin-bottom: 4mm;
  page-break-inside: avoid;
  padding-bottom: 2mm;
  border-bottom: 0.5px solid #f0eef4;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 4mm;
  margin-bottom: 1mm;
  page-break-after: avoid;
}

.job h3,
.education h3 {
  font-size: 12.5px;
  font-weight: 700;
  color: #1d1826;
  margin: 0;
  flex: 1;
}

.date-badge {
  font-size: 10px;
  color: var(--color-primary);
  background: color-mix(in oklch, var(--color-primary) 9%, white);
  padding: 0.7mm 2.5mm;
  border-radius: 3mm;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.company {
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 0.5mm !important;
  page-break-after: avoid;
}

.location {
  font-size: 10.5px;
  color: #8b8694;
  margin-bottom: 1mm !important;
  page-break-after: avoid;
}

.job ul {
  margin-left: 5mm;
  font-size: 11px;
  padding: 0;
  list-style: disc outside;
}

.job li {
  margin-bottom: 1mm;
  line-height: 1.45;
  list-style-position: outside;
  color: #45404f;
}

/* Print */
@media print {
  html,
  body {
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    min-width: 210mm !important;
    background: white !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .resume-container {
    width: 210mm !important;
    min-width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    margin: 0 !important;
    padding: 15mm !important;
    background: white !important;
    box-shadow: none !important;
    overflow: hidden !important;
    page-break-after: avoid;
    page-break-before: avoid;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
  }

  .resume-content {
    transform-origin: top left;
    width: 100% !important;
  }

  .content-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    column-gap: 8mm !important;
  }

  .left-column,
  .right-column {
    overflow: hidden !important;
    min-width: 0 !important;
  }

  .profile-section {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
  }

  .profile-photo {
    width: 42mm !important;
    height: 42mm !important;
    flex-shrink: 0 !important;
  }

  .header {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  .section,
  .skill-item,
  .job,
  .education,
  .skills-grid,
  .job ul,
  .job li {
    break-inside: auto !important;
    page-break-inside: auto !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }

  p,
  li {
    orphans: 2;
    widows: 2;
  }
}

@page {
  size: A4;
  margin: 0;
  padding: 0;
}
</style>
