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

      <!-- Jobs timeline com carrossel quando overflow -->
      <div class="mt-6 relative">
        <!-- setas (desktop) posicionadas individualmente e apenas quando necessário -->
        <button
          v-if="showJobsControls && jobsCanPrev"
          class="hidden md:flex btn btn-circle btn-ghost absolute left-2 top-1/2 -translate-y-1/2 z-10"
          aria-label="Previous jobs"
          @click="prevJobs"
        >❮</button>
        <button
          v-if="showJobsControls && jobsCanNext"
          class="hidden md:flex btn btn-circle btn-ghost absolute right-2 top-1/2 -translate-y-1/2 z-10"
          aria-label="Next jobs"
          @click="nextJobs"
        >❯</button>

        <!-- scroller horizontal (desktop) -->
        <div
          ref="jobsCarousel"
          class="hidden md:block overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x"
          tabindex="0"
          @scroll.passive="onJobsScroll"
          @keydown.left.prevent="prevJobs"
          @keydown.right.prevent="nextJobs"
        >
          <!-- vertical (mobile) -> horizontal compacto em md+ -->
          <ul class="timeline timeline-vertical md:timeline-horizontal md:timeline-compact md:justify-start gap-6 pr-2">
            <li v-for="(job, idx) in jobs" :key="idx" class="snap-start shrink-0">
              <div class="timeline-start text-xs sm:text-sm text-base-content/70 whitespace-normal sm:whitespace-nowrap">
                {{ job.startDate }} – {{ job.endDate }}
              </div>
              <div class="timeline-middle shrink-0">
                <span class="status status-primary status-sm"></span>
              </div>
              <div class="timeline-end mb-6 md:mb-0">
                <div class="card bg-base-100/80 border border-base-300 rounded-box shadow-sm w-full md:w-[22rem]">
                  <div class="card-body gap-2">
                    <!-- Mobile-only date inside the card -->
                    <div class="text-xs text-base-content/60 md:hidden">
                      {{ job.startDate }} – {{ job.endDate }}
                    </div>
                    <h3 class="card-title text-base sm:text-lg">
                      {{ job.title }}
                    </h3>
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

        <!-- Mobile: cards em carrossel (um por slide, sem swap) -->
        <div class="md:hidden">
          <div
            class="overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x overscroll-x-contain"
            tabindex="0"
          >
            <div class="flex gap-0">
              <div
                v-for="(job, idx) in jobs"
                :key="'m-'+idx"
                class="snap-center snap-always shrink-0 w-full min-w-full max-w-full"
              >
                <div class="card bg-base-100/80 border border-base-300 rounded-box shadow-lg w-full h-[75dvh] min-h-[75dvh] max-h-[75dvh]">
                  <div class="card-body h-full flex flex-col justify-between gap-3">
                    <div class="space-y-1">
                      <div class="text-xs text-base-content/60">
                        {{ job.startDate }} – {{ job.endDate }}
                      </div>
                      <h3 class="card-title text-lg">
                        {{ job.title }}
                      </h3>
                      <p class="text-sm text-base-content/80">
                        <span class="font-medium text-primary">{{ job.company }}</span>
                      </p>
                      <p class="text-xs text-base-content/70">
                        {{ job.location }}
                      </p>
                    </div>
                    <!-- Detalhes dentro do mesmo card (rolagem se necessário) -->
                    <div class="grow overflow-y-auto pr-1 mt-2">
                      <ul class="list list-col-wrap text-sm text-base-content/80 gap-1">
                        <li class="list-row" v-for="(h, i) in job.highlights" :key="i">• {{ h }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects -->
      <div class="mt-8">
        <h3 class="text-xl sm:text-2xl font-semibold text-primary mb-4">
          {{ sectionTitles.projects || 'Projects' }}
        </h3>

        <!-- Mobile: carrossel com swipe -->
        <div v-if="projects.length" class="relative md:hidden">
          <div
            ref="projectsCarousel"
            class="overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x"
            tabindex="0"
          >
            <div class="flex gap-0">
              <div
                v-for="(p, i) in projects"
                :key="i"
                class="snap-center shrink-0 w-full min-w-full max-w-full"
              >
                <div class="card bg-base-100/80 border border-base-300 rounded-box shadow-sm w-full h-[65dvh] min-h-[65dvh] max-h-[65dvh]">
                  <div class="card-body h-full flex flex-col justify-between gap-3">
                    <div class="space-y-1">
                      <h4 class="card-title text-base sm:text-lg">{{ p.name }}</h4>
                      <div class="grow overflow-y-auto pr-1">
                        <p class="text-sm text-base-content/80">{{ p.description }}</p>
                      </div>
                    </div>
                    <div class="card-actions pt-2">
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
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop: layout antigo em grid -->
        <div v-if="projects.length" class="hidden md:block">
          <div class="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
          </div>
        </div>

        <div v-else class="mt-6 alert alert-info">
          <span>No projects found.</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
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


// scroller e controles (jobs) - desktop
const jobsCarousel = ref<HTMLDivElement | null>(null)
const showJobsControls = ref(false)
const jobsCanPrev = ref(false)
const jobsCanNext = ref(false)

const scrollByAmount = (el: HTMLDivElement | null, dir: 'next' | 'prev') => {
  if (!el) return
  const amount = Math.round(el.clientWidth * 0.9)
  el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' })
}
const nextJobs = () => scrollByAmount(jobsCarousel.value, 'next')
const prevJobs = () => scrollByAmount(jobsCarousel.value, 'prev')
const updateJobsArrows = () => {
  const el = jobsCarousel.value
  if (!el) { jobsCanPrev.value = false; jobsCanNext.value = false; return }
  const max = Math.max(0, el.scrollWidth - el.clientWidth)
  const left = el.scrollLeft
  jobsCanPrev.value = left > 1
  jobsCanNext.value = left < (max - 1)
}
const computeJobsOverflow = () => {
  const el = jobsCarousel.value
  showJobsControls.value = !!el && el.scrollWidth > el.clientWidth + 1
  updateJobsArrows()
}
const onJobsScroll = () => updateJobsArrows()
const ensureJobsAtStart = () => {
  const el = jobsCarousel.value
  if (!el) return
  el.scrollTo({ left: 0, behavior: 'auto' })
  updateJobsArrows()
}

// handler estável de resize para desktop
const handleResize = () => {
  computeJobsOverflow()
}

onMounted(async () => {
  await nextTick()
  computeJobsOverflow()
  ensureJobsAtStart()

  jobsCarousel.value?.addEventListener('scroll', onJobsScroll, { passive: true })
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  jobsCarousel.value?.removeEventListener('scroll', onJobsScroll)
  window.removeEventListener('resize', handleResize)
})
watch(jobs, () => nextTick().then(() => {
  computeJobsOverflow()
  ensureJobsAtStart()
}))
</script>
