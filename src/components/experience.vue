<template>
  <section class="container mx-auto max-w-screen-lg my-8 sm:my-12 px-4">
    <div class="card glass rounded-box p-6 sm:p-8 shadow">
      <div class="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl leading-tight sm:leading-snug text-primary font-bold break-words">
            {{ sectionTitles.experience || 'Experience' }}
          </h2>
          <p class="text-base-content/70 text-sm sm:text-base">
            {{ jobs.length }} {{ companiesLabel }} • {{ projects.length }} {{ projectsLabel }}
          </p>
        </div>
      </div>

      <!-- Jobs timeline -->
      <div class="mt-6">
        <!-- vertical (mobile) -> horizontal compacto em md+ -->
        <ul class="timeline timeline-vertical md:timeline-horizontal md:timeline-compact md:justify-center gap-6">
          <li v-for="(job, idx) in jobs" :key="idx">
            <div class="timeline-start text-xs sm:text-sm text-base-content/70 whitespace-normal sm:whitespace-nowrap">
              {{ job.startDate }} – {{ job.endDate }}
            </div>
            <div class="timeline-middle shrink-0">
              <span class="status status-primary status-sm"></span>
            </div>
            <div class="timeline-end mb-6 md:mb-0">
              <div class="card bg-base-100/80 border border-base-300 rounded-box shadow-sm w-full md:w-[22rem]">
                <div class="card-body gap-2">
                  <h3 class="card-title text-base sm:text-lg">
                    {{ job.title }}
                  </h3>
                  <!-- company and location on separate lines -->
                  <p class="text-sm text-base-content/80">
                    <span class="font-medium text-primary">{{ job.company }}</span>
                  </p>
                  <p class="text-xs sm:text-sm text-base-content/70">
                    {{ job.location }}
                  </p>
                  <ul class="list list-col-wrap text-sm text-base-content/80 gap-1">
                    <li class="list-row" v-for="(h, i) in job.highlights" :key="i">• {{ h }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Projects grid -->
      <div class="mt-8">
        <h3 class="text-xl sm:text-2xl font-semibold text-primary mb-4">
          {{ sectionTitles.projects || 'Projects' }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <div v-for="(p, i) in projects" :key="i" class="card bg-base-100/80 border border-base-300 rounded-box shadow-sm">
            <div class="card-body gap-3">
              <h4 class="card-title text-base sm:text-lg">{{ p.name }}</h4>
              <p class="text-sm text-base-content/80">{{ p.description }}</p>
              <div class="card-actions">
                <a
                  :href="p.link"
                  target="_blank"
                  rel="noopener"
                  class="btn btn-sm btn-outline text-primary border-primary hover:bg-primary hover:text-primary-content"
                  :title="p.link"
                >
                  Visit
                </a>
              </div>
            </div>
          </div>
          <div v-if="!projects.length" class="col-span-full alert alert-info">
            <span>No projects found.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getExperienceData, getSectionsData, getUiStrings } from '../controllers/json-data-controller'

type Job = {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  highlights?: string[]
}
type Project = { name: string; description: string; link: string }

const sectionTitles = computed(() => getSectionsData() as any)
const exp = computed(() => getExperienceData() as { jobs?: Job[]; projects?: Project[] } || {})
const jobs = computed<Job[]>(() => Array.isArray(exp.value?.jobs) ? exp.value.jobs as Job[] : [])
const projects = computed<Project[]>(() => Array.isArray(exp.value?.projects) ? exp.value.projects as Project[] : [])
const ui = computed(() => getUiStrings() as any)
const companiesLabel = computed<string>(() => ui.value?.experience?.companiesLabel || 'companies')
const projectsLabel = computed<string>(() => ui.value?.experience?.projectsLabel || 'projects')
</script>
