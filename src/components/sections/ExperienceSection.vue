<template>
  <div class="container mx-auto max-w-5xl px-4 py-14 sm:py-20">
    <SectionHeading
      index="03"
      :title="store.sectionTitles.experience"
      :subtitle="`${jobs.length} ${ui.experience.companiesLabel} • ${projects.length} ${ui.experience.projectsLabel}`"
    />

    <Reveal>
      <div class="relative">
        <button
          v-if="showJobsControls && jobsCanPrev"
          class="btn btn-circle btn-ghost absolute left-1 top-1/2 z-10 hidden -translate-y-1/2 border border-base-300/70 bg-base-100/80 backdrop-blur-sm md:flex"
          :aria-label="ui.experience.prevJobsAria"
          @click="prevJobs"
        >
          <i class="bi bi-chevron-left" aria-hidden="true"></i>
        </button>
        <button
          v-if="showJobsControls && jobsCanNext"
          class="btn btn-circle btn-ghost absolute right-1 top-1/2 z-10 hidden -translate-y-1/2 border border-base-300/70 bg-base-100/80 backdrop-blur-sm md:flex"
          :aria-label="ui.experience.nextJobsAria"
          @click="nextJobs"
        >
          <i class="bi bi-chevron-right" aria-hidden="true"></i>
        </button>

        <div
          ref="jobsCarousel"
          class="hidden snap-x snap-mandatory touch-pan-x overflow-x-auto scroll-smooth md:block"
          tabindex="0"
          @scroll.passive="updateJobsArrows"
          @keydown.left.prevent="prevJobs"
          @keydown.right.prevent="nextJobs"
        >
          <ul
            class="timeline timeline-vertical gap-6 pr-2 md:timeline-horizontal md:timeline-compact md:justify-start"
          >
            <li v-for="(job, index) in jobs" :key="index" class="shrink-0 snap-start">
              <div class="timeline-start text-xs text-base-content/60 sm:text-sm">
                {{ job.startDate }} – {{ job.endDate }}
              </div>
              <div class="timeline-middle shrink-0">
                <span class="status status-primary status-sm"></span>
              </div>
              <div class="timeline-end mb-6 md:mb-0">
                <JobCard :job="job" :show-date="false" class="w-full md:w-[24rem]" />
              </div>
            </li>
          </ul>
        </div>

        <div class="md:hidden">
          <div
            class="snap-x snap-mandatory touch-pan-x overflow-x-auto scroll-smooth overscroll-x-contain"
          >
            <div class="flex">
              <div
                v-for="(job, index) in jobs"
                :key="`mobile-${index}`"
                class="w-full min-w-full shrink-0 snap-center snap-always px-0.5"
              >
                <JobCard :job="job" mobile-full-height />
              </div>
            </div>
          </div>
          <p class="mt-3 text-center text-xs text-base-content/50">
            {{ ui.experience.mobileSwipeHint }}
          </p>
        </div>
      </div>
    </Reveal>

    <!-- Projects -->
    <div class="mt-14">
      <Reveal>
        <h3 class="mb-6 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
          {{ store.sectionTitles.projects }}
        </h3>
      </Reveal>

      <!-- Mobile: swipe carousel -->
      <div v-if="projects.length" class="md:hidden">
        <div class="snap-x snap-mandatory touch-pan-x overflow-x-auto scroll-smooth">
          <div class="flex">
            <div
              v-for="(project, index) in projects"
              :key="index"
              class="w-full min-w-full shrink-0 snap-center px-0.5"
            >
              <ProjectCard :project="project" mobile-full-height />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="projects.length"
        class="hidden gap-4 sm:gap-5 md:grid md:grid-cols-2 xl:grid-cols-3"
      >
        <Reveal v-for="(project, index) in projects" :key="index" :delay="0.06 * index">
          <ProjectCard :project="project" class="h-full" />
        </Reveal>
      </div>

      <div v-else class="alert alert-info">
        <span>{{ ui.projects.emptyState }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePortfolioStore } from '../../stores/portfolio'
import JobCard from './JobCard.vue'
import ProjectCard from './ProjectCard.vue'
import Reveal from '../ui/Reveal.vue'
import SectionHeading from '../ui/SectionHeading.vue'

const store = usePortfolioStore()
const ui = computed(() => store.ui)

const jobs = computed(() => store.experience.jobs)
const projects = computed(() => store.experience.projects)

const jobsCarousel = ref<HTMLDivElement | null>(null)
const showJobsControls = ref(false)
const jobsCanPrev = ref(false)
const jobsCanNext = ref(false)

const scrollJobsBy = (direction: 'next' | 'prev') => {
  const el = jobsCarousel.value
  if (!el) return
  const amount = Math.round(el.clientWidth * 0.9)
  el.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
}
const nextJobs = () => scrollJobsBy('next')
const prevJobs = () => scrollJobsBy('prev')

const updateJobsArrows = () => {
  const el = jobsCarousel.value
  if (!el) {
    jobsCanPrev.value = false
    jobsCanNext.value = false
    return
  }
  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
  jobsCanPrev.value = el.scrollLeft > 1
  jobsCanNext.value = el.scrollLeft < maxScroll - 1
}

const computeJobsOverflow = () => {
  const el = jobsCarousel.value
  showJobsControls.value = !!el && el.scrollWidth > el.clientWidth + 1
  updateJobsArrows()
}

const resetJobsCarousel = () => {
  jobsCarousel.value?.scrollTo({ left: 0, behavior: 'auto' })
  computeJobsOverflow()
}

onMounted(async () => {
  await nextTick()
  resetJobsCarousel()
  window.addEventListener('resize', computeJobsOverflow)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', computeJobsOverflow)
})

watch(jobs, () => void nextTick().then(resetJobsCarousel))
</script>
