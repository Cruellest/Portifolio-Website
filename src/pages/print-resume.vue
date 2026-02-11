<template>
  <div class="resume-container">
    <!-- Loading overlay (no theme applied here) -->
    <Loading
      :show="overlayVisible"
      :status="overlayStatus"
      :message="overlayMessage"
      @action="handleOverlayAction"
    />
    <div class="resume-content" ref="resumeContent" data-theme="light-custom">
      <!-- Header com foto e info -->
      <header class="header">
        <div class="header-content">
          <div class="profile-section">
            <img 
              :src="personalData.profileImage" 
              :alt="`${printUi.profilePictureAlt || 'Profile Picture of'} ${personalData.fullName}`"
              class="profile-photo"
            />
            <div class="header-text">
              <h1>{{ personalData.fullName }}</h1>
              <p class="title">{{ personalData.title }}</p>
              <div class="contact-info">
                <p>
                  <i class="bi bi-telephone-fill contact-icon" aria-hidden="true"></i>
                  <span class="sr-only">{{ printUi.phoneLabel || 'Phone:' }}</span>
                  {{ personalData.phone }}
                </p>
                <p>
                  <i class="bi bi-envelope-fill contact-icon" aria-hidden="true"></i>
                  <span class="sr-only">{{ printUi.emailLabel || 'Email:' }}</span>
                  {{ personalData.email }}
                </p>
                <p>
                  <i class="bi bi-github contact-icon" aria-hidden="true"></i>
                  <a :href="personalData.github" target="_blank" rel="noopener" :title="personalData.github">{{ githubDisplay }}</a>
                </p>
                <p>
                  <i class="bi bi-linkedin contact-icon" aria-hidden="true"></i>
                  <a :href="personalData.linkedin" target="_blank" rel="noopener" :title="personalData.linkedin">{{ linkedinDisplay }}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Conteúdo principal em 2 colunas -->
      <div class="content-grid">
        <!-- Coluna esquerda -->
        <div class="left-column">
          <!-- Resumo profissional -->
          <section class="section">
            <h2>{{ sectionTitles.summary }}</h2>
            <p>
              {{ summaryData }}
            </p>
          </section>

          <!-- Habilidades -->
          <section class="section">
            <h2>{{ sectionTitles.skills }}</h2>
            <div class="skills-grid">
              <div class="skill-item" v-for="(skillCategory, index) in skillsData" :key="index">
                <h4>{{ skillCategory.category }}</h4>
                <p>
                  <span 
                    v-for="(skill, skillIndex) in skillCategory.skill_list" 
                    :key="skillIndex"
                    :class="[
                      'text-sm font-medium px-3 py-1 rounded-full',
                      skill.level === 'primary' ? 'bg-primary/10 text-primary' : 'bg-base-300 text-base-content/80'
                    ]"
                  >
                    {{ skill.name }}
                  </span>
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- Coluna direita -->
        <div class="right-column">
          <!-- Experiência -->
          <section class="section">
            <h2>{{ sectionTitles.experience }}</h2>
            <div class="job" v-for="(job, index) in jobs" :key="index">
              <div class="job-header">
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

          <!-- Educação -->
          <section class="section">
            <h2>{{ sectionTitles.education }}</h2>
            <div class="education" v-for="(edu, index) in educationData" :key="index">
              <div class="edu-header">
                <h3>{{ edu.degree }}</h3>
                <span class="date-badge">{{ edu.startDate }} – {{ edu.endDate }}</span>
              </div>
              <p class="company">{{ edu.institution }}</p>
              <p class="location">{{ edu.location }}</p>
            </div>
          </section>

          <!-- Projetos -->
          <!-- REMOVED: Projects section on resume -->
          <!--
          <section class="section" v-if="experienceData?.projects?.length">
            <h2>{{ sectionTitles.projects || 'Projects' }}</h2>
            <div class="project" v-for="(p, i) in experienceData.projects" :key="i">
              <div class="project-header">
                <h3>{{ p.name }}</h3>
              </div>
              <p class="project-desc">{{ p.description }}</p>
              <p class="project-link">
                <i class="bi bi-link-45deg contact-icon" aria-hidden="true"></i>
                <a :href="p.link" target="_blank" rel="noopener" :title="p.link">{{ p.link }}</a>
              </p>
            </div>
          </section>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect, nextTick, onBeforeUnmount } from 'vue'
import {
  getPersonalData,
  getSectionsData,
  getSummaryData,
  getSkillsData,
  getExperienceData,
  getEducationData
} from '../controllers/json-data-controller'
import router from '../router'
import Loading from '../components/loading.vue'
import { getUiStrings } from '../controllers/json-data-controller'

const PRINT_FALLBACK_DELAY_MS = 6000

const isDataLoaded = ref(false)
const isImageLoaded = ref(false)
const resumeContent = ref(null)

const personalData = computed(() => getPersonalData())
const sectionTitles = computed(() => getSectionsData())
const summaryData = computed(() => getSummaryData())
const skillsData = computed(() => getSkillsData())
const experienceData = computed(() => getExperienceData())
const educationData = computed(() => getEducationData())
// Consome apenas jobs do controller (compatível com formato antigo em array)
const jobs = computed(() => {
  const exp = experienceData.value
  if (Array.isArray(exp)) return exp
  return Array.isArray(exp?.jobs) ? exp.jobs : []
})

watchEffect(() => {
  const hasAllData = 
    personalData.value &&
    sectionTitles.value &&
    summaryData.value &&
    skillsData.value &&
    experienceData.value &&
    educationData.value

  if (hasAllData && Object.keys(personalData.value).length > 0) {
    isDataLoaded.value = true
  }
})

// state for overlay
const overlayVisible = ref(true)
const overlayStatus = ref('loading') // 'loading' | 'action'
const ui = computed(() => getUiStrings())
const printUi = computed(() => ui.value?.print ?? {})
const overlayMessage = ref(ui.value?.print?.preparing || 'Preparing resume for print…')

// helper to return user (back or home)
const handleOverlayAction = () => {
  router.push('/')
}

let fallbackTimer
let afterPrintHandler

// A4 content area in px (210mm - 2*15mm = 180mm width, 297mm - 2*15mm = 267mm height)
// 1mm ≈ 3.7795px
const A4_CONTENT_WIDTH_PX = 180 * 3.7795
const A4_CONTENT_HEIGHT_PX = 267 * 3.7795

// Auto-fit: measure content and scale down only if it overflows
const fitToPage = () => {
  const el = resumeContent.value
  if (!el) return
  // Reset any previous transform
  el.style.transform = ''
  el.style.transformOrigin = 'top left'
  el.style.width = ''

  // Use fixed A4 dimensions (mobile viewports report wrong clientHeight/Width)
  const availableHeight = A4_CONTENT_HEIGHT_PX
  const availableWidth = A4_CONTENT_WIDTH_PX

  // Measure actual content size (scrollHeight includes overflow)
  const contentHeight = el.scrollHeight
  const contentWidth = el.scrollWidth
  // Calculate scale factor (only shrink, never enlarge)
  const scaleY = contentHeight > availableHeight ? availableHeight / contentHeight : 1
  const scaleX = contentWidth > availableWidth ? availableWidth / contentWidth : 1
  const scale = Math.min(scaleX, scaleY, 1)
  if (scale < 1) {
    el.style.transform = `scale(${scale})`
    el.style.width = `${100 / scale}%`
  }
}

// navigate back helper
const goBack = () => {
  router.push('/')
}

// trigger print and auto-return afterwards
const triggerPrint = async () => {
  // fit content to one page before printing
  await nextTick()
  fitToPage()
  await nextTick()
  try {
    window.print()
    // Do NOT call goBack() here. On Android, window.print() returns
    // immediately (async) and navigating away would make the print
    // preview capture the homepage instead of the resume.
    // Navigation back is handled by the 'afterprint' event listener.
  } catch {
    overlayStatus.value = 'action'
    overlayMessage.value = ui.value?.print?.printFailed || 'Could not open print dialog. Click to return.'
  }
}

onMounted(async () => {
  await nextTick()

  // fallback if print dialog doesn’t appear
  fallbackTimer = window.setTimeout(() => {
    if (overlayStatus.value !== 'action') {
      overlayStatus.value = 'action'
      overlayMessage.value = ui.value?.print?.stillPreparing || 'Still preparing… You can return to menu.'
    }
  }, PRINT_FALLBACK_DELAY_MS)

  const profileImg = document.querySelector('.profile-photo')
  if (profileImg) {
    if (profileImg.complete) {
      triggerPrint()
    } else {
      profileImg.addEventListener('load', () => {
        triggerPrint()
      }, { once: true })
      profileImg.addEventListener('error', () => {
        triggerPrint()
      }, { once: true })
    }
  } else {
    triggerPrint()
  }

  afterPrintHandler = () => {
    goBack()
  }
  window.addEventListener('afterprint', afterPrintHandler, { once: true })
})

onBeforeUnmount(() => {
  if (fallbackTimer) window.clearTimeout(fallbackTimer)
  if (afterPrintHandler) {
    window.removeEventListener('afterprint', afterPrintHandler)
    afterPrintHandler = null
  }
})

// helper para exibir URL sem protocolo/www/query/hash e sem barra final
const urlDisplay = (url) => {
  if (!url) return ''
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    const path = u.pathname.replace(/\/+$/, '')
    return path && path !== '/' ? `${host}${path}` : host
  } catch {
    return url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/[\?#].*$/, '')
      .replace(/\/+$/, '')
  }
}

const githubDisplay = computed(() => urlDisplay(personalData.value?.github || ''))
const linkedinDisplay = computed(() => urlDisplay(personalData.value?.linkedin || ''))
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
</style>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.resume-container {
  width: 210mm;
  min-width: 210mm;
  height: 297mm;
  max-height: 297mm;
  margin: 0 auto;
  background: white;
  padding: 15mm;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  overflow: hidden;
}

.resume-content {
  display: flex;
  flex-direction: column;
  gap: 5mm;
  transform-origin: top left;
}

.header {
  border-bottom: 2.5px solid var(--color-primary);
  padding-bottom: 6mm;
  page-break-inside: avoid;
  page-break-after: avoid;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: flex-start; /* was space-between */
  align-items: flex-start;
  gap: 12mm;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 10mm;
}

.profile-photo {
  width: 45mm;
  height: 45mm;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
  flex-shrink: 0;
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 3px;
}

.title {
  font-size: 15px;
  color: #666;
  font-weight: 500;
}

.contact-info {
  text-align: left; /* was right */
  font-size: 12px;
  flex-shrink: 0;
}

.contact-info p {
  margin: 2px 0;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-start; /* was flex-end */
}

.contact-info a {
  color: var(--color-primary);
  text-decoration: none;
  overflow-wrap: anywhere; /* allow long URLs to wrap */
}

.contact-icon {
  color: var(--color-primary);
  font-size: 14px;
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
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 3mm;
  border-bottom: 1.5px solid var(--color-base-300);
  padding-bottom: 2mm;
  page-break-after: avoid;
}

.section p {
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 2mm;
}

.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3mm;
}

.skill-item {
  background: color-mix(in oklch, var(--color-primary) 10%, var(--color-base-100));
  background: var(--color-base-100);
  padding: 3mm 4mm;
  border-radius: 3px;
  border-left: 3px solid var(--color-primary);
  page-break-inside: avoid;
}

.skill-item h4 {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 2mm;
}

.skill-item p {
  font-size: 11px;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 3mm;
}

.skill-item span {
  display: inline-block;
  background: color-mix(in oklch, var(--color-primary) 20%, transparent) !important;
  color: var(--color-primary) !important;
  padding: 2mm 3mm !important;
  border-radius: 3px !important;
  font-size: 10px !important;
}

.job,
.education {
  margin-bottom: 4mm;
  page-break-inside: avoid;
  padding-bottom: 2mm;
  border-bottom: 0.5px solid #f0f0f0;
}

.job-header,
.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 4mm;
  margin-bottom: 1mm;
  page-break-after: avoid;
}

.job h3,
.education h3 {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.date-badge {
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.company {
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: 1mm !important;
  page-break-after: avoid;
}

.location {
  font-size: 11px;
  color: #999;
  margin-bottom: 1mm !important;
  page-break-after: avoid;
}

.job ul {
  margin-left: 5mm;
  font-size: 11px;
  padding: 0;
}

.job li {
  margin-bottom: 1mm;
  line-height: 1.4;
  list-style-position: outside;
}

/* Print styles */
@media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    min-width: 210mm !important;
    background: white !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
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

  /* Two-column grid */
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

  /* Force profile section layout */
  .header-content,
  .profile-section {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
  }

  .profile-photo {
    width: 45mm !important;
    height: 45mm !important;
    flex-shrink: 0 !important;
  }

  /* Keep header unbroken */
  .header {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    -webkit-column-break-inside: avoid !important;
  }

  /* Allow sections and items to split but never create new page */
  .section,
  .skill-item,
  .job,
  .education,
  .skills-grid,
  .job ul,
  .job li,
  .education ul,
  .education li {
    break-inside: auto !important;
    page-break-inside: auto !important;
    -webkit-column-break-inside: auto !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }

  p, li {
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
