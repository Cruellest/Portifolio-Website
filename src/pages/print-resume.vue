<template>
  <div id="curriculo-content" class="max-w-4xl mx-auto px-4 py-8 bg-white">
    <!-- Header -->
    <header class="mb-4">
      <div class="flex items-start gap-4 mb-3">
        <img 
          :src="personalData.profileImage" 
          :alt="`Profile Picture of ${personalData.fullName}`"
          class="w-24 h-24 rounded-full flex-shrink-0"
        />

        <!-- Personal Information -->
        <div class="mt-2">
          <h1 class="text-2xl font-bold text-gray-900">{{ personalData.fullName }}</h1>
          <h2 class="text-sm font-medium text-purple-600 mt-0.5">{{ personalData.title }}</h2>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-gray-600">
        <a 
          :href="`mailto:${personalData.email}`" 
          class="hover:text-purple-600 transition-colors duration-200"
        >
          <i class="bi bi-envelope-at inline-block icon"></i>
          {{ personalData.email }}
        </a>
        <a 
          :href="personalData.github" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="hover:text-purple-600 transition-colors duration-200"
        >
          <i class="bi bi-github inline-block icon"></i>
          {{ personalData.github.split('/').pop() }}
        </a>
        <span class="flex items-center">
          <i class="bi bi-telephone inline-block icon"></i>
          {{ personalData.phone }}
        </span>
        <a 
          :href="personalData.linkedin" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="hover:text-purple-600 transition-colors duration-200"
        >
          <i class="bi bi-linkedin inline-block icon"></i>
          {{ personalData.linkedin.split('/').pop() }}
        </a>
        <span class="flex items-center">
          <i class="bi bi-geo-alt inline-block icon"></i>
          {{ personalData.location }}
        </span>
      </div>
    </header>

    <hr class="custom-hr" />

    <!-- Summary Section -->
    <section class="mb-3">
      <h3 class="text-base font-bold border-purple-600 pb-1 mb-2">{{ sectionTitles.summary }}</h3>
      <p class="text-gray-700 leading-tight text-xs">
        {{ summaryData }}
      </p>
    </section>

    <hr class="custom-hr" />

    <!-- Skills Section -->
    <section class="mb-3">
      <h3 class="text-base font-bold border-purple-600 pb-1 mb-2">{{ sectionTitles.skills }}</h3>
      
      <div v-for="(skillCategory, index) in skillsData" :key="index" :class="{ 'mb-2': index < skillsData.length - 1 }">
        <h4 class="text-xs font-semibold text-gray-800 mb-2">{{ skillCategory.category }}</h4>
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="(skill, skillIndex) in skillCategory.skill_list" 
            :key="skillIndex"
            :class="[
              'text-[11px] font-medium px-2 py-0.5 rounded-full',
              skill.level === 'primary' ? 'bg-purple-100 text-purple-800' : 'bg-gray-200 text-gray-800'
            ]"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>
    </section>

    <hr class="custom-hr" />

    <!-- Experience Section -->
    <section class="mb-3">
      <h3 class="text-base font-bold border-purple-600 pb-1 mb-2">{{ sectionTitles.experience }}</h3>
      
      <div v-for="(job, index) in experienceData" :key="index" :class="{ 'mb-4': index < experienceData.length - 1 }">
        <h4 class="text-sm font-bold text-gray-900">{{ job.title }}</h4>
        <div class="flex justify-between items-center flex-wrap gap-2">
          <span class="text-xs font-semibold text-purple-700">{{ job.company }}</span>
          <span class="text-[11px] font-medium text-gray-600">{{ job.startDate }} – {{ job.endDate }}</span>
        </div>
        <p class="text-[11px] text-gray-500 mb-1">{{ job.location }}</p>
        <ul class="list-disc list-outside pl-4 space-y-0.5 text-gray-700 text-xs">
          <li v-for="(highlight, highlightIndex) in job.highlights" :key="highlightIndex">
            {{ highlight }}
          </li>
        </ul>
      </div>
    </section>

    <hr class="custom-hr" />
    
    <!-- Education Section -->
    <section>
      <h3 class="text-base font-bold border-purple-600 pb-1 mb-2">{{ sectionTitles.education }}</h3>

      <div v-for="(edu, index) in educationData" :key="index" :class="{ 'mb-3': index < educationData.length - 1 }">
        <h4 class="text-sm font-bold text-gray-900">{{ edu.degree }}</h4>
        <div class="flex justify-between items-center flex-wrap gap-2">
          <span class="text-xs font-semibold text-purple-700">{{ edu.institution }}</span>
          <span class="text-[11px] font-medium text-gray-600">{{ edu.startDate }} – {{ edu.endDate }}</span>
        </div>
        <p class="text-[11px] text-gray-500">{{ edu.location }}</p>
      </div>
    </section>
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
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#curriculo-content {
  margin-top: 0px;
  padding: 2rem 1rem;
}

header {
  margin-bottom: 1rem;
}

.icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.375rem;
  vertical-align: middle;
}

hr.custom-hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, #9333ea, #9333ea);
  margin: 1rem 0;
}

@media print {
  #curriculo-content {
    max-width: 100%;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none;
  }
  
  header {
    margin-bottom: 1rem !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid !important;
    break-after: avoid !important;
  }

  section {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
</style>
