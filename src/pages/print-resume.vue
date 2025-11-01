<template>
  <div class="resume-container">
    <div class="resume-content">
      <!-- Header com foto e info -->
      <header class="header">
        <div class="header-content">
          <div class="profile-section">
            <img 
              :src="personalData.profileImage" 
              :alt="`Profile Picture of ${personalData.fullName}`"
              class="profile-photo"
            />
            <div class="header-text">
              <h1>{{ personalData.fullName }}</h1>
              <p class="title">{{ personalData.title }}</p>
              <div class="contact-info">
                <p>
                  <i class="bi bi-telephone-fill contact-icon" aria-hidden="true"></i>
                  <span class="sr-only">Telefone:</span>
                  {{ personalData.phone }}
                </p>
                <p>
                  <i class="bi bi-envelope-fill contact-icon" aria-hidden="true"></i>
                  <span class="sr-only">Email:</span>
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
                      skill.level === 'primary' ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-800'
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
            <div class="job" v-for="(job, index) in experienceData" :key="index">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect, nextTick } from 'vue'
import {
  getPersonalData,
  getSectionsData,
  getSummaryData,
  getSkillsData,
  getExperienceData,
  getEducationData
} from '../controllers/json-data-controller'
import router from '../router'

const isDataLoaded = ref(false)
const isImageLoaded = ref(false)

const personalData = computed(() => getPersonalData())
const sectionTitles = computed(() => getSectionsData())
const summaryData = computed(() => getSummaryData())
const skillsData = computed(() => getSkillsData())
const experienceData = computed(() => getExperienceData())
const educationData = computed(() => getEducationData())

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

/**
 * Automatically open the print dialog when the page loads
 * Redirects to home page when print dialog is closed
 */
onMounted(async () => {
  await nextTick()
  
  const profileImg = document.querySelector('img[alt*="Profile Picture"]')
  if (profileImg) {
    if (profileImg.complete) {
      isImageLoaded.value = true
      window.print()
    } else {
      profileImg.addEventListener('load', () => {
        isImageLoaded.value = true
        window.print()
      })
      
      profileImg.addEventListener('error', () => {
        window.print()
      })
    }
  } else {
    window.print()
  }

  window.addEventListener('afterprint', () => {
    router.push('/')
  })
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

<style>
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
  height: 297mm;
  margin: 0 auto;
  background: white;
  padding: 15mm;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.resume-content {
  display: flex;
  flex-direction: column;
  gap: 5mm;
}

.header {
  border-bottom: 2.5px solid #7c2d9f;
  padding-bottom: 6mm;
  page-break-inside: avoid;
  page-break-after: avoid;
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
  border: 3px solid #7c2d9f;
  flex-shrink: 0;
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #7c2d9f;
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
  color: #7c2d9f;
  text-decoration: none;
  overflow-wrap: anywhere; /* allow long URLs to wrap */
}

.contact-icon {
  color: #7c2d9f;
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
}

.section {
  margin-bottom: 5mm;
  page-break-inside: avoid;
}

.section h2 {
  font-size: 15px;
  font-weight: 700;
  color: #7c2d9f;
  margin-bottom: 3mm;
  border-bottom: 1.5px solid #ddd;
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
  background: #f9f5fb;
  padding: 3mm 4mm;
  border-radius: 3px;
  border-left: 3px solid #7c2d9f;
  page-break-inside: avoid;
}

.skill-item h4 {
  font-size: 11px;
  font-weight: 600;
  color: #7c2d9f;
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
  background: #e9d5ff !important;
  color: #6b21a8 !important;
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
  color: #7c2d9f;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.company {
  font-size: 11px;
  color: #7c2d9f;
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
    margin: 0;
    padding: 0;
    background: white;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .resume-container {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 15mm;
    background: white;
    box-shadow: none;
    page-break-after: always;
  }

  .header,
  .section,
  .job,
  .education,
  .skill-item {
    page-break-inside: avoid !important;
  }

  .content-grid {
    page-break-inside: avoid;
  }
}

@page {
  size: A4;
  margin: 0;
  padding: 0;
}
</style>
